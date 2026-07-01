'use client';

import { District } from '@/types';
import { useDashboardStore, MetricType } from '@/store/useDashboardStore';
import { 
  School, 
  UserCheck, 
  GraduationCap, 
  FlaskConical, 
  Users, 
  Zap, 
  Droplet, 
  Map 
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  districts: District[];
  loading: boolean;
}

export default function Sidebar({ districts, loading }: SidebarProps) {
  const { selectedMetric, setMetric } = useDashboardStore();

  // Aggregate state-wide metrics
  const stateTotals = districts.reduce(
    (acc, d) => {
      if (!d.metrics) return acc;
      acc.total_schools += d.metrics.total_schools || 0;
      // For percentages, we'll do an average for now
      acc.attendance += d.metrics.attendance || 0;
      acc.neet_qualified += d.metrics.neet_qualified || 0;
      acc.hi_tech_labs += d.metrics.hi_tech_labs || 0;
      acc.teachers_staffed += d.metrics.teachers_staffed || 0;
      acc.electricity += d.metrics.electricity || 0;
      acc.wash_audited += d.metrics.wash_audited || 0;
      acc.active_blocks += d.metrics.active_blocks || 0;
      return acc;
    },
    {
      total_schools: 0,
      attendance: 0,
      neet_qualified: 0,
      hi_tech_labs: 0,
      teachers_staffed: 0,
      electricity: 0,
      wash_audited: 0,
      active_blocks: 0,
    }
  );

  const districtCount = districts.filter(d => d.metrics).length || 1;

  // Format helpers
  const formatNumber = (num: number) => new Intl.NumberFormat('en-IN').format(num);
  const formatPercentage = (sum: number) => (sum / districtCount).toFixed(1) + '%';

  const kpis: { id: MetricType; label: string; value: string; icon: React.ReactNode; colorClass: string }[] = [
    {
      id: 'total_schools',
      label: 'Total Schools',
      value: formatNumber(stateTotals.total_schools),
      icon: <School size={18} />,
      colorClass: 'bg-blue-500 border-blue-500 text-blue-600',
    },
    {
      id: 'attendance',
      label: 'Attendance',
      value: formatPercentage(stateTotals.attendance),
      icon: <UserCheck size={18} />,
      colorClass: 'bg-emerald-500 border-emerald-500 text-emerald-600',
    },
    {
      id: 'neet_qualified',
      label: 'NEET Qualified',
      value: formatNumber(stateTotals.neet_qualified),
      icon: <GraduationCap size={18} />,
      colorClass: 'bg-purple-500 border-purple-500 text-purple-600',
    },
    {
      id: 'hi_tech_labs',
      label: 'Hi-Tech Labs',
      value: formatPercentage(stateTotals.hi_tech_labs),
      icon: <FlaskConical size={18} />,
      colorClass: 'bg-red-500 border-red-500 text-red-600',
    },
    {
      id: 'teachers_staffed',
      label: 'Teachers Staffed',
      value: formatPercentage(stateTotals.teachers_staffed),
      icon: <Users size={18} />,
      colorClass: 'bg-teal-500 border-teal-500 text-teal-600',
    },
    {
      id: 'electricity',
      label: 'Grid Connect',
      value: formatPercentage(stateTotals.electricity),
      icon: <Zap size={18} />,
      colorClass: 'bg-yellow-500 border-yellow-500 text-yellow-600',
    },
    {
      id: 'wash_audited',
      label: 'WASH Audited',
      value: formatPercentage(stateTotals.wash_audited),
      icon: <Droplet size={18} />,
      colorClass: 'bg-slate-600 border-slate-600 text-slate-700',
    },
    {
      id: 'active_blocks',
      label: 'Active Blocks',
      value: formatNumber(stateTotals.active_blocks),
      icon: <Map size={18} />,
      colorClass: 'bg-orange-500 border-orange-500 text-orange-600',
    },
  ];

  return (
    <aside
      className="flex flex-col gap-4 h-full overflow-y-auto glass-panel border border-slate-200/50 shadow-lg relative z-40 custom-scrollbar"
      style={{
        width: '350px',
        minWidth: '350px',
        borderRadius: '24px',
        padding: '24px 20px',
        background: 'rgba(255, 255, 255, 0.85)',
      }}
    >
      {/* State Summary Card */}
      <div
        className="rounded-2xl p-4 mb-2 relative overflow-hidden border border-blue-100"
        style={{
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
          boxShadow: '0 2px 10px rgba(37, 99, 235, 0.04)',
        }}
      >
        <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest block mb-1">
          STATE VIEW
        </span>
        <h2 className="text-2xl font-black text-blue-900 leading-tight">Tamil Nadu</h2>
        <p className="text-xs text-blue-700/80 mt-1 font-semibold flex items-center gap-1">
          {districts.length} Districts Monitored
        </p>
      </div>

      <div className="bg-yellow-50/80 text-yellow-800 p-3 rounded-lg text-xs border border-yellow-200/60 font-medium">
        <strong>Data Mode:</strong> Select a metric to render the district heatmap.
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400 font-medium">
          Loading metrics...
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 pb-2">
          {kpis.map((kpi) => (
            <button
              key={kpi.id}
              onClick={() => setMetric(kpi.id)}
              className={clsx(
                'relative flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 overflow-hidden group',
                selectedMetric === kpi.id
                  ? 'bg-white border-slate-700 shadow-md ring-1 ring-slate-700/50 scale-[1.02]'
                  : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-sm hover:-translate-y-0.5'
              )}
            >
              {/* Colored left bar indicator */}
              <div 
                className={clsx(
                  'absolute top-0 left-0 bottom-0 w-1.5 transition-colors',
                  kpi.colorClass.split(' ')[0] // Uses the bg-* class for the indicator
                )}
              />
              
              <div className="flex items-center gap-2 mb-2 w-full text-slate-500 group-hover:text-slate-700 transition-colors">
                <span className={clsx(selectedMetric === kpi.id ? kpi.colorClass.split(' ')[2] : '')}>
                  {kpi.icon}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider truncate">
                  {kpi.label}
                </span>
              </div>
              
              <div className={clsx(
                "text-xl font-black tracking-tight",
                selectedMetric === kpi.id ? "text-slate-900" : "text-slate-700"
              )}>
                {kpi.value}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-slate-200/60 mt-auto">
        <p className="text-[10px] text-slate-400 text-center font-bold tracking-wide">
          SOURCE: SUPABASE · VEDA-SAKTHI v1.0
        </p>
      </div>
    </aside>
  );
}