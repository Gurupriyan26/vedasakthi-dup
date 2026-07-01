'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface HeaderProps {
  loading: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function Header({ loading, searchQuery = '', onSearchChange }: HeaderProps) {
  const [focused, setFocused] = useState(false);

  return (
    <header className="vs-header flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div
          className="flex-shrink-0 flex items-center justify-center text-white text-[13px] font-black"
          style={{
            width: 36, height: 36,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
            letterSpacing: '0.04em',
          }}
        >
          VS
        </div>
        <div>
          <h1 className="text-[15px] font-black uppercase tracking-widest leading-none text-slate-100">
            VEDA-SAKTHI
          </h1>
          <p className="text-[11px] font-semibold mt-0.5 text-slate-500">
            Command View · TN Analytics
          </p>
        </div>
      </div>

      {/* ── Sleek Dark Search Bar ── */}
      {onSearchChange && (
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div
            className="relative flex items-center transition-all duration-300"
            style={{
              background: focused ? '#1e293b' : '#0f172a',
              border: focused ? '1px solid #3b82f6' : '1px solid #1e293b',
              borderRadius: '8px',
              boxShadow: focused ? '0 0 0 2px rgba(59,130,246,0.2)' : 'none',
            }}
          >
            <div className="absolute left-3 flex items-center pointer-events-none" style={{ color: focused ? '#3b82f6' : '#64748b' }}>
              <Search size={14} strokeWidth={2.5} />
            </div>

            <input
              type="text"
              placeholder="Search districts..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full bg-transparent outline-none text-slate-200 placeholder-slate-500"
              style={{
                padding: '8px 32px 8px 36px',
                fontSize: '13px',
                fontWeight: 600,
              }}
            />

            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 flex items-center justify-center transition-all hover:bg-slate-700"
                style={{
                  width: 20, height: 20, borderRadius: '4px',
                  color: '#94a3b8', cursor: 'pointer', border: 'none', background: 'transparent'
                }}
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Right Status */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {loading && (
          <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-400">
            <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #334155', borderTopColor: '#3b82f6', animation: 'spin 0.8s linear infinite' }} />
            Syncing...
          </div>
        )}
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ animation: 'dotPulse 2s infinite' }} />
          LIVE
        </div>
      </div>
    </header>
  );
}