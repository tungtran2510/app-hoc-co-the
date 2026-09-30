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

  const introVideoId = profile.intro_video_url ? extractYouTubeId(profile.intro_video_url) : null;

  return (
    <section className="flex flex-col gap-4 mt-2">
      {/* NÚT ĐIỀU KHIỂN DÀNH CHO ADMIN (NẾU CÓ) */}
      {isAdmin && (
        <div className="flex items-center justify-end gap-2 -mb-2">
          <button
            type="button"
            onClick={() => openModalWithTab('author')}
            className="flex items-center gap-1.5 h-7 px-2.5 rounded-[9px] bg-primary-soft text-primary text-[11.5px] font-extrabold hover:bg-primary-soft/80 cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
          >
            <Edit2 size={11} />
            <span>Sửa tác giả</span>
          </button>

          {onMoveUp && onMoveDown && onOpenReorderModal && typeof sectionIndex === 'number' && typeof totalSections === 'number' && (
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

      {/* 1. KHỐI GIỚI THIỆU BẢN THÂN (CÓ NÚT SỬA TRỰC TIẾP) */}
      <div className="p-4 sm:p-5 rounded-[24px] bg-white border border-line shadow-xs flex flex-col gap-3.5">
        {/* Avatar/Logo + Tên + Chức danh + Nút sửa khối */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[12px] flex items-center justify-center overflow-hidden shrink-0">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-[12px]"
                />
              ) : (
                <div className="w-full h-full bg-primary-soft rounded-[12px] flex items-center justify-center">
                  <User size={34} className="text-primary" />
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-0.5 min-w-0">
              <span className="text-[12px] font-extrabold uppercase text-primary tracking-wider truncate">
                Tác giả / Chuyên gia
              </span>
              <h3 className="text-[20px] font-extrabold text-ink leading-tight truncate">
                {profile.name}
              </h3>
              {profile.title && (
                <p className="text-[13.5px] text-muted font-bold leading-tight line-clamp-2">
                  {profile.title}
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Lời giới thiệu chi tiết (Bio) */}
        {profile.bio && (
          <div className="pt-2 text-[14.5px] text-ink/90 leading-relaxed font-normal whitespace-pre-line border-t border-line/60">
            {profile.bio}
          </div>
        )}

        {/* Ảnh minh họa thêm (nếu có) */}
        {profile.intro_image_url && (
          <div className="w-full rounded-[16px] overflow-hidden border border-line shadow-2xs mt-1">
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
            <span className="text-[13px] font-bold text-ink flex items-center gap-1.5">
              <Film size={15} className="text-primary" />
              <span>Video giới thiệu</span>
            </span>
            <div className="relative w-full aspect-video rounded-[16px] overflow-hidden border border-line bg-black shadow-xs">
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

      {/* 2. KHỐI SÁCH & TÁC PHẨM ĐÃ LÀM (KHÔNG KHUNG CHỒNG KHUNG · ẢNH TO RÕ 3:4 · MỘT BÊN SÁCH MỘT BÊN MIÊU TẢ) */}
      <div className="flex flex-col gap-3 pt-1">
        {/* Tiêu đề mục sách & Nút Sửa sách */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[19px] font-extrabold text-ink leading-tight flex items-center gap-2">
              <span>Sách & Tác phẩm đã làm</span>
              {profile.books && profile.books.length > 0 && (
                <span className="text-[11.5px] font-extrabold text-primary bg-primary-soft px-2.5 py-0.5 rounded-full shrink-0">
                  {profile.books.length} cuốn
                </span>
              )}
            </h3>
            <p className="text-[12.5px] text-muted truncate mt-0.5">
              Một bên là sách, một bên là mô tả chi tiết & video
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => openModalWithTab('books')}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[10px] bg-primary-soft text-primary text-[12.5px] font-extrabold hover:bg-primary-soft/80 cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
            >
              <Edit2 size={13} />
              <span>Sửa sách</span>
            </button>
          )}
        </div>

        {/* Danh sách các cuốn sách (Từng thẻ riêng biệt, phẳng, không lồng khung) */}
        {profile.books && profile.books.length > 0 ? (
          <div className="flex flex-col gap-3.5">
            {profile.books.map((book) => {
              const hasVideo = Boolean(book.youtube_url);
              return (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="p-3.5 sm:p-5 rounded-[22px] bg-white border border-line shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-row gap-3 sm:gap-4.5 group"
                >
                  {/* BÊN TRÁI: Bìa sách to rõ chuẩn tỷ lệ 3:4 */}
                  <div className="w-[116px] sm:w-[138px] aspect-[3/4] rounded-[14px] bg-surface-2 overflow-hidden shrink-0 shadow-md border border-line/70 relative flex items-center justify-center group-hover:scale-[1.02] transition-transform">
                    {book.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1 text-muted text-center p-2">
                        <BookOpen size={28} className="text-primary/70" />
                        <span className="text-[10px] font-bold">Bìa sách 3:4</span>
                      </div>
                    )}

                    {/* Hiệu ứng bóng gáy sách tạo cảm giác sách thật */}
                    <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/25 via-white/10 to-transparent pointer-events-none" />
                  </div>

                  {/* BÊN PHẢI: Miêu tả, tiêu đề, năm phát hành & nút xem chi tiết */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {book.year && (
                          <span className="px-2 py-0.5 rounded-[5px] bg-primary/10 text-primary text-[10.5px] font-extrabold">
                            Năm {book.year}
                          </span>
                        )}
                        {hasVideo && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-[5px] bg-red-100 text-red-600 text-[10.5px] font-extrabold">
                            <Play size={10} className="fill-red-600" />
                            <span>Có video</span>
                          </span>
                        )}
                      </div>

                      <h4 className="text-[15px] sm:text-[16.5px] font-extrabold text-ink leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {book.title}
                      </h4>

                      <p className="text-[12px] sm:text-[12.5px] text-muted leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {book.description}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-line/40 mt-1.5">
                      <span className="text-[12px] text-primary font-extrabold inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
                        <span>Xem chi tiết & video</span>
                        <ChevronRight size={13} strokeWidth={2.5} />
                      </span>

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModalWithTab('books');
                          }}
                          className="flex items-center gap-1 h-6 px-2 rounded-[6px] bg-surface-2 hover:bg-primary-soft text-muted hover:text-primary text-[11px] font-bold cursor-pointer shrink-0 ml-auto transition-colors"
                          title="Sửa cuốn sách này"
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
          isAdmin && (
            <div
              onClick={() => openModalWithTab('books')}
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
      </div>

      {/* 3. KHỐI TRIẾT LÝ PHỤNG SỰ (CÓ NÚT SỬA TRỰC TIẾP) */}
      {profile.extra_content && (
        <div className="p-4 sm:p-5 rounded-[22px] bg-linear-to-br from-primary-soft/40 to-surface-2 border border-primary/20 shadow-2xs flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-primary/10 pb-2">
            <div className="flex items-center gap-1.5 text-primary">
              <Sparkles size={16} strokeWidth={2.5} />
              <h4 className="text-[13.5px] font-extrabold uppercase tracking-wider">
                {profile.extra_title || 'Triết lý phụng sự'}
              </h4>
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={() => openModalWithTab('extra')}
                className="flex items-center gap-1 h-6 px-2.5 rounded-[7px] bg-white hover:bg-primary-soft text-muted hover:text-primary text-[11px] font-bold cursor-pointer shrink-0 whitespace-nowrap shadow-2xs transition-colors"
                title="Sửa triết lý phụng sự"
              >
                <Edit2 size={11} />
                <span>Sửa</span>
              </button>
            )}
          </div>

          <p className="text-[15px] text-ink leading-relaxed italic font-medium pt-1">
            &ldquo;{profile.extra_content}&rdquo;
          </p>
        </div>
      )}

      {/* 4. KHỐI THÔNG TIN LIÊN HỆ & KẾT NỐI (CÓ NÚT SỬA TRỰC TIẾP) */}
      {(profile.phone || profile.zalo_url || profile.email || profile.facebook_url || profile.address || profile.contact_note) && (
        <div className="p-4 sm:p-5 rounded-[24px] bg-white border border-line shadow-xs flex flex-col gap-3.5">
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-[8px] bg-primary-soft text-primary flex items-center justify-center shrink-0">
                <PhoneCall size={16} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h3 className="text-[16px] font-extrabold text-ink leading-tight truncate">
                  Thông tin liên hệ & Kết nối
                </h3>
                <span className="text-[12px] text-muted truncate block">
                  Kết nối trực tiếp cùng chuyên gia / tác giả
                </span>
              </div>
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={() => openModalWithTab('contact')}
                className="flex items-center gap-1.5 h-7 px-2.5 rounded-[8px] bg-primary-soft text-primary text-[12px] font-extrabold hover:bg-primary-soft/80 cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
              >
                <Edit2 size={12} />
                <span>Sửa liên hệ</span>
              </button>
            )}
          </div>

          {/* Lời nhắn kết nối */}
          {profile.contact_note && (
            <p className="text-[14px] text-ink/85 leading-relaxed font-normal">
              {profile.contact_note}
            </p>
          )}

          {/* Các nút gọi điện & nhắn tin nhanh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
            {profile.phone && (
              <a
                href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center justify-between p-3 px-4 rounded-[16px] bg-primary text-white hover:bg-primary-dark active:scale-[0.98] transition-all shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Phone size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-white/80 font-medium">Hotline tư vấn</span>
                    <span className="text-[15px] font-extrabold tracking-wide">{profile.phone}</span>
                  </div>
                </div>
                <span className="text-[12px] font-bold px-2.5 py-1 rounded-[8px] bg-white/20">Gọi ngay</span>
              </a>
            )}

            {profile.zalo_url && (
              <a
                href={profile.zalo_url.startsWith('http') ? profile.zalo_url : `https://zalo.me/${profile.zalo_url.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 px-4 rounded-[16px] bg-[#0068FF] text-white hover:bg-[#0056D2] active:scale-[0.98] transition-all shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-extrabold text-[15px]">
                    Z
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-white/80 font-medium">Chat Zalo</span>
                    <span className="text-[15px] font-extrabold">Nhắn tin trực tiếp</span>
                  </div>
                </div>
                <span className="text-[12px] font-bold px-2.5 py-1 rounded-[8px] bg-white/20">Mở Zalo</span>
              </a>
            )}
          </div>

          {/* Chi tiết phụ: Facebook, Email, Địa chỉ */}
          {(profile.address || profile.email || profile.facebook_url) && (
            <div className="flex flex-col gap-2 pt-2 text-[13px] text-muted border-t border-line/60">
              {profile.address && (
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-primary shrink-0" />
                  <span className="text-ink/80 font-medium">{profile.address}</span>
                </div>
              )}
              {profile.email && (
                <div className="flex items-center gap-2">
                  <Mail size={15} className="text-primary shrink-0" />
                  <a href={`mailto:${profile.email}`} className="text-primary font-bold hover:underline">
                    {profile.email}
                  </a>
                </div>
              )}
              {profile.facebook_url && (
                <div className="flex items-center gap-2">
                  <Globe size={15} className="text-primary shrink-0" />
                  <a
                    href={profile.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-bold hover:underline"
                  >
                    Kênh cá nhân / Fanpage Facebook
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal chi tiết sách khi bấm vào (Có video và ảnh bên trong có phóng to) */}
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

      {/* Modal chỉnh sửa của Admin (Hỗ trợ mở thẳng vào đúng tab của khối) */}
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
    </section>
  );
}
