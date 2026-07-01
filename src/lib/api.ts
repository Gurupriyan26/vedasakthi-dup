import { supabase } from '@/lib/supabaseClient';
import { District } from '@/types';
import { MOCK_DISTRICTS } from './mockData';

// ─── Districts ────────────────────────────────────────────────────────────────

/**
 * Fetch all 38 Tamil Nadu districts from the `districts` table,
 * along with their metrics from `district_metrics`.
 * Falls back to local mock data if the database query fails.
 */
export async function fetchDistricts(): Promise<District[]> {
  try {
    // Note: ensure your table is named `districts`, previous version queried `district`
    const { data, error } = await supabase
      .from('districts')
      .select(`
        id, 
        district_name, 
        lgd_code, 
        source_id, 
        created_at,
        metrics:district_metrics(*)
      `)
      .order('district_name', { ascending: true });

    if (error) {
      throw error;
    }
    if (!data || data.length === 0) {
      throw new Error('No districts returned from database');
    }
    
    // Supabase returns nested relations as arrays (even for 1-to-1 if not explicitly structured),
    // or as a single object if the foreign key has a unique constraint.
    // Our district_metrics has a UNIQUE(district_id), so it should be a single object,
    // but just in case it returns an array we unwrap it.
    return data.map(d => ({
      ...d,
      metrics: Array.isArray(d.metrics) ? d.metrics[0] : d.metrics
    })) as District[];
    
  } catch (error) {
    console.warn('Failed to fetch districts from Supabase. Falling back to local mock data.', error);
    return MOCK_DISTRICTS;
  }
}
