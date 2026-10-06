import React from 'react';

export default function LessonLoading() {
  return (
    <main className="flex-1 flex flex-col px-4 sm:px-5 pt-3 pb-24 gap-4 animate-pulse">
      {/* Header bar skeleton */}
      <div className="flex items-center justify-between h-12 w-full">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-purple-900/40" />
          <div className="w-32 h-5 rounded-md bg-slate-200 dark:bg-purple-900/40" />
        </div>
        <div className="w-16 h-8 rounded-full bg-slate-200 dark:bg-purple-900/40" />
      </div>

      {/* Video / Content skeleton */}
      <div className="w-full aspect-video rounded-[18px] bg-slate-200/80 dark:bg-purple-900/30" />

      {/* Title & metadata */}
      <div className="flex flex-col gap-2 mt-1">
        <div className="w-4/5 h-6 rounded bg-slate-200 dark:bg-purple-900/40" />
        <div className="w-1/3 h-4 rounded bg-slate-200 dark:bg-purple-900/40" />
      </div>

      {/* Paragraphs */}
      <div className="flex flex-col gap-2 mt-3">
        <div className="w-full h-4 rounded bg-slate-200/60 dark:bg-purple-900/20" />
        <div className="w-full h-4 rounded bg-slate-200/60 dark:bg-purple-900/20" />
        <div className="w-3/4 h-4 rounded bg-slate-200/60 dark:bg-purple-900/20" />
      </div>
    </main>
  );
}
