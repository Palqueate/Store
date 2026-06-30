-- ============================================================================
-- Palqueate · 0004 · Estadios y eventos
-- ----------------------------------------------------------------------------
-- Estadios (alta del admin), eventos y sus funciones (fecha + hora). Un evento
-- tiene 1..N funciones (RD-02): fútbol normalmente una, los shows varias.
-- La disponibilidad de "asiento por evento" se indexa por FUNCIÓN (RN-11), por
-- eso event_occurrences es una entidad de primer nivel referenciada por la
-- ocupación y por las órdenes.
-- ============================================================================

BEGIN;
SET search_path = palqueate, public;

-- --- Estadios ---------------------------------------------------------------
CREATE TABLE stadiums (
  id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
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

COMMIT;
