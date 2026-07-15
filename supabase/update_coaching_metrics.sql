-- ============================================================
-- ALTER TABLE AND UPDATE COACHING METRICS
-- ============================================================

ALTER TABLE district_metrics ADD COLUMN IF NOT EXISTS coaching_schools INTEGER DEFAULT 0;
ALTER TABLE district_metrics ADD COLUMN IF NOT EXISTS neet_coaching_enrolment_est INTEGER DEFAULT 0;
ALTER TABLE district_metrics ADD COLUMN IF NOT EXISTS jee_coaching_enrolment_est INTEGER DEFAULT 0;
ALTER TABLE district_metrics ADD COLUMN IF NOT EXISTS total_coaching_enrolment_est INTEGER DEFAULT 0;

UPDATE district_metrics
SET coaching_schools = 4,
    neet_coaching_enrolment_est = 320,
    jee_coaching_enrolment_est = 320,
    total_coaching_enrolment_est = 640
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 610); -- Ariyalur

UPDATE district_metrics
SET coaching_schools = 9,
    neet_coaching_enrolment_est = 720,
    jee_coaching_enrolment_est = 720,
    total_coaching_enrolment_est = 1440
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 730); -- Chengalpattu

UPDATE district_metrics
SET coaching_schools = 8,
    neet_coaching_enrolment_est = 640,
    jee_coaching_enrolment_est = 640,
    total_coaching_enrolment_est = 1280
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 568); -- Chennai

UPDATE district_metrics
SET coaching_schools = 13,
    neet_coaching_enrolment_est = 1040,
    jee_coaching_enrolment_est = 1040,
    total_coaching_enrolment_est = 2080
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 569); -- Coimbatore

UPDATE district_metrics
SET coaching_schools = 13,
    neet_coaching_enrolment_est = 1040,
    jee_coaching_enrolment_est = 1040,
    total_coaching_enrolment_est = 2080
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 570); -- Cuddalore

UPDATE district_metrics
SET coaching_schools = 10,
    neet_coaching_enrolment_est = 800,
    jee_coaching_enrolment_est = 800,
    total_coaching_enrolment_est = 1600
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 571); -- Dharmapuri

UPDATE district_metrics
SET coaching_schools = 10,
    neet_coaching_enrolment_est = 800,
    jee_coaching_enrolment_est = 800,
    total_coaching_enrolment_est = 1600
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 572); -- Dindigul

UPDATE district_metrics
SET coaching_schools = 16,
    neet_coaching_enrolment_est = 1280,
    jee_coaching_enrolment_est = 1280,
    total_coaching_enrolment_est = 2560
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 573); -- Erode

UPDATE district_metrics
SET coaching_schools = 9,
    neet_coaching_enrolment_est = 720,
    jee_coaching_enrolment_est = 720,
    total_coaching_enrolment_est = 1440
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 729); -- Kallakurichi

UPDATE district_metrics
SET coaching_schools = 9,
    neet_coaching_enrolment_est = 720,
    jee_coaching_enrolment_est = 720,
    total_coaching_enrolment_est = 1440
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 574); -- Kancheepuram

UPDATE district_metrics
SET coaching_schools = 5,
    neet_coaching_enrolment_est = 400,
    jee_coaching_enrolment_est = 400,
    total_coaching_enrolment_est = 800
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 575); -- Kanniyakumari

UPDATE district_metrics
SET coaching_schools = 6,
    neet_coaching_enrolment_est = 480,
    jee_coaching_enrolment_est = 480,
    total_coaching_enrolment_est = 960
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 576); -- Karur

UPDATE district_metrics
SET coaching_schools = 13,
    neet_coaching_enrolment_est = 1040,
    jee_coaching_enrolment_est = 1040,
    total_coaching_enrolment_est = 2080
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 577); -- Krishnagiri

UPDATE district_metrics
SET coaching_schools = 11,
    neet_coaching_enrolment_est = 880,
    jee_coaching_enrolment_est = 880,
    total_coaching_enrolment_est = 1760
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 578); -- Madurai

UPDATE district_metrics
SET coaching_schools = 4,
    neet_coaching_enrolment_est = 320,
    jee_coaching_enrolment_est = 320,
    total_coaching_enrolment_est = 640
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 735); -- Mayiladuthurai

UPDATE district_metrics
SET coaching_schools = 7,
    neet_coaching_enrolment_est = 560,
    jee_coaching_enrolment_est = 560,
    total_coaching_enrolment_est = 1120
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 579); -- Nagapattinam

UPDATE district_metrics
SET coaching_schools = 11,
    neet_coaching_enrolment_est = 880,
    jee_coaching_enrolment_est = 880,
    total_coaching_enrolment_est = 1760
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 580); -- Namakkal

UPDATE district_metrics
SET coaching_schools = 5,
    neet_coaching_enrolment_est = 400,
    jee_coaching_enrolment_est = 400,
    total_coaching_enrolment_est = 800
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 581); -- Perambalur

UPDATE district_metrics
SET coaching_schools = 12,
    neet_coaching_enrolment_est = 960,
    jee_coaching_enrolment_est = 960,
    total_coaching_enrolment_est = 1920
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 582); -- Pudukkottai

UPDATE district_metrics
SET coaching_schools = 8,
    neet_coaching_enrolment_est = 640,
    jee_coaching_enrolment_est = 640,
    total_coaching_enrolment_est = 1280
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 583); -- Ramanathapuram

UPDATE district_metrics
SET coaching_schools = 8,
    neet_coaching_enrolment_est = 640,
    jee_coaching_enrolment_est = 640,
    total_coaching_enrolment_est = 1280
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 731); -- Ranipet

UPDATE district_metrics
SET coaching_schools = 17,
    neet_coaching_enrolment_est = 1360,
    jee_coaching_enrolment_est = 1360,
    total_coaching_enrolment_est = 2720
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 584); -- Salem

UPDATE district_metrics
SET coaching_schools = 10,
    neet_coaching_enrolment_est = 800,
    jee_coaching_enrolment_est = 800,
    total_coaching_enrolment_est = 1600
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 585); -- Sivaganga

UPDATE district_metrics
SET coaching_schools = 8,
    neet_coaching_enrolment_est = 640,
    jee_coaching_enrolment_est = 640,
    total_coaching_enrolment_est = 1280
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 733); -- Tenkasi

UPDATE district_metrics
SET coaching_schools = 12,
    neet_coaching_enrolment_est = 960,
    jee_coaching_enrolment_est = 960,
    total_coaching_enrolment_est = 1920
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 586); -- Thanjavur

UPDATE district_metrics
SET coaching_schools = 3,
    neet_coaching_enrolment_est = 240,
    jee_coaching_enrolment_est = 240,
    total_coaching_enrolment_est = 480
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 587); -- Nilgiris

UPDATE district_metrics
SET coaching_schools = 7,
    neet_coaching_enrolment_est = 560,
    jee_coaching_enrolment_est = 560,
    total_coaching_enrolment_est = 1120
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 588); -- Theni

UPDATE district_metrics
SET coaching_schools = 11,
    neet_coaching_enrolment_est = 880,
    jee_coaching_enrolment_est = 880,
    total_coaching_enrolment_est = 1760
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 594); -- Thoothukudi

UPDATE district_metrics
SET coaching_schools = 12,
    neet_coaching_enrolment_est = 960,
    jee_coaching_enrolment_est = 960,
    total_coaching_enrolment_est = 1920
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 591); -- Tiruchirappalli

UPDATE district_metrics
SET coaching_schools = 8,
    neet_coaching_enrolment_est = 640,
    jee_coaching_enrolment_est = 640,
    total_coaching_enrolment_est = 1280
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 592); -- Tirunelveli

UPDATE district_metrics
SET coaching_schools = 5,
    neet_coaching_enrolment_est = 400,
    jee_coaching_enrolment_est = 400,
    total_coaching_enrolment_est = 800
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 732); -- Tirupathur

UPDATE district_metrics
SET coaching_schools = 12,
    neet_coaching_enrolment_est = 960,
    jee_coaching_enrolment_est = 960,
    total_coaching_enrolment_est = 1920
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 634); -- Tiruppur

UPDATE district_metrics
SET coaching_schools = 13,
    neet_coaching_enrolment_est = 1040,
    jee_coaching_enrolment_est = 1040,
    total_coaching_enrolment_est = 2080
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 589); -- Tiruvallur

UPDATE district_metrics
SET coaching_schools = 19,
    neet_coaching_enrolment_est = 1520,
    jee_coaching_enrolment_est = 1520,
    total_coaching_enrolment_est = 3040
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 593); -- Tiruvannamalai

UPDATE district_metrics
SET coaching_schools = 9,
    neet_coaching_enrolment_est = 720,
    jee_coaching_enrolment_est = 720,
    total_coaching_enrolment_est = 1440
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 590); -- Tiruvarur

UPDATE district_metrics
SET coaching_schools = 9,
    neet_coaching_enrolment_est = 720,
    jee_coaching_enrolment_est = 720,
    total_coaching_enrolment_est = 1440
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 595); -- Vellore

UPDATE district_metrics
SET coaching_schools = 10,
    neet_coaching_enrolment_est = 800,
    jee_coaching_enrolment_est = 800,
    total_coaching_enrolment_est = 1600
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 596); -- Viluppuram

UPDATE district_metrics
SET coaching_schools = 8,
    neet_coaching_enrolment_est = 640,
    jee_coaching_enrolment_est = 640,
    total_coaching_enrolment_est = 1280
WHERE district_id = (SELECT id FROM districts WHERE lgd_code = 597); -- Virudhunagar

