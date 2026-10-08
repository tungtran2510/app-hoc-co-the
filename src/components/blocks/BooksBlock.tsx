'use client';

import React, { useState } from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { RecommendedBook } from '../../lib/types';
import ModernBookCover from '../ModernBookCover';
import dynamic from 'next/dynamic';
const FlipbookViewer = dynamic(() => import('../FlipbookViewer'), { ssr: false });
import BookDetailModal from '../BookDetailModal';
import LongPressSave from '../LongPressSave';
import { usePathname } from 'next/navigation';

interface BooksBlockProps {
  blockId: string;
  displayStyle?: string;
  title?: string;
  books: RecommendedBook[];
  isAdmin?: boolean;
}

const FALLBACK_COVER = '/images/lessons/tong-quan-ve-cot-song.png';


export default function BooksBlock({ blockId, displayStyle = 'list', title, books, isAdmin = false }: BooksBlockProps) {
  const [selectedBook, setSelectedBook] = useState<RecommendedBook | null>(null);
  const [previewBook, setPreviewBook] = useState<RecommendedBook | null>(null);

  const visible = (books || []).filter((b) => isAdmin || b.is_visible !== false);

  const pathname = usePathname() || '/';
  // Giữ lâu vào cuốn sách để lưu vào mục Đã lưu (mở lại sẽ về đúng trang chứa sách)
  const bookItem = (book: RecommendedBook) => ({
    page_id: `book:${book.id || book.title}`,
    kind: 'book' as const,
    topic_slug: '',
    topic_title: 'Sách',
    page_slug: '',
    page_title: book.title,
    page_number: 0,
    href: `#`,
    thumb: book.cover_url || null,
    subtitle: book.author || '',
  });

  const previewButton = (book: RecommendedBook, compact = false) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setPreviewBook(book);
      }}
      className={`w-full ${compact ? 'h-[34px] text-[12px]' : 'h-[38px] text-[12.5px]'} rounded-full bg-gradient-to-r from-[#FFE36C] to-[#FFC400] text-[#071735] font-black shadow-[0_7px_18px_-10px_rgba(245,158,11,.85)] flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer border border-[#FFD52F]`}
      title="Xem thử 3D"
    >
      <BookOpen size={13} strokeWidth={2.2} className="shrink-0" />
      <span className="tracking-wide">Xem thử 3D</span>
    </button>
  );

  const detailLink = (book: RecommendedBook) => (
    <span
      onClick={() => setSelectedBook(book)}
      className="text-[11.5px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white inline-flex items-center gap-0.5 cursor-pointer"
    >
      <span>Chi tiết sách</span>
      <ChevronRight size={11} strokeWidth={2} />
    </span>
  );

  const hiddenBadge = (book: RecommendedBook) =>
    isAdmin && book.is_visible === false ? (
      <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-amber-300 text-[9px] font-bold">Ẩn</div>
    ) : null;

  const cover = (book: RecommendedBook, idx: number) => (
    <ModernBookCover
      title={book.title}
      coverUrl={book.cover_url || FALLBACK_COVER}
      author={book.author || 'Tùng Dinh Dưỡng'}
      badgeText={book.badge_tag}
      index={idx}
    />
  );

  let content: React.ReactNode;

  if (visible.length === 0) {
    content = <div className="p-6 text-center text-[13px] text-slate-400">Chưa có cuốn sách nào trong khối này.</div>;
  } else if (displayStyle === 'grid') {
    content = (
      <div className="grid grid-cols-2 gap-3">
        {visible.map((book, idx) => (
          <LongPressSave key={book.id || idx} className="contents" item={bookItem(book)}>
          <div
            key={book.id || idx}
            className={`flex flex-col rounded-[18px] border border-slate-200/70 bg-white dark:bg-[#1A1236] dark:border-white/10 p-2.5 pb-3 shadow-[0_10px_28px_-20px_rgba(15,23,42,.45)] ${
              book.is_visible === false ? 'opacity-60 ring-2 ring-dashed ring-amber-400' : ''
            }`}
          >
            <div onClick={() => setSelectedBook(book)} className="w-full aspect-[3/4] cursor-pointer relative">
              {cover(book, idx)}
              {hiddenBadge(book)}
            </div>
            <h3
              onClick={() => setSelectedBook(book)}
              className="pt-1.5 text-[13px] font-bold text-center text-[#071735] dark:text-white leading-snug line-clamp-2 min-h-[36px] flex items-center justify-center cursor-pointer"
            >
              {book.title}
            </h3>
            <div className="mt-2">{previewButton(book, true)}</div>
          </div>
          </LongPressSave>
        ))}
      </div>
    );
  } else if (displayStyle === 'feature') {
    content = (
      <div className="flex flex-col gap-4">
        {visible.map((book, idx) => (
          <LongPressSave key={book.id || idx} className="contents" item={bookItem(book)}>
          <div
            key={book.id || idx}
            className={`flex flex-col items-center gap-3 rounded-[22px] border border-slate-200/70 bg-white dark:bg-[#1A1236] dark:border-white/10 p-4 shadow-[0_14px_34px_-22px_rgba(15,23,42,.5)] ${
              book.is_visible === false ? 'opacity-60 ring-2 ring-dashed ring-amber-400' : ''
            }`}
          >
            <div onClick={() => setSelectedBook(book)} className="w-[62%] max-w-[240px] aspect-[3/4] cursor-pointer relative">
              {cover(book, idx)}
              {hiddenBadge(book)}
            </div>
            <h3 className="text-[16px] font-black text-center text-[#071735] dark:text-white leading-snug">{book.title}</h3>
            {book.description && (
              <p className="text-[12.5px] text-center text-slate-500 dark:text-slate-300 leading-relaxed line-clamp-3">{book.description}</p>
            )}
            <div className="w-full">{previewButton(book)}</div>
            {detailLink(book)}
          </div>
          </LongPressSave>
        ))}
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col gap-3">
        {visible.map((book, idx) => (
          <LongPressSave key={book.id || idx} className="contents" item={bookItem(book)}>
          <div
            key={book.id || idx}
            className={`flex flex-row gap-3.5 items-stretch p-3 rounded-[16px] bg-slate-50/80 dark:bg-[#1E293B]/50 border border-slate-200/60 dark:border-white/10 ${
              book.is_visible === false ? 'opacity-60 ring-2 ring-dashed ring-amber-400' : ''
            }`}
          >
            <div onClick={() => setSelectedBook(book)} className="w-[96px] aspect-[3/4] shrink-0 cursor-pointer relative">
              {cover(book, idx)}
              {hiddenBadge(book)}
            </div>
            <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
              <div className="flex flex-col gap-1">
                <h3
                  onClick={() => setSelectedBook(book)}
                  className="text-[15px] font-bold text-ink dark:text-white leading-snug line-clamp-2 cursor-pointer"
                >
                  {book.title}
                </h3>
                {book.author && <p className="text-[12px] text-slate-500 dark:text-slate-400 line-clamp-1 font-medium">{book.author}</p>}
                {book.description && (
                  <p className="text-[11.5px] text-slate-400 dark:text-slate-400 line-clamp-2 leading-normal">{book.description}</p>
                )}
              </div>
              <div className="pt-2 flex flex-col gap-1 items-start w-full">
                {previewButton(book, true)}
                {detailLink(book)}
              </div>
            </div>
          </div>
          </LongPressSave>
        ))}
      </div>
    );
  }

  return (
    <section id={blockId} className="flex flex-col gap-3 scroll-mt-24">
      {title && <h2 className="text-[17px] font-black text-ink dark:text-white leading-tight">{title}</h2>}
      {content}

      <BookDetailModal
        book={
          selectedBook
            ? {
                id: selectedBook.id,
                title: selectedBook.title,
                cover_url: selectedBook.cover_url,
                author: selectedBook.author || 'Tùng Dinh Dưỡng',
                description: selectedBook.description,
                year: '2026',
                youtube_url: selectedBook.youtube_url,
                gallery_images: selectedBook.gallery_images,
                flipbook_pages: selectedBook.flipbook_pages,
                file_url: selectedBook.file_url,
                file_name: selectedBook.file_name,
                pdf_url: selectedBook.pdf_url,
                link_url: selectedBook.link_url,
                type: 'recommended',
              }
            : null
        }
        isAdmin={false}
        onClose={() => setSelectedBook(null)}
      />

      <FlipbookViewer
        mode="modal-only"
        isOpen={Boolean(previewBook)}
        book={previewBook}
        title={previewBook?.title || 'Tài liệu 3D'}
        onClose={() => setPreviewBook(null)}
      />
    </section>
  );
}
