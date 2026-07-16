'use client';

import { useState, useEffect } from 'react';
import { District } from '@/types';
import { useDashboardStore } from '@/store/useDashboardStore';
import { fetchVetriSchools, VetriSchool } from '@/lib/api';
import {
  School, UserCheck, GraduationCap, FlaskConical, Users, Zap,
  Droplet, Layers, Activity, X, MapPin, TrendingUp, BookOpen,
  ChevronRight, Building2, Wifi
} from 'lucide-react';

interface RightPanelProps {
  selectedDistrict: District | null;
  onClearDistrict: () => void;
}

const ACCENT_COLORS: Record<string, { hex: string; light: string; ring: string }> = {
  blue:   { hex: '#3b82f6', light: '#eff6ff', ring: 'rgba(59,130,246,0.2)' },
  emerald:{ hex: '#10b981', light: '#ecfdf5', ring: 'rgba(16,185,129,0.2)' },
  purple: { hex: '#a855f7', light: '#faf5ff', ring: 'rgba(168,85,247,0.2)' },
  amber:  { hex: '#f59e0b', light: '#fffbeb', ring: 'rgba(245,158,11,0.2)' },
  teal:   { hex: '#14b8a6', light: '#f0fdfa', ring: 'rgba(20,184,166,0.2)' },
  rose:   { hex: '#f43f5e', light: '#fff1f2', ring: 'rgba(244,63,94,0.2)' },
  indigo: { hex: '#6366f1', light: '#eef2ff', ring: 'rgba(99,102,241,0.2)' },
  yellow: { hex: '#eab308', light: '#fefce8', ring: 'rgba(234,179,8,0.2)' },
};

// Gauge circle for percentage metrics
function RadialGauge({ value, color, size = 48 }: { value: number; color: string; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / 100, 1);
  const offset = circumference - progress * circumference;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth={5} />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  );
}

export default function RightPanel({ selectedDistrict, onClearDistrict }: RightPanelProps) {
  const { setMetric, selectedMetric, theme } = useDashboardStore();
  const [schools, setSchools] = useState<VetriSchool[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [schoolsExpanded, setSchoolsExpanded] = useState(true);

  const dk = theme === 'dark';

  useEffect(() => {
    if (!selectedDistrict) { setSchools([]); return; }
    let alive = true;
    setSchoolsLoading(true);
    fetchVetriSchools(selectedDistrict.id)
      .then(d => { if (alive) { setSchools(d); setSchoolsLoading(false); } })
      .catch(() => { if (alive) { setSchools([]); setSchoolsLoading(false); } });
    return () => { alive = false; };
  }, [selectedDistrict]);

  /* ── Empty State ── */
  if (!selectedDistrict) {
    return (
      <aside className={`hidden xl:flex flex-col w-[360px] flex-shrink-0 border-l items-center justify-center z-20 transition-all duration-300 ${dk ? 'bg-[#0f172a] border-[#1e293b]' : 'bg-white border-[#e2e8f0]'}`}>
        <div className={`relative w-24 h-24 rounded-3xl flex items-center justify-center mb-6 ${dk ? 'bg-[#1e293b]' : 'bg-slate-50 border border-slate-200'}`}>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
          <Activity size={36} strokeWidth={1.3} className={dk ? 'text-slate-500' : 'text-slate-350'} />
        </div>
        <h3 className={`font-black text-[17px] mb-2 ${dk ? 'text-white' : 'text-slate-800'}`}>No District Selected</h3>
        <p className={`text-[12px] text-center leading-relaxed max-w-[200px] ${dk ? 'text-slate-400' : 'text-slate-500'}`}>
          Click on any district on the map to view its performance profile.
        </p>
        <div className={`mt-8 flex flex-col gap-2 w-full px-10`}>
          {['Coaching Schools', 'Attendance', 'Teachers Staffed', 'Lab Facilities'].map(hint => (
            <div key={hint} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-semibold ${dk ? 'bg-[#1e293b] text-slate-400' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${dk ? 'bg-indigo-400/40' : 'bg-indigo-300'}`} />
              {hint}
            </div>
          ))}
        </div>
      </aside>
    );
  }

  const { metrics } = selectedDistrict;
  const districtName = selectedDistrict.district_name.replace('Tiruchirappalli', 'Trichy');

  /* Performance score (quick average of percent metrics) */
  const pcts = [metrics?.attendance, metrics?.hi_tech_labs, metrics?.teachers_staffed, metrics?.electricity, metrics?.wash_audited].map(Number).filter(Boolean);
  const avgScore = pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0;
  const scoreColor = avgScore >= 85 ? '#10b981' : avgScore >= 70 ? '#f59e0b' : '#f43f5e';
  const scoreLabel = avgScore >= 85 ? 'High Performance' : avgScore >= 70 ? 'Average' : 'Needs Attention';

  /* Grouped metric sections */
  const sections = [
    {
      title: 'Schools & Infrastructure',
      icon: <Building2 size={13} />,
      color: 'blue',
      metrics: [
        { key: 'total_schools', label: 'Total Schools', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.total_schools) || 0), icon: <School size={14} strokeWidth={2.5} />, color: 'blue', isPercent: false },
        { key: 'active_blocks', label: 'Active Blocks', value: String(metrics?.active_blocks || 0), icon: <Layers size={14} strokeWidth={2.5} />, color: 'amber', isPercent: false },
        { key: 'electricity', label: 'Grid Connected', value: Number(metrics?.electricity) || 0, icon: <Zap size={14} strokeWidth={2.5} />, color: 'yellow', isPercent: true },
        { key: 'wash_audited', label: 'Sanitation', value: Number(metrics?.wash_audited) || 0, icon: <Droplet size={14} strokeWidth={2.5} />, color: 'teal', isPercent: true },
        { key: 'hi_tech_labs', label: 'Lab Facilities', value: Number(metrics?.hi_tech_labs) || 0, icon: <FlaskConical size={14} strokeWidth={2.5} />, color: 'rose', isPercent: true },
      ],
    },
    {
      title: 'Students & Faculty',
      icon: <Users size={13} />,
      color: 'emerald',
      metrics: [
        { key: 'attendance', label: 'Attendance Rate', value: Number(metrics?.attendance) || 0, icon: <UserCheck size={14} strokeWidth={2.5} />, color: 'emerald', isPercent: true },
        { key: 'teachers_staffed', label: 'Teachers Staffed', value: Number(metrics?.teachers_staffed) || 0, icon: <Users size={14} strokeWidth={2.5} />, color: 'teal', isPercent: true },
      ],
    },
    {
      title: 'NEET / JEE Coaching',
      icon: <GraduationCap size={13} />,
      color: 'purple',
      metrics: [
        { key: 'coaching_schools', label: 'Coaching Centres', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.coaching_schools) || 0), icon: <School size={14} strokeWidth={2.5} />, color: 'purple', isPercent: false },
        { key: 'neet_coaching_enrolment_est', label: 'NEET Enrolment (est.)', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.neet_coaching_enrolment_est) || 0), icon: <BookOpen size={14} strokeWidth={2.5} />, color: 'indigo', isPercent: false },
        { key: 'jee_coaching_enrolment_est', label: 'JEE Enrolment (est.)', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.jee_coaching_enrolment_est) || 0), icon: <BookOpen size={14} strokeWidth={2.5} />, color: 'rose', isPercent: false },
        { key: 'total_coaching_enrolment_est', label: 'Total Coaching (est.)', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.total_coaching_enrolment_est) || 0), icon: <TrendingUp size={14} strokeWidth={2.5} />, color: 'teal', isPercent: false },
      ],
    },
  ];

  return (
    <aside className={`hidden xl:flex flex-col w-[360px] flex-shrink-0 border-l h-full overflow-y-auto z-20 transition-all duration-300 ${dk ? 'bg-[#0f172a] border-[#1e293b]' : 'bg-white border-[#e2e8f0]'}`}
      style={{ scrollbarWidth: 'thin', scrollbarColor: dk ? '#334155 transparent' : '#cbd5e1 transparent' }}>

      {/* ══════════════════════════════════════════
          HERO HEADER — District Banner
      ══════════════════════════════════════════ */}
      <div className={`relative overflow-hidden flex-shrink-0 px-5 pt-5 pb-6 border-b transition-all duration-300 ${dk ? 'border-[#1e293b] bg-gradient-to-br from-[#0f172a] via-[#0f172a] to-[#1a0f2e]' : 'border-[#e2e8f0] bg-gradient-to-br from-white via-white to-indigo-50/60'}`}>
        {/* Decorative blurred orb */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />

        {/* Top row: label + close */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border ${dk ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-600'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" style={{ boxShadow: '0 0 6px rgba(129,140,248,0.8)' }} />
            District Profile
          </div>
          <button onClick={onClearDistrict}
            className={`p-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:rotate-90 ${dk ? 'text-slate-500 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
            aria-label="Clear selection">
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* District name + score ring */}
        <div className="flex items-end justify-between gap-3 relative z-10">
          <div className="flex-1 min-w-0">
            <p className={`text-[9px] font-bold uppercase tracking-widest mb-1.5 ${dk ? 'text-slate-500' : 'text-slate-400'}`}>Tamil Nadu</p>
            <h2 className={`text-[20px] font-black tracking-tight leading-tight ${dk ? 'text-white' : 'text-slate-900'}`}>
              {districtName}
            </h2>
            <div className="flex items-center gap-2 mt-2.5">
              <div className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider" style={{ background: `${scoreColor}20`, color: scoreColor, border: `1px solid ${scoreColor}40` }}>
                {scoreLabel}
              </div>
              <span className={`text-[10px] font-semibold ${dk ? 'text-slate-500' : 'text-slate-400'}`}>
                {metrics?.active_blocks || 0} active blocks
              </span>
            </div>
          </div>

          {/* Radial Gauge */}
          <div className="relative flex-shrink-0 flex flex-col items-center">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <RadialGauge value={avgScore} color={scoreColor} size={56} />
              <span className="absolute text-[12px] font-black" style={{ color: scoreColor }}>{avgScore}%</span>
            </div>
            <span className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${dk ? 'text-slate-500' : 'text-slate-400'}`}>Avg Score</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          METRIC SECTIONS
      ══════════════════════════════════════════ */}
      <div className="flex flex-col gap-0 flex-1">
        {sections.map((section) => {
          const sectionAccent = ACCENT_COLORS[section.color] || ACCENT_COLORS.blue;
          return (
            <div key={section.title} className={`border-b transition-all duration-300 ${dk ? 'border-[#1e293b]' : 'border-[#f1f5f9]'}`}>
              {/* Section header */}
              <div className={`px-5 pt-4 pb-2 flex items-center gap-2`}>
                <div className="p-1 rounded-md" style={{ background: `${sectionAccent.hex}18`, color: sectionAccent.hex }}>
                  {section.icon}
                </div>
                <span className={`text-[10px] font-extrabold uppercase tracking-widest ${dk ? 'text-slate-400' : 'text-slate-500'}`}>
                  {section.title}
                </span>
              </div>

              {/* Metrics in this section */}
              <div className="px-4 pb-4 flex flex-col gap-1.5">
                {section.metrics.map((m) => {
                  const isActive = selectedMetric === m.key;
                  const ac = ACCENT_COLORS[m.color] || ACCENT_COLORS.blue;
                  const numVal = typeof m.value === 'number' ? m.value : null;

                  return (
                    <button
                      key={m.key}
                      onClick={() => setMetric(m.key as any)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer group border ${
                        isActive
                          ? `border-transparent`
                          : dk
                            ? 'border-transparent hover:border-slate-700/60 hover:bg-[#1e293b]/60'
                            : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                      }`}
                      style={isActive ? {
                        background: `linear-gradient(135deg, ${ac.hex}15, ${ac.hex}08)`,
                        border: `1px solid ${ac.hex}35`,
                        boxShadow: `0 2px 12px ${ac.hex}18`,
                      } : undefined}
                    >
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200`}
                        style={{
                          background: isActive ? ac.hex : (dk ? '#1e293b' : ac.light),
                          color: isActive ? '#fff' : ac.hex,
                          boxShadow: isActive ? `0 4px 12px ${ac.hex}40` : 'none',
                        }}>
                        {m.icon}
                      </div>

                      {/* Label + value */}
                      <div className="flex-1 min-w-0">
                        <div className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isActive ? '' : (dk ? 'text-slate-400' : 'text-slate-500')}`}
                          style={isActive ? { color: ac.hex } : {}}>
                          {m.label}
                        </div>
                        <div className={`text-[16px] font-black tracking-tight leading-tight mt-0.5 transition-colors ${isActive ? 'text-white' : (dk ? 'text-slate-100' : 'text-slate-900')}`}>
                          {numVal !== null ? `${numVal}%` : m.value}
                        </div>
                      </div>

                      {/* Gauge or chevron */}
                      <div className="flex-shrink-0 flex items-center justify-center">
                        {numVal !== null ? (
                          <RadialGauge value={numVal} color={isActive ? '#ffffff' : ac.hex} size={32} />
                        ) : (
                          <ChevronRight size={14} className={`transition-all duration-200 ${isActive ? 'text-white' : (dk ? 'text-slate-600' : 'text-slate-300')} group-hover:translate-x-0.5`} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ══════════════════════════════════════════
            VETRI PALLIGAL COACHING CENTRES
        ══════════════════════════════════════════ */}
        <div className={`flex flex-col transition-all duration-300 ${dk ? 'bg-[#080d15]/40' : 'bg-slate-50/70'}`}>
          {/* Collapsible header */}
          <button
            onClick={() => setSchoolsExpanded(p => !p)}
            className={`flex items-center justify-between px-5 py-3.5 w-full cursor-pointer transition-colors ${dk ? 'hover:bg-[#1e293b]/40' : 'hover:bg-slate-100/80'}`}
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-md bg-purple-500/15 text-purple-400">
                <GraduationCap size={13} />
              </div>
              <span className={`text-[10px] font-extrabold uppercase tracking-widest ${dk ? 'text-slate-400' : 'text-slate-500'}`}>
                Coaching Centres
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black"
                style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}>
                {schoolsLoading ? '…' : schools.length}
              </span>
            </div>
            <div className={`p-1 rounded-md transition-all duration-300 ${schoolsExpanded ? 'rotate-90' : ''} ${dk ? 'text-slate-500' : 'text-slate-400'}`}>
              <ChevronRight size={14} />
            </div>
          </button>

          {/* School list */}
          {schoolsExpanded && (
            <div className="px-4 pb-4">
              {schoolsLoading ? (
                <div className="flex flex-col gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`h-12 rounded-xl animate-pulse ${dk ? 'bg-[#1e293b]/50' : 'bg-slate-200/60'}`} />
                  ))}
                </div>
              ) : schools.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  {schools.map((school, idx) => (
                    <div key={school.id}
                      className={`group flex items-start gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 cursor-default ${
                        dk
                          ? 'bg-[#1e293b]/30 border-slate-800/50 hover:bg-[#1e293b]/60 hover:border-slate-700/60'
                          : 'bg-white border-slate-200/70 hover:border-slate-300 hover:shadow-sm'
                      }`}>
                      {/* Index badge */}
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black flex-shrink-0 mt-0.5 ${dk ? 'bg-purple-500/15 text-purple-400' : 'bg-purple-50 text-purple-600 border border-purple-100'}`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[11px] font-semibold leading-tight truncate transition-colors ${dk ? 'text-slate-200 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>
                          {school.school_name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin size={8} className={dk ? 'text-slate-600' : 'text-slate-400'} />
                          <span className={`text-[9px] font-medium uppercase tracking-wide ${dk ? 'text-slate-500' : 'text-slate-400'}`}>
                            {school.block_name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`flex flex-col items-center justify-center py-8 rounded-2xl border border-dashed text-center ${dk ? 'bg-[#1e293b]/20 border-slate-800/50' : 'bg-white border-slate-200'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${dk ? 'bg-slate-800 text-slate-500' : 'bg-slate-50 text-slate-350 border border-slate-200'}`}>
                    <Wifi size={20} strokeWidth={1.5} />
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${dk ? 'text-slate-500' : 'text-slate-400'}`}>No Centres Registered</p>
                  <p className={`text-[10px] leading-relaxed max-w-[170px] ${dk ? 'text-slate-600' : 'text-slate-400'}`}>
                    No Vetri Palligal coaching centres listed for this district.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
