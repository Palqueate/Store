-- ============================================================================
-- Palqueate · 0008 · Órdenes, pagos y payouts
-- ----------------------------------------------------------------------------
-- La reserva pagada (Order). El checkout (API §23) consume los holds, calcula
-- subtotal + comisión (RN-01) + total y crea la orden con sus ítems. Cada ítem
-- guarda SNAPSHOTS (título del palco, etiqueta de evento, precio) para que la
-- reserva sea un registro inmutable aunque el palco o el evento cambien luego.
-- Se modela además el pago (hoy simulado) y el payout al palquista (RN-02),
-- desglosado por palco/dueño porque una orden puede tocar varios palcos.
-- ============================================================================

BEGIN;
SET search_path = palqueate, public;

-- --- Órdenes ----------------------------------------------------------------
CREATE TABLE orders (
  id              uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  code            text         NOT NULL UNIQUE,     -- "PLQ-ME02" (código de acceso/QR)
  user_id         uuid         NOT NULL REFERENCES users(id),
  status          order_status NOT NULL DEFAULT 'paid',
  subtotal        money_amount NOT NULL,
  fee             money_amount NOT NULL,            -- comisión (RN-01)
  total           money_amount NOT NULL,            -- subtotal + fee
  commission_rate ratio        NOT NULL,            -- tasa aplicada (snapshot, RNF-17)
  currency        currency_code NOT NULL DEFAULT 'UYU' REFERENCES currencies(code),
  contact_name    text         NOT NULL,
  contact_email   email        NOT NULL,
  pay_method      pay_method   NOT NULL DEFAULT 'card',
  food_total      money_amount NOT NULL DEFAULT 0,  -- acumulado de botana (API §24)
  idempotency_key text,                              -- evita doble cobro (API §23)
  placed_at       timestamptz  NOT NULL DEFAULT now(),
  created_at      timestamptz  NOT NULL DEFAULT now(),
  updated_at      timestamptz  NOT NULL DEFAULT now(),
  CHECK (total = subtotal + fee)
);
COMMENT ON TABLE orders IS 'Reservas pagadas (RD-06). Generadas por el checkout (API §23).';
COMMENT ON COLUMN orders.code IS 'Código único de reserva mostrado al cliente y en el QR (RF-23).';
CREATE INDEX ix_orders_user ON orders (user_id, placed_at DESC);
CREATE INDEX ix_orders_placed ON orders (placed_at);
CREATE TRIGGER trg_orders_updated
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION palqueate.set_updated_at();

-- --- Ítems de la orden ------------------------------------------------------
CREATE TABLE order_items (
  id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),  -- uid expuesto
  order_id      uuid         NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  palco_id      uuid         NOT NULL REFERENCES palcos(id),
  palco_title   text         NOT NULL,             -- snapshot
  stadium_id    uuid         REFERENCES stadiums(id),
  mode          palco_mode   NOT NULL,
  mode_label    text         NOT NULL,             -- "Asiento anual · 1 año" (snapshot)
  season_id     uuid         REFERENCES seasons(id),
  event_id      uuid         REFERENCES events(id),
  occurrence_id uuid         REFERENCES event_occurrences(id),
  event_label   text,                               -- snapshot ("Torneo Apertura · Fecha 7")
  event_opp     text,                               -- snapshot (rival/artista)
  term          text         NOT NULL DEFAULT '',  -- snapshot del período
  qty           integer      NOT NULL CHECK (qty >= 1),
  unit_price    money_amount NOT NULL,             -- precio congelado al pagar
  line_total    money_amount NOT NULL,             -- unit_price * qty
  created_at    timestamptz  NOT NULL DEFAULT now()
);
COMMENT ON TABLE order_items IS 'Líneas de la reserva con snapshots inmutables (RD-06).';
CREATE INDEX ix_order_items_order ON order_items (order_id);
CREATE INDEX ix_order_items_palco ON order_items (palco_id);
CREATE INDEX ix_order_items_occurrence ON order_items (occurrence_id);

-- Cierre del FK pendiente de seat_reservations.order_item_id (0007).
ALTER TABLE seat_reservations
  ADD CONSTRAINT fk_seat_res_order_item
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE;

-- --- Butacas vendidas por ítem ----------------------------------------------
CREATE TABLE order_item_seats (
  order_item_id uuid     NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  seat_number   integer  NOT NULL,
  PRIMARY KEY (order_item_id, seat_number)
);
COMMENT ON TABLE order_item_seats IS 'Butacas concretas vendidas en un ítem (vacío en palcoYear).';

-- --- Botana de la orden -----------------------------------------------------
CREATE TABLE order_food_items (
  id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      uuid         NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  food_item_id  uuid         REFERENCES food_items(id),  -- NULL si el ítem se dio de baja
  name          text         NOT NULL,             -- snapshot
  qty           integer      NOT NULL CHECK (qty >= 1),
  unit_price    money_amount NOT NULL,             -- snapshot
  created_at    timestamptz  NOT NULL DEFAULT now()
);
COMMENT ON TABLE order_food_items IS 'Pedido de botana asociado a la reserva (RF-27, RD-06).';
CREATE INDEX ix_order_food_order ON order_food_items (order_id);

-- --- Pagos ------------------------------------------------------------------
-- Hoy el pago es SIMULADO (REQUERIMIENTOS §2.2). El modelo ya soporta el ciclo
-- real (autorización/captura/reembolso) para cuando se integre la pasarela.
CREATE TABLE payments (
  id           uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     uuid         NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  method       pay_method   NOT NULL,
  amount       money_amount NOT NULL,
  currency     currency_code NOT NULL DEFAULT 'UYU' REFERENCES currencies(code),
  status       text         NOT NULL DEFAULT 'simulated'
                 CHECK (status IN ('simulated', 'authorized', 'captured', 'failed', 'refunded')),
  gateway_ref  text,                                -- referencia externa (sin datos de tarjeta)
  card_brand   text,                                -- sólo brand
  card_last4   char(4),                             -- sólo last4; nunca PAN/CVV (API §5.4)
  created_at   timestamptz  NOT NULL DEFAULT now(),
  updated_at   timestamptz  NOT NULL DEFAULT now()
);
COMMENT ON TABLE payments IS 'Pago de la orden. Hoy simulado; preparado para pasarela real (RI-06).';
CREATE INDEX ix_payments_order ON payments (order_id);
CREATE TRIGGER trg_payments_updated
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION palqueate.set_updated_at();

-- --- Payouts al palquista ---------------------------------------------------
-- payout = subtotal del palco − comisión (RN-02). Se desglosa por palco/dueño
-- porque una orden puede incluir ítems de distintos palcos/palquistas.
CREATE TABLE payouts (
  id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          uuid          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  palco_id          uuid          NOT NULL REFERENCES palcos(id),
  owner_id          uuid          REFERENCES users(id),
  gross_amount      money_amount  NOT NULL,         -- subtotal correspondiente al palco
  commission_amount money_amount  NOT NULL,         -- comisión retenida
  net_amount        money_amount  NOT NULL,         -- a transferir al palquista
  currency          currency_code NOT NULL DEFAULT 'UYU' REFERENCES currencies(code),
  status            payout_status NOT NULL DEFAULT 'pending',
  scheduled_at      timestamptz,
  paid_at           timestamptz,
  created_at        timestamptz   NOT NULL DEFAULT now(),
  updated_at        timestamptz   NOT NULL DEFAULT now(),
  CHECK (net_amount = gross_amount - commission_amount),
  UNIQUE (order_id, palco_id)
);
COMMENT ON TABLE payouts IS 'Liquidación al palquista por reserva (RN-02). La botana se contabiliza aparte.';
CREATE INDEX ix_payouts_owner ON payouts (owner_id, status);
CREATE TRIGGER trg_payouts_updated
  BEFORE UPDATE ON payouts
  FOR EACH ROW EXECUTE FUNCTION palqueate.set_updated_at();

-- --- Claves de idempotencia -------------------------------------------------
CREATE TABLE idempotency_keys (
  key          text         PRIMARY KEY,
  user_id      uuid         REFERENCES users(id) ON DELETE CASCADE,
  endpoint     text         NOT NULL,               -- "POST /orders"
  request_hash bytea,                                -- hash del body para detectar reuse divergente
  order_id     uuid         REFERENCES orders(id),  -- resultado asociado
  created_at   timestamptz  NOT NULL DEFAULT now(),
  expires_at   timestamptz  NOT NULL DEFAULT (now() + interval '24 hours')
);
COMMENT ON TABLE idempotency_keys IS 'Idempotencia del checkout: evita doble cobro si el botón se reenvía (API §23).';

COMMIT;
