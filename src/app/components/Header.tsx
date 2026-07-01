'use client';

interface HeaderProps {
  loading: boolean;
}

export default function Header({ loading }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 glass-panel border-b border-slate-200/50 shadow-sm relative z-50">
      {/* Brand */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Emblem */}
        <div
          className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-md relative overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #2563EB 0%, #0891B2 100%)',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
          }}
        >
          VS
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-black text-slate-900 tracking-wider leading-none uppercase">
            VEDA-SAKTHI
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            {"Minister's Command View \u00A0·\u00A0 Tamil Nadu Education Analytics"}
          </p>
        </div>
      </div>

      {/* Right panel indicators */}
      <div className="flex items-center gap-3">
        {/* LIVE indicator */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-xl text-xs font-bold tracking-wider shadow-sm">
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-500"
            style={{ animation: 'dotPulse 1.8s infinite' }}
          />
          LIVE
        </div>
      </div>
    </header>
  );
}