'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Settings, Share2, X, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode';
import { checkAdminStatus, isSuperAdmin } from '../lib/adminAuth';
import { playTapSound } from '../lib/audioFeedback';
import AdminSettingsModal from './admin/AdminSettingsModal';

interface TopicHeaderNavProps {
  topicTitle?: string;
  topicSlug?: string;
}

export default function TopicHeaderNav({ topicTitle, topicSlug }: TopicHeaderNavProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuper, setIsSuper] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Modal Chia sẻ mã QR & Link
  const [showShareModal, setShowShareModal] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    checkAdminStatus().then((st) => {
      setIsAdmin(st.isAdmin);
      setIsSuper(isSuperAdmin(st.user));
    });
  }, []);

  const handleOpenShareModal = async () => {
    playTapSound();
    const url = typeof window !== 'undefined' ? window.location.href : '';
    setShareUrl(url);
    setIsCopied(false);
    setShowShareModal(true);

    try {
      if (url) {
        const qr = await QRCode.toDataURL(url, {
          width: 320,
          margin: 2,
          color: {
            dark: '#111827',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        });
        setQrCodeDataUrl(qr);
      }
    } catch (e) {
      console.error('Lỗi tạo mã QR chuyên đề:', e);
    }
  };

  const handleCopyLink = async () => {
    playTapSound();
    const targetUrl = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
    if (!targetUrl) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(targetUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      } else {
        const ta = document.createElement('textarea');
        ta.value = targetUrl;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      }
    } catch {
      alert('Không thể sao chép liên kết vào bộ nhớ tạm.');
    }
  };

  return (
    <>
      <nav aria-label="Đường dẫn quay lại" className="flex items-center justify-between">
        <a
          href="/"
          onClick={playTapSound}
          className="inline-flex items-center gap-1 h-[48px] min-h-[48px] text-[#1E3A8A] hover:text-[#172554] dark:text-[#F8DF7B] text-[17px] font-extrabold transition-opacity active:opacity-75 cursor-pointer"
          aria-label="Quay lại Trang chủ"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
          <span>Trang chủ</span>
        </a>

        <div className="flex items-center gap-2">
          {/* Nút Chia sẻ chuyên đề (đúng vị trí góc trên phải) */}
          <button
            type="button"
            onClick={handleOpenShareModal}
            className="flex items-center gap-1.5 h-8 sm:h-9 px-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-slate-700 dark:text-purple-200 font-bold text-[12.5px] sm:text-[13px] border border-slate-200/90 dark:border-purple-800/80 shadow-2xs transition-all active:scale-95 cursor-pointer"
            aria-label="Chia sẻ chuyên đề này"
            title="Chia sẻ chuyên đề"
          >
            <Share2 size={14} strokeWidth={2.2} className="text-slate-600 dark:text-purple-300" />
            <span>Chia sẻ</span>
          </button>

          {isSuper && (
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-1 h-8 sm:h-9 px-2.5 rounded-full bg-blue-50 text-[#1E3A8A] dark:bg-purple-950 dark:text-[#F8DF7B] font-bold text-[12px] border border-blue-200 dark:border-purple-700/60 shadow-2xs hover:bg-blue-100 cursor-pointer"
              title="Cài đặt quản trị & Giảng viên"
            >
              <Settings size={14} />
              <span>Quản trị</span>
            </button>
          )}
        </div>
      </nav>

      {/* Modal Chia sẻ có Mã QR và Link chuẩn (giống các trang khác) */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[999] flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="relative w-full max-w-[340px] sm:max-w-[360px] bg-[#FAF8F5] dark:bg-[#160E28] rounded-[24px] p-5 sm:p-6 shadow-2xl border border-stone-200/80 dark:border-purple-900/60 flex flex-col items-center text-center animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút Đóng X góc trên phải */}
            <button
              type="button"
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-200/70 dark:bg-purple-900/50 text-slate-600 dark:text-purple-200 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-purple-800 transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {/* Tiêu đề ngắn gọn cần thiết */}
            <h3 className="text-[17px] font-extrabold text-slate-800 dark:text-white mt-1">
              Mã QR chuyên đề
            </h3>

            {/* Khung chứa ảnh mã QR chuẩn sắc nét */}
            <div className="p-3.5 bg-white rounded-[20px] shadow-sm border border-slate-200/60 mt-4 mb-3 flex items-center justify-center">
              {qrCodeDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrCodeDataUrl}
                  alt={`Mã QR chuyên đề ${topicTitle || ''}`}
                  className="w-[190px] h-[190px] object-contain rounded-[8px]"
                />
              ) : (
                <div className="w-[190px] h-[190px] bg-slate-100 rounded-[8px] flex items-center justify-center text-slate-400 text-[12px]">
                  Đang tạo mã QR...
                </div>
              )}
            </div>

            {/* Hướng dẫn quét và Tên chuyên đề */}
            <p className="text-[13px] text-slate-600 dark:text-purple-200 leading-snug">
              Quét mã QR để mở chuyên đề
            </p>
            {topicTitle && (
              <p className="text-[14.5px] font-extrabold text-slate-900 dark:text-white leading-tight mt-0.5 max-w-[280px] truncate">
                {topicTitle}
              </p>
            )}

            {/* Đường dẫn link chuẩn */}
            <p className="text-[11.5px] text-slate-400 dark:text-purple-300/70 font-mono break-all max-w-[280px] line-clamp-1 mt-2 mb-4">
              {shareUrl}
            </p>

            {/* Nút Sao chép link chuẩn */}
            <button
              type="button"
              onClick={handleCopyLink}
              className={`w-full h-[46px] rounded-[14px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
                isCopied
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[#2E313D] dark:bg-purple-800 hover:bg-[#20222B] text-white shadow-sm'
              }`}
            >
              {isCopied ? (
                <>
                  <Check size={17} strokeWidth={2.5} />
                  <span>Đã sao chép link!</span>
                </>
              ) : (
                <>
                  <Copy size={16} strokeWidth={2.2} />
                  <span>Sao chép link chuyên đề</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <AdminSettingsModal
          isOpen={true}
          onClose={() => setShowSettings(false)}
          onLogout={() => setIsAdmin(false)}
        />
      )}
    </>
  );
}
