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
      <div className="flex items-center gap-3.5">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg border border-slate-700 overflow-hidden group hover:scale-105 transition-transform duration-300">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-50" />
          <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-purple-300 font-black text-[17px] tracking-tighter">
            VS
          </span>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="m-0 text-[19px] font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
            Vedasakthi
            <span className="bg-slate-100 text-slate-500 border border-slate-200/80 px-1.5 py-0.5 rounded-[4px] text-[8px] uppercase tracking-widest font-bold shadow-sm">
              PREVIEW
            </span>
          </h1>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mt-1.5">
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
        <div className="flex items-center gap-2.5 text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200/60 transition-colors cursor-default shadow-sm">
          <div className="relative flex items-center justify-center w-2 h-2">
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
          </div>
          Preview Mode
        </div>
      </div>
    </header>
  );
}