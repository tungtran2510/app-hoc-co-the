'use client';

import React from 'react';
import { ArrowUp, ArrowDown, Layers } from 'lucide-react';

interface SectionOrderControlsProps {
  sectionIndex: number;
  totalSections: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onOpenReorderModal: () => void;
  className?: string;
}

export default function SectionOrderControls({
  sectionIndex,
  totalSections,
  onMoveUp,
  onMoveDown,
  onOpenReorderModal,
  className = '',
}: SectionOrderControlsProps) {
  const isFirst = sectionIndex <= 0;
  const isLast = sectionIndex >= totalSections - 1;

  return (
    <div
      className={`inline-flex items-center gap-0.5 bg-surface-2 border border-line rounded-[10px] p-0.5 shadow-2xs shrink-0 ${className}`}
      title="Sắp xếp vị trí khối hiển thị"
    >
      <button
        type="button"
        disabled={isFirst}
        onClick={(e) => {
          e.stopPropagation();
          onMoveUp();
        }}
        className="w-7 h-7 rounded-[7px] flex items-center justify-center text-ink hover:text-primary hover:bg-white disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95"
        title="Chuyển khối này lên trên"
        aria-label="Chuyển khối này lên trên"
      >
        <ArrowUp size={13} strokeWidth={2.5} />
      </button>

      <button
        type="button"
        disabled={isLast}
        onClick={(e) => {
          e.stopPropagation();
          onMoveDown();
        }}
        className="w-7 h-7 rounded-[7px] flex items-center justify-center text-ink hover:text-primary hover:bg-white disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95"
        title="Chuyển khối này xuống dưới"
        aria-label="Chuyển khối này xuống dưới"
      >
        <ArrowDown size={13} strokeWidth={2.5} />
      </button>

      <div className="w-[1px] h-3 bg-line mx-0.5" />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpenReorderModal();
        }}
        className="h-7 px-2 rounded-[7px] flex items-center gap-1 text-[11px] font-extrabold text-muted hover:text-primary hover:bg-white transition-all cursor-pointer"
        title="Cài đặt thứ tự tất cả các khối"
      >
        <Layers size={12} />
        <span className="hidden xs:inline text-[11px]">Vị trí</span>
      </button>
    </div>
  );
}
