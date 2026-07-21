'use client';

import { useMemo } from 'react';
import { School, UserCheck, GraduationCap, FlaskConical, Users, Zap, Droplet, Map as MapIcon, TrendingUp, X } from 'lucide-react';
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
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ districts, loading, isOpen = false, onClose }: SidebarProps) {
  const { selectedMetric, setMetric, theme } = useDashboardStore();

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
      attendance: 'N/A',
      coaching_schools: formatNumber(totalCoachingSchools),
      neet_coaching_enrolment_est: formatNumber(totalNeetEst),
      jee_coaching_enrolment_est: formatNumber(totalJeeEst),
      total_coaching_enrolment_est: formatNumber(totalCoachingEst),
      hi_tech_labs: formatPercent(sumLabs, countLabs),
      teachers_staffed: formatPercent(sumTeachers, countTeachers),
      electricity: formatPercent(sumElectricity, countElectricity),
      wash_audited: formatPercent(sumWash, countWash),
      active_blocks: '238',
    };
  }, [districts]);

  const metricsList = useMemo(() => [
    { key: 'total_schools' as MetricType,    label: 'Total Schools',    value: computedMetrics.total_schools, color: 'blue',   icon: <School size={15} strokeWidth={2.5} /> },
    { key: 'attendance' as MetricType,       label: 'Attendance Rate',  value: computedMetrics.attendance, color: 'emerald', icon: <UserCheck size={15} strokeWidth={2.5} /> },
    { key: 'coaching_schools' as MetricType, label: 'NEET/JEE Coaching Schools', value: computedMetrics.coaching_schools, color: 'purple', icon: <School size={15} strokeWidth={2.5} /> },
    { key: 'neet_coaching_enrolment_est' as MetricType, label: 'NEET Coaching Enrolment (est.)', value: computedMetrics.neet_coaching_enrolment_est, color: 'indigo', icon: <GraduationCap size={15} strokeWidth={2.5} /> },
    { key: 'jee_coaching_enrolment_est' as MetricType, label: 'JEE Coaching Enrolment (est.)', value: computedMetrics.jee_coaching_enrolment_est, color: 'rose', icon: <GraduationCap size={15} strokeWidth={2.5} /> },
    { key: 'total_coaching_enrolment_est' as MetricType, label: 'Total Coaching Enrolment (est.)', value: computedMetrics.total_coaching_enrolment_est, color: 'teal', icon: <GraduationCap size={15} strokeWidth={2.5} /> },
    { key: 'hi_tech_labs' as MetricType,     label: 'Active Labs',      value: computedMetrics.hi_tech_labs, color: 'rose',    icon: <FlaskConical size={15} strokeWidth={2.5} /> },
    { key: 'teachers_staffed' as MetricType, label: 'Teachers Staffed', value: computedMetrics.teachers_staffed, color: 'teal',    icon: <Users size={15} strokeWidth={2.5} /> },
    { key: 'electricity' as MetricType,      label: 'Grid Connect',     value: computedMetrics.electricity, color: 'yellow',  icon: <Zap size={15} strokeWidth={2.5} /> },
    { key: 'wash_audited' as MetricType,     label: 'Sanitation',       value: computedMetrics.wash_audited, color: 'indigo',  icon: <Droplet size={15} strokeWidth={2.5} /> },
    { key: 'active_blocks' as MetricType,    label: 'Blocks with Coaching Schools', value: computedMetrics.active_blocks, color: 'amber',   icon: <MapIcon size={15} strokeWidth={2.5} /> },
  ], [computedMetrics]);

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      <aside
        className={`flex flex-col h-full flex-shrink-0 overflow-y-auto custom-scrollbar transition-transform lg:transition-none duration-300 
          fixed lg:relative top-0 left-0 z-50 lg:z-10 w-[320px] sm:w-[350px] max-w-[85vw] lg:w-[350px]
          ${isOpen ? 'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ 
          background: theme === 'dark' ? '#0f172a' : '#ffffff',
          borderRight: theme === 'dark' ? '1px solid #1e293b' : '1px solid #e2e8f0',
        }}
      >
        <div className="p-4">
          
          {/* ── Brand Logo Header ── */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <TrendingUp size={18} strokeWidth={2.5} className="text-white" />
              </div>
              <div>
                <h2 className={`text-[13px] font-black uppercase tracking-widest leading-tight transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>TN Education</h2>
                <p className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>Dashboard Prototype</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className={`lg:hidden p-1.5 rounded-lg transition-all ${
                  theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                }`}
                aria-label="Close menu"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* ── Instructions Banner ── */}
          <div className={`mb-5 rounded-lg p-3 text-[11px] border flex items-center gap-2.5 shadow-inner transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-[#1e293b] text-slate-300 border-slate-700/50' 
              : 'bg-slate-50 text-slate-650 border-slate-200'
          }`}>
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
                  onClick={() => {
                    setMetric(m.key);
                    if (onClose) onClose();
                  }}
                  className={`
                    relative flex flex-col justify-between rounded-xl p-3 text-left transition-all duration-300 overflow-hidden group border
                    ${isActive 
                      ? 'transform -translate-y-1 bg-[#1e293b] border-transparent' 
                      : theme === 'dark'
                        ? 'bg-[#1e293b]/70 border-slate-700/50 hover:bg-[#1e293b] hover:border-slate-500 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-50/80 border-slate-200 hover:border-indigo-300 hover:bg-white hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                    }
                  `}
                  style={{
                    boxShadow: isActive ? `0 8px 24px -4px ${accent}50, 0 0 0 2px ${accent}` : undefined,
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
                        {m.icon}
                      </div>
                      <span className={`text-[18px] font-black tracking-tight leading-none transition-colors duration-300 ${
                        isActive 
                          ? 'text-white' 
                          : theme === 'dark'
                            ? 'text-slate-200'
                            : 'text-slate-900'
                      }`}>
                        {m.value}
                      </span>
                    </div>
                    
                    <span className={`text-[9px] font-black uppercase tracking-[0.15em] mt-1 line-clamp-2 transition-colors duration-300 ${
                      isActive 
                        ? 'text-slate-200' 
                        : theme === 'dark'
                          ? 'text-slate-400'
                          : 'text-slate-600'
                    }`}>
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
          .custom-scrollbar::-webkit-scrollbar-thumb { background: ${theme === 'dark' ? '#334155' : '#cbd5e1'}; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${theme === 'dark' ? '#475569' : '#94a3b8'}; }
        `}} />
      </aside>
    </>
  );
}