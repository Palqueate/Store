-- ============================================================================
-- PALQUEATE · ESQUEMA COMPLETO DE BASE DE DATOS (PostgreSQL 18)
-- ----------------------------------------------------------------------------
-- Script único, idempotente en intención y autocontenido: crea TODO el modelo
-- (esquemas palqueate + audit), datos de referencia, funciones, triggers y
-- vistas, en una sola transacción y en el orden de dependencias correcto.
--
-- Aplicar sobre una base vacía:
--     psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/schema.sql
--
-- Representa toda la aplicación descrita en docs/ (catálogo, reservas con
-- control de concurrencia, cuentas, verificación de palcos, finanzas) más una
-- capa completa de trazabilidad (auditoría, logs de acceso y seguridad).
-- La guía de diseño, el ERD y la trazabilidad a requerimientos están en
-- db/README.md.
--
-- Convenciones: identificadores en inglés (como la API), comentarios en
-- español; PK uuid opacas y ORDENADAS POR TIEMPO con uuidv7() (nativa en PG18,
-- mejor localidad de índice que el v4 aleatorio); dinero entero en UYU
-- (money_amount); tiempos en timestamptz (UTC); created_at/updated_at en toda
-- tabla mutable.
-- ============================================================================

BEGIN;
SET search_path = palqueate, public;



-- ####################################################################
-- ## 0001_foundation.sql
-- ####################################################################

-- ============================================================================
-- Palqueate · 0001 · Fundaciones
-- ----------------------------------------------------------------------------
-- Extensiones, esquemas, dominios, tipos enumerados y funciones de utilidad
-- compartidas por todo el modelo. Todo lo transversal vive aquí para que el
-- resto de las migraciones sólo declaren tablas.
--
-- Convenciones del proyecto:
--   · Identificadores SQL en INGLÉS (igual que la API); comentarios en español.
--   · snake_case para tablas y columnas; plural para nombres de tablas.
--   · Claves primarias UUID opacas y ordenadas por tiempo (uuidv7(), nativa en
--     PG18) — el backend nunca expone ids secuenciales y el front "nunca los
--     inventa" (ver API_ENDPOINTS §1). uuidv7 da mejor localidad de índice que
--     el v4 aleatorio sin revelar un contador.
--   · Dinero: enteros en pesos uruguayos, SIN decimales (dominio money_amount).
--   · Tiempos: siempre timestamptz (UTC). Las fechas "humanas" del front
--     (month/day/dow) se derivan en la capa de presentación, no se persisten.
--   · created_at / updated_at en toda tabla mutable; updated_at vía trigger.
--   · Borrado lógico (deleted_at) en entidades de negocio que no deben perderse.
-- ============================================================================


-- --- Extensiones ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- digest()/crypt() para hashes (uuidv7() es core en PG18)
CREATE EXTENSION IF NOT EXISTS citext;     -- email case-insensitive con unicidad
CREATE EXTENSION IF NOT EXISTS btree_gist; -- constraints de exclusión (anti-doble-reserva)
CREATE EXTENSION IF NOT EXISTS pg_trgm;    -- búsqueda por texto en catálogo/CRM

-- --- Esquemas ---------------------------------------------------------------
-- Núcleo de negocio.
CREATE SCHEMA IF NOT EXISTS palqueate;
-- Trazabilidad: logs de acceso, auditoría de dominio y eventos de seguridad.
-- Esquema aparte porque tiene retención, volumen y permisos distintos.
CREATE SCHEMA IF NOT EXISTS audit;

COMMENT ON SCHEMA palqueate IS 'Modelo de negocio de Palqueate (marketplace de palcos).';
COMMENT ON SCHEMA audit      IS 'Trazabilidad: acceso, auditoría de dominio y seguridad. Retención propia.';


-- --- Dominios ---------------------------------------------------------------
-- Importe monetario: entero >= 0, en la moneda de la fila (UYU por defecto).
CREATE DOMAIN money_amount AS bigint
  CHECK (VALUE >= 0);
COMMENT ON DOMAIN money_amount IS 'Entero en la unidad mínima de la moneda (UYU sin decimales). >= 0.';

-- Email validado y case-insensitive.
CREATE DOMAIN email AS citext
  CHECK (VALUE ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$');
COMMENT ON DOMAIN email IS 'Email con formato válido, comparación case-insensitive (RN-10).';

-- Código de país ISO-3166-1 alpha-2 (preparado para multipaís — RNF-18).
CREATE DOMAIN country_code AS char(2)
  CHECK (VALUE ~ '^[A-Z]{2}$');

-- Código de moneda ISO-4217 (preparado para multimoneda — RNF-18).
CREATE DOMAIN currency_code AS char(3)
  CHECK (VALUE ~ '^[A-Z]{3}$');

-- Porcentaje 0..1 (comisión, conversión, ocupación).
CREATE DOMAIN ratio AS numeric(6,5)
  CHECK (VALUE >= 0 AND VALUE <= 1);

-- --- Tipos enumerados -------------------------------------------------------
-- Ciclo de vida del palco (DOCUMENTACION §10 / Palco.ts).
CREATE TYPE palco_status AS ENUM
  ('pendiente', 'rechazado', 'publicado', 'pausado', 'alquilado');

-- Modalidades de alquiler. Se conservan EXACTO los literales del contrato
-- (API/dominio) para evitar mapeos error-prone entre capas.
CREATE TYPE palco_mode AS ENUM
  ('palcoYear', 'seatYear', 'seatEvent');

-- Medio de pago del checkout (API §23).
CREATE TYPE pay_method AS ENUM
  ('card', 'transfer');

-- Estado de una orden (no estaba en el prototipo demo; se agrega para soportar
-- el ciclo real: pago simulado hoy, anulaciones/reembolsos a futuro).
CREATE TYPE order_status AS ENUM
  ('pending', 'paid', 'cancelled', 'refunded');

-- Ciclo de vida de un hold (API §4 — sistema de reservas temporales).
CREATE TYPE hold_status AS ENUM
  ('active', 'consumed', 'released', 'expired');

-- Decisión de verificación del admin (API §22).
CREATE TYPE review_decision AS ENUM
  ('approve', 'reject');

-- Estado del payout al palquista (RN-02).
CREATE TYPE payout_status AS ENUM
  ('pending', 'scheduled', 'paid', 'failed', 'on_hold');

-- Canal de notificación al usuario (RF-32).
CREATE TYPE notification_channel AS ENUM
  ('email', 'sms', 'push', 'inapp');

-- --- Funciones de utilidad --------------------------------------------------
-- Mantiene updated_at en cada UPDATE. Se cuelga como trigger BEFORE UPDATE.
CREATE OR REPLACE FUNCTION palqueate.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
COMMENT ON FUNCTION palqueate.set_updated_at() IS 'Trigger BEFORE UPDATE: refresca updated_at.';

-- Nota: palqueate.commission_for() (RN-01) se define en 0002, una vez creada la
-- tabla platform_config de la que lee la tasa vigente.


-- ####################################################################
-- ## 0002_reference_data.sql
-- ####################################################################

-- ============================================================================
-- Palqueate · 0002 · Datos de referencia y configuración
-- ----------------------------------------------------------------------------
-- Catálogos estables y de baja cardinalidad: países, monedas, temporadas,
-- comodidades, tipos de evento, catálogo de botana, roles, definiciones de
-- campos verificables y la configuración global de la plataforma.
-- Centralizar estas tablas hace que las reglas (comisión, TTL de holds, lista
-- de comodidades, etc.) se ajusten en datos y no en código (RNF-17).
-- ============================================================================


-- --- Configuración global (singleton) --------------------------------------
-- Una sola fila. La columna id BOOLEAN con default y CHECK garantiza unicidad.
CREATE TABLE platform_config (
  id                 boolean      PRIMARY KEY DEFAULT true CHECK (id),
  commission_rate    ratio        NOT NULL DEFAULT 0.04000,   -- RN-01: 4 %
  base_currency      currency_code NOT NULL DEFAULT 'UYU',     -- RN-14
  hold_ttl_seconds   integer      NOT NULL DEFAULT 600         -- API §4: 10 min
                       CHECK (hold_ttl_seconds BETWEEN 60 AND 7200),
  min_palco_photos   integer      NOT NULL DEFAULT 3 CHECK (min_palco_photos >= 0), -- RN-06
  min_palco_amenities integer     NOT NULL DEFAULT 1 CHECK (min_palco_amenities >= 0),
  api_version        text         NOT NULL DEFAULT 'v1',
  updated_at         timestamptz  NOT NULL DEFAULT now()
);
COMMENT ON TABLE platform_config IS 'Parámetros de negocio centralizados (RNF-17). Fila única.';
COMMENT ON COLUMN platform_config.commission_rate IS 'Comisión de plataforma sobre el subtotal (RN-01).';
COMMENT ON COLUMN platform_config.hold_ttl_seconds IS 'TTL de las reservas temporales (holds) en segundos.';
INSERT INTO platform_config (id) VALUES (true);

CREATE TRIGGER trg_platform_config_updated
  BEFORE UPDATE ON platform_config
  FOR EACH ROW EXECUTE FUNCTION palqueate.set_updated_at();

-- Comisión vigente de la plataforma (RN-01). Lee de platform_config para que la
-- regla de negocio esté centralizada (RNF-17) y no quede hardcodeada en el cálculo.
CREATE OR REPLACE FUNCTION palqueate.commission_for(p_subtotal money_amount)
RETURNS money_amount
LANGUAGE sql STABLE AS $$
  SELECT round(p_subtotal * (SELECT commission_rate FROM palqueate.platform_config WHERE id))::bigint;
$$;
COMMENT ON FUNCTION palqueate.commission_for(money_amount)
  IS 'Comisión de plataforma sobre un subtotal, usando la tasa vigente (RN-01).';

-- --- Países -----------------------------------------------------------------
-- Lista controlada (COUNTRIES en countries.ts). Preparado para multipaís.
CREATE TABLE countries (
  code        country_code PRIMARY KEY,           -- ISO-3166-1 alpha-2
  name        text         NOT NULL UNIQUE,        -- nombre mostrado (español)
  is_active   boolean      NOT NULL DEFAULT true,
  sort_order  integer      NOT NULL DEFAULT 100,   -- Uruguay primero
  created_at  timestamptz  NOT NULL DEFAULT now()
);
COMMENT ON TABLE countries IS 'Países habilitados para estadios, eventos, palcos y cuentas (RNF-18).';

INSERT INTO countries (code, name, sort_order) VALUES
  ('UY', 'Uruguay', 1),
  ('AR', 'Argentina', 10),
  ('BO', 'Bolivia', 10),
  ('BR', 'Brasil', 10),
  ('CL', 'Chile', 10),
  ('CO', 'Colombia', 10),
  ('EC', 'Ecuador', 10),
  ('ES', 'España', 10),
  ('US', 'Estados Unidos', 10),
  ('MX', 'México', 10),
  ('PY', 'Paraguay', 10),
  ('PE', 'Perú', 10),
  ('VE', 'Venezuela', 10);

-- --- Monedas ----------------------------------------------------------------
CREATE TABLE currencies (
  code        currency_code PRIMARY KEY,    -- ISO-4217
  name        text          NOT NULL,
  symbol      text          NOT NULL,        -- "$U"
  is_active   boolean       NOT NULL DEFAULT true
);
COMMENT ON TABLE currencies IS 'Monedas soportadas (RNF-18). Hoy sólo UYU operativa.';
INSERT INTO currencies (code, name, symbol) VALUES
  ('UYU', 'Peso uruguayo', '$U');

-- --- Temporadas -------------------------------------------------------------
-- El alquiler "anual" (palcoYear/seatYear) cubre una temporada completa. La
-- ocupación anual se gestiona a nivel temporada (RN-11), por eso es una entidad.
CREATE TABLE seasons (
  id          uuid        PRIMARY KEY DEFAULT uuidv7(),
  name        text        NOT NULL,                 -- "Temporada 2026"
  year        integer     NOT NULL,
  starts_on   date        NOT NULL,
  ends_on     date        NOT NULL,
  is_current  boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_on > starts_on),
  UNIQUE (year)
);
COMMENT ON TABLE seasons IS 'Temporadas deportivas; ancla de los alquileres anuales (RN-11).';
-- A lo sumo una temporada vigente.
CREATE UNIQUE INDEX uq_seasons_current ON seasons (is_current) WHERE is_current;

INSERT INTO seasons (name, year, starts_on, ends_on, is_current)
VALUES ('Temporada 2026', 2026, '2026-01-01', '2026-12-31', true);

-- --- Comodidades ------------------------------------------------------------
-- Catálogo de amenities (Wi-Fi, Cocina, Heladera, TV, Baño, Aire, Bar,
-- Parrillero...). Normalizado para filtrar y reusar; el palquista referencia.
CREATE TABLE amenities (
  id          uuid        PRIMARY KEY DEFAULT uuidv7(),
  slug        text        NOT NULL UNIQUE,    -- 'wifi', 'kitchen'...
  name        text        NOT NULL,           -- etiqueta mostrada
  icon        text,                            -- nombre de ícono opcional
  is_active   boolean     NOT NULL DEFAULT true,
  sort_order  integer     NOT NULL DEFAULT 100,
  created_at  timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE amenities IS 'Catálogo de comodidades de palco (DOCUMENTACION §6.1).';
INSERT INTO amenities (slug, name, sort_order) VALUES
  ('wifi', 'Wi-Fi', 10),
  ('kitchen', 'Cocina', 20),
  ('fridge', 'Heladera', 30),
  ('tv', 'TV', 40),
  ('bathroom', 'Baño', 50),
  ('ac', 'Aire acondicionado', 60),
  ('bar', 'Bar', 70),
  ('grill', 'Parrillero', 80);

-- --- Tipos de evento --------------------------------------------------------
CREATE TABLE event_types (
  id          text        PRIMARY KEY,        -- 'futbol','basketball','show' (id estable de la API)
  name        text        NOT NULL,
  tag         text        NOT NULL,           -- etiqueta por defecto del evento
  is_active   boolean     NOT NULL DEFAULT true,
  sort_order  integer     NOT NULL DEFAULT 100,
  created_at  timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE event_types IS 'Tipos de evento (RD-02). id estable expuesto por la API.';
INSERT INTO event_types (id, name, tag, sort_order) VALUES
  ('futbol', 'Fútbol', 'Local', 10),
  ('basketball', 'Basketball', 'Local', 20),
  ('show', 'Show', 'Destacado', 30);

-- --- Catálogo de botana -----------------------------------------------------
CREATE TABLE food_categories (
  id          text        PRIMARY KEY,        -- 'compartir','sandwich'...
  name        text        NOT NULL,
  sort_order  integer     NOT NULL DEFAULT 100,
  is_active   boolean     NOT NULL DEFAULT true
);
COMMENT ON TABLE food_categories IS 'Categorías del menú de botana (RD-07).';
-- 'all' es una categoría virtual de UI ("Todo"); no se persiste como real.
INSERT INTO food_categories (id, name, sort_order) VALUES
  ('compartir', 'Para compartir', 10),
  ('sandwich', 'Sándwiches', 20),
  ('pizza', 'Pizzas', 30),
  ('cerveza', 'Cervezas', 40),
  ('bebida', 'Bebidas', 50),
  ('dulce', 'Dulce', 60);

CREATE TABLE food_items (
  id           uuid        PRIMARY KEY DEFAULT uuidv7(),
  category_id  text        NOT NULL REFERENCES food_categories(id),
  name         text        NOT NULL,
  description  text        NOT NULL DEFAULT '',
  price        money_amount NOT NULL,
  currency     currency_code NOT NULL DEFAULT 'UYU' REFERENCES currencies(code),
  is_available boolean     NOT NULL DEFAULT true,    -- se puede dar de baja sin borrar
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE food_items IS 'Ítems del catálogo de botana con precio (RD-07).';
CREATE INDEX ix_food_items_category ON food_items (category_id);
CREATE TRIGGER trg_food_items_updated
  BEFORE UPDATE ON food_items
  FOR EACH ROW EXECUTE FUNCTION palqueate.set_updated_at();

-- Catálogo inicial de botana (db.ts FOOD). Precios en UYU.
INSERT INTO food_items (category_id, name, description, price) VALUES
  ('compartir', 'Nachos con cheddar', 'Cheddar fundido y jalapeños', 590),
  ('compartir', 'Picada del palco', 'Quesos, fiambres y aceitunas', 1290),
  ('compartir', 'Papas bravas', 'Con alioli y picante', 480),
  ('sandwich', 'Chivito al pan', 'Lomo, panceta, huevo y queso', 790),
  ('sandwich', 'Choripán', 'Con chimichurri casero', 420),
  ('sandwich', 'Pancho completo', 'Doble salchicha', 340),
  ('pizza', 'Pizza muzzarella', '8 porciones', 680),
  ('pizza', 'Fainá', 'Recién horneada', 220),
  ('cerveza', 'Cerveza tirada 1L', 'Rubia bien fría', 520),
  ('cerveza', 'Six pack lata', '6 x 473ml', 840),
  ('bebida', 'Refresco 1.5L', 'Cola / lima / naranja', 280),
  ('bebida', 'Agua mineral', 'Con o sin gas', 140),
  ('dulce', 'Alfajores x3', 'De maicena o chocolate', 260),
  ('dulce', 'Pop corn dulce', 'Balde grande', 230);

-- --- Roles ------------------------------------------------------------------
-- Roles del sistema. cliente y palquista se acumulan; admin es atribución
-- especial (REQUERIMIENTOS §2.1). Se modela como tabla para extensibilidad y
-- para soportar autorización por rol (RN-13) más allá de un boolean.
CREATE TABLE roles (
  id          text        PRIMARY KEY,        -- 'client','owner','admin'
  name        text        NOT NULL,
  description text        NOT NULL DEFAULT ''
);
COMMENT ON TABLE roles IS 'Roles de autorización (REQUERIMIENTOS §2.1, RN-13).';
INSERT INTO roles (id, name, description) VALUES
  ('client', 'Cliente / hincha', 'Reserva, paga, pide botana y gestiona su cuenta.'),
  ('owner',  'Palquista / dueño', 'Publica, edita y mide sus palcos.'),
  ('admin',  'Administrador', 'Opera la plataforma: eventos, estadios, verificación, CRM y finanzas.');

-- --- Definición de campos verificables --------------------------------------
-- Espejo de PALCO_REVIEW_FIELDS (Palco.ts). El admin marca campos por su `key`
-- durante el rechazo; tenerlos como catálogo da integridad referencial y permite
-- listar/traducir las observaciones de forma consistente (RD-08).
CREATE TABLE palco_review_field_defs (
  key         text        PRIMARY KEY,        -- 'stadium','map','payout.swift'...
  label       text        NOT NULL,
  sort_order  integer     NOT NULL DEFAULT 100,
  is_active   boolean     NOT NULL DEFAULT true
);
COMMENT ON TABLE palco_review_field_defs IS 'Campos revisables en la verificación de palcos (Palco.PALCO_REVIEW_FIELDS).';
INSERT INTO palco_review_field_defs (key, label, sort_order) VALUES
  ('country', 'País', 10),
  ('stadium', 'Estadio', 20),
  ('map', 'Ubicación en el plano', 30),
  ('seats', 'Cantidad de asientos', 40),
  ('parking', 'Estacionamiento', 50),
  ('amenities', 'Comodidades', 60),
  ('images', 'Fotos del palco', 70),
  ('coOwners', 'Co-propietarios', 80),
  ('payout.country', 'País de la cuenta bancaria', 90),
  ('payout.swift', 'SWIFT / BIC', 100),
  ('payout.bank', 'Banco', 110),
  ('payout.beneficiary', 'Beneficiario bancario', 120),
  ('payout.accountNumber', 'Número de cuenta', 130),
  ('payout.branch', 'Sucursal del banco', 140),
  ('payout.idFront', 'Documento de identidad · anverso', 150),
  ('payout.idBack', 'Documento de identidad · reverso', 160),
  ('payout.proofOfAddress', 'Comprobante de domicilio', 170),
  ('payout.propertyTitle', 'Título de propiedad del palco', 180);


-- ####################################################################
-- ## 0003_identity_and_media.sql
-- ####################################################################

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


-- --- Activos multimedia -----------------------------------------------------
CREATE TYPE media_kind AS ENUM
  ('user_photo', 'stadium_map', 'event_image', 'palco_photo', 'palco_document', 'promo_poster');

CREATE TABLE media_assets (
  id           uuid        PRIMARY KEY DEFAULT uuidv7(),
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
  id            uuid         PRIMARY KEY DEFAULT uuidv7(),
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
  id          uuid        PRIMARY KEY DEFAULT uuidv7(),
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
  id            uuid        PRIMARY KEY DEFAULT uuidv7(),
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


-- ####################################################################
-- ## 0004_stadiums_and_events.sql
-- ####################################################################

-- ============================================================================
-- Palqueate · 0004 · Estadios y eventos
-- ----------------------------------------------------------------------------
-- Estadios (alta del admin), eventos y sus funciones (fecha + hora). Un evento
-- tiene 1..N funciones (RD-02): fútbol normalmente una, los shows varias.
-- La disponibilidad de "asiento por evento" se indexa por FUNCIÓN (RN-11), por
-- eso event_occurrences es una entidad de primer nivel referenciada por la
-- ocupación y por las órdenes.
-- ============================================================================


-- --- Estadios ---------------------------------------------------------------
CREATE TABLE stadiums (
  id            uuid         PRIMARY KEY DEFAULT uuidv7(),
  name          text         NOT NULL,
  short_name    text         NOT NULL,             -- abreviatura (se deriva si falta, API §9)
  city          text,
  country_code  country_code REFERENCES countries(code),
  shape         text         NOT NULL DEFAULT 'rect', -- 'rect' | 'bowl' (forma del plano)
  capacity      integer      CHECK (capacity IS NULL OR capacity >= 0),
  built_year    integer      CHECK (built_year IS NULL OR built_year BETWEEN 1800 AND 2100),
  surface       text,                               -- "Césped natural"
  levels        integer      CHECK (levels IS NULL OR levels >= 0),
  address       text,
  has_roof      boolean      NOT NULL DEFAULT false,
  map_asset_id  uuid         REFERENCES media_assets(id) ON DELETE SET NULL, -- plano/foto real
  created_at    timestamptz  NOT NULL DEFAULT now(),
  updated_at    timestamptz  NOT NULL DEFAULT now(),
  created_by    uuid         REFERENCES users(id),  -- admin que lo dio de alta
  updated_by    uuid         REFERENCES users(id),
  deleted_at    timestamptz
);
COMMENT ON TABLE stadiums IS 'Estadios del marketplace (RD-01). Alta/edición por admin (RF-43).';
COMMENT ON COLUMN stadiums.map_asset_id IS 'Plano/foto real para ubicar palcos (RI-03).';
CREATE INDEX ix_stadiums_country ON stadiums (country_code);
CREATE INDEX ix_stadiums_name_trgm ON stadiums USING gin (name gin_trgm_ops);
CREATE TRIGGER trg_stadiums_updated
  BEFORE UPDATE ON stadiums
  FOR EACH ROW EXECUTE FUNCTION palqueate.set_updated_at();

-- Cierre del FK de users.fav_stadium_id (declarado en 0003).
ALTER TABLE users
  ADD CONSTRAINT fk_users_fav_stadium
  FOREIGN KEY (fav_stadium_id) REFERENCES stadiums(id) ON DELETE SET NULL;

-- --- Eventos ----------------------------------------------------------------
CREATE TABLE events (
  id            uuid         PRIMARY KEY DEFAULT uuidv7(),
  stadium_id    uuid         NOT NULL REFERENCES stadiums(id),
  country_code  country_code REFERENCES countries(code),  -- default: el del estadio
  type_id       text         NOT NULL REFERENCES event_types(id),
  competition   text         NOT NULL DEFAULT '',  -- "Torneo Apertura"
  round         text         NOT NULL DEFAULT '',  -- "Fecha 7"
  opponent      text         NOT NULL,             -- rival/artista (API: opp)
  tag           text         NOT NULL DEFAULT '',  -- "Local" | "Copa" | "Destacado"
  label         text         NOT NULL DEFAULT '',  -- derivado: comp + round
  observations  text,                               -- nota libre del admin (obs)
  created_at    timestamptz  NOT NULL DEFAULT now(),
  updated_at    timestamptz  NOT NULL DEFAULT now(),
  created_by    uuid         REFERENCES users(id),
  updated_by    uuid         REFERENCES users(id),
  deleted_at    timestamptz
);
COMMENT ON TABLE events IS 'Partidos y shows (RD-02). Reflejan inmediatamente del lado del hincha (RF-42).';
CREATE INDEX ix_events_stadium ON events (stadium_id);
CREATE INDEX ix_events_type ON events (type_id);
CREATE TRIGGER trg_events_updated
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION palqueate.set_updated_at();

-- --- Funciones del evento (fecha + hora) ------------------------------------
CREATE TABLE event_occurrences (
  id            uuid         PRIMARY KEY DEFAULT uuidv7(),
  event_id      uuid         NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  -- Momento exacto de la función en UTC. month/day/dow/time del front se
  -- derivan de aquí en presentación; no se persisten redundantes.
  starts_at     timestamptz  NOT NULL,
  -- Orden de la función dentro del evento (1..N) para etiquetar "Función 2", etc.
  sequence      integer      NOT NULL DEFAULT 1 CHECK (sequence >= 1),
  created_at    timestamptz  NOT NULL DEFAULT now(),
  UNIQUE (event_id, sequence),
  UNIQUE (event_id, starts_at)
);
COMMENT ON TABLE event_occurrences IS 'Funciones (fecha+hora) de un evento; ancla de disponibilidad por evento (RN-11).';
CREATE INDEX ix_event_occurrences_event ON event_occurrences (event_id);
CREATE INDEX ix_event_occurrences_when ON event_occurrences (starts_at);

-- --- Imágenes del evento (afiches) ------------------------------------------
CREATE TABLE event_images (
  event_id    uuid        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  asset_id    uuid        NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  sort_order  integer     NOT NULL DEFAULT 0,
  PRIMARY KEY (event_id, asset_id)
);
COMMENT ON TABLE event_images IS 'Afiches/imágenes opcionales del evento (RD-02, RF-07).';


-- ####################################################################
-- ## 0005_palcos.sql
-- ####################################################################

-- ============================================================================
-- Palqueate · 0005 · Palcos (publicaciones)
-- ----------------------------------------------------------------------------
-- El palco y todo lo que lo compone: modalidades con precio, inventario de
-- butacas, co-propietarios, datos de cobro (confidenciales) y su documentación,
-- fotos e historial de estados. La ocupación de butacas y la verificación se
-- modelan en migraciones aparte (0006, 0007).
-- ============================================================================


-- --- Palcos -----------------------------------------------------------------
CREATE TABLE palcos (
  id            uuid         PRIMARY KEY DEFAULT uuidv7(),
  stadium_id    uuid         NOT NULL REFERENCES stadiums(id),
  country_code  country_code REFERENCES countries(code),   -- derivado del estadio
  owner_id      uuid         REFERENCES users(id),          -- palquista titular
  host_label    text         NOT NULL DEFAULT '',           -- "Familia Méndez" (nombre mostrado)
  title         text         NOT NULL DEFAULT 'Mi palco',
  sector        text         NOT NULL DEFAULT '',           -- "Codo Norte · Nivel Palcos"
  -- Ubicación marcada sobre el plano del estadio, en % (0..100).
  map_x         numeric(6,3) NOT NULL CHECK (map_x BETWEEN 0 AND 100),
  map_y         numeric(6,3) NOT NULL CHECK (map_y BETWEEN 0 AND 100),
  seat_count    integer      NOT NULL CHECK (seat_count BETWEEN 1 AND 40),  -- API §18
  has_parking   boolean      NOT NULL DEFAULT false,
  parking_spots integer      NOT NULL DEFAULT 0 CHECK (parking_spots >= 0),
  rating        numeric(2,1) NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  status        palco_status NOT NULL DEFAULT 'pendiente',  -- RN-04: nace pendiente
  submitted_at  timestamptz  NOT NULL DEFAULT now(),         -- último envío a verificación
  published_at  timestamptz,                                 -- primera aprobación
  created_at    timestamptz  NOT NULL DEFAULT now(),
  updated_at    timestamptz  NOT NULL DEFAULT now(),
  updated_by    uuid         REFERENCES users(id),
  deleted_at    timestamptz,
  CHECK (has_parking OR parking_spots = 0)
);
COMMENT ON TABLE palcos IS 'Publicaciones de palco (RD-03). Nace pendiente de verificación (RN-04).';
COMMENT ON COLUMN palcos.status IS 'Ciclo de vida: pendiente→rechazado/publicado→pausado/alquilado (DOCUMENTACION §10).';
CREATE INDEX ix_palcos_stadium ON palcos (stadium_id);
CREATE INDEX ix_palcos_owner ON palcos (owner_id);
CREATE INDEX ix_palcos_status ON palcos (status);
-- Catálogo público (RN-03): sólo publicado/alquilado. Índice parcial para listados.
CREATE INDEX ix_palcos_public ON palcos (status) WHERE status IN ('publicado', 'alquilado') AND deleted_at IS NULL;
CREATE INDEX ix_palcos_title_trgm ON palcos USING gin (title gin_trgm_ops);
CREATE TRIGGER trg_palcos_updated
  BEFORE UPDATE ON palcos
  FOR EACH ROW EXECUTE FUNCTION palqueate.set_updated_at();

-- --- Modalidades de un palco ------------------------------------------------
-- Una fila por modalidad ofrecida (RD-03). is_on indica si está activa; el
-- precio aplica a esa modalidad. RN-06 exige al menos una modalidad activa.
CREATE TABLE palco_modes (
  palco_id    uuid         NOT NULL REFERENCES palcos(id) ON DELETE CASCADE,
  mode        palco_mode   NOT NULL,
  is_on       boolean      NOT NULL DEFAULT false,
  price       money_amount NOT NULL DEFAULT 0,
  currency    currency_code NOT NULL DEFAULT 'UYU' REFERENCES currencies(code),
  PRIMARY KEY (palco_id, mode),
  CHECK (NOT is_on OR price > 0)        -- una modalidad activa debe tener precio
);
COMMENT ON TABLE palco_modes IS 'Modalidades (palcoYear/seatYear/seatEvent) con activación y precio (RD-03).';

-- --- Butacas (inventario físico) --------------------------------------------
-- Una fila por butaca del palco (1..seat_count). Es el inventario contra el que
-- se calcula la disponibilidad y se evita la doble venta (0007).
CREATE TABLE palco_seats (
  id          uuid        PRIMARY KEY DEFAULT uuidv7(),
  palco_id    uuid        NOT NULL REFERENCES palcos(id) ON DELETE CASCADE,
  seat_number integer     NOT NULL CHECK (seat_number >= 1),
  label       text,                               -- etiqueta opcional ("A1")
  UNIQUE (palco_id, seat_number)
);
COMMENT ON TABLE palco_seats IS 'Inventario de butacas por palco; base de la disponibilidad (RD-04).';
CREATE INDEX ix_palco_seats_palco ON palco_seats (palco_id);

-- --- Co-propietarios --------------------------------------------------------
CREATE TABLE palco_co_owners (
  id          uuid        PRIMARY KEY DEFAULT uuidv7(),
  palco_id    uuid        NOT NULL REFERENCES palcos(id) ON DELETE CASCADE,
  name        text        NOT NULL,
  email       email       NOT NULL,
  user_id     uuid        REFERENCES users(id),    -- enlazado si tiene cuenta
  created_at  timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE palco_co_owners IS 'Co-propietarios declarados del palco (RD-03, RF-34).';
CREATE INDEX ix_palco_co_owners_palco ON palco_co_owners (palco_id);

-- --- Datos de cobro (confidenciales) ----------------------------------------
-- Cuenta bancaria del beneficiario. Información sensible (RNF-14): se aísla del
-- palco, NUNCA se devuelve en endpoints públicos (API §17) y debe cifrarse en
-- reposo. Para el número de cuenta se guarda además un hash para búsquedas sin
-- exponer el valor; el cifrado real lo aplica la capa de aplicación/KMS.
CREATE TABLE palco_payout (
  palco_id        uuid         PRIMARY KEY REFERENCES palcos(id) ON DELETE CASCADE,
  country_code    country_code REFERENCES countries(code),
  swift           text,                            -- SWIFT/BIC (opcional)
  bank            text         NOT NULL,
  beneficiary     text         NOT NULL,
  account_enc     bytea        NOT NULL,            -- número de cuenta CIFRADO
  account_last4   char(4),                          -- para mostrar/conciliar
  branch          text,
  created_at      timestamptz  NOT NULL DEFAULT now(),
  updated_at      timestamptz  NOT NULL DEFAULT now()
);
COMMENT ON TABLE palco_payout IS 'Datos bancarios del palquista. Confidencial, cifrado en reposo (RNF-14, API §5.4).';
CREATE TRIGGER trg_palco_payout_updated
  BEFORE UPDATE ON palco_payout
  FOR EACH ROW EXECUTE FUNCTION palqueate.set_updated_at();

-- --- Documentación de titularidad -------------------------------------------
CREATE TYPE palco_document_type AS ENUM
  ('id_front', 'id_back', 'proof_of_address', 'property_title');

CREATE TABLE palco_documents (
  palco_id    uuid                 NOT NULL REFERENCES palcos(id) ON DELETE CASCADE,
  doc_type    palco_document_type  NOT NULL,
  asset_id    uuid                 NOT NULL REFERENCES media_assets(id),  -- is_sensitive=true
  uploaded_at timestamptz          NOT NULL DEFAULT now(),
  PRIMARY KEY (palco_id, doc_type)
);
COMMENT ON TABLE palco_documents IS 'Documentos que respaldan titularidad/identidad (RD-03, RNF-14). Confidenciales.';

-- --- Fotos del palco --------------------------------------------------------
CREATE TABLE palco_images (
  palco_id    uuid        NOT NULL REFERENCES palcos(id) ON DELETE CASCADE,
  asset_id    uuid        NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  sort_order  integer     NOT NULL DEFAULT 0,
  PRIMARY KEY (palco_id, asset_id)
);
COMMENT ON TABLE palco_images IS 'Fotos del palco (RN-06 exige >= 3 para publicar).';

-- --- Historial de estados ---------------------------------------------------
-- Traza cada transición del ciclo de vida (RN-04/05/07/08/09). Da auditoría de
-- "cuándo y por qué" cambió de estado, además del log de auditoría general.
CREATE TABLE palco_status_history (
  id          uuid         PRIMARY KEY DEFAULT uuidv7(),
  palco_id    uuid         NOT NULL REFERENCES palcos(id) ON DELETE CASCADE,
  from_status palco_status,
  to_status   palco_status NOT NULL,
  changed_by  uuid         REFERENCES users(id),   -- palquista o admin
  reason      text,
  changed_at  timestamptz  NOT NULL DEFAULT now()
);
COMMENT ON TABLE palco_status_history IS 'Bitácora de transiciones de estado del palco (trazabilidad de su ciclo de vida).';
CREATE INDEX ix_palco_status_history_palco ON palco_status_history (palco_id, changed_at);


-- ####################################################################
-- ## 0006_verification.sql
-- ####################################################################

-- ============================================================================
-- Palqueate · 0006 · Verificación de palcos
-- ----------------------------------------------------------------------------
-- Registro de cada revisión del admin (RF-45) y el detalle de campos observados
-- con su motivo y la respuesta del palquista (RD-08, RF-40). Se conserva el
-- HISTORIAL completo de revisiones: cada aprobación/rechazo queda registrada,
-- y la última revisión "vigente" es la que ve el palquista para corregir.
-- ============================================================================


-- --- Revisiones -------------------------------------------------------------
CREATE TABLE palco_reviews (
  id           uuid            PRIMARY KEY DEFAULT uuidv7(),
  palco_id     uuid            NOT NULL REFERENCES palcos(id) ON DELETE CASCADE,
  decision     review_decision NOT NULL,
  reason       text,                                  -- motivo general (sólo en reject)
  reviewed_by  uuid            REFERENCES users(id),  -- admin que revisó
  reviewed_at  timestamptz     NOT NULL DEFAULT now(),
  -- Marca la revisión vigente (la mostrada al palquista). Sólo una por palco.
  is_current   boolean         NOT NULL DEFAULT true
);
-- RN-09 (al rechazar: motivo general O al menos un campo observado, y cada
-- campo con su motivo) se valida con trigger diferido en 0011, ya que un CHECK
-- de fila no puede consultar la tabla hija palco_review_field_flags.
COMMENT ON TABLE palco_reviews IS 'Revisiones de verificación de un palco (RF-45). Historial completo.';
CREATE INDEX ix_palco_reviews_palco ON palco_reviews (palco_id, reviewed_at DESC);
-- A lo sumo una revisión vigente por palco.
CREATE UNIQUE INDEX uq_palco_reviews_current ON palco_reviews (palco_id) WHERE is_current;

-- --- Campos observados ------------------------------------------------------
CREATE TABLE palco_review_field_flags (
  id            uuid        PRIMARY KEY DEFAULT uuidv7(),
  review_id     uuid        NOT NULL REFERENCES palco_reviews(id) ON DELETE CASCADE,
  field_key     text        NOT NULL REFERENCES palco_review_field_defs(key),
  -- Motivo por el que el admin lo marcó (RN-09: cada campo observado lo lleva).
  reason        text        NOT NULL,
  -- Respuesta del palquista al reenviar (API §21 /resubmit).
  owner_reply   text,
  owner_replied_at timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (review_id, field_key)
);
COMMENT ON TABLE palco_review_field_flags IS 'Campos observados con su motivo y la respuesta del palquista (RD-08, RF-40).';
CREATE INDEX ix_review_flags_review ON palco_review_field_flags (review_id);


-- ####################################################################
-- ## 0007_cart_holds_availability.sql
-- ####################################################################

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


-- --- Carrito ----------------------------------------------------------------
CREATE TABLE carts (
  id          uuid        PRIMARY KEY DEFAULT uuidv7(),
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
  id            uuid         PRIMARY KEY DEFAULT uuidv7(),
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
  id            uuid         PRIMARY KEY DEFAULT uuidv7(),
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
  id            uuid         PRIMARY KEY DEFAULT uuidv7(),
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


-- ####################################################################
-- ## 0008_orders_payments_payouts.sql
-- ####################################################################

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


-- --- Órdenes ----------------------------------------------------------------
CREATE TABLE orders (
  id              uuid         PRIMARY KEY DEFAULT uuidv7(),
  code            text         NOT NULL UNIQUE,     -- "PLQ-ME02" (código de acceso/QR)
  user_id         uuid         NOT NULL REFERENCES users(id),
  status          order_status NOT NULL DEFAULT 'paid',
  subtotal        money_amount NOT NULL,
  fee             money_amount NOT NULL,            -- comisión (RN-01)
  total           money_amount NOT NULL,            -- subtotal + fee - discount_total + food_total
  commission_rate ratio        NOT NULL,            -- tasa aplicada (snapshot, RNF-17)
  currency        currency_code NOT NULL DEFAULT 'UYU' REFERENCES currencies(code),
  -- Descuento aplicado a la compra. La PLATAFORMA lo absorbe: la comisión y el
  -- payout se calculan sobre el subtotal COMPLETO; el descuento sólo reduce lo
  -- que paga el hincha (sale del margen de Palqueate). Snapshot inmutable.
  discount_code_id uuid,                             -- FK a discount_codes (se agrega abajo)
  discount_total   money_amount NOT NULL DEFAULT 0,
  contact_name    text         NOT NULL,
  contact_email   email        NOT NULL,
  pay_method      pay_method   NOT NULL DEFAULT 'card',
  -- Snacks elegidos AL MOMENTO de reservar: se pagan combinados con el palco en
  -- este mismo total (líneas en snack_items con order_id = esta orden). NO pagan
  -- comisión ni entran al payout. Los snacks agregados DESPUÉS van en snack_orders.
  food_total      money_amount NOT NULL DEFAULT 0,
  idempotency_key text,                              -- evita doble cobro (API §23)
  placed_at       timestamptz  NOT NULL DEFAULT now(),
  created_at      timestamptz  NOT NULL DEFAULT now(),
  updated_at      timestamptz  NOT NULL DEFAULT now(),
  CHECK (discount_total <= subtotal),
  -- Pago combinado: palco (con su comisión y descuento) + snacks iniciales.
  CHECK (total = subtotal + fee - discount_total + food_total)
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
  id            uuid         PRIMARY KEY DEFAULT uuidv7(),  -- uid expuesto
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

-- --- Órdenes de snacks (botana) ---------------------------------------------
-- Una reserva (orders) puede tener 0..N órdenes de snacks compradas DESPUÉS, y
-- cada una se cobra por SEPARADO (checkout propio). Los snacks elegidos al
-- momento de reservar NO crean una snack_order: van como líneas en la propia
-- reserva (snack_items con order_id) y se pagan combinados (orders.total).
-- Los snacks no pagan comisión ni entran al payout: son ingreso aparte.
CREATE TABLE snack_orders (
  id              uuid         PRIMARY KEY DEFAULT uuidv7(),
  code            text         NOT NULL UNIQUE,     -- "PLQ-S-7F3A" (ticket de snacks)
  reservation_id  uuid         NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id         uuid         NOT NULL REFERENCES users(id),
  status          order_status NOT NULL DEFAULT 'paid',
  total           money_amount NOT NULL,            -- suma de sus líneas (sin comisión)
  currency        currency_code NOT NULL DEFAULT 'UYU' REFERENCES currencies(code),
  pay_method      pay_method   NOT NULL DEFAULT 'card',
  idempotency_key text,                              -- evita doble cobro del ticket de snacks
  placed_at       timestamptz  NOT NULL DEFAULT now(),
  created_at      timestamptz  NOT NULL DEFAULT now(),
  updated_at      timestamptz  NOT NULL DEFAULT now()
);
COMMENT ON TABLE snack_orders IS 'Compras de snacks posteriores a la reserva, con checkout/pago propio (RF-27).';
CREATE INDEX ix_snack_orders_reservation ON snack_orders (reservation_id);
CREATE INDEX ix_snack_orders_user ON snack_orders (user_id, placed_at DESC);
CREATE TRIGGER trg_snack_orders_updated
  BEFORE UPDATE ON snack_orders
  FOR EACH ROW EXECUTE FUNCTION palqueate.set_updated_at();

-- --- Líneas de snacks -------------------------------------------------------
-- Una sola tabla para TODAS las líneas de botana, con dos posibles padres:
--   · order_id        → snacks iniciales, pagados con la reserva.
--   · snack_order_id  → snacks de una compra posterior (checkout separado).
-- El CHECK garantiza exactamente un padre. Guarda snapshots (precio/nombre).
CREATE TABLE snack_items (
  id             uuid         PRIMARY KEY DEFAULT uuidv7(),
  order_id       uuid         REFERENCES orders(id) ON DELETE CASCADE,
  snack_order_id uuid         REFERENCES snack_orders(id) ON DELETE CASCADE,
  food_item_id   uuid         REFERENCES food_items(id),  -- NULL si el ítem se dio de baja
  name           text         NOT NULL,             -- snapshot
  qty            integer      NOT NULL CHECK (qty >= 1),
  unit_price     money_amount NOT NULL,             -- snapshot
  line_total     money_amount NOT NULL,             -- unit_price * qty
  created_at     timestamptz  NOT NULL DEFAULT now(),
  CHECK (num_nonnulls(order_id, snack_order_id) = 1)
);
COMMENT ON TABLE snack_items IS 'Líneas de botana: padre = reserva (snacks iniciales) o snack_order (compra posterior).';
CREATE INDEX ix_snack_items_order ON snack_items (order_id) WHERE order_id IS NOT NULL;
CREATE INDEX ix_snack_items_snack_order ON snack_items (snack_order_id) WHERE snack_order_id IS NOT NULL;

-- --- Pagos ------------------------------------------------------------------
-- Hoy el pago es SIMULADO (REQUERIMIENTOS §2.2). El modelo ya soporta el ciclo
-- real (autorización/captura/reembolso) para cuando se integre la pasarela.
CREATE TABLE payments (
  id             uuid         PRIMARY KEY DEFAULT uuidv7(),
  -- Un pago cubre una reserva (palco + snacks iniciales) O una orden de snacks
  -- posterior; exactamente uno de los dos padres.
  order_id       uuid         REFERENCES orders(id) ON DELETE CASCADE,
  snack_order_id uuid         REFERENCES snack_orders(id) ON DELETE CASCADE,
  method         pay_method   NOT NULL,
  amount         money_amount NOT NULL,
  currency       currency_code NOT NULL DEFAULT 'UYU' REFERENCES currencies(code),
  status         text         NOT NULL DEFAULT 'simulated'
                   CHECK (status IN ('simulated', 'authorized', 'captured', 'failed', 'refunded')),
  gateway_ref    text,                              -- referencia externa (sin datos de tarjeta)
  card_brand     text,                              -- sólo brand
  card_last4     char(4),                           -- sólo last4; nunca PAN/CVV (API §5.4)
  created_at     timestamptz  NOT NULL DEFAULT now(),
  updated_at     timestamptz  NOT NULL DEFAULT now(),
  CHECK (num_nonnulls(order_id, snack_order_id) = 1)
);
COMMENT ON TABLE payments IS 'Pago de una reserva o de una orden de snacks. Hoy simulado; listo para pasarela (RI-06).';
CREATE INDEX ix_payments_order ON payments (order_id) WHERE order_id IS NOT NULL;
CREATE INDEX ix_payments_snack_order ON payments (snack_order_id) WHERE snack_order_id IS NOT NULL;
CREATE TRIGGER trg_payments_updated
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION palqueate.set_updated_at();

-- --- Payouts al palquista ---------------------------------------------------
-- payout = subtotal del palco − comisión (RN-02). Se desglosa por palco/dueño
-- porque una orden puede incluir ítems de distintos palcos/palquistas.
CREATE TABLE payouts (
  id                uuid          PRIMARY KEY DEFAULT uuidv7(),
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
  key            text         PRIMARY KEY,
  user_id        uuid         REFERENCES users(id) ON DELETE CASCADE,
  endpoint       text         NOT NULL,             -- "POST /orders" | "POST /orders/{code}/snacks"
  request_hash   bytea,                              -- hash del body para detectar reuse divergente
  order_id       uuid         REFERENCES orders(id),       -- reserva resultante
  snack_order_id uuid         REFERENCES snack_orders(id), -- orden de snacks resultante
  created_at     timestamptz  NOT NULL DEFAULT now(),
  expires_at     timestamptz  NOT NULL DEFAULT (now() + interval '24 hours')
);
COMMENT ON TABLE idempotency_keys IS 'Idempotencia del checkout de reserva y de snacks: evita doble cobro (API §23-24).';


-- ####################################################################
-- ## 0009_engagement_and_notifications.sql
-- ####################################################################

-- ============================================================================
-- Palqueate · 0009 · Interacción, métricas y notificaciones
-- ----------------------------------------------------------------------------
-- Insumos de las estadísticas del palquista y del dashboard admin que NO se
-- derivan sólo de las órdenes: vistas a publicaciones (para visitas/conversión,
-- RF-39), favoritos, calificaciones de clientes (origen del rating del palco) y
-- la bandeja de notificaciones (RF-32, y el aviso al palquista de RF-40/API §22,
-- modelada como outbox porque el envío real está fuera de alcance — §8).
-- ============================================================================


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
  id          uuid        PRIMARY KEY DEFAULT uuidv7(),
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
  id            uuid                 PRIMARY KEY DEFAULT uuidv7(),
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


-- ####################################################################
-- ## 0010_audit_logging.sql
-- ####################################################################

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
  ('snack.checkout',        'order',   'Checkout de una orden de snacks (posterior a la reserva)'),
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
  audit_id    uuid               NOT NULL DEFAULT uuidv7(),
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


-- ####################################################################
-- ## 0011_functions_and_triggers.sql
-- ####################################################################

-- ============================================================================
-- Palqueate · 0011 · Funciones y triggers de negocio
-- ----------------------------------------------------------------------------
-- Reglas que conviene imponer/automatizar en la base (no sólo en la app):
--   · Bitácora automática de cambios de estado del palco.
--   · Validación de rechazo (RN-09) con trigger diferido.
--   · "Una sola revisión vigente" por palco.
--   · Expiración de holds (job + lazy-on-read, API §4).
--   · Cálculo de butacas tomadas / disponibles por ámbito (RN-11).
--   · Recálculo del rating del palco a partir de las calificaciones.
--   · Generación del inventario de butacas de un palco.
-- ============================================================================


-- --- Bitácora de estados del palco ------------------------------------------
CREATE OR REPLACE FUNCTION palqueate.log_palco_status()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO palqueate.palco_status_history (palco_id, from_status, to_status, changed_by)
    VALUES (NEW.id, NULL, NEW.status, NEW.updated_by);
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO palqueate.palco_status_history (palco_id, from_status, to_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, NEW.updated_by);
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_palcos_status_history
  AFTER INSERT OR UPDATE OF status ON palcos
  FOR EACH ROW EXECUTE FUNCTION palqueate.log_palco_status();

-- --- "Una sola revisión vigente" --------------------------------------------
CREATE OR REPLACE FUNCTION palqueate.unset_prior_current_review()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.is_current THEN
    UPDATE palqueate.palco_reviews
       SET is_current = false
     WHERE palco_id = NEW.palco_id AND id <> NEW.id AND is_current;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_reviews_single_current
  BEFORE INSERT OR UPDATE OF is_current ON palco_reviews
  FOR EACH ROW EXECUTE FUNCTION palqueate.unset_prior_current_review();

-- --- Validación de rechazo (RN-09) ------------------------------------------
-- Al rechazar debe haber motivo general O al menos un campo observado. Trigger
-- diferido para poder insertar la revisión y sus flags en la misma transacción.
CREATE OR REPLACE FUNCTION palqueate.check_review_completeness()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.decision = 'reject'
     AND (NEW.reason IS NULL OR btrim(NEW.reason) = '')
     AND NOT EXISTS (SELECT 1 FROM palqueate.palco_review_field_flags WHERE review_id = NEW.id)
  THEN
    RAISE EXCEPTION 'RN-09: un rechazo requiere motivo general o al menos un campo observado (review %)', NEW.id;
  END IF;
  RETURN NEW;
END;
$$;
CREATE CONSTRAINT TRIGGER trg_review_completeness
  AFTER INSERT OR UPDATE ON palco_reviews
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION palqueate.check_review_completeness();

-- --- Expiración de holds (API §4) -------------------------------------------
-- Libera los bloqueos vencidos y marca los holds como expirados. Se invoca por
-- un job periódico y/o de forma perezosa antes de leer disponibilidad.
CREATE OR REPLACE FUNCTION palqueate.expire_holds()
RETURNS integer LANGUAGE plpgsql AS $$
DECLARE
  v_count integer;
BEGIN
  DELETE FROM palqueate.seat_reservations
   WHERE state = 'held' AND expires_at < now();

  UPDATE palqueate.holds
     SET status = 'expired', released_at = now()
   WHERE status = 'active' AND expires_at < now();
  GET DIAGNOSTICS v_count = ROW_COUNT;

  RETURN v_count;
END;
$$;
COMMENT ON FUNCTION palqueate.expire_holds() IS 'Vence holds y libera asientos (job + lazy-on-read, API §4).';

-- --- Disponibilidad por ámbito (RN-11) --------------------------------------
-- Devuelve las butacas TOMADAS (held + sold) de un palco en un ámbito concreto.
-- Para seatEvent se pasa la función (occurrence); para seatYear, la temporada.
CREATE OR REPLACE FUNCTION palqueate.taken_seats(
  p_palco uuid, p_mode palco_mode, p_season uuid DEFAULT NULL, p_occurrence uuid DEFAULT NULL
) RETURNS integer[] LANGUAGE sql STABLE AS $$
  SELECT coalesce(array_agg(seat_number ORDER BY seat_number), '{}')
  FROM palqueate.seat_reservations sr
  WHERE sr.palco_id = p_palco
    AND sr.mode = p_mode
    AND sr.seat_number IS NOT NULL
    AND (sr.state = 'sold' OR sr.expires_at > now())
    AND ( (p_mode = 'seatEvent' AND sr.occurrence_id = p_occurrence)
       OR (p_mode = 'seatYear'  AND sr.season_id = p_season) );
$$;
COMMENT ON FUNCTION palqueate.taken_seats(uuid, palco_mode, uuid, uuid)
  IS 'Butacas ocupadas (vendidas + en hold vigente) por ámbito (RN-11).';

-- ¿Está el palco entero tomado para una temporada (palcoYear)?
CREATE OR REPLACE FUNCTION palqueate.palco_year_taken(p_palco uuid, p_season uuid)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM palqueate.seat_reservations sr
     WHERE sr.palco_id = p_palco AND sr.mode = 'palcoYear' AND sr.season_id = p_season
       AND (sr.state = 'sold' OR sr.expires_at > now())
  );
$$;

-- --- Recálculo del rating del palco -----------------------------------------
CREATE OR REPLACE FUNCTION palqueate.refresh_palco_rating()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_palco uuid := COALESCE(NEW.palco_id, OLD.palco_id);
BEGIN
  UPDATE palqueate.palcos p
     SET rating = COALESCE((
       SELECT round(avg(score)::numeric, 1) FROM palqueate.palco_ratings WHERE palco_id = v_palco
     ), 0)
   WHERE p.id = v_palco;
  RETURN NULL;
END;
$$;
CREATE TRIGGER trg_palco_rating_refresh
  AFTER INSERT OR UPDATE OR DELETE ON palco_ratings
  FOR EACH ROW EXECUTE FUNCTION palqueate.refresh_palco_rating();

-- --- Generación del inventario de butacas -----------------------------------
-- Crea/sincroniza las filas de palco_seats (1..seat_count) de un palco.
CREATE OR REPLACE FUNCTION palqueate.generate_palco_seats(p_palco uuid)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_n integer;
BEGIN
  SELECT seat_count INTO v_n FROM palqueate.palcos WHERE id = p_palco;
  INSERT INTO palqueate.palco_seats (palco_id, seat_number)
  SELECT p_palco, gs FROM generate_series(1, v_n) AS gs
  ON CONFLICT (palco_id, seat_number) DO NOTHING;
  DELETE FROM palqueate.palco_seats WHERE palco_id = p_palco AND seat_number > v_n;
END;
$$;
COMMENT ON FUNCTION palqueate.generate_palco_seats(uuid) IS 'Materializa el inventario de butacas 1..seat_count.';


-- ####################################################################
-- ## 0012_views.sql
-- ####################################################################

-- ============================================================================
-- Palqueate · 0012 · Vistas de lectura
-- ----------------------------------------------------------------------------
-- Vistas que respaldan los endpoints de lectura, dejando las agregaciones en la
-- base (hoy se calculan en el cliente — API §7). No reemplazan la capa de API:
-- ésta arma el JSON final, pero estas vistas son la fuente única de los números.
-- ============================================================================


-- --- Precio "desde" de cada palco (modalidad activa más barata) -------------
CREATE OR REPLACE VIEW v_palco_min_price AS
SELECT m.palco_id,
       min(m.price) FILTER (WHERE m.is_on) AS from_price
FROM palco_modes m
GROUP BY m.palco_id;
COMMENT ON VIEW v_palco_min_price IS 'Precio "desde" (modalidad activa más económica) — RF-09.';

-- --- Catálogo público -------------------------------------------------------
-- Sólo palcos publicado/alquilado (RN-03), con datos de tarjeta del catálogo.
CREATE OR REPLACE VIEW v_public_palcos AS
SELECT p.id, p.title, p.sector, p.rating, p.seat_count,
       p.has_parking, p.parking_spots, p.map_x, p.map_y,
       p.stadium_id, s.name AS stadium_name, s.short_name AS stadium_short,
       p.country_code, p.host_label,
       mp.from_price,
       (SELECT count(*) FROM palco_images pi WHERE pi.palco_id = p.id) AS photo_count
FROM palcos p
JOIN stadiums s ON s.id = p.stadium_id
LEFT JOIN v_palco_min_price mp ON mp.palco_id = p.id
WHERE p.status IN ('publicado', 'alquilado') AND p.deleted_at IS NULL;
COMMENT ON VIEW v_public_palcos IS 'Catálogo visible al público (RN-03, RF-09). Base de GET /palcos.';

-- --- CRM de clientes (API §30) ----------------------------------------------
CREATE OR REPLACE VIEW v_client_crm AS
SELECT u.id, u.name, u.email, u.phone,
       palqueate.is_admin(u.id) AS is_admin,
       u.points,
       count(o.id)                       AS orders_count,
       COALESCE(sum(o.total), 0)::bigint AS spent
FROM users u
LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'paid'
WHERE u.deleted_at IS NULL
GROUP BY u.id;
COMMENT ON VIEW v_client_crm IS 'Clientes con gasto total, reservas y puntos (RF-46, API §30).';

-- --- Métricas por palco (palquista, API §26) --------------------------------
CREATE OR REPLACE VIEW v_owner_palco_metrics AS
SELECT p.id AS palco_id, p.owner_id, p.title, p.status, p.rating,
       s.name AS stadium_name, p.seat_count,
       -- Recaudación: suma de líneas de orden de este palco.
       COALESCE((SELECT sum(oi.line_total) FROM order_items oi WHERE oi.palco_id = p.id), 0)::bigint AS revenue,
       -- Butacas anuales vendidas (temporada vigente) y su capacidad.
       (SELECT count(*) FROM seat_reservations sr
          WHERE sr.palco_id = p.id AND sr.mode = 'seatYear' AND sr.state = 'sold') AS annual_seats,
       p.seat_count AS annual_capacity,
       -- Entradas vendidas por evento (modalidad seatEvent).
       (SELECT count(*) FROM seat_reservations sr
          WHERE sr.palco_id = p.id AND sr.mode = 'seatEvent' AND sr.state = 'sold') AS event_tickets,
       (SELECT count(*) FROM palco_view_events v WHERE v.palco_id = p.id) AS views,
       (SELECT count(*) FROM palco_favorites f WHERE f.palco_id = p.id) AS favs
FROM palcos p
JOIN stadiums s ON s.id = p.stadium_id
WHERE p.deleted_at IS NULL;
COMMENT ON VIEW v_owner_palco_metrics IS 'KPIs por palco para el panel del palquista (RF-39, API §26).';

-- --- Finanzas por estadio (admin, API §27/§48) ------------------------------
CREATE OR REPLACE VIEW v_finance_by_stadium AS
SELECT s.id AS stadium_id, s.name,
       COALESCE(sum(oi.line_total), 0)::bigint                       AS gross,
       COALESCE(sum(round(oi.line_total * o.commission_rate)), 0)::bigint AS commission,
       COALESCE(sum(oi.line_total - round(oi.line_total * o.commission_rate)), 0)::bigint AS payout
FROM stadiums s
LEFT JOIN order_items oi ON oi.stadium_id = s.id
LEFT JOIN orders o ON o.id = oi.order_id AND o.status = 'paid'
GROUP BY s.id;
COMMENT ON VIEW v_finance_by_stadium IS 'GMV, comisión y payout por estadio (RF-48, API §27).';

-- --- Ventas mensuales (admin) -----------------------------------------------
CREATE OR REPLACE VIEW v_monthly_sales AS
SELECT date_trunc('month', o.placed_at)::date AS month,
       sum(o.subtotal)::bigint AS gross,
       sum(o.fee)::bigint      AS commission,
       sum(o.total)::bigint    AS total,
       count(*)                AS orders_count
FROM orders o
WHERE o.status = 'paid'
GROUP BY 1
ORDER BY 1;
COMMENT ON VIEW v_monthly_sales IS 'Serie mensual de ventas para el dashboard (RF-48/49, API §27).';

-- --- Mix por modalidad (admin) ----------------------------------------------
CREATE OR REPLACE VIEW v_modality_mix AS
SELECT oi.mode, sum(oi.line_total)::bigint AS revenue, count(*) AS lines
FROM order_items oi
JOIN orders o ON o.id = oi.order_id AND o.status = 'paid'
GROUP BY oi.mode;
COMMENT ON VIEW v_modality_mix IS 'Ingresos por modalidad para el dashboard (API §27).';

-- --- Ingresos por botana (admin) --------------------------------------------
-- Suma TODA la botana: snacks iniciales (líneas con order_id, pagados con la
-- reserva) + órdenes de snacks posteriores (snack_order_id). Ingreso aparte:
-- no paga comisión ni entra al payout. KPI foodRevenue del dashboard (API §27).
CREATE OR REPLACE VIEW v_food_revenue AS
SELECT date_trunc('month', COALESCE(o.placed_at, so.placed_at))::date AS month,
       sum(si.line_total)::bigint                              AS food_revenue,
       count(DISTINCT COALESCE(si.order_id, si.snack_order_id)) AS food_tickets
FROM snack_items si
LEFT JOIN orders o        ON o.id = si.order_id
LEFT JOIN snack_orders so ON so.id = si.snack_order_id
WHERE COALESCE(o.status, so.status) = 'paid'
GROUP BY 1
ORDER BY 1;
COMMENT ON VIEW v_food_revenue IS 'Ingreso por botana (snacks iniciales + órdenes de snacks). Aparte de comisión/payout.';


-- ####################################################################
-- ## 0013_discounts.sql
-- ####################################################################
-- Códigos de descuento aplicables a una compra. Cada código se PROGRAMA: tiene
-- ventana de validez (entrada/salida), es porcentual o de valor fijo, admite
-- tope, mínimo de compra, e interruptor manual, y se le ponen límites de uso
-- (total y por usuario). El descuento lo ABSORBE LA PLATAFORMA: la comisión
-- (RN-01) y el payout (RN-02) se calculan sobre el subtotal completo; el código
-- sólo reduce lo que paga el hincha. `discount_redemptions` es el libro de usos
-- (un código por orden) y mantiene el contador para los límites.

CREATE TYPE discount_kind AS ENUM ('percentage', 'fixed');

CREATE TABLE discount_codes (
  id              uuid          PRIMARY KEY DEFAULT uuidv7(),
  code            citext        NOT NULL UNIQUE,     -- lo que tipea el usuario (case-insensitive)
  description     text          NOT NULL DEFAULT '',
  kind            discount_kind NOT NULL,
  -- 'percentage' usa percent_off (0..1, p.ej. 0.15 = 15%); 'fixed' usa amount_off.
  percent_off     ratio,
  amount_off      money_amount,
  currency        currency_code REFERENCES currencies(code),
  max_discount    money_amount,                       -- tope del descuento (para porcentuales)
  min_subtotal    money_amount  NOT NULL DEFAULT 0,   -- subtotal mínimo para que aplique
  -- Programación entrada/salida (NULL = abierto por ese extremo).
  starts_at       timestamptz,
  ends_at         timestamptz,
  is_active       boolean       NOT NULL DEFAULT true, -- interruptor manual (kill switch)
  -- Límites de uso.
  max_redemptions integer       CHECK (max_redemptions IS NULL OR max_redemptions > 0), -- total
  max_per_user    integer       CHECK (max_per_user IS NULL OR max_per_user > 0),
  times_redeemed  integer       NOT NULL DEFAULT 0,   -- contador (trigger)
  created_at      timestamptz   NOT NULL DEFAULT now(),
  updated_at      timestamptz   NOT NULL DEFAULT now(),
  created_by      uuid          REFERENCES users(id),
  deleted_at      timestamptz,
  -- Coherencia tipo/valor: exactamente uno según el kind.
  CHECK ( (kind = 'percentage' AND percent_off IS NOT NULL AND amount_off IS NULL)
       OR (kind = 'fixed'      AND amount_off  IS NOT NULL AND percent_off IS NULL) ),
  CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at > starts_at),
  -- "Existencias": el contador no puede superar el cupo total. Junto con el
  -- bloqueo de fila del trigger de conteo, hace el límite ATÓMICO (sin
  -- sobreventa por checkouts concurrentes). NULL en max_redemptions = ilimitado.
  CONSTRAINT chk_within_max_redemptions
    CHECK (max_redemptions IS NULL OR times_redeemed <= max_redemptions)
);
COMMENT ON TABLE discount_codes IS 'Códigos de descuento programables (ventana, %/fijo, topes, existencias). La plataforma absorbe el descuento.';
COMMENT ON COLUMN discount_codes.percent_off IS 'Descuento porcentual 0..1 (0.15 = 15%). Sólo si kind=percentage.';
COMMENT ON COLUMN discount_codes.max_discount IS 'Tope máximo del descuento en dinero (útil para porcentuales).';
COMMENT ON COLUMN discount_codes.max_redemptions IS 'Existencias: cupo total de usos del código (NULL = ilimitado). Límite duro.';
-- Código único entre los vivos (permite reusar el texto si uno fue borrado).
CREATE UNIQUE INDEX uq_discount_code_active ON discount_codes (code) WHERE deleted_at IS NULL;
-- Búsqueda de códigos vigentes por ventana.
CREATE INDEX ix_discount_codes_window ON discount_codes (is_active, starts_at, ends_at) WHERE deleted_at IS NULL;
CREATE TRIGGER trg_discount_codes_updated
  BEFORE UPDATE ON discount_codes
  FOR EACH ROW EXECUTE FUNCTION palqueate.set_updated_at();

-- FK pendiente de orders.discount_code_id (declarado arriba).
ALTER TABLE orders
  ADD CONSTRAINT fk_orders_discount_code
  FOREIGN KEY (discount_code_id) REFERENCES discount_codes(id);

-- --- Usos (libro mayor) -----------------------------------------------------
CREATE TABLE discount_redemptions (
  id               uuid         PRIMARY KEY DEFAULT uuidv7(),
  discount_code_id uuid         NOT NULL REFERENCES discount_codes(id),
  order_id         uuid         NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id          uuid         REFERENCES users(id),
  amount_applied   money_amount NOT NULL,             -- descuento efectivo aplicado
  redeemed_at      timestamptz  NOT NULL DEFAULT now(),
  UNIQUE (order_id)                                    -- un código por compra
);
COMMENT ON TABLE discount_redemptions IS 'Usos de códigos de descuento: un código por orden; base de los límites y analítica.';
CREATE INDEX ix_discount_redemptions_code ON discount_redemptions (discount_code_id);
CREATE INDEX ix_discount_redemptions_user ON discount_redemptions (discount_code_id, user_id);

-- Mantiene el contador times_redeemed.
CREATE OR REPLACE FUNCTION palqueate.bump_discount_redemptions()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE palqueate.discount_codes SET times_redeemed = times_redeemed + 1
     WHERE id = NEW.discount_code_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE palqueate.discount_codes SET times_redeemed = greatest(times_redeemed - 1, 0)
     WHERE id = OLD.discount_code_id;
  END IF;
  RETURN NULL;
END;
$$;
CREATE TRIGGER trg_discount_redemptions_counter
  AFTER INSERT OR DELETE ON discount_redemptions
  FOR EACH ROW EXECUTE FUNCTION palqueate.bump_discount_redemptions();

-- --- Validación y cálculo del descuento -------------------------------------
-- Devuelve (valid, reason, code_id, amount): valida ventana, estado, mínimo de
-- compra y límites (total y por usuario), y calcula el monto a descontar con su
-- tope. El checkout la invoca dentro de su transacción para evitar carreras.
CREATE OR REPLACE FUNCTION palqueate.validate_discount(
  p_code citext, p_subtotal money_amount, p_user uuid DEFAULT NULL
) RETURNS TABLE (valid boolean, reason text, code_id uuid, amount bigint)
LANGUAGE plpgsql STABLE AS $$
DECLARE
  c           palqueate.discount_codes%ROWTYPE;
  v_amount    bigint;
  v_user_uses integer;
BEGIN
  SELECT * INTO c FROM palqueate.discount_codes
   WHERE code = p_code AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'not_found', NULL::uuid, 0::bigint; RETURN;
  END IF;
  IF NOT c.is_active THEN
    RETURN QUERY SELECT false, 'inactive', c.id, 0::bigint; RETURN;
  END IF;
  IF c.starts_at IS NOT NULL AND now() < c.starts_at THEN
    RETURN QUERY SELECT false, 'not_started', c.id, 0::bigint; RETURN;
  END IF;
  IF c.ends_at IS NOT NULL AND now() > c.ends_at THEN
    RETURN QUERY SELECT false, 'expired', c.id, 0::bigint; RETURN;
  END IF;
  IF p_subtotal < c.min_subtotal THEN
    RETURN QUERY SELECT false, 'below_min_subtotal', c.id, 0::bigint; RETURN;
  END IF;
  IF c.max_redemptions IS NOT NULL AND c.times_redeemed >= c.max_redemptions THEN
    RETURN QUERY SELECT false, 'redemption_limit', c.id, 0::bigint; RETURN;
  END IF;
  IF c.max_per_user IS NOT NULL AND p_user IS NOT NULL THEN
    SELECT count(*) INTO v_user_uses FROM palqueate.discount_redemptions
      WHERE discount_code_id = c.id AND user_id = p_user;
    IF v_user_uses >= c.max_per_user THEN
      RETURN QUERY SELECT false, 'per_user_limit', c.id, 0::bigint; RETURN;
    END IF;
  END IF;

  -- Cálculo del monto.
  IF c.kind = 'fixed' THEN
    v_amount := least(c.amount_off, p_subtotal);
  ELSE
    v_amount := round(p_subtotal * c.percent_off)::bigint;
  END IF;
  IF c.max_discount IS NOT NULL THEN
    v_amount := least(v_amount, c.max_discount);
  END IF;
  v_amount := least(v_amount, p_subtotal);   -- nunca descuenta más que el subtotal

  RETURN QUERY SELECT true, 'ok', c.id, v_amount;
END;
$$;
COMMENT ON FUNCTION palqueate.validate_discount(citext, money_amount, uuid)
  IS 'Valida un código (ventana, estado, mínimo, límites) y calcula el descuento a aplicar.';

-- --- Vista de uso de códigos (admin) ----------------------------------------
CREATE OR REPLACE VIEW v_discount_usage AS
SELECT d.id, d.code, d.kind, d.is_active, d.starts_at, d.ends_at,
       d.times_redeemed, d.max_redemptions,
       -- Existencias restantes (NULL = ilimitado).
       CASE WHEN d.max_redemptions IS NULL THEN NULL
            ELSE greatest(d.max_redemptions - d.times_redeemed, 0) END AS remaining,
       COALESCE(sum(r.amount_applied), 0)::bigint AS total_discounted,
       count(r.id)                                AS orders_with_code
FROM discount_codes d
LEFT JOIN discount_redemptions r ON r.discount_code_id = d.id
WHERE d.deleted_at IS NULL
GROUP BY d.id;
COMMENT ON VIEW v_discount_usage IS 'Uso y costo (absorbido por la plataforma) de cada código de descuento.';


COMMIT;
