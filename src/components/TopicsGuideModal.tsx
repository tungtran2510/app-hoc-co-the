'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, BookOpen, Edit2, Save, Loader2, Plus, Trash2, Film, Image as ImageIcon } from 'lucide-react';
import { TopicsGuide } from '../lib/types';
import { saveSettingsApi } from '../lib/apiAdmin';
import { extractYouTubeId } from '../lib/youtube';
import { uploadImageFile } from '../lib/storageUpload';
import YouTubeEmbed from './YouTubeEmbed';

export const DEFAULT_TOPICS_GUIDE: TopicsGuide = {
  title: 'Hướng dẫn học',
  body:
    'Nên bắt đầu từ đâu?\nBắt đầu với chuyên đề đầu tiên trong danh sách, học lần lượt từng bài từ trên xuống dưới.\n\nHọc như thế nào?\nXem video, đọc phần tóm tắt, rồi bấm lưu những bài quan trọng để ôn lại ở mục "Đã lưu".\n\nCần hỏi thêm?\nVào tab "Hỏi đáp AI" để được giải thích thêm về bài học.',
  images: [],
  youtube_url: null,
};

interface TopicsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  guide?: TopicsGuide | null;
  isAdmin?: boolean;
  onSaved?: (guide: TopicsGuide) => void;
}

export default function TopicsGuideModal({ isOpen, onClose, guide, isAdmin = false, onSaved }: TopicsGuideModalProps) {
  const current: TopicsGuide = { ...DEFAULT_TOPICS_GUIDE, ...(guide || {}) };
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(current.title || '');
  const [body, setBody] = useState(current.body || '');
  const [images, setImages] = useState<string[]>(current.images || []);
  const [youtubeUrl, setYoutubeUrl] = useState(current.youtube_url || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const isBackAction = useRef(false);

  // Nút Back của điện thoại đóng popup thay vì lùi trang
  useEffect(() => {
    if (!isOpen) return;
    isBackAction.current = false;
    try {
      window.history.pushState({ modal: 'topics-guide' }, '');
    } catch {}
    const handlePopState = () => {
      isBackAction.current = true;
      onClose();
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      try {
        if (!isBackAction.current && window.history.state?.modal === 'topics-guide') {
          window.history.back();
        }
      } catch {}
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const startEdit = () => {
    setTitle(current.title || '');
    setBody(current.body || '');
    setImages(current.images || []);
    setYoutubeUrl(current.youtube_url || '');
    setIsEditing(true);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const res = await uploadImageFile(file);
        uploaded.push(res.url);
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err: any) {
      alert(err?.message || 'Chưa tải được ảnh');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const next: TopicsGuide = {
      title: title.trim() || 'Hướng dẫn học',
      body: body.trim(),
      images,
      youtube_url: youtubeUrl.trim() || null,
    };
    const res = await saveSettingsApi({ topics_guide: next });
    setIsSaving(false);
    if (res.success) {
      onSaved?.(next);
      setIsEditing(false);
    } else {
      alert(res.error || 'Chưa lưu được – chưa kết nối dữ liệu');
    }
  };

  const youtubeId = current.youtube_url ? extractYouTubeId(current.youtube_url) : null;
  const paragraphs = (current.body || '').split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[500px] max-h-[92vh] bg-white text-slate-900 border border-slate-200 dark:bg-gradient-to-br dark:from-[#1A1038] dark:via-[#140B2D] dark:to-[#0C061E] dark:border-white/20 dark:text-white rounded-[26px] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 px-5 border-b border-slate-100 dark:border-purple-800/40 bg-slate-50/70 dark:bg-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-[12px] bg-amber-100 dark:bg-purple-950/80 text-amber-700 dark:text-[#F8DF7B] flex items-center justify-center shrink-0">
              <BookOpen size={18} />
            </div>
            <h3 className="text-[16px] font-extrabold leading-tight truncate">{current.title || 'Hướng dẫn học'}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300/80 dark:bg-white/10 dark:hover:bg-white/20 flex items-center justify-center text-slate-600 dark:text-purple-200 cursor-pointer shrink-0 ml-2"
            aria-label="Đóng"
          >
            <X size={17} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
          {isEditing ? (
            <div className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold uppercase tracking-wide">Tiêu đề hướng dẫn</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[12px] bg-slate-100 dark:bg-purple-950/60 border border-slate-300 dark:border-purple-700/60 text-[14px] focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold uppercase tracking-wide">Nội dung (cách một dòng trống để tách đoạn)</label>
                <textarea
                  rows={9}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full p-3.5 rounded-[12px] bg-slate-100 dark:bg-purple-950/60 border border-slate-300 dark:border-purple-700/60 text-[13.5px] leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-primary"
                  placeholder="Nên học từ đâu, xem gì trước..."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold uppercase tracking-wide flex items-center gap-1.5">
                  <Film size={13} className="text-red-500" />
                  <span>Link YouTube (tùy chọn)</span>
                </label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2.5 rounded-[12px] bg-slate-100 dark:bg-purple-950/60 border border-slate-300 dark:border-purple-700/60 text-[13px] font-mono focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold uppercase tracking-wide flex items-center gap-1.5">
                  <ImageIcon size={13} className="text-primary" />
                  <span>Hình ảnh ({images.length})</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((url, i) => (
                    <div key={url + i} className="relative aspect-square rounded-[10px] overflow-hidden border border-slate-300 dark:border-purple-700/60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center cursor-pointer"
                        aria-label="Xóa ảnh"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-[10px] border-2 border-dashed border-slate-300 dark:border-purple-700/60 flex flex-col items-center justify-center gap-1 text-[11px] font-bold text-slate-500 cursor-pointer">
                    {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                    <span>Thêm ảnh</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <>
              {paragraphs.map((p, i) => {
                const lines = p.split('\n');
                return (
                  <div key={i} className="flex flex-col gap-1">
                    {lines.length > 1 ? (
                      <>
                        <h4 className="text-[14.5px] font-extrabold text-slate-900 dark:text-[#F8DF7B] leading-snug">{lines[0]}</h4>
                        <p className="text-[14px] text-slate-700 dark:text-purple-100/90 leading-relaxed whitespace-pre-line">
                          {lines.slice(1).join('\n')}
                        </p>
                      </>
                    ) : (
                      <p className="text-[14px] text-slate-700 dark:text-purple-100/90 leading-relaxed">{p}</p>
                    )}
                  </div>
                );
              })}
              {youtubeId && <YouTubeEmbed youtubeId={youtubeId} title="Video hướng dẫn" showExternalLink={true} />}
              {(current.images || []).map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={url + i} src={url} alt={`Hình hướng dẫn ${i + 1}`} className="w-full rounded-[14px] border border-slate-200 dark:border-purple-800/40" loading="lazy" />
              ))}
            </>
          )}
        </div>

        <div className="p-3.5 px-5 border-t border-slate-100 dark:border-purple-800/40 flex items-center justify-between gap-2 bg-slate-50/70 dark:bg-white/5">
          {isAdmin && !isEditing ? (
            <button type="button" onClick={startEdit} className="flex items-center gap-1 text-[12px] font-bold text-primary hover:underline cursor-pointer">
              <Edit2 size={12} />
              <span>Sửa hướng dẫn</span>
            </button>
          ) : isEditing ? (
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-[10px] bg-slate-200 dark:bg-white/10 font-bold text-[12.5px] cursor-pointer">
              Hủy
            </button>
          ) : (
            <div />
          )}
          {isEditing ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-primary text-white font-bold text-[12.5px] cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              <span>Lưu hướng dẫn</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-[12px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-[13.5px] cursor-pointer active:scale-95"
            >
              Đã hiểu
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
