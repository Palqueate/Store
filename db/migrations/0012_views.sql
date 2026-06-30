-- ============================================================================
-- Palqueate · 0012 · Vistas de lectura
-- ----------------------------------------------------------------------------
-- Vistas que respaldan los endpoints de lectura, dejando las agregaciones en la
-- base (hoy se calculan en el cliente — API §7). No reemplazan la capa de API:
-- ésta arma el JSON final, pero estas vistas son la fuente única de los números.
-- ============================================================================

BEGIN;
SET search_path = palqueate, public;

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

COMMIT;
