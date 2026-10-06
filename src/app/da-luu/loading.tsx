import React from 'react';

export default function DaLuuLoading() {
  return (
    <main className="flex-1 flex flex-col px-4 sm:px-5 pt-3 pb-28 gap-4 animate-pulse max-w-4xl mx-auto w-full">
      {/* Header bar skeleton */}
      <div className="flex items-center justify-between h-14 w-full">
        <div className="w-24 h-7 rounded-lg bg-slate-200 dark:bg-purple-900/40" />
        <div className="w-28 h-8 rounded-full bg-slate-200 dark:bg-purple-900/40" />
      </div>

      {/* Resume learning card skeleton */}
      <div className="w-full h-36 rounded-2xl bg-slate-100 dark:bg-[#160D30] border border-slate-200/60 dark:border-purple-800/30" />

      {/* Saved list items skeleton */}
      <div className="flex flex-col gap-2.5 mt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-[#160D30] border border-slate-200/60 dark:border-purple-800/30">
            <div className="w-16 h-12 rounded-xl bg-slate-200 dark:bg-purple-900/40 shrink-0" />
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="w-4/5 h-4 rounded bg-slate-200 dark:bg-purple-900/40" />
              <div className="w-1/2 h-3 rounded bg-slate-200 dark:bg-purple-900/30" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
