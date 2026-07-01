'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import { SidebarSkeleton, MapSkeleton, RightPanelSkeleton } from './components/LoadingSkeleton';
import { useDashboard } from '@/hooks/useDashboard';

// Leaflet requires browser APIs — disable SSR
const DistrictMap = dynamic(() => import('./components/DistrictMap'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    districts,
    loading,
    error,
    retry,
  } = useDashboard();

  // Compute selected district profile details dynamically
  const selectedDistrict = useMemo(() => {
    if (selectedDistrictId === null) return null;
    return districts.find((d) => d.id === selectedDistrictId) ?? null;
  }, [selectedDistrictId, districts]);

  if (!mounted) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#090D16]">
        <Header loading={true} />
        <div className="flex flex-1 gap-4 p-4 overflow-hidden">
          <SidebarSkeleton />
          <main className="flex-1 overflow-hidden">
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/5 relative">
              <MapSkeleton />
            </div>
          </main>
          <RightPanelSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#090D16]">
      {/* ── Top Header ─────────────────────────────────────────────────────── */}
      <Header loading={loading} />

      {/* ── Main Layout ────────────────────────────────────────────────────── */}
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">

        {/* ── Left Sidebar ─────────────────────────────────────────────────── */}
        {loading && !districts.length ? (
          <SidebarSkeleton />
        ) : (
          <Sidebar
            districts={districts}
            loading={loading}
          />
        )}

        {/* ── Center Content (Map) ─────────────────────────────────────────── */}
        <main className="flex-1 overflow-hidden">
          {error ? (
            /* Error State */
            <div className="w-full h-full flex items-center justify-center bg-slate-950/40 backdrop-blur-md rounded-2xl border border-white/5">
              <div className="text-center space-y-4 max-w-sm px-6">
                <div className="text-5xl">⚠️</div>
                <h2 className="text-xl font-bold text-white">Failed to load data</h2>
                <p className="text-sm text-slate-400 leading-relaxed">{error}</p>
                <p className="text-xs text-slate-500">
                  Check your <code className="bg-slate-900 border border-white/5 px-1 py-0.5 rounded">.env.local</code>{' '}
                  file and Supabase credentials, then try again.
                </p>
                <button
                  onClick={retry}
                  className="mt-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            /* Map */
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/5 relative">
              <DistrictMap
                districts={districts}
                loading={loading}
                onDistrictSelect={(district) => setSelectedDistrictId(district.id)}
                selectedDistrictId={selectedDistrictId}
              />
            </div>
          )}
        </main>

        {/* ── Right Panel (Details) ──────────────────────────────── */}
        {!loading && (
          <RightPanel
            selectedDistrict={selectedDistrict}
            onClearDistrict={() => setSelectedDistrictId(null)}
          />
        )}
      </div>
    </div>
  );
}