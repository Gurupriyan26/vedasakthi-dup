'use client';

import { District } from '@/types';
import { useDashboardStore } from '@/store/useDashboardStore';
import { School, UserCheck, GraduationCap, FlaskConical, Users, Zap, Droplet, Layers, Activity, X } from 'lucide-react';

interface RightPanelProps {
  selectedDistrict: District | null;
  onClearDistrict: () => void;
}

const getMetricColor = (color: string) => {
  switch(color) {
    case 'blue': return '#3b82f6';
    case 'emerald': return '#10b981';
    case 'purple': return '#8b5cf6';
    case 'amber': return '#f59e0b';
    case 'teal': return '#14b8a6';
    case 'rose': return '#f43f5e';
    case 'indigo': return '#6366f1';
    default: return '#eab308'; // yellow for electricity
  }
}

export default function RightPanel({ selectedDistrict, onClearDistrict }: RightPanelProps) {
  const { setMetric, selectedMetric } = useDashboardStore();

  if (!selectedDistrict) {
    return (
      <aside className="hidden xl:flex flex-col w-[350px] flex-shrink-0 bg-[#f8fafc] border-l border-slate-200 p-8 items-center justify-center z-20">
        <div className="w-20 h-20 rounded-full border border-slate-200 flex items-center justify-center mb-6 bg-white text-slate-400 shadow-sm">
          <Activity size={32} strokeWidth={1.5} />
        </div>
        <h3 className="text-slate-800 font-bold text-lg mb-2">No District Selected</h3>
        <p className="text-slate-500 text-[13px] text-center leading-relaxed">
          Select a district on the map to view detailed administrative metrics and performance indicators.
        </p>
      </aside>
    );
  }

  const { metrics } = selectedDistrict;

  const kpiCards = [
    { key: 'total_schools', label: 'Total Schools', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.total_schools) || 0), color: 'blue', icon: <School size={18} strokeWidth={2.5} /> },
    { key: 'attendance', label: 'Attendance', value: `${Number(metrics?.attendance) || 0}%`, color: 'emerald', icon: <UserCheck size={18} strokeWidth={2.5} /> },
    { key: 'neet_qualified', label: 'NEET Qualified', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.neet_qualified) || 0), color: 'purple', icon: <GraduationCap size={18} strokeWidth={2.5} /> },
    { key: 'active_blocks', label: 'Active Blocks', value: metrics?.active_blocks || 0, color: 'amber', icon: <Layers size={18} strokeWidth={2.5} /> },
    { key: 'teachers_staffed', label: 'Teachers Staffed', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.teachers_staffed) || 0), color: 'teal', icon: <Users size={18} strokeWidth={2.5} /> },
    { key: 'electricity', label: 'Grid Connected', value: `${Number(metrics?.electricity) || 0}%`, color: 'yellow', icon: <Zap size={18} strokeWidth={2.5} /> },
    { key: 'hi_tech_labs', label: 'Lab Facilities', value: `${Number(metrics?.hi_tech_labs) || 0}%`, color: 'rose', icon: <FlaskConical size={18} strokeWidth={2.5} /> },
    { key: 'wash_audited', label: 'WASH Audited', value: `${Number(metrics?.wash_audited) || 0}%`, color: 'indigo', icon: <Droplet size={18} strokeWidth={2.5} /> },
  ];

  return (
    <aside className="hidden xl:flex flex-col w-[350px] flex-shrink-0 bg-[#f8fafc] border-l border-slate-200 h-full overflow-y-auto z-20">
      
      {/* ── Header ── */}
      <div className="sticky top-0 z-10 pt-6 px-6 pb-4 bg-[#f8fafc]/90 backdrop-blur-md border-b border-slate-200 flex flex-col gap-1">
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
            District Profile
          </span>
          <button 
            onClick={onClearDistrict}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Clear selection"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
        <h2 className="text-[24px] font-black text-slate-900 tracking-tight truncate mt-1.5">
          {selectedDistrict.district_name.replace('Tiruchirappalli', 'Trichy').replace('Ramanathapuram', 'Ramanathapuram')}
        </h2>
      </div>

      {/* ── Premium Grid Layout ── */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3.5">
          {kpiCards.map(card => {
            const isActive = selectedMetric === card.key;
            const accent = getMetricColor(card.color);
            return (
              <button
                key={card.key}
                onClick={() => setMetric(card.key as any)}
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
                      {card.icon}
                    </div>
                  </div>
                  
                  <div className="flex flex-col mt-auto w-full">
                    <span className={`text-[26px] font-black tracking-tight leading-none mb-1.5 ${isActive ? '' : 'text-slate-800'}`} style={{ color: isActive ? accent : undefined }}>
                      {card.value}
                    </span>
                    <span className={`text-[10.5px] font-bold uppercase tracking-wider ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>
                      {card.label}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
