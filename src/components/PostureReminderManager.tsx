'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Check, X, Droplets, Activity } from 'lucide-react';
import { getStoredAppSettings } from '../lib/storage';
import { playTapSound } from '../lib/audioFeedback';

export default function PostureReminderManager() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string }>({
    title: 'Giờ giải nén đĩa đệm & Cân bằng tế bào',
    desc: 'Hãy đứng dậy vươn vai 1 phút và uống một ngụm nước ấm để nuôi dưỡng đĩa đệm nhé!',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkReminder = () => {
      const settings = getStoredAppSettings();
      if (settings.posture_reminder_enabled === false) return;

      const intervalMinutes = settings.posture_reminder_interval || 60;
      const intervalMs = intervalMinutes * 60 * 1000;

      const lastPromptTime = localStorage.getItem('qbiz_last_posture_reminder');
      const now = Date.now();

      if (!lastPromptTime || now - Number(lastPromptTime) >= intervalMs) {
        // Luân phiên các mẹo sức khỏe thiết thực
        const tips = [
          {
            title: 'Giờ giải nén đĩa đệm & Vận động',
            desc: 'Hãy đứng dậy vươn vai 1 phút và ngửa nhẹ người để giải tỏa áp lực đĩa đệm thắt lưng nhé!',
          },
          {
            title: 'Cân bằng tế bào & Nước ấm',
            desc: 'Uống một ngụm nước ấm nhỏ để kích hoạt tuần hoàn máu và bù ẩm cho các đĩa đệm.',
          },
          {
            title: 'Thư giãn cổ & Mắt',
            desc: 'Nhìn xa 20 mét trong 20 giây và xoay nhẹ khớp cổ để giảm áp lực đốt sống C1-C7.',
          },
        ];
        const selected = tips[Math.floor(Math.random() * tips.length)];
        setToastMessage(selected);
        setShowToast(true);
        localStorage.setItem('qbiz_last_posture_reminder', String(now));
      }
    };

    // Kiểm tra sau 20 giây đầu tiên và định kỳ mỗi 5 phút
    const initialTimer = setTimeout(checkReminder, 20000);
    const periodicTimer = setInterval(checkReminder, 5 * 60 * 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(periodicTimer);
    };
  }, []);

  const handleDismiss = () => {
    playTapSound();
    setShowToast(false);
  };

  if (!showToast) return null;

  return (
    <aside
      role="alert"
      aria-label="Nhắc nhở sức khỏe định kỳ"
      className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[370px] rounded-[16px] bg-gradient-to-r from-teal-900/95 via-emerald-900/95 to-slate-900/95 text-white p-3 shadow-xl border border-teal-500/40 backdrop-blur-md animate-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-[9px] bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-400/30 mt-0.5">
            <Droplets size={15} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-black text-teal-200 tracking-tight leading-snug">
              {toastMessage.title}
            </span>
            <p className="text-[11px] text-slate-200 leading-snug mt-0.5">
              {toastMessage.desc}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-full shrink-0"
        >
          <X size={14} />
        </button>
      </div>

      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-end">
        <button
          type="button"
          onClick={handleDismiss}
          className="h-7 px-3 rounded-[8px] bg-teal-500 text-[#04211A] text-[11px] font-black flex items-center gap-1 shadow-2xs hover:bg-teal-400 active:scale-95 transition-all"
        >
          <Check size={12} strokeWidth={3} />
          <span>Đã thực hiện ✓</span>
        </button>
      </div>
    </aside>
  );
}
