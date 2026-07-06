'use client';

import { District } from '@/types';
import { useDashboardStore } from '@/store/useDashboardStore';
import { School, UserCheck, GraduationCap, FlaskConical, Users, Zap, Droplet, Layers, TrendingUp, Activity, X } from 'lucide-react';

interface RightPanelProps {
  selectedDistrict: District | null;
  onClearDistrict: () => void;
}

const getActiveBorder = (color: string) => {
  switch(color) {
    case 'blue': return 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]';
    case 'emerald': return 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]';
    case 'purple': return 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)]';
    case 'rose': return 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.15)]';
    case 'teal': return 'border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.15)]';
    case 'amber': return 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]';
    case 'indigo': return 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)]';
    default: return 'border-slate-200';
  }
}

const getActiveText = (color: string) => {
  switch(color) {
    case 'blue': return 'text-blue-500';
    case 'emerald': return 'text-emerald-500';
    case 'purple': return 'text-purple-500';
    case 'rose': return 'text-rose-500';
    case 'teal': return 'text-teal-500';
    case 'amber': return 'text-amber-500';
    case 'indigo': return 'text-indigo-500';
    default: return 'text-slate-800';
  }
}

const getBadgeStyle = (color: string) => {
  switch(color) {
    case 'blue': return 'bg-blue-500/10 text-blue-400';
    case 'emerald': return 'bg-emerald-500/10 text-emerald-400';
    case 'purple': return 'bg-purple-500/10 text-purple-400';
    case 'rose': return 'bg-rose-500/10 text-rose-400';
    case 'teal': return 'bg-teal-500/10 text-teal-400';
    case 'amber': return 'bg-amber-500/10 text-amber-400';
    case 'indigo': return 'bg-indigo-500/10 text-indigo-400';
    default: return 'bg-slate-100 text-slate-500';
  }
}

export default function RightPanel({ selectedDistrict, onClearDistrict }: RightPanelProps) {
  const { setMetric, selectedMetric } = useDashboardStore();

  if (!selectedDistrict) {
    return (
      <aside className="hidden xl:flex flex-col w-[380px] flex-shrink-0 bg-white border-l border-slate-200 p-6 items-center justify-center z-20 shadow-sm relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="w-24 h-24 rounded-[2rem] border border-slate-200 flex items-center justify-center mb-8 bg-slate-50 shadow-sm">
          <Activity size={36} className="text-slate-400" />
        </div>
        <h3 className="text-slate-800 font-bold text-lg mb-2">No District Selected</h3>
        <p className="text-slate-500 font-medium tracking-wide text-center text-[13px] leading-relaxed max-w-[250px]">
          Click on any district boundary on the map to unlock its detailed telemetry and performance data.
        </p>
      </aside>
    );
  }

  const { metrics } = selectedDistrict;

  const kpiCards = [
    { key: 'total_schools', label: 'TOTAL SCHOOLS', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.total_schools) || 0), icon: <School size={20} strokeWidth={1.5} />, color: 'blue', trend: '+124', trendIcon: true },
    { key: 'attendance', label: 'ATTENDANCE', value: `${Number(metrics?.attendance) || 0}%`, icon: <UserCheck size={20} strokeWidth={1.5} />, color: 'emerald', trend: '+1.2%', trendIcon: true },
    { key: 'neet_qualified', label: 'NEET QUALIFIED', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.neet_qualified) || 0), icon: <GraduationCap size={20} strokeWidth={1.5} />, color: 'purple', trend: '+14%', trendIcon: true },
    { key: 'active_blocks', label: 'ACTIVE BLOCKS', value: metrics?.active_blocks || 0, icon: <Layers size={20} strokeWidth={1.5} />, color: 'amber', trend: 'Live', trendIcon: true },
    { key: 'teachers_staffed', label: 'TEACHERS', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.teachers_staffed) || 0), icon: <Users size={20} strokeWidth={1.5} />, color: 'teal', trend: '+890', trendIcon: true },
    { key: 'electricity', label: 'ELECTRICITY', value: `${Number(metrics?.electricity) || 0}%`, icon: <Zap size={20} strokeWidth={1.5} />, color: 'amber', trend: '+0.5%', trendIcon: true },
    { key: 'hi_tech_labs', label: 'LAB FACILITIES', value: `${Number(metrics?.hi_tech_labs) || 0}%`, icon: <FlaskConical size={20} strokeWidth={1.5} />, color: 'rose', trend: '+3.4%', trendIcon: true },
    { key: 'wash_audited', label: 'SANITATION', value: `${Number(metrics?.wash_audited) || 0}%`, icon: <Droplet size={20} strokeWidth={1.5} />, color: 'indigo', trend: '+2.1%', trendIcon: true },
  ];

  return (
    <aside className="hidden xl:flex flex-col w-[380px] flex-shrink-0 bg-white border-l border-slate-200 h-full overflow-y-auto custom-scrollbar shadow-sm z-20 relative">
      
      {/* ── Header ── */}
      <div className="sticky top-0 z-10 pt-6 px-6 pb-2 bg-white/95 backdrop-blur-xl flex items-end justify-between border-b border-transparent">
        <div className="flex flex-col">
          <span className="text-[12px] font-black uppercase tracking-widest text-slate-500">
            Command Metrics
          </span>
          <span className="text-2xl font-black text-slate-800 tracking-tight mt-1 truncate max-w-[200px]">
            {selectedDistrict.district_name.replace('Tiruchirappalli', 'Trichy').replace('Ramanathapuram', 'Ramanathapuram')}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            District Avg
          </span>
          <button 
            onClick={onClearDistrict}
            className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-all bg-slate-50 border border-slate-200"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ── Light Mode KPI Cards ── */}
      <div className="p-4 flex flex-col gap-3">
        {kpiCards.map(card => {
          const isActive = selectedMetric === card.key;
          return (
            <button
              key={card.key}
              onClick={() => setMetric(card.key as any)}
              className={`
                flex flex-row items-center justify-between p-4 rounded-[14px] transition-all w-full text-left
                ${isActive 
                  ? `bg-slate-50 border ${getActiveBorder(card.color)}` 
                  : 'bg-slate-50 border border-slate-200 hover:border-slate-300'
                }
              `}
            >
              <div className="flex items-center gap-4">
                {/* Icon Container */}
                <div className="w-[42px] h-[42px] rounded-2xl bg-slate-200/50 flex items-center justify-center text-slate-400">
                  {card.icon}
                </div>
                
                {/* Text Col */}
                <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase text-slate-500 tracking-[0.08em]">
                    {card.label}
                  </span>
                  <div className={`mt-1 inline-flex items-center gap-1 px-1.5 py-[2px] rounded-[4px] text-[10px] font-bold w-fit ${getBadgeStyle(card.color)}`}>
                    {card.trendIcon && <TrendingUp size={10} strokeWidth={3} />}
                    {card.trend}
                  </div>
                </div>
              </div>
              
              {/* Right Value */}
              <div className={`text-[22px] font-black ${isActive ? getActiveText(card.color) : 'text-slate-800'}`}>
                {card.value}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
