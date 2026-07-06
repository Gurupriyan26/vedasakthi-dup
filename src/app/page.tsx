'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import ChartsSection from './components/ChartsSection';
import { useDashboard } from '@/hooks/useDashboard';
import { RefreshCw } from 'lucide-react';

const DistrictMap = dynamic(() => import('./components/DistrictMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ background: '#ffffff' }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 mx-auto mb-4" style={{ borderColor: '#3b82f6', borderTopColor: 'transparent', animation: 'spin 0.9s linear infinite' }} />
        <p className="text-sm font-semibold" style={{ color: '#475569' }}>Rendering map…</p>
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

  // Skeleton loading shell
  if (!mounted) {
    return (
      <div className="flex flex-col h-screen" style={{ background: 'var(--bg)', overflow: 'hidden' }}>
        <div className="vs-header">
          <div className="flex items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }} />
            <div>
              <div className="skeleton h-4 w-32 mb-1.5" />
              <div className="skeleton h-3 w-48" />
            </div>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div style={{ width: 320, background: 'var(--surface)', borderRight: '1px solid var(--border)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="skeleton h-24 rounded-xl" />
            <div className="grid grid-cols-2 gap-2">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
            </div>
          </div>
          <div className="flex-1 skeleton m-3 rounded-2xl" />
          <div style={{ width: 300, background: 'var(--surface)', borderLeft: '1px solid var(--border)' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--bg)', overflow: 'hidden' }}>
      <Header loading={loading} searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar districts={filteredDistricts} loading={loading} />

        <main className="flex-1 flex flex-col overflow-hidden">
          {error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-sm px-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <span className="text-3xl">⚠️</span>
                </div>
                <h2 className="text-lg font-bold mb-2" style={{ color: '#1e293b' }}>Connection failed</h2>
                <p className="text-sm mb-5" style={{ color: '#64748b', lineHeight: 1.6 }}>{error}</p>
                <button
                  onClick={retry}
                  className="flex items-center gap-2 mx-auto px-6 py-2.5 text-white text-sm font-semibold rounded-xl transition-all hover:opacity-80"
                  style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }}
                >
                  <RefreshCw size={14} /> Retry
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Map — fills the full height */}
              <div className="flex-1 relative" style={{ minHeight: 420 }}>
                <DistrictMap
                  districts={filteredDistricts}
                  loading={loading}
                  onDistrictSelect={d => setSelectedDistrictId(d.id)}
                  selectedDistrictId={selectedDistrictId}
                />
              </div>

              {/* Charts — collapsible scrollable strip at bottom */}
              {!loading && filteredDistricts.length > 0 && (
                <div
                  className="overflow-y-auto flex-shrink-0"
                  style={{
                    maxHeight: '42vh',
                    background: 'var(--surface)',
                    borderTop: '1px solid var(--border)',
                    padding: '16px 20px 20px',
                  }}
                >
                  <ChartsSection districts={filteredDistricts} />
                </div>
              )}
            </div>
          )}
        </main>

        <RightPanel
          selectedDistrict={selectedDistrict}
          onClearDistrict={() => setSelectedDistrictId(null)}
        />
      </div>
    </div>
  );
}