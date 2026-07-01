const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xagyfdjafdvyxqanfxpo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZ3lmZGphZmR2eXhxYW5meHBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODk1NTUsImV4cCI6MjA5Nzk2NTU1NX0.c6IADt_S5RR19xeqCgDmwA9AKbShBi4LQCsHvMCt8io';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  const { data, error } = await supabase
    .from('districts')
    .select('id, district_name, lgd_code')
    .order('id');

  if (error) {
    console.error('Error fetching data:', error.message);
  } else {
    console.log('Districts in DB:');
    console.table(data);
  }
}

testSupabase();
