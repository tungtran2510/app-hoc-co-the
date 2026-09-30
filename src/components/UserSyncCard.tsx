'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  RefreshCw,
  Phone,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import {
  getUserPhone,
  syncUserProgress,
  clearUserPhone,
  LEARNING_PROGRESS_EVENT,
} from '../lib/userSync';
import { getSavedPages, getCompletedPages } from '../lib/learningProgress';

interface UserSyncCardProps {
  onSyncSuccess?: () => void;
  compact?: boolean;
}

export default function UserSyncCard({ onSyncSuccess, compact = false }: UserSyncCardProps) {
  const [savedPhone, setSavedPhone] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [stats, setStats] = useState({ savedCount: 0, completedCount: 0 });
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const refreshLocalStats = () => {
    try {
      const saved = getSavedPages();
      const completed = getCompletedPages();
      setStats({
        savedCount: saved.length,
        completedCount: completed.length,
      });
    } catch {
      // Bỏ qua
    }
  };

  useEffect(() => {
    const p = getUserPhone();
    setSavedPhone(p);
    refreshLocalStats();

    const handleUpdate = () => {
      refreshLocalStats();
    };

    window.addEventListener(LEARNING_PROGRESS_EVENT, handleUpdate);
    window.addEventListener('learning_progress_changed', handleUpdate);
    return () => {
      window.removeEventListener(LEARNING_PROGRESS_EVENT, handleUpdate);
      window.removeEventListener('learning_progress_changed', handleUpdate);
    };
  }, []);

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
        setSyncMessage('Đã đồng bộ thành công! Bài học và tiến độ đã được cập nhật.');
        refreshLocalStats();
        if (onSyncSuccess) onSyncSuccess();
        setTimeout(() => setSyncMessage(''), 4000);
      } else {
        setErrorMessage(res.error || 'Chưa thể đồng bộ lúc này, vui lòng thử lại.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi kết nối khi đồng bộ dữ liệu.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleManualRefresh = async () => {
    if (!savedPhone || isSyncing) return;
    try {
      setIsSyncing(true);
      setErrorMessage('');
      const res = await syncUserProgress(savedPhone, 'sync');
      if (res.success) {
        setSyncMessage('Đã đồng bộ mới nhất từ máy chủ');
        refreshLocalStats();
        if (onSyncSuccess) onSyncSuccess();
        setTimeout(() => setSyncMessage(''), 3000);
      } else {
        setErrorMessage(res.error || 'Chưa đồng bộ được');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = () => {
    if (!confirm('Bạn có chắc chắn muốn ngắt kết nối số điện thoại này khỏi thiết bị? (Dữ liệu trên máy chủ vẫn được giữ nguyên)')) {
      return;
    }
    clearUserPhone();
    setSavedPhone(null);
    setIsEditingPhone(false);
    setPhoneInput('');
    setSyncMessage('Đã ngắt liên kết số điện thoại.');
    setTimeout(() => setSyncMessage(''), 3000);
  };

  // Format số điện thoại hiển thị đẹp mắt (ví dụ: 0988 123 456)
  const formatPhone = (phone: string) => {
    const c = phone.replace(/[^0-9]/g, '');
    if (c.length === 10) {
      return `${c.slice(0, 4)} ${c.slice(4, 7)} ${c.slice(7)}`;
    }
    return phone;
  };

  // 1. ĐÃ LIÊN KẾT SỐ ĐIỆN THOẠI
  if (savedPhone && !isEditingPhone) {
    return (
      <div className="p-4 sm:p-5 rounded-[22px] bg-linear-to-br from-primary-soft/50 via-white to-surface-2 border border-primary/25 shadow-xs flex flex-col gap-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
              <Smartphone size={20} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-extrabold uppercase text-primary tracking-wider">
                  Lịch sử học tập
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Đang đồng bộ tự động" />
              </div>
              <span className="text-[18px] font-extrabold text-ink leading-tight tracking-wide">
                {formatPhone(savedPhone)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isSyncing}
            className="flex items-center gap-1 h-8 px-2.5 rounded-[10px] bg-white border border-line text-ink hover:text-primary text-[12px] font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
            title="Đồng bộ lại dữ liệu mới nhất"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin text-primary' : ''} />
            <span>{isSyncing ? 'Đang tải...' : 'Đồng bộ'}</span>
          </button>
        </div>

        {/* Thông tin thống kê đã lưu */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-line/60">
          <div className="flex items-center gap-2 p-2 px-3 rounded-[12px] bg-white/70 border border-line/60">
            <Bookmark size={15} className="text-primary shrink-0" />
            <span className="text-[13px] text-ink font-bold">
              {stats.savedCount} bài đã lưu
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 px-3 rounded-[12px] bg-white/70 border border-line/60">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
            <span className="text-[13px] text-ink font-bold">
              {stats.completedCount} bài đã hiểu
            </span>
          </div>
        </div>

        {/* Thông báo kết quả */}
        {syncMessage && (
          <div className="p-2.5 rounded-[12px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="p-2.5 rounded-[12px] bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium flex items-center gap-2 animate-in fade-in">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Chân thẻ: Giải thích & Nút đổi số */}
        <div className="flex items-center justify-between pt-1 text-[12px] text-muted">
          <span>Tự động nhớ bài khi đổi thiết bị</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIsEditingPhone(true);
                setPhoneInput(savedPhone);
              }}
              className="text-primary font-bold hover:underline cursor-pointer"
            >
              Đổi số
            </button>
            <button
              type="button"
              onClick={handleDisconnect}
              className="text-muted hover:text-red-600 transition-colors cursor-pointer"
              title="Ngắt liên kết số này trên máy này"
            >
              Ngắt liên kết
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. CHƯA LIÊN KẾT HOẶC ĐANG ĐỔI SỐ
  return (
    <div className="p-4 sm:p-5 rounded-[24px] bg-white border border-line shadow-xs flex flex-col gap-3.5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-[16px] bg-primary-soft text-primary flex items-center justify-center shrink-0 shadow-2xs">
          <Smartphone size={22} strokeWidth={2.2} />
        </div>
        <div className="flex flex-col">
          <h3 className="text-[17px] font-extrabold text-ink leading-tight">
            Lưu bài học qua Số điện thoại
          </h3>
          <p className="text-[13px] text-muted leading-tight">
            Nhớ bài đã học khi đổi máy hoặc sang thiết bị khác
          </p>
        </div>
      </div>

      <p className="text-[13.5px] text-ink/80 leading-relaxed font-normal">
        Chỉ cần nhập số điện thoại, ứng dụng sẽ lưu giữ toàn bộ bài học bạn đã đánh dấu, bài đã hiểu và tiến độ xem video. Khi mở trên điện thoại khác, bạn chỉ cần nhập lại số này để tiếp tục.
      </p>

      {/* Form nhập số điện thoại */}
      <form onSubmit={handleSyncSubmit} className="flex flex-col gap-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-muted">
              <Phone size={17} />
            </div>
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="Nhập số điện thoại (ví dụ: 0988 123 456)"
              className="w-full h-11 pl-10 pr-3.5 rounded-[14px] bg-surface-2 border border-line text-[15px] font-bold text-ink placeholder:text-muted/70 focus:outline-hidden focus:border-primary focus:bg-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSyncing || !phoneInput.trim()}
            className="h-11 px-5 rounded-[14px] bg-primary text-white font-extrabold text-[14px] shadow-sm hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            {isSyncing ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Đang đồng bộ...</span>
              </>
            ) : (
              <>
                <span>Lưu & Đồng bộ</span>
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>

        {isEditingPhone && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsEditingPhone(false)}
              className="text-[12px] text-muted hover:text-ink font-medium underline"
            >
              Hủy đổi số
            </button>
          </div>
        )}
      </form>

      {/* Thông báo lỗi & thành công */}
      {errorMessage && (
        <div className="p-3 rounded-[12px] bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium flex items-center gap-2 animate-in fade-in">
          <AlertCircle size={16} className="text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {syncMessage && (
        <div className="p-3 rounded-[12px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}
    </div>
  );
}
