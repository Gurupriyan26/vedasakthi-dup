const fs = require('fs');
const path = require('path');

const GEOJSON_NAME_ALIASES = {
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

function resolveDistrictName(geoName) {
  const lower = geoName.toLowerCase().trim();
  return GEOJSON_NAME_ALIASES[lower] ??
    geoName
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
}

const dbNames = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
  "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Kanniyakumari", "Karur",
  "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris",
  "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga",
  "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
  "Viluppuram", "Virudhunagar"
];

function run() {
  const geojsonPath = path.join(__dirname, 'public', 'geojson', 'tamil-nadu-districts.json');
  if (!fs.existsSync(geojsonPath)) {
    console.error("GeoJSON file not found at " + geojsonPath);
    return;
  }
  const geojson = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));
  
  console.log("=== Matching GeoJSON District Names to DB District Names ===");
  let matchedCount = 0;
  
  geojson.features.forEach((feature, idx) => {
    const props = feature.properties;
    const geoName = props?.dtname ?? props?.dist ?? props?.district ?? '';
    const resolvedName = resolveDistrictName(geoName);
    const dbMatch = dbNames.find(name => name.toLowerCase() === resolvedName.toLowerCase());
    
    if (dbMatch) {
      matchedCount++;
      console.log(`[OK] Geo: "${geoName}" -> Resolved: "${resolvedName}" -> DB: "${dbMatch}"`);
    } else {
      console.log(`[FAIL] Geo: "${geoName}" -> Resolved: "${resolvedName}" -> DB: NO MATCH`);
    }
  });
  
  console.log(`\nMatched: ${matchedCount} / ${geojson.features.length}`);
}

run();
