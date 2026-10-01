import React from 'react';

export default function LopHocLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2 bg-slate-900 min-h-screen">
      {children}
    </div>
  );
}
