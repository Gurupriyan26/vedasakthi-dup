'use client';

import { useState, useEffect, useMemo } from 'react';
import { District } from '@/types';
import { useDashboardStore } from '@/store/useDashboardStore';
import { fetchVetriSchools, VetriSchool } from '@/lib/api';
import { getTntetDataForDistrict } from '@/lib/tntetData';
import {
  School, UserCheck, GraduationCap, FlaskConical, Users, Zap,
  Droplet, Layers, Activity, X, MapPin, TrendingUp, BookOpen,
  ChevronRight, Building2, ChevronDown, BookMarked, ToggleLeft
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

// ── Block accordion row ───────────────────────────────────────────────────────
function BlockRow({
  blockName,
  schools,
  idx,
  dk,
}: {
  blockName: string;
  schools: VetriSchool[];
  idx: number;
  dk: boolean;
}) {
  const [open, setOpen] = useState(false);
  const hues = ['#6366f1', '#a855f7', '#ec4899', '#14b8a6', '#3b82f6', '#f59e0b'];
  const glow = hues[idx % hues.length];

  return (
    <div className="flex flex-col">
      {/* Block header — clickable */}
      <button
        id={`block-row-${blockName.replace(/\s+/g, '-').toLowerCase()}`}
        onClick={() => setOpen(p => !p)}
        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer border group ${
          open
            ? dk ? 'border-slate-700 bg-[#1e293b]' : 'border-slate-300 bg-slate-50'
            : dk ? 'border-transparent hover:border-slate-700/60 hover:bg-[#1e293b]/60' : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 bg-[#f8fafc]'
        }`}
        style={open ? { borderColor: `${glow}50`, background: `${glow}10` } : undefined}
        aria-expanded={open}
      >
        {/* Left accent bar */}
        <div
          className="w-1 h-8 rounded-full flex-shrink-0 transition-all duration-300"
          style={{ background: open ? glow : `${glow}40` }}
        />

        {/* Block name + school count */}
        <div className="flex-1 min-w-0">
          <p className={`text-[13px] font-extrabold leading-tight truncate transition-colors ${
            open ? '' : (dk ? 'text-slate-300' : 'text-slate-700')
          }`} style={open ? { color: glow } : undefined}>
            {blockName}
          </p>
          <p className={`text-[10px] font-semibold uppercase tracking-widest mt-0.5 ${dk ? 'text-slate-500' : 'text-slate-400'}`}>
            {schools.length} {schools.length === 1 ? 'School' : 'Schools'}
          </p>
        </div>

        {/* School count badge */}
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black transition-all duration-200"
          style={{ background: `${glow}25`, color: glow, border: `1px solid ${glow}40` }}
        >
          {schools.length}
        </div>

        {/* Chevron */}
        <ChevronDown
          size={14}
          className={`flex-shrink-0 transition-transform duration-300 ml-1 ${open ? 'rotate-180' : ''} ${dk ? 'text-slate-500' : 'text-slate-400'}`}
          style={open ? { color: glow } : undefined}
        />
      </button>

      {/* School list — expands under block */}
      {open && (
        <div className="ml-5 mt-1.5 mb-2.5 flex flex-col gap-1.5" style={{ borderLeft: `2px solid ${glow}40`, paddingLeft: '12px' }}>
          {schools.map((school, si) => (
            <div
              key={school.id}
              id={`school-item-${school.id}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                dk
                  ? 'bg-[#1e293b]/60 hover:bg-[#1e293b] border border-slate-800/60 hover:border-slate-700'
                  : 'bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black flex-shrink-0"
                style={{ background: `${glow}20`, color: glow }}
              >
                {si + 1}
              </span>
              <p className={`text-[12px] font-bold leading-snug flex-1 min-w-0 ${dk ? 'text-slate-200' : 'text-slate-800'}`}>
                {school.school_name}
              </p>
              <School size={12} className="flex-shrink-0 opacity-30" style={{ color: glow }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RightPanel({ selectedDistrict, onClearDistrict }: RightPanelProps) {
  const { setMetric, selectedMetric, theme } = useDashboardStore();
  const [schools, setSchools] = useState<VetriSchool[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  // 'schools' | 'tntet'
  const [activeTab, setActiveTab] = useState<'schools' | 'tntet'>('schools');

  const dk = theme === 'dark';

  useEffect(() => {
    if (!selectedDistrict) { setSchools([]); return; }
    let alive = true;
    setSchoolsLoading(true);
    setActiveTab('schools'); // reset tab on district change
    fetchVetriSchools(selectedDistrict.id)
      .then(d => { if (alive) { setSchools(d); setSchoolsLoading(false); } })
      .catch(() => { if (alive) { setSchools([]); setSchoolsLoading(false); } });
    return () => { alive = false; };
  }, [selectedDistrict]);

  // Group schools by block_name
  const blockGroups = useMemo(() => {
    const map = new Map<string, VetriSchool[]>();
    for (const s of schools) {
      const list = map.get(s.block_name) ?? [];
      list.push(s);
      map.set(s.block_name, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [schools]);

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
        { key: 'total_schools', label: 'Total Schools', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.total_schools) || 0), icon: <School size={14} strokeWidth={2.5} />, color: 'blue', isPercent: false, isUnverified: true },
        { key: 'active_blocks', label: 'Blocks with Coaching Schools', value: String(metrics?.active_blocks || 0), icon: <Layers size={14} strokeWidth={2.5} />, color: 'amber', isPercent: false },
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
        { key: 'attendance', label: 'Attendance Rate', value: 'N/A', icon: <UserCheck size={14} strokeWidth={2.5} />, color: 'emerald', isPercent: false },
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
    <>
      {/* Mobile Backdrop overlay for bottom sheet */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 xl:hidden transition-opacity duration-300"
        onClick={onClearDistrict}
      />
      <aside
        className={`flex flex-col z-50 xl:z-20 overflow-y-auto transition-all duration-300
          fixed bottom-0 left-0 right-0 w-full h-[78vh] max-h-[85vh] rounded-t-[28px] border-t border-x-0 shadow-[0_-12px_40px_rgba(0,0,0,0.15)]
          xl:relative xl:bottom-auto xl:left-auto xl:right-auto xl:w-[360px] xl:h-full xl:rounded-none xl:border-l xl:border-t-0 xl:shadow-none
          ${dk ? 'bg-[#0a0f1e] border-[#1e293b]' : 'bg-[#ffffff] border-[#e2e8f0]'}
        `}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: dk ? '#334155 transparent' : '#cbd5e1 transparent',
          background: dk ? '#0a0f1e' : '#ffffff',
        }}
      >
        {/* Drag handle for mobile bottom sheet */}
        <div className="xl:hidden w-12 h-1 bg-slate-350 dark:bg-slate-750 rounded-full mx-auto mt-3.5 mb-1.5 flex-shrink-0" />

      {/* ══════════════════════════════════════════
          HERO HEADER — Premium District Banner
      ══════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden flex-shrink-0 px-5 pt-5 pb-6 border-b"
        style={{
          borderColor: dk ? '#1e293b' : 'rgba(99,102,241,0.15)',
          background: dk
            ? 'linear-gradient(135deg, #0f172a 0%, #1a0f2e 50%, #0f172a 100%)'
            : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 40%, #7c3aed 100%)',
        }}
      >
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />

        {/* Top row: label + close */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.9)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" style={{ boxShadow: '0 0 6px rgba(255,255,255,0.8)' }} />
            District Profile
          </div>
          <button onClick={onClearDistrict}
            className="p-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:rotate-90 hover:bg-white/20"
            style={{ color: 'rgba(255,255,255,0.7)' }}
            aria-label="Clear selection">
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* District name + score ring */}
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Tamil Nadu</p>
            <h2 className="text-[24px] font-black tracking-tight leading-tight text-white drop-shadow-sm">
              {districtName}
            </h2>
            <div className="flex items-center gap-2 mt-3">
              <div className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"
                style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
                {scoreLabel}
              </div>
              <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {metrics?.active_blocks || 0} blocks
              </span>
            </div>
          </div>

          {/* Score ring */}
          <div className="relative flex-shrink-0 flex flex-col items-center">
            <div className="relative w-16 h-16 flex items-center justify-center rounded-full"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <RadialGauge value={avgScore} color="#ffffff" size={56} />
              <span className="absolute text-[13px] font-black text-white">{avgScore}%</span>
            </div>
            <span className="text-[8px] font-bold uppercase tracking-widest mt-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Score</span>
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
            <div key={section.title} className={`border-b transition-all duration-300 ${dk ? 'border-[#1e293b]' : 'border-indigo-100/60'}`}>
              {/* Section header */}
              <div className="px-5 pt-5 pb-2 flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${sectionAccent.hex}18`, color: sectionAccent.hex }}>
                  {section.icon}
                </div>
                <span className={`text-[10px] font-extrabold uppercase tracking-widest ${dk ? 'text-slate-400' : 'text-slate-500'}`}>
                  {section.title}
                </span>
                <div className="flex-1 h-px" style={{ background: dk ? 'rgba(255,255,255,0.04)' : `${sectionAccent.hex}20` }} />
              </div>

              {/* Metrics in this section */}
              <div className="px-4 pb-4 flex flex-col gap-2">
                {section.metrics.map((m) => {
                  const isActive = selectedMetric === m.key;
                  const ac = ACCENT_COLORS[m.color] || ACCENT_COLORS.blue;
                  const numVal = typeof m.value === 'number' ? m.value : null;

                  return (
                    <button
                      key={m.key}
                      id={`metric-btn-${m.key}`}
                      onClick={() => setMetric(m.key as any)}
                      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left transition-all duration-300 cursor-pointer group hover:-translate-y-0.5 relative overflow-hidden"
                      style={isActive ? {
                        background: dk
                          ? `linear-gradient(135deg, ${ac.hex}25, ${ac.hex}12)`
                          : `linear-gradient(135deg, ${ac.hex}15, ${ac.hex}08)`,
                        border: `1.5px solid ${ac.hex}`,
                        boxShadow: `0 4px 24px ${ac.hex}35, 0 0 15px ${ac.hex}25`,
                      } : {
                        background: dk ? 'rgba(30,41,59,0.5)' : '#f8fafc',
                        border: dk ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0',
                        boxShadow: dk ? 'none' : '0 1px 3px rgba(0,0,0,0.02)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          if (dk) {
                            e.currentTarget.style.boxShadow = `0 8px 25px -4px ${ac.hex}35, 0 0 12px ${ac.hex}25`;
                            e.currentTarget.style.borderColor = `${ac.hex}70`;
                          } else {
                            e.currentTarget.style.boxShadow = `0 8px 25px -4px ${ac.hex}20, 0 4px 12px ${ac.hex}10`;
                            e.currentTarget.style.borderColor = ac.hex;
                          }
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.boxShadow = dk ? 'none' : '0 1px 3px rgba(0,0,0,0.02)';
                          e.currentTarget.style.borderColor = dk ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
                        }
                      }}
                    >
                      {/* Subtle hover gradient flare */}
                      <div 
                        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ 
                          background: dk
                            ? `radial-gradient(circle at right, ${ac.hex}20, transparent 70%)`
                            : `radial-gradient(circle at right, ${ac.hex}08, transparent 70%)`
                        }}
                      />
                      {/* Icon */}
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                        style={{
                          background: isActive ? ac.hex : (dk ? 'rgba(255,255,255,0.06)' : ac.light),
                          color: isActive ? '#fff' : ac.hex,
                          boxShadow: isActive ? `0 4px 14px ${ac.hex}50` : 'none',
                        }}
                      >
                        {m.icon}
                      </div>

                      {/* Label + value */}
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 flex-wrap"
                          style={{ color: isActive ? ac.hex : (dk ? 'rgba(148,163,184,0.8)' : 'rgba(100,116,139,0.9)') }}
                        >
                          {m.label}
                          {(m as any).isUnverified && (
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                              dk
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-amber-100 text-amber-800 border border-amber-250 shadow-sm'
                            }`}>
                              Unverified
                            </span>
                          )}
                        </div>
                        <div
                          className="text-[18px] font-black tracking-tight leading-tight mt-0.5"
                          style={{ color: isActive ? (dk ? '#fff' : ac.hex) : (dk ? '#f1f5f9' : '#0f172a') }}
                        >
                          {numVal !== null ? `${numVal}%` : m.value}
                        </div>
                      </div>

                      {/* Gauge or chevron */}
                      <div className="flex-shrink-0">
                        {numVal !== null ? (
                          <RadialGauge value={numVal} color={isActive ? (dk ? '#fff' : ac.hex) : ac.hex} size={34} />
                        ) : (
                          <ChevronRight
                            size={14}
                            className="transition-transform duration-200 group-hover:translate-x-0.5"
                            style={{ color: isActive ? (dk ? '#fff' : ac.hex) : (dk ? 'rgba(100,116,139,0.6)' : 'rgba(148,163,184,0.8)') }}
                          />
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
            VETRI PALLIGAL — BLOCK DRILL-DOWN
        ══════════════════════════════════════════ */}
        <div className="flex flex-col pb-6">

          {/* ── Section Banner ── */}
          <div className={`relative overflow-hidden mx-4 mt-4 mb-3 rounded-2xl p-4 border ${
            dk ? 'border-purple-500/20 bg-gradient-to-br from-purple-900/30 via-[#1a0f2e]/60 to-indigo-900/20'
               : 'border-purple-200/60 bg-gradient-to-br from-purple-50 via-white to-indigo-50'
          }`}>
            {/* Decorative blurred orb */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-30 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />

            <div className="relative z-10">
              {/* Title row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <GraduationCap size={13} className="text-purple-400" />
                  </div>
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest ${dk ? 'text-purple-300' : 'text-purple-600'}`}>
                    Vetri Palligal
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <div className={`text-[18px] font-black leading-none ${dk ? 'text-white' : 'text-slate-900'}`}>
                    {schoolsLoading ? '…' : schools.length}
                  </div>
                  <div className={`text-[9px] font-semibold ${dk ? 'text-purple-300/70' : 'text-purple-500'}`}>
                    Coaching Centres
                  </div>
                </div>
              </div>

              {/* ── Schools / TNTET Toggle ── */}
              <div
                id="vetri-tab-toggle"
                className={`flex rounded-xl p-0.5 gap-0.5 ${dk ? 'bg-[#0f172a]/60' : 'bg-slate-100'}`}
              >
                <button
                  id="tab-schools"
                  onClick={() => setActiveTab('schools')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    activeTab === 'schools'
                      ? dk ? 'bg-purple-600 text-white shadow-sm' : 'bg-white text-purple-700 shadow-sm border border-purple-200'
                      : dk ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <School size={10} />
                  Schools
                </button>
                <button
                  id="tab-tntet"
                  onClick={() => setActiveTab('tntet')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    activeTab === 'tntet'
                      ? dk ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-indigo-700 shadow-sm border border-indigo-200'
                      : dk ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <BookMarked size={10} />
                  TNTET (Sample)
                </button>
              </div>
            </div>
          </div>

          {/* ── TAB: Schools (Block → School drill-down) ── */}
          {activeTab === 'schools' && (
            <div className="px-4">
              {schoolsLoading ? (
                <div className="flex flex-col gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-14 rounded-xl animate-pulse ${dk ? 'bg-[#1e293b]/60' : 'bg-slate-100'}`} />
                  ))}
                </div>
              ) : blockGroups.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {blockGroups.map(([blockName, blockSchools], idx) => (
                    <BlockRow
                      key={blockName}
                      blockName={blockName}
                      schools={blockSchools}
                      idx={idx}
                      dk={dk}
                    />
                  ))}

                  {/* Summary pill */}
                  <div className={`mt-1 flex items-center justify-center gap-3 py-3 rounded-2xl border border-dashed ${
                    dk ? 'border-slate-800/60' : 'border-slate-200'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <Layers size={11} className={dk ? 'text-amber-400/60' : 'text-amber-500/60'} />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${dk ? 'text-slate-500' : 'text-slate-400'}`}>{blockGroups.length} Blocks</span>
                    </div>
                    <div className={`w-px h-3 ${dk ? 'bg-slate-700' : 'bg-slate-200'}`} />
                    <div className="flex items-center gap-1.5">
                      <GraduationCap size={11} className="text-purple-400/60" />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${dk ? 'text-slate-500' : 'text-slate-400'}`}>{schools.length} Centres</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`relative overflow-hidden flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed text-center ${
                  dk ? 'bg-[#1e293b]/20 border-slate-800/50' : 'bg-white border-slate-200'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none rounded-2xl" />
                  <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                    dk ? 'bg-[#1e293b] border border-slate-800' : 'bg-purple-50 border border-purple-100'
                  }`}>
                    <GraduationCap size={24} strokeWidth={1.5} className={dk ? 'text-slate-600' : 'text-purple-300'} />
                  </div>
                  <p className={`text-[11px] font-black uppercase tracking-widest mb-1.5 ${dk ? 'text-slate-500' : 'text-slate-400'}`}>
                    No Centres Listed
                  </p>
                  <p className={`text-[10px] leading-relaxed max-w-[180px] ${dk ? 'text-slate-600' : 'text-slate-400'}`}>
                    No Vetri Palligal coaching centres have been registered for this district yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── TAB: TNTET Candidates (SAMPLE DATA) ── */}
          {activeTab === 'tntet' && (() => {
            const tntetInfo = getTntetDataForDistrict(selectedDistrict.district_name);
            const fmt = (n: number) => new Intl.NumberFormat('en-IN').format(n);
            return (
              <div className="px-4 pb-6 flex flex-col gap-3">
                {/* Clear Sample Data Banner */}
                <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                  dk ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <div className={`p-1.5 rounded-xl flex-shrink-0 ${dk ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                    <BookMarked size={16} />
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/20 border border-amber-500/30 text-amber-400 mb-1">
                      Sample Data — Demonstration Only
                    </span>
                    <p className="text-[11px] leading-relaxed opacity-90 font-medium">
                      Official district-level TNTET figures are pending release. The numbers below are illustrative sample data to demonstrate the view.
                    </p>
                  </div>
                </div>

                {/* Candidate Stats Cards with (Sample) tags */}
                <div className="grid grid-cols-1 gap-2.5 mt-1">
                  {/* Registered Candidates Card */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    dk ? 'bg-[#1e293b]/60 border-slate-700/50' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider ${dk ? 'text-indigo-400' : 'text-indigo-600'}`}>
                          Registered Candidates
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${dk ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}>
                          (Sample)
                        </span>
                      </div>
                      <div className={`text-[22px] font-black tracking-tight ${dk ? 'text-white' : 'text-slate-900'}`}>
                        {fmt(tntetInfo.registered)}
                      </div>
                      <p className={`text-[10px] mt-0.5 ${dk ? 'text-slate-400' : 'text-slate-500'}`}>
                        Illustrative district registration estimate
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dk ? 'bg-indigo-900/40 text-indigo-400 border border-indigo-800/50' : 'bg-indigo-100 text-indigo-600'}`}>
                      <Users size={18} />
                    </div>
                  </div>

                  {/* TNTET Qualified Card */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    dk ? 'bg-[#1e293b]/60 border-slate-700/50' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider ${dk ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          TNTET Qualified
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${dk ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}>
                          (Sample)
                        </span>
                      </div>
                      <div className={`text-[22px] font-black tracking-tight ${dk ? 'text-white' : 'text-slate-900'}`}>
                        {fmt(tntetInfo.qualified)}
                      </div>
                      <p className={`text-[10px] mt-0.5 ${dk ? 'text-slate-400' : 'text-slate-500'}`}>
                        Qualified candidate count (sample)
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dk ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/50' : 'bg-emerald-100 text-emerald-600'}`}>
                      <GraduationCap size={18} />
                    </div>
                  </div>

                  {/* Sample Pass Percentage Badge */}
                  <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    dk ? 'bg-indigo-950/30 border-indigo-800/30' : 'bg-indigo-50/50 border-indigo-100'
                  }`}>
                    <span className={`text-[11px] font-bold ${dk ? 'text-indigo-300' : 'text-indigo-900'}`}>
                      Sample Qualification Ratio
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[12px] font-black bg-indigo-500 text-white">
                      {tntetInfo.passPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </aside>
  </>
  );
}
