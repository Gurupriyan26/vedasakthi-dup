'use client';

import { School, UserCheck, GraduationCap, FlaskConical, Users, Zap, Droplet, Map as MapIcon } from 'lucide-react';
import { useDashboardStore, MetricType } from '@/store/useDashboardStore';
import { District } from '@/types';

const metricsList = [
  { key: 'total_schools' as MetricType,    label: 'Total Schools',    value: '40,000+', color: 'blue',   icon: <School size={18} strokeWidth={2.5} /> },
  { key: 'attendance' as MetricType,       label: 'Attendance Rate',  value: '88.5%',   color: 'emerald', icon: <UserCheck size={18} strokeWidth={2.5} /> },
  { key: 'neet_qualified' as MetricType,   label: 'NEET Qualified',   value: '14,205',  color: 'purple',  icon: <GraduationCap size={18} strokeWidth={2.5} /> },
  { key: 'hi_tech_labs' as MetricType,     label: 'Active Labs',      value: '6,022',   color: 'rose',    icon: <FlaskConical size={18} strokeWidth={2.5} /> },
  { key: 'teachers_staffed' as MetricType, label: 'Teachers Staffed', value: '3.1L',    color: 'teal',    icon: <Users size={18} strokeWidth={2.5} /> },
  { key: 'electricity' as MetricType,      label: 'Grid Connect',     value: '99.1%',   color: 'yellow',  icon: <Zap size={18} strokeWidth={2.5} /> },
  { key: 'wash_audited' as MetricType,     label: 'WASH Audited',     value: '92%',     color: 'indigo',  icon: <Droplet size={18} strokeWidth={2.5} /> },
  { key: 'active_blocks' as MetricType,    label: 'Active Blocks',    value: '412',     color: 'amber',   icon: <MapIcon size={18} strokeWidth={2.5} /> },
];

const getMetricColor = (color: string) => {
  switch(color) {
    case 'blue': return '#3b82f6';
    case 'emerald': return '#10b981';
    case 'purple': return '#8b5cf6';
    case 'amber': return '#f59e0b';
    case 'teal': return '#14b8a6';
    case 'rose': return '#f43f5e';
    case 'indigo': return '#6366f1';
    default: return '#eab308'; // yellow
  }
}

interface SidebarProps {
  districts: District[];
  loading: boolean;
}

export default function Sidebar({ districts, loading }: SidebarProps) {
  const { selectedMetric, setMetric } = useDashboardStore();

  return (
    <aside
      className="flex flex-col h-full flex-shrink-0 overflow-y-auto custom-scrollbar"
      style={{ 
        width: '350px', 
        zIndex: 10, 
        background: '#f8fafc',
        borderRight: '1px solid #e2e8f0',
      }}
    >
      <div className="p-5">
        
        {/* ── Instructions Banner ── */}
        <div className="mb-6 rounded-xl p-3 text-[13px] bg-indigo-50 text-indigo-800 border border-indigo-100 shadow-sm flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
          <span><strong>Data Mode:</strong> Select metric to render heatmap.</span>
        </div>

        {/* ── Grid Layout ── */}
        <div className="grid grid-cols-2 gap-3.5">
          {metricsList.map((m) => {
            const isActive = selectedMetric === m.key;
            const accent = getMetricColor(m.color);
            return (
              <button
                key={m.key}
                onClick={() => setMetric(m.key)}
                className={`
                  relative flex flex-col justify-between bg-white rounded-2xl p-4 text-left transition-all duration-300 overflow-hidden group
                  ${isActive 
                    ? 'ring-2 shadow-lg border-transparent transform -translate-y-1' 
                    : 'border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-1'
                  }
                `}
                style={{
                  '--tw-ring-color': isActive ? accent : 'transparent',
                } as React.CSSProperties}
              >
                {/* Micro Gradient Background for Active State */}
                {isActive && (
                  <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ background: accent }} />
                )}

                <div className="flex flex-col h-full relative z-10 w-full">
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="p-2 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm" 
                      style={{ 
                        backgroundColor: isActive ? accent : '#f1f5f9', 
                        color: isActive ? '#ffffff' : '#64748b' 
                      }}
                    >
                      {m.icon}
                    </div>
                  </div>
                  
                  <div className="flex flex-col mt-auto w-full">
                    <span className={`text-[26px] font-black tracking-tight leading-none mb-1.5 ${isActive ? '' : 'text-slate-800'}`} style={{ color: isActive ? accent : undefined }}>
                      {m.value}
                    </span>
                    <span className={`text-[10.5px] font-bold uppercase tracking-wider ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>
                      {m.label}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </aside>
  );
}