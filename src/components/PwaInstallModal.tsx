'use client';

import React from 'react';
import { X, Download, Share2, PlusSquare, Smartphone } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-[440px] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        <div className="w-12 h-1.5 bg-line-strong rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        <div className="flex items-center justify-between p-4 px-5 border-b border-line">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[10px] bg-primary-soft text-primary flex items-center justify-center">
              <Smartphone size={18} strokeWidth={2.5} />
            </div>
            <h3 className="text-[19px] font-extrabold text-ink leading-tight">
              Cài app ra màn hình chính
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-ink cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {isIOS ? (
            /* Hướng dẫn 2 bước cho iPhone / iPad */
            <div className="flex flex-col gap-3">
              <p className="text-[15px] text-ink-2 leading-relaxed">
                Để cài ứng dụng trên <strong>iPhone / Safari</strong>:
              </p>

              <div className="flex items-start gap-3 p-3.5 rounded-[16px] bg-surface-2 border border-line">
                <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center shrink-0 shadow-2xs font-extrabold text-[14px]">
                  1
                </div>
                <div className="flex-1 flex flex-col gap-0.5">
                  <span className="text-[15px] font-bold text-ink flex items-center gap-1.5">
                    <span>Bấm nút Chia sẻ</span>
                    <Share2 size={16} className="text-primary inline" />
                  </span>
                  <span className="text-[13px] text-muted">
                    Biểu tượng ô vuông có mũi tên chỉ lên ở thanh dưới cùng Safari
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-[16px] bg-surface-2 border border-line">
                <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center shrink-0 shadow-2xs font-extrabold text-[14px]">
                  2
                </div>
                <div className="flex-1 flex flex-col gap-0.5">
                  <span className="text-[15px] font-bold text-ink flex items-center gap-1.5">
                    <span>Chọn &ldquo;Thêm vào MH chính&rdquo;</span>
                    <PlusSquare size={16} className="text-primary inline" />
                  </span>
                  <span className="text-[13px] text-muted">
                    Cuộn xuống danh sách tùy chọn và chọn Thêm vào Màn hình chính
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Android / Chrome */
            <div className="flex flex-col gap-3">
              <p className="text-[15px] text-ink-2 leading-relaxed">
                Cài ứng dụng để mở nhanh từ màn hình điện thoại như một app thực thụ, không cần gõ địa chỉ web.
              </p>

              <button
                type="button"
                onClick={handleAndroidInstall}
                className="flex items-center justify-center gap-2 h-[52px] rounded-[16px] bg-primary text-white font-extrabold text-[16px] shadow-sm hover:bg-primary-dark transition-all cursor-pointer"
              >
                <Download size={18} strokeWidth={2.5} />
                <span>Cài đặt ứng dụng ngay</span>
              </button>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 rounded-[12px] bg-surface-2 text-ink font-bold text-[14px] cursor-pointer"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
