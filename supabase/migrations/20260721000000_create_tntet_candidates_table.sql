-- Migration: Create tntet_candidates table for sample candidate figures
-- Created at: 2026-07-21

CREATE TABLE IF NOT EXISTS tntet_candidates (
  id SERIAL PRIMARY KEY,
  district_id INTEGER NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  registered_candidates INTEGER DEFAULT 0,
  qualified_candidates INTEGER DEFAULT 0,
  is_sample BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT uq_tntet_candidates_district_id UNIQUE (district_id)
);

-- Index for fast lookup by district
CREATE INDEX IF NOT EXISTS idx_tntet_candidates_district_id ON tntet_candidates (district_id);

-- Enable Row Level Security (RLS)
ALTER TABLE tntet_candidates ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow public read access" ON tntet_candidates
  FOR SELECT TO anon, authenticated USING (true);

-- Insert TNTET sample dataset per district LGD/ID
INSERT INTO tntet_candidates (district_id, registered_candidates, qualified_candidates, is_sample) VALUES
  (1, 22565, 2390, true),   -- Ariyalur
  (2, 14879, 2659, true),   -- Chengalpattu
  (3, 27941, 3790, true),   -- Chennai
  (4, 11565, 2293, true),   -- Coimbatore
  (5, 2730, 298, true),     -- Cuddalore
  (6, 26792, 3813, true),   -- Dharmapuri
  (7, 21459, 2095, true),   -- Dindigul
  (8, 27079, 2819, true),   -- Erode
  (9, 10319, 1389, true),   -- Kallakurichi
  (10, 5580, 914, true),    -- Kancheepuram
  (11, 14584, 1752, true),  -- Kanniyakumari
  (12, 2791, 426, true),    -- Karur
  (13, 8136, 1316, true),   -- Krishnagiri
  (14, 11209, 1164, true),  -- Madurai
  (15, 7807, 1059, true),   -- Mayiladuthurai
  (16, 2894, 473, true),    -- Nagapattinam
  (17, 22163, 4865, true),  -- Namakkal
  (18, 3559, 725, true),    -- Nilgiris
  (19, 13441, 2068, true),  -- Perambalur
  (20, 11789, 1772, true),  -- Pudukkottai
  (21, 20632, 2416, true),  -- Ramanathapuram
  (22, 24292, 3177, true),  -- Ranipet
  (23, 16592, 2570, true),  -- Salem
  (24, 4086, 417, true),    -- Sivagangai
  (25, 24485, 2624, true),  -- Tenkasi
  (26, 21370, 4018, true),  -- Thanjavur
  (27, 28039, 4082, true),  -- Theni
  (28, 23541, 2036, true),  -- Thoothukkudi
  (29, 22252, 2282, true),  -- Tiruchirappalli
  (30, 12757, 1057, true),  -- Tirunelveli
  (31, 2798, 318, true),    -- Tirupathur
  (32, 21409, 4639, true),  -- Tiruppur
  (33, 27295, 4697, true),  -- Tiruvallur
  (34, 11723, 1458, true),  -- Tiruvannamalai
  (35, 26829, 2257, true),  -- Tiruvarur
  (36, 27845, 3852, true),  -- Vellore
  (37, 22816, 3058, true),  -- Villupuram
  (38, 8234, 702, true)     -- Virudhunagar
ON CONFLICT (district_id) DO UPDATE SET
  registered_candidates = EXCLUDED.registered_candidates,
  qualified_candidates = EXCLUDED.qualified_candidates,
  is_sample = EXCLUDED.is_sample;
