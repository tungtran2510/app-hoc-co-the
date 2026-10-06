'use client';

import React, { useState, useEffect } from 'react';
import { Search, Edit2, Sparkles } from 'lucide-react';
import { playTapSound } from '../lib/audioFeedback';
import { checkIsAdminClient } from '../lib/adminAuth';
import EditGreetingModal from './admin/EditGreetingModal';

interface HomeGreetingSectionProps {
  initialGreeting?: string | null;
  initialTitle?: string | null;
  initialSearchPlaceholder?: string | null;
  initialTopicsTitle?: string | null;
}

export default function HomeGreetingSection({
  initialGreeting,
  initialTitle,
  initialSearchPlaceholder,
  initialTopicsTitle,
}: HomeGreetingSectionProps) {
  const [greeting, setGreeting] = useState(
    initialGreeting && initialGreeting !== 'Xin chào!' ? initialGreeting : '“Quan điểm”'
  );
  const [title, setTitle] = useState(
    initialTitle && initialTitle !== 'Hôm nay mình học gì?' ? initialTitle : 'Hiểu đúng - Làm chuẩn'
  );
  const [searchPlaceholder, setSearchPlaceholder] = useState(
    initialSearchPlaceholder || 'Tìm bài, ví dụ: đĩa đệm'
  );
  const [topicsTitle, setTopicsTitle] = useState(initialTopicsTitle || 'Chọn chủ đề');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    checkIsAdminClient().then(setIsAdmin);
    if (initialGreeting && initialGreeting !== 'Xin chào!') {
      setGreeting(initialGreeting);
    } else {
      setGreeting('“Quan điểm”');
    }
    if (initialTitle && initialTitle !== 'Hôm nay mình học gì?') {
      setTitle(initialTitle);
    } else {
      setTitle('Hiểu đúng - Làm chuẩn');
    }
    if (initialSearchPlaceholder) setSearchPlaceholder(initialSearchPlaceholder);
    if (initialTopicsTitle) setTopicsTitle(initialTopicsTitle);
  }, [initialGreeting, initialTitle, initialSearchPlaceholder, initialTopicsTitle]);

  return (
    <>
      {/* 2. "Quan điểm" & Tiêu đề chính "Hiểu đúng - Làm chuẩn" */}
      <section className="flex flex-col gap-1 relative group mt-0.5">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-purple-950/60 border border-amber-300/80 dark:border-purple-800/50 text-amber-900 dark:text-[#F8DF7B] text-[11.5px] font-black uppercase tracking-wider w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>{greeting || 'Hiểu đúng'}</span>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-1 h-6 px-2 rounded-[7px] bg-primary-soft text-primary text-[11px] font-extrabold hover:bg-primary-soft/80 cursor-pointer shadow-2xs transition-all"
              title="Chỉnh sửa câu chào, tiêu đề & ô tìm kiếm"
            >
              <Edit2 size={11} />
              <span>Sửa</span>
            </button>
          )}
        </div>

        <h1 className="text-[25px] sm:text-[28px] font-black text-ink leading-tight tracking-tight break-words mt-0.5">
          {title || 'Hiểu đúng - Làm chuẩn'}
        </h1>
      </section>

      {/* 3. Khung Tìm kiếm kết hợp Nút Hỏi AI */}
      <section>
        <div className="w-full h-[52px] sm:h-[56px] rounded-full sm:rounded-[22px] bg-white dark:bg-[#160D30] border border-line dark:border-purple-800/40 pl-4 pr-1.5 flex items-center justify-between gap-2 shadow-xs hover:border-purple-400 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 dark:focus-within:ring-purple-900/30 transition-all">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <Search size={19} className="text-muted shrink-0" />
            <input
              id="home-search-input"
              type="text"
              placeholder={searchPlaceholder || 'Tìm bài, ví dụ: đĩa đệm'}
              className="w-full bg-transparent border-none outline-none text-[14.5px] text-ink placeholder:text-muted"
            />
          </div>

          <a
            href="/tro-ly-ai"
            onClick={playTapSound}
            className="shrink-0 flex items-center gap-1 px-3.5 py-2 rounded-full bg-primary-soft dark:bg-purple-950/80 hover:bg-purple-100 dark:hover:bg-purple-900 text-primary dark:text-[#F8DF7B] text-[13px] font-extrabold border border-primary/25/60 dark:border-purple-800/40 shadow-2xs transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            aria-label="Hỏi Trợ lý AI"
          >
            <Sparkles size={14} className="text-amber-500" />
            <span>Hỏi AI</span>
            <span>→</span>
          </a>
        </div>

        {isAdmin && (
          <div className="flex items-center justify-between px-1.5 pt-1.5">
            <span className="text-[11.5px] text-muted flex items-center gap-1 font-medium">
              <Sparkles size={12} className="text-amber-600 dark:text-amber-400" />
              <span>Trợ lý AI sẵn sàng</span>
            </span>
            <a
              href="/tro-ly-ai"
              onClick={playTapSound}
              className="flex items-center gap-1 text-[11.5px] font-bold text-amber-600 hover:underline cursor-pointer dark:text-amber-400"
            >
              <span>Huấn luyện & Nạp tài liệu AI →</span>
            </a>
          </div>
        )}
      </section>

      {/* Modal sửa tiêu đề dành cho Admin */}
      {showEditModal && (
        <EditGreetingModal
          isOpen={true}
          initialGreeting={greeting}
          initialTitle={title}
          initialSearchPlaceholder={searchPlaceholder}
          initialTopicsTitle={topicsTitle}
          onClose={() => setShowEditModal(false)}
          onSaved={(data) => {
            setGreeting(data.greeting);
            setTitle(data.title);
            setSearchPlaceholder(data.searchPlaceholder);
            setTopicsTitle(data.topicsTitle);
            // Bắn sự kiện cập nhật để các phần khác nếu cần có thể lắng nghe
            if (typeof window !== 'undefined') {
              window.dispatchEvent(
                new CustomEvent('home_texts_updated', { detail: data })
              );
            }
          }}
        />
      )}
    </>
  );
}
