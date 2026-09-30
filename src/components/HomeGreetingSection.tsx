'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Edit2 } from 'lucide-react';
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

      {/* 3. Ô tìm kiếm */}
      <section>
        <Link
          href="/tim-kiem"
          className="relative block w-full group cursor-pointer"
          aria-label="Mở trang tìm kiếm"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted">
            <Search size={22} />
          </div>
          <input
            type="text"
            readOnly
            placeholder={searchPlaceholder}
            className="w-full h-[58px] min-h-[48px] pl-12 pr-4 rounded-[20px] bg-white border-[1.5px] border-line text-[17px] text-ink placeholder:text-muted focus:outline-hidden cursor-pointer shadow-2xs group-hover:border-primary/50 transition-colors"
            tabIndex={-1}
          />
        </Link>
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
