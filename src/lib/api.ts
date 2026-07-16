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
    // Query both general district metrics and the new Vetri Palligal district summary metrics
    const { data, error } = await supabase
      .from('districts')
      .select(`
        id, 
        district_name, 
        lgd_code, 
        source_id, 
        created_at,
        metrics:district_metrics(*),
        vetri:vetri_district_metrics(*)
      `)
      .order('district_name', { ascending: true });

    if (error) {
      throw error;
    }
    if (!data || data.length === 0) {
      throw new Error('No districts returned from database');
    }
    
    // Merge general metrics and Vetri summary metrics
    return data.map(d => {
      const mainMetrics = Array.isArray(d.metrics) ? d.metrics[0] : d.metrics;
      const vetriMetrics = Array.isArray(d.vetri) ? d.vetri[0] : d.vetri;
      return {
        ...d,
        metrics: {
          ...mainMetrics,
          ...vetriMetrics
        }
      };
    }) as District[];
    
  } catch (error) {
    console.warn('Failed to fetch districts from Supabase. Falling back to local mock data.', error);
    return MOCK_DISTRICTS;
  }
}

// ─── Vetri Palligal Schools ──────────────────────────────────────────────────

export interface VetriSchool {
  id: number;
  district_id: number;
  block_name: string;
  school_name: string;
}

/**
 * Fetch detailed Vetri Palligal coaching schools list for a given district.
 */
export async function fetchVetriSchools(districtId: number): Promise<VetriSchool[]> {
  try {
    const { data, error } = await supabase
      .from('vetri_schools')
      .select('id, district_id, block_name, school_name')
      .eq('district_id', districtId)
      .order('block_name', { ascending: true })
      .order('school_name', { ascending: true });

    if (error) {
      throw error;
    }
    return (data || []) as VetriSchool[];
  } catch (error) {
    console.error(`Failed to fetch Vetri schools for district ${districtId}:`, error);
    return [];
  }
}
