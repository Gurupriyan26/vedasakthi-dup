
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xagyfdjafdvyxqanfxpo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZ3lmZGphZmR2eXhxYW5meHBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODk1NTUsImV4cCI6MjA5Nzk2NTU1NX0.c6IADt_S5RR19xeqCgDmwA9AKbShBi4LQCsHvMCt8io';
const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
  console.log('=== Checking all districts and their metrics ===\n');

  const { data: districts, error: e1 } = await supabase
    .from('districts')
    .select('id, district_name, lgd_code')
    .order('id');

  if (e1) { console.error('Error:', e1.message); return; }

  const { data: metrics, error: e2 } = await supabase
    .from('district_metrics')
    .select('district_id, total_schools, attendance');

  if (e2) { console.error('Metrics error:', e2.message); return; }

  const metricIds = new Set(metrics.map(m => m.district_id));

  console.log(`Total districts: ${districts.length}`);
  console.log(`Metric records: ${metrics.length}\n`);

  const missing = districts.filter(d => !metricIds.has(d.id));
  const present = districts.filter(d => metricIds.has(d.id));

  console.log(`✅ Districts WITH data (${present.length}):`);
  present.forEach(d => console.log(`  id=${d.id} lgd=${d.lgd_code} - ${d.district_name}`));

  console.log(`\n❌ Districts MISSING data (${missing.length}):`);
  missing.forEach(d => console.log(`  id=${d.id} lgd=${d.lgd_code} - ${d.district_name}`));

  if (missing.length > 0) {
    console.log('\n=== SQL to insert missing district metrics ===\n');
    missing.forEach(d => {
      console.log(`INSERT INTO district_metrics (district_id, total_schools, attendance, neet_qualified, hi_tech_labs, teachers_staffed, electricity, wash_audited, active_blocks)`);
      console.log(`VALUES (${d.id}, 500, 85.00, 400, 75.00, 82.00, 90.00, 80.00, 8); -- ${d.district_name} (lgd:${d.lgd_code})`);
      console.log('');
    });
  }
}

diagnose();
