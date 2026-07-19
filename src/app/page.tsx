'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import ChartsSection from './components/ChartsSection';
import { useDashboard } from '@/hooks/useDashboard';
import { RefreshCw, X, BarChart2 } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';

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
  const [showCharts, setShowCharts] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useDashboardStore();

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

  // Auto-select district when search filters down to exactly 1 district
  useEffect(() => {
    if (filteredDistricts.length === 1) {
      setSelectedDistrictId(filteredDistricts[0].id);
    }
  }, [filteredDistricts]);

  // Skeleton loading shell
  if (!mounted) {
    return (
      <div 
        className="flex flex-col h-screen transition-all duration-300" 
        style={{ 
          background: theme === 'dark' ? '#0f172a' : '#f4f7f6', 
          overflow: 'hidden',
          ['--bg' as any]: theme === 'dark' ? '#0f172a' : '#f4f7f6',
          ['--surface' as any]: theme === 'dark' ? '#1e293b' : '#ffffff',
          ['--border' as any]: theme === 'dark' ? '#1e293b' : '#e0e6ed',
          ['--skeleton-bg' as any]: theme === 'dark' ? '#1e293b' : '#e2e8f0',
        }}
      >
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
          <div 
            className="hidden lg:flex flex-col gap-3 p-4 flex-shrink-0"
            style={{ width: 320, background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
          >
            <div className="skeleton h-24 rounded-xl" />
            <div className="grid grid-cols-2 gap-2">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
            </div>
          </div>
          <div className="flex-1 skeleton m-3 rounded-2xl" />
          <div className="hidden xl:block flex-shrink-0" style={{ width: 300, background: 'var(--surface)', borderLeft: '1px solid var(--border)' }} />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col h-screen transition-all duration-300" 
      style={{ 
        background: theme === 'dark' ? '#0f172a' : '#f4f7f6', 
        overflow: 'hidden',
        ['--bg' as any]: theme === 'dark' ? '#0f172a' : '#f4f7f6',
        ['--surface' as any]: theme === 'dark' ? '#1e293b' : '#ffffff',
        ['--border' as any]: theme === 'dark' ? '#1e293b' : '#e0e6ed',
      }}
    >
      <Header 
        loading={loading} 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          districts={filteredDistricts} 
          loading={loading} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

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
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {/* Map — fills the full height */}
              <div className="absolute inset-0 z-0">
                <DistrictMap
                  districts={districts}
                  loading={loading}
                  onDistrictSelect={d => setSelectedDistrictId(d.id)}
                  selectedDistrictId={selectedDistrictId}
                />
              </div>

              {/* Toggle Button when Charts are hidden */}
              {!showCharts && !loading && filteredDistricts.length > 0 && (
                <button
                  onClick={() => setShowCharts(true)}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] px-6 py-3 bg-[#0f172a]/85 hover:bg-[#0f172a] text-white text-[11px] font-extrabold uppercase tracking-widest rounded-full border border-indigo-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_0_20px_rgba(99,102,241,0.45)] hover:border-indigo-400/60 transition-all duration-300 flex items-center gap-2.5 backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95 group"
                >
                  <BarChart2 size={13} className="text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                  Show Distribution Chart
                </button>
              )}

              {/* Charts — Floating sleek panel over the map */}
              {showCharts && !loading && filteredDistricts.length > 0 && (
                <div
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-[1000] rounded-[24px] shadow-2xl border border-white/60 overflow-hidden transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  {/* Close button */}
                  <button
                    onClick={() => setShowCharts(false)}
                    className="absolute top-4 right-4 z-[1001] p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
                    aria-label="Hide chart"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
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