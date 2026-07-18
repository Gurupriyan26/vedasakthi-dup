// ─── Supabase Row Types ───────────────────────────────────────────────────────

export interface District {
  id: number;
  district_name: string;
  lgd_code: number;
  source_id: string;
  created_at: string;
  metrics?: DistrictMetrics; // Joined data
}

export interface DistrictMetrics {
  id: string;
  district_id: number;
  total_schools: number;
  attendance: number;
  neet_qualified: number; // Keep for compatibility
  coaching_schools?: number;
  neet_coaching_enrolment_est?: number;
  jee_coaching_enrolment_est?: number;
  total_coaching_enrolment_est?: number;
  hi_tech_labs: number;
  teachers_staffed: number;
  electricity: number;
  wash_audited: number;
  active_blocks: number;
  created_at: string;
  updated_at: string;
}

// ─── Vetri Palligal ──────────────────────────────────────────────────────────

export interface VetriBlock {
  district_id: number;
  block_name: string;
  school_count: number;
}

// ─── GeoJSON ─────────────────────────────────────────────────────────────────

export interface DistrictGeoProperties {
  district: string;    // District name — must match district_name in DB
  lgd_code: number;
}
