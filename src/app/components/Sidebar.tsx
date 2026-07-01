'use client';

import { District } from '@/types';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface SidebarProps {
  districts: District[];
  loading: boolean;
}

export default function Sidebar({
  districts,
  loading,
}: SidebarProps) {
  return (
    <aside
      className="flex flex-col gap-4 h-full overflow-y-auto glass-panel border border-slate-200/50 shadow-lg relative z-40"
      style={{
        width: '290px',
        minWidth: '290px',
        borderRadius: '24px',
        padding: '24px 16px',
        background: 'rgba(255, 255, 255, 0.85)',
      }}
    >
      {/* State Summary Card */}
      <div
        className="rounded-2xl p-4 mb-1 relative overflow-hidden border border-blue-100"
        style={{
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
          boxShadow: '0 2px 10px rgba(37, 99, 235, 0.04)'
        }}
      >
        <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest block mb-1">
          STATE VIEW
        </span>
        <h2 className="text-xl font-black text-blue-900 leading-tight">
          Tamil Nadu
        </h2>
        <p className="text-xs text-blue-700/70 mt-0.5 font-semibold flex items-center gap-1">
          <FaMapMarkerAlt size={10} /> 38 Districts Monitored
        </p>
      </div>

      {/* Section Label */}
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 block mb-0.5">
        MONITORED DISTRICTS
      </span>

      {/* Districts List */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400 font-medium">
            Loading districts...
          </div>
        ) : (
          districts.map((d) => (
            <div
              key={d.id}
              className="p-3 rounded-xl border border-slate-100 bg-white/40 shadow-sm flex items-center justify-between"
            >
              <span className="text-xs font-bold text-slate-700">
                {d.district_name}
              </span>
              <span className="text-[9px] font-extrabold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md uppercase">
                LGD {d.lgd_code}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Districts count footer */}
      <div className="pt-4 border-t border-slate-100 mt-auto">
        <p className="text-[10px] text-slate-500 text-center font-bold">
          {loading ? 'LOADING DISTRICTS...' : `${districts.length} DISTRICTS SYNC'D`}
        </p>
        <p className="text-[9px] text-slate-400 text-center mt-1 font-semibold tracking-wide">
          {"Source: Supabase · VEDA-SAKTHI v1.0"}
        </p>
      </div>
    </aside>
  );
}