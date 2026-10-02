'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  BookOpen,
  Edit2,
  Film,
  Sparkles,
  Play,
  Phone,
  PhoneCall,
  Mail,
  MapPin,
  Globe,
  Plus,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Trash2,
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
  Quote,
} from 'lucide-react';
import { AuthorProfile, AuthorBook } from '../lib/types';
import { normalizeAuthorProfile } from '../lib/data';
import { checkIsAdminClient } from '../lib/adminAuth';
import { extractYouTubeId } from '../lib/youtube';
import BookDetailModal from './BookDetailModal';
import EditAuthorModal from './admin/EditAuthorModal';
import EditSingleAuthorBookModal from './admin/EditSingleAuthorBookModal';
import SectionOrderControls from './admin/SectionOrderControls';
import FlipbookViewer from './FlipbookViewer';
import ScrollReveal from './ScrollReveal';
import ModernBookCover from './ModernBookCover';
import YouTubeEmbed from './YouTubeEmbed';
import { saveSettingsApi } from '../lib/apiAdmin';

export interface AuthorSectionBaseProps {
  profile: AuthorProfile;
  isAdmin?: boolean;
  isHidden?: boolean;
  onToggleVisibility?: () => void;
  sectionIndex?: number;
  totalSections?: number;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onOpenReorderModal?: () => void;
  onEdit?: () => void;
}

/* =========================================================================
   1. KHỐI 1: HỒ SƠ TÁC GIẢ & CHUYÊN GIA (AUTHOR PROFILE)
   ========================================================================= */
export function AuthorProfileSection({
  profile,
  isAdmin = false,
  isHidden = false,
  onToggleVisibility,
  sectionIndex,
  totalSections,
  onMoveUp,
  onMoveDown,
  onOpenReorderModal,
  onEdit,
}: AuthorSectionBaseProps) {
  const introVideoId = profile.intro_video_url ? extractYouTubeId(profile.intro_video_url) : null;

  return (
    <section className="flex flex-col gap-3 mt-1">
      {/* Nút điều khiển Admin */}
      {/* KHỐI NÚT ĐIỀU KHIỂN DÀNH CHO ADMIN - ĐẶT TRÊN ĐẦU KHỐI */}
      {isAdmin && typeof sectionIndex === 'number' && typeof totalSections === 'number' && onMoveUp && onMoveDown && onOpenReorderModal && (
        <SectionOrderControls
          sectionTitle="HỒ SƠ TÁC GIẢ"
          sectionIndex={sectionIndex}
          totalSections={totalSections}
          isHidden={isHidden}
          onToggleVisibility={onToggleVisibility}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onOpenReorderModal={onOpenReorderModal}
          onEdit={onEdit}
          editLabel="Sửa tác giả"
        />
      )}

      {/* THẺ MASTER INSTRUCTOR PROFILE CARD CAO CẤP */}
      <ScrollReveal animation="slide-left" delay={40}>
        <div className="relative p-4 sm:p-5 rounded-[18px] bg-white text-slate-900 border border-slate-200/80 shadow-xs hover:shadow-sm dark:bg-gradient-to-br dark:from-[#1C123D] dark:via-[#160D30] dark:to-[#0E0720] dark:border-white/15 dark:text-white overflow-hidden flex flex-col gap-3">
        {/* Họa tiết trang trí viền cao cấp góc phải */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 dark:opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-300 dark:from-amber-400 via-transparent to-transparent" />

        {/* 1. Phần Đầu: Chân dung bên trái + Tên & Sứ mệnh bên phải */}
        <div className="relative z-10 flex items-start gap-3.5 sm:gap-4">
          {/* Ảnh chân dung chuyên gia - To rõ, sát mép khung viền theo yêu cầu */}
          <div className="w-[110px] sm:w-[124px] aspect-[4/5] rounded-[16px] overflow-hidden bg-slate-100 dark:bg-[#241548] shrink-0 border-2 border-blue-200/90 dark:border-purple-400/50 shadow-md relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.avatar_url || '/images/author_tung.png'}
              alt={profile.name || 'Tùng Dinh Dưỡng'}
              className="w-full h-full object-cover object-[50%_15%] scale-110 transition-transform duration-300 hover:scale-115"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/author_tung.png';
              }}
            />
          </div>

          <div className="flex-1 flex flex-col gap-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-[20px] sm:text-[22px] font-bold text-slate-900 dark:text-white leading-tight">
                {profile.name && profile.name.toLowerCase().includes('tùng') ? 'Tùng Dinh Dưỡng' : (profile.name || 'Tùng Dinh Dưỡng')}
              </h3>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white shrink-0 shadow-2xs" title="Chuyên gia được xác thực">
                <Check size={10} strokeWidth={3.5} />
              </span>
            </div>

            {profile.title && (
              <p className="text-[12px] sm:text-[13px] font-semibold text-[#1E3A8A] dark:text-[#F8DF7B] leading-snug">
                {profile.title.replace(/\.$/, '')}
              </p>
            )}

            {profile.bio && (
              <p className="text-[12.5px] sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4 mt-0.5 font-normal font-sans">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Ảnh minh họa thêm (nếu có) */}
        {profile.intro_image_url && (
          <div className="w-full rounded-[16px] overflow-hidden border border-slate-200 dark:border-white/15 shadow-2xs mt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.intro_image_url}
              alt="Ảnh giới thiệu"
              className="w-full max-h-[280px] object-cover"
            />
          </div>
        )}

        {/* Video giới thiệu YouTube (nếu có) */}
        {introVideoId && (
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-[13px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Film size={15} className="text-emerald-500 dark:text-emerald-300" />
              <span>Video giới thiệu</span>
            </span>
            <YouTubeEmbed
              youtubeId={introVideoId}
              title="Video giới thiệu tác giả"
              showExternalLink={true}
            />
          </div>
        )}
      </div>
      </ScrollReveal>
    </section>
  );
}

/* =========================================================================
   2. KHỐI 2: SÁCH & TÁC PHẨM ĐÃ LÀM (AUTHOR BOOKS)
   ========================================================================= */
export interface AuthorBooksSectionProps extends AuthorSectionBaseProps {
  onSelectBook?: (book: AuthorBook) => void;
  onEditSingleBook?: (book: AuthorBook) => void;
  onMoveBook?: (index: number, direction: 'up' | 'down') => void;
  onToggleBookVisible?: (index: number) => void;
  onDeleteBook?: (index: number) => void;
}

export function AuthorBooksSection({
  profile,
  isAdmin = false,
  isHidden = false,
  onToggleVisibility,
  sectionIndex,
  totalSections,
  onMoveUp,
  onMoveDown,
  onOpenReorderModal,
  onEdit,
  onSelectBook,
  onEditSingleBook,
  onMoveBook,
  onToggleBookVisible,
  onDeleteBook,
}: AuthorBooksSectionProps) {
  const books = profile.books || [];
  const [previewBook, setPreviewBook] = useState<AuthorBook | null>(null);
  const [internalEditingBook, setInternalEditingBook] = useState<AuthorBook | null>(null);

  if (books.length === 0 && !isAdmin) return null;

  return (
    <section className="flex flex-col gap-3 mt-1">
      {/* KHỐI NÚT ĐIỀU KHIỂN DÀNH CHO ADMIN - ĐẶT TRÊN ĐẦU KHỐI */}
      {isAdmin && typeof sectionIndex === 'number' && typeof totalSections === 'number' && onMoveUp && onMoveDown && onOpenReorderModal && (
        <SectionOrderControls
          sectionTitle="TÀI LIỆU TÁC PHẨM"
          sectionIndex={sectionIndex}
          totalSections={totalSections}
          isHidden={isHidden}
          onToggleVisibility={onToggleVisibility}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onOpenReorderModal={onOpenReorderModal}
          onEdit={onEdit}
          editLabel="Cài đặt khối sách"
        />
      )}

      {/* Tiêu đề mục sách ngắn gọn 4 từ, tự co giãn xuống dòng an toàn, bỏ hẳn badge số tài liệu */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[18px] sm:text-[19px] font-extrabold text-ink leading-tight break-words line-clamp-2">
            Tài Liệu Chuyên Sâu
          </h3>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-[12.5px] text-muted">
            Một bên là tài liệu, một bên là mô tả chi tiết & video
          </p>
        </div>
      </div>

      {/* Danh sách các cuốn sách */}
      {books.length > 0 ? (
        <div className="flex flex-col gap-3.5">
          {books.map((book, idx) => {
            const hasVideo = Boolean(book.youtube_url);
            const isBookHidden = book.is_visible === false;
            if (isBookHidden && !isAdmin) return null;

            return (
              <ScrollReveal
                key={book.id}
                animation="slide-left"
                delay={idx * 140}
              >
                <div
                  onClick={() => onSelectBook?.(book)}
                  className={`p-3.5 sm:p-4 rounded-[14px] bg-white text-slate-900 border border-slate-200/80 shadow-xs hover:shadow-lg hover:shadow-blue-900/10 hover:border-blue-400/80 dark:hover:border-[#F8DF7B]/60 dark:hover:shadow-[0_12px_28px_rgba(248,223,123,0.15)] hover:-translate-y-1.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer flex flex-row gap-3 sm:gap-4 group ${
                    isBookHidden ? 'opacity-70 border-dashed border-amber-300' : ''
                  }`}
                >
                {/* BÊN TRÁI: Bìa sách to rõ chuẩn tỷ lệ 3:4 với ModernBookCover */}
                <div className="w-[116px] sm:w-[138px] aspect-[3/4] shrink-0 relative flex items-center justify-center">
                  <ModernBookCover
                    title={book.title}
                    coverUrl={book.cover_url}
                    author={profile.name || 'Tùng Dinh Dưỡng'}
                    index={idx}
                    badgeText={book.year ? `NĂM ${book.year}` : 'CHUYÊN SÂU'}
                  />

                  {/* Nhãn Đang ẩn nếu admin */}
                  {isBookHidden && isAdmin && (
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-amber-300 text-[9.5px] font-black z-30">
                      Ẩn tạm
                    </div>
                  )}
                </div>

                {/* BÊN PHẢI: Miêu tả, tiêu đề, năm phát hành & nút xem chi tiết */}
                <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {book.year && (
                        <span className="px-2 py-0.5 rounded-[5px] bg-blue-50 text-[#1E3A8A] border border-blue-200 dark:bg-purple-950/80 dark:text-purple-200 dark:border-purple-800/40 text-[10.5px] font-extrabold">
                          Năm {book.year}
                        </span>
                      )}
                      {hasVideo && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-[5px] bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800/40 text-[10.5px] font-extrabold">
                          <Play size={10} className="fill-red-600 dark:fill-red-400" />
                          <span>Có video</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-[15px] sm:text-[16.5px] font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-2 break-normal group-hover:text-[#1E3A8A] dark:group-hover:text-[#F8DF7B] transition-colors">
                      {book.title}
                    </h4>

                    <p className="text-[12px] sm:text-[12.5px] text-slate-600 dark:text-purple-200/90 leading-relaxed line-clamp-2 sm:line-clamp-3">
                      {book.description || 'Chưa có mô tả ngắn cho cuốn sách này.'}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-purple-800/40 mt-1 gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewBook(book);
                      }}
                      className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] bg-gradient-to-r from-[#FFF0BA] via-[#ECC45F] to-[#D4A028] hover:from-[#FFF5CE] hover:to-[#DFAC32] text-[#1A1608] font-black text-[12px] shadow-xs shadow-[#D4A028]/25 cursor-pointer transition-all active:scale-95 border border-[#F3D37A] overflow-hidden shrink-0"
                      title="Xem thử 3D"
                    >
                      {/* Vệt sáng Flash quét định kỳ */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-full animate-flash-sweep pointer-events-none" />
                      <BookOpen size={12} strokeWidth={2.8} className="shrink-0 text-[#1A1608]" />
                      <span>Xem thử 3D</span>
                    </button>

                    <span className="text-[12px] font-black text-[#1E3A8A] dark:text-[#F8DF7B] inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform whitespace-nowrap shrink-0 ml-auto">
                      <span>Chi tiết</span>
                      <ChevronRight size={13} strokeWidth={2.5} />
                    </span>
                  </div>

                  {isAdmin && (
                    <div
                      className="mt-2 pt-1.5 border-t border-dashed border-[#2D5B94]/25 dark:border-purple-500/30 flex items-center justify-between gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
                        Quản trị:
                      </span>
                      <div className="flex items-center gap-1">
                        {onMoveBook && (
                          <>
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => onMoveBook(idx, 'up')}
                              className="w-6 h-6 rounded-[6px] bg-slate-100 hover:bg-blue-100 dark:bg-purple-950 dark:hover:bg-purple-900 text-slate-600 dark:text-purple-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                              title="Chuyển sách lên trên"
                            >
                              <ArrowUp size={11} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === books.length - 1}
                              onClick={() => onMoveBook(idx, 'down')}
                              className="w-6 h-6 rounded-[6px] bg-slate-100 hover:bg-blue-100 dark:bg-purple-950 dark:hover:bg-purple-900 text-slate-600 dark:text-purple-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                              title="Chuyển sách xuống dưới"
                            >
                              <ArrowDown size={11} />
                            </button>
                          </>
                        )}
                        {onToggleBookVisible && (
                          <button
                            type="button"
                            onClick={() => onToggleBookVisible(idx)}
                            className={`w-6 h-6 rounded-[6px] flex items-center justify-center cursor-pointer transition-colors shadow-2xs ${
                              isBookHidden
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                                : 'bg-slate-100 hover:bg-blue-100 text-slate-600 dark:bg-purple-950 dark:text-purple-200'
                            }`}
                            title={isBookHidden ? 'Cuốn sách này đang ẨN với khách – Bấm để HIỆN' : 'Cuốn sách này đang HIỆN – Bấm để ẨN TẠM'}
                          >
                            {isBookHidden ? <EyeOff size={11} /> : <Eye size={11} />}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onEditSingleBook) {
                              onEditSingleBook(book);
                            } else {
                              setInternalEditingBook(book);
                            }
                          }}
                          className="h-6 px-2 rounded-[6px] bg-primary text-white text-[11px] font-bold flex items-center gap-1 hover:bg-primary-dark transition-colors cursor-pointer shadow-2xs"
                          title="Sửa cuốn sách này"
                        >
                          <Edit2 size={10} />
                          <span>Sửa</span>
                        </button>
                        {onDeleteBook && (
                          <button
                            type="button"
                            onClick={() => onDeleteBook(idx)}
                            className="w-6 h-6 rounded-[6px] bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                            title="Xóa cuốn sách này"
                          >
                            <Trash2 size={11} />
                          </button>
                        )}
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
        isAdmin && onEdit && (
          <div
            onClick={onEdit}
            className="p-6 rounded-[22px] bg-white border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-primary-soft/20 transition-colors shadow-2xs"
          >
            <div className="w-10 h-10 rounded-full bg-primary-soft text-primary flex items-center justify-center">
              <Plus size={20} />
            </div>
            <h4 className="text-[15px] font-extrabold text-ink">
              Chưa có sách nào trong danh sách
            </h4>
            <p className="text-[12.5px] text-muted">
              Bấm vào đây để thêm các sách đã làm (Ảnh to 3:4 bên trái, miêu tả bên phải).
            </p>
          </div>
        )
      )}

      {/* CUỐN SÁCH LẬT TRANG 3D ĐỌC THỬ (CHÂN THỰC TOÀN MÀN HÌNH THEO YÊU CẦU NGƯỜI DÙNG) */}
      <FlipbookViewer
        mode="modal-only"
        isOpen={Boolean(previewBook)}
        book={previewBook}
        title={previewBook?.title ? `Đọc thử tài liệu 3D: ${previewBook.title}` : 'Đọc thử tài liệu 3D'}
        onClose={() => setPreviewBook(null)}
      />

      {/* MODAL SỬA RIÊNG 1 CUỐN SÁCH TÁC GIẢ TỰ THÂN */}
      <EditSingleAuthorBookModal
        isOpen={Boolean(internalEditingBook)}
        book={internalEditingBook}
        onClose={() => setInternalEditingBook(null)}
        onSaved={async (updatedBook) => {
          const nextBooks = books.map((b) => (b.id === updatedBook.id ? updatedBook : b));
          const nextProfile = { ...profile, books: nextBooks };
          if (isAdmin) {
            await saveSettingsApi({ author_profile: nextProfile });
          }
          setInternalEditingBook(null);
          window.location.reload();
        }}
      />
    </section>
  );
}

/* =========================================================================
   3. KHỐI 3: TRIẾT LÝ PHỤNG SỰ (AUTHOR PHILOSOPHY)
   ========================================================================= */
export function AuthorPhilosophySection({
  profile,
  isAdmin = false,
  isHidden = false,
  onToggleVisibility,
  sectionIndex,
  totalSections,
  onMoveUp,
  onMoveDown,
  onOpenReorderModal,
  onEdit,
}: AuthorSectionBaseProps) {
  if (!profile.extra_content && !isAdmin) return null;

  const rawQuote = profile.extra_content || '';
  const cleanQuote = rawQuote.trim().replace(/^["“'”]+|["“'”]+$/g, '').trim();

  return (
    <section className="flex flex-col gap-2 mt-1">
      {/* KHỐI NÚT ĐIỀU KHIỂN DÀNH CHO ADMIN - ĐẶT TRÊN ĐẦU KHỐI */}
      {isAdmin && typeof sectionIndex === 'number' && typeof totalSections === 'number' && onMoveUp && onMoveDown && onOpenReorderModal && (
        <SectionOrderControls
          sectionTitle="TRIẾT LÝ PHỤNG SỰ"
          sectionIndex={sectionIndex}
          totalSections={totalSections}
          isHidden={isHidden}
          onToggleVisibility={onToggleVisibility}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onOpenReorderModal={onOpenReorderModal}
          onEdit={onEdit}
          editLabel="Sửa triết lý"
        />
      )}

      {/* THẺ LỜI TỰA & TRIẾT LÝ PHONG CÁCH MASTER EDITORIAL CAO CẤP */}
      <ScrollReveal animation="slide-right" delay={40}>
        <div className="relative p-4 sm:p-5 rounded-[18px] bg-gradient-to-br from-[#FCFBF7] via-[#FAF7F0] to-[#F5EFEB] text-slate-900 border border-amber-200/80 shadow-xs hover:shadow-sm dark:bg-gradient-to-br dark:from-[#19102E] dark:via-[#140C24] dark:to-[#0D071B] dark:border-amber-400/20 dark:text-white overflow-hidden flex flex-col gap-2.5">
          {/* Họa tiết dấu ngoặc kép chìm nghệ thuật góc dưới bên phải */}
          <div className="absolute -bottom-4 -right-1 text-[88px] font-serif font-black leading-none text-amber-500/[0.08] dark:text-amber-300/[0.06] pointer-events-none select-none">
            ”
          </div>

          {/* Dải tiêu đề lời tựa tinh tế */}
          <div className="flex items-center justify-between pb-1 relative z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100/90 dark:bg-amber-400/15 text-amber-700 dark:text-[#F8DF7B] shrink-0 shadow-2xs">
                <Quote size={12} className="rotate-180" strokeWidth={2.5} />
              </span>
              <h4 className="text-[12.5px] sm:text-[13px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-[#F8DF7B]">
                {profile.extra_title || 'Lời tựa & Triết lý phụng sự'}
              </h4>
            </div>
          </div>

          {/* Nội dung câu trích dẫn: Serif Italic trang trọng, sạch sẽ, không bao giờ bị nhân đôi dấu ngoặc */}
          <div className="relative z-10 pl-0.5 sm:pl-1 pr-2">
            <p className="font-serif italic text-[14.5px] sm:text-[15.5px] text-slate-800 dark:text-purple-100/95 leading-relaxed font-normal">
              &ldquo;{cleanQuote || 'Bấm sửa để thêm thông điệp triết lý phụng sự...'}&rdquo;
            </p>
          </div>

          {/* Dòng chữ ký tác giả trang trọng ở chân thẻ */}
          <div className="flex items-center justify-between pt-2.5 border-t border-amber-200/60 dark:border-amber-400/15 mt-1 relative z-10">
            <span className="text-[11px] sm:text-[11.5px] font-medium tracking-wide text-amber-700/80 dark:text-amber-300/80">
              Thông điệp từ tác giả
            </span>
            <span className="text-[12.5px] sm:text-[13px] font-bold text-slate-800 dark:text-amber-100 tracking-tight flex items-center gap-1.5">
              <span className="text-amber-500 dark:text-amber-400 font-serif">—</span>{' '}
              {profile.name && profile.name.toLowerCase().includes('tùng') ? 'Tùng Dinh Dưỡng' : (profile.name || 'Tùng Dinh Dưỡng')}
            </span>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

/* =========================================================================
   4. KHỐI 4: THÔNG TIN LIÊN HỆ & KẾT NỐI (AUTHOR CONTACT)
   ========================================================================= */
export function AuthorContactSection({
  profile,
  isAdmin = false,
  isHidden = false,
  onToggleVisibility,
  sectionIndex,
  totalSections,
  onMoveUp,
  onMoveDown,
  onOpenReorderModal,
  onEdit,
}: AuthorSectionBaseProps) {
  const hasContactInfo = Boolean(
    profile.phone ||
      profile.zalo_url ||
      profile.email ||
      profile.facebook_url ||
      profile.address ||
      profile.contact_note
  );

  if (!hasContactInfo && !isAdmin) return null;

  return (
    <section className="flex flex-col gap-2 mt-1">
      {/* KHỐI NÚT ĐIỀU KHIỂN DÀNH CHO ADMIN - ĐẶT TRÊN ĐẦU KHỐI */}
      {isAdmin && typeof sectionIndex === 'number' && typeof totalSections === 'number' && onMoveUp && onMoveDown && onOpenReorderModal && (
        <SectionOrderControls
          sectionTitle="THÔNG TIN LIÊN HỆ"
          sectionIndex={sectionIndex}
          totalSections={totalSections}
          isHidden={isHidden}
          onToggleVisibility={onToggleVisibility}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onOpenReorderModal={onOpenReorderModal}
          onEdit={onEdit}
          editLabel="Sửa liên hệ"
        />
      )}

      <ScrollReveal animation="slide-right" delay={40}>
        <div className="p-4 sm:p-5 rounded-[14px] bg-white text-slate-900 border border-slate-200/80 shadow-xs hover:shadow-sm dark:bg-gradient-to-br dark:from-[#1C123D] dark:via-[#160D30] dark:to-[#0E0720] dark:border-white/15 dark:text-white flex flex-col gap-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-purple-800/40 pb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-[8px] bg-blue-50 text-[#1E3A8A] border border-blue-200 dark:bg-[#F8DF7B] dark:text-[#160C2C] dark:border-0 flex items-center justify-center shrink-0 shadow-xs">
                <PhoneCall size={16} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h3 className="text-[16px] font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                  Thông tin liên hệ & Kết nối
                </h3>
                <span className="text-[12px] text-slate-500 dark:text-purple-300/80 truncate block">
                  Kết nối trực tiếp cùng chuyên gia / tác giả
                </span>
              </div>
            </div>
          </div>

          {/* Lời nhắn kết nối */}
          {profile.contact_note && (
            <p className="text-[14px] text-slate-600 dark:text-purple-200/90 leading-relaxed font-normal">
              {profile.contact_note}
            </p>
          )}

          {/* Các nút gọi điện & nhắn tin nhanh */}
          <div className="flex flex-col gap-2.5 pt-0.5">
            {profile.phone && (
              <a
                href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
                className="group relative flex items-center justify-between p-3 px-3.5 rounded-[14px] bg-gradient-to-r from-blue-50/70 via-slate-50 to-blue-50/50 border border-blue-200/80 text-slate-900 shadow-xs hover:border-[#1E3A8A] dark:bg-gradient-to-r dark:from-[#3B1F7A] dark:via-[#2A1359] dark:to-[#160833] dark:text-white dark:border-amber-300/60 overflow-hidden gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                {/* Tia sáng viền trên */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#1E3A8A]/30 dark:via-amber-300/60 to-transparent" />

                <div className="flex items-center gap-2.5 min-w-0 z-10">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1E3A8A] dark:bg-gradient-to-br dark:from-amber-200 dark:to-amber-500 dark:text-slate-900 flex items-center justify-center shrink-0 shadow-xs">
                    <Phone size={16} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] text-slate-500 dark:text-amber-200 font-bold uppercase tracking-wider leading-tight">Hotline tư vấn</span>
                    <span className="text-[14.5px] sm:text-[15.5px] font-black tracking-wide truncate text-[#1E3A8A] dark:text-white drop-shadow-xs">{profile.phone}</span>
                  </div>
                </div>
                <span className="z-10 text-[12px] font-black px-3 py-1 rounded-[9px] bg-[#1E3A8A] text-white hover:bg-[#172554] dark:bg-gradient-to-b dark:from-amber-300 dark:to-amber-500 dark:text-slate-900 shrink-0 whitespace-nowrap shadow-xs group-hover:scale-105 transition-transform">Gọi ngay</span>
              </a>
            )}

            {profile.zalo_url && (
              <a
                href={profile.zalo_url.startsWith('http') ? profile.zalo_url : `https://zalo.me/${profile.zalo_url.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-between p-3 px-3.5 rounded-[14px] bg-[#0068FF] text-white border-2 border-sky-200 shadow-sm hover:bg-[#0056D2] hover:border-white active:scale-[0.98] transition-all gap-2 overflow-hidden"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-extrabold text-[15px] shrink-0">
                    Z
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] text-white/90 font-medium leading-tight">Chat Zalo</span>
                    <span className="text-[14px] sm:text-[15px] font-extrabold truncate">Nhắn tin trực tiếp</span>
                  </div>
                </div>
                <span className="text-[12px] font-bold px-2.5 py-1 rounded-[8px] bg-white/20 shrink-0 whitespace-nowrap">Mở Zalo</span>
              </a>
            )}
          </div>

          {/* Chi tiết phụ: Facebook, Email, Địa chỉ */}
          {(profile.address || profile.email || profile.facebook_url) && (
            <div className="flex flex-col gap-2 pt-2 text-[13px] text-slate-600 dark:text-muted border-t border-slate-100 dark:border-line/60">
              {profile.address && (
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-[#1E3A8A] dark:text-primary shrink-0" />
                  <span className="text-slate-800 dark:text-ink/80 font-medium">{profile.address}</span>
                </div>
              )}
              {profile.email && (
                <div className="flex items-center gap-2">
                  <Mail size={15} className="text-[#1E3A8A] dark:text-primary shrink-0" />
                  <a href={`mailto:${profile.email}`} className="text-[#1E3A8A] dark:text-primary font-bold hover:underline">
                    {profile.email}
                  </a>
                </div>
              )}
              {profile.facebook_url && (
                <div className="flex items-center gap-2">
                  <Globe size={15} className="text-[#1E3A8A] dark:text-primary shrink-0" />
                  <a
                    href={profile.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1E3A8A] dark:text-primary font-bold hover:underline"
                  >
                    Kênh cá nhân / Fanpage Facebook
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}

/* =========================================================================
   5. COMPOSITE COMPONENT: AuthorIntroSection (Renders all 4 for fallback)
   ========================================================================= */
interface AuthorIntroSectionProps {
  initialProfile?: AuthorProfile | null;
  sectionIndex?: number;
  totalSections?: number;
  isHidden?: boolean;
  onToggleVisibility?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onOpenReorderModal?: () => void;
}

export default function AuthorIntroSection({
  initialProfile,
  sectionIndex,
  totalSections,
  isHidden = false,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  onOpenReorderModal,
}: AuthorIntroSectionProps) {
  const [profile, setProfile] = useState<AuthorProfile>(() => normalizeAuthorProfile(initialProfile));
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedBook, setSelectedBook] = useState<AuthorBook | null>(null);
  const [editingSingleBook, setEditingSingleBook] = useState<AuthorBook | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalTab, setModalTab] = useState<'author' | 'books' | 'contact' | 'extra'>('author');

  useEffect(() => {
    checkIsAdminClient().then(setIsAdmin);
    if (initialProfile) {
      setProfile(normalizeAuthorProfile(initialProfile));
    }
  }, [initialProfile]);

  const openModalWithTab = (tab: 'author' | 'books' | 'contact' | 'extra') => {
    setModalTab(tab);
    setShowEditModal(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <AuthorProfileSection
        profile={profile}
        isAdmin={isAdmin}
        sectionIndex={sectionIndex}
        totalSections={totalSections}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onOpenReorderModal={onOpenReorderModal}
        onEdit={() => openModalWithTab('author')}
      />

      <AuthorBooksSection
        profile={profile}
        isAdmin={isAdmin}
        onEdit={() => openModalWithTab('books')}
        onEditSingleBook={(b) => setEditingSingleBook(b)}
        onSelectBook={(b) => setSelectedBook(b)}
      />

      <AuthorPhilosophySection
        profile={profile}
        isAdmin={isAdmin}
        onEdit={() => openModalWithTab('extra')}
      />

      <AuthorContactSection
        profile={profile}
        isAdmin={isAdmin}
        onEdit={() => openModalWithTab('contact')}
      />

      {/* Modal chi tiết sách */}
      {selectedBook && (
        <BookDetailModal
          book={{
            ...selectedBook,
            author: profile.name,
            type: 'author',
          }}
          isAdmin={isAdmin}
          onClose={() => setSelectedBook(null)}
          onEdit={() => {
            const b = selectedBook;
            setSelectedBook(null);
            setEditingSingleBook(b);
          }}
        />
      )}

      {/* Modal chỉnh sửa của Admin */}
      {showEditModal && (
        <EditAuthorModal
          isOpen={true}
          initialProfile={profile}
          initialTab={modalTab}
          onClose={() => setShowEditModal(false)}
          onSaved={(newProfile) => {
            setProfile(newProfile);
          }}
        />
      )}

      {/* Modal Chỉnh sửa ĐÚNG 1 CUỐN SÁCH của tác giả */}
      <EditSingleAuthorBookModal
        isOpen={Boolean(editingSingleBook)}
        book={editingSingleBook}
        onClose={() => setEditingSingleBook(null)}
        onSaved={async (updatedBook) => {
          const nextBooks = (profile.books || []).map((b) => (b.id === updatedBook.id ? updatedBook : b));
          const nextProfile = { ...profile, books: nextBooks };
          setProfile(nextProfile);
          if (isAdmin) {
            await saveSettingsApi({ author_profile: nextProfile });
          }
          setEditingSingleBook(null);
        }}
      />
    </div>
  );
}
