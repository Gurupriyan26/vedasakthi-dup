'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchDistricts } from '@/lib/api';
import { District } from '@/types';

interface DashboardState {
  districts: District[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useDashboard(): DashboardState {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const districtData = await fetchDistricts();
      setDistricts(districtData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    districts,
    loading,
    error,
    retry: load,
  };
}
