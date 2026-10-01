'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Check,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Link as LinkIcon,
  Clock,
  FileText,
  Video as VideoIcon,
} from 'lucide-react';
import { Video } from '../../lib/types';
import { extractYouTubeId, fetchYouTubeMeta, checkIsShorts } from '../../lib/youtube';

interface EditSingleVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null;
  videoIndex: number;
  totalVideos: number;
  onSave: (updatedVideo: Video, index: number) => void;
  onDelete?: (index: number) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
}

export default function EditSingleVideoModal({
  isOpen,
  onClose,
  video,
  videoIndex,
  totalVideos,
  onSave,
  onDelete,
  onMoveUp,
  onMoveDown,
}: EditSingleVideoModalProps) {
  const isNew = videoIndex < 0 || !video;

  const [title, setTitle] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [durationText, setDurationText] = useState('');
  const [description, setDescription] = useState('');
  const [isVertical, setIsVertical] = useState(false);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [metaNotice, setMetaNotice] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (video) {
        setTitle(video.title || '');
        const yid = video.youtube_id || '';
        setUrlInput(yid ? `https://www.youtube.com/watch?v=${yid}` : '');
        setDurationText(video.duration_text || '');
        setDescription(video.description || '');
        setIsVertical(Boolean(video.is_vertical || video.aspect_ratio === 'vertical' || video.aspect_ratio === '9:16'));
      } else {
        setTitle('');
        setUrlInput('');
        setDurationText('');
        setDescription('');
        setIsVertical(false);
      }
      setMetaNotice('');
    }
  }, [isOpen, video]);

  if (!isOpen) return null;

  const detectedId = extractYouTubeId(urlInput);

  const handleFetchMeta = async () => {
    if (!detectedId) {
      alert('Vui lòng nhập đường link YouTube hợp lệ trước khi lấy thông tin.');
      return;
    }
    setIsLoadingMeta(true);
    setMetaNotice('');
    try {
      const meta = await fetchYouTubeMeta(detectedId);
      if (meta.title && (!title || title.trim() === '')) {
        setTitle(meta.title);
      }
      if (checkIsShorts(urlInput)) {
        setIsVertical(true);
      }
      setMetaNotice('✓ Đã cập nhật thông tin từ YouTube');
      setTimeout(() => setMetaNotice(''), 3000);
    } catch {
      setMetaNotice('Chưa lấy được tự động, bạn có thể tự nhập tiêu đề');
    } finally {
      setIsLoadingMeta(false);
    }
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert('Vui lòng nhập tiêu đề cho video.');
      return;
    }

    const yid = detectedId || (video?.youtube_id ?? '');

    const updated: Video = {
      title: trimmedTitle,
      youtube_id: yid,
      duration_text: durationText.trim() || '05:00',
      description: description.trim(),
      is_vertical: isVertical,
      aspect_ratio: isVertical ? 'vertical' : 'horizontal',
      thumbnail_url: yid ? `https://i.ytimg.com/vi/${yid}/hqdefault.jpg` : (video?.thumbnail_url || undefined),
    };

    onSave(updated, videoIndex);
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa video "${title || 'này'}" khỏi danh sách phát không?`)) {
      if (onDelete && videoIndex >= 0) {
        onDelete(videoIndex);
        onClose();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[460px] max-h-[92vh] flex flex-col rounded-[22px] bg-white dark:bg-[#160D30] text-slate-900 dark:text-white border border-slate-200 dark:border-purple-800/60 shadow-2xl overflow-hidden"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-purple-900/40 bg-slate-50/70 dark:bg-purple-950/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[10px] bg-blue-100 text-[#1E3A8A] dark:bg-[#F8DF7B] dark:text-[#160C2C] flex items-center justify-center shrink-0 shadow-2xs">
              <Play size={15} fill="currentColor" className="ml-0.5" />
            </div>
            <div>
              <h3 className="text-[16px] font-black leading-tight">
                {isNew ? 'Thêm video mới vào bài học' : `Chỉnh sửa Video ${String(videoIndex + 1).padStart(2, '0')}`}
              </h3>
              <span className="text-[11.5px] text-muted block">
                {isNew ? 'Nhập link YouTube để bổ sung vào danh sách' : 'Cập nhật trực tiếp tiêu đề, link và thời lượng'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-white/10 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nội dung Form */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
          {/* 1. Đường dẫn YouTube */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <LinkIcon size={13} className="text-[#1E3A8A] dark:text-[#F8DF7B]" />
                <span>Link YouTube hoặc Video ID</span>
              </span>
              {detectedId && (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  ID: {detectedId}
                </span>
              )}
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... hoặc youtu.be/..."
                className="h-9 px-3 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[13px] font-medium flex-1 min-w-0 shadow-2xs focus:border-[#1E3A8A] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleFetchMeta}
                disabled={isLoadingMeta || !detectedId}
                className="flex items-center gap-1 h-9 px-2.5 rounded-[10px] bg-blue-50 text-[#1E3A8A] border border-blue-200 hover:bg-blue-100 dark:bg-purple-900/60 dark:text-purple-200 dark:border-purple-700 text-[11.5px] font-extrabold disabled:opacity-40 cursor-pointer shrink-0 transition-colors shadow-2xs"
                title="Tự động lấy tiêu đề và ảnh từ YouTube"
              >
                <Sparkles size={12} />
                <span>{isLoadingMeta ? 'Đang đọc...' : 'Lấy tin'}</span>
              </button>
            </div>
            {metaNotice && (
              <span className="text-[11.5px] font-bold text-emerald-600 dark:text-emerald-400">
                {metaNotice}
              </span>
            )}

            {/* Preview Thumbnail nếu có ID */}
            {detectedId && (
              <div className="flex items-center gap-2.5 p-2 rounded-[12px] bg-slate-50 dark:bg-purple-950/40 border border-slate-200/80 dark:border-purple-900/30 mt-0.5">
                <div className="relative w-20 aspect-video rounded-[6px] overflow-hidden bg-black shrink-0 border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${detectedId}/hqdefault.jpg`}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-purple-300">Thumbnail YouTube:</span>
                  <span className="text-[11.5px] font-semibold text-slate-700 dark:text-purple-100 truncate">
                    {title || `Video ID: ${detectedId}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Tiêu đề video */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200 flex items-center gap-1.5">
              <VideoIcon size={13} className="text-[#1E3A8A] dark:text-[#F8DF7B]" />
              <span>Tiêu đề video bài giảng <strong className="text-red-500">*</strong></span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: 01. Cấu tạo & chức năng cột sống"
              className="h-9 px-3 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[13px] font-bold flex-1 min-w-0 shadow-2xs focus:border-[#1E3A8A] focus:outline-hidden"
              autoFocus
            />
          </div>

          {/* 3. Thời lượng video & Dạng video */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200 flex items-center gap-1.5">
                <Clock size={13} className="text-[#1E3A8A] dark:text-[#F8DF7B]" />
                <span>Thời lượng</span>
              </label>
              <input
                type="text"
                value={durationText}
                onChange={(e) => setDurationText(e.target.value)}
                placeholder="Ví dụ: 4 phút / 04:30"
                className="h-9 px-3 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[13px] font-medium shadow-2xs focus:border-[#1E3A8A] focus:outline-hidden"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200">
                Khung hình
              </label>
              <button
                type="button"
                onClick={() => setIsVertical(!isVertical)}
                className={`h-9 px-3 rounded-[10px] border flex items-center justify-center text-[12px] font-extrabold transition-colors cursor-pointer shadow-2xs ${
                  isVertical
                    ? 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-900/60 dark:text-purple-200 dark:border-purple-600'
                    : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
                }`}
              >
                {isVertical ? '📱 Dạng dọc (9:16 Shorts)' : '🖥️ Dạng ngang (16:9 HD)'}
              </button>
            </div>
          </div>

          {/* 4. Mô tả / tóm tắt nội dung */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200 flex items-center gap-1.5">
              <FileText size={13} className="text-[#1E3A8A] dark:text-[#F8DF7B]" />
              <span>Tóm tắt nội dung video (tùy chọn)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn gọn nội dung bài học trong video này..."
              rows={2}
              className="p-2.5 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[12.5px] font-normal shadow-2xs focus:border-[#1E3A8A] focus:outline-hidden resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 dark:border-purple-900/40 bg-slate-50/70 dark:bg-purple-950/40 flex items-center justify-between gap-2">
          {!isNew && (
            <div className="flex items-center gap-1">
              {onMoveUp && (
                <button
                  type="button"
                  disabled={videoIndex <= 0}
                  onClick={() => onMoveUp(videoIndex)}
                  className="w-8 h-8 rounded-[8px] bg-white dark:bg-purple-950 border border-slate-200 dark:border-purple-800 text-slate-700 dark:text-purple-200 flex items-center justify-center disabled:opacity-30 cursor-pointer shadow-2xs hover:bg-slate-100"
                  title="Di chuyển video này lên trên"
                >
                  <ArrowUp size={14} />
                </button>
              )}
              {onMoveDown && (
                <button
                  type="button"
                  disabled={videoIndex >= totalVideos - 1}
                  onClick={() => onMoveDown(videoIndex)}
                  className="w-8 h-8 rounded-[8px] bg-white dark:bg-purple-950 border border-slate-200 dark:border-purple-800 text-slate-700 dark:text-purple-200 flex items-center justify-center disabled:opacity-30 cursor-pointer shadow-2xs hover:bg-slate-100"
                  title="Di chuyển video này xuống dưới"
                >
                  <ArrowDown size={14} />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-8 h-8 rounded-[8px] bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800/50 flex items-center justify-center cursor-pointer shadow-2xs hover:bg-red-100"
                  title="Xóa video này"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-3 rounded-[10px] border border-slate-300 dark:border-purple-800/80 text-slate-700 dark:text-purple-200 text-[12px] font-bold hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 h-9 px-4 rounded-[10px] bg-[#1E3A8A] text-white hover:bg-[#162D6E] dark:bg-[#F8DF7B] dark:text-[#160C2C] dark:hover:bg-amber-300 text-[12.5px] font-black cursor-pointer shadow-xs transition-colors"
            >
              <Check size={14} strokeWidth={2.5} />
              <span>{isNew ? 'Thêm video' : 'Lưu video'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
