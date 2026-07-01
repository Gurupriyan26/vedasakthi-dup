import { supabase } from '@/lib/supabaseClient';
import { District } from '@/types';
import { MOCK_DISTRICTS } from './mockData';

// ─── Districts ────────────────────────────────────────────────────────────────

/**
 * Fetch all 38 Tamil Nadu districts from the `district` table.
 * Falls back to local mock data if the database query fails.
 */
export async function fetchDistricts(): Promise<District[]> {
  try {
    const { data, error } = await supabase
      .from('district')
      .select('id, district_name, lgd_code, source_id, created_at')
      .order('district_name', { ascending: true });

    if (error) {
      throw error;
    }
    if (!data || data.length === 0) {
      throw new Error('No districts returned from database');
    }
    return data;
  } catch (error) {
    console.warn('Failed to fetch districts from Supabase. Falling back to local mock data.', error);
    return MOCK_DISTRICTS;
  }
}
