'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Menu, MoreVertical, X, Lock, Check } from 'lucide-react';

export interface TocItem {
  id: string;
  label: string;
}

export type FontSizeOption = 'small' | 'normal' | 'large';

interface PageHeaderBarProps {
  topicTitle: string;
  topicSlug: string;
  tocItems: TocItem[];
  fontSizeMode: FontSizeOption;
  onFontSizeChange: (mode: FontSizeOption) => void;
  isAdmin?: boolean;
  onToggleAdmin?: () => void;
}

export default function PageHeaderBar({
  topicTitle,
  topicSlug,
  tocItems,
  fontSizeMode,
  onFontSizeChange,
  isAdmin = false,
  onToggleAdmin,
}: PageHeaderBarProps) {
  const [showToc, setShowToc] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleScrollToBlock = (blockId: string) => {
    setShowToc(false);
    const element = document.getElementById(`block-${blockId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative w-full z-40">
      <div className="flex items-center justify-between h-[52px] my-1">
        {/* Nút quay lại */}
        <Link
          href={`/${topicSlug}`}
          prefetch={true}
          className="flex items-center gap-1 text-primary text-[18px] font-bold min-h-[48px] pr-2 transition-opacity active:opacity-75"
          aria-label={`Quay lại ${topicTitle}`}
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
          <span>{topicTitle}</span>
        </Link>

        {/* Nút Mục lục + Nút Tuỳ chọn */}
        <div className="flex items-center gap-2">
          {/* Nút Mục lục */}
          <button
            type="button"
            onClick={() => {
              setShowToc(!showToc);
              setShowOptions(false);
            }}
            className={`flex items-center gap-1.5 h-[48px] min-w-[48px] px-3.5 rounded-[16px] border-[1.5px] text-[15px] font-bold transition-all shadow-xs ${
              showToc
                ? 'bg-primary-soft border-primary text-primary'
                : 'bg-white border-line text-ink hover:border-line-strong'
            }`}
            aria-expanded={showToc}
            aria-label="Mục lục"
          >
            <Menu size={18} strokeWidth={2.5} />
            <span>Mục lục</span>
          </button>

          {/* Nút Tuỳ chọn ⋮ */}
          <button
            type="button"
            onClick={() => {
              setShowOptions(!showOptions);
              setShowToc(false);
            }}
            className={`flex items-center justify-center w-[48px] h-[48px] min-w-[48px] rounded-[16px] border-[1.5px] transition-all shadow-xs ${
              showOptions
                ? 'bg-primary-soft border-primary text-primary'
                : 'bg-white border-line text-ink hover:border-line-strong'
            }`}
            aria-expanded={showOptions}
            aria-label="Tùy chọn"
          >
            <MoreVertical size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Bảng Mục lục bung ra */}
      {showToc && (
        <div className="absolute top-[58px] right-0 left-0 bg-white rounded-[20px] border-[1.5px] border-line shadow-xl p-3 flex flex-col gap-1 z-50 animate-in fade-in duration-150">
          <div className="flex items-center justify-between px-3 py-2 border-b border-line mb-1">
            <span className="text-[15px] font-extrabold text-ink uppercase tracking-[0.5px]">
              MỤC LỤC TRANG
            </span>
            <button
              type="button"
              onClick={() => setShowToc(false)}
              className="p-1 rounded-lg text-muted hover:bg-surface-2"
              aria-label="Đóng mục lục"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-[360px] overflow-y-auto flex flex-col divide-y divide-line/60">
            {tocItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleScrollToBlock(item.id)}
                className="w-full flex items-center justify-between h-[48px] min-h-[48px] px-3 rounded-[12px] text-left text-[16px] font-bold text-ink hover:bg-primary-soft hover:text-primary transition-colors"
              >
                <span>{item.label}</span>
                <span className="text-muted text-[14px]">›</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bảng Tùy chọn: 3 cỡ chữ & Quản trị */}
      {showOptions && (
        <div className="absolute top-[58px] right-0 w-[270px] bg-white rounded-[20px] border-[1.5px] border-line shadow-xl p-4 flex flex-col gap-4 z-50 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <span className="text-[15px] font-extrabold text-ink uppercase tracking-[0.5px]">
              TÙY CHỌN
            </span>
            <button
              type="button"
              onClick={() => setShowOptions(false)}
              className="p-1 rounded-lg text-muted hover:bg-surface-2"
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

          {/* Quản trị nội dung */}
          <div className="flex flex-col gap-2 pt-2 border-t border-line">
            <span className="text-[13px] font-bold text-muted uppercase tracking-wider">
              Quản trị
            </span>
            {isAdmin ? (
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
            ) : (
              <Link
                href="/dang-nhap"
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
