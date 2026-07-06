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

      {/* Modern Premium Search Bar */}
      {onSearchChange && (
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div
            className={`relative flex items-center transition-all duration-300 rounded-full group ${
              focused 
                ? 'bg-white ring-2 ring-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)] border-transparent' 
                : 'bg-slate-100/80 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <div className={`absolute left-4 flex items-center pointer-events-none transition-colors duration-300 ${focused ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`}>
              <Search size={16} strokeWidth={2.5} />
            </div>

            <input
              type="text"
              placeholder="Search districts..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400 font-semibold transition-all"
              style={{
                padding: '10px 80px 10px 42px',
                fontSize: '13px',
              }}
            />

            {!searchQuery ? (
              <div className="absolute right-3 flex items-center gap-1 pointer-events-none">
                <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded shadow-sm">
                  ⌘K
                </kbd>
              </div>
            ) : (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 flex items-center justify-center transition-all hover:bg-slate-200 hover:text-slate-700 rounded-full text-slate-400"
                style={{ width: 24, height: 24 }}
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Right Status */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {loading && (
          <div className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-full bg-slate-800 text-blue-300 border border-slate-700 shadow-sm">
            <Activity size={14} className="animate-spin" />
            Syncing...
          </div>
        )}
        <div className="flex items-center gap-2.5 text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-full bg-slate-900 text-white shadow-md border border-slate-800 hover:bg-slate-800 transition-colors cursor-default">
          <div className="relative flex items-center justify-center w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]" />
          </div>
          System Live
        </div>
      </div>
    </header>
  );
}