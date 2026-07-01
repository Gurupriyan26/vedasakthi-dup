'use client';

import { District } from '@/types';
import { FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaIdBadge } from 'react-icons/fa';

interface RightPanelProps {
  selectedDistrict: District | null;
  onClearDistrict: () => void;
}

export default function RightPanel({
  selectedDistrict,
  onClearDistrict,
}: RightPanelProps) {
  return (
    <aside
      className="flex flex-col gap-4 h-full overflow-y-auto glass-panel border border-slate-200/50 shadow-lg relative z-40"
      style={{
        width: '310px',
        minWidth: '310px',
        borderRadius: '24px',
        padding: '24px 16px',
        background: 'rgba(255, 255, 255, 0.85)',
      }}
    >
      {selectedDistrict ? (
        // ── VIEW: District Details Profile ───────────────────────────────────
        <div className="flex flex-col gap-4 h-full">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-blue-600">
                <FaMapMarkerAlt size={12} />
                <span className="text-[10px] font-extrabold uppercase tracking-widest">
                  DISTRICT PROFILE
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-800 mt-1 leading-tight">
                {selectedDistrict.district_name}
              </h2>
              <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
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

          {/* Details list */}
          <div className="flex-1 flex flex-col gap-4 pr-1 mt-2">
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-slate-100 bg-white/40 shadow-sm flex items-start gap-3">
                <FaIdBadge className="text-blue-500 mt-0.5" size={16} />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Source Identifier
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-700 break-all select-all">
                    {selectedDistrict.source_id}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 bg-white/40 shadow-sm flex items-start gap-3">
                <FaCalendarAlt className="text-blue-500 mt-0.5" size={16} />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Created At
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {new Date(selectedDistrict.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
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
          <h3 className="text-sm font-black text-slate-750 uppercase tracking-wider">
            Explore Districts
          </h3>
          <p className="text-xs text-slate-450 mt-2 leading-relaxed max-w-[200px]">
            Hover over a district to view basic stats, or click to lock its profile view here.
          </p>
        </div>
      )}
    </aside>
  );
}
