'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Smartphone, ChevronRight } from 'lucide-react';
import ContinueCard from './ContinueCard';
import { getStoredXemTiep, XemTiepInfo } from '../lib/learningProgress';
import { getUserPhone, LEARNING_PROGRESS_EVENT, syncUserProgress } from '../lib/userSync';

export default function HomeContinueSection() {
  const [continueInfo, setContinueInfo] = useState<XemTiepInfo | null>(null);
  const [hasPhone, setHasPhone] = useState(false);

  const updateFromLocal = () => {
    try {
      const data = getStoredXemTiep();
      if (data && data.topic_slug && data.page_slug) {
        setContinueInfo(data);
      } else {
        setContinueInfo(null);
      }
    } catch {
      setContinueInfo(null);
    }
  };

  useEffect(() => {
    const phone = getUserPhone();
    setHasPhone(Boolean(phone));
    updateFromLocal();

    if (phone) {
      syncUserProgress(phone, 'sync').then((res) => {
        if (res.success) {
          updateFromLocal();
        }
      });
    }

    const handleUpdate = () => {
      updateFromLocal();
      setHasPhone(Boolean(getUserPhone()));
    };

    window.addEventListener(LEARNING_PROGRESS_EVENT, handleUpdate);
    window.addEventListener('learning_progress_changed', handleUpdate);
    return () => {
      window.removeEventListener(LEARNING_PROGRESS_EVENT, handleUpdate);
      window.removeEventListener('learning_progress_changed', handleUpdate);
    };
  }, []);

  if (continueInfo) {
    return (
      <section>
        <ContinueCard info={continueInfo} />
      </section>
    );
  }

  // Nếu chưa có bài đang học dở và chưa liên kết số điện thoại, gợi ý nhẹ nhàng
  if (!hasPhone) {
    return (
      <section>
        <Link
          href="/da-luu"
          className="flex items-center justify-between p-3.5 px-4 rounded-[18px] bg-white border border-line shadow-2xs hover:border-primary/40 active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-[10px] bg-primary-soft text-primary flex items-center justify-center shrink-0">
              <Smartphone size={16} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-ink truncate">
                Đã học trên điện thoại hoặc máy khác?
              </span>
              <span className="text-[11.5px] text-muted truncate">
                Nhập số điện thoại để tiếp tục bài học và xem bài đã lưu
              </span>
            </div>
          </div>
          <ChevronRight size={18} className="text-muted group-hover:text-primary transition-colors shrink-0 ml-2" />
        </Link>
      </section>
    );
  }

  return null;
}
