-- ============================================================================
-- Palqueate · 0003 · Identidad, medios y cuentas
-- ----------------------------------------------------------------------------
-- Activos multimedia (fotos, planos, documentos), cuentas de usuario y todo lo
-- que cuelga del usuario: credenciales (separadas del perfil), roles,
-- preferencias, medios de pago tokenizados, facturación y sesiones.
--
-- Decisiones de seguridad (RNF-14, RNF-15, API §5.4):
--   · La contraseña NUNCA vive junto al perfil ni en claro: tabla aparte con
--     hash + algoritmo. El backend guarda el hash; el modelo lo impone.
--   · Las imágenes/documentos NO se guardan inline en las tablas de negocio:
--     se referencian desde media_assets, que en producción apunta a un object
--     store y conserva hash + tamaño (lo único "logueable", API §5.4).
--   · Los documentos sensibles (idFront, propertyTitle, etc.) se marcan
--     is_sensitive: nunca se devuelven en endpoints públicos ni se loguean.
--   · Tarjeta: sólo brand + last4 + token; jamás PAN ni CVV (API §5.4).
-- ============================================================================

BEGIN;
SET search_path = palqueate, public;

-- --- Activos multimedia -----------------------------------------------------
CREATE TYPE media_kind AS ENUM
  ('user_photo', 'stadium_map', 'event_image', 'palco_photo', 'palco_document', 'promo_poster');

CREATE TABLE media_assets (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  kind         media_kind  NOT NULL,
  mime_type    text        NOT NULL DEFAULT 'image/png',
  byte_size    bigint      CHECK (byte_size IS NULL OR byte_size >= 0),
  -- Hash del contenido: dedupe y referencia "hashOnly" para logs (API §5.4).
  content_sha256 bytea,
  -- En demo, la imagen puede viajar/guardarse como data URL; en producción
  -- 'storage' = object_store y el contenido vive en uri (S3/GCS), no en data_url.
  storage      text        NOT NULL DEFAULT 'inline'
                 CHECK (storage IN ('inline', 'object_store')),
  data_url     text,       -- sólo cuando storage = 'inline'
  uri          text,       -- sólo cuando storage = 'object_store'
  width        integer,
  height       integer,
  -- Documentación de titularidad/identidad: confidencial (RNF-14). Nunca pública.
  is_sensitive boolean     NOT NULL DEFAULT false,
  created_by   uuid,       -- FK a users (se agrega tras crear users)
  created_at   timestamptz NOT NULL DEFAULT now(),
  CHECK ( (storage = 'inline' AND data_url IS NOT NULL)
       OR (storage = 'object_store' AND uri IS NOT NULL) )
);
COMMENT ON TABLE media_assets IS 'Imágenes y documentos referenciados por el negocio. Aísla los blobs y permite logging hashOnly (API §5.4).';
COMMENT ON COLUMN media_assets.is_sensitive IS 'Documentos confidenciales del palquista: nunca públicos ni logueados (RNF-14).';
CREATE INDEX ix_media_assets_kind ON media_assets (kind);
CREATE INDEX ix_media_assets_sha ON media_assets (content_sha256) WHERE content_sha256 IS NOT NULL;

-- --- Usuarios ---------------------------------------------------------------
CREATE TABLE users (
  id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text         NOT NULL CHECK (char_length(trim(name)) >= 2),  -- RN-10
  email         email        NOT NULL,
  phone         text,
  ci            text,                              -- documento de identidad (PII)
  birth_date    date,
  city          text,
  address       text,
  country_code  country_code REFERENCES countries(code),
  fav_stadium_id uuid,                             -- FK a stadiums (se agrega en 0004)
  lang          text         NOT NULL DEFAULT 'Español (UY)',  -- RNF-04
  photo_asset_id uuid        REFERENCES media_assets(id) ON DELETE SET NULL,
  points        integer      NOT NULL DEFAULT 0 CHECK (points >= 0),
  is_email_verified boolean  NOT NULL DEFAULT false,
  status        text         NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'suspended', 'closed')),
  joined_at     timestamptz  NOT NULL DEFAULT now(),
  last_login_at timestamptz,
  created_at    timestamptz  NOT NULL DEFAULT now(),
  updated_at    timestamptz  NOT NULL DEFAULT now(),
  deleted_at    timestamptz                         -- borrado lógico (no romper historial)
);
COMMENT ON TABLE users IS 'Cuentas de usuario (RD-05). Credenciales y datos sensibles en tablas aparte.';
COMMENT ON COLUMN users.points IS 'Puntos de fidelidad (CRM, RF-46).';
-- Email único entre cuentas vivas (RN-10). Permite reusar email de cuenta borrada.
CREATE UNIQUE INDEX uq_users_email_active ON users (email) WHERE deleted_at IS NULL;
CREATE INDEX ix_users_name_trgm ON users USING gin (name gin_trgm_ops);  -- CRM búsqueda
CREATE INDEX ix_users_fav_stadium ON users (fav_stadium_id);

CREATE TRIGGER trg_users_updated
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION palqueate.set_updated_at();

-- Cierre del FK pendiente de media_assets.created_by.
ALTER TABLE media_assets
  ADD CONSTRAINT fk_media_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

-- --- Credenciales (separadas del perfil) ------------------------------------
CREATE TABLE auth_credentials (
  user_id        uuid        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  password_hash  text        NOT NULL,            -- nunca en claro (RNF-15)
  password_algo  text        NOT NULL DEFAULT 'argon2id',
  password_set_at timestamptz NOT NULL DEFAULT now(),
  failed_attempts integer    NOT NULL DEFAULT 0,
  locked_until   timestamptz,
  updated_at     timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE auth_credentials IS 'Hash de contraseña y estado de bloqueo, aislado del perfil (RNF-15).';
CREATE TRIGGER trg_auth_credentials_updated
  BEFORE UPDATE ON auth_credentials
  FOR EACH ROW EXECUTE FUNCTION palqueate.set_updated_at();

-- --- Roles del usuario ------------------------------------------------------
CREATE TABLE user_roles (
  user_id     uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id     text        NOT NULL REFERENCES roles(id),
  granted_at  timestamptz NOT NULL DEFAULT now(),
  granted_by  uuid        REFERENCES users(id),    -- quién otorgó la atribución (admin)
  PRIMARY KEY (user_id, role_id)
);
COMMENT ON TABLE user_roles IS 'Roles asignados (cliente/palquista se acumulan; admin es atribución — RN-13).';
CREATE INDEX ix_user_roles_role ON user_roles (role_id);

-- Conveniencia: ¿es admin? (RN-13). Centraliza la verificación de rol.
CREATE OR REPLACE FUNCTION palqueate.is_admin(p_user uuid)
RETURNS boolean
LANGUAGE sql STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM palqueate.user_roles WHERE user_id = p_user AND role_id = 'admin');
$$;

-- --- Preferencias de notificación (RF-32) -----------------------------------
CREATE TABLE user_notification_prefs (
  user_id     uuid        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email       boolean     NOT NULL DEFAULT true,
  sms         boolean     NOT NULL DEFAULT false,
  push        boolean     NOT NULL DEFAULT true,
  promos      boolean     NOT NULL DEFAULT true,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE user_notification_prefs IS 'Preferencias de notificación por canal (RF-32).';
CREATE TRIGGER trg_user_notif_updated
  BEFORE UPDATE ON user_notification_prefs
  FOR EACH ROW EXECUTE FUNCTION palqueate.set_updated_at();

-- --- Medios de pago (tokenizados) -------------------------------------------
CREATE TABLE user_payment_methods (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand       text,                               -- 'Visa'
  last4       char(4)     CHECK (last4 ~ '^[0-9]{4}$'),
  exp_month   integer     CHECK (exp_month BETWEEN 1 AND 12),
  exp_year    integer     CHECK (exp_year BETWEEN 2020 AND 2100),
  holder_name text,
  gateway_token text,                             -- token de la pasarela; NUNCA el PAN
  is_default  boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  deleted_at  timestamptz
);
COMMENT ON TABLE user_payment_methods IS 'Tarjetas tokenizadas: sólo brand+last4+token. Sin PAN ni CVV (API §5.4).';
CREATE UNIQUE INDEX uq_payment_default ON user_payment_methods (user_id) WHERE is_default AND deleted_at IS NULL;

-- --- Datos de facturación ---------------------------------------------------
CREATE TABLE user_billing (
  user_id     uuid        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  name        text,
  rut         text,                               -- RUT/CUIT del cliente
  updated_at  timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE user_billing IS 'Datos de facturación del cliente (RD-05).';
CREATE TRIGGER trg_user_billing_updated
  BEFORE UPDATE ON user_billing
  FOR EACH ROW EXECUTE FUNCTION palqueate.set_updated_at();

-- --- Sesiones / tokens ------------------------------------------------------
-- Soporta sesión de usuario y "sesión anónima por token" del carrito (API §4).
CREATE TABLE sessions (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        REFERENCES users(id) ON DELETE CASCADE,  -- NULL = anónima
  kind          text        NOT NULL DEFAULT 'user'
                  CHECK (kind IN ('guest', 'user')),
  token_hash    bytea       NOT NULL UNIQUE,       -- hash del JWT/opaco; nunca el token (API §5.4)
  ip            inet,
  user_agent    text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_seen_at  timestamptz NOT NULL DEFAULT now(),
  expires_at    timestamptz NOT NULL,
  revoked_at    timestamptz,
  CHECK (kind = 'user' OR user_id IS NULL)         -- guest no tiene user
);
COMMENT ON TABLE sessions IS 'Sesiones de usuario y anónimas (carrito por token). Sólo hash del token (API §5.4).';
CREATE INDEX ix_sessions_user ON sessions (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX ix_sessions_active ON sessions (expires_at) WHERE revoked_at IS NULL;

COMMIT;
