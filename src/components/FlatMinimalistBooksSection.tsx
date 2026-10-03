'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  LayoutGrid,
  List,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from 'lucide-react';
import { RecommendedBook } from '../lib/types';
import { checkIsAdminClient } from '../lib/adminAuth';
import SectionOrderControls from './admin/SectionOrderControls';
import FlipbookViewer from './FlipbookViewer';
import BookDetailModal from './BookDetailModal';
import EditSingleRecommendedBookModal from './admin/EditSingleRecommendedBookModal';
import { saveSettingsApi } from '../lib/apiAdmin';

export const DEFAULT_FLAT_BOOKS: RecommendedBook[] = [
  {
    id: 'flat-book-1',
    title: 'Cuốn Sách Mọi Người Cần Đọc Về Cơ Thể',
    category: 'Y Học Nền Tảng',
    badge_tag: 'SÁCH MỚI',
    tag: 'Sức Khỏe Chủ Động',
    cover_url: 'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/37e4dddf-16d9-4615-af3e-773e096771ef.webp',
    description: 'Thấu hiểu cơ chế tự chữa lành và nuôi dưỡng các cơ quan nội tạng từ tế bào gốc.',
    author: 'Tùng Dinh Dưỡng',
    link_url: '',
    youtube_url: 'https://www.youtube.com/watch?v=c9kmCxFKHPY',
    gallery_images: [
      'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/37e4dddf-16d9-4615-af3e-773e096771ef.webp',
      'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/27facdbb-f299-4507-8b52-719a985ecec0.webp',
    ],
    is_visible: true,
  },
  {
    id: 'flat-book-2',
    title: 'Căn Hộ Kỳ Quái Của Cơ Thể: Giải Mã Cột Sống',
    category: 'Cột Sống & Khớp',
    badge_tag: 'TẬP 1',
    tag: 'Cơ Sinh Học',
    cover_url: 'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/27facdbb-f299-4507-8b52-719a985ecec0.webp',
    description: 'Khám phá thế giới 33 đốt sống, đĩa đệm và những sai lầm vận động thường gặp.',
    author: 'Tùng Dinh Dưỡng',
    link_url: '',
    youtube_url: 'https://www.youtube.com/watch?v=c9kmCxFKHPY',
    gallery_images: [
      'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/27facdbb-f299-4507-8b52-719a985ecec0.webp',
    ],
    is_visible: true,
  },
  {
    id: 'flat-book-3',
    title: 'Dinh Dưỡng Tế Bào & Kháng Viêm Tự Nhiên',
    category: 'Dinh Dưỡng Học',
    badge_tag: 'BẢN MỚI 2026',
    tag: 'Tái Tạo Mô',
    cover_url: 'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/02327c65-40dd-4e3c-8656-78daea8ef627.webp',
    description: 'Phác đồ dinh dưỡng sinh học giúp nuôi dưỡng sụn khớp và đẩy lùi phản ứng viêm mạn tính.',
    author: 'Tùng Dinh Dưỡng',
    link_url: '',
    youtube_url: 'https://www.youtube.com/watch?v=c9kmCxFKHPY',
    gallery_images: [
      'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/02327c65-40dd-4e3c-8656-78daea8ef627.webp',
    ],
    is_visible: true,
  },
  {
    id: 'flat-book-4',
    title: 'Bí Quyết Giữ Gìn Đốt Sống Cổ & Vai Gáy',
    category: 'Phục Hồi Vận Động',
    badge_tag: 'HƯỚNG DẪN',
    tag: 'Dân Văn Phòng',
    cover_url: '/documents/covers/cover_cam_nang_dot_song_co.png',
    description: 'Các bài tập giải áp rễ thần kinh và phục hồi đường cong sinh lý cổ đơn giản tại nhà.',
    author: 'Tùng Dinh Dưỡng',
    link_url: '',
    youtube_url: 'https://www.youtube.com/watch?v=c9kmCxFKHPY',
    gallery_images: [
      '/documents/covers/cover_cam_nang_dot_song_co.png',
      '/documents/covers/back_cover_cam_nang_dot_song_co.png',
    ],
    is_visible: true,
  },
];

interface FlatMinimalistBooksSectionProps {
  initialTitle?: string | null;
  initialBooks?: RecommendedBook[];
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

export default function FlatMinimalistBooksSection({
  initialTitle,
  initialBooks,
  sectionIndex,
  totalSections,
  isHidden = false,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  onOpenReorderModal,
  hotline,
  zaloUrl,
}: FlatMinimalistBooksSectionProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkIsAdminClient().then(setIsAdmin);
    if (initialTitle) setTitle(initialTitle);
    if (initialBooks && initialBooks.length > 0) setBooks(initialBooks);
  }, [initialTitle, initialBooks]);

  const [title, setTitle] = useState<string>(initialTitle || 'Tủ Sách Tối Giản');
  const [books, setBooks] = useState<RecommendedBook[]>(() => {
    if (initialBooks && initialBooks.length > 0) return initialBooks;
    return DEFAULT_FLAT_BOOKS;
  });

  // Chế độ hiển thị: 'grid' (Lưới phẳng 2 cột) hoặc 'list' (Hàng ngang tối giản)
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');

  // Trạng thái modal
  const [selectedBook, setSelectedBook] = useState<RecommendedBook | null>(null);
  const [flipbookPreviewBook, setFlipbookPreviewBook] = useState<RecommendedBook | null>(null);
  const [editingSingleBook, setEditingSingleBook] = useState<RecommendedBook | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState<string>(title);

  const handleSaveTitle = async () => {
    const trimmed = titleDraft.trim() || 'Tủ Sách Tối Giản';
    setTitle(trimmed);
    setIsEditingTitle(false);
    if (isAdmin) {
      await saveSettingsApi({ flat_books_title: trimmed });
    }
  };

  const handleAddNewBook = async () => {
    const newBook: RecommendedBook = {
      id: `flat-book-${Date.now()}`,
      title: 'Tài liệu mới',
      category: 'Chuyên Sâu',
      badge_tag: 'MỚI',
      tag: 'Tài Liệu Mới',
      cover_url: null,
      description: 'Mô tả ngắn gọn về tài liệu này...',
      author: 'Tùng Dinh Dưỡng',
      link_url: '',
      youtube_url: null,
      gallery_images: [],
      is_visible: true,
    };
    const next = [...books, newBook];
    setBooks(next);
    if (isAdmin) {
      await saveSettingsApi({ flat_books: next });
    }
    setEditingSingleBook(newBook);
  };

  const handleMoveBook = async (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= books.length) return;
    const next = [...books];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setBooks(next);
    if (isAdmin) {
      await saveSettingsApi({ flat_books: next });
    }
  };

  const handleToggleBookVisibility = async (idx: number) => {
    const next = [...books];
    next[idx] = {
      ...next[idx],
      is_visible: next[idx].is_visible === false ? true : false,
    };
    setBooks(next);
    if (isAdmin) {
      await saveSettingsApi({ flat_books: next });
    }
  };

  const handleDeleteBook = async (idx: number) => {
    if (typeof window !== 'undefined' && !window.confirm('Bạn có chắc muốn xóa cuốn sách này khỏi khối tối giản?')) {
      return;
    }
    const next = books.filter((_, i) => i !== idx);
    setBooks(next);
    if (isAdmin) {
      await saveSettingsApi({ flat_books: next });
    }
  };

  const handleSaveSingleBook = async (updated: RecommendedBook) => {
    const next = books.map((b) => (b.id === updated.id ? updated : b));
    setBooks(next);
    if (isAdmin) {
      await saveSettingsApi({ flat_books: next });
    }
    setEditingSingleBook(null);
  };

  const visibleBooks = books.filter((b) => isAdmin || b.is_visible !== false);

  return (
    <section className="flex flex-col gap-3 mt-3 pt-2">
      {/* THANH ĐIỀU KHIỂN DÀNH CHO ADMIN */}
      {isAdmin && onMoveUp && onMoveDown && onOpenReorderModal && typeof sectionIndex === 'number' && typeof totalSections === 'number' && (
        <SectionOrderControls
          sectionTitle="TỦ SÁCH TỐI GIẢN (PHONG CÁCH PHẲNG)"
          sectionIndex={sectionIndex}
          totalSections={totalSections}
          isHidden={isHidden}
          onToggleVisibility={onToggleVisibility}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onOpenReorderModal={onOpenReorderModal}
          onEdit={() => {
            setTitleDraft(title);
            setIsEditingTitle(true);
          }}
          editLabel="Đổi tiêu đề"
        />
      )}

      {/* TIÊU ĐỀ KHỐI VÀ NÚT CHUYỂN ĐỔI CHẾ ĐỘ (LƯỚI / DANH SÁCH) */}
      <div className="flex items-center justify-between gap-2.5 px-0.5">
        {isAdmin && isEditingTitle ? (
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <input
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              className="h-8 px-2.5 rounded-[8px] border border-primary text-[14px] font-bold text-ink focus:outline-hidden flex-1 max-w-[240px]"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSaveTitle}
              className="h-8 px-2.5 rounded-[8px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-dark"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={() => {
                setTitleDraft(title);
                setIsEditingTitle(false);
              }}
              className="h-8 px-2 rounded-[8px] bg-surface-2 text-muted text-[12px] font-bold cursor-pointer hover:text-ink"
            >
              Hủy
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[18px] select-none">📖</span>
            <h2 className="text-[18px] sm:text-[19px] font-black text-ink leading-tight truncate">
              {title}
            </h2>
            {isAdmin && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setTitleDraft(title);
                    setIsEditingTitle(true);
                  }}
                  className="w-6 h-6 rounded-[6px] bg-surface-2 text-muted hover:text-ink flex items-center justify-center cursor-pointer"
                  title="Sửa tiêu đề"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  type="button"
                  onClick={handleAddNewBook}
                  className="h-6 px-2 rounded-[6px] bg-primary-soft text-primary text-[11px] font-bold flex items-center gap-1 hover:bg-primary-soft/80 cursor-pointer shadow-2xs"
                  title="Thêm sách vào tủ sách tối giản"
                >
                  <Plus size={11} strokeWidth={2.5} />
                  <span>Thêm sách</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Nút chuyển đổi kiểu hiển thị tối giản */}
        <div className="inline-flex items-center bg-slate-100 dark:bg-[#1E293B] rounded-[10px] p-0.5 shadow-2xs shrink-0">
          <button
            type="button"
            onClick={() => setLayoutMode('grid')}
            className={`w-7 h-7 rounded-[7px] flex items-center justify-center transition-all cursor-pointer ${
              layoutMode === 'grid'
                ? 'bg-[#1E3A8A] text-amber-300 shadow-xs font-bold'
                : 'text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
            }`}
            title="Xem dạng lưới phẳng 2 cột"
            aria-label="Xem dạng lưới phẳng 2 cột"
          >
            <LayoutGrid size={13} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode('list')}
            className={`w-7 h-7 rounded-[7px] flex items-center justify-center transition-all cursor-pointer ${
              layoutMode === 'list'
                ? 'bg-[#1E3A8A] text-amber-300 shadow-xs font-bold'
                : 'text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
            }`}
            title="Xem dạng danh sách ngang phẳng"
            aria-label="Xem dạng danh sách ngang phẳng"
          >
            <List size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* DANH SÁCH SÁCH PHẲNG TỐI GIẢN */}
      {visibleBooks.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-[13px]">
          Chưa có cuốn sách nào trong tủ sách tối giản.
        </div>
      ) : layoutMode === 'grid' ? (
        /* =================== KIỂU 1: LƯỚI PHẲNG 2 CỘT (MINIMALIST FLAT GRID) =================== */
        /* Theo đúng mẫu ảnh 3 & ảnh 4: Ảnh phẳng bo góc nhẹ, Tiêu đề + Tác giả bên dưới, Nút 3D ở dưới cùng */
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4.5">
          {visibleBooks.map((book, idx) => {
            const isBookHidden = book.is_visible === false;
            return (
              <div
                key={book.id || idx}
                className={`flex flex-col group relative transition-all ${
                  isBookHidden ? 'opacity-60 ring-2 ring-dashed ring-amber-400 p-1 rounded-[14px]' : ''
                }`}
              >
                {/* ẢNH BÌA SÁCH PHẲNG (FLAT COVER 2D - KHÔNG DÙNG VIỀN KHUNG THÔ, BO GÓC NHẸ) */}
                <div
                  onClick={() => setSelectedBook(book)}
                  className="w-full aspect-[3/4] rounded-[12px] overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={book.cover_url || '/images/lessons/tong-quan-ve-cot-song.png'}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  {book.badge_tag && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-[4px] bg-[#1E3A8A] text-[#FDE047] text-[8.5px] font-black uppercase tracking-wider shadow-xs">
                      {book.badge_tag}
                    </span>
                  )}
                  {isBookHidden && isAdmin && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-amber-300 text-[9px] font-bold">
                      Ẩn
                    </div>
                  )}
                </div>

                {/* THÔNG TIN TIÊU ĐỀ & TÁC GIẢ BÊN DƯỚI (PHẲNG, KHÔNG CARD BAO NGOÀI) */}
                <div className="flex flex-col pt-2 min-w-0">
                  <h3
                    onClick={() => setSelectedBook(book)}
                    className="text-[13.5px] sm:text-[14.5px] font-bold text-ink leading-snug line-clamp-2 min-h-[36px] group-hover:text-[#1E3A8A] dark:group-hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    {book.title}
                  </h3>
                  <p className="text-[11.5px] sm:text-[12px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-medium">
                    {book.author || 'Tùng Dinh Dưỡng'}
                    {book.category && ` · ${book.category}`}
                  </p>
                </div>

                {/* NÚT XEM THỬ 3D Ở DƯỚI CÙNG (THEO ĐÚNG YÊU CẦU: VẪN CÓ NÚT XEM THỬ 3D Ở DƯỚI) */}
                <div className="mt-2.5 pt-0.5 flex flex-col gap-1.5">
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
                      className="text-[11px] sm:text-[11.5px] font-semibold text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white inline-flex items-center gap-0.5 cursor-pointer transition-colors"
                    >
                      <span>Chi tiết</span>
                      <ChevronRight size={11} strokeWidth={2} />
                    </span>
                  </div>
                </div>

                {/* Nút quản trị sách cho admin */}
                {isAdmin && (
                  <div className="mt-1.5 pt-1 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1">
                    <span className="text-[9.5px] font-extrabold uppercase text-slate-400">Admin</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveBook(idx, 'up')}
                        className="w-5 h-5 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 flex items-center justify-center"
                        title="Lên trên"
                      >
                        <ArrowUp size={10} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === visibleBooks.length - 1}
                        onClick={() => handleMoveBook(idx, 'down')}
                        className="w-5 h-5 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 flex items-center justify-center"
                        title="Xuống dưới"
                      >
                        <ArrowDown size={10} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleBookVisibility(idx)}
                        className="w-5 h-5 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center"
                        title={isBookHidden ? 'Hiện lại' : 'Ẩn tạm'}
                      >
                        {isBookHidden ? <EyeOff size={10} /> : <Eye size={10} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingSingleBook(book)}
                        className="w-5 h-5 rounded-[4px] bg-amber-50 text-amber-900 border border-amber-300 flex items-center justify-center"
                        title="Sửa sách"
                      >
                        <Edit2 size={9} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBook(idx)}
                        className="w-5 h-5 rounded-[4px] bg-red-50 text-red-600 flex items-center justify-center"
                        title="Xóa"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* =================== KIỂU 2: DANH SÁCH NGANG TỐI GIẢN (MINIMALIST FLAT LIST) =================== */
        /* Theo đúng mẫu ảnh 1 & ảnh 2: Bìa phẳng bên trái, Chữ to rõ không viền bên phải, Nút 3D ở dưới */
        <div className="flex flex-col gap-3.5">
          {visibleBooks.map((book, idx) => {
            const isBookHidden = book.is_visible === false;
            return (
              <div
                key={book.id || idx}
                className={`flex flex-row gap-3.5 sm:gap-4 items-stretch p-3 rounded-[14px] bg-slate-50/70 dark:bg-[#1E293B]/40 hover:bg-slate-100/80 dark:hover:bg-[#1E293B]/70 transition-colors group relative ${
                  isBookHidden ? 'opacity-60 ring-2 ring-dashed ring-amber-400' : ''
                }`}
              >
                {/* BÊN TRÁI: Bìa sách phẳng 2D chuẩn tỷ lệ 3:4 */}
                <div
                  onClick={() => setSelectedBook(book)}
                  className="w-[102px] sm:w-[120px] aspect-[3/4] shrink-0 rounded-[10px] overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-sm cursor-pointer relative"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={book.cover_url || '/images/lessons/tong-quan-ve-cot-song.png'}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {book.badge_tag && (
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-[4px] bg-[#1E3A8A] text-[#FDE047] text-[8px] font-black uppercase tracking-wider shadow-xs">
                      {book.badge_tag}
                    </span>
                  )}
                  {isBookHidden && isAdmin && (
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-amber-300 text-[8.5px] font-bold">
                      Ẩn
                    </div>
                  )}
                </div>

                {/* BÊN PHẢI: Tiêu đề rõ ràng, Tác giả, Thể loại và Nút Xem thử 3D ở DƯỚI */}
                <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start gap-1">
                      <h3
                        onClick={() => setSelectedBook(book)}
                        className="text-[15px] sm:text-[16px] font-bold text-ink leading-snug line-clamp-2 group-hover:text-[#1E3A8A] dark:group-hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        {book.title}
                      </h3>
                    </div>

                    <p className="text-[12px] sm:text-[12.5px] text-slate-500 dark:text-slate-400 line-clamp-1 font-medium">
                      {book.author || 'Tùng Dinh Dưỡng'}
                    </p>

                    {book.category && (
                      <p className="text-[11px] sm:text-[11.5px] text-amber-700 dark:text-amber-400 font-semibold line-clamp-1">
                        {book.category}
                      </p>
                    )}

                    {book.description && (
                      <p className="text-[11.5px] sm:text-[12px] text-slate-400 dark:text-slate-400 line-clamp-1 leading-normal font-normal">
                        {book.description}
                      </p>
                    )}
                  </div>

                  {/* CỤM NÚT XEM THỬ 3D Ở DƯỚI CÙNG BÊN PHẢI */}
                  <div className="pt-2 flex flex-col gap-1 mt-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlipbookPreviewBook(book);
                      }}
                      className="animate-bubble-float relative w-full h-[34px] sm:h-[36px] rounded-xl bg-gradient-to-r from-[#FEF08A] via-[#FACC15] to-[#EAB308] hover:from-[#FFF59D] hover:to-[#F59E0B] text-[#1E293B] font-bold text-[12px] shadow-[0_2px_10px_rgba(250,204,21,0.28)] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer border border-[#FDE047]"
                      title="Xem thử 3D"
                    >
                      <BookOpen size={13} strokeWidth={2.2} className="shrink-0 text-[#1E293B]" />
                      <span className="tracking-wide">Xem thử 3D</span>
                    </button>

                    <div className="flex items-center justify-center">
                      <span
                        onClick={() => setSelectedBook(book)}
                        className="text-[11px] sm:text-[11.5px] font-semibold text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white inline-flex items-center gap-0.5 cursor-pointer transition-colors"
                      >
                        <span>Chi tiết sách</span>
                        <ChevronRight size={11} strokeWidth={2} />
                      </span>
                    </div>
                  </div>

                  {/* Nút quản trị admin */}
                  {isAdmin && (
                    <div className="mt-1 pt-1 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1">
                      <span className="text-[9px] font-bold uppercase text-slate-400">Admin:</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveBook(idx, 'up')}
                          className="w-5 h-5 rounded-[4px] bg-slate-200/80 text-slate-600 disabled:opacity-30 flex items-center justify-center"
                          title="Lên"
                        >
                          <ArrowUp size={10} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === visibleBooks.length - 1}
                          onClick={() => handleMoveBook(idx, 'down')}
                          className="w-5 h-5 rounded-[4px] bg-slate-200/80 text-slate-600 disabled:opacity-30 flex items-center justify-center"
                          title="Xuống"
                        >
                          <ArrowDown size={10} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleBookVisibility(idx)}
                          className="w-5 h-5 rounded-[4px] bg-slate-200/80 text-slate-600 flex items-center justify-center"
                          title={isBookHidden ? 'Hiện' : 'Ẩn'}
                        >
                          {isBookHidden ? <EyeOff size={10} /> : <Eye size={10} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingSingleBook(book)}
                          className="w-5 h-5 rounded-[4px] bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center"
                          title="Sửa"
                        >
                          <Edit2 size={9} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBook(idx)}
                          className="w-5 h-5 rounded-[4px] bg-red-100 text-red-600 flex items-center justify-center"
                          title="Xóa"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL CHI TIẾT SÁCH TOÀN DIỆN */}
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

      {/* CUỐN SÁCH LẬT TRANG 3D ĐỌC THỬ */}
      <FlipbookViewer
        mode="modal-only"
        isOpen={Boolean(flipbookPreviewBook)}
        book={flipbookPreviewBook}
        title={flipbookPreviewBook?.title ? `Đọc thử tài liệu 3D: ${flipbookPreviewBook.title}` : 'Đọc thử tài liệu 3D'}
        onClose={() => setFlipbookPreviewBook(null)}
      />

      {/* MODAL SỬA ĐÚNG 1 CUỐN SÁCH TỐI GIẢN */}
      <EditSingleRecommendedBookModal
        isOpen={Boolean(editingSingleBook)}
        book={editingSingleBook}
        onClose={() => setEditingSingleBook(null)}
        onSaved={handleSaveSingleBook}
      />
    </section>
  );
}
