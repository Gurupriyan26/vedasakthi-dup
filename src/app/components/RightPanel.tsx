'use client';

import { District } from '@/types';
import { FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import { useDashboardStore } from '@/store/useDashboardStore';
import { 
  School, 
  UserCheck, 
  GraduationCap, 
  FlaskConical, 
  Users, 
  Zap, 
  Droplet, 
  Map as MapIcon
} from 'lucide-react';

interface RightPanelProps {
  selectedDistrict: District | null;
  onClearDistrict: () => void;
}

export default function RightPanel({
  selectedDistrict,
  onClearDistrict,
}: RightPanelProps) {
  const { selectedMetric } = useDashboardStore();

  const metrics = selectedDistrict?.metrics;

  const formatNumber = (num: number | undefined) => num ? new Intl.NumberFormat('en-IN').format(num) : 'N/A';
  const formatPercentage = (num: number | undefined) => num !== undefined ? num + '%' : 'N/A';

  return (
    <aside
      className="flex flex-col gap-4 h-full overflow-y-auto glass-panel border border-slate-200/50 shadow-lg relative z-40 custom-scrollbar"
      style={{
        width: '320px',
        minWidth: '320px',
        borderRadius: '24px',
        padding: '24px 16px',
        background: 'rgba(255, 255, 255, 0.85)',
      }}
    >
      {selectedDistrict ? (
        // ── VIEW: District Details Profile ───────────────────────────────────
        <div className="flex flex-col gap-4 h-full">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-blue-600">
                <FaMapMarkerAlt size={12} />
                <span className="text-[10px] font-extrabold uppercase tracking-widest">
                  DISTRICT PROFILE
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1 leading-tight">
                {selectedDistrict.district_name}
              </h2>
              <span className="text-[10px] text-slate-500 font-bold block mt-0.5">
                LGD CODE: {selectedDistrict.lgd_code}
              </span>
            </div>
            <button
              onClick={onClearDistrict}
              className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 p-1.5 rounded-lg border border-slate-200/50 bg-white/50"
              aria-label="Clear selected district"
            >
              <FaTimes size={11} />
            </button>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg text-xs border border-slate-200 text-slate-700 font-medium leading-relaxed">
            <strong>Active Metric:</strong> You are currently viewing the map based on <strong className="text-blue-600">{selectedMetric.replace('_', ' ').toUpperCase()}</strong>.
            <br/><br/>
            Block-level data drill-down is coming soon.
          </div>

          {/* Details list */}
          <div className="flex-1 flex flex-col gap-3 mt-2">
            <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
              Performance Metrics
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-blue-500">
                  <School size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Total Schools</span>
                </div>
                <span className="text-lg font-black text-slate-800">{formatNumber(metrics?.total_schools)}</span>
              </div>
              
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-emerald-500">
                  <UserCheck size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Attendance</span>
                </div>
                <span className="text-lg font-black text-slate-800">{formatPercentage(metrics?.attendance)}</span>
              </div>
              
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-purple-500">
                  <GraduationCap size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">NEET Qualified</span>
                </div>
                <span className="text-lg font-black text-slate-800">{formatNumber(metrics?.neet_qualified)}</span>
              </div>
              
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-red-500">
                  <FlaskConical size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Hi-Tech Labs</span>
                </div>
                <span className="text-lg font-black text-slate-800">{formatPercentage(metrics?.hi_tech_labs)}</span>
              </div>
              
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-teal-500">
                  <Users size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Teachers</span>
                </div>
                <span className="text-lg font-black text-slate-800">{formatPercentage(metrics?.teachers_staffed)}</span>
              </div>
              
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-yellow-500">
                  <Zap size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Electricity</span>
                </div>
                <span className="text-lg font-black text-slate-800">{formatPercentage(metrics?.electricity)}</span>
              </div>
              
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Droplet size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">WASH</span>
                </div>
                <span className="text-lg font-black text-slate-800">{formatPercentage(metrics?.wash_audited)}</span>
              </div>
              
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-orange-500">
                  <MapIcon size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Active Blocks</span>
                </div>
                <span className="text-lg font-black text-slate-800">{formatNumber(metrics?.active_blocks)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ── VIEW: Info Placeholder (No district selected) ────────────────────
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-4 border border-blue-100 shadow-sm">
            <FaMapMarkerAlt size={24} className="animate-bounce" style={{ animationDuration: '2.5s' }} />
          </div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
            Explore Districts
          </h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-[200px]">
            Hover over a district to view basic stats, or click to lock its profile view here.
          </p>
        </div>
      )}
    </aside>
  );
}
