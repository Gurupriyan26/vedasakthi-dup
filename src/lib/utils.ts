// ─── GeoJSON Name Alias Map ───────────────────────────────────────────────────

/**
 * Maps GeoJSON district names (lowercase, trimmed) → DB district names.
 * Add entries here when the GeoJSON uses a different spelling than the DB.
 */
export const GEOJSON_NAME_ALIASES: Record<string, string> = {
  // GeoJSON name          : DB district_name
  'kanyakumari'           : 'Kanniyakumari',
  'kanchipuram'           : 'Kancheepuram',
  'the nilgiris'          : 'Nilgiris',
  'tiruchirapalli'        : 'Tiruchirappalli',
  'thiruvallur'           : 'Tiruvallur',
  'thiruvarur'            : 'Tiruvarur',
  'tuticorin'             : 'Thoothukudi',
  'villupuram'            : 'Viluppuram',
  'tirunelveli'           : 'Tirunelveli',
  'ramanathapuram'        : 'Ramanathapuram',
  'mayiladuthurai'        : 'Mayiladuthurai',
};

/**
 * Normalize district names for fuzzy GeoJSON matching.
 * Handles common spelling differences between DB and GeoJSON properties.
 */
export function normalizeDistrictName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z]/g, '');
}

/**
 * Resolve a GeoJSON district name to the canonical DB district_name.
 */
export function resolveDistrictName(geoName: string): string {
  const lower = geoName.toLowerCase().trim();
  return GEOJSON_NAME_ALIASES[lower] ??
    geoName
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
}
