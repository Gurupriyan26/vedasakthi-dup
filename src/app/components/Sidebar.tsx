'use client';

import { useDashboardStore, MetricType } from '@/store/useDashboardStore';
import { District } from '@/types';

const metricsList = [
  { key: 'total_schools' as MetricType,    label: 'Total Schools',    value: '40,000+', color: 'blue' },
  { key: 'attendance' as MetricType,       label: 'Attendance',       value: '88.5%',   color: 'emerald' },
  { key: 'neet_qualified' as MetricType,   label: 'NEET Qualified',   value: '14,205',  color: 'purple' },
  { key: 'hi_tech_labs' as MetricType,     label: 'Active Labs',      value: '6,022',   color: 'rose' },
  { key: 'teachers_staffed' as MetricType, label: 'Teachers Staffed', value: '3.1L',    color: 'teal' },
  { key: 'electricity' as MetricType,      label: 'Grid Connect',     value: '99.1%',   color: 'yellow' },
  { key: 'wash_audited' as MetricType,     label: 'WASH Audited',     value: '92%',     color: 'indigo' },
  { key: 'active_blocks' as MetricType,    label: 'Active Blocks',    value: '412',     color: 'amber' },
];

const getMetricColor = (color: string) => {
  switch(color) {
    case 'blue': return '#3498db';
    case 'emerald': return '#2ecc71';
    case 'purple': return '#9b59b6';
    case 'amber': return '#e67e22';
    case 'teal': return '#1abc9c';
    case 'rose': return '#e74c3c';
    case 'indigo': return '#34495e';
    default: return '#f1c40f'; // yellow for electricity
  }
}

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
        width: '350px', 
        zIndex: 10, 
        background: '#f4f7f6',
        borderRight: '1px solid #e0e6ed',
      }}
    >
      <div className="p-5">
        
        {/* ── Instructions Banner ── */}
        <div 
          className="mb-5 rounded-[4px] p-2.5 text-[13px]"
          style={{
            background: '#fff3cd',
            color: '#856404',
            border: '1px solid #ffeeba'
          }}
        >
          <strong>Data Mode:</strong> Select a metric to render the district heatmap.
        </div>

        {/* ── Grid Layout from Reference ── */}
        <div className="grid grid-cols-2 gap-[15px]">
          {metricsList.map((m) => {
            const isActive = selectedMetric === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setMetric(m.key)}
                className={`
                  relative bg-white rounded-lg p-[15px] text-left transition-all duration-200 overflow-hidden
                  ${isActive 
                    ? 'border-[#333] shadow-[0_0_0_2px_rgba(0,0,0,0.1)]' 
                    : 'border-[#e0e6ed] border hover:-translate-y-[2px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)]'
                  }
                `}
                style={{
                  border: isActive ? '1px solid #333' : '1px solid #e0e6ed',
                }}
              >
                {/* Left Color Bar */}
                <div 
                  className="absolute top-0 left-0 w-1 h-full"
                  style={{ backgroundColor: getMetricColor(m.color) }}
                />
                
                <div className="text-[11px] uppercase text-[#7f8c8d] font-semibold mb-1 pl-1">
                  {m.label}
                </div>
                
                <div className="text-[22px] font-bold text-[#2c3e50] pl-1">
                  {m.value}
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
      `}} />
    </aside>
  );
}