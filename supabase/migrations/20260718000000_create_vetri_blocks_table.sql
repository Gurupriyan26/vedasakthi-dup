-- Migration: Create vetri_blocks table
-- Created at: 2026-07-18
-- Purpose: Block-level intermediate layer between districts and schools
--          Derived from vetri_schools table (District → Block → School)

CREATE TABLE IF NOT EXISTS vetri_blocks (
  id          SERIAL PRIMARY KEY,
  district_id INTEGER NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  block_name  TEXT NOT NULL,
  school_count INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT uq_vetri_blocks_district_block UNIQUE (district_id, block_name)
);

-- Index for fast lookup by district
CREATE INDEX IF NOT EXISTS idx_vetri_blocks_district_id ON vetri_blocks (district_id);

-- Enable Row Level Security
ALTER TABLE vetri_blocks ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow public read access" ON vetri_blocks
  FOR SELECT TO anon, authenticated USING (true);

-- Populate from existing vetri_schools data
-- Groups schools by (district_id, block_name) and counts them
INSERT INTO vetri_blocks (district_id, block_name, school_count)
SELECT
  district_id,
  block_name,
  COUNT(*) AS school_count
FROM vetri_schools
GROUP BY district_id, block_name
ON CONFLICT (district_id, block_name) DO UPDATE
  SET school_count = EXCLUDED.school_count;
