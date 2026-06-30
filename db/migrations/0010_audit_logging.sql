-- ============================================================================
-- Palqueate · 0010 · Trazabilidad: acceso, auditoría y seguridad
-- ----------------------------------------------------------------------------
-- Los tres flujos de logging de API_ENDPOINTS §5, en el esquema `audit` porque
-- tienen volumen, retención y permisos distintos del negocio:
--   5.1 access_log    — una entrada por request HTTP (alto volumen). Particionada
--                       por mes para poder rotar/expirar (retención 30d).
--   5.2 audit_log     — una entrada por mutación de dominio (quién hizo qué).
--   5.3 security_log  — eventos sensibles (login_failed, forbidden, hold_conflict).
-- Los campos sensibles NUNCA se guardan en claro (§5.4): los payloads van
-- saneados/enmascarados desde la aplicación; aquí sólo se documenta la regla.
-- ============================================================================

BEGIN;

-- --- Tipos compartidos ------------------------------------------------------
CREATE TYPE audit.actor_role AS ENUM ('guest', 'user', 'admin');
CREATE TYPE audit.audit_entity AS ENUM
  ('order', 'palco', 'event', 'stadium', 'account', 'hold', 'cart');
CREATE TYPE audit.audit_result AS ENUM ('ok', 'rejected');
CREATE TYPE audit.security_event AS ENUM
  ('login_success', 'login_failed', 'forbidden', 'rate_limited', 'payment_attempt', 'hold_conflict');

-- Catálogo de acciones auditadas (verbos de dominio, API §5.2). Tabla en vez de
-- enum para poder agregar acciones sin migración de tipo.
CREATE TABLE audit.audit_actions (
  action      text PRIMARY KEY,
  entity      audit.audit_entity NOT NULL,
  description text NOT NULL DEFAULT ''
);
INSERT INTO audit.audit_actions (action, entity, description) VALUES
  ('account.register',      'account', 'Alta de cuenta'),
  ('account.login',         'account', 'Inicio de sesión'),
  ('account.update',        'account', 'Edición de perfil/preferencias'),
  ('cart.add',              'cart',    'Agregar ítem al carrito'),
  ('cart.remove',           'cart',    'Quitar ítem del carrito'),
  ('hold.create',           'hold',    'Crear reserva temporal'),
  ('hold.release',          'hold',    'Liberar reserva temporal'),
  ('hold.expire',           'hold',    'Vencimiento de reserva temporal'),
  ('order.checkout',        'order',   'Checkout / pago'),
  ('order.add_food',        'order',   'Agregar botana a la reserva'),
  ('palco.publish',         'palco',   'Publicar palco nuevo'),
  ('palco.update',          'palco',   'Editar palco'),
  ('palco.status_change',   'palco',   'Pausar/reactivar palco'),
  ('palco.resubmit',        'palco',   'Reenviar palco a revisión'),
  ('palco.review_approve',  'palco',   'Aprobar palco'),
  ('palco.review_reject',   'palco',   'Rechazar palco'),
  ('event.create',          'event',   'Crear evento'),
  ('event.update',          'event',   'Editar evento'),
  ('stadium.create',        'stadium', 'Crear estadio'),
  ('stadium.update',        'stadium', 'Editar estadio');

-- --- 5.1 Log de acceso (particionado por mes) -------------------------------
CREATE TABLE audit.access_log (
  id          bigint      GENERATED ALWAYS AS IDENTITY,
  request_id  uuid        NOT NULL,                 -- correlación request/response
  ts          timestamptz NOT NULL DEFAULT now(),   -- con ms
  method      text        NOT NULL,
  path        text        NOT NULL,                 -- "/palcos/px123"
  route       text,                                  -- patrón "/palcos/{id}" (agregaciones)
  query       jsonb,                                 -- saneado
  status      integer     NOT NULL,
  latency_ms  integer,
  req_bytes   integer,
  res_bytes   integer,
  user_id     uuid,                                  -- null si anónimo
  session_id  uuid,
  role        audit.actor_role NOT NULL DEFAULT 'guest',
  ip          inet,                                  -- último octeto puede anonimizarse
  user_agent  text,
  referer     text,
  api_version text        NOT NULL DEFAULT 'v1',
  PRIMARY KEY (id, ts)
) PARTITION BY RANGE (ts);
COMMENT ON TABLE audit.access_log IS 'Una entrada por request HTTP (API §5.1). Particionada por mes; retención 30d.';
CREATE INDEX ix_access_log_route_ts ON audit.access_log (route, ts);
CREATE INDEX ix_access_log_user_ts ON audit.access_log (user_id, ts);
CREATE INDEX ix_access_log_request ON audit.access_log (request_id);

-- Particiones iniciales + default (el job de mantenimiento crea las siguientes).
CREATE TABLE audit.access_log_2026_06 PARTITION OF audit.access_log
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
CREATE TABLE audit.access_log_2026_07 PARTITION OF audit.access_log
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE audit.access_log_default PARTITION OF audit.access_log DEFAULT;

-- --- 5.2 Log de auditoría de dominio ----------------------------------------
CREATE TABLE audit.audit_log (
  id          bigint             GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  audit_id    uuid               NOT NULL DEFAULT gen_random_uuid(),
  request_id  uuid,                                  -- enlaza con access_log
  ts          timestamptz        NOT NULL DEFAULT now(),
  actor_id    uuid,                                  -- usuario que ejecuta
  actor_role  audit.actor_role   NOT NULL DEFAULT 'user',
  action      text               NOT NULL REFERENCES audit.audit_actions(action),
  entity      audit.audit_entity NOT NULL,
  entity_id   text,                                  -- id afectado (texto: ids opacos)
  before      jsonb,                                 -- estado previo (saneado)
  after       jsonb,                                 -- estado nuevo (saneado)
  result      audit.audit_result NOT NULL DEFAULT 'ok',
  ip          inet
);
COMMENT ON TABLE audit.audit_log IS 'Una entrada por mutación de estado: quién hizo qué y cuándo (API §5.2). Retención 365d.';
CREATE INDEX ix_audit_log_entity ON audit.audit_log (entity, entity_id, ts DESC);
CREATE INDEX ix_audit_log_actor ON audit.audit_log (actor_id, ts DESC);
CREATE INDEX ix_audit_log_action ON audit.audit_log (action, ts DESC);
CREATE INDEX ix_audit_log_request ON audit.audit_log (request_id);

-- --- 5.3 Log de seguridad ---------------------------------------------------
CREATE TABLE audit.security_log (
  id          bigint               GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event       audit.security_event NOT NULL,
  request_id  uuid,
  ts          timestamptz          NOT NULL DEFAULT now(),
  user_id     uuid,
  ip          inet,
  detail      jsonb,                                 -- contexto saneado (conflictSeats, motivo...)
  CONSTRAINT chk_security_detail_obj CHECK (detail IS NULL OR jsonb_typeof(detail) = 'object')
);
COMMENT ON TABLE audit.security_log IS 'Eventos sensibles para detección de abuso/fraude (API §5.3). Retención 365d.';
CREATE INDEX ix_security_log_event_ts ON audit.security_log (event, ts DESC);
CREATE INDEX ix_security_log_ip_ts ON audit.security_log (ip, ts DESC);
CREATE INDEX ix_security_log_user_ts ON audit.security_log (user_id, ts DESC);

-- --- Política de retención (documentada como metadato) ----------------------
CREATE TABLE audit.retention_policy (
  log_name    text PRIMARY KEY,
  retention   interval NOT NULL,
  note        text
);
INSERT INTO audit.retention_policy (log_name, retention, note) VALUES
  ('access_log',   interval '30 days',  'Alto volumen; se purga por partición mensual.'),
  ('audit_log',    interval '365 days', 'Trazabilidad legal/operativa de mutaciones.'),
  ('security_log', interval '365 days', 'Eventos de seguridad y fraude.');
COMMENT ON TABLE audit.retention_policy IS 'Retención por flujo de log (API §5.4).';

COMMIT;
