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
} from 'lucide-react';
import { AuthorProfile, AuthorBook } from '../lib/types';
import { normalizeAuthorProfile } from '../lib/data';
import { checkIsAdminClient } from '../lib/adminAuth';
import { extractYouTubeId } from '../lib/youtube';
import BookDetailModal from './BookDetailModal';
import EditAuthorModal from './admin/EditAuthorModal';
import SectionOrderControls from './admin/SectionOrderControls';

export interface AuthorSectionBaseProps {
  profile: AuthorProfile;
  isAdmin?: boolean;
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
      {isAdmin && (
        <div className="flex items-center justify-end gap-2 -mb-2">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1.5 h-7 px-2.5 rounded-[9px] bg-primary-soft text-primary text-[11.5px] font-extrabold hover:bg-primary-soft/80 cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
            >
              <Edit2 size={11} />
              <span>Sửa tác giả</span>
            </button>
          )}

          {typeof sectionIndex === 'number' && typeof totalSections === 'number' && onMoveUp && onMoveDown && onOpenReorderModal && (
            <SectionOrderControls
              sectionIndex={sectionIndex}
              totalSections={totalSections}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onOpenReorderModal={onOpenReorderModal}
              className="ml-auto"
            />
          )}
        </div>
      )}

      {/* THẺ MASTER INSTRUCTOR PROFILE CARD CAO CẤP */}
      <div className="relative p-4 sm:p-5 rounded-[20px] bg-white text-slate-900 border border-slate-200 border-l-[4px] border-l-[#1E3A8A] shadow-md dark:bg-gradient-to-br dark:from-[#1C123D] dark:via-[#160D30] dark:to-[#0E0720] dark:border-t-white/15 dark:border-r-black/50 dark:border-b-black/70 dark:border-l-[#A78BFA] dark:text-white overflow-hidden flex flex-col gap-3">
        {/* Họa tiết trang trí viền cao cấp góc phải */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 dark:opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-300 dark:from-amber-400 via-transparent to-transparent" />

        {/* 1. Phần Đầu: Chân dung bên trái + Tên & Sứ mệnh bên phải */}
        <div className="relative z-10 flex items-start gap-3.5 sm:gap-4">
          {/* Ảnh chân dung chuyên gia */}
          <div className="w-[96px] sm:w-[110px] aspect-[4/5] rounded-[14px] overflow-hidden bg-slate-100 dark:bg-[#241548] shrink-0 border-2 border-blue-200 dark:border-purple-400/50 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/author_tung.png"
              alt={profile.name || 'Tùng Dinh Dưỡng'}
              className="w-full h-full object-cover"
              onError={(e) => {
                if (profile.avatar_url) (e.target as HTMLImageElement).src = profile.avatar_url;
              }}
            />
          </div>

          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <h3 className="text-[19px] sm:text-[21px] font-black text-slate-900 dark:text-white leading-tight truncate">
              {profile.name || 'Tùng Dinh Dưỡng'}
            </h3>
            <p className="text-[10.5px] sm:text-[11.5px] font-black tracking-wider text-[#1E3A8A] dark:text-[#F8DF7B] uppercase leading-tight">
              {profile.title || 'CHUYÊN GIA DINH DƯỠNG & ĐÀO TẠO Y KHOA'}
            </p>
            {profile.bio && (
              <p className="text-[12.5px] sm:text-[13px] text-slate-600 dark:text-purple-200/90 leading-relaxed line-clamp-4 mt-1 font-normal">
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
            <div className="relative w-full aspect-video rounded-[16px] overflow-hidden border border-slate-200 dark:border-white/15 bg-black shadow-xs">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${introVideoId}?rel=0`}
                title="Video giới thiệu tác giả"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================================
   2. KHỐI 2: SÁCH & TÁC PHẨM ĐÃ LÀM (AUTHOR BOOKS)
   ========================================================================= */
export interface AuthorBooksSectionProps extends AuthorSectionBaseProps {
  onSelectBook?: (book: AuthorBook) => void;
}

export function AuthorBooksSection({
  profile,
  isAdmin = false,
  sectionIndex,
  totalSections,
  onMoveUp,
  onMoveDown,
  onOpenReorderModal,
  onEdit,
  onSelectBook,
}: AuthorBooksSectionProps) {
  const books = profile.books || [];

  if (books.length === 0 && !isAdmin) return null;

  return (
    <section className="flex flex-col gap-3 mt-1">
      {/* Tiêu đề mục sách & Nút Sửa sách (2 hàng gọn gàng, không rớt chữ) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-[19px] font-extrabold text-ink leading-tight whitespace-nowrap">
              Sách & Tác phẩm đã làm
            </h3>
            {books.length > 0 && (
              <span className="text-[11.5px] font-extrabold text-[#1E3A8A] bg-blue-100 dark:text-[#F8DF7B] dark:bg-[#2E1B58] px-2.5 py-0.5 rounded-full shrink-0">
                {books.length} cuốn
              </span>
            )}
          </div>

          {isAdmin && onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1.5 h-7 px-2.5 rounded-[9px] bg-blue-50 text-[#1E3A8A] border border-blue-200 text-[11.5px] font-extrabold hover:bg-blue-100 dark:bg-purple-950/80 dark:text-purple-200 dark:border-purple-800/40 dark:hover:bg-purple-900 cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
            >
              <Edit2 size={11} />
              <span>Sửa sách</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-[12.5px] text-muted truncate">
            Một bên là sách, một bên là mô tả chi tiết & video
          </p>

          {isAdmin && typeof sectionIndex === 'number' && typeof totalSections === 'number' && onMoveUp && onMoveDown && onOpenReorderModal && (
            <SectionOrderControls
              sectionIndex={sectionIndex}
              totalSections={totalSections}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onOpenReorderModal={onOpenReorderModal}
              className="ml-auto"
            />
          )}
        </div>
      </div>

      {/* Danh sách các cuốn sách */}
      {books.length > 0 ? (
        <div className="flex flex-col gap-3.5">
          {books.map((book) => {
            const hasVideo = Boolean(book.youtube_url);
            return (
              <div
                key={book.id}
                onClick={() => onSelectBook?.(book)}
                className="p-3.5 sm:p-4 rounded-[20px] bg-white text-slate-900 border border-slate-200 border-l-[4px] border-l-[#1E3A8A] shadow-md hover:shadow-lg hover:border-slate-300 dark:bg-gradient-to-br dark:from-[#1C123D] dark:via-[#160D30] dark:to-[#0E0720] dark:border-t-white/15 dark:border-r-black/50 dark:border-b-black/70 dark:border-l-[#A78BFA] dark:text-white transition-all cursor-pointer flex flex-row gap-3 sm:gap-4 group"
              >
                {/* BÊN TRÁI: Bìa sách to rõ chuẩn tỷ lệ 3:4 */}
                <div className="w-[116px] sm:w-[138px] aspect-[3/4] rounded-[14px] bg-slate-100 dark:bg-[#241548] overflow-hidden shrink-0 shadow-md border border-slate-200 dark:border-purple-400/40 relative flex items-center justify-center group-hover:scale-[1.02] transition-transform">
                  {book.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1 text-slate-400 dark:text-purple-300 text-center p-2">
                      <BookOpen size={28} className="text-slate-400 dark:text-purple-400" />
                      <span className="text-[10px] font-bold">Bìa sách 3:4</span>
                    </div>
                  )}

                  {/* Hiệu ứng bóng gáy sách tạo cảm giác sách thật */}
                  <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/20 via-white/10 to-transparent pointer-events-none" />
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

                  {/* Chân thẻ: Nút xem chi tiết & video */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-purple-800/40 mt-1">
                    <span className="text-[12.5px] font-black text-[#1E3A8A] dark:text-[#F8DF7B] inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
                      <span>Xem chi tiết & video</span>
                      <ChevronRight size={13} strokeWidth={2.5} />
                    </span>

                    {isAdmin && onEdit && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit();
                        }}
                        className="flex items-center gap-1 h-6 px-2 rounded-[6px] bg-surface-2 hover:bg-primary-soft text-muted hover:text-primary text-[11px] font-bold cursor-pointer shrink-0 ml-auto transition-colors"
                        title="Sửa sách"
                      >
                        <Edit2 size={10} />
                        <span>Sửa</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
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
    </section>
  );
}

/* =========================================================================
   3. KHỐI 3: TRIẾT LÝ PHỤNG SỰ (AUTHOR PHILOSOPHY)
   ========================================================================= */
export function AuthorPhilosophySection({
  profile,
  isAdmin = false,
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
      <div className="p-4 sm:p-5 rounded-[20px] bg-white text-slate-900 border border-slate-200 border-l-[4px] border-l-amber-500 shadow-md dark:bg-gradient-to-br dark:from-[#1C123D] dark:via-[#160D30] dark:to-[#0E0720] dark:border-l-[#F8DF7B] dark:border-t-white/15 dark:border-r-black/50 dark:border-b-black/70 dark:text-white flex flex-col gap-2">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-purple-800/40 pb-2">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-[#F8DF7B]">
            <Sparkles size={16} strokeWidth={2.5} />
            <h4 className="text-[13.5px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-[#F8DF7B]">
              {profile.extra_title || 'Triết lý phụng sự'}
            </h4>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-1.5 shrink-0">
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="flex items-center gap-1 h-6 px-2.5 rounded-[7px] bg-blue-50 text-[#1E3A8A] border border-blue-200 hover:bg-blue-100 dark:bg-purple-950/80 dark:text-purple-200 dark:border-purple-800/40 dark:hover:bg-purple-900 text-[11px] font-bold cursor-pointer shrink-0 whitespace-nowrap shadow-2xs transition-colors"
                  title="Sửa triết lý phụng sự"
                >
                  <Edit2 size={11} />
                  <span>Sửa</span>
                </button>
              )}

              {typeof sectionIndex === 'number' && typeof totalSections === 'number' && onMoveUp && onMoveDown && onOpenReorderModal && (
                <SectionOrderControls
                  sectionIndex={sectionIndex}
                  totalSections={totalSections}
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  onOpenReorderModal={onOpenReorderModal}
                  className="ml-auto"
                />
              )}
            </div>
          )}
        </div>

        <p className="text-[15px] text-slate-700 dark:text-purple-100 leading-relaxed italic font-medium pt-1">
          &ldquo;{profile.extra_content || 'Bấm sửa để thêm thông điệp triết lý phụng sự...'}&rdquo;
        </p>
      </div>
    </section>
  );
}

/* =========================================================================
   4. KHỐI 4: THÔNG TIN LIÊN HỆ & KẾT NỐI (AUTHOR CONTACT)
   ========================================================================= */
export function AuthorContactSection({
  profile,
  isAdmin = false,
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
      <div className="p-4 sm:p-5 rounded-[20px] bg-white text-slate-900 border border-slate-200 border-l-[4px] border-l-[#1E3A8A] shadow-md dark:bg-gradient-to-br dark:from-[#1C123D] dark:via-[#160D30] dark:to-[#0E0720] dark:border-l-[#A78BFA] dark:border-t-white/15 dark:border-r-black/50 dark:border-b-black/70 dark:text-white flex flex-col gap-3.5">
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

          {isAdmin && (
            <div className="flex items-center gap-1.5 shrink-0">
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="flex items-center gap-1.5 h-7 px-2.5 rounded-[8px] bg-blue-50 text-[#1E3A8A] border border-blue-200 text-[12px] font-extrabold hover:bg-blue-100 dark:bg-purple-950/80 dark:text-purple-200 dark:border-purple-800/40 dark:hover:bg-purple-900 cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
                >
                  <Edit2 size={12} />
                  <span>Sửa liên hệ</span>
                </button>
              )}

              {typeof sectionIndex === 'number' && typeof totalSections === 'number' && onMoveUp && onMoveDown && onOpenReorderModal && (
                <SectionOrderControls
                  sectionIndex={sectionIndex}
                  totalSections={totalSections}
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  onOpenReorderModal={onOpenReorderModal}
                  className="ml-auto"
                />
              )}
            </div>
          )}
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
              className="group relative flex items-center justify-between p-3 px-3.5 rounded-[18px] bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50/60 border border-blue-200 text-slate-900 shadow-sm hover:border-[#1E3A8A] dark:bg-gradient-to-r dark:from-[#3B1F7A] dark:via-[#2A1359] dark:to-[#160833] dark:text-white dark:border-amber-300/60 overflow-hidden gap-2 cursor-pointer transition-all active:scale-[0.98]"
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
              className="flex items-center justify-between p-3 px-3.5 rounded-[16px] bg-[#0068FF] text-white hover:bg-[#0056D2] active:scale-[0.98] transition-all shadow-xs gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-extrabold text-[15px] shrink-0">
                  Z
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-white/80 font-medium leading-tight">Chat Zalo</span>
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
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onOpenReorderModal?: () => void;
}

export default function AuthorIntroSection({
  initialProfile,
  sectionIndex,
  totalSections,
  onMoveUp,
  onMoveDown,
  onOpenReorderModal,
}: AuthorIntroSectionProps) {
  const [profile, setProfile] = useState<AuthorProfile>(() => normalizeAuthorProfile(initialProfile));
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedBook, setSelectedBook] = useState<AuthorBook | null>(null);
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
            setSelectedBook(null);
            openModalWithTab('books');
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
    </div>
  );
}
