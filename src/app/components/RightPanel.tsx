'use client';

import { District } from '@/types';
import { useDashboardStore } from '@/store/useDashboardStore';
import { School, UserCheck, GraduationCap, FlaskConical, Users, Zap, Droplet, Layers, TrendingUp, Activity, X } from 'lucide-react';

interface RightPanelProps {
  selectedDistrict: District | null;
  onClearDistrict: () => void;
}

export default function RightPanel({ selectedDistrict, onClearDistrict }: RightPanelProps) {
  const { setMetric, selectedMetric } = useDashboardStore();

  if (!selectedDistrict) {
    return (
      <aside className="hidden xl:flex flex-col w-[350px] flex-shrink-0 bg-white border-l border-slate-200 p-8 items-center justify-center z-20">
        <div className="w-20 h-20 rounded-full border border-slate-200 flex items-center justify-center mb-6 bg-slate-50 text-slate-400">
          <Activity size={32} />
        </div>
        <h3 className="text-slate-700 font-semibold text-lg mb-2">No District Selected</h3>
        <p className="text-slate-500 text-sm text-center leading-relaxed">
          Select a district on the map to view detailed administrative metrics and performance indicators.
        </p>
      </aside>
    );
  }

  const { metrics } = selectedDistrict;

  const kpiCards = [
    { key: 'total_schools', label: 'Total Schools', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.total_schools) || 0), icon: <School size={18} strokeWidth={2} />, trend: '+124' },
    { key: 'attendance', label: 'Attendance Rate', value: `${Number(metrics?.attendance) || 0}%`, icon: <UserCheck size={18} strokeWidth={2} />, trend: '+1.2%' },
    { key: 'neet_qualified', label: 'NEET Qualified', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.neet_qualified) || 0), icon: <GraduationCap size={18} strokeWidth={2} />, trend: '+14%' },
    { key: 'active_blocks', label: 'Active Blocks', value: metrics?.active_blocks || 0, icon: <Layers size={18} strokeWidth={2} />, trend: 'Live' },
    { key: 'teachers_staffed', label: 'Teachers Staffed', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.teachers_staffed) || 0), icon: <Users size={18} strokeWidth={2} />, trend: '+890' },
    { key: 'electricity', label: 'Grid Connected', value: `${Number(metrics?.electricity) || 0}%`, icon: <Zap size={18} strokeWidth={2} />, trend: '+0.5%' },
    { key: 'hi_tech_labs', label: 'Lab Facilities', value: `${Number(metrics?.hi_tech_labs) || 0}%`, icon: <FlaskConical size={18} strokeWidth={2} />, trend: '+3.4%' },
    { key: 'wash_audited', label: 'WASH Audited', value: `${Number(metrics?.wash_audited) || 0}%`, icon: <Droplet size={18} strokeWidth={2} />, trend: '+2.1%' },
  ];

  return (
    <aside className="hidden xl:flex flex-col w-[350px] flex-shrink-0 bg-white border-l border-slate-200 h-full overflow-y-auto z-20">
      
      {/* ── Header ── */}
      <div className="sticky top-0 z-10 pt-6 px-6 pb-4 bg-white border-b border-slate-200 flex flex-col gap-1">
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            District Profile
          </span>
          <button 
            onClick={onClearDistrict}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Clear selection"
          >
            <X size={16} />
          </button>
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight truncate">
          {selectedDistrict.district_name.replace('Tiruchirappalli', 'Trichy').replace('Ramanathapuram', 'Ramanathapuram')}
        </h2>
      </div>

      {/* ── Official List Layout ── */}
      <div className="flex flex-col">
        {kpiCards.map(card => {
          const isActive = selectedMetric === card.key;
          return (
            <button
              key={card.key}
              onClick={() => setMetric(card.key as any)}
              className={`
                flex flex-row items-center justify-between p-4 w-full text-left transition-colors border-b border-slate-100 last:border-b-0
                ${isActive 
                  ? 'bg-blue-50/50 border-l-4 border-l-blue-600' 
                  : 'bg-white border-l-4 border-l-transparent hover:bg-slate-50'
                }
              `}
            >
              <div className="flex items-center gap-4">
                {/* Standardized Icon Container */}
                <div className={`w-10 h-10 rounded-md flex items-center justify-center ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                  {card.icon}
                </div>
                
                {/* Text Col */}
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-slate-600'}`}>
                    {card.label}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <TrendingUp size={12} className={isActive ? 'text-blue-500' : 'text-slate-400'} strokeWidth={2.5} />
                    <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
                      {card.trend}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Right Value */}
              <div className={`text-lg font-semibold ${isActive ? 'text-blue-700' : 'text-slate-800'}`}>
                {card.value}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
