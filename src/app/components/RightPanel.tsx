'use client';

import { District } from '@/types';
import { useDashboardStore } from '@/store/useDashboardStore';
import { Activity, X } from 'lucide-react';

interface RightPanelProps {
  selectedDistrict: District | null;
  onClearDistrict: () => void;
}

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

export default function RightPanel({ selectedDistrict, onClearDistrict }: RightPanelProps) {
  const { setMetric, selectedMetric } = useDashboardStore();

  if (!selectedDistrict) {
    return (
      <aside className="hidden xl:flex flex-col w-[350px] flex-shrink-0 bg-[#f4f7f6] border-l border-[#e0e6ed] p-6 items-center justify-center z-20">
        <div className="w-16 h-16 rounded-full border border-[#e0e6ed] flex items-center justify-center mb-4 bg-white text-[#7f8c8d] shadow-sm">
          <Activity size={24} />
        </div>
        <h3 className="text-[#2c3e50] font-bold text-lg mb-2">No District Selected</h3>
        <p className="text-[#7f8c8d] text-[13px] text-center leading-relaxed max-w-[250px]">
          Click on any district boundary on the map to unlock its detailed administrative metrics.
        </p>
      </aside>
    );
  }

  const { metrics } = selectedDistrict;

  const kpiCards = [
    { key: 'total_schools', label: 'Total Schools', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.total_schools) || 0), color: 'blue' },
    { key: 'attendance', label: 'Attendance', value: `${Number(metrics?.attendance) || 0}%`, color: 'emerald' },
    { key: 'neet_qualified', label: 'NEET Qualified', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.neet_qualified) || 0), color: 'purple' },
    { key: 'hi_tech_labs', label: 'Active Labs', value: `${Number(metrics?.hi_tech_labs) || 0}%`, color: 'rose' },
    { key: 'teachers_staffed', label: 'Teachers Staffed', value: new Intl.NumberFormat('en-IN').format(Number(metrics?.teachers_staffed) || 0), color: 'teal' },
    { key: 'electricity', label: 'Grid Connect', value: `${Number(metrics?.electricity) || 0}%`, color: 'yellow' },
    { key: 'wash_audited', label: 'WASH Audited', value: `${Number(metrics?.wash_audited) || 0}%`, color: 'indigo' },
    { key: 'active_blocks', label: 'Active Blocks', value: metrics?.active_blocks || 0, color: 'amber' },
  ];

  return (
    <aside className="hidden xl:flex flex-col w-[350px] flex-shrink-0 bg-[#f4f7f6] border-l border-[#e0e6ed] h-full overflow-y-auto z-20">
      
      {/* ── Header ── */}
      <div className="sticky top-0 z-10 pt-5 px-5 pb-4 bg-[#f4f7f6]/95 backdrop-blur-md flex flex-col gap-1 border-b border-[#e0e6ed]">
        <div className="flex items-center justify-between w-full">
          <span className="text-[12px] font-semibold text-[#7f8c8d] uppercase tracking-wider">
            District Drill-down
          </span>
          <button 
            onClick={onClearDistrict}
            className="p-1 rounded-md text-[#7f8c8d] hover:text-[#2c3e50] hover:bg-white transition-colors"
            aria-label="Clear selection"
          >
            <X size={16} />
          </button>
        </div>
        <h2 className="text-xl font-bold text-[#2c3e50] tracking-tight truncate mt-1">
          {selectedDistrict.district_name.replace('Tiruchirappalli', 'Trichy').replace('Ramanathapuram', 'Ramanathapuram')}
        </h2>
      </div>

      {/* ── Grid Layout from Reference ── */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-[15px]">
          {kpiCards.map(card => {
            const isActive = selectedMetric === card.key;
            return (
              <button
                key={card.key}
                onClick={() => setMetric(card.key as any)}
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
                  style={{ backgroundColor: getMetricColor(card.color) }}
                />
                
                <div className="text-[11px] uppercase text-[#7f8c8d] font-semibold mb-1 pl-1">
                  {card.label}
                </div>
                
                <div className="text-[22px] font-bold text-[#2c3e50] pl-1">
                  {card.value}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
