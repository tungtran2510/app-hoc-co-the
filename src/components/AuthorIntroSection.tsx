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
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  Trash2,
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
  Quote,
  X,
  MessageCircle,
  FileText,
  ArrowLeft,
  Search,
} from 'lucide-react';
import { AuthorProfile, AuthorBook, RecommendedBook } from '../lib/types';
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

export interface AuthorProfileSectionProps extends AuthorSectionBaseProps {
  onEditPhilosophy?: () => void;
  showPhilosophy?: boolean;
}

/* =========================================================================
   MODAL CHI TIẾT HỒ SƠ CHUYÊN GIA (AUTHOR BIO DETAIL MODAL)
   ========================================================================= */
export interface AuthorBioDetailModalProps {
  profile: AuthorProfile;
  onClose: () => void;
}

export function AuthorBioDetailModal({ profile, onClose }: AuthorBioDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const rawQuote = profile.extra_content || '';
  const cleanPhilosophyQuote = rawQuote.trim().replace(/^["“'”]+|["“'”]+$/g, '').trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-[#181132] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/15 p-5 sm:p-6 flex flex-col gap-4 text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng modal */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
          title="Đóng"
        >
          <X size={18} />
        </button>

        {/* Tiêu đề Modal */}
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <ShieldCheck size={16} className="text-amber-600 dark:text-amber-400" />
          <span className="text-[11.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Hồ sơ chuyên gia
          </span>
        </div>

        {/* Khối chuyên gia header */}
        <div className="flex items-center gap-3.5 pt-1">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-white/10 shrink-0 border-2 border-amber-500/40 dark:border-amber-400/40 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.avatar_url || '/images/author_tung.png'}
              alt={profile.name || 'Tùng Dinh Dưỡng'}
              className="w-full h-full object-cover object-[50%_15%]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/author_tung.png';
              }}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-[18px] sm:text-[20px] font-black tracking-tight text-slate-900 dark:text-white uppercase">
                {profile.name || 'Tùng Dinh Dưỡng'}
              </h4>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black shrink-0">
                <Check size={10} strokeWidth={3.5} />
              </span>
            </div>
            {profile.title && (
              <p className="text-[12.5px] font-semibold text-amber-800 dark:text-amber-300">
                {profile.title.replace(/\.$/, '')}
              </p>
            )}
          </div>
        </div>

        {/* Tiểu sử đầy đủ */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 dark:border-white/10">
          <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Giới thiệu &amp; Chuyên môn
          </span>
          <p className="text-[13px] sm:text-[13.5px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {profile.bio || 'Hơn 10 năm nghiên cứu và ứng dụng giải phẫu cơ xương khớp, dinh dưỡng sinh học và phục hồi chức năng tự nhiên.'}
          </p>
        </div>

        {/* Lời tựa / Triết lý nếu có */}
        {cleanPhilosophyQuote && (
          <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-slate-800/60 border border-amber-200/80 dark:border-slate-700 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
              <Quote size={13} className="rotate-180" strokeWidth={2.5} />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {profile.extra_title || 'Triết lý phụng sự'}
              </span>
            </div>
            <p className="italic text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed">
              &ldquo;{cleanPhilosophyQuote}&rdquo;
            </p>
          </div>
        )}

        {/* Kênh kết nối & Tư vấn */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
          <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Kết nối &amp; Tư vấn
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {profile.phone && (
              <a
                href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-amber-400 hover:bg-amber-50/40 dark:hover:bg-slate-800/40 transition-all text-slate-800 dark:text-slate-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone size={15} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10.5px] text-slate-400 font-medium">Hotline tư vấn</span>
                  <span className="text-[12px] font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-700 dark:group-hover:text-amber-300">
                    {profile.phone}
                  </span>
                </div>
              </a>
            )}

            {profile.zalo_url && (
              <a
                href={profile.zalo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-amber-400 hover:bg-amber-50/40 dark:hover:bg-slate-800/40 transition-all text-slate-800 dark:text-slate-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <MessageCircle size={15} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10.5px] text-slate-400 font-medium">Kênh Zalo</span>
                  <span className="text-[12px] font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-700 dark:group-hover:text-amber-300">
                    Nhắn tin trực tiếp
                  </span>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Nút đóng */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-[12.5px] font-semibold transition-colors cursor-pointer text-center"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   1. KHỐI 1: HỒ SƠ TÁC GIẢ & CHUYÊN GIA (AUTHOR PROFILE - SINGLE UNIFIED CARD)
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
  onEditPhilosophy,
  showPhilosophy = true,
}: AuthorProfileSectionProps) {
  const [showBioModal, setShowBioModal] = useState(false);
  const introVideoId = profile.intro_video_url ? extractYouTubeId(profile.intro_video_url) : null;
  const rawQuote = profile.extra_content || '';
  const cleanPhilosophyQuote = rawQuote.trim().replace(/^["“'”]+|["“'”]+$/g, '').trim();

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

      {/* THẺ MASTER SINGLE CARD (ĐÚNG 1 KHUNG DUY NHẤT, NỀN TRẮNG SẠCH ĐỒNG BỘ APP) */}
      <ScrollReveal animation="slide-left" delay={40}>
        <div className="relative p-4 sm:p-5 rounded-[16px] bg-white text-slate-900 border border-slate-200/80 shadow-xs hover:shadow-sm dark:bg-gradient-to-br dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0B132B] dark:border-white/15 dark:text-white overflow-hidden flex flex-col gap-3">
          {/* Họa tiết trang trí viền cao cấp góc phải */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10 dark:opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200 dark:from-blue-400 via-transparent to-transparent" />

          {/* 1. Phần Tiêu Đề Tác GiẢ Ở Trên Cùng (Editorial Magazine Header) */}
          <div className="relative z-10 flex flex-col gap-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[22px] sm:text-[25px] font-black tracking-tight text-slate-900 dark:text-white uppercase leading-tight">
                {profile.name || 'Tùng Dinh Dưỡng'}
              </h3>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-slate-950 shrink-0 shadow-2xs" title="Chuyên gia được xác thực">
                <Check size={11} strokeWidth={3.5} />
              </span>
            </div>

            {profile.title && (
              <p className="text-[12.5px] sm:text-[13px] font-semibold text-amber-700 dark:text-amber-300 tracking-wide">
                {profile.title.replace(/\.$/, '')}
              </p>
            )}
          </div>

          {/* 2. Phần Thân: Avatar vòm mềm nghệ thuật (Anti-Nested-Frame) + Tiểu sử & Nút xem chi tiết bên cạnh */}
          <div className="relative z-10 flex items-stretch gap-3.5 sm:gap-4 pt-0.5">
            {/* Ảnh chân dung chuyên gia - Dáng vòm mềm bất đối xứng, không viền hộp chữ nhật thô cứng */}
            <div className="w-[115px] sm:w-[128px] aspect-[4/5] rounded-tl-[14px] rounded-tr-[38px] rounded-bl-[14px] rounded-br-[22px] overflow-hidden bg-slate-100 dark:bg-[#241548] shrink-0 shadow-sm relative self-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar_url || '/images/author_tung.png'}
                alt={profile.name || 'Tùng Dinh Dưỡng'}
                className="w-full h-full object-cover object-[50%_15%] scale-105 transition-transform duration-300 hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/author_tung.png';
                }}
              />
            </div>

            <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5 self-stretch">
              {profile.bio && (
                <p className="text-[12px] sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal font-sans line-clamp-4">
                  {profile.bio}
                </p>
              )}

              {/* Nút Xem chi tiết - Viền mỏng Amber tinh tế */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowBioModal(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-[7px] border border-amber-600/70 dark:border-amber-400/70 text-amber-800 dark:text-amber-200 text-[11px] sm:text-[11.5px] font-semibold bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100/80 dark:hover:bg-amber-900/40 active:scale-[0.98] transition-all cursor-pointer group shadow-2xs"
                  title="Xem chi tiết hồ sơ chuyên gia"
                >
                  <span>Xem chi tiết</span>
                  <ChevronRight size={12} strokeWidth={2.5} className="text-amber-800 dark:text-amber-200 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Ảnh minh họa thêm (nếu có) */}
          {profile.intro_image_url && (
            <div className="w-full rounded-[14px] overflow-hidden border border-slate-200 dark:border-white/15 shadow-2xs mt-1">
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

          {/* 2. LỜI TỰA / TRIẾT LÝ PHỤNG SỰ (LIỀN MẠCH TRONG CÙNG 1 KHUNG DUY NHẤT, NỀN TRẮNG ĐỒNG BỘ) */}
          {showPhilosophy && cleanPhilosophyQuote && (
            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex flex-col gap-1.5 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Quote size={12} className="rotate-180 text-amber-600 dark:text-amber-400" strokeWidth={2.5} />
                  <span className="text-[11px] sm:text-[11.5px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    {profile.extra_title || 'Triết lý phụng sự'}
                  </span>
                </div>
                {isAdmin && onEditPhilosophy && (
                  <button
                    type="button"
                    onClick={onEditPhilosophy}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[11px] font-medium hover:bg-slate-200 dark:hover:bg-white/15 cursor-pointer"
                    title="Sửa lời tựa"
                  >
                    <Edit2 size={11} />
                    <span>Sửa lời tựa</span>
                  </button>
                )}
              </div>

              <p className="italic text-[14px] sm:text-[14.5px] text-slate-700 dark:text-slate-200 leading-relaxed font-normal pl-0.5">
                &ldquo;{cleanPhilosophyQuote}&rdquo;
              </p>

              <div className="text-right pt-0.5">
                <span className="text-[12.5px] sm:text-[13px] font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                  — {profile.name || 'Tùng Dinh Dưỡng'}
                </span>
              </div>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Modal chi tiết hồ sơ chuyên gia */}
      {showBioModal && (
        <AuthorBioDetailModal
          profile={profile}
          onClose={() => setShowBioModal(false)}
        />
      )}
    </section>
  );
}

/* =========================================================================
   2. KHỐI 2: SÁCH & TÁC PHẨM ĐÃ LÀM (AUTHOR BOOKS)
   ========================================================================= */
export interface AuthorBooksSectionProps extends AuthorSectionBaseProps {
  supplementalBooks?: RecommendedBook[];
  onSelectBook?: (book: AuthorBook) => void;
  onEditSingleBook?: (book: AuthorBook) => void;
  onMoveBook?: (index: number, direction: 'up' | 'down') => void;
  onToggleBookVisible?: (index: number) => void;
  onDeleteBook?: (index: number) => void;
}

export function AuthorBooksSection({
  profile,
  supplementalBooks = [],
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
  const displayBooks: AuthorBook[] = isAdmin
    ? books
    : [
        ...books,
        ...supplementalBooks.map((book) => ({
          id: `supplemental-${book.id}`,
          title: book.title,
          cover_url: book.cover_url,
          description: book.description,
          year: book.badge_tag?.match(/\b20\d{2}\b/)?.[0],
          youtube_url: book.youtube_url,
          gallery_images: book.gallery_images,
          flipbook_pages: book.flipbook_pages,
          file_url: book.file_url,
          file_name: book.file_name,
          pdf_url: book.pdf_url,
          is_visible: book.is_visible,
        })),
      ];
  const [previewBook, setPreviewBook] = useState<AuthorBook | null>(null);
  const [videoBook, setVideoBook] = useState<AuthorBook | null>(null);
  const [internalEditingBook, setInternalEditingBook] = useState<AuthorBook | null>(null);

  if (displayBooks.length === 0 && !isAdmin) return null;

  return (
    <section className="flex flex-col gap-2 mt-1 rounded-[18px] bg-[#F7F8FC] dark:bg-transparent px-0 py-0.5">
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

      {/* Tiêu đề mục sách tác giả */}
      <div className="flex flex-col gap-1 text-center">
        <div className="grid grid-cols-[30px_1fr_30px] items-center gap-1 px-0.5">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full text-[#071735] transition-colors hover:bg-white dark:hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#071735] dark:text-white"
            aria-label="Quay lại"
          >
            <ArrowLeft size={20} strokeWidth={2.6} />
          </button>
          <h3 className="text-[18px] sm:text-[22px] font-black tracking-tight text-[#071735] dark:text-white leading-tight break-words line-clamp-2">
            {profile.books_title || 'Sách & Tác phẩm đã làm'}
          </h3>
          <a
            href="/tim-kiem"
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full text-[#071735] transition-colors hover:bg-white dark:hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#071735] dark:text-white"
            aria-label="Tìm kiếm"
          >
            <Search size={20} strokeWidth={2.6} />
          </a>
        </div>
        {profile.books_subtitle && (
          <p className="text-[12px] sm:text-[12.5px] text-slate-500 dark:text-slate-400 leading-normal">
            {profile.books_subtitle}
          </p>
        )}
      </div>

      {/* Danh sách các cuốn sách */}
      {displayBooks.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {displayBooks.map((book, idx) => {
            const hasVideo = Boolean(book.youtube_url);
            const isBookHidden = book.is_visible === false;
            if (isBookHidden && !isAdmin) return null;

            return (
              <React.Fragment key={book.id}>
              {idx === 1 && (
                <div className="col-span-2 flex items-center justify-between pt-1">
                  <h4 className="text-[15px] sm:text-[18px] font-black tracking-tight text-[#071735] dark:text-white">
                    Các tác phẩm khác
                  </h4>
                  <div className="flex items-center gap-1.5 text-[#071735] dark:text-white">
                    <button type="button" className="flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-[#241548] dark:border dark:border-white/15 shadow-sm" aria-label="Tác phẩm trước">
                      <ChevronLeft size={16} strokeWidth={2.5} />
                    </button>
                    <button type="button" className="flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-[#241548] dark:border dark:border-white/15 shadow-sm" aria-label="Tác phẩm tiếp theo">
                      <ChevronRight size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              )}
              <ScrollReveal
                animation="slide-left"
                delay={idx * 140}
                className={idx === 0 ? 'col-span-2' : ''}
              >
                <div
                  className={`h-full bg-white text-slate-900 border border-slate-200/70 dark:bg-[#1A1236] dark:text-white dark:border-white/10 shadow-[0_10px_30px_-20px_rgba(15,23,42,.38)] transition-all duration-300 flex group ${idx === 0 ? 'flex-row gap-2.5 p-2.5 sm:gap-4 sm:p-4 rounded-[18px]' : 'flex-col gap-0.5 p-1 pb-2 rounded-[14px]'} ${
                    isBookHidden ? 'opacity-70 border-dashed border-amber-300' : ''
                  }`}
                >
                  {/* BÊN TRÁI: Bìa sách to rõ chuẩn tỷ lệ 3:4 với ModernBookCover */}
                  <div
                    onClick={() => onSelectBook?.(book)}
                    className={`${idx === 0 ? 'w-[35%] max-w-[205px]' : 'w-[96%] mx-auto'} aspect-[3/4] shrink-0 relative flex items-center justify-center cursor-pointer`}
                  >
                    <ModernBookCover
                      title={book.title}
                      coverUrl={book.cover_url}
                      author={profile.name || 'Tùng Dinh Dưỡng'}
                      index={idx}
                      badgeText={book.year ? `NĂM ${book.year}` : 'NỔI BẬT'}
                    />

                    {/* Nhãn Đang ẩn nếu admin */}
                    {isBookHidden && isAdmin && (
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-amber-300 text-[9.5px] font-black z-30">
                        Ẩn tạm
                      </div>
                    )}
                  </div>

                  {/* BÊN PHẢI: Tag videos, Tiêu đề, Khung Xem thử 3D màu vàng ở TRÊN, Chi tiết sách ở DƯỚI */}
                  <div className={`flex-1 flex flex-col justify-between min-w-0 ${idx === 0 ? 'py-1' : 'py-0'}`}>
                    <div className="flex flex-col gap-1.5">
                      <h4
                        onClick={() => onSelectBook?.(book)}
                        className={`${idx === 0 ? 'text-[17px] sm:text-[24px] font-black text-left' : 'w-full px-2 text-[10px] sm:text-[11.5px] font-bold text-center min-h-[25px] flex items-center justify-center [overflow-wrap:anywhere]'} text-[#071735] dark:text-[#93C5FD] leading-[1.15] line-clamp-2 break-normal cursor-pointer`}
                      >
                        {book.title}
                      </h4>
                      {book.description && idx === 0 && (
                        <p className="text-[11px] sm:text-[13px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-normal font-normal">
                          {book.description}
                        </p>
                      )}
                      {idx === 0 && (
                        <p className="mt-0.5 text-[11px] sm:text-[12.5px] text-slate-500 dark:text-slate-400">
                          Tác giả: <strong className="text-slate-800 dark:text-white">{profile.name || 'Tùng Dinh Dưỡng'}</strong>
                        </p>
                      )}
                    </div>

                    {/* CỤM HÀNH ĐỘNG: Xem thử 3D màu vàng sáng full bề ngang, Chi tiết sách ở DƯỚI */}
                    <div className={`${idx === 0 ? 'pt-2' : 'pt-1'} flex flex-col gap-1.5 mt-auto`}>
                      {idx === 0 ? (
                        <div className="grid grid-cols-[.78fr_.88fr_1.45fr] overflow-hidden rounded-[14px] border border-amber-300 dark:border-amber-400/60 bg-white dark:bg-[#241548] shadow-[0_7px_22px_-12px_rgba(245,158,11,.65)]">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); if (hasVideo) setVideoBook(book); }}
                            className="flex min-h-[42px] flex-col items-center justify-center gap-0.5 border-r border-slate-200 dark:border-white/15 text-[8.5px] sm:text-[10px] font-bold text-[#071735] dark:text-white cursor-pointer"
                            aria-disabled={!hasVideo}
                          >
                            <Play size={15} className="fill-red-600 text-red-600" />
                            <span>Video</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onSelectBook?.(book); }}
                            className="flex min-h-[42px] flex-col items-center justify-center gap-0.5 border-r border-slate-200 dark:border-white/15 text-[8.5px] sm:text-[10px] font-bold text-[#071735] dark:text-white"
                          >
                            <FileText size={15} />
                            <span>Chi tiết</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setPreviewBook(book); }}
                            className="flex min-h-[42px] items-center justify-center gap-1 bg-gradient-to-r from-[#FFE36C] to-[#FFC400] px-1 text-[9px] sm:text-[11px] font-black text-[#071735]"
                          >
                            <BookOpen size={16} strokeWidth={2.4} />
                            <span>Xem thử 3D</span>
                          </button>
                        </div>
                      ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewBook(book);
                        }}
                        className="relative mx-auto h-[26px] w-[calc(100%_-_12px)] sm:h-[30px] sm:w-[calc(100%_-_16px)] rounded-full bg-gradient-to-r from-[#FFE36C] to-[#FFC400] text-[#071735] font-black text-[9.5px] sm:text-[10.5px] shadow-[0_6px_15px_-10px_rgba(245,158,11,.8)] flex items-center justify-center gap-1 active:scale-[0.98] cursor-pointer border border-[#FFD52F]"
                        title="Xem thử 3D"
                      >
                        <BookOpen size={13} strokeWidth={2.2} className="shrink-0 text-[#1E293B]" />
                        <span className="tracking-[0.025em]">Xem thử 3D</span>
                      </button>
                      )}

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
                        {onMoveBook && (
                          <>
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => onMoveBook(idx, 'up')}
                              className="w-6 h-6 rounded-[6px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                              title="Chuyển sách lên trên"
                            >
                              <ArrowUp size={11} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === displayBooks.length - 1}
                              onClick={() => onMoveBook(idx, 'down')}
                              className="w-6 h-6 rounded-[6px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
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
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-200'
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
            </React.Fragment>
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
      {/* POPUP VIDEO: phát ngay trong app, không chuyển sang YouTube */}
      {videoBook && extractYouTubeId(videoBook.youtube_url || '') && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-3 backdrop-blur-xs"
          onClick={() => setVideoBook(null)}
        >
          <div
            className="relative w-full max-w-[560px] rounded-2xl bg-white dark:bg-[#181132] p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="line-clamp-1 text-[13px] font-bold text-slate-900 dark:text-white">{videoBook.title}</span>
              <button
                type="button"
                onClick={() => setVideoBook(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white cursor-pointer"
                aria-label="Đóng video"
              >
                <X size={16} />
              </button>
            </div>
            <YouTubeEmbed
              youtubeId={extractYouTubeId(videoBook.youtube_url || '') as string}
              title={videoBook.title}
              autoplay={true}
              showExternalLink={false}
            />
          </div>
        </div>
      )}

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

      <ScrollReveal animation="slide-right" delay={40}>
        <div className="p-4 sm:p-5 rounded-[14px] bg-white text-slate-900 border border-slate-200/80 shadow-xs hover:shadow-sm dark:bg-gradient-to-br dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0B132B] dark:border-white/15 dark:text-white flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-[#F8DF7B]">
              <Sparkles size={16} strokeWidth={2.5} />
              <h4 className="text-[13.5px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-[#F8DF7B]">
                {profile.extra_title || 'Triết lý phụng sự'}
              </h4>
            </div>
          </div>

          <p className="text-[14px] sm:text-[15px] font-medium text-slate-700 dark:text-slate-200 leading-relaxed pt-1 italic">
            &ldquo;{profile.extra_content || 'Bấm sửa để thêm thông điệp triết lý phụng sự...'}&rdquo;
          </p>
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
        <div className="p-4 sm:p-5 rounded-[16px] bg-white text-slate-900 border border-slate-200 shadow-sm dark:bg-[#111827] dark:border-white/15 dark:text-white flex flex-col gap-3.5">
          <div className="flex items-center gap-2.5 min-w-0 pb-3 border-b border-slate-200 dark:border-white/10">
            <div className="w-8 h-8 rounded-[10px] bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-white flex items-center justify-center shrink-0">
              <PhoneCall size={16} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[16px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                {profile.contact_title || 'Thông tin liên hệ & Kết nối'}
              </h3>
              <span className="text-[12.5px] text-slate-600 dark:text-slate-300 truncate block">
                {profile.contact_subtitle || 'Kết nối trực tiếp cùng chuyên gia / tác giả'}
              </span>
            </div>
          </div>

          {profile.contact_note && (
            <p className="text-[14px] text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              {profile.contact_note}
            </p>
          )}

          <div className="flex flex-col gap-2.5">
            {profile.zalo_url && (
              <a
                href={profile.zalo_url.startsWith('http') ? profile.zalo_url : `https://zalo.me/${profile.zalo_url.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 px-3.5 rounded-[12px] bg-[#0068FF] text-white hover:bg-[#0057d9] active:scale-[0.98] transition-all gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-white text-[#0068FF] flex items-center justify-center font-black text-[17px] shrink-0">Z</div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] text-white font-medium leading-tight">Chat Zalo</span>
                    <span className="text-[15px] font-bold truncate">Nhắn tin trực tiếp</span>
                  </div>
                </div>
                <span className="text-[12.5px] font-bold px-3 py-1.5 rounded-[8px] bg-white text-[#0068FF] shrink-0 whitespace-nowrap">Mở Zalo</span>
              </a>
            )}

            {profile.phone && (
              <a
                href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center justify-between p-3 px-3.5 rounded-[12px] bg-slate-50 border border-slate-300 text-slate-900 hover:bg-slate-100 dark:bg-[#1F2937] dark:border-white/20 dark:text-white dark:hover:bg-[#273449] gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center shrink-0">
                    <Phone size={16} strokeWidth={2.4} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] text-slate-600 dark:text-slate-300 font-medium leading-tight">Hotline tư vấn</span>
                    <span className="text-[16px] font-bold tracking-wide truncate text-slate-900 dark:text-white">{profile.phone}</span>
                  </div>
                </div>
                <span className="text-[12.5px] font-bold px-3 py-1.5 rounded-[8px] bg-slate-900 text-white dark:bg-white dark:text-slate-900 shrink-0 whitespace-nowrap">Gọi ngay</span>
              </a>
            )}
          </div>

          {(profile.address || profile.email || profile.facebook_url) && (
            <div className="flex flex-col gap-2.5 pt-3 text-[13.5px] border-t border-slate-200 dark:border-white/10">
              {profile.address && (
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-slate-500 dark:text-slate-300 shrink-0" />
                  <span className="text-slate-800 dark:text-slate-100 font-medium">{profile.address}</span>
                </div>
              )}
              {profile.email && (
                <div className="flex items-center gap-2">
                  <Mail size={15} className="text-slate-500 dark:text-slate-300 shrink-0" />
                  <a href={`mailto:${profile.email}`} className="text-slate-900 dark:text-white font-semibold hover:underline">{profile.email}</a>
                </div>
              )}
              {profile.facebook_url && (
                <div className="flex items-center gap-2">
                  <Globe size={15} className="text-slate-500 dark:text-slate-300 shrink-0" />
                  <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer" className="text-[#0068FF] dark:text-[#6AA5FF] font-semibold hover:underline">Kênh cá nhân / Fanpage Facebook</a>
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
