-- ============================================================================
-- Palqueate · 0009 · Interacción, métricas y notificaciones
-- ----------------------------------------------------------------------------
-- Insumos de las estadísticas del palquista y del dashboard admin que NO se
-- derivan sólo de las órdenes: vistas a publicaciones (para visitas/conversión,
-- RF-39), favoritos, calificaciones de clientes (origen del rating del palco) y
-- la bandeja de notificaciones (RF-32, y el aviso al palquista de RF-40/API §22,
-- modelada como outbox porque el envío real está fuera de alcance — §8).
-- ============================================================================

BEGIN;
SET search_path = palqueate, public;

-- --- Vistas a publicaciones -------------------------------------------------
-- Log de visitas a un palco. Base de "visitas" y "conversión" (RF-39). Es un
-- log de alto volumen: se consulta agregado, por eso va indexado por palco+fecha.
CREATE TABLE palco_view_events (
  id          bigint       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  palco_id    uuid         NOT NULL REFERENCES palcos(id) ON DELETE CASCADE,
  user_id     uuid         REFERENCES users(id) ON DELETE SET NULL,
  session_id  uuid         REFERENCES sessions(id) ON DELETE SET NULL,
  source      text,                                 -- 'catalog' | 'event' | 'direct'
  viewed_at   timestamptz  NOT NULL DEFAULT now()
);
COMMENT ON TABLE palco_view_events IS 'Visitas a publicaciones de palco; insumo de visitas y conversión (RF-39).';
CREATE INDEX ix_palco_views_palco_day ON palco_view_events (palco_id, viewed_at);

-- --- Favoritos --------------------------------------------------------------
CREATE TABLE palco_favorites (
  user_id     uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  palco_id    uuid        NOT NULL REFERENCES palcos(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, palco_id)
);
COMMENT ON TABLE palco_favorites IS 'Palcos marcados como favoritos (métrica "favs" del palquista, RF-39).';
CREATE INDEX ix_palco_favorites_palco ON palco_favorites (palco_id);

-- --- Calificaciones ---------------------------------------------------------
-- Calificación del cliente tras usar el palco. Es el ORIGEN del rating mostrado
-- (palcos.rating se recalcula como promedio). Una calificación por orden+palco.
CREATE TABLE palco_ratings (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  palco_id    uuid        NOT NULL REFERENCES palcos(id) ON DELETE CASCADE,
  user_id     uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id    uuid        REFERENCES orders(id) ON DELETE SET NULL,
  score       numeric(2,1) NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment     text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (palco_id, user_id, order_id)
);
COMMENT ON TABLE palco_ratings IS 'Calificaciones de clientes; promedio = palcos.rating.';
CREATE INDEX ix_palco_ratings_palco ON palco_ratings (palco_id);

-- --- Notificaciones (outbox) ------------------------------------------------
CREATE TYPE notification_status AS ENUM
  ('queued', 'sent', 'failed', 'read', 'suppressed');

CREATE TABLE notifications (
  id            uuid                 PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid                 NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel       notification_channel NOT NULL,
  type          text                 NOT NULL,      -- 'palco.reviewed' | 'order.confirmed'...
  title         text                 NOT NULL,
  body          text,
  -- Entidad relacionada para deep-link (no FK fija: puede apuntar a varias tablas).
  entity        text,                                -- 'palco' | 'order' | 'event'...
  entity_id     uuid,
  status        notification_status  NOT NULL DEFAULT 'queued',
  created_at    timestamptz          NOT NULL DEFAULT now(),
  sent_at       timestamptz,
  read_at       timestamptz
);
COMMENT ON TABLE notifications IS 'Bandeja/outbox de notificaciones. Respeta preferencias (RF-32). Envío real fuera de alcance (§8).';
CREATE INDEX ix_notifications_user ON notifications (user_id, created_at DESC);
CREATE INDEX ix_notifications_pending ON notifications (status) WHERE status = 'queued';

COMMIT;
