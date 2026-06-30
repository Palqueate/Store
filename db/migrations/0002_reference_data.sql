-- ============================================================================
-- Palqueate · 0002 · Datos de referencia y configuración
-- ----------------------------------------------------------------------------
-- Catálogos estables y de baja cardinalidad: países, monedas, temporadas,
-- comodidades, tipos de evento, catálogo de botana, roles, definiciones de
-- campos verificables y la configuración global de la plataforma.
-- Centralizar estas tablas hace que las reglas (comisión, TTL de holds, lista
-- de comodidades, etc.) se ajusten en datos y no en código (RNF-17).
-- ============================================================================

BEGIN;
SET search_path = palqueate, public;

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
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
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

COMMIT;
