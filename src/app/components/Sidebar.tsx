'use client';

import { School, UserCheck, GraduationCap, FlaskConical, Users, Zap, Droplet, Map as MapIcon, TrendingUp, Activity } from 'lucide-react';
import { useDashboardStore, MetricType } from '@/store/useDashboardStore';
import { District } from '@/types';

const metricsList = [
  { key: 'total_schools' as MetricType,    label: 'Total Schools',    trend: '+124',   accent: '#3b82f6', icon: <School size={16} /> },
  { key: 'attendance' as MetricType,       label: 'Attendance',       trend: '+1.2%',  accent: '#10b981', icon: <UserCheck size={16} /> },
  { key: 'neet_qualified' as MetricType,   label: 'NEET Qualified',   trend: '+14%',   accent: '#8b5cf6', icon: <GraduationCap size={16} /> },
  { key: 'hi_tech_labs' as MetricType,     label: 'Hi-Tech Labs',     trend: '+3.4%',  accent: '#ef4444', icon: <FlaskConical size={16} /> },
  { key: 'teachers_staffed' as MetricType, label: 'Teachers Staffed', trend: '+890',   accent: '#14b8a6', icon: <Users size={16} /> },
  { key: 'electricity' as MetricType,      label: 'Grid Connect',     trend: '+0.5%',  accent: '#f59e0b', icon: <Zap size={16} /> },
  { key: 'wash_audited' as MetricType,     label: 'WASH Audited',     trend: '+2.1%',  accent: '#6366f1', icon: <Droplet size={16} /> },
  { key: 'active_blocks' as MetricType,    label: 'Active Blocks',    trend: 'Live',   accent: '#f97316', icon: <MapIcon size={16} /> },
];

const overallStats: Record<string, string> = {
  total_schools: '40,000+',
  attendance: '88.5%',
  neet_qualified: '14,205',
  hi_tech_labs: '76.9%',
  teachers_staffed: '3.1L',
  electricity: '99.1%',
  wash_audited: '92.0%',
  active_blocks: '412'
};

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
        width: '340px', 
        zIndex: 10, 
        background: '#f4f7f6', // matches light bg
        borderRight: '1px solid #e2e8f0',
      }}
    >
      <div className="p-4">
        {/* Clean Light Mode Hero Banner */}
        <div 
          className="relative rounded-2xl overflow-hidden p-5 mb-6 group shadow-sm border border-slate-200"
          style={{ background: '#ffffff' }}
        >
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-100/50 blur-3xl rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#34d399]" />
              State Overview
            </div>
            <div className="text-[28px] font-black leading-none text-slate-800 tracking-tight mb-2">
              Tamil Nadu
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 mt-1">
              <Activity size={12} className="text-indigo-600" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-700">Live Analytics</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">
            Command Metrics
          </div>
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">State Avg</div>
        </div>

        {/* Highly Attractive Metric Cards Stack */}
        <div className="flex flex-col gap-2.5">
          {metricsList.map((m, i) => {
            const isActive = selectedMetric === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setMetric(m.key)}
                className="group flex items-center justify-between rounded-xl p-3.5 transition-all duration-300 relative overflow-hidden"
                style={{
                  background: '#ffffff',
                  border: `1px solid ${isActive ? m.accent : '#e2e8f0'}`,
                  boxShadow: isActive ? `0 4px 15px ${m.accent}20` : '0 1px 3px rgba(0,0,0,0.05)',
                  transform: isActive ? 'scale(1.02) translateY(-2px)' : 'scale(1) translateY(0)',
                  animation: `slideFadeIn 0.3s ease-out forwards ${i * 0.04}s`,
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.background = '#f8fafc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.background = '#ffffff';
                  }
                }}
              >
                {/* Accent Side Border */}
                <div className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300" style={{ background: isActive ? m.accent : 'transparent' }} />
                
                {isActive && (
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ background: m.accent }} />
                )}
                
                <div className="flex items-center gap-3.5 relative z-10 ml-1">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm"
                    style={{ 
                      background: isActive ? `${m.accent}15` : '#f1f5f9', 
                      color: isActive ? m.accent : '#64748b',
                      border: `1px solid ${isActive ? m.accent+'40' : '#e2e8f0'}`
                    }}
                  >
                    {m.icon}
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="text-[11px] font-black uppercase tracking-wider mb-0.5 transition-colors" style={{ color: isActive ? '#334155' : '#64748b' }}>
                      {m.label}
                    </div>
                    {/* Trend indicator */}
                    <div className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: isActive ? `${m.accent}15` : '#f1f5f9', color: isActive ? m.accent : '#64748b' }}>
                      <TrendingUp size={10} strokeWidth={3} />
                      {m.trend}
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 text-[18px] font-black transition-colors text-right" style={{ color: isActive ? m.accent : '#1e293b' }}>
                  {overallStats[m.key]}
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
        @keyframes slideFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </aside>
  );
}