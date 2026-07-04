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
        background: '#020617', // slate-950
        borderRight: '1px solid #1e293b',
      }}
    >
      <div className="p-4">
        {/* Stunning Dark Mode Hero Banner */}
        <div 
          className="relative rounded-2xl overflow-hidden p-6 mb-6 group shadow-2xl border border-white/5"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
          }}
        >
          {/* Glassmorphism overlays */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-blue-500/0 via-blue-400/50 to-blue-500/0" />
          
          <div className="relative z-10">
            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-2 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              State Overview
            </div>
            <div className="text-[30px] font-black leading-none text-white tracking-tight drop-shadow-md mb-2">
              Tamil Nadu
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/50 border border-indigo-500/30 backdrop-blur-md mt-1">
              <Activity size={12} className="text-indigo-400" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-200">Live Analytics</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">
            Command Metrics
          </div>
          <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">State Avg</div>
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
                  background: isActive ? '#0f172a' : '#0a0f1c',
                  border: `1px solid ${isActive ? m.accent : '#1e293b'}`,
                  boxShadow: isActive ? `0 8px 25px ${m.accent}20` : '0 2px 4px rgba(0,0,0,0.1)',
                  transform: isActive ? 'scale(1.02) translateY(-2px)' : 'scale(1) translateY(0)',
                  animation: `slideFadeIn 0.3s ease-out forwards ${i * 0.04}s`,
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.3)';
                    e.currentTarget.style.borderColor = '#334155';
                    e.currentTarget.style.background = '#0f172a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#1e293b';
                    e.currentTarget.style.background = '#0a0f1c';
                  }
                }}
              >
                {/* Subtle active background glow tint */}
                {isActive && (
                  <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ background: m.accent }} />
                )}
                
                <div className="flex items-center gap-3.5 relative z-10">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-inner"
                    style={{ 
                      background: isActive ? `${m.accent}20` : '#1e293b', 
                      color: isActive ? m.accent : '#94a3b8',
                      border: `1px solid ${isActive ? m.accent+'40' : '#334155'}`
                    }}
                  >
                    {m.icon}
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="text-[11px] font-black uppercase tracking-wider mb-0.5 transition-colors" style={{ color: isActive ? '#f8fafc' : '#94a3b8' }}>
                      {m.label}
                    </div>
                    {/* Trend indicator for a very "live data" feel */}
                    <div className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: `${m.accent}15`, color: m.accent }}>
                      <TrendingUp size={10} strokeWidth={3} />
                      {m.trend}
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 text-[18px] font-black transition-colors text-right" style={{ color: isActive ? m.accent : '#f8fafc' }}>
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
        @keyframes slideFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </aside>
  );
}