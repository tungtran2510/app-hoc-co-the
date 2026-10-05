'use client';

import React, { useState, useEffect } from 'react';
import {
  Edit2,
  Plus,
  LayoutGrid,
  List,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Trash2,
  Eye,
  EyeOff,
  BookOpen,
  Sparkles,
  FileText,
} from 'lucide-react';
import { RecommendedBook } from '../lib/types';
import { checkIsAdminClient } from '../lib/adminAuth';
import { saveSettingsApi } from '../lib/apiAdmin';
import EditRecommendedBooksModal from './admin/EditRecommendedBooksModal';
import EditSingleRecommendedBookModal from './admin/EditSingleRecommendedBookModal';
import SectionOrderControls from './admin/SectionOrderControls';
import ModernBookCover from './ModernBookCover';
import BookDetailModal, { UnifiedBookItem } from './BookDetailModal';
import ScrollReveal from './ScrollReveal';
import dynamic from 'next/dynamic';
const FlipbookViewer = dynamic(() => import('./FlipbookViewer'), { ssr: false });

interface RecommendedBooksSectionProps {
  initialTitle?: string | null;
  initialSubtitle?: string | null;
  initialBooks?: RecommendedBook[];
  initialLayout?: 'grid' | 'lookbook' | null;
  sectionIndex?: number;
  totalSections?: number;
  isHidden?: boolean;
  onToggleVisibility?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onOpenReorderModal?: () => void;
  hotline?: string | null;
  zaloUrl?: string | null;
}

export default function RecommendedBooksSection({
  initialTitle,
  initialSubtitle,
  initialBooks = [],
  initialLayout = 'grid',
  sectionIndex,
  totalSections,
  isHidden = false,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  onOpenReorderModal,
  hotline,
  zaloUrl,
}: RecommendedBooksSectionProps) {
  const [title, setTitle] = useState(initialTitle || 'Tài Liệu Y Khoa');
  const [subtitle, setSubtitle] = useState(
    initialSubtitle || 'Tài liệu tham khảo chuyên sâu giúp bạn hiểu và chăm sóc cơ thể mỗi ngày'
  );
  const [books, setBooks] = useState<RecommendedBook[]>(initialBooks);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'lookbook'>(
    initialLayout === 'lookbook' ? 'lookbook' : 'grid'
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<RecommendedBook | null>(null);
  const [flipbookPreviewBook, setFlipbookPreviewBook] = useState<RecommendedBook | null>(null);
  const [editingSingleBook, setEditingSingleBook] = useState<RecommendedBook | null>(null);

  const handleSaveSingleBook = async (updatedBook: RecommendedBook) => {
    const nextBooks = books.map((b) => (b.id === updatedBook.id ? updatedBook : b));
    setBooks(nextBooks);
    if (isAdmin) {
      await saveSettingsApi({
        recommended_books: nextBooks,
      });
    }
  };

  useEffect(() => {
    checkIsAdminClient().then(setIsAdmin);
    if (initialTitle) setTitle(initialTitle);
    if (initialSubtitle) setSubtitle(initialSubtitle);
    if (initialBooks && initialBooks.length > 0) setBooks(initialBooks);
    if (initialLayout) setLayoutMode(initialLayout === 'lookbook' ? 'lookbook' : 'grid');
  }, [initialTitle, initialSubtitle, initialBooks, initialLayout]);

  const handleSaved = (data: {
    title: string;
    subtitle: string;
    books: RecommendedBook[];
    layout?: 'grid' | 'lookbook';
  }) => {
    setTitle(data.title);
    setSubtitle(data.subtitle);
    setBooks(data.books);
    if (data.layout) {
      setLayoutMode(data.layout);
    }
  };

  const toggleLayoutMode = async (mode: 'grid' | 'lookbook') => {
    setLayoutMode(mode);
    if (isAdmin) {
      await saveSettingsApi({
        recommended_books_layout: mode,
      });
    }
  };

  const handleMoveBook = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= books.length) return;
    const nextBooks = [...books];
    const temp = nextBooks[index];
    nextBooks[index] = nextBooks[targetIndex];
    nextBooks[targetIndex] = temp;
    setBooks(nextBooks);
    if (isAdmin) {
      await saveSettingsApi({
        recommended_books: nextBooks,
      });
    }
  };

  const handleDeleteBook = async (index: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa cuốn sách này khỏi danh sách?')) return;
    const nextBooks = books.filter((_, i) => i !== index);
    setBooks(nextBooks);
    if (isAdmin) {
      await saveSettingsApi({
        recommended_books: nextBooks,
      });
    }
  };

  const handleToggleBookVisibility = async (index: number) => {
    const nextBooks = [...books];
    const b = nextBooks[index];
    nextBooks[index] = {
      ...b,
      is_visible: b.is_visible !== undefined ? !b.is_visible : false,
    };
    setBooks(nextBooks);
    if (isAdmin) {
      await saveSettingsApi({
        recommended_books: nextBooks,
      });
    }
  };

  // Nếu không có sách và không phải admin thì ẩn khối
  if (books.length === 0 && !isAdmin) {
    return null;
  }

  const selectedUnifiedBook: UnifiedBookItem | null = selectedBook
    ? {
        id: selectedBook.id,
        title: selectedBook.title,
        cover_url: selectedBook.cover_url,
        author: selectedBook.author,
        description: selectedBook.description,
        youtube_url: selectedBook.youtube_url,
        gallery_images: selectedBook.gallery_images,
        flipbook_pages: selectedBook.flipbook_pages,
        file_url: selectedBook.file_url,
        file_name: selectedBook.file_name,
        pdf_url: selectedBook.pdf_url,
        link_url: selectedBook.link_url,
        type: 'recommended',
      }
    : null;

  return (
    <section className="flex flex-col gap-3.5 mt-2">
      {/* KHỐI NÚT ĐIỀU KHIỂN DÀNH CHO ADMIN - ĐẶT TRÊN ĐẦU KHỐI */}
      {isAdmin && onMoveUp && onMoveDown && onOpenReorderModal && typeof sectionIndex === 'number' && typeof totalSections === 'number' && (
        <SectionOrderControls
          sectionTitle="TÀI LIỆU NÊN ĐỌC"
          sectionIndex={sectionIndex}
          totalSections={totalSections}
          isHidden={isHidden}
          onToggleVisibility={onToggleVisibility}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onOpenReorderModal={onOpenReorderModal}
          onEdit={() => setShowEditModal(true)}
          editLabel="Cài đặt khối sách"
        />
      )}

      {/* TIÊU ĐỀ MỤC & NHÓM NÚT CHUYỂN CHẾ ĐỘ XEM (BỎ BADGE SỐ TÀI LIỆU, TỰ ĐỘNG XUỐNG DÒNG KHÔNG ĐÈ NÚT) */}
      <div className="flex flex-col gap-1.5">
        {/* Hàng 1: Tiêu đề bên trái (tự co giãn / xuống dòng), Nút chuyển đổi Lưới / Danh sách bên phải */}
        <div className="flex items-center justify-between gap-2.5">
          <h2 className="text-[18px] sm:text-[19px] font-extrabold text-ink leading-tight break-words line-clamp-2 flex-1 min-w-0">
            {title}
          </h2>

          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            {/* Nút chuyển đổi kiểu hiển thị: Lưới hoặc Danh sách chi tiết */}
            <div className="inline-flex items-center bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[10px] p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => toggleLayoutMode('grid')}
                className={`w-7 h-7 rounded-[7px] flex items-center justify-center transition-all cursor-pointer ${
                  layoutMode === 'grid'
                    ? 'bg-[#1E3A8A] text-amber-300 shadow-xs font-bold'
                    : 'text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Xem dạng lưới 2 cột"
                aria-label="Xem dạng lưới 2 cột"
              >
                <LayoutGrid size={13} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => toggleLayoutMode('lookbook')}
                className={`w-7 h-7 rounded-[7px] flex items-center justify-center transition-all cursor-pointer ${
                  layoutMode === 'lookbook'
                    ? 'bg-[#1E3A8A] text-amber-300 shadow-xs font-bold'
                    : 'text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Xem dạng danh sách chi tiết"
                aria-label="Xem dạng danh sách chi tiết"
              >
                <List size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Hàng 2: Đã lược bỏ mô tả sau tiêu đề theo đúng yêu cầu */}
      </div>

      {/* NỘI DUNG DANH SÁCH SÁCH */}
      {books.length === 0 && isAdmin ? (
        <div
          onClick={() => setShowEditModal(true)}
          className="p-8 rounded-[24px] bg-white border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-primary-soft/20 transition-colors shadow-2xs"
        >
          <div className="w-12 h-12 rounded-full bg-primary-soft text-primary flex items-center justify-center">
            <Plus size={24} />
          </div>
          <h3 className="text-[16px] font-extrabold text-ink">
            Chưa có cuốn sách nào được thêm
          </h3>
          <p className="text-[13px] text-muted max-w-[320px]">
            Nhấn vào đây để thêm các đầu sách khuyên đọc với bìa 3D hiện đại và thông tin chuyên sâu.
          </p>
        </div>
      ) : layoutMode === 'lookbook' ? (
        /* =================== KIỂU 1: LOOKBOOK CHUYÊN NGHIỆP (CÂN ĐỐI, KHÔNG RỚT CHỮ) =================== */
        <div className="flex flex-col gap-3">
          {books.map((book, idx) => {
            const isBookHidden = book.is_visible === false;
            if (isBookHidden && !isAdmin) return null;

            return (
              <ScrollReveal
                key={book.id || idx}
                animation="book-cascade"
                delay={Math.min(idx * 30, 90)}
              >
                <div
                  className={`p-3.5 sm:p-4 rounded-[14px] bg-white text-slate-900 border border-slate-200/80 shadow-xs hover:shadow-lg hover:shadow-blue-900/10 hover:border-[#1E3A8A]/50 dark:hover:border-[#F8DF7B]/60 dark:hover:shadow-[0_12px_28px_rgba(248,223,123,0.15)] hover:-translate-y-1.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex flex-row gap-3 sm:gap-4.5 group relative ${
                    isBookHidden ? 'opacity-70 border-dashed border-amber-300' : ''
                  }`}
                >
                  {/* BÊN TRÁI: Bìa sách 3D to rõ chuẩn tỷ lệ 3:4 với ModernBookCover */}
                  <div
                    onClick={() => setSelectedBook(book)}
                    className="w-[116px] sm:w-[138px] shrink-0 pt-0.5 relative cursor-pointer"
                  >
                    <ModernBookCover
                      title={book.title}
                      coverUrl={book.cover_url}
                      author={book.author}
                      index={idx}
                      badgeText={book.badge_tag || book.tag || 'NÊN ĐỌC'}
                    />
                    {isBookHidden && isAdmin && (
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-amber-300 text-[9.5px] font-black z-10">
                        Ẩn tạm
                      </div>
                    )}
                  </div>

                  {/* BÊN PHẢI: Tiêu đề xanh navy như ảnh, Mô tả 1 dòng, Khung Xem thử 3D vàng sáng cân xứng, Chi tiết sách ở DƯỚI */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                    <div className="flex flex-col gap-1">
                      <h3
                        onClick={() => setSelectedBook(book)}
                        className="text-[15px] sm:text-[16.5px] font-bold text-[#1D3985] dark:text-[#93C5FD] leading-snug line-clamp-2 break-normal group-hover:text-blue-700 dark:group-hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        {book.title}
                      </h3>
                      {book.description && (
                        <p className="text-[12px] sm:text-[12.5px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-normal font-normal">
                          {book.description}
                        </p>
                      )}
                    </div>

                    {/* CỤM HÀNH ĐỘNG: Xem thử 3D màu vàng sáng full bề ngang, Chi tiết sách ở DƯỚI */}
                    <div className="pt-2 flex flex-col gap-1.5 mt-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFlipbookPreviewBook(book);
                        }}
                        className="animate-bubble-float relative w-full h-[36px] sm:h-[38px] rounded-xl bg-gradient-to-r from-[#FEF08A] via-[#FACC15] to-[#EAB308] hover:from-[#FFF59D] hover:to-[#F59E0B] text-[#1E293B] font-bold text-[12px] sm:text-[12.5px] shadow-[0_2px_12px_rgba(250,204,21,0.32)] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer border border-[#FDE047]"
                        title="Xem thử 3D"
                      >
                        <BookOpen size={14} strokeWidth={2.2} className="shrink-0 text-[#1E293B]" />
                        <span className="tracking-wide">Xem thử 3D</span>
                      </button>

                      <div className="flex items-center justify-center">
                        <span
                          onClick={() => setSelectedBook(book)}
                          className="text-[11.5px] sm:text-[12px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white inline-flex items-center gap-0.5 cursor-pointer transition-colors"
                        >
                          <span>Chi tiết sách</span>
                          <ChevronRight size={12} strokeWidth={2} />
                        </span>
                      </div>
                    </div>

                    {isAdmin && (
                      <div
                        className="mt-2 pt-1.5 border-t border-dashed border-[#2D5B94]/25 dark:border-slate-800 flex items-center justify-between gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
                          Quản trị:
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveBook(idx, 'up')}
                            className="w-6.5 h-6.5 rounded-[7px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                            title="Chuyển sách lên trên"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === books.length - 1}
                            onClick={() => handleMoveBook(idx, 'down')}
                            className="w-6.5 h-6.5 rounded-[7px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                            title="Chuyển sách xuống dưới"
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleBookVisibility(idx)}
                            className={`w-6.5 h-6.5 rounded-[7px] flex items-center justify-center cursor-pointer transition-colors shadow-2xs ${
                              isBookHidden
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-200'
                            }`}
                            title={isBookHidden ? 'Cuốn sách này đang ẨN với khách – Bấm để HIỆN' : 'Cuốn sách này đang HIỆN – Bấm để ẨN TẠM'}
                          >
                            {isBookHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingSingleBook(book)}
                            className="flex items-center gap-1 h-6.5 px-2 rounded-[7px] bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 dark:bg-slate-800 dark:text-amber-200 dark:border-amber-700/40 text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
                            title="Sửa cuốn sách này"
                          >
                            <Edit2 size={11} />
                            <span>Sửa</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBook(idx)}
                            className="w-6.5 h-6.5 rounded-[7px] bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                            title="Xóa cuốn sách này"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      ) : (
        /* =================== KIỂU 2: LƯỚI 2 CỘT HIỆN ĐẠI (MODERN LUXURY GRID) =================== */
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {books.map((book, idx) => {
            const isBookHidden = book.is_visible === false;
            if (isBookHidden && !isAdmin) return null;

            return (
              <ScrollReveal
                key={book.id || idx}
                animation="book-cascade"
                delay={Math.min(idx * 30, 90)}
              >
                <div
                  onClick={() => setSelectedBook(book)}
                  className={`group p-3 sm:p-3.5 rounded-[14px] bg-white text-slate-900 border border-slate-200/80 shadow-xs hover:shadow-lg hover:shadow-blue-950/10 hover:border-[#1E3A8A]/50 dark:hover:border-[#F8DF7B]/60 dark:hover:shadow-[0_12px_28px_rgba(248,223,123,0.15)] hover:-translate-y-1.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex flex-col cursor-pointer relative h-full ${
                    isBookHidden ? 'opacity-70 border-dashed border-amber-300' : ''
                  }`}
                >
                  {/* BÌA SÁCH 3D HIỆN ĐẠI */}
                  <div className="w-full px-1 pt-1 pb-1.5 flex justify-center relative">
                    <ModernBookCover
                      title={book.title}
                      coverUrl={book.cover_url}
                      author={book.author}
                      index={idx}
                      badgeText={book.badge_tag || book.tag || 'NÊN ĐỌC'}
                    />
                    {isBookHidden && isAdmin && (
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-amber-300 text-[9.5px] font-black z-10">
                        Ẩn tạm
                      </div>
                    )}
                  </div>

                  {/* NỘI DUNG CHÂN THẺ */}
                  <div className="flex-1 flex flex-col pt-1 gap-1.5 min-w-0">
                    <h3 className="text-[13.5px] sm:text-[14.5px] font-bold text-[#1D3985] dark:text-[#93C5FD] leading-snug line-clamp-2 min-h-[34px] group-hover:text-blue-700 dark:group-hover:text-amber-300 transition-colors">
                      {book.title}
                    </h3>

                    {/* KHUNG HÀNH ĐỘNG DẠNG LƯỚI: Nút 3D vàng sáng full bề ngang, Chi tiết ở DƯỚI */}
                    <div className="mt-auto pt-2 flex flex-col gap-1.5 border-t border-slate-100 dark:border-white/10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFlipbookPreviewBook(book);
                        }}
                        className="animate-bubble-float relative w-full h-[34px] sm:h-[36px] rounded-xl bg-gradient-to-r from-[#FEF08A] via-[#FACC15] to-[#EAB308] hover:from-[#FFF59D] hover:to-[#F59E0B] text-[#1E293B] font-bold text-[11.5px] sm:text-[12px] shadow-[0_2px_10px_rgba(250,204,21,0.28)] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer border border-[#FDE047]"
                        title="Xem thử 3D"
                      >
                        <BookOpen size={13} strokeWidth={2.2} className="shrink-0 text-[#1E293B]" />
                        <span className="tracking-wide">Xem thử 3D</span>
                      </button>

                      <div className="flex items-center justify-center">
                        <span
                          onClick={() => setSelectedBook(book)}
                          className="text-[11px] sm:text-[11.5px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white inline-flex items-center gap-0.5 cursor-pointer transition-colors"
                        >
                          <span>Chi tiết sách</span>
                          <ChevronRight size={11} strokeWidth={2} />
                        </span>
                      </div>
                    </div>

                    {isAdmin && (
                      <div
                        className="mt-1.5 pt-1 border-t border-dashed border-[#2D5B94]/25 dark:border-slate-800 flex items-center justify-between gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-[9.5px] font-extrabold uppercase text-muted">Quản trị</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveBook(idx, 'up')}
                            className="w-5.5 h-5.5 rounded-[5px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer transition-colors"
                            title="Chuyển sách lên trên"
                          >
                            <ArrowUp size={11} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === books.length - 1}
                            onClick={() => handleMoveBook(idx, 'down')}
                            className="w-5.5 h-5.5 rounded-[5px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer transition-colors"
                            title="Chuyển sách xuống dưới"
                          >
                            <ArrowDown size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleBookVisibility(idx)}
                            className={`w-5.5 h-5.5 rounded-[5px] flex items-center justify-center cursor-pointer transition-colors ${
                              isBookHidden
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-200'
                            }`}
                            title={isBookHidden ? 'Hiện' : 'Ẩn'}
                          >
                            {isBookHidden ? <EyeOff size={11} /> : <Eye size={11} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingSingleBook(book)}
                            className="w-5.5 h-5.5 rounded-[5px] bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 dark:bg-slate-800 dark:text-amber-200 dark:border-amber-700/40 flex items-center justify-center cursor-pointer transition-colors"
                            title="Sửa cuốn sách này"
                          >
                            <Edit2 size={10} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBook(idx)}
                            className="w-5.5 h-5.5 rounded-[5px] bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300 flex items-center justify-center cursor-pointer transition-colors"
                            title="Xóa sách"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}

      {/* MODAL CHI TIẾT SÁCH TOÀN DIỆN (VIDEO YOUTUBE + BỘ SƯU TẬP ẢNH BÊN TRONG CÓ PHÓNG TO) */}
      <BookDetailModal
        book={selectedUnifiedBook}
        isAdmin={isAdmin}
        hotline={hotline}
        zaloUrl={zaloUrl}
        onClose={() => setSelectedBook(null)}
        onEdit={() => {
          const b = selectedBook;
          setSelectedBook(null);
          setEditingSingleBook(b);
        }}
      />

      {/* MODAL QUẢN TRỊ VIÊN SỬA SÁCH */}
      <EditRecommendedBooksModal
        isOpen={showEditModal}
        initialTitle={title}
        initialSubtitle={subtitle}
        initialBooks={books}
        initialLayout={layoutMode}
        onClose={() => setShowEditModal(false)}
        onSaved={handleSaved}
      />

      {/* CUỐN SÁCH LẬT TRANG 3D ĐỌC THỬ (CHÂN THỰC TOÀN MÀN HÌNH THEO YÊU CẦU NGƯỜI DÙNG) */}
      <FlipbookViewer
        mode="modal-only"
        isOpen={Boolean(flipbookPreviewBook)}
        book={flipbookPreviewBook}
        title={flipbookPreviewBook?.title ? `Đọc thử tài liệu 3D: ${flipbookPreviewBook.title}` : 'Đọc thử tài liệu 3D'}
        onClose={() => setFlipbookPreviewBook(null)}
      />

      {/* MODAL SỬA ĐÚNG 1 CUỐN SÁCH NÊN ĐỌC */}
      <EditSingleRecommendedBookModal
        isOpen={Boolean(editingSingleBook)}
        book={editingSingleBook}
        onClose={() => setEditingSingleBook(null)}
        onSaved={handleSaveSingleBook}
      />
    </section>
  );
}
