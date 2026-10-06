import React from 'react';

export default function ChuyenDeLoading() {
  return (
    <main className="flex-1 flex flex-col px-4 sm:px-5 pt-3 pb-28 gap-4 animate-pulse max-w-4xl mx-auto w-full">
      {/* Header bar skeleton */}
      <div className="flex items-center justify-between h-14 w-full">
        <div className="flex flex-col gap-1.5">
          <div className="w-36 h-7 rounded-lg bg-slate-200 dark:bg-purple-900/40" />
          <div className="w-56 h-4 rounded-md bg-slate-200 dark:bg-purple-900/30" />
        </div>
        <div className="w-24 h-9 rounded-full bg-slate-200 dark:bg-purple-900/40" />
      </div>

      {/* Search input skeleton */}
      <div className="w-full h-11 rounded-2xl bg-slate-200/80 dark:bg-purple-900/30 mt-1" />

      {/* Featured topics carousel skeleton */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="w-40 h-5 rounded bg-slate-200 dark:bg-purple-900/40" />
        <div className="grid grid-cols-2 gap-2.5">
          <div className="h-20 rounded-2xl bg-slate-100 dark:bg-purple-900/30 border border-slate-200/60 dark:border-purple-800/30" />
          <div className="h-20 rounded-2xl bg-slate-100 dark:bg-purple-900/30 border border-slate-200/60 dark:border-purple-800/30" />
        </div>
      </div>

      {/* Catalog 3-columns grid skeleton */}
      <div className="flex flex-col gap-2 mt-3">
        <div className="w-36 h-5 rounded bg-slate-200 dark:bg-purple-900/40" />
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-2 rounded-2xl bg-slate-100 dark:bg-[#160D30] border border-slate-200/60 dark:border-purple-800/30">
              <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-purple-900/40" />
              <div className="w-16 h-3 rounded bg-slate-200 dark:bg-purple-900/40" />
              <div className="w-10 h-2.5 rounded bg-slate-200 dark:bg-purple-900/30" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
