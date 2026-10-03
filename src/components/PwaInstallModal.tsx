'use client';

import React from 'react';
import { X, Download, Share2, PlusSquare } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PwaInstallModal({ isOpen, onClose }: PwaInstallModalProps) {
  if (!isOpen) return null;

  const isIOS =
    typeof navigator !== 'undefined' &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  const handleAndroidInstall = async () => {
    if (typeof window !== 'undefined' && window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const choiceResult = await window.deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        window.deferredPrompt = null;
      }
      onClose();
    } else {
      alert('Để cài đặt ứng dụng: Mở menu trình duyệt (⋮) → Chọn "Cài đặt ứng dụng" hoặc "Thêm vào Màn hình chính".');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[440px] bg-white dark:bg-[#160E2E] rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl border border-slate-200 dark:border-purple-800/50 animate-in slide-in-from-bottom duration-200">
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-purple-800/80 rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        <div className="flex items-center justify-between p-4 px-5 border-b border-line dark:border-purple-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] overflow-hidden shrink-0 border border-slate-200 dark:border-purple-400/40 p-0.5 bg-white dark:bg-[#120A2B] shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/app_logo.png?v=21" alt="Qbiz Books" className="w-full h-full object-cover rounded-[10px]" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[17px] font-extrabold text-ink dark:text-white leading-tight">
                Cài đặt Qbiz Books
              </h3>
              <span className="text-[11.5px] font-semibold text-muted dark:text-purple-300/80">
                Tủ Sách Y Khoa & Khám Phá Cơ Thể
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-2 dark:bg-purple-950/60 flex items-center justify-center text-muted dark:text-purple-300 hover:text-ink dark:hover:text-white cursor-pointer"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Card giới thiệu app với logo chuẩn */}
          <div className="flex items-center gap-3 p-3 rounded-[16px] bg-amber-50/70 dark:bg-purple-950/40 border border-amber-200/80 dark:border-purple-800/40">
            <div className="w-12 h-12 rounded-[13px] overflow-hidden shrink-0 border border-amber-300 dark:border-purple-700/60 shadow-xs bg-white dark:bg-[#120A2B] p-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/app_logo.png?v=21" alt="Qbiz Books" className="w-full h-full object-cover rounded-[11px]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-extrabold text-slate-900 dark:text-white leading-tight">
                Qbiz Books · Tủ Sách Y Khoa
              </span>
              <span className="text-[12px] text-slate-600 dark:text-purple-200/90 leading-tight mt-0.5">
                Mở nhanh từ màn hình, xem bài học 0ms mượt mà và lưu tiến độ học tập
              </span>
            </div>
          </div>

          {isIOS ? (
            /* Hướng dẫn 2 bước cho iPhone / iPad */
            <div className="flex flex-col gap-3">
              <p className="text-[14px] text-ink-2 dark:text-purple-200/90 leading-relaxed font-medium">
                Để cài ứng dụng trên <strong>iPhone / Safari</strong>:
              </p>

              <div className="flex items-start gap-3 p-3.5 rounded-[16px] bg-surface-2 dark:bg-purple-950/30 border border-line dark:border-purple-900/40">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-purple-900 text-primary dark:text-[#F8DF7B] flex items-center justify-center shrink-0 shadow-2xs font-extrabold text-[14px]">
                  1
                </div>
                <div className="flex-1 flex flex-col gap-0.5">
                  <span className="text-[14.5px] font-bold text-ink dark:text-white flex items-center gap-1.5">
                    <span>Bấm nút Chia sẻ</span>
                    <Share2 size={16} className="text-primary dark:text-[#F8DF7B] inline" />
                  </span>
                  <span className="text-[12.5px] text-muted dark:text-purple-300/80">
                    Biểu tượng ô vuông có mũi tên chỉ lên ở thanh dưới cùng Safari
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-[16px] bg-surface-2 dark:bg-purple-950/30 border border-line dark:border-purple-900/40">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-purple-900 text-primary dark:text-[#F8DF7B] flex items-center justify-center shrink-0 shadow-2xs font-extrabold text-[14px]">
                  2
                </div>
                <div className="flex-1 flex flex-col gap-0.5">
                  <span className="text-[14.5px] font-bold text-ink dark:text-white flex items-center gap-1.5">
                    <span>Chọn &ldquo;Thêm vào MH chính&rdquo;</span>
                    <PlusSquare size={16} className="text-primary dark:text-[#F8DF7B] inline" />
                  </span>
                  <span className="text-[12.5px] text-muted dark:text-purple-300/80">
                    Cuộn xuống danh sách tùy chọn và chọn Thêm vào Màn hình chính
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Android / Chrome */
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleAndroidInstall}
                className="flex items-center justify-center gap-2 h-[50px] rounded-[16px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-500 dark:from-[#F8DF7B] dark:to-amber-400 text-slate-950 font-black text-[15px] shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <Download size={18} strokeWidth={2.5} />
                <span>Cài đặt ứng dụng ngay</span>
              </button>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-[12px] bg-surface-2 dark:bg-purple-950/60 text-ink dark:text-purple-200 font-bold text-[14px] cursor-pointer hover:bg-slate-200 dark:hover:bg-purple-900/60 transition-colors"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
