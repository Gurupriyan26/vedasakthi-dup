// ─── Supabase Row Types ───────────────────────────────────────────────────────

export interface District {
  id: number;
  district_name: string;
  lgd_code: number;
  source_id: string;
  created_at: string;
}

// ─── GeoJSON ─────────────────────────────────────────────────────────────────

export interface DistrictGeoProperties {
  district: string;    // District name — must match district_name in DB
  lgd_code: number;
}

