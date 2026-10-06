import React from 'react';

export default function TopicLoading() {
  return (
    <main className="flex-1 flex flex-col px-4 sm:px-5 pt-3 pb-28 gap-4 animate-pulse">
      {/* Header bar skeleton */}
      <div className="flex items-center justify-between h-12 w-full">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-purple-900/40" />
          <div className="w-24 h-5 rounded-md bg-slate-200 dark:bg-purple-900/40" />
        </div>
        <div className="w-20 h-8 rounded-full bg-slate-200 dark:bg-purple-900/40" />
      </div>

      {/* Hero card skeleton */}
      <div className="w-full h-32 rounded-[20px] bg-slate-200/80 dark:bg-purple-900/30" />

      {/* Lesson cards skeleton */}
      <div className="flex flex-col gap-2.5 mt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-[14px] bg-slate-100 dark:bg-[#160D30] border border-slate-200/60 dark:border-purple-800/30">
            <div className="w-14 h-14 rounded-[10px] bg-slate-200 dark:bg-purple-900/40 shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="w-3/4 h-4 rounded bg-slate-200 dark:bg-purple-900/40" />
              <div className="w-1/2 h-3 rounded bg-slate-200 dark:bg-purple-900/40" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
