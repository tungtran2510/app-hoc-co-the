'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  RefreshCw,
  LogOut,
  Sparkles,
} from 'lucide-react';
import {
  getUserPhone,
  syncUserProgress,
  clearUserPhone,
  LEARNING_PROGRESS_EVENT,
} from '../lib/userSync';
import { getSavedPages, getCompletedPages } from '../lib/learningProgress';

interface UserSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'bookmark' | 'manual';
  onSuccess?: () => void;
}

export default function UserSyncModal({
  isOpen,
  onClose,
  reason = 'manual',
  onSuccess,
}: UserSyncModalProps) {
  const [savedPhone, setSavedPhone] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [stats, setStats] = useState({ savedCount: 0, completedCount: 0 });
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const refreshStats = () => {
    try {
      const saved = getSavedPages();
      const completed = getCompletedPages();
      setStats({
        savedCount: saved.length,
        completedCount: completed.length,
      });
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (isOpen) {
      const p = getUserPhone();
      setSavedPhone(p);
      setPhoneInput('');
      setIsEditingPhone(false);
      setSyncMessage('');
      setErrorMessage('');
      refreshStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSyncSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneToUse = isEditingPhone ? phoneInput : (savedPhone || phoneInput);
    const clean = phoneToUse.replace(/[^0-9]/g, '');

    if (!clean || clean.length < 9 || clean.length > 11) {
      setErrorMessage('Vui lòng nhập đúng số điện thoại (từ 9 đến 11 số)');
      return;
    }

    try {
      setIsSyncing(true);
      setErrorMessage('');
      setSyncMessage('');

      const res = await syncUserProgress(clean, 'sync');

      if (res.success) {
        setSavedPhone(clean);
        setIsEditingPhone(false);
        setPhoneInput('');
        setSyncMessage('Đã lưu & đồng bộ thành công!');
        refreshStats();
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMessage(res.error || 'Chưa thể đồng bộ lúc này, vui lòng thử lại.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi kết nối khi đồng bộ dữ liệu.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = () => {
    if (
      !confirm(
        'Bạn có chắc chắn muốn ngắt kết nối số điện thoại khỏi thiết bị này? (Dữ liệu trên máy chủ vẫn được an toàn)'
      )
    ) {
      return;
    }
    clearUserPhone();
    setSavedPhone(null);
    setIsEditingPhone(false);
    setPhoneInput('');
    setSyncMessage('Đã ngắt liên kết số điện thoại.');
    refreshStats();
  };

  const formatPhone = (p: string) => {
    const clean = p.replace(/[^0-9]/g, '');
    if (clean.length === 10) {
      return `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`;
    }
    return clean;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[480px] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Nút kéo trên mobile */}
        <div className="w-12 h-1.5 bg-line-strong rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-line">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[12px] bg-primary-soft text-primary flex items-center justify-center shrink-0">
              {reason === 'bookmark' ? <Bookmark size={18} className="fill-primary" /> : <Smartphone size={18} />}
            </div>
            <div>
              <h3 className="text-[17px] font-extrabold text-ink leading-tight">
                {reason === 'bookmark' && !savedPhone
                  ? 'Đã lưu bài học! 🎉'
                  : 'Lưu tiến độ & Bài học'}
              </h3>
              <p className="text-[12px] text-muted leading-tight">
                Đồng bộ qua Số điện thoại cá nhân
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-2 hover:bg-surface-3 flex items-center justify-center text-muted hover:text-ink cursor-pointer transition-colors"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nội dung Modal */}
        <div className="p-5 flex flex-col gap-4">
          {/* TRƯỜNG HỢP 1: ĐÃ CÓ SỐ ĐIỆN THOẠI & KHÔNG ĐANG SỬA */}
          {savedPhone && !isEditingPhone ? (
            <div className="flex flex-col gap-3.5">
              <div className="p-4 rounded-[20px] bg-surface-2/80 border border-line flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={22} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] text-muted font-medium flex items-center gap-1.5">
                      <span>Đang liên kết với:</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </span>
                    <span className="text-[18px] font-black text-ink tracking-wide">
                      {formatPhone(savedPhone)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSyncSubmit}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 h-9 px-3 rounded-[12px] bg-white border border-line text-ink hover:text-primary text-[12.5px] font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
                  title="Đồng bộ lại"
                >
                  <RefreshCw size={13} className={isSyncing ? 'animate-spin text-primary' : ''} />
                  <span>{isSyncing ? 'Đang lưu...' : 'Đồng bộ'}</span>
                </button>
              </div>

              {/* Thống kê tiến độ */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-3 rounded-[16px] bg-white border border-line shadow-2xs">
                  <Bookmark size={16} className="text-primary shrink-0" />
                  <span className="text-[13.5px] font-bold text-ink">
                    {stats.savedCount} bài đã lưu
                  </span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-[16px] bg-white border border-line shadow-2xs">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span className="text-[13.5px] font-bold text-ink">
                    {stats.completedCount} bài đã hiểu
                  </span>
                </div>
              </div>

              {syncMessage && (
                <div className="p-3 rounded-[14px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-medium flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{syncMessage}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-line text-[12.5px]">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingPhone(true);
                    setPhoneInput(savedPhone);
                  }}
                  className="text-primary font-bold hover:underline cursor-pointer"
                >
                  Đổi số khác
                </button>

                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="text-red-500 hover:text-red-600 font-medium cursor-pointer"
                >
                  Ngắt kết nối
                </button>
              </div>
            </div>
          ) : (
            /* TRƯỜNG HỢP 2: CHƯA CÓ SỐ ĐIỆN THOẠI HOẶC ĐANG ĐỔI SỐ */
            <form onSubmit={handleSyncSubmit} className="flex flex-col gap-4">
              <div className="p-3.5 rounded-[18px] bg-primary-soft/40 border border-primary/15 flex items-start gap-3">
                <Sparkles size={18} className="text-primary shrink-0 mt-0.5" />
                <p className="text-[13px] text-ink/85 leading-relaxed">
                  {reason === 'bookmark'
                    ? 'Bạn đã lưu bài học vào máy! Hãy nhập số điện thoại để giữ bài trên đám mây, không bao giờ bị mất khi đổi điện thoại hoặc xóa lịch sử duyệt web.'
                    : 'Chỉ cần nhập số điện thoại, ứng dụng sẽ lưu giữ toàn bộ bài học đã lưu và tiến độ của bạn. Khi mở trên thiết bị khác, bạn chỉ cần nhập lại số này để học tiếp.'}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-ink">
                  Số điện thoại của bạn:
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => {
                      setPhoneInput(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="Ví dụ: 0988 123 456"
                    className="w-full h-12 pl-4 pr-10 rounded-[16px] bg-surface border border-line text-[16px] text-ink font-bold placeholder:text-muted placeholder:font-normal focus:bg-white focus:border-primary focus:outline-hidden transition-all shadow-inner-xs"
                    autoFocus
                  />
                  {phoneInput && (
                    <button
                      type="button"
                      onClick={() => setPhoneInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink text-[13px] font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-[14px] bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium flex items-center gap-2 animate-in fade-in">
                  <AlertCircle size={16} className="text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {syncMessage && (
                <div className="p-3 rounded-[14px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-medium flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{syncMessage}</span>
                </div>
              )}

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="submit"
                  disabled={isSyncing || !phoneInput.trim()}
                  className="flex-1 h-12 rounded-[16px] bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-[15px] font-extrabold shadow-sm active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>Lưu & Đồng bộ ngay</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (isEditingPhone) {
                      setIsEditingPhone(false);
                      setPhoneInput('');
                    } else {
                      onClose();
                    }
                  }}
                  className="h-12 px-4 rounded-[16px] bg-surface-2 hover:bg-surface-3 text-muted hover:text-ink text-[14px] font-bold transition-colors cursor-pointer"
                >
                  {isEditingPhone ? 'Hủy' : 'Để sau'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
