-- ============================================================================
-- Palqueate · 0006 · Verificación de palcos
-- ----------------------------------------------------------------------------
-- Registro de cada revisión del admin (RF-45) y el detalle de campos observados
-- con su motivo y la respuesta del palquista (RD-08, RF-40). Se conserva el
-- HISTORIAL completo de revisiones: cada aprobación/rechazo queda registrada,
-- y la última revisión "vigente" es la que ve el palquista para corregir.
-- ============================================================================

BEGIN;
SET search_path = palqueate, public;

-- --- Revisiones -------------------------------------------------------------
CREATE TABLE palco_reviews (
  id           uuid            PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
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

COMMIT;
