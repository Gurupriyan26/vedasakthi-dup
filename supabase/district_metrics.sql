-- ============================================================
-- TABLE: district_metrics
-- Description: One metrics record per district, linked via FK
-- Compatible with: Supabase PostgreSQL
-- ============================================================

CREATE TABLE IF NOT EXISTS district_metrics (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id      INTEGER NOT NULL REFERENCES districts(id) ON DELETE CASCADE,

    total_schools    INTEGER,
    attendance       NUMERIC(5,2),
    neet_qualified   INTEGER,
    hi_tech_labs     NUMERIC(5,2),
    teachers_staffed NUMERIC(5,2),
    electricity      NUMERIC(5,2),
    wash_audited     NUMERIC(5,2),
    active_blocks    INTEGER,

    created_at       TIMESTAMP DEFAULT NOW(),
    updated_at       TIMESTAMP DEFAULT NOW(),

    -- One metrics row per district
    CONSTRAINT uq_district_metrics_district_id UNIQUE (district_id),

    -- Range checks for percentage columns
    CONSTRAINT chk_attendance        CHECK (attendance        BETWEEN 0 AND 100),
    CONSTRAINT chk_hi_tech_labs      CHECK (hi_tech_labs      BETWEEN 0 AND 100),
    CONSTRAINT chk_teachers_staffed  CHECK (teachers_staffed  BETWEEN 0 AND 100),
    CONSTRAINT chk_electricity       CHECK (electricity       BETWEEN 0 AND 100),
    CONSTRAINT chk_wash_audited      CHECK (wash_audited      BETWEEN 0 AND 100),

    -- Non-negative integer checks
    CONSTRAINT chk_total_schools     CHECK (total_schools  >= 0),
    CONSTRAINT chk_neet_qualified    CHECK (neet_qualified >= 0),
    CONSTRAINT chk_active_blocks     CHECK (active_blocks  >= 0)
);

-- Index for fast FK lookups
CREATE INDEX IF NOT EXISTS idx_district_metrics_district_id
    ON district_metrics (district_id);

-- Auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_district_metrics_updated_at ON district_metrics;
CREATE TRIGGER trg_district_metrics_updated_at
    BEFORE UPDATE ON district_metrics
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();


-- ============================================================
-- SEED DATA -- All 38 Tamil Nadu Districts
-- Uses lgd_code to look up district_id dynamically
-- ============================================================

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 1250, 94.50, 1450, 91.00, 96.00, 99.00, 97.00, 15
FROM districts WHERE lgd_code = 568; -- Chennai

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 980, 91.20, 1120, 87.50, 93.00, 98.50, 95.00, 12
FROM districts WHERE lgd_code = 569; -- Coimbatore

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 870, 89.75, 980, 85.00, 91.50, 97.00, 93.50, 14
FROM districts WHERE lgd_code = 578; -- Madurai

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 760, 88.40, 850, 83.00, 90.00, 96.50, 92.00, 11
FROM districts WHERE lgd_code = 591; -- Tiruchirappalli

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 690, 87.60, 780, 82.50, 89.50, 95.50, 91.00, 10
FROM districts WHERE lgd_code = 584; -- Salem

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 540, 86.30, 620, 80.00, 88.00, 94.00, 89.50, 9
FROM districts WHERE lgd_code = 592; -- Tirunelveli

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 610, 85.90, 670, 79.50, 87.50, 93.50, 88.00, 10
FROM districts WHERE lgd_code = 634; -- Tiruppur

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 720, 87.10, 790, 81.00, 89.00, 95.00, 90.50, 11
FROM districts WHERE lgd_code = 595; -- Vellore

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 480, 84.70, 530, 77.00, 86.00, 92.00, 87.00, 8
FROM districts WHERE lgd_code = 573; -- Erode

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 550, 85.50, 600, 78.50, 87.00, 93.00, 88.50, 9
FROM districts WHERE lgd_code = 588; -- Theni

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 820, 88.80, 910, 84.00, 90.50, 96.00, 92.50, 13
FROM districts WHERE lgd_code = 574; -- Kancheepuram

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 670, 86.60, 730, 80.50, 88.50, 94.50, 90.00, 10
FROM districts WHERE lgd_code = 589; -- Tiruvallur

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 430, 83.90, 480, 75.50, 85.00, 91.00, 86.00, 7
FROM districts WHERE lgd_code = 570; -- Cuddalore

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 390, 82.50, 420, 73.00, 84.00, 89.50, 84.50, 7
FROM districts WHERE lgd_code = 596; -- Villupuram

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 510, 85.10, 560, 78.00, 86.50, 92.50, 87.50, 8
FROM districts WHERE lgd_code = 579; -- Nagapattinam

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 460, 84.20, 510, 76.50, 85.50, 91.50, 86.50, 8
FROM districts WHERE lgd_code = 586; -- Thanjavur

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 380, 82.00, 410, 72.50, 83.50, 89.00, 84.00, 6
FROM districts WHERE lgd_code = 590; -- Tiruvarur

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 420, 83.30, 460, 74.50, 84.50, 90.50, 85.50, 7
FROM districts WHERE lgd_code = 582; -- Pudukkottai

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 350, 81.50, 380, 71.00, 83.00, 88.50, 83.50, 6
FROM districts WHERE lgd_code = 585; -- Sivaganga

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 490, 84.80, 540, 77.50, 86.00, 92.00, 87.00, 8
FROM districts WHERE lgd_code = 583; -- Ramanathapuram

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 400, 83.00, 440, 74.00, 84.00, 90.00, 85.00, 7
FROM districts WHERE lgd_code = 594; -- Thoothukudi (Tuticorin)

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 330, 80.80, 360, 70.00, 82.00, 87.50, 82.50, 6
FROM districts WHERE lgd_code = 575; -- Kanyakumari

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 580, 85.70, 640, 79.00, 87.00, 93.00, 88.00, 9
FROM districts WHERE lgd_code = 580; -- Namakkal

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 310, 80.20, 340, 69.00, 81.50, 87.00, 82.00, 5
FROM districts WHERE lgd_code = 571; -- Dharmapuri

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 290, 79.50, 320, 68.00, 81.00, 86.50, 81.50, 5
FROM districts WHERE lgd_code = 577; -- Krishnagiri

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 360, 81.80, 390, 72.00, 83.00, 88.50, 83.50, 6
FROM districts WHERE lgd_code = 581; -- Perambalur

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 270, 79.00, 295, 67.00, 80.50, 86.00, 81.00, 5
FROM districts WHERE lgd_code = 610; -- Ariyalur

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 630, 86.20, 690, 80.00, 88.00, 93.50, 89.00, 10
FROM districts WHERE lgd_code = 572; -- Dindigul

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 440, 83.60, 490, 75.00, 85.50, 91.00, 86.00, 8
FROM districts WHERE lgd_code = 597; -- Virudhunagar

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 560, 85.30, 610, 78.50, 86.50, 92.50, 87.50, 9
FROM districts WHERE lgd_code = 593; -- Tiruvannamalai

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 750, 87.80, 830, 83.00, 89.50, 95.00, 91.50, 11
FROM districts WHERE lgd_code = 730; -- Chengalpattu

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 680, 86.90, 750, 81.50, 89.00, 94.50, 90.50, 10
FROM districts WHERE lgd_code = 731; -- Ranipet

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 700, 87.00, 770, 82.00, 89.00, 95.00, 91.00, 11
FROM districts WHERE lgd_code = 733; -- Tenkasi

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 590, 85.80, 650, 79.50, 87.50, 93.00, 88.50, 9
FROM districts WHERE lgd_code = 732; -- Tirupathur

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 320, 80.50, 350, 69.50, 82.00, 87.50, 82.50, 5
FROM districts WHERE lgd_code = 735; -- Mayiladuthurai

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 410, 83.20, 450, 74.00, 84.50, 90.50, 85.50, 7
FROM districts WHERE lgd_code = 729; -- Kallakurichi

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 280, 79.30, 308, 67.50, 81.00, 86.50, 81.50, 5
FROM districts WHERE lgd_code = 587; -- Nilgiris

INSERT INTO district_metrics (
    district_id, total_schools, attendance, neet_qualified,
    hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks
)
SELECT id, 260, 78.80, 285, 66.50, 80.50, 86.00, 81.00, 4
FROM districts WHERE lgd_code = 576; -- Karur
