-- ============================================================================
-- Palqueate · 0005 · Palcos (publicaciones)
-- ----------------------------------------------------------------------------
-- El palco y todo lo que lo compone: modalidades con precio, inventario de
-- butacas, co-propietarios, datos de cobro (confidenciales) y su documentación,
-- fotos e historial de estados. La ocupación de butacas y la verificación se
-- modelan en migraciones aparte (0006, 0007).
-- ============================================================================

BEGIN;
SET search_path = palqueate, public;

-- --- Palcos -----------------------------------------------------------------
CREATE TABLE palcos (
  id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  palco_id    uuid        NOT NULL REFERENCES palcos(id) ON DELETE CASCADE,
  seat_number integer     NOT NULL CHECK (seat_number >= 1),
  label       text,                               -- etiqueta opcional ("A1")
  UNIQUE (palco_id, seat_number)
);
COMMENT ON TABLE palco_seats IS 'Inventario de butacas por palco; base de la disponibilidad (RD-04).';
CREATE INDEX ix_palco_seats_palco ON palco_seats (palco_id);

-- --- Co-propietarios --------------------------------------------------------
CREATE TABLE palco_co_owners (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  palco_id    uuid         NOT NULL REFERENCES palcos(id) ON DELETE CASCADE,
  from_status palco_status,
  to_status   palco_status NOT NULL,
  changed_by  uuid         REFERENCES users(id),   -- palquista o admin
  reason      text,
  changed_at  timestamptz  NOT NULL DEFAULT now()
);
COMMENT ON TABLE palco_status_history IS 'Bitácora de transiciones de estado del palco (trazabilidad de su ciclo de vida).';
CREATE INDEX ix_palco_status_history_palco ON palco_status_history (palco_id, changed_at);

COMMIT;
