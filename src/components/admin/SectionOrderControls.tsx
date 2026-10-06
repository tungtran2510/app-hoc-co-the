'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Layers, Eye, EyeOff, Edit2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface SectionOrderControlsProps {
  sectionTitle?: string;
  sectionIndex: number;
  totalSections: number;
  isHidden?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
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
  isCollapsed = false,
  onToggleCollapse,
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

  const [isCompact, setIsCompact] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsCompact(localStorage.getItem('admin_compact_section_bars') === 'true');
      const handler = () => {
        setIsCompact(localStorage.getItem('admin_compact_section_bars') === 'true');
      };
      window.addEventListener('admin_compact_toggle', handler);
      return () => window.removeEventListener('admin_compact_toggle', handler);
    }
  }, []);

  const toggleCompactMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isCompact;
    setIsCompact(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_compact_section_bars', String(next));
      window.dispatchEvent(new Event('admin_compact_toggle'));
    }
  };

  // Nếu không truyền sectionTitle và onEdit, hiển thị dạng pill thu gọn
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
      className={`w-full flex items-center justify-between py-1 px-2 sm:px-2.5 rounded-[12px] bg-slate-900/85 dark:bg-[#1A103C]/95 border border-slate-300/30 dark:border-purple-700/60 shadow-xs backdrop-blur-xs mb-1.5 gap-1.5 sm:gap-2 ${className}`}
      title={`Thanh quản trị: ${sectionTitle || 'Khối nội dung'}`}
    >
      {/* Bên trái: Tên khối & Trạng thái (được ưu tiên co giãn rộng nhất có thể) */}
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <span
          className="text-[11px] font-black text-slate-200 dark:text-purple-200 uppercase tracking-wider truncate"
          title={sectionTitle || 'KHỐI NỘI DUNG'}
        >
          {sectionTitle || 'KHỐI NỘI DUNG'}
        </span>
        {isHidden && (
          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500/25 text-amber-300 border border-amber-400/40 shrink-0">
            Ẩn
          </span>
        )}
        {isCollapsed && (
          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-200 border border-purple-400/40 shrink-0">
            Thu gọn
          </span>
        )}
      </div>

      {/* Bên phải: Nút Sửa trực tiếp + Thu gọn/Mở rộng + Lên, Xuống, Ẩn, Đổi thứ tự + Siêu gọn */}
      <div className="flex items-center gap-1 shrink-0">
        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className={`flex items-center justify-center gap-1 h-7 rounded-[7px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] tracking-wide uppercase transition-transform active:scale-95 shadow-xs cursor-pointer ${
              isCompact ? 'w-7 px-0' : 'px-2 sm:px-2.5'
            }`}
            title={`${editLabel} (${sectionTitle})`}
          >
            <Edit2 size={11} strokeWidth={3} />
            {!isCompact && (
              <>
                <span className="hidden sm:inline">{editLabel}</span>
                <span className="sm:hidden">Sửa</span>
              </>
            )}
          </button>
        )}

        {/* Nút Thu gọn / Mở rộng khối */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse();
            }}
            className={`w-7 h-7 rounded-[7px] flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
              isCollapsed
                ? 'bg-purple-600/70 text-amber-300 font-black border border-purple-400/50 shadow-xs'
                : 'text-slate-300 dark:text-purple-300 hover:text-white hover:bg-white/15'
            }`}
            title={isCollapsed ? 'Khối đang thu gọn – Bấm để mở rộng' : 'Khối đang mở – Bấm để thu gọn'}
          >
            {isCollapsed ? <ChevronDown size={14} strokeWidth={2.6} /> : <ChevronUp size={14} strokeWidth={2.6} />}
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

        {/* Chuyển đổi Biểu tượng Siêu gọn */}
        <button
          type="button"
          onClick={toggleCompactMode}
          className={`w-7 h-7 rounded-[7px] flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
            isCompact
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
              : 'text-slate-400 dark:text-purple-400 hover:text-white hover:bg-white/10'
          }`}
          title={isCompact ? 'Đang bật biểu tượng siêu gọn – Bấm để hiện chữ' : 'Bật chế độ biểu tượng siêu gọn (tiết kiệm không gian)'}
        >
          <Sparkles size={11} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
