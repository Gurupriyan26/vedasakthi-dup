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
    case 'purple': return '#a855f7';
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
      <aside className="hidden xl:flex flex-col w-[350px] flex-shrink-0 bg-[#0f172a] border-l border-[#1e293b] p-8 items-center justify-center z-20">
        <div className="w-20 h-20 rounded-full border border-slate-700 flex items-center justify-center mb-6 bg-slate-800 text-slate-500 shadow-inner">
          <Activity size={32} strokeWidth={1.5} />
        </div>
        <h3 className="text-white font-bold text-lg mb-2">No District Selected</h3>
        <p className="text-slate-400 text-[13px] text-center leading-relaxed">
          Select a district on the map to view detailed administrative metrics and performance indicators.
        </p>
      </aside>
    );
  }

  const { metrics } = selectedDistrict;

  const kpiCards = [
    { key: 'total_schools', label: 'Total Schools', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.total_schools) || 0), color: 'blue', icon: <School size={15} strokeWidth={2.5} /> },
    { key: 'attendance', label: 'Attendance', value: `${Number(metrics?.attendance) || 0}%`, color: 'emerald', icon: <UserCheck size={15} strokeWidth={2.5} /> },
    { key: 'coaching_schools', label: 'NEET/JEE Coaching Schools', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.coaching_schools) || 0), color: 'purple', icon: <School size={15} strokeWidth={2.5} /> },
    { key: 'neet_coaching_enrolment_est', label: 'NEET Enrolment (est.)', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.neet_coaching_enrolment_est) || 0), color: 'indigo', icon: <GraduationCap size={15} strokeWidth={2.5} /> },
    { key: 'jee_coaching_enrolment_est', label: 'JEE Enrolment (est.)', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.jee_coaching_enrolment_est) || 0), color: 'rose', icon: <GraduationCap size={15} strokeWidth={2.5} /> },
    { key: 'total_coaching_enrolment_est', label: 'Total Enrolment (est.)', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.total_coaching_enrolment_est) || 0), color: 'teal', icon: <GraduationCap size={15} strokeWidth={2.5} /> },
    { key: 'active_blocks', label: 'Active Blocks', value: metrics?.active_blocks || 0, color: 'amber', icon: <Layers size={15} strokeWidth={2.5} /> },
    { key: 'teachers_staffed', label: 'Teachers Staffed', value: `${Number(metrics?.teachers_staffed) || 0}%`, color: 'teal', icon: <Users size={15} strokeWidth={2.5} /> },
    { key: 'electricity', label: 'Grid Connected', value: `${Number(metrics?.electricity) || 0}%`, color: 'yellow', icon: <Zap size={15} strokeWidth={2.5} /> },
    { key: 'hi_tech_labs', label: 'Lab Facilities', value: `${Number(metrics?.hi_tech_labs) || 0}%`, color: 'rose', icon: <FlaskConical size={15} strokeWidth={2.5} /> },
    { key: 'wash_audited', label: 'Sanitation', value: `${Number(metrics?.wash_audited) || 0}%`, color: 'indigo', icon: <Droplet size={15} strokeWidth={2.5} /> },
  ];

  return (
    <aside className="hidden xl:flex flex-col w-[350px] flex-shrink-0 bg-[#0f172a] border-l border-[#1e293b] h-full overflow-y-auto z-20">
      
      {/* ── Header ── */}
      <div className="sticky top-0 z-10 pt-5 px-5 pb-4 bg-[#0f172a]/90 backdrop-blur-md border-b border-[#1e293b] flex flex-col gap-1">
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
            District Profile
          </span>
          <button 
            onClick={onClearDistrict}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Clear selection"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
        <h2 className="text-[22px] font-black text-white tracking-tight truncate mt-1.5">
          {selectedDistrict.district_name.replace('Tiruchirappalli', 'Trichy').replace('Ramanathapuram', 'Ramanathapuram')}
        </h2>
      </div>

      {/* ── Compact Premium Dark Grid ── */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {kpiCards.map(card => {
            const isActive = selectedMetric === card.key;
            const accent = getMetricColor(card.color);
            return (
              <button
                key={card.key}
                onClick={() => setMetric(card.key as any)}
                className={`
                  relative flex flex-col justify-between bg-[#1e293b] rounded-xl p-3 text-left transition-all duration-300 overflow-hidden group
                  ${isActive 
                    ? 'transform -translate-y-1' 
                    : 'border border-slate-700/50 shadow-sm hover:shadow-md hover:border-slate-600 hover:-translate-y-0.5'
                  }
                `}
                style={{
                  boxShadow: isActive ? `0 8px 24px -4px ${accent}40, 0 0 0 1.5px ${accent}` : undefined,
                } as React.CSSProperties}
              >
                {/* Micro Gradient Background for Active State */}
                {isActive && (
                  <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${accent}30, transparent 70%)` }} />
                )}

                <div className="flex flex-col h-full relative z-10 w-full">
                  <div className="flex items-center justify-between w-full mb-2">
                    <div 
                      className="p-1.5 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm" 
                      style={{ 
                        backgroundColor: isActive ? accent : '#0f172a', 
                        color: isActive ? '#ffffff' : accent 
                      }}
                    >
                      {card.icon}
                    </div>
                    <span className={`text-[18px] font-black tracking-tight leading-none ${isActive ? 'text-white' : 'text-slate-200'}`}>
                      {card.value}
                    </span>
                  </div>
                  
                  <span className={`text-[9px] font-black uppercase tracking-[0.15em] mt-1 line-clamp-1 ${isActive ? 'text-slate-200' : 'text-slate-400'}`}>
                    {card.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
