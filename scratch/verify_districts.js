const { TNTET_SAMPLE_MAP } = require('./src/lib/tntetData.ts');
const { MOCK_DISTRICTS } = require('./src/lib/mockData.ts');

console.log('=== CHECKING ALL 38 DISTRICTS FOR TNTET & OTHER DATA ===\n');

const missingTntet = [];
const okTntet = [];

MOCK_DISTRICTS.forEach(d => {
  const name = d.district_name.trim().toUpperCase();
  const tntet = TNTET_SAMPLE_MAP[name] || 
                TNTET_SAMPLE_MAP[name.replace('THIRU', 'TIRU')] ||
                TNTET_SAMPLE_MAP[name.replace('TRICHY', 'TIRUCHIRAPPALLI')] ||
                TNTET_SAMPLE_MAP[name.replace('KANYAKUMARI', 'KANNIYAKUMARI')] ||
                TNTET_SAMPLE_MAP[name.replace('NILGIRIS', 'THE NILGIRIS')];

  if (!tntet || tntet.registered === 0) {
    missingTntet.push(d.district_name);
  } else {
    okTntet.push({ name: d.district_name, reg: tntet.registered, qual: tntet.qualified });
  }
});

console.log(`Total Districts Checked: ${MOCK_DISTRICTS.length}`);
console.log(`Districts with TNTET Data: ${okTntet.length}`);
console.log(`Districts Missing TNTET Data: ${missingTntet.length}\n`);

if (missingTntet.length > 0) {
  console.log('❌ Missing Districts:', missingTntet);
} else {
  console.log('✅ ALL 38 DISTRICTS HAVE TNTET DATA!');
}
