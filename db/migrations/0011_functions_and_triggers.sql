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

BEGIN;
SET search_path = palqueate, public;

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

COMMIT;
