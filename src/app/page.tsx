'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import ChartsSection from './components/ChartsSection';
import { useDashboard } from '@/hooks/useDashboard';

// Leaflet requires browser APIs — disable SSR
const DistrictMap = dynamic(() => import('./components/DistrictMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ background: '#f4f7f6' }}>
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-4 mx-auto mb-3" style={{ borderColor: '#3498db', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <p className="text-sm font-semibold" style={{ color: '#7f8c8d' }}>Loading map…</p>
      </div>
    </div>
  ),
});

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { setMounted(true); }, []);

  const { districts, loading, error, retry } = useDashboard();

  const selectedDistrict = useMemo(() => {
    if (selectedDistrictId === null) return null;
    return districts.find(d => d.id === selectedDistrictId) ?? null;
  }, [selectedDistrictId, districts]);

  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return districts;
    const q = searchQuery.toLowerCase();
    return districts.filter(d => d.district_name.toLowerCase().includes(q));
  }, [districts, searchQuery]);

  if (!mounted) {
    return (
      <div className="flex flex-col h-screen" style={{ background: '#f4f7f6', overflow: 'hidden' }}>
        <div className="vs-header">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg" style={{ background: 'linear-gradient(135deg,#2563EB,#0891B2)' }} />
            <div>
              <div className="skeleton h-4 w-28 mb-1" />
              <div className="skeleton h-3 w-40" />
            </div>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div style={{ width: 340, background: '#f4f7f6', borderRight: '1px solid #e0e6ed', padding: 16 }}>
            <div className="grid grid-cols-2 gap-2">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
            </div>
          </div>
          <div className="flex-1 skeleton m-2 rounded-xl" />
          <div style={{ width: 300, borderLeft: '1px solid #e0e6ed' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: '#f4f7f6', overflow: 'hidden' }}>
      {/* ── Header ── */}
      <Header loading={loading} searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Sidebar */}
        <Sidebar districts={filteredDistricts} loading={loading} />

        {/* Center — Map + Charts */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {error ? (
            <div className="flex-1 flex items-center justify-center" style={{ background: '#f4f7f6' }}>
              <div className="text-center max-w-sm px-6">
                <div className="text-4xl mb-4">⚠️</div>
                <h2 className="text-lg font-bold mb-2" style={{ color: '#2c3e50' }}>Failed to load data</h2>
                <p className="text-sm mb-4" style={{ color: '#7f8c8d' }}>{error}</p>
                <button
                  onClick={retry}
                  className="px-6 py-2 text-white text-sm font-semibold rounded-lg"
                  style={{ background: '#3498db' }}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto" style={{ padding: '0 16px 16px 16px' }}>
              {/* Map */}
              <div style={{ height: '65vh', minHeight: 420, borderRadius: 0, overflow: 'hidden', border: '1px solid #e0e6ed', borderTop: 'none' }}>
                <DistrictMap
                  districts={filteredDistricts}
                  loading={loading}
                  onDistrictSelect={d => setSelectedDistrictId(d.id)}
                  selectedDistrictId={selectedDistrictId}
                />
              </div>

              {/* Charts */}
              {!loading && filteredDistricts.length > 0 && (
                <ChartsSection districts={filteredDistricts} />
              )}
            </div>
          )}
        </main>

        {/* Right Panel */}
        <RightPanel
          selectedDistrict={selectedDistrict}
          onClearDistrict={() => setSelectedDistrictId(null)}
        />
      </div>
    </div>
  );
}