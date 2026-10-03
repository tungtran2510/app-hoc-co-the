'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Film,
  MessageCircle,
  Phone,
  CheckCircle2,
  Edit2,
  Save,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { extractYouTubeId } from '../lib/youtube';
import { saveSettingsApi } from '../lib/apiAdmin';
import YouTubeEmbed from './YouTubeEmbed';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName?: string;
  appSubtitle?: string | null;
  logoUrl?: string | null;
  hotline?: string | null;
  zaloUrl?: string | null;
  initialWelcomeTitle?: string | null;
  initialWelcomeMessage?: string | null;
  initialWelcomeVideoUrl?: string | null;
  isAdmin?: boolean;
  onSaved?: (title: string, message: string, videoUrl: string) => void;
}

export default function WelcomeModal({
  isOpen,
  onClose,
  appName = 'Qbiz Books',
  appSubtitle = '',
  logoUrl,
  hotline = '0974.248.716',
  zaloUrl = 'https://zalo.me/0987792400',
  initialWelcomeTitle,
  initialWelcomeMessage,
  initialWelcomeVideoUrl,
  isAdmin = false,
  onSaved,
}: WelcomeModalProps) {
  const [welcomeTitle, setWelcomeTitle] = useState(
    initialWelcomeTitle || 'Chào mừng bạn đến với Qbiz Books'
  );
  const [welcomeMessage, setWelcomeMessage] = useState(
    initialWelcomeMessage ||
      'Hi vọng nền tảng học hiểu giải phẫu và chăm sóc sức khỏe chủ động này sẽ giúp bạn hiểu sâu hơn về cơ thể mình, nuôi dưỡng hệ cơ xương khớp và sống khỏe mỗi ngày.'
  );
  const [welcomeVideoUrl, setWelcomeVideoUrl] = useState(
    initialWelcomeVideoUrl || 'https://www.youtube.com/watch?v=c9kmCxFKHPY'
  );

  // Trạng thái sửa cho Admin
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(welcomeTitle);
  const [editMessage, setEditMessage] = useState(welcomeMessage);
  const [editVideoUrl, setEditVideoUrl] = useState(welcomeVideoUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Xử lý nút Back của điện thoại / trình duyệt để đóng Modal thay vì bị lùi trang
  const isBackAction = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    isBackAction.current = false;
    try {
      window.history.pushState({ modal: 'welcome' }, '');
    } catch {}

    const handlePopState = () => {
      isBackAction.current = true;
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      try {
        if (!isBackAction.current && window.history.state?.modal === 'welcome') {
          window.history.back();
        }
      } catch {}
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const youtubeId = welcomeVideoUrl ? extractYouTubeId(welcomeVideoUrl) : null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await saveSettingsApi({
        welcome_title: editTitle.trim(),
        welcome_message: editMessage.trim(),
        welcome_video_url: editVideoUrl.trim() || null,
      });

      if (res.success) {
        setWelcomeTitle(editTitle.trim());
        setWelcomeMessage(editMessage.trim());
        setWelcomeVideoUrl(editVideoUrl.trim());
        setIsEditing(false);
        setSaveSuccess(true);
        onSaved?.(editTitle.trim(), editMessage.trim(), editVideoUrl.trim());
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(res.error || 'Chưa lưu được cài đặt chào mừng');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi mạng khi lưu');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[500px] max-h-[92vh] bg-white text-slate-900 border border-slate-200 dark:bg-gradient-to-br dark:from-[#1A1038] dark:via-[#140B2D] dark:to-[#0C061E] dark:border-white/20 dark:text-white rounded-[26px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút kéo trên điện thoại */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-purple-800/60 rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* HEADER MODAL */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-slate-100 dark:border-purple-800/40 bg-slate-50/70 dark:bg-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Logo 3D */}
            <div className="w-9 h-9 rounded-[12px] bg-[#0C152B] p-0.5 border border-amber-400/60 shadow-sm shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl || '/app_logo.png'}
                alt={appName}
                className="w-full h-full object-cover rounded-[9px]"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-[#F8DF7B] bg-amber-100 dark:bg-purple-950/80 px-2 py-0.5 rounded-[5px] border border-amber-300 dark:border-purple-800/40">
                  LỜI NGỎ CHÀO MỪNG
                </span>
              </div>
              <h3 className="text-[15px] font-extrabold text-slate-900 dark:text-white leading-tight truncate mt-0.5">
                {appName} · Medica Learn
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300/80 dark:bg-white/10 dark:hover:bg-white/20 flex items-center justify-center text-slate-600 dark:text-purple-200 transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Đóng"
          >
            <X size={17} />
          </button>
        </div>

        {/* NỘI DUNG CUỘN */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5.5 flex flex-col gap-4">
          {saveSuccess && (
            <div className="p-3 rounded-[12px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[12.5px] font-bold flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>Đã lưu thông điệp chào mừng thành công!</span>
            </div>
          )}

          {isEditing ? (
            /* ================= FORM CHỈNH SỬA CHO ADMIN ================= */
            <form onSubmit={handleSave} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-700 dark:text-purple-200 uppercase tracking-wide">
                  Tiêu đề chào mừng
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[12px] bg-slate-100 dark:bg-purple-950/60 border border-slate-300 dark:border-purple-700/60 text-[14px] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary"
                  placeholder="Ví dụ: Chào mừng bạn đến với Qbiz Books"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-700 dark:text-purple-200 uppercase tracking-wide">
                  Dòng mô tả / Thông điệp chào mừng
                </label>
                <textarea
                  rows={4}
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  className="w-full p-3.5 rounded-[12px] bg-slate-100 dark:bg-purple-950/60 border border-slate-300 dark:border-purple-700/60 text-[13.5px] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary leading-relaxed"
                  placeholder="Nhập thông điệp chào mừng truyền cảm hứng..."
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-700 dark:text-purple-200 uppercase tracking-wide flex items-center gap-1.5">
                  <Film size={13} className="text-red-500" />
                  <span>Link video YouTube giới thiệu (Tùy chọn)</span>
                </label>
                <input
                  type="text"
                  value={editVideoUrl}
                  onChange={(e) => setEditVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[12px] bg-slate-100 dark:bg-purple-950/60 border border-slate-300 dark:border-purple-700/60 text-[13px] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary font-mono"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-purple-800/40">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-[10px] bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-purple-200 font-bold text-[12.5px] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4.5 py-2 rounded-[10px] bg-primary hover:bg-primary-strong text-white font-bold text-[12.5px] cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  <span>Lưu thông điệp</span>
                </button>
              </div>
            </form>
          ) : (
            /* ================= HIỂN THỊ THÔNG ĐIỆP CHÀO MỪNG SANG TRỌNG ================= */
            <>
              {/* Tiêu đề & Thông điệp */}
              <div className="flex flex-col gap-2 text-center sm:text-left">
                <div className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-amber-600 dark:text-[#F8DF7B] text-[12.5px] font-black tracking-wide">
                  <Sparkles size={15} className="animate-pulse" />
                  <span>SỨC KHỎE TỪ THẨU HIỂU</span>
                </div>
                <h2 className="text-[20px] sm:text-[22px] font-black text-slate-900 dark:text-white leading-tight">
                  {welcomeTitle}
                </h2>
                <p className="text-[13.5px] sm:text-[14px] text-slate-700 dark:text-purple-100/90 leading-relaxed font-normal">
                  {welcomeMessage}
                </p>
              </div>

              {/* VIDEO YOUTUBE GIỚI THIỆU (NẾU CÓ) */}
              {youtubeId && (
                <YouTubeEmbed
                  youtubeId={youtubeId}
                  title="Video chào mừng"
                  showExternalLink={true}
                />
              )}

              {/* 3 ĐIỂM NHẤN CỐT LÕI */}
              <div className="p-3.5 sm:p-4 rounded-[18px] bg-slate-50 dark:bg-purple-950/40 border border-slate-200/80 dark:border-purple-800/40 flex flex-col gap-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-purple-900/60 text-amber-700 dark:text-[#F8DF7B] flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen size={12} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[12.5px] font-extrabold text-slate-900 dark:text-white leading-tight">
                      Tủ sách & Giáo trình Giải phẫu chuyên sâu
                    </h4>
                    <p className="text-[11.5px] text-slate-600 dark:text-purple-200/80 leading-normal mt-0.5">
                      Đầy đủ cẩm nang cơ xương khớp, đĩa đệm và tự chữa lành.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={12} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[12.5px] font-extrabold text-slate-900 dark:text-white leading-tight">
                      Mô hình 3D & Video Sinh cơ học trực quan
                    </h4>
                    <p className="text-[11.5px] text-slate-600 dark:text-purple-200/80 leading-normal mt-0.5">
                      Hiểu đúng nguyên lý cơ thể để vận động và sinh hoạt chuẩn y khoa.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle size={12} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[12.5px] font-extrabold text-slate-900 dark:text-white leading-tight">
                      Tư vấn & Hỗ trợ đồng hành trực tiếp
                    </h4>
                    <p className="text-[11.5px] text-slate-600 dark:text-purple-200/80 leading-normal mt-0.5">
                      Kết nối với chuyên gia dinh dưỡng và phục hồi bất cứ khi nào bạn cần.
                    </p>
                  </div>
                </div>
              </div>

              {/* NÚT KẾT NỐI LIÊN HỆ */}
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={zaloUrl || 'https://zalo.me/0987792400'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 rounded-[13px] bg-gradient-to-r from-[#0068FF] to-[#0047C2] hover:from-[#0058DB] hover:to-[#003EA6] text-white font-extrabold text-[12.5px] sm:text-[13px] shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                >
                  <MessageCircle size={14} className="fill-white" />
                  <span>Nhắn tin Zalo</span>
                </a>

                {hotline ? (
                  <a
                    href={`tel:${hotline.replace(/\s+/g, '')}`}
                    className="py-3 px-3 rounded-[13px] bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-extrabold text-[12.5px] sm:text-[13px] border border-slate-200 dark:border-white/15 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                  >
                    <Phone size={13} className="text-emerald-600 dark:text-emerald-400" />
                    <span>{hotline}</span>
                  </a>
                ) : (
                  <div />
                )}
              </div>
            </>
          )}
        </div>

        {/* FOOTER MODAL */}
        <div className="p-3.5 px-5 border-t border-slate-100 dark:border-purple-800/40 flex items-center justify-between bg-slate-50/70 dark:bg-white/5">
          {isAdmin && !isEditing ? (
            <button
              type="button"
              onClick={() => {
                setEditTitle(welcomeTitle);
                setEditMessage(welcomeMessage);
                setEditVideoUrl(welcomeVideoUrl);
                setIsEditing(true);
              }}
              className="flex items-center gap-1 text-[12px] font-bold text-primary hover:underline cursor-pointer"
            >
              <Edit2 size={12} />
              <span>Sửa thông điệp này</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-[12px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-[13.5px] shadow-md shadow-amber-500/25 cursor-pointer transition-transform active:scale-95"
          >
            Bắt đầu khám phá
          </button>
        </div>
      </div>
    </div>
  );
}
