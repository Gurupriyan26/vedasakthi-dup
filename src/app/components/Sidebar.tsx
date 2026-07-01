'use client';

import { District } from '@/types';
import { useDashboardStore, MetricType } from '@/store/useDashboardStore';
import { School, UserCheck, GraduationCap, FlaskConical, Users, Zap, Droplet, Map } from 'lucide-react';

interface SidebarProps {
  districts: District[];
  loading: boolean;
}

type KpiDef = {
  id: MetricType;
  label: string;
  accent: string;
  icon: React.ReactNode;
  format: (districts: District[]) => string;
};

const kpiDefs: KpiDef[] = [
  {
    id: 'total_schools',
    label: 'Total Schools',
    accent: 'accent-blue',
    icon: <School size={16} />,
    format: (ds) => new Intl.NumberFormat('en-IN').format(
      ds.reduce((a, d) => a + (d.metrics?.total_schools ?? 0), 0)
    ),
  },
  {
    id: 'attendance',
    label: 'Attendance',
    accent: 'accent-green',
    icon: <UserCheck size={16} />,
    format: (ds) => {
      const valid = ds.filter(d => d.metrics?.attendance != null);
      if (!valid.length) return 'N/A';
      const avg = valid.reduce((a, d) => a + (d.metrics!.attendance), 0) / valid.length;
      return avg.toFixed(1) + '%';
    },
  },
  {
    id: 'neet_qualified',
    label: 'NEET Qualified',
    accent: 'accent-purple',
    icon: <GraduationCap size={16} />,
    format: (ds) => new Intl.NumberFormat('en-IN').format(
      ds.reduce((a, d) => a + (d.metrics?.neet_qualified ?? 0), 0)
    ),
  },
  {
    id: 'hi_tech_labs',
    label: 'Hi-Tech Labs',
    accent: 'accent-red',
    icon: <FlaskConical size={16} />,
    format: (ds) => {
      const valid = ds.filter(d => d.metrics?.hi_tech_labs != null);
      if (!valid.length) return 'N/A';
      const avg = valid.reduce((a, d) => a + (d.metrics!.hi_tech_labs), 0) / valid.length;
      return avg.toFixed(1) + '%';
    },
  },
  {
    id: 'teachers_staffed',
    label: 'Teachers Staffed',
    accent: 'accent-teal',
    icon: <Users size={16} />,
    format: (ds) => {
      const valid = ds.filter(d => d.metrics?.teachers_staffed != null);
      if (!valid.length) return 'N/A';
      const avg = valid.reduce((a, d) => a + (d.metrics!.teachers_staffed), 0) / valid.length;
      return avg.toFixed(1) + '%';
    },
  },
  {
    id: 'electricity',
    label: 'Grid Connect',
    accent: 'accent-yellow',
    icon: <Zap size={16} />,
    format: (ds) => {
      const valid = ds.filter(d => d.metrics?.electricity != null);
      if (!valid.length) return 'N/A';
      const avg = valid.reduce((a, d) => a + (d.metrics!.electricity), 0) / valid.length;
      return avg.toFixed(1) + '%';
    },
  },
  {
    id: 'wash_audited',
    label: 'WASH Audited',
    accent: 'accent-slate',
    icon: <Droplet size={16} />,
    format: (ds) => {
      const valid = ds.filter(d => d.metrics?.wash_audited != null);
      if (!valid.length) return 'N/A';
      const avg = valid.reduce((a, d) => a + (d.metrics!.wash_audited), 0) / valid.length;
      return avg.toFixed(1) + '%';
    },
  },
  {
    id: 'active_blocks',
    label: 'Active Blocks',
    accent: 'accent-orange',
    icon: <Map size={16} />,
    format: (ds) => new Intl.NumberFormat('en-IN').format(
      ds.reduce((a, d) => a + (d.metrics?.active_blocks ?? 0), 0)
    ),
  },
];

export default function Sidebar({ districts, loading }: SidebarProps) {
  const { selectedMetric, setMetric } = useDashboardStore();

  return (
    <aside
      className="flex flex-col gap-3 h-full overflow-y-auto flex-shrink-0"
      style={{
        width: '340px',
        minWidth: '340px',
        background: '#f4f7f6',
        padding: '16px',
        borderRight: '1px solid #e0e6ed',
      }}
    >
      {/* State Summary */}
      <div
        className="rounded-xl p-4"
        style={{
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
          border: '1px solid #bfdbfe',
        }}
      >
        <span className="block text-[10px] font-extrabold uppercase tracking-widest mb-1" style={{ color: '#2563eb' }}>
          STATE VIEW
        </span>
        <div className="text-2xl font-black" style={{ color: '#1e3a8a' }}>Tamil Nadu</div>
        <div className="text-xs font-semibold mt-1" style={{ color: '#3b82f6' }}>
          {loading ? 'Loading...' : `${districts.length} Districts Monitored`}
        </div>
      </div>

      {/* Data Mode hint */}
      <div className="data-mode-banner">
        <strong>Data Mode:</strong> Select a metric to render the district heatmap.
      </div>

      {/* KPI Grid — 2 columns matching reference HTML */}
      {loading ? (
        <div className="grid grid-cols-2 gap-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {kpiDefs.map((kpi) => (
            <button
              key={kpi.id}
              onClick={() => setMetric(kpi.id)}
              className={`kpi-card ${kpi.accent} ${selectedMetric === kpi.id ? 'active' : ''} text-left w-full`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span style={{ color: '#7f8c8d' }}>{kpi.icon}</span>
                <span className="kpi-title">{kpi.label}</span>
              </div>
              <div className="kpi-value">
                {kpi.format(districts)}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto pt-3" style={{ borderTop: '1px solid #e0e6ed' }}>
        <p className="text-[10px] text-center font-bold uppercase tracking-wider" style={{ color: '#7f8c8d' }}>
          Source: Supabase · VEDA-SAKTHI v1.0
        </p>
      </div>
    </aside>
  );
}