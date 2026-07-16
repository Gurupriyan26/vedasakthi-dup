'use client';

import { useMemo } from 'react';
import { School, UserCheck, GraduationCap, FlaskConical, Users, Zap, Droplet, Map as MapIcon, TrendingUp } from 'lucide-react';
import { useDashboardStore, MetricType } from '@/store/useDashboardStore';
import { District } from '@/types';

const getMetricColor = (color: string) => {
  switch(color) {
    case 'blue': return '#3b82f6';
    case 'emerald': return '#10b981';
    case 'purple': return '#a855f7';
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

  const computedMetrics = useMemo(() => {
    if (districts.length === 0) {
      return {
        total_schools: '0',
        attendance: '0%',
        coaching_schools: '0',
        neet_coaching_enrolment_est: '0',
        jee_coaching_enrolment_est: '0',
        total_coaching_enrolment_est: '0',
        hi_tech_labs: '0%',
        teachers_staffed: '0%',
        electricity: '0%',
        wash_audited: '0%',
        active_blocks: '0',
      };
    }
    
    let totalSchools = 0;
    let sumAttendance = 0;
    let countAttendance = 0;
    let totalCoachingSchools = 0;
    let totalNeetEst = 0;
    let totalJeeEst = 0;
    let totalCoachingEst = 0;
    let sumLabs = 0;
    let countLabs = 0;
    let sumTeachers = 0;
    let countTeachers = 0;
    let sumElectricity = 0;
    let countElectricity = 0;
    let sumWash = 0;
    let countWash = 0;
    let totalBlocks = 0;
    
    districts.forEach(d => {
      const m = d.metrics;
      if (!m) return;
      
      if (m.total_schools != null) totalSchools += Number(m.total_schools);
      if (m.attendance != null) {
        sumAttendance += Number(m.attendance);
        countAttendance++;
      }
      if (m.coaching_schools != null) totalCoachingSchools += Number(m.coaching_schools);
      if (m.neet_coaching_enrolment_est != null) totalNeetEst += Number(m.neet_coaching_enrolment_est);
      if (m.jee_coaching_enrolment_est != null) totalJeeEst += Number(m.jee_coaching_enrolment_est);
      if (m.total_coaching_enrolment_est != null) totalCoachingEst += Number(m.total_coaching_enrolment_est);
      if (m.hi_tech_labs != null) {
        sumLabs += Number(m.hi_tech_labs);
        countLabs++;
      }
      if (m.teachers_staffed != null) {
        sumTeachers += Number(m.teachers_staffed);
        countTeachers++;
      }
      if (m.electricity != null) {
        sumElectricity += Number(m.electricity);
        countElectricity++;
      }
      if (m.wash_audited != null) {
        sumWash += Number(m.wash_audited);
        countWash++;
      }
      if (m.active_blocks != null) totalBlocks += Number(m.active_blocks);
    });

    const formatPercent = (sum: number, count: number) => {
      if (count === 0) return '0%';
      return `${(sum / count).toFixed(1)}%`;
    };

    const formatNumber = (num: number) => {
      return new Intl.NumberFormat('en-IN').format(num);
    };

    return {
      total_schools: formatNumber(totalSchools),
      attendance: formatPercent(sumAttendance, countAttendance),
      coaching_schools: formatNumber(totalCoachingSchools),
      neet_coaching_enrolment_est: formatNumber(totalNeetEst),
      jee_coaching_enrolment_est: formatNumber(totalJeeEst),
      total_coaching_enrolment_est: formatNumber(totalCoachingEst),
      hi_tech_labs: formatPercent(sumLabs, countLabs),
      teachers_staffed: formatPercent(sumTeachers, countTeachers),
      electricity: formatPercent(sumElectricity, countElectricity),
      wash_audited: formatPercent(sumWash, countWash),
      active_blocks: formatNumber(totalBlocks),
    };
  }, [districts]);

  const metricsList = useMemo(() => [
    { key: 'total_schools' as MetricType,    label: 'Total Schools',    value: computedMetrics.total_schools, color: 'blue',   icon: <School size={15} strokeWidth={2.5} /> },
    { key: 'attendance' as MetricType,       label: 'Attendance',       value: computedMetrics.attendance, color: 'emerald', icon: <UserCheck size={15} strokeWidth={2.5} /> },
    { key: 'coaching_schools' as MetricType, label: 'NEET/JEE Coaching Schools', value: computedMetrics.coaching_schools, color: 'purple', icon: <School size={15} strokeWidth={2.5} /> },
    { key: 'neet_coaching_enrolment_est' as MetricType, label: 'NEET Enrolment (est.)', value: computedMetrics.neet_coaching_enrolment_est, color: 'indigo', icon: <GraduationCap size={15} strokeWidth={2.5} /> },
    { key: 'jee_coaching_enrolment_est' as MetricType, label: 'JEE Enrolment (est.)', value: computedMetrics.jee_coaching_enrolment_est, color: 'rose', icon: <GraduationCap size={15} strokeWidth={2.5} /> },
    { key: 'total_coaching_enrolment_est' as MetricType, label: 'Total Enrolment (est.)', value: computedMetrics.total_coaching_enrolment_est, color: 'teal', icon: <GraduationCap size={15} strokeWidth={2.5} /> },
    { key: 'hi_tech_labs' as MetricType,     label: 'Active Labs',      value: computedMetrics.hi_tech_labs, color: 'rose',    icon: <FlaskConical size={15} strokeWidth={2.5} /> },
    { key: 'teachers_staffed' as MetricType, label: 'Teachers Staffed', value: computedMetrics.teachers_staffed, color: 'teal',    icon: <Users size={15} strokeWidth={2.5} /> },
    { key: 'electricity' as MetricType,      label: 'Grid Connect',     value: computedMetrics.electricity, color: 'yellow',  icon: <Zap size={15} strokeWidth={2.5} /> },
    { key: 'wash_audited' as MetricType,     label: 'Sanitation',       value: computedMetrics.wash_audited, color: 'indigo',  icon: <Droplet size={15} strokeWidth={2.5} /> },
    { key: 'active_blocks' as MetricType,    label: 'Active Blocks',    value: computedMetrics.active_blocks, color: 'amber',   icon: <MapIcon size={15} strokeWidth={2.5} /> },
  ], [computedMetrics]);

  return (
    <aside
      className="flex flex-col h-full flex-shrink-0 overflow-y-auto custom-scrollbar"
      style={{ 
        width: '350px', 
        zIndex: 10, 
        background: '#0f172a',
        borderRight: '1px solid #1e293b',
      }}
    >
      <div className="p-4">
        
        {/* ── Brand Logo Header ── */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <TrendingUp size={18} strokeWidth={2.5} className="text-white" />
          </div>
          <div>
            <h2 className="text-[13px] font-black text-white uppercase tracking-widest leading-tight">TN Education</h2>
            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Dashboard Prototype</p>
          </div>
        </div>

        {/* ── Instructions Banner ── */}
        <div className="mb-5 rounded-lg p-3 text-[11px] bg-[#1e293b] text-slate-300 border border-slate-700/50 flex items-center gap-2.5 shadow-inner">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)] flex-shrink-0" />
          <span className="leading-relaxed tracking-wide"><strong>DATA MODE:</strong> SELECT METRIC TO RENDER HEATMAP.</span>
        </div>

        {/* ── Compact Premium Dark Grid ── */}
        <div className="grid grid-cols-2 gap-3">
          {metricsList.map((m) => {
            const isActive = selectedMetric === m.key;
            const accent = getMetricColor(m.color);
            return (
              <button
                key={m.key}
                onClick={() => setMetric(m.key)}
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
                      {m.icon}
                    </div>
                    <span className={`text-[18px] font-black tracking-tight leading-none ${isActive ? 'text-white' : 'text-slate-200'}`}>
                      {m.value}
                    </span>
                  </div>
                  
                  <span className={`text-[9px] font-black uppercase tracking-[0.15em] mt-1 line-clamp-2 ${isActive ? 'text-slate-200' : 'text-slate-400'}`}>
                    {m.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </aside>
  );
}