'use client';

import { useMemo } from 'react';
import { District } from '@/types';
import { useDashboardStore, MetricType } from '@/store/useDashboardStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartsSectionProps {
  districts: District[];
}

const getMetricColor = (metric: MetricType, value: number): string => {
  const g = '#2ecc71', y = '#f1c40f', r = '#e74c3c';
  switch (metric) {
    case 'attendance':       return value >= 90 ? g : value >= 75 ? y : r;
    case 'electricity':      return value >= 98 ? g : value >= 90 ? y : r;
    case 'hi_tech_labs':
    case 'teachers_staffed':
    case 'wash_audited':     return value >= 90 ? g : value >= 80 ? y : r;
    case 'total_schools':    return value >= 1000 ? g : value >= 500 ? y : r;
    case 'neet_qualified':   return value >= 1000 ? g : value >= 500 ? y : r;
    case 'active_blocks':    return value >= 12 ? g : value >= 8 ? y : r;
    default: return '#3b82f6';
  }
};

const isPercent = (m: MetricType) =>
  ['attendance','hi_tech_labs','teachers_staffed','electricity','wash_audited'].includes(m);

export default function ChartsSection({ districts }: ChartsSectionProps) {
  const { selectedMetric } = useDashboardStore();

  const chartData = useMemo(() => {
    return districts
      .filter(d => d.metrics != null)
      .map(d => ({
        name: d.district_name.replace('Tiruchirappalli', 'Trichy').replace('Ramanathapuram', 'Ramanathapuram').replace('Kanniyakumari', 'Kanyakumari'),
        fullName: d.district_name,
        value: Number(d.metrics![selectedMetric]) || 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [districts, selectedMetric]);

  if (chartData.length === 0) return null;

  const top5 = chartData.slice(0, 5);
  const bottom5 = [...chartData].reverse().slice(0, 5);
  const label = selectedMetric.replace(/_/g, ' ').toUpperCase();
  const fmt = (v: number) => isPercent(selectedMetric) ? `${v}` : new Intl.NumberFormat('en-IN').format(v);

  return (
    <div className="flex flex-col gap-3 mt-2 pb-4">
      {/* Top 5 and Bottom 5 — styled like reference HTML panels */}
      <div className="grid grid-cols-2 gap-3">
        {/* Top 5 */}
        <div style={{ background: '#fff', border: '1px solid #e0e6ed', borderRadius: '10px', padding: '16px' }}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#7f8c8d' }}>
            TOP 5 DISTRICTS — {label}
          </div>
          <div className="flex flex-col gap-2">
            {top5.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                    style={{ background: '#3498db', fontSize: '9px' }}
                  >{i + 1}</span>
                  <span className="text-sm font-semibold" style={{ color: '#2c3e50' }}>{d.fullName}</span>
                </div>
                <span className="text-sm font-black" style={{ color: '#2c3e50' }}>{fmt(d.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom 5 */}
        <div style={{ background: '#fff', border: '1px solid #e0e6ed', borderRadius: '10px', padding: '16px' }}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#7f8c8d' }}>
            NEEDS ATTENTION — {label}
          </div>
          <div className="flex flex-col gap-2">
            {bottom5.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                    style={{ background: '#e74c3c', fontSize: '9px' }}
                  >{i + 1}</span>
                  <span className="text-sm font-semibold" style={{ color: '#2c3e50' }}>{d.fullName}</span>
                </div>
                <span className="text-sm font-black" style={{ color: '#2c3e50' }}>{fmt(d.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{ background: '#fff', border: '1px solid #e0e6ed', borderRadius: '10px', padding: '16px', height: 320 }}>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#7f8c8d' }}>
          DISTRICT RANKING DISTRIBUTION — {label}
        </div>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -24, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f7f6" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: '#7f8c8d', fontFamily: 'Inter' }}
              angle={-45}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#7f8c8d', fontFamily: 'Inter' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(244,247,246,0.8)' }}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e0e6ed',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontFamily: 'Inter',
                fontSize: '12px',
                color: '#2c3e50',
              }}
              formatter={(v) => [fmt(Number(v ?? 0)), label] as [string, string]}
            />
            <Bar dataKey="value" radius={[3, 3, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={getMetricColor(selectedMetric, entry.value)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
