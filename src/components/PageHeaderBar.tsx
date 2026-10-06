'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, Home, ListOrdered, MoreVertical, X, Lock, Check, Settings as SettingsIcon, Share2, Bookmark, Sun, Moon, Eye, Smartphone, Volume2, VolumeX } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playTapSound } from '../lib/audioFeedback';

export interface TocItem {
  id: string;
  label: string;
}

export type FontSizeOption = 'small' | 'normal' | 'large';
export type ThemeModeOption = 'light' | 'gray' | 'dark';

interface PageHeaderBarProps {
  topicTitle: string;
  topicSlug: string;
  tocItems: TocItem[];
  fontSizeMode: FontSizeOption;
  onFontSizeChange: (mode: FontSizeOption) => void;
  isAdmin?: boolean;
  onToggleAdmin?: () => void;
  onOpenSettings?: () => void;
  onShare?: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
  themeMode?: ThemeModeOption;
  onThemeChange?: (mode: ThemeModeOption) => void;
  onOpenPhoneSync?: () => void;
  onSelectTocItem?: (blockId: string) => void;
}

export default function PageHeaderBar({
  topicTitle,
  topicSlug,
  tocItems,
  fontSizeMode,
  onFontSizeChange,
  isAdmin = false,
  onToggleAdmin,
  onOpenSettings,
  onShare,
  isSaved = false,
  onToggleSave,
  themeMode = 'light',
  onThemeChange,
  onOpenPhoneSync,
  onSelectTocItem,
}: PageHeaderBarProps) {
  const pathname = usePathname();
  const [showToc, setShowToc] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [soundActive, setSoundActive] = useState(true);

  React.useEffect(() => {
    setSoundActive(isSoundEnabled());
    const handleToggle = (e: any) => {
      if (e?.detail?.enabled !== undefined) {
        setSoundActive(e.detail.enabled);
      }
    };
    window.addEventListener('qbiz_sound_toggle', handleToggle);
    return () => window.removeEventListener('qbiz_sound_toggle', handleToggle);
  }, []);

  // Floating TOC Draggable & Position State
  const [tocPos, setTocPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfoRef = React.useRef<{
    startX: number;
    startY: number;
    elemX: number;
    elemY: number;
    moved: boolean;
  }>({ startX: 0, startY: 0, elemX: 0, elemY: 0, moved: false });
  const justDraggedRef = React.useRef(false);

  // Khởi tạo vị trí: ưu tiên vị trí đã lưu trong localStorage, mặc định bên trái ở 2/3 góc dưới
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('qbiz_toc_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          const clampedX = Math.max(12, Math.min(parsed.x, window.innerWidth - 56));
          const clampedY = Math.max(60, Math.min(parsed.y, window.innerHeight - 70));
          setTocPos({ x: clampedX, y: clampedY });
          return;
        }
      }
    } catch (e) {
      // Bỏ qua lỗi localStorage
    }

    // Mặc định: Phía bên trái màn hình (12px), khoảng 2/3 góc dưới (khoảng 65% chiều cao)
    const defaultX = 12;
    const defaultY = Math.round(window.innerHeight * 0.65 - 24);
    setTocPos({ x: defaultX, y: defaultY });
  }, []);

  // Đảm bảo nút luôn nằm trong màn hình khi xoay máy hoặc đổi kích thước cửa sổ
  React.useEffect(() => {
    const handleResize = () => {
      setTocPos((prev) => {
        if (!prev) return prev;
        const clampedX = Math.max(12, Math.min(prev.x, window.innerWidth - 56));
        const clampedY = Math.max(60, Math.min(prev.y, window.innerHeight - 70));
        return { x: clampedX, y: clampedY };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Xử lý kéo thả nút Mục lục (Hỗ trợ cả cảm ứng ngón tay Mobile & chuột Desktop)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const currentX = tocPos ? tocPos.x : 12;
    const currentY = tocPos ? tocPos.y : Math.round(window.innerHeight * 0.65 - 24);

    dragInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      elemX: currentX,
      elemY: currentY,
      moved: false,
    };

    let latestX = currentX;
    let latestY = currentY;

    const handlePointerMove = (moveEvt: PointerEvent) => {
      const dx = moveEvt.clientX - dragInfoRef.current.startX;
      const dy = moveEvt.clientY - dragInfoRef.current.startY;

      // Ngưỡng 14px loại trừ hoàn toàn vi rung ngón tay khi chạm, chỉ kích hoạt khi thực sự muốn kéo
      if (!dragInfoRef.current.moved && Math.hypot(dx, dy) > 14) {
        dragInfoRef.current.moved = true;
        setIsDragging(true);
      }

      if (dragInfoRef.current.moved) {
        const minX = 12;
        const maxX = window.innerWidth - 56;
        const minY = 60; // Tránh che thanh header
        const maxY = window.innerHeight - 70; // Tránh che thanh điều hướng hoặc chạm đáy

        latestX = Math.max(minX, Math.min(dragInfoRef.current.elemX + dx, maxX));
        latestY = Math.max(minY, Math.min(dragInfoRef.current.elemY + dy, maxY));

        setTocPos({ x: latestX, y: latestY });
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      if (dragInfoRef.current.moved) {
        // Đã kéo thả: lưu vị trí và chặn click nhầm
        setIsDragging(false);
        justDraggedRef.current = true;
        setTimeout(() => {
          justDraggedRef.current = false;
        }, 120);

        // Hít nhẹ vào mép nếu thả gần lề
        const minX = 12;
        const maxX = window.innerWidth - 56;
        let finalX = latestX;
        if (latestX < 36) finalX = minX;
        else if (latestX > maxX - 24) finalX = maxX;

        const finalPos = { x: finalX, y: latestY };
        setTocPos(finalPos);

        try {
          localStorage.setItem('qbiz_toc_pos', JSON.stringify(finalPos));
        } catch (err) {}
      } else {
        setIsDragging(false);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  // Mở/đóng mục lục khi người dùng chạm hoặc click (chuẩn native, 100% không trượt phát nào)
  const handleButtonClick = () => {
    if (justDraggedRef.current || dragInfoRef.current.moved) {
      return;
    }
    playTapSound();
    setShowToc((prev) => !prev);
    setShowOptions(false);
  };

  const handleScrollToBlock = (blockId: string) => {
    setShowToc(false);
    if (onSelectTocItem) {
      onSelectTocItem(blockId);
    } else {
      const element = document.getElementById(`block-${blockId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="relative w-full z-40">
      <div className="flex items-center justify-between h-[52px] my-1 gap-2">
        {/* 1. Breadcrumb: Home 🏠 › [Tên Chủ Đề] (Về trang chủ 1 chạm, không lặp chữ) */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Link
            href="/"
            prefetch={true}
            className="w-10 h-10 rounded-full bg-surface-2 hover:bg-surface-3 flex items-center justify-center text-ink hover:text-primary transition-colors shadow-2xs shrink-0 cursor-pointer"
            title="Về Trang chủ"
            aria-label="Về Trang chủ"
          >
            <Home size={19} strokeWidth={2.2} />
          </Link>

          <span className="text-muted/60 text-[14px] font-bold shrink-0">›</span>

          <Link
            href={`/${topicSlug}`}
            prefetch={true}
            className="flex items-center gap-1 text-[#1E3A8A] hover:text-[#172554] dark:text-purple-300 text-[16px] sm:text-[17px] font-extrabold min-h-[44px] transition-colors truncate cursor-pointer"
            aria-label={`Về chủ đề ${topicTitle}`}
            title={`Về chủ đề ${topicTitle}`}
          >
            <span className="truncate">{topicTitle}</span>
          </Link>
        </div>

        {/* 2. Nút Lưu + Nút Tuỳ chọn (Gọn gàng, thích ứng nền sáng / tối) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Nút Lưu bài học */}
          <button
            type="button"
            onClick={() => {
              if (onToggleSave) onToggleSave();
            }}
            className={`flex items-center justify-center w-[44px] h-[44px] rounded-[14px] border-[1.5px] transition-all shadow-2xs cursor-pointer active:scale-95 ${
              isSaved
                ? 'bg-amber-50 border-amber-400 text-amber-600 dark:bg-purple-900/50 dark:border-[#F8DF7B] dark:text-[#F8DF7B]'
                : 'bg-white border-slate-200 text-slate-700 hover:border-[#1E3A8A] hover:text-[#1E3A8A] dark:bg-[#160D30] dark:border-purple-900/50 dark:text-purple-200 dark:hover:border-purple-600'
            }`}
            aria-label={isSaved ? 'Bỏ lưu bài học này' : 'Lưu bài học này'}
            title={isSaved ? 'Đã lưu (Bấm để bỏ lưu)' : 'Lưu bài học'}
          >
            <Bookmark
              size={19}
              className={isSaved ? 'fill-amber-500 text-amber-500 dark:fill-[#F8DF7B] dark:text-[#F8DF7B]' : 'text-slate-600 dark:text-purple-300'}
              strokeWidth={2.3}
            />
          </button>

          {/* Nút Tuỳ chọn ⋮ */}
          <button
            type="button"
            onClick={() => {
              setShowOptions(!showOptions);
            }}
            className={`flex items-center justify-center w-[44px] h-[44px] rounded-[14px] border-[1.5px] transition-all shadow-2xs cursor-pointer active:scale-95 ${
              showOptions
                ? 'bg-blue-50 border-[#1E3A8A] text-[#1E3A8A] dark:bg-purple-900/50 dark:border-purple-500 dark:text-purple-200'
                : 'bg-white border-slate-200 text-slate-700 hover:border-[#1E3A8A] hover:text-[#1E3A8A] dark:bg-[#160D30] dark:border-purple-900/50 dark:text-purple-200 dark:hover:border-purple-600'
            }`}
            aria-expanded={showOptions}
            aria-label="Tùy chọn"
          >
            <MoreVertical size={19} strokeWidth={2.3} />
          </button>
        </div>
      </div>

      {/* 3. Nút Mục lục nổi thông minh (Bán trong suốt, có thể kéo thả di chuyển, mặc định bên trái ở 2/3 góc dưới) */}
      {tocItems.length > 0 && (
        <div
          onPointerDown={handlePointerDown}
          onClick={handleButtonClick}
          className={`fixed z-40 select-none touch-none ${
            isDragging
              ? 'opacity-100 cursor-grabbing scale-110'
              : 'opacity-65 hover:opacity-100 active:opacity-100 cursor-grab hover:scale-105 active:scale-95 transition-opacity transition-transform duration-200'
          }`}
          style={{
            transform: 'translateZ(0)',
            left: tocPos ? `${tocPos.x}px` : '12px',
            top: tocPos ? `${tocPos.y}px` : 'calc(65% - 24px)',
            transition: isDragging
              ? 'none'
              : 'left 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), top 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s ease, transform 0.2s ease',
          }}
          title="Mục lục bài học (Giữ để di chuyển)"
          role="button"
          tabIndex={0}
          aria-label="Mở mục lục bài học"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleButtonClick();
            }
          }}
        >
          <div className="relative w-12 h-12 rounded-full bg-purple-900/80 dark:bg-purple-900/75 backdrop-blur-md text-white flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.28)] border-1.5 border-white/35 dark:border-purple-400/40 group">
            <ListOrdered size={20} strokeWidth={2.3} className="group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 rounded-full bg-amber-400/95 text-slate-900 text-[10px] font-black flex items-center justify-center shadow-xs ring-1.5 ring-white/60 dark:ring-[#160D30]">
              {tocItems.length}
            </span>
          </div>
        </div>
      )}

      {/* 4. Pop-up Mục lục nổi (Gọn gàng, nhảy popup giữa màn hình, không tràn viền ngang) */}
      {showToc && (
        <div
          onClick={() => setShowToc(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[340px] bg-white dark:bg-[#160D30] rounded-[24px] p-4 flex flex-col gap-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-slate-200 dark:border-purple-900/60 animate-in zoom-in-95 duration-150"
          >
            {/* Header popup */}
            <div className="flex items-center justify-between pb-2.5 border-b border-line dark:border-purple-900/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[10px] bg-purple-100 dark:bg-purple-900/60 text-primary dark:text-[#F8DF7B] flex items-center justify-center">
                  <ListOrdered size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-[15px] font-extrabold text-ink dark:text-white leading-tight">
                    MỤC LỤC BÀI HỌC
                  </h3>
                  <span className="text-[11.5px] text-muted font-semibold">
                    {tocItems.length} phần nội dung
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowToc(false)}
                className="w-8 h-8 rounded-full bg-surface-2 dark:bg-purple-950/60 flex items-center justify-center text-muted hover:text-ink dark:text-purple-300 dark:hover:text-white cursor-pointer active:scale-95 transition-all"
                aria-label="Đóng mục lục"
              >
                <X size={17} />
              </button>
            </div>

            {/* Danh sách các phần mục lục */}
            <div className="max-h-[340px] overflow-y-auto flex flex-col divide-y divide-line dark:divide-purple-900/40 py-0.5 pr-0.5">
              {tocItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleScrollToBlock(item.id)}
                  className="w-full flex items-center justify-between min-h-[44px] py-2 px-2 rounded-[12px] text-left text-[14px] font-bold text-ink dark:text-white hover:bg-blue-50 dark:hover:bg-purple-900/40 hover:text-[#1E3A8A] dark:hover:text-[#F8DF7B] active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-surface-2 dark:bg-purple-950 group-hover:bg-[#1E3A8A] group-hover:text-white text-muted dark:text-purple-300 text-[11px] font-extrabold flex items-center justify-center shrink-0 transition-colors">
                      {idx + 1}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className="text-muted/60 dark:text-purple-400/60 text-[15px] font-bold shrink-0 ml-2 group-hover:text-[#1E3A8A] dark:group-hover:text-[#F8DF7B] transition-colors">›</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bảng Tùy chọn: 3 cỡ chữ & Quản trị */}
      {showOptions && (
        <div className="absolute top-[58px] right-0 w-[270px] bg-white dark:bg-[#160D30] rounded-[20px] border border-slate-200 dark:border-purple-900/60 shadow-2xl p-4 flex flex-col gap-4 z-50 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-line dark:border-purple-900/50">
            <span className="text-[15px] font-extrabold text-ink dark:text-white uppercase tracking-[0.5px]">
              TÙY CHỌN
            </span>
            <button
              type="button"
              onClick={() => setShowOptions(false)}
              className="p-1 rounded-lg text-muted hover:bg-surface-2 dark:text-purple-300 dark:hover:bg-purple-900/40"
              aria-label="Đóng bảng tùy chọn"
            >
              <X size={18} />
            </button>
          </div>

          {/* 3 Cỡ chữ: Nhỏ - Vừa - Lớn */}
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-bold text-muted uppercase tracking-wider">
              Cỡ chữ
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  playTapSound();
                  onFontSizeChange('small');
                }}
                className={`h-[44px] rounded-[12px] font-extrabold text-[14px] transition-all cursor-pointer ${
                  fontSizeMode === 'small'
                    ? 'bg-primary-soft border-2 border-primary text-primary'
                    : 'bg-surface-2 border border-line-strong text-ink hover:bg-line/40'
                }`}
              >
                Nhỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  playTapSound();
                  onFontSizeChange('normal');
                }}
                className={`h-[44px] rounded-[12px] font-extrabold text-[15px] transition-all cursor-pointer ${
                  fontSizeMode === 'normal'
                    ? 'bg-primary-soft border-2 border-primary text-primary'
                    : 'bg-surface-2 border border-line-strong text-ink hover:bg-line/40'
                }`}
              >
                Vừa
              </button>
              <button
                type="button"
                onClick={() => {
                  playTapSound();
                  onFontSizeChange('large');
                }}
                className={`h-[44px] rounded-[12px] font-extrabold text-[16px] transition-all cursor-pointer ${
                  fontSizeMode === 'large'
                    ? 'bg-primary-soft border-2 border-primary text-primary'
                    : 'bg-surface-2 border border-line-strong text-ink hover:bg-line/40'
                }`}
              >
                Lớn
              </button>
            </div>
          </div>

          {/* Giao diện: Sáng / Tối */}
          <div className="flex flex-col gap-2 pt-2 border-t border-line">
            <span className="text-[13px] font-bold text-muted uppercase tracking-wider">
              Nền giao diện
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  playTapSound();
                  if (onThemeChange) onThemeChange('light');
                }}
                className={`h-[42px] rounded-[12px] font-bold text-[13.5px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-primary text-white font-extrabold shadow-xs'
                    : 'bg-surface-2 border border-line-strong text-ink hover:bg-line/40'
                }`}
              >
                <Sun size={16} />
                <span>Nền Sáng</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playTapSound();
                  if (onThemeChange) onThemeChange('dark');
                }}
                className={`h-[42px] rounded-[12px] font-bold text-[13.5px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  themeMode === 'dark'
                    ? 'bg-primary text-white font-extrabold shadow-xs'
                    : 'bg-surface-2 border border-line-strong text-ink hover:bg-line/40'
                }`}
              >
                <Moon size={16} />
                <span>Nền Tối</span>
              </button>
            </div>
          </div>

          {/* Âm thanh tương tác vi mô: Bật / Tắt */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-line">
            <button
              type="button"
              onClick={() => {
                const nextState = !soundActive;
                setSoundActive(nextState);
                setSoundEnabled(nextState);
                if (nextState) playTapSound();
              }}
              className="flex items-center justify-between h-[44px] px-3 rounded-[12px] bg-surface-2 border border-line-strong text-ink font-bold text-[13.5px] hover:bg-line/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {soundActive ? (
                  <Volume2 size={17} className="text-emerald-600 dark:text-emerald-400 stroke-[2.3]" />
                ) : (
                  <VolumeX size={17} className="text-slate-400 dark:text-slate-500 stroke-[2.3]" />
                )}
                <span>Âm thanh tương tác</span>
              </div>
              <span
                className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                  soundActive
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {soundActive ? 'BẬT' : 'TẮT'}
              </span>
            </button>
          </div>

          {/* Chia sẻ trang này */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-line">
            <button
              type="button"
              onClick={() => {
                setShowOptions(false);
                if (onShare) onShare();
              }}
              className="flex items-center justify-center gap-2 h-[44px] rounded-[12px] bg-surface border border-line text-ink font-bold text-[14px] shadow-2xs hover:bg-surface-2 transition-all cursor-pointer"
            >
              <Share2 size={16} className="text-primary" />
              <span>Chia sẻ trang này</span>
            </button>

            {onOpenPhoneSync && (
              <button
                type="button"
                onClick={() => {
                  setShowOptions(false);
                  onOpenPhoneSync();
                }}
                className="flex items-center justify-center gap-2 h-[44px] rounded-[12px] bg-surface border border-line text-ink font-bold text-[14px] shadow-2xs hover:bg-surface-2 transition-all cursor-pointer"
              >
                <Smartphone size={16} className="text-primary" />
                <span>Lưu tiến độ qua SĐT</span>
              </button>
            )}
          </div>

          {/* Quản trị nội dung */}
          <div className="flex flex-col gap-2 pt-2 border-t border-line">
            <span className="text-[13px] font-bold text-muted uppercase tracking-wider">
              Quản trị
            </span>
            {isAdmin ? (
              <div className="flex flex-col gap-2">
                {onOpenSettings && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowOptions(false);
                      onOpenSettings();
                    }}
                    className="flex items-center justify-center gap-2 h-[44px] rounded-[12px] bg-primary text-white font-bold text-[14px] shadow-xs hover:bg-primary-dark transition-all"
                  >
                    <SettingsIcon size={16} />
                    <span>Cài đặt quản trị</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (onToggleAdmin) onToggleAdmin();
                    setShowOptions(false);
                  }}
                  className="flex items-center justify-center gap-2 h-[44px] rounded-[12px] bg-[#FFF1E6] text-[#8A3A14] font-bold text-[14px] border border-[#F2B38A]"
                >
                  <Check size={16} />
                  <span>Thoát chế độ sửa</span>
                </button>
              </div>
            ) : (
              <a
                href={`/dang-nhap?from=${encodeURIComponent(pathname || '/')}`}
                onClick={() => {
                  playTapSound();
                  setShowOptions(false);
                }}
                className="flex items-center justify-center gap-2 h-[44px] rounded-[12px] bg-primary-soft text-primary font-bold text-[14px] border border-primary/30"
              >
                <Lock size={16} />
                <span>Đăng nhập quản trị</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Overlay đóng bảng khi bấm ngoài */}
      {(showToc || showOptions) && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
          onClick={() => {
            setShowToc(false);
            setShowOptions(false);
          }}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
