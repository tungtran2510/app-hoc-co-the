'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, Home, ListOrdered, MoreVertical, X, Lock, Check, Settings as SettingsIcon, Share2, Bookmark, Sun, Moon, Eye, Smartphone } from 'lucide-react';

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
            className="w-10 h-10 rounded-full bg-surface-2 hover:bg-surface-3 flex items-center justify-center text-ink hover:text-primary transition-colors shadow-2xs shrink-0"
            title="Về Trang chủ"
            aria-label="Về Trang chủ"
          >
            <Home size={19} strokeWidth={2.2} />
          </Link>

          <span className="text-muted/60 text-[14px] font-bold shrink-0">›</span>

          <Link
            href={`/${topicSlug}`}
            prefetch={true}
            className="flex items-center gap-1 text-[#1E3A8A] hover:text-[#172554] dark:text-purple-300 text-[16px] sm:text-[17px] font-extrabold min-h-[44px] transition-colors truncate"
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

      {/* 3. Nút Mục lục nổi góc dưới (Icon tròn tinh tế, không chữ cồng kềnh) */}
      {tocItems.length > 0 && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-40" style={{ transform: 'translateZ(0)' }}>
          <button
            type="button"
            onClick={() => {
              setShowToc(!showToc);
              setShowOptions(false);
            }}
            className="relative w-12 h-12 rounded-full bg-[#1E3A8A] hover:bg-[#172554] dark:bg-purple-900 dark:hover:bg-purple-800 text-white flex items-center justify-center shadow-[0_6px_20px_rgba(30,58,138,0.35)] active:scale-95 transition-all cursor-pointer border-2 border-white/40 group"
            title="Mục lục bài học"
            aria-label="Mở mục lục bài học"
          >
            <ListOrdered size={21} strokeWidth={2.3} className="group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-amber-400 text-slate-900 text-[10.5px] font-black flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-[#160D30]">
              {tocItems.length}
            </span>
          </button>
        </div>
      )}

      {/* 4. Bảng Mục lục dạng Bottom Sheet trượt lên khi bấm nút nổi */}
      {showToc && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-[480px] bg-white dark:bg-[#160D30] rounded-t-[24px] sm:rounded-[24px] p-4 flex flex-col gap-2 shadow-2xl animate-in slide-in-from-bottom duration-200 border border-slate-200 dark:border-purple-900/60">
            <div className="flex items-center justify-between pb-2.5 border-b border-line dark:border-purple-900/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[10px] bg-primary-soft dark:bg-purple-900/60 text-primary dark:text-[#F8DF7B] flex items-center justify-center">
                  <ListOrdered size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-[16px] font-extrabold text-ink dark:text-white leading-tight">
                    MỤC LỤC BÀI HỌC
                  </h3>
                  <span className="text-[12px] text-muted font-medium">
                    {tocItems.length} phần nội dung
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowToc(false)}
                className="w-8 h-8 rounded-full bg-surface-2 dark:bg-purple-950/60 flex items-center justify-center text-muted hover:text-ink dark:text-purple-300 dark:hover:text-white cursor-pointer"
                aria-label="Đóng mục lục"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[380px] overflow-y-auto flex flex-col divide-y divide-line dark:divide-purple-900/40 py-1">
              {tocItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleScrollToBlock(item.id)}
                  className="w-full flex items-center justify-between h-[48px] px-2.5 rounded-[12px] text-left text-[15px] font-bold text-ink dark:text-white hover:bg-blue-50 dark:hover:bg-purple-900/40 hover:text-primary dark:hover:text-[#F8DF7B] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-surface-2 dark:bg-purple-950 group-hover:bg-[#1E3A8A] group-hover:text-white text-muted dark:text-purple-300 text-[11px] font-extrabold flex items-center justify-center shrink-0 transition-colors">
                      {idx + 1}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className="text-muted/60 dark:text-purple-400/60 text-[14px] shrink-0 ml-2 group-hover:text-primary dark:group-hover:text-[#F8DF7B] transition-colors">›</span>
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
                onClick={() => onFontSizeChange('small')}
                className={`h-[44px] rounded-[12px] font-extrabold text-[14px] transition-all ${
                  fontSizeMode === 'small'
                    ? 'bg-primary-soft border-2 border-primary text-primary'
                    : 'bg-surface-2 border border-line-strong text-ink hover:bg-line/40'
                }`}
              >
                Nhỏ
              </button>
              <button
                type="button"
                onClick={() => onFontSizeChange('normal')}
                className={`h-[44px] rounded-[12px] font-extrabold text-[15px] transition-all ${
                  fontSizeMode === 'normal'
                    ? 'bg-primary-soft border-2 border-primary text-primary'
                    : 'bg-surface-2 border border-line-strong text-ink hover:bg-line/40'
                }`}
              >
                Vừa
              </button>
              <button
                type="button"
                onClick={() => onFontSizeChange('large')}
                className={`h-[44px] rounded-[12px] font-extrabold text-[16px] transition-all ${
                  fontSizeMode === 'large'
                    ? 'bg-primary-soft border-2 border-primary text-primary'
                    : 'bg-surface-2 border border-line-strong text-ink hover:bg-line/40'
                }`}
              >
                Lớn
              </button>
            </div>
          </div>

          {/* Giao diện: Sáng / Xám dịu / Tối */}
          <div className="flex flex-col gap-2 pt-2 border-t border-line">
            <span className="text-[13px] font-bold text-muted uppercase tracking-wider">
              Nền giao diện
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onThemeChange && onThemeChange('light')}
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
                onClick={() => onThemeChange && onThemeChange('dark')}
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
              <Link
                href={`/dang-nhap?from=${encodeURIComponent(pathname || '/')}`}
                onClick={() => setShowOptions(false)}
                className="flex items-center justify-center gap-2 h-[44px] rounded-[12px] bg-primary-soft text-primary font-bold text-[14px] border border-primary/30"
              >
                <Lock size={16} />
                <span>Đăng nhập quản trị</span>
              </Link>
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
