-- ============================================================================
-- Palqueate · 0007 · Carrito, holds y disponibilidad de butacas
-- ----------------------------------------------------------------------------
-- El carrito vive en el servidor (API §4). Agregar un ítem crea un HOLD: una
-- reserva temporal de asientos con TTL. La pieza central anti-doble-venta es
-- `seat_reservations`: la tabla de bloqueos VIVOS (holds activos + ventas
-- confirmadas). Un índice único parcial por ámbito (temporada/función) impone,
-- de forma ATÓMICA, que un asiento tenga a lo sumo un bloqueo: dos checkouts o
-- dos "agregar al carrito" concurrentes sobre el mismo asiento → uno falla (409).
--
-- Ámbitos de ocupación (RN-11), independientes por modalidad:
--   · palcoYear  → palco entero por TEMPORADA (sin asiento puntual).
--   · seatYear   → butaca por TEMPORADA.
--   · seatEvent  → butaca por FUNCIÓN (event_occurrence).
-- ============================================================================

BEGIN;
SET search_path = palqueate, public;

-- --- Carrito ----------------------------------------------------------------
CREATE TABLE carts (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        REFERENCES users(id) ON DELETE CASCADE,
  session_id  uuid        REFERENCES sessions(id) ON DELETE CASCADE,
  status      text        NOT NULL DEFAULT 'open'
                CHECK (status IN ('open', 'checked_out', 'abandoned')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);
COMMENT ON TABLE carts IS 'Carrito del servidor, atado al usuario o a la sesión anónima (API §4).';
-- Un único carrito abierto por usuario y por sesión.
CREATE UNIQUE INDEX uq_carts_open_user ON carts (user_id) WHERE status = 'open' AND user_id IS NOT NULL;
CREATE UNIQUE INDEX uq_carts_open_session ON carts (session_id) WHERE status = 'open' AND user_id IS NULL;
CREATE TRIGGER trg_carts_updated
  BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION palqueate.set_updated_at();

-- --- Ítems del carrito ------------------------------------------------------
-- El id de la fila es el `uid` que expone la API (DELETE /cart/items/{uid}).
CREATE TABLE cart_items (
  id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id       uuid         NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  palco_id      uuid         NOT NULL REFERENCES palcos(id),
  mode          palco_mode   NOT NULL,
  season_id     uuid         REFERENCES seasons(id),            -- modos anuales
  event_id      uuid         REFERENCES events(id),             -- sólo seatEvent
  occurrence_id uuid         REFERENCES event_occurrences(id),  -- sólo seatEvent
  term          text         NOT NULL DEFAULT '',               -- etiqueta de período (display)
  qty           integer      NOT NULL CHECK (qty >= 1),
  unit_price    money_amount NOT NULL,            -- snapshot p/ mostrar; checkout recalcula
  created_at    timestamptz  NOT NULL DEFAULT now(),
  -- seatEvent exige función; los modos anuales exigen temporada.
  CHECK ( (mode = 'seatEvent' AND occurrence_id IS NOT NULL AND event_id IS NOT NULL)
       OR (mode IN ('palcoYear','seatYear') AND season_id IS NOT NULL) )
);
COMMENT ON TABLE cart_items IS 'Líneas del carrito. id = uid expuesto por la API.';
CREATE INDEX ix_cart_items_cart ON cart_items (cart_id);
CREATE INDEX ix_cart_items_palco ON cart_items (palco_id);

-- --- Holds (reservas temporales) --------------------------------------------
CREATE TABLE holds (
  id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_item_id  uuid         UNIQUE REFERENCES cart_items(id) ON DELETE CASCADE, -- 1:1 con el ítem
  user_id       uuid         REFERENCES users(id) ON DELETE CASCADE,
  palco_id      uuid         NOT NULL REFERENCES palcos(id),
  mode          palco_mode   NOT NULL,
  season_id     uuid         REFERENCES seasons(id),
  event_id      uuid         REFERENCES events(id),
  occurrence_id uuid         REFERENCES event_occurrences(id),
  status        hold_status  NOT NULL DEFAULT 'active',
  created_at    timestamptz  NOT NULL DEFAULT now(),
  expires_at    timestamptz  NOT NULL,             -- created_at + TTL (platform_config)
  consumed_at   timestamptz,                        -- al hacer checkout
  released_at   timestamptz                         -- al quitar del carrito / vencer
);
COMMENT ON TABLE holds IS 'Reserva temporal de asientos con TTL; historial completo de su ciclo (API §4).';
CREATE INDEX ix_holds_user ON holds (user_id);
CREATE INDEX ix_holds_active_expiry ON holds (expires_at) WHERE status = 'active';

-- --- Bloqueos vivos de butacas (anti-doble-venta) ---------------------------
-- Una fila por butaca bloqueada: 'held' (hold activo) o 'sold' (venta
-- confirmada). Al liberar/vencer un hold, su fila se ELIMINA (el historial
-- queda en holds). Al confirmar el checkout, pasa a 'sold'. Los índices únicos
-- parciales por ámbito garantizan a lo sumo un bloqueo por asiento.
CREATE TABLE seat_reservations (
  id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  palco_id      uuid         NOT NULL REFERENCES palcos(id),
  mode          palco_mode   NOT NULL,
  season_id     uuid         REFERENCES seasons(id),
  occurrence_id uuid         REFERENCES event_occurrences(id),
  seat_number   integer,                            -- NULL en palcoYear (palco entero)
  state         text         NOT NULL CHECK (state IN ('held', 'sold')),
  hold_id       uuid         REFERENCES holds(id) ON DELETE CASCADE,
  order_item_id uuid,                               -- FK a order_items (se agrega en 0008)
  user_id       uuid         REFERENCES users(id),
  created_at    timestamptz  NOT NULL DEFAULT now(),
  expires_at    timestamptz,                        -- sólo cuando state='held'
  -- Coherencia ámbito/modalidad
  CHECK ( (mode = 'seatEvent'  AND occurrence_id IS NOT NULL AND seat_number IS NOT NULL)
       OR (mode = 'seatYear'   AND season_id IS NOT NULL     AND seat_number IS NOT NULL)
       OR (mode = 'palcoYear'  AND season_id IS NOT NULL     AND seat_number IS NULL) ),
  CHECK ( (state = 'held' AND hold_id IS NOT NULL)
       OR (state = 'sold' AND order_item_id IS NOT NULL) )
);
COMMENT ON TABLE seat_reservations IS 'Bloqueos vivos de butacas (held/sold). Núcleo anti-doble-venta (API §4).';
CREATE INDEX ix_seat_res_hold ON seat_reservations (hold_id) WHERE hold_id IS NOT NULL;
CREATE INDEX ix_seat_res_held_expiry ON seat_reservations (expires_at) WHERE state = 'held';

-- Unicidad atómica por ámbito: a lo sumo UN bloqueo (held o sold) por asiento.
CREATE UNIQUE INDEX uq_seat_res_seatevent
  ON seat_reservations (palco_id, occurrence_id, seat_number) WHERE mode = 'seatEvent';
CREATE UNIQUE INDEX uq_seat_res_seatyear
  ON seat_reservations (palco_id, season_id, seat_number) WHERE mode = 'seatYear';
CREATE UNIQUE INDEX uq_seat_res_palcoyear
  ON seat_reservations (palco_id, season_id) WHERE mode = 'palcoYear';

COMMIT;
