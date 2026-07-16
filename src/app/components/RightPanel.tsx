'use client';

import { useState, useEffect } from 'react';
import { District } from '@/types';
import { useDashboardStore } from '@/store/useDashboardStore';
import { fetchVetriSchools, VetriSchool } from '@/lib/api';
import { School, UserCheck, GraduationCap, FlaskConical, Users, Zap, Droplet, Layers, Activity, X, MapPin } from 'lucide-react';

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
  const { setMetric, selectedMetric, theme } = useDashboardStore();
  const [schools, setSchools] = useState<VetriSchool[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);

  useEffect(() => {
    if (!selectedDistrict) {
      setSchools([]);
      return;
    }

    let isMounted = true;
    setSchoolsLoading(true);

    fetchVetriSchools(selectedDistrict.id)
      .then(data => {
        if (isMounted) {
          setSchools(data);
          setSchoolsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSchools([]);
          setSchoolsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDistrict]);

  if (!selectedDistrict) {
    return (
      <aside className={`hidden xl:flex flex-col w-[350px] flex-shrink-0 border-l p-8 items-center justify-center z-20 transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-[#0f172a] border-[#1e293b]' 
          : 'bg-[#ffffff] border-[#e2e8f0]'
      }`}>
        <div className={`w-20 h-20 rounded-full border flex items-center justify-center mb-6 shadow-inner ${
          theme === 'dark' 
            ? 'border-slate-700 bg-slate-800 text-slate-500' 
            : 'border-slate-200 bg-slate-50 text-slate-400'
        }`}>
          <Activity size={32} strokeWidth={1.5} />
        </div>
        <h3 className={`font-bold text-lg mb-2 transition-colors duration-300 ${
          theme === 'dark' ? 'text-white' : 'text-slate-800'
        }`}>No District Selected</h3>
        <p className={`text-[13px] text-center leading-relaxed transition-colors duration-300 ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-555'
        }`}>
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
    { key: 'neet_coaching_enrolment_est', label: 'NEET Coaching Enrolment (est.)', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.neet_coaching_enrolment_est) || 0), color: 'indigo', icon: <GraduationCap size={15} strokeWidth={2.5} /> },
    { key: 'jee_coaching_enrolment_est', label: 'JEE Coaching Enrolment (est.)', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.jee_coaching_enrolment_est) || 0), color: 'rose', icon: <GraduationCap size={15} strokeWidth={2.5} /> },
    { key: 'total_coaching_enrolment_est', label: 'Total Coaching Enrolment (est.)', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.total_coaching_enrolment_est) || 0), color: 'teal', icon: <GraduationCap size={15} strokeWidth={2.5} /> },
    { key: 'active_blocks', label: 'Active Blocks', value: metrics?.active_blocks || 0, color: 'amber', icon: <Layers size={15} strokeWidth={2.5} /> },
    { key: 'teachers_staffed', label: 'Teachers Staffed', value: `${Number(metrics?.teachers_staffed) || 0}%`, color: 'teal', icon: <Users size={15} strokeWidth={2.5} /> },
    { key: 'electricity', label: 'Grid Connected', value: `${Number(metrics?.electricity) || 0}%`, color: 'yellow', icon: <Zap size={15} strokeWidth={2.5} /> },
    { key: 'hi_tech_labs', label: 'Lab Facilities', value: `${Number(metrics?.hi_tech_labs) || 0}%`, color: 'rose', icon: <FlaskConical size={15} strokeWidth={2.5} /> },
    { key: 'wash_audited', label: 'Sanitation', value: `${Number(metrics?.wash_audited) || 0}%`, color: 'indigo', icon: <Droplet size={15} strokeWidth={2.5} /> },
  ];

  return (
    <aside className={`hidden xl:flex flex-col w-[350px] flex-shrink-0 border-l h-full overflow-y-auto z-20 transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-[#0f172a] border-[#1e293b]' 
        : 'bg-[#ffffff] border-[#e2e8f0]'
    }`}>
      
      {/* ── Header ── */}
      <div className={`sticky top-0 z-20 pt-5 px-5 pb-4 border-b flex flex-col gap-1 backdrop-blur-md transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-[#0f172a]/90 border-[#1e293b]' 
          : 'bg-white/90 border-[#e2e8f0]'
      }`}>
        <div className="flex items-center justify-between w-full">
          <span className={`text-[10px] font-extrabold uppercase tracking-widest border px-2 py-0.5 rounded flex items-center gap-1.5 transition-colors duration-300 ${
            theme === 'dark' 
              ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' 
              : 'text-indigo-650 bg-indigo-50 border-indigo-200'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
            District Profile
          </span>
          <button 
            onClick={onClearDistrict}
            className={`p-1.5 rounded-lg transition-colors duration-300 cursor-pointer ${
              theme === 'dark' 
                ? 'text-slate-500 hover:text-white hover:bg-slate-800' 
                : 'text-slate-450 hover:text-slate-800 hover:bg-slate-100'
            }`}
            aria-label="Clear selection"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
        <h2 className={`text-[22px] font-black tracking-tight truncate mt-1.5 transition-colors duration-300 ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
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
                  relative flex flex-col justify-between rounded-xl p-3 text-left transition-all duration-300 overflow-hidden group border
                  ${isActive 
                    ? 'transform -translate-y-1 bg-[#1e293b] border-transparent' 
                    : theme === 'dark'
                      ? 'bg-[#1e293b] border-slate-700/50 shadow-sm hover:shadow-md hover:border-slate-600 hover:-translate-y-0.5'
                      : 'bg-slate-50 border-slate-200 shadow-sm hover:shadow-md hover:border-slate-350 hover:bg-slate-100/50 hover:-translate-y-0.5'
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
                      className={`p-1.5 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm ${
                        !isActive && theme === 'light' ? 'border border-slate-250 bg-white' : ''
                      }`} 
                      style={{ 
                        backgroundColor: isActive ? accent : (theme === 'dark' ? '#0f172a' : '#ffffff'), 
                        color: isActive ? '#ffffff' : accent 
                      }}
                    >
                      {card.icon}
                    </div>
                    <span className={`text-[18px] font-black tracking-tight leading-none transition-colors duration-300 ${
                      isActive 
                        ? 'text-white' 
                        : theme === 'dark'
                          ? 'text-slate-200'
                          : 'text-slate-900'
                    }`}>
                      {card.value}
                    </span>
                  </div>
                  
                  <span className={`text-[9px] font-black uppercase tracking-[0.15em] mt-1 line-clamp-1 transition-colors duration-300 ${
                    isActive 
                      ? 'text-slate-200' 
                      : theme === 'dark'
                        ? 'text-slate-400'
                        : 'text-slate-600'
                  }`}>
                    {card.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Vetri Palligal Coaching Centres list ── */}
      {selectedDistrict && (
        <div className={`flex flex-col flex-1 border-t mt-2 p-5 min-h-[250px] transition-all duration-300 ${
          theme === 'dark' 
            ? 'border-[#1e293b] bg-[#0b0f19]/30' 
            : 'border-[#e2e8f0] bg-slate-50/50'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-[11px] font-extrabold uppercase tracking-[0.15em] flex items-center gap-2 transition-colors duration-300 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              <GraduationCap size={14} className="text-purple-400 animate-bounce" style={{ animationDuration: '3s' }} />
              Coaching Centres ({schools.length})
            </h3>
            {schoolsLoading && (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
            )}
          </div>

          {schoolsLoading ? (
            <div className="flex flex-col gap-2.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`rounded-xl p-3 animate-pulse h-14 border ${
                  theme === 'dark' ? 'bg-[#1e293b]/40 border-slate-800/40' : 'bg-slate-100/50 border-slate-200/50'
                }`} />
              ))}
            </div>
          ) : schools.length > 0 ? (
            <div className="overflow-y-auto max-h-[320px] flex flex-col gap-2 pr-1 scrollbar-thin">
              {schools.map(school => (
                <div 
                  key={school.id} 
                  className={`border rounded-xl p-3 flex flex-col gap-1 transition-all group ${
                    theme === 'dark'
                      ? 'bg-[#1e293b]/40 border-slate-800/60 hover:bg-[#1e293b]/70 hover:border-slate-700/60'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex gap-2 items-start">
                    <div className={`p-1 rounded transition-colors mt-0.5 ${
                      theme === 'dark' 
                        ? 'bg-[#0f172a] text-purple-400 group-hover:bg-purple-500/20 group-hover:text-purple-300' 
                        : 'bg-purple-50 text-purple-600 group-hover:bg-purple-100/80 group-hover:text-purple-800 border border-purple-100'
                    }`}>
                      <School size={12} />
                    </div>
                    <span className={`text-[11px] font-semibold transition-colors leading-tight ${
                      theme === 'dark' ? 'text-slate-200 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'
                    }`}>
                      {school.school_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 pl-6">
                    <MapPin size={9} className="text-slate-500" />
                    <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">
                      {school.block_name} Block
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`flex-1 flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-dashed ${
              theme === 'dark' ? 'bg-[#1e293b]/20 border-slate-800/50' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-2xl mb-2">🏫</span>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No Centres Registered</p>
              <p className="text-[9px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                There are no Vetri Palligal coaching centres listed for this district.
              </p>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
