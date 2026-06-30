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
--   · Claves primarias UUID opacas (gen_random_uuid) — el backend nunca expone
--     ids secuenciales y el front "nunca los inventa" (ver API_ENDPOINTS §1).
--   · Dinero: enteros en pesos uruguayos, SIN decimales (dominio money_amount).
--   · Tiempos: siempre timestamptz (UTC). Las fechas "humanas" del front
--     (month/day/dow) se derivan en la capa de presentación, no se persisten.
--   · created_at / updated_at en toda tabla mutable; updated_at vía trigger.
--   · Borrado lógico (deleted_at) en entidades de negocio que no deben perderse.
-- ============================================================================

BEGIN;

-- --- Extensiones ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid(), digest() para hashes
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

SET search_path = palqueate, public;

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

COMMIT;
