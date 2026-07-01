'use client';

export function MapSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#090D16] rounded-2xl border border-white/5 shadow-2xl">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full skeleton mx-auto" />
        <div className="space-y-2">
          <div className="w-36 h-3 rounded skeleton mx-auto" />
          <div className="w-24 h-2.5 rounded skeleton mx-auto" />
        </div>
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div
      className="flex flex-col gap-4 h-full"
      style={{
        width: '290px',
        minWidth: '290px',
        background: 'rgba(10, 15, 30, 0.8)',
        borderRadius: '24px',
        padding: '24px 16px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="h-28 rounded-2xl skeleton-dark" />
      <div className="space-y-2 mt-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-12 rounded-xl skeleton-dark" />
        ))}
      </div>
    </div>
  );
}

export function RightPanelSkeleton() {
  return (
    <div
      className="flex flex-col gap-4 h-full"
      style={{
        width: '310px',
        minWidth: '310px',
        background: 'rgba(10, 15, 30, 0.8)',
        borderRadius: '24px',
        padding: '24px 16px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="h-12 rounded-xl skeleton-dark" />
      <div className="space-y-3 mt-4 flex-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 rounded-xl skeleton-dark" />
        ))}
      </div>
    </div>
  );
}
