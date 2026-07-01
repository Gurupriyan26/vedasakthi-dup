'use client';

import { Search } from 'lucide-react';

interface HeaderProps {
  loading: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function Header({ loading, searchQuery = '', onSearchChange }: HeaderProps) {
  return (
    <header className="vs-header flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-black flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #0891B2 100%)' }}
        >
          VS
        </div>
        <div>
          <h1 className="text-[15px] font-black tracking-wider uppercase" style={{ color: '#2c3e50' }}>
            VEDA-SAKTHI
          </h1>
          <p className="text-[11px] font-medium" style={{ color: '#7f8c8d' }}>
            {"Minister's Command View · Tamil Nadu Education Analytics"}
          </p>
        </div>
      </div>

      {/* Center Search */}
      {onSearchChange && (
        <div className="flex-1 max-w-sm mx-10 relative hidden md:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none" style={{ color: '#7f8c8d' }}>
            <Search size={14} />
          </div>
          <input
            type="text"
            placeholder="Search districts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full text-sm rounded-lg pl-9 pr-4 py-2 outline-none transition-all"
            style={{
              background: '#f4f7f6',
              border: '1px solid #e0e6ed',
              color: '#2c3e50',
              fontSize: '13px',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3498db';
              e.target.style.background = '#fff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0e6ed';
              e.target.style.background = '#f4f7f6';
            }}
          />
        </div>
      )}

      {/* Right — Status */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider"
          style={{ background: '#e9faf2', color: '#27ae60', border: '1px solid #b8f0d4' }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: '#2ecc71', animation: 'dotPulse 1.8s infinite' }}
          />
          LIVE
        </div>
        {loading && (
          <div className="text-xs font-semibold" style={{ color: '#7f8c8d' }}>
            Syncing...
          </div>
        )}
      </div>
    </header>
  );
}