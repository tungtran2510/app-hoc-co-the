'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Bookmark, Trash2, ChevronRight, BookOpen } from 'lucide-react';
import { getSavedPages, SavedPageInfo, toggleSavePage } from '../../lib/learningProgress';
import { getUserPhone, syncUserProgress, LEARNING_PROGRESS_EVENT } from '../../lib/userSync';
import UserSyncCard from '../../components/UserSyncCard';
import BottomNav from '../../components/BottomNav';

export default function SavedPages() {
  const [savedList, setSavedList] = useState<SavedPageInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshList = () => {
    try {
      const list = getSavedPages();
      setSavedList(list);
    } catch {
      setSavedList([]);
    }
  };

  useEffect(() => {
    refreshList();
    setIsLoading(false);

    // Nếu đã có số điện thoại lưu từ trước, tự động tải mới từ máy chủ
    const phone = getUserPhone();
    if (phone) {
      syncUserProgress(phone, 'sync').then((res) => {
        if (res.success) {
          refreshList();
        }
      });
    }

    const handleUpdate = () => {
      refreshList();
    };

    window.addEventListener(LEARNING_PROGRESS_EVENT, handleUpdate);
    window.addEventListener('learning_progress_changed', handleUpdate);
    return () => {
      window.removeEventListener(LEARNING_PROGRESS_EVENT, handleUpdate);
      window.removeEventListener('learning_progress_changed', handleUpdate);
    };
  }, []);

  const handleRemove = (e: React.MouseEvent, page: SavedPageInfo) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavePage(page);
    refreshList();
  };

  return (
    <main className="flex-1 flex flex-col px-5 pt-4 pb-28 gap-6">
      {/* 1. Header */}
      <header className="flex items-center justify-between h-[52px]">
        <Link
          href="/"
          className="flex items-center gap-1 text-primary text-[18px] font-bold min-h-[48px] pr-2 transition-opacity active:opacity-75"
          aria-label="Quay lại trang chủ"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
          <span>Trang chủ</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <Bookmark size={20} className="text-primary fill-primary" />
          <span className="text-[17px] font-extrabold text-ink">Đã lưu</span>
        </div>
      </header>

      {/* 2. Tiêu đề */}
      <section className="flex flex-col gap-1">
        <h1 className="text-[28px] font-extrabold text-ink leading-[1.2]">
          Bài học đã lưu
        </h1>
        <p className="text-[15px] text-muted">
          {savedList.length > 0
            ? `${savedList.length} bài học bạn đã đánh dấu để xem lại`
            : 'Lưu các bài học quan trọng để mở xem lại nhanh'}
        </p>
      </section>

      {/* 2.5. Khối đồng bộ & lưu tiến độ theo số điện thoại */}
      <UserSyncCard onSyncSuccess={refreshList} />

      {/* 3. Danh sách bài đã lưu */}
      {isLoading ? (
        <div className="p-8 text-center bg-white rounded-[22px] border border-line">
          <p className="text-[16px] text-muted font-medium">Đang tải...</p>
        </div>
      ) : savedList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-[24px] border border-line text-center gap-4 my-2 shadow-2xs">
          <div className="w-16 h-16 rounded-[20px] bg-primary-soft text-primary flex items-center justify-center">
            <Bookmark size={30} strokeWidth={2} />
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[20px] font-extrabold text-ink">
              Chưa có bài học nào được lưu
            </h2>
            <p className="text-[15px] text-muted max-w-[300px] leading-relaxed">
              Khi đang xem một bài học, hãy bấm biểu tượng Lưu ở góc trên để đánh dấu bài học đó vào đây.
            </p>
          </div>
          <Link
            href="/cot-song"
            className="flex items-center justify-center gap-2 h-[52px] min-h-[48px] px-6 rounded-[16px] bg-primary text-white font-extrabold text-[16px] shadow-sm active:scale-[0.98] transition-transform"
          >
            <BookOpen size={18} />
            <span>Khám phá chủ đề Cột sống</span>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {savedList.map((item) => (
            <div
              key={item.page_id}
              className="relative flex items-center justify-between p-4 bg-white rounded-[22px] border border-line shadow-xs group transition-all"
            >
              <Link
                href={`/${item.topic_slug}/${item.page_slug}`}
                className="flex items-center gap-3.5 flex-1 min-w-0 pr-2"
              >
                <div className="w-12 h-12 rounded-[14px] bg-primary-soft text-primary flex items-center justify-center font-extrabold text-[18px] shrink-0">
                  {String(item.page_number).padStart(2, '0')}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-extrabold text-primary uppercase tracking-wide truncate">
                    {item.topic_title}
                  </span>
                  <h3 className="text-[17px] font-extrabold text-ink leading-snug break-words">
                    {item.page_title}
                  </h3>
                </div>
              </Link>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, item)}
                  className="w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Bỏ lưu bài này"
                  title="Bỏ lưu"
                >
                  <Trash2 size={18} />
                </button>
                <Link
                  href={`/${item.topic_slug}/${item.page_slug}`}
                  className="w-8 h-8 flex items-center justify-center text-muted"
                  aria-label="Mở bài học"
                >
                  <ChevronRight size={20} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Thanh điều hướng dưới cùng */}
      <BottomNav />
    </main>
  );
}
