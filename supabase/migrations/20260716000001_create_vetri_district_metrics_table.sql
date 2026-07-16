-- Migration: Create vetri_district_metrics table
-- Created at: 2026-07-16

CREATE TABLE IF NOT EXISTS vetri_district_metrics (
  id SERIAL PRIMARY KEY,
  district_id INTEGER NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  coaching_schools INTEGER DEFAULT 0,
  neet_coaching_enrolment_est INTEGER DEFAULT 0,
  jee_coaching_enrolment_est INTEGER DEFAULT 0,
  total_coaching_enrolment_est INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT uq_vetri_district_metrics_district_id UNIQUE (district_id)
);

-- Index for performance when querying by district_id
CREATE INDEX IF NOT EXISTS idx_vetri_district_metrics_district_id ON vetri_district_metrics (district_id);

-- Enable Row Level Security (RLS)
ALTER TABLE vetri_district_metrics ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow public read access" ON vetri_district_metrics
  FOR SELECT TO anon, authenticated USING (true);

-- Insert Vetri Palligal district summary metrics
INSERT INTO vetri_district_metrics (district_id, coaching_schools, neet_coaching_enrolment_est, jee_coaching_enrolment_est, total_coaching_enrolment_est) VALUES
(1, 4, 320, 320, 640),
(2, 9, 720, 720, 1440),
(3, 8, 640, 640, 1280),
(4, 13, 1040, 1040, 2080),
(5, 13, 1040, 1040, 2080),
(6, 10, 800, 800, 1600),
(7, 10, 800, 800, 1600),
(8, 16, 1280, 1280, 2560),
(9, 9, 720, 720, 1440),
(10, 9, 720, 720, 1440),
(11, 5, 400, 400, 800),
(12, 6, 480, 480, 960),
(13, 13, 1040, 1040, 2080),
(14, 11, 880, 880, 1760),
(15, 4, 320, 320, 640),
(16, 7, 560, 560, 1120),
(17, 11, 880, 880, 1760),
(19, 5, 400, 400, 800),
(20, 12, 960, 960, 1920),
(21, 8, 640, 640, 1280),
(22, 8, 640, 640, 1280),
(23, 17, 1360, 1360, 2720),
(24, 10, 800, 800, 1600),
(25, 8, 640, 640, 1280),
(26, 12, 960, 960, 1920),
(18, 3, 240, 240, 480),
(27, 7, 560, 560, 1120),
(28, 11, 880, 880, 1760),
(29, 12, 960, 960, 1920),
(30, 8, 640, 640, 1280),
(31, 5, 400, 400, 800),
(32, 12, 960, 960, 1920),
(33, 13, 1040, 1040, 2080),
(34, 19, 1520, 1520, 3040),
(35, 9, 720, 720, 1440),
(36, 9, 720, 720, 1440),
(37, 10, 800, 800, 1600),
(38, 8, 640, 640, 1280);
