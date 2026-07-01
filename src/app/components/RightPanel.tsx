'use client';

import { District } from '@/types';
import { useDashboardStore } from '@/store/useDashboardStore';
import { School, GraduationCap, Map as MapIcon, X, Activity, UserCheck, FlaskConical, Users, Zap, Droplet } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';

interface RightPanelProps {
  selectedDistrict: District | null;
  onClearDistrict: () => void;
}

const PALETTE = {
  good:      '#10B981', // Emerald
  average:   '#F59E0B', // Amber
  attention: '#EF4444', // Red
};

function getColor(val: number) {
  if (val >= 85) return PALETTE.good;
  if (val >= 70) return PALETTE.average;
  return PALETTE.attention;
}

// Ultra-premium gauge component
function MetricGauge({ label, value, icon, onClick }: { label: string, value: number, icon: React.ReactNode, onClick: () => void }) {
  const color = getColor(value);
  const data = [
    { name: 'Value', value: value },
    { name: 'Remainder', value: 100 - value }
  ];

  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-[#0a0f1c] rounded-2xl border border-[#1e293b] hover:border-slate-600 transition-all group shadow-sm hover:shadow-lg relative overflow-hidden"
    >
      <div className="absolute top-3 left-3 text-slate-500 group-hover:text-slate-300 transition-colors">
        {icon}
      </div>
      
      <div className="relative w-20 h-20 mt-2">
        <PieChart width={80} height={80}>
          <Pie
            data={data}
            cx={36}
            cy={36}
            innerRadius={28}
            outerRadius={36}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
            cornerRadius={4}
          >
            <Cell fill={color} style={{ filter: `drop-shadow(0px 0px 4px ${color}80)` }} />
            <Cell fill="#1e293b" />
          </Pie>
        </PieChart>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-[-4px] ml-[-4px]">
          <span className="text-[13px] font-black text-white">{value.toFixed(0)}%</span>
        </div>
      </div>
      
      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-2 group-hover:text-white transition-colors">{label}</span>
    </button>
  );
}

export default function RightPanel({ selectedDistrict, onClearDistrict }: RightPanelProps) {
  const { setMetric } = useDashboardStore();

  if (!selectedDistrict) {
    return (
      <aside className="hidden xl:flex flex-col w-[380px] flex-shrink-0 bg-[#020617] border-l border-[#1e293b] p-6 items-center justify-center">
        <div className="w-24 h-24 rounded-full border border-slate-800 flex items-center justify-center mb-6 shadow-inner bg-[#0a0f1c]">
          <Activity size={32} className="text-slate-700" />
        </div>
        <p className="text-slate-500 font-medium tracking-wide text-center text-[13px]">
          Select a district from the map <br/> to analyze performance data.
        </p>
      </aside>
    );
  }

  const { metrics } = selectedDistrict;

  const getNum = (key: keyof NonNullable<typeof metrics>) => Number(metrics?.[key]) || 0;

  const attendance = getNum('attendance');
  const hiTech = getNum('hi_tech_labs');
  const teachers = getNum('teachers_staffed');
  const grid = getNum('electricity');
  const wash = getNum('wash_audited');

  const absoluteMetrics = [
    { key: 'total_schools', label: 'Total Schools', value: metrics?.total_schools, icon: <School size={16} /> },
    { key: 'neet_qualified', label: 'NEET Qual.', value: metrics?.neet_qualified, icon: <GraduationCap size={16} /> },
    { key: 'active_blocks', label: 'Active Blocks', value: metrics?.active_blocks, icon: <MapIcon size={16} /> },
  ];

  return (
    <aside className="hidden xl:flex flex-col w-[380px] flex-shrink-0 bg-[#020617] border-l border-[#1e293b] h-full overflow-y-auto custom-scrollbar shadow-2xl z-20">
      
      {/* ── Ultra Clean Header ── */}
      <div className="relative p-6 border-b border-[#1e293b] bg-[#020617]">
        <button 
          onClick={onClearDistrict}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-[#1e293b] transition"
        >
          <X size={16} />
        </button>

        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          District Profile
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight mb-4">
          {selectedDistrict.district_name.replace('Tiruchirappalli', 'Trichy').replace('Ramanathapuram', 'Ramanathapuram')}
        </h2>
        
        <div className="flex gap-2">
          <div className="px-2.5 py-1 rounded bg-[#0a0f1c] border border-[#1e293b] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            LGD: {selectedDistrict.id}
          </div>
          <div className="px-2.5 py-1 rounded bg-[#0a0f1c] border border-[#1e293b] text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity size={10} className="text-emerald-500" /> Live Data
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-8">
        
        {/* ── Core Infrastructure Stats ── */}
        <div>
          <div className="text-[11px] font-black uppercase tracking-widest text-slate-600 mb-4 px-1">
            Infrastructure Baseline
          </div>
          <div className="grid grid-cols-1 gap-3">
            {absoluteMetrics.map(m => (
              <button
                key={m.key}
                onClick={() => setMetric(m.key as any)}
                className="flex items-center justify-between p-4 bg-[#0a0f1c] rounded-2xl border border-[#1e293b] hover:border-slate-500 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1e293b] flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                    {m.icon}
                  </div>
                  <span className="text-[12px] font-bold text-slate-300 uppercase tracking-wider">{m.label}</span>
                </div>
                <div className="text-[18px] font-black text-white group-hover:text-blue-400 transition-colors">
                  {m.value || 0}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Performance Gauges ── */}
        <div>
          <div className="text-[11px] font-black uppercase tracking-widest text-slate-600 mb-4 px-1 flex items-center gap-2">
            Performance Indexes
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MetricGauge label="Attendance" value={attendance} icon={<UserCheck size={14}/>} onClick={() => setMetric('attendance')} />
            <MetricGauge label="Hi-Tech Labs" value={hiTech} icon={<FlaskConical size={14}/>} onClick={() => setMetric('hi_tech_labs')} />
            <MetricGauge label="Teachers" value={teachers} icon={<Users size={14}/>} onClick={() => setMetric('teachers_staffed')} />
            <MetricGauge label="Grid Connect" value={grid} icon={<Zap size={14}/>} onClick={() => setMetric('electricity')} />
            <MetricGauge label="Wash Audit" value={wash} icon={<Droplet size={14}/>} onClick={() => setMetric('wash_audited')} />
          </div>
        </div>

      </div>
    </aside>
  );
}
