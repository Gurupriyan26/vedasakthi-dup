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
    <header className="flex-shrink-0 bg-white border-b border-[#e0e6ed] shadow-[0_2px_4px_rgba(0,0,0,0.05)] px-[30px] py-[15px] flex justify-between items-center z-10">
      {/* Brand Title from Reference */}
      <h1 className="m-0 text-[20px] font-semibold text-[#2c3e50]">
        Vedasakthi | Hon. Minister's Command View
      </h1>

      {/* Optional Search Bar - Styled cleanly */}
      {onSearchChange && (
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div
            className="relative flex items-center transition-all duration-300"
            style={{
              background: '#ffffff',
              border: focused ? '1px solid #3498db' : '1px solid #e0e6ed',
              borderRadius: '6px',
              boxShadow: focused ? '0 0 0 2px rgba(52,152,219,0.1)' : 'none',
            }}
          >
            <div className="absolute left-3 flex items-center pointer-events-none" style={{ color: focused ? '#3498db' : '#7f8c8d' }}>
              <Search size={16} strokeWidth={2} />
            </div>

            <input
              type="text"
              placeholder="Search districts..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full bg-transparent outline-none text-[#2c3e50] placeholder-[#7f8c8d]"
              style={{
                padding: '8px 32px 8px 36px',
                fontSize: '14px',
              }}
            />

            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 flex items-center justify-center transition-all hover:bg-[#f4f7f6]"
                style={{
                  width: 24, height: 24, borderRadius: '4px',
                  color: '#7f8c8d', cursor: 'pointer', border: 'none', background: 'transparent'
                }}
              >
                <X size={14} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Right Status */}
      <div className="flex items-center gap-4 flex-shrink-0 text-[14px] font-semibold text-[#2c3e50]">
        {loading && (
          <div className="flex items-center gap-2 text-[#7f8c8d]">
            <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #e0e6ed', borderTopColor: '#3498db', animation: 'spin 0.8s linear infinite' }} />
            Syncing...
          </div>
        )}
        <div>
          System Status: <span style={{ color: '#2ecc71' }}>LIVE</span>
        </div>
      </div>
    </header>
  );
}