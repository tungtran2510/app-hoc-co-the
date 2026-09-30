'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Topic, Page, Block } from '../lib/types';
import PageHeaderBar, { TocItem } from './PageHeaderBar';
import BlockRenderer from './BlockRenderer';

interface ContentViewerProps {
  topic: Topic;
  page: Page;
  pageIndex: number;
  totalPages: number;
  blocks: Block[];
  nextPage: Page | null;
  nextPageIndex: number | null;
  defaultActiveVideoIndex?: number;
}

export default function ContentViewer({
  topic,
  page,
  pageIndex,
  totalPages,
  blocks,
  nextPage,
  nextPageIndex,
  defaultActiveVideoIndex = 0,
}: ContentViewerProps) {
  const [fontSizeMode, setFontSizeMode] = useState<'normal' | 'large'>('normal');

  // Đọc cỡ chữ từ localStorage khi tải trang
  useEffect(() => {
    try {
      const saved = localStorage.getItem('co_chu');
      if (saved === 'large' || saved === 'lon') {
        setFontSizeMode('large');
      } else if (saved === 'normal' || saved === 'vua') {
        setFontSizeMode('normal');
      }
    } catch {
      // Bỏ qua lỗi truy cập storage
    }
  }, []);

  const handleFontSizeChange = (mode: 'normal' | 'large') => {
    setFontSizeMode(mode);
    try {
      localStorage.setItem('co_chu', mode);
    } catch {
      // Bỏ qua lỗi ghi storage
    }
  };

  // Tạo danh sách mục lục từ các khối có nhãn
  const tocItems: TocItem[] = blocks
    .map((block) => {
      if (block.type === 'videos') {
        return { id: block.id, label: 'Danh sách video' };
      }
      if (block.type === 'text') {
        switch (block.display_style) {
          case 'y_nghia':
            return { id: block.id, label: 'Ý nghĩa' };
          case 'diem_can_nho':
            return { id: block.id, label: 'Điểm cần nhớ' };
          case 'chu_y':
            return { id: block.id, label: 'Chú ý' };
          case 'sai_lam':
            return { id: block.id, label: 'Sai lầm thường gặp' };
          case 'giai_phap':
            return { id: block.id, label: 'Giải pháp' };
          default:
            return null;
        }
      }
      if (block.type === 'links' && block.display_style === 'related') {
        return { id: block.id, label: 'Bài liên quan' };
      }
      if (block.type === 'files') {
        return { id: block.id, label: 'Tài liệu' };
      }
      if (block.type === 'images') {
        return { id: block.id, label: 'Hình ảnh' };
      }
      return null;
    })
    .filter((item): item is TocItem => item !== null);

  const formattedOrder = String(pageIndex).padStart(2, '0');

  return (
    <main className="flex-1 flex flex-col px-5 pt-2 pb-16 gap-5">
      {/* Thanh đầu trang: ‹ [Tên chủ đề] + [Mục lục] + [⋮] */}
      <PageHeaderBar
        topicTitle={topic.title}
        topicSlug={topic.slug}
        tocItems={tocItems}
        fontSizeMode={fontSizeMode}
        onFontSizeChange={handleFontSizeChange}
      />

      {/* Phần đầu bài viết: Dòng nhỏ CỘT SỐNG · 01 + Tiêu đề lớn */}
      <section className="flex flex-col gap-1.5 mt-1">
        <span className="text-[15px] font-extrabold tracking-[0.5px] uppercase text-muted">
          {topic.title.toUpperCase()} · {formattedOrder}
        </span>
        <h1 className="text-[30px] font-extrabold text-ink leading-[1.2]">
          {page.title}
        </h1>
      </section>

      {/* Danh sách các khối */}
      <div className="flex flex-col gap-4">
        {blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            fontSizeMode={fontSizeMode}
            defaultActiveVideoIndex={defaultActiveVideoIndex}
          />
        ))}
      </div>

      {/* Cuối trang: Gợi ý theo lộ trình + Nút Tiếp theo */}
      <section className="flex flex-col gap-2 mt-6 pt-4 border-t border-line/60">
        <p className="text-[16px] text-muted font-medium">
          Gợi ý theo lộ trình
        </p>

        {nextPage ? (
          <Link
            href={`/${topic.slug}/${nextPage.slug}`}
            className="flex items-center justify-center gap-2.5 h-[64px] min-h-[48px] w-full rounded-[18px] bg-primary text-white font-extrabold text-[20px] transition-transform active:scale-[0.98] shadow-sm"
          >
            <span>
              Tiếp theo: {String(nextPageIndex).padStart(2, '0')} {nextPage.title}
            </span>
            <ArrowRight size={22} strokeWidth={2.5} />
          </Link>
        ) : (
          <Link
            href={`/${topic.slug}`}
            className="flex items-center justify-center gap-2.5 h-[64px] min-h-[48px] w-full rounded-[18px] bg-primary text-white font-extrabold text-[20px] transition-transform active:scale-[0.98] shadow-sm"
          >
            <span>Về danh sách {topic.title}</span>
            <ArrowRight size={22} strokeWidth={2.5} />
          </Link>
        )}
      </section>
    </main>
  );
}
