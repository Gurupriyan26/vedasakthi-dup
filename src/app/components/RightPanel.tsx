'use client';

import { District } from '@/types';
import { useDashboardStore } from '@/store/useDashboardStore';
import { School, UserCheck, GraduationCap, FlaskConical, Users, Zap, Droplet, Map as MapIcon, X, MapPin } from 'lucide-react';

interface RightPanelProps {
  selectedDistrict: District | null;
  onClearDistrict: () => void;
}

const metricRows = [
  { key: 'total_schools' as const,    label: 'Total Schools',    icon: <School size={14} />,       color: '#3498db', isPercent: false },
  { key: 'attendance' as const,       label: 'Attendance',       icon: <UserCheck size={14} />,    color: '#2ecc71', isPercent: true  },
  { key: 'neet_qualified' as const,   label: 'NEET Qualified',   icon: <GraduationCap size={14} />,color: '#9b59b6', isPercent: false },
  { key: 'hi_tech_labs' as const,     label: 'Hi-Tech Labs',     icon: <FlaskConical size={14} />, color: '#e74c3c', isPercent: true  },
  { key: 'teachers_staffed' as const, label: 'Teachers Staffed', icon: <Users size={14} />,        color: '#1abc9c', isPercent: true  },
  { key: 'electricity' as const,      label: 'Grid Connect',     icon: <Zap size={14} />,          color: '#f1c40f', isPercent: true  },
  { key: 'wash_audited' as const,     label: 'WASH Audited',     icon: <Droplet size={14} />,      color: '#34495e', isPercent: true  },
  { key: 'active_blocks' as const,    label: 'Active Blocks',    icon: <MapIcon size={14} />,      color: '#e67e22', isPercent: false },
];

export default function RightPanel({ selectedDistrict, onClearDistrict }: RightPanelProps) {
  const { selectedMetric } = useDashboardStore();
  const metrics = selectedDistrict?.metrics;

  const fmt = (val: number | undefined, isPercent: boolean) =>
    val != null ? (isPercent ? `${val}%` : new Intl.NumberFormat('en-IN').format(val)) : '—';

  return (
    <aside
      className="flex flex-col h-full flex-shrink-0 overflow-y-auto"
      style={{
        width: '300px',
        minWidth: '300px',
        background: '#ffffff',
        borderLeft: '1px solid #e0e6ed',
        padding: '20px 16px',
      }}
    >
      {selectedDistrict ? (
        <div className="flex flex-col gap-4 h-full animate-slide-in">
          {/* Header */}
          <div style={{ borderBottom: '1px solid #e0e6ed', paddingBottom: '14px' }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1" style={{ color: '#3498db' }}>
                  <MapPin size={11} />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">District Profile</span>
                </div>
                <h2 className="text-xl font-black" style={{ color: '#2c3e50' }}>
                  {selectedDistrict.district_name}
                </h2>
                <div className="text-[11px] font-bold mt-0.5" style={{ color: '#7f8c8d' }}>
                  LGD CODE: {selectedDistrict.lgd_code}
                </div>
              </div>
              <button
                onClick={onClearDistrict}
                className="rounded-lg p-1.5 transition-all"
                style={{ border: '1px solid #e0e6ed', color: '#7f8c8d' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = '#f4f7f6'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent'; }}
                aria-label="Clear district"
              >
                <X size={12} />
              </button>
            </div>
          </div>

          {/* Active Metric Banner */}
          <div style={{ background: '#f4f7f6', borderRadius: '8px', padding: '10px 12px', border: '1px solid #e0e6ed' }}>
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#7f8c8d' }}>
              Active Metric
            </div>
            <div className="text-sm font-bold" style={{ color: '#2c3e50' }}>
              {selectedMetric.replace(/_/g, ' ').toUpperCase()}
            </div>
          </div>

          {/* Metrics Grid */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#7f8c8d' }}>
              Performance Metrics
            </div>
            <div className="flex flex-col gap-2">
              {metricRows.map(row => (
                <div
                  key={row.key}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5"
                  style={{
                    border: `1px solid ${selectedMetric === row.key ? row.color + '40' : '#e0e6ed'}`,
                    background: selectedMetric === row.key ? row.color + '08' : '#fff',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ color: row.color }}>{row.icon}</span>
                    <span className="text-xs font-semibold" style={{ color: '#7f8c8d' }}>
                      {row.label}
                    </span>
                  </div>
                  <span className="text-sm font-black" style={{ color: '#2c3e50' }}>
                    {fmt(metrics?.[row.key], row.isPercent)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in" style={{ gap: '12px' }}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}
          >
            <MapPin size={26} style={{ color: '#3b82f6', animation: 'bounce 2s infinite' }} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider" style={{ color: '#2c3e50' }}>
              Explore Districts
            </h3>
            <p className="text-xs mt-2 leading-relaxed max-w-[200px]" style={{ color: '#7f8c8d' }}>
              Hover over a district to view basic stats, or click to lock its profile view here.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
