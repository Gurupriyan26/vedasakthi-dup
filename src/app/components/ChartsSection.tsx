'use client';

import { useMemo } from 'react';
import { District, DistrictMetrics } from '@/types';
import { useDashboardStore, MetricType } from '@/store/useDashboardStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface ChartsSectionProps {
  districts: District[];
}

const PALETTE = {
  good:      '#10B981',
  average:   '#F59E0B',
  attention: '#EF4444',
  nodata:    '#e2e8f0',
};

const METRIC_LABELS: Record<MetricType, string> = {
  general: 'General',
  infra_status: 'Infrastructure Status',
  total_schools: 'Total Schools',
  attendance: 'Attendance',
  neet_qualified: 'NEET Qualified',
  coaching_schools: 'NEET/JEE Coaching Schools',
  neet_coaching_enrolment_est: 'NEET Coaching Enrolment (est.)',
  jee_coaching_enrolment_est: 'JEE Coaching Enrolment (est.)',
  total_coaching_enrolment_est: 'Total Coaching Enrolment (est.)',
  hi_tech_labs: 'Active Labs',
  teachers_staffed: 'Teachers Staffed',
  electricity: 'Grid Connect',
  wash_audited: 'Sanitation',
  active_blocks: 'Blocks with Coaching Schools',
};

function getMetricColor(metric: MetricType, value?: number): string {
  if (value == null) return PALETTE.nodata;

  switch (metric) {
    case 'attendance':       return value >= 85 ? PALETTE.good : value >= 70 ? PALETTE.average : PALETTE.attention;
    case 'electricity':      return value >= 95 ? PALETTE.good : value >= 85 ? PALETTE.average : PALETTE.attention;
    case 'hi_tech_labs':
    case 'teachers_staffed':
    case 'wash_audited':     return value >= 85 ? PALETTE.good : value >= 70 ? PALETTE.average : PALETTE.attention;
    case 'total_schools':    return value >= 800 ? PALETTE.good : value >= 400 ? PALETTE.average : PALETTE.attention;
    case 'neet_qualified':   return value >= 800 ? PALETTE.good : value >= 400 ? PALETTE.average : PALETTE.attention;
    case 'coaching_schools': return value >= 12 ? PALETTE.good : value >= 6 ? PALETTE.average : PALETTE.attention;
    case 'neet_coaching_enrolment_est': return value >= 960 ? PALETTE.good : value >= 480 ? PALETTE.average : PALETTE.attention;
    case 'jee_coaching_enrolment_est': return value >= 960 ? PALETTE.good : value >= 480 ? PALETTE.average : PALETTE.attention;
    case 'total_coaching_enrolment_est': return value >= 1920 ? PALETTE.good : value >= 960 ? PALETTE.average : PALETTE.attention;
    case 'active_blocks':    return value >= 10 ? PALETTE.good : value >= 5 ? PALETTE.average : PALETTE.attention;
    default: return PALETTE.nodata;
  }
}

const PERCENT_METRICS = new Set(['attendance', 'hi_tech_labs', 'teachers_staffed', 'electricity', 'wash_audited']);

export default function ChartsSection({ districts }: ChartsSectionProps) {
  const { selectedMetric, theme } = useDashboardStore();

  const chartData = useMemo(() => {
    return districts
      .filter(d => d.metrics != null)
      .map(d => ({
        name: d.district_name.replace('Tiruchirappalli', 'Trichy').replace('Ramanathapuram', 'Ramanathapuram').replace('Kanniyakumari', 'Kanyakumari'),
        fullName: d.district_name,
        value: Number(d.metrics![selectedMetric as keyof DistrictMetrics]) || 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [districts, selectedMetric]);

  const averageValue = useMemo(() => {
    if (chartData.length === 0) return 0;
    const sum = chartData.reduce((acc, curr) => acc + curr.value, 0);
    return sum / chartData.length;
  }, [chartData]);

  if (selectedMetric === 'general' || chartData.length === 0) return null;

  const label = METRIC_LABELS[selectedMetric] || selectedMetric.replace(/_/g, ' ');
  const isPercent = PERCENT_METRICS.has(selectedMetric);
  const fmt = (v: number) => isPercent ? `${v}%` : new Intl.NumberFormat('en-IN').format(v);

  return (
    <div className="flex flex-col p-1.5 sm:p-2 bg-transparent">
      {/* ── Bar Chart ── */}
      <div className={`rounded-xl p-2 sm:p-3 min-h-[90px] relative overflow-hidden backdrop-blur-md transition-all duration-300`}>
        <div className={`text-[9px] font-black uppercase tracking-widest mb-1.5 pr-8 relative z-10 transition-colors duration-300 ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Distribution Overview — {label}
        </div>
        <div className="relative z-10 w-full h-[90px] sm:h-[105px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 15, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'} />
              <XAxis
                dataKey="name"
                axisLine={{ stroke: theme === 'dark' ? '#1e293b' : '#cbd5e1' }}
                tickLine={false}
                tick={false}
                height={5}
              />
              <ReferenceLine 
                y={averageValue} 
                stroke={theme === 'dark' ? '#818cf8' : '#6366f1'} 
                strokeDasharray="4 4" 
                strokeWidth={1.5}
                label={{ 
                  position: 'top', 
                  value: `STATE AVG: ${fmt(Math.round(averageValue))}`, 
                  fill: theme === 'dark' ? '#818cf8' : '#6366f1', 
                  fontSize: 9, 
                  fontWeight: 900,
                  fontFamily: "'Noto Sans', 'Noto Sans Tamil', sans-serif"
                }} 
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontFamily: "'Noto Sans', 'Noto Sans Tamil', sans-serif", fontWeight: 600 }}
              />
              <Tooltip
                cursor={{ fill: theme === 'dark' ? 'rgba(30, 41, 59, 0.4)' : '#f8fafc' }}
                contentStyle={{
                  background: theme === 'dark' ? '#0f172a' : '#ffffff',
                  borderRadius: '12px',
                  border: theme === 'dark' ? '1px solid #1e293b' : '1px solid #e2e8f0',
                  fontFamily: "'Noto Sans', 'Noto Sans Tamil', sans-serif",
                  fontSize: '11px',
                  color: theme === 'dark' ? '#ffffff' : '#1e293b',
                  padding: '10px 12px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
                itemStyle={{ color: theme === 'dark' ? '#ffffff' : '#1e293b', fontWeight: 900 }}
                labelStyle={{ color: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', fontWeight: 800 }}
                formatter={(v) => [fmt(Number(v ?? 0)), label] as [string, string]}
              />
              <Bar dataKey="value" radius={[12, 12, 12, 12]} maxBarSize={18}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={getMetricColor(selectedMetric, entry.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
