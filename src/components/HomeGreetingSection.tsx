'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Edit2, Sparkles } from 'lucide-react';
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
  const [greeting, setGreeting] = useState(initialGreeting || 'Xin chào!');
  const [title, setTitle] = useState(initialTitle || 'Hôm nay mình học gì?');
  const [searchPlaceholder, setSearchPlaceholder] = useState(
    initialSearchPlaceholder || 'Tìm bài, ví dụ: đĩa đệm'
  );
  const [topicsTitle, setTopicsTitle] = useState(initialTopicsTitle || 'Chọn chủ đề');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    checkIsAdminClient().then(setIsAdmin);
    if (initialGreeting) setGreeting(initialGreeting);
    if (initialTitle) setTitle(initialTitle);
    if (initialSearchPlaceholder) setSearchPlaceholder(initialSearchPlaceholder);
    if (initialTopicsTitle) setTopicsTitle(initialTopicsTitle);
  }, [initialGreeting, initialTitle, initialSearchPlaceholder, initialTopicsTitle]);

  return (
    <>
      {/* 2. Lời chào + Tiêu đề chính + Nút sửa cho Quản trị viên */}
      <section className="flex flex-col gap-1 relative group">
        <div className="flex items-center justify-between">
          <span className="text-[16px] text-muted font-normal leading-normal">
            {greeting}
          </span>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-1.5 h-7 px-2.5 rounded-[8px] bg-primary-soft text-primary text-[12px] font-extrabold hover:bg-primary-soft/80 cursor-pointer shadow-2xs transition-all"
              title="Chỉnh sửa câu chào, tiêu đề & ô tìm kiếm"
            >
              <Edit2 size={12} />
              <span>Sửa lời chào</span>
            </button>
          )}
        </div>

        <h1 className="text-[28px] font-extrabold text-ink leading-[1.2] break-words">
          {title}
        </h1>
      </section>

      {/* 3. Ô Hỏi Trợ lý AI & Tìm kiếm thông minh */}
      <section>
        <Link
          href="/tro-ly-ai"
          className="relative block w-full group cursor-pointer"
          aria-label="Mở Trợ lý AI Cơ Thể"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-primary">
            <Sparkles size={22} className="animate-pulse" />
          </div>
          <input
            type="text"
            readOnly
            placeholder={searchPlaceholder || 'Hỏi Trợ lý AI về cơ thể, bài học...'}
            className="w-full h-[58px] min-h-[48px] pl-12 pr-24 rounded-[20px] bg-white border-[1.5px] border-line text-[16px] text-ink placeholder:text-muted focus:outline-hidden cursor-pointer shadow-2xs group-hover:border-primary/50 transition-colors"
            tabIndex={-1}
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-[12px] bg-primary-soft text-primary text-[12px] font-extrabold shadow-2xs group-hover:bg-primary group-hover:text-white transition-colors">
              <span>Hỏi AI</span>
              <span>→</span>
            </span>
          </div>
        </Link>
        {isAdmin && (
          <div className="flex items-center justify-between px-1.5 pt-1.5">
            <span className="text-[12px] text-muted flex items-center gap-1 font-medium">
              <Sparkles size={12} className="text-primary" />
              <span>Trợ lý AI sẵn sàng</span>
            </span>
            <Link
              href="/tro-ly-ai"
              className="flex items-center gap-1 text-[12px] font-bold text-primary hover:underline cursor-pointer"
            >
              <span>Huấn luyện & Nạp tài liệu AI →</span>
            </Link>
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
