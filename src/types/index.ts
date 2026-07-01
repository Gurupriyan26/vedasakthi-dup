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
  neet_qualified: number;
  hi_tech_labs: number;
  teachers_staffed: number;
  electricity: number;
  wash_audited: number;
  active_blocks: number;
  created_at: string;
  updated_at: string;
}

// ─── GeoJSON ─────────────────────────────────────────────────────────────────

export interface DistrictGeoProperties {
  district: string;    // District name — must match district_name in DB
  lgd_code: number;
}
