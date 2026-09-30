'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  BookOpen,
  Edit2,
  Film,
  Sparkles,
  MessageCircle,
  Play,
} from 'lucide-react';
import { AuthorProfile, AuthorBook } from '../lib/types';
import { DEFAULT_AUTHOR_PROFILE } from '../data/sample';
import { checkIsAdminClient } from '../lib/adminAuth';
import { extractYouTubeId } from '../lib/youtube';
import BookDetailModal from './BookDetailModal';
import EditAuthorModal from './admin/EditAuthorModal';

interface AuthorIntroSectionProps {
  initialProfile?: AuthorProfile | null;
}

export default function AuthorIntroSection({ initialProfile }: AuthorIntroSectionProps) {
  const [profile, setProfile] = useState<AuthorProfile>(() => initialProfile || DEFAULT_AUTHOR_PROFILE);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedBook, setSelectedBook] = useState<AuthorBook | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    checkIsAdminClient().then(setIsAdmin);
    if (initialProfile) {
      setProfile(initialProfile);
    }
  }, [initialProfile]);

  const introVideoId = profile.intro_video_url ? extractYouTubeId(profile.intro_video_url) : null;

  return (
    <section className="flex flex-col gap-4 mt-2">
      {/* Tiêu đề mục & Nút Quản trị */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-extrabold text-ink leading-tight">
            Giới thiệu & Tác phẩm
          </h2>
          <p className="text-[13px] text-muted">
            Người đồng hành & các công trình nghiên cứu
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-[10px] bg-primary-soft text-primary text-[13px] font-extrabold hover:bg-primary-soft/80 cursor-pointer shadow-2xs"
          >
            <Edit2 size={13} />
            <span>Sửa giới thiệu</span>
          </button>
        )}
      </div>

      {/* 1. KHỐI GIỚI THIỆU BẢN THÂN */}
      <div className="p-4 sm:p-5 rounded-[24px] bg-white border border-line shadow-xs flex flex-col gap-3.5">
        {/* Avatar + Tên + Chức danh */}
        <div className="flex items-center gap-3.5">
          <div className="w-18 h-18 rounded-full bg-primary-soft flex items-center justify-center overflow-hidden border-2 border-primary/20 shrink-0 shadow-sm">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={34} className="text-primary" />
            )}
          </div>

          <div className="flex-1 flex flex-col gap-0.5">
            <span className="text-[12px] font-extrabold uppercase text-primary tracking-wider">
              Tác giả / Chuyên gia
            </span>
            <h3 className="text-[20px] font-extrabold text-ink leading-tight">
              {profile.name}
            </h3>
            {profile.title && (
              <p className="text-[14px] text-muted font-bold leading-tight">
                {profile.title}
              </p>
            )}
          </div>
        </div>

        {/* Lời giới thiệu chi tiết (Bio) */}
        {profile.bio && (
          <div className="pt-1 text-[15px] text-ink/90 leading-relaxed font-normal whitespace-pre-line border-t border-line/60">
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

      {/* 2. KHUNG CÁC SÁCH ĐÃ LÀM */}
      {profile.books && profile.books.length > 0 && (
        <div className="p-4 sm:p-5 rounded-[24px] bg-white border border-line shadow-xs flex flex-col gap-3.5">
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[8px] bg-primary-soft text-primary flex items-center justify-center">
                <BookOpen size={16} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-[16px] font-extrabold text-ink leading-tight">
                  Sách & Tác phẩm đã làm
                </h3>
                <span className="text-[12px] text-muted">
                  Bấm vào từng cuốn để xem chi tiết & video
                </span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-2 text-muted font-extrabold text-[12px]">
              {profile.books.length} cuốn
            </span>
          </div>

          {/* Lưới các cuốn sách */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.books.map((book) => {
              const hasVideo = Boolean(book.youtube_url);
              return (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="flex gap-3 p-3 rounded-[18px] bg-surface-2/60 hover:bg-surface-2 border border-line/80 hover:border-primary/40 transition-all cursor-pointer shadow-2xs group"
                >
                  {/* Bìa sách */}
                  <div className="w-[68px] h-[92px] rounded-[10px] bg-white border border-line overflow-hidden shrink-0 shadow-xs flex items-center justify-center group-hover:scale-[1.02] transition-transform">
                    {book.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1 text-muted text-center p-1">
                        <BookOpen size={20} className="text-primary/70" />
                        <span className="text-[9px] font-bold">Bìa sách</span>
                      </div>
                    )}
                  </div>

                  {/* Thông tin sách */}
                  <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {book.year && (
                          <span className="px-2 py-0.5 rounded-[6px] bg-primary/10 text-primary text-[10px] font-extrabold">
                            Năm {book.year}
                          </span>
                        )}
                        {hasVideo && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-[6px] bg-red-100 text-red-600 text-[10px] font-extrabold">
                            <Play size={10} className="fill-red-600" />
                            <span>Có video</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-[15px] font-extrabold text-ink leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-[12px] text-muted line-clamp-2 leading-relaxed">
                        {book.description}
                      </p>
                    </div>

                    <span className="text-[12px] text-primary font-bold inline-flex items-center gap-1 pt-1">
                      <span>Xem nội dung</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. CÁC TRƯỜNG THÊM Ở DƯỚI CUỐI */}
      {/* Khung Triết lý / Lời nhắn gửi */}
      {profile.extra_content && (
        <div className="p-4 sm:p-5 rounded-[22px] bg-linear-to-br from-primary-soft/40 to-surface-2 border border-primary/20 shadow-2xs flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-primary">
            <Sparkles size={16} strokeWidth={2.5} />
            <h4 className="text-[14px] font-extrabold uppercase tracking-wide">
              {profile.extra_title || 'Triết lý phụng sự'}
            </h4>
          </div>
          <p className="text-[15px] text-ink leading-relaxed italic font-medium">
            &ldquo;{profile.extra_content}&rdquo;
          </p>
        </div>
      )}

      {/* Khung Ghi chú liên hệ / Hướng dẫn kết nối */}
      {profile.contact_note && (
        <div className="p-3.5 px-4 rounded-[18px] bg-white border border-line shadow-2xs flex items-start gap-2.5">
          <MessageCircle size={18} className="text-primary shrink-0 mt-0.5" />
          <p className="text-[13px] text-muted leading-relaxed font-medium">
            {profile.contact_note}
          </p>
        </div>
      )}

      {/* Modal chi tiết sách khi bấm vào (Không có nút mua, có video) */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}

      {/* Modal chỉnh sửa của Admin */}
      {showEditModal && (
        <EditAuthorModal
          isOpen={true}
          initialProfile={profile}
          onClose={() => setShowEditModal(false)}
          onSaved={(newProfile) => {
            setProfile(newProfile);
          }}
        />
      )}
    </section>
  );
}
