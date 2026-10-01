'use client';

import React from 'react';
import { ArrowUp, ArrowDown, Layers, Eye, EyeOff, Edit2 } from 'lucide-react';

interface SectionOrderControlsProps {
  sectionTitle?: string;
  sectionIndex: number;
  totalSections: number;
  isHidden?: boolean;
  onToggleVisibility?: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onOpenReorderModal: () => void;
  onEdit?: () => void;
  editLabel?: string;
  className?: string;
}

export default function SectionOrderControls({
  sectionTitle,
  sectionIndex,
  totalSections,
  isHidden = false,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  onOpenReorderModal,
  onEdit,
  editLabel = 'Sửa',
  className = '',
}: SectionOrderControlsProps) {
  const isFirst = sectionIndex <= 0;
  const isLast = sectionIndex >= totalSections - 1;

  // Nếu không truyền sectionTitle, hiển thị dạng pill thu gọn
  if (!sectionTitle && !onEdit) {
    return (
      <div
        className={`inline-flex items-center gap-0.5 bg-white/90 dark:bg-[#1A103C]/95 border border-slate-200 dark:border-purple-800/50 rounded-[10px] p-0.5 shadow-2xs shrink-0 ${className}`}
        title="Quản lý khối"
      >
        {onToggleVisibility && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            className={`h-7 px-1.5 rounded-[7px] flex items-center gap-1 text-[11px] font-extrabold transition-all cursor-pointer active:scale-95 ${
              isHidden
                ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                : 'text-slate-600 dark:text-purple-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-purple-900/40'
            }`}
            title={isHidden ? 'Khối đang ẩn – Bấm để hiện' : 'Khối đang hiện – Bấm để ẩn'}
          >
            {isHidden ? (
              <>
                <EyeOff size={13} strokeWidth={2.5} />
                <span className="text-[10px]">Ẩn</span>
              </>
            ) : (
              <Eye size={13} strokeWidth={2.2} />
            )}
          </button>
        )}

        <button
          type="button"
          disabled={isFirst}
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          className="w-7 h-7 rounded-[7px] flex items-center justify-center text-slate-600 dark:text-purple-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-purple-900/40 disabled:opacity-20 cursor-pointer active:scale-95"
          title="Chuyển lên"
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
          className="w-7 h-7 rounded-[7px] flex items-center justify-center text-slate-600 dark:text-purple-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-purple-900/40 disabled:opacity-20 cursor-pointer active:scale-95"
          title="Chuyển xuống"
        >
          <ArrowDown size={13} strokeWidth={2.5} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenReorderModal();
          }}
          className="w-7 h-7 rounded-[7px] flex items-center justify-center text-slate-600 dark:text-purple-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-purple-900/40 cursor-pointer active:scale-95"
          title="Đổi thứ tự tất cả các khối"
        >
          <Layers size={13} strokeWidth={2.2} />
        </button>
      </div>
    );
  }

  // DẠNG THANH ĐIỀU KHIỂN CHUYÊN NGHIỆP TRÊN ĐẦU KHỐI (FULL-WIDTH ADMIN BAR)
  return (
    <div
      className={`w-full flex items-center justify-between py-1 px-2.5 rounded-[12px] bg-slate-900/75 dark:bg-[#1A103C]/95 border border-slate-300/30 dark:border-purple-700/60 shadow-xs backdrop-blur-xs mb-1.5 gap-2 ${className}`}
      title="Thanh quản trị khối"
    >
      {/* Bên trái: Tên khối & Trạng thái */}
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-[11px] font-black text-slate-200 dark:text-purple-200 uppercase tracking-wider truncate">
          {sectionTitle || 'KHỐI NỘI DUNG'}
        </span>
        {isHidden && (
          <span className="text-[9.5px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500/25 text-amber-300 border border-amber-400/40 shrink-0">
            Đang ẩn
          </span>
        )}
      </div>

      {/* Bên phải: Nút Sửa trực tiếp + Lên, Xuống, Ẩn, Đổi thứ tự */}
      <div className="flex items-center gap-1 shrink-0">
        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex items-center gap-1 h-[28px] px-2.5 rounded-[7px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] tracking-wide uppercase transition-transform active:scale-95 shadow-xs cursor-pointer mr-0.5"
            title={`${editLabel} (${sectionTitle})`}
          >
            <Edit2 size={11} strokeWidth={3} />
            <span>{editLabel}</span>
          </button>
        )}

        {/* Ẩn / Hiện */}
        {onToggleVisibility && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            className={`w-7 h-7 rounded-[7px] flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
              isHidden
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-300 dark:text-purple-300 hover:text-white hover:bg-white/15'
            }`}
            title={isHidden ? 'Khối đang ẩn – Bấm để hiện' : 'Khối đang hiện – Bấm để ẩn'}
          >
            {isHidden ? <EyeOff size={13} strokeWidth={2.5} /> : <Eye size={13} strokeWidth={2.2} />}
          </button>
        )}

        {/* Lên */}
        <button
          type="button"
          disabled={isFirst}
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          className="w-7 h-7 rounded-[7px] flex items-center justify-center text-slate-300 dark:text-purple-300 hover:text-white hover:bg-white/15 disabled:opacity-20 cursor-pointer active:scale-95 transition-all"
          title="Chuyển khối lên trên"
        >
          <ArrowUp size={13} strokeWidth={2.5} />
        </button>

        {/* Xuống */}
        <button
          type="button"
          disabled={isLast}
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
          className="w-7 h-7 rounded-[7px] flex items-center justify-center text-slate-300 dark:text-purple-300 hover:text-white hover:bg-white/15 disabled:opacity-20 cursor-pointer active:scale-95 transition-all"
          title="Chuyển khối xuống dưới"
        >
          <ArrowDown size={13} strokeWidth={2.5} />
        </button>

        {/* Đổi thứ tự tất cả các khối */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenReorderModal();
          }}
          className="w-7 h-7 rounded-[7px] flex items-center justify-center text-slate-300 dark:text-purple-300 hover:text-white hover:bg-white/15 cursor-pointer active:scale-95 transition-all"
          title="Mở bảng sắp xếp tất cả các khối"
        >
          <Layers size={13} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
