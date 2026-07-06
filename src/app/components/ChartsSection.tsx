'use client';

import { useMemo } from 'react';
import { District, DistrictMetrics } from '@/types';
import { useDashboardStore, MetricType } from '@/store/useDashboardStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartsSectionProps {
  districts: District[];
}

const PALETTE = {
  good:      '#10B981',
  average:   '#F59E0B',
  attention: '#EF4444',
  nodata:    '#1e293b',
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
    case 'active_blocks':    return value >= 10 ? PALETTE.good : value >= 5 ? PALETTE.average : PALETTE.attention;
    default: return PALETTE.nodata;
  }
}

const PERCENT_METRICS = new Set(['attendance', 'hi_tech_labs', 'teachers_staffed', 'electricity', 'wash_audited']);

export default function ChartsSection({ districts }: ChartsSectionProps) {
  const { selectedMetric } = useDashboardStore();

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

  if (chartData.length === 0) return null;

  const top5 = chartData.slice(0, 5);
  const bottom5 = [...chartData].reverse().slice(0, 5);
  const label = selectedMetric.replace(/_/g, ' ').toUpperCase();
  const isPercent = PERCENT_METRICS.has(selectedMetric);
  const fmt = (v: number) => isPercent ? `${v}%` : new Intl.NumberFormat('en-IN').format(v);

  // Maximum value for scaling the mini progress bars
  const maxVal = chartData[0]?.value || 1;

  const renderTable = (data: typeof top5, isTop: boolean) => (
    <div className="w-full">
      <div className="w-full text-left">
        {/* Table Header */}
        <div className="flex items-center border-b border-slate-800 pb-2 mb-2">
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 w-12 text-center">Rank</div>
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex-1 ml-2">District Name</div>
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 w-24 text-right pr-2">Metric</div>
        </div>
        
        {/* Table Body */}
        <div className="flex flex-col gap-1.5">
          {data.map((d, i) => {
            const barWidth = Math.max((d.value / maxVal) * 100, 2);
            return (
              <div 
                key={d.name} 
                className="flex items-center p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700/50"
              >
                <div className="w-12 flex justify-center">
                  <div
                    className="flex items-center justify-center text-[10px] font-black rounded-md shadow-sm"
                    style={{ 
                      width: 22, height: 22, 
                      background: isTop ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: isTop ? '#10B981' : '#EF4444',
                      border: `1px solid ${isTop ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                    }}
                  >
                    {isTop ? i + 1 : chartData.length - 4 + i}
                  </div>
                </div>
                
                <div className="flex-1 ml-2">
                  <div className="text-[12px] font-bold text-slate-200">
                    {d.fullName}
                  </div>
                </div>
                
                <div className="w-28 flex items-center justify-end gap-2 pr-1">
                  <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden xl:block">
                    <div 
                      className="h-full rounded-full transition-all duration-700" 
                      style={{ width: `${barWidth}%`, background: isTop ? '#10B981' : '#EF4444' }} 
                    />
                  </div>
                  <div className="text-[13px] font-black min-w-[3rem] text-right" style={{ color: isTop ? '#10B981' : '#EF4444' }}>
                    {fmt(d.value)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col xl:flex-row gap-5 p-5 bg-[#020617]">
      {/* ── Top/Bottom Data Tables ── */}
      <div className="flex flex-col gap-5 xl:w-[380px] flex-shrink-0">
        <div className="rounded-xl p-5 bg-[#0f172a] border border-[#1e293b] shadow-xl relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-emerald-500 relative z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
            Top Performers
          </div>
          <div className="relative z-10">
            {renderTable(top5, true)}
          </div>
        </div>

        <div className="rounded-xl p-5 bg-[#0f172a] border border-[#1e293b] shadow-xl relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-red-500 relative z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#EF4444]" />
            Needs Attention
          </div>
          <div className="relative z-10">
            {renderTable(bottom5, false)}
          </div>
        </div>
      </div>

      {/* ── Bar Chart ── */}
      <div className="flex-1 rounded-xl p-5 min-h-[300px] bg-[#0f172a] border border-[#1e293b] shadow-xl relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
        
        <div className="text-[10px] font-black uppercase tracking-widest mb-5 text-slate-400 relative z-10">
          Distribution Overview — {label}
        </div>
        <div className="relative z-10 w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis
                dataKey="name"
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
                tick={false}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
              />
              <Tooltip
                cursor={{ fill: '#1e293b' }}
                contentStyle={{
                  background: '#020617',
                  borderRadius: '12px',
                  border: '1px solid #1e293b',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: '#f8fafc',
                  padding: '14px',
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)'
                }}
                itemStyle={{ color: '#f8fafc', fontWeight: 900 }}
                labelStyle={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', fontWeight: 800 }}
                formatter={(v) => [fmt(Number(v ?? 0)), label] as [string, string]}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
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
