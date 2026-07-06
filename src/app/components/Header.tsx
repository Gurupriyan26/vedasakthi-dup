'use client';

import { useState } from 'react';
import { Search, X, Activity } from 'lucide-react';

interface HeaderProps {
  loading: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function Header({ loading, searchQuery = '', onSearchChange }: HeaderProps) {
  const [focused, setFocused] = useState(false);

  return (
    <header className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-3 flex justify-between items-center z-50 shadow-sm">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
          VS
        </div>
        <div className="flex flex-col">
          <h1 className="m-0 text-[16px] font-bold text-slate-900 tracking-tight leading-none">
            Vedasakthi
          </h1>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mt-1">
            Hon. Minister's Command View
          </span>
        </div>
      </div>

      {/* Modern Search Bar */}
      {onSearchChange && (
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div
            className="relative flex items-center transition-all duration-300"
            style={{
              background: focused ? '#ffffff' : '#f8fafc',
              border: focused ? '1px solid #3b82f6' : '1px solid #e2e8f0',
              borderRadius: '10px',
              boxShadow: focused ? '0 0 0 4px rgba(59,130,246,0.1)' : 'none',
            }}
          >
            <div className="absolute left-3 flex items-center pointer-events-none transition-colors" style={{ color: focused ? '#3b82f6' : '#94a3b8' }}>
              <Search size={16} strokeWidth={2.5} />
            </div>

            <input
              type="text"
              placeholder="Search districts..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400 font-medium"
              style={{
                padding: '9px 36px 9px 40px',
                fontSize: '13px',
              }}
            />

            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 flex items-center justify-center transition-all hover:bg-slate-200 rounded-md"
                style={{
                  width: 24, height: 24,
                  color: '#64748b', cursor: 'pointer', border: 'none'
                }}
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Right Status */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {loading && (
          <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <Activity size={14} className="animate-pulse text-blue-500" />
            Syncing...
          </div>
        )}
        <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          System Live
        </div>
      </div>
    </header>
  );
}