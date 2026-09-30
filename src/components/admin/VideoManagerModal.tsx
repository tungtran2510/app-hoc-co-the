'use client';

import React, { useState } from 'react';
import {
  X,
  ChevronUp,
  ChevronDown,
  Upload,
  Link as LinkIcon,
  Plus,
  Play,
  Check,
  Trash2,
  Edit2,
} from 'lucide-react';
import { Video } from '../../lib/types';
import { extractYouTubeId, fetchYouTubeMeta } from '../../lib/youtube';
import SpineIllustration from '../SpineIllustration';

interface VideoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: Video[];
  onSaveVideos: (newVideos: Video[]) => void;
}

export default function VideoManagerModal({
  isOpen,
  onClose,
  videos,
  onSaveVideos,
}: VideoManagerModalProps) {
  const [videoList, setVideoList] = useState<Video[]>(videos);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form thêm video
  const [addMode, setAddMode] = useState<'none' | 'youtube' | 'upload'>('none');
  const [inputUrl, setInputUrl] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [inputDuration, setInputDuration] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [inputThumb, setInputThumb] = useState('');
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [fetchSuccessMsg, setFetchSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Di chuyển lên
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...videoList];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setVideoList(updated);
  };

  // Di chuyển xuống
  const handleMoveDown = (index: number) => {
    if (index === videoList.length - 1) return;
    const updated = [...videoList];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setVideoList(updated);
  };

  // Xóa video
  const handleDelete = (index: number) => {
    const updated = videoList.filter((_, i) => i !== index);
    setVideoList(updated);
  };

  // Bắt đầu sửa video
  const handleStartEdit = (index: number) => {
    const v = videoList[index];
    setEditingIndex(index);
    setInputTitle(v.title);
    setInputDuration(v.duration_text || '');
    setInputDescription(v.description || '');
    setInputUrl(v.youtube_id ? `https://www.youtube.com/watch?v=${v.youtube_id}` : '');
    setInputThumb(v.thumbnail_url || '');
    setAddMode('youtube');
  };

  // Tự động lấy thông tin từ link YouTube
  const handleFetchYoutube = async () => {
    const yid = extractYouTubeId(inputUrl);
    if (!yid) {
      alert('Đường dẫn YouTube không hợp lệ. Vui lòng dán link dạng youtube.com/watch?v=... hoặc youtu.be/...');
      return;
    }
    setIsLoadingMeta(true);
    setFetchSuccessMsg('');
    const meta = await fetchYouTubeMeta(yid);
    setInputTitle(meta.title);
    setInputThumb(meta.thumbnail_url);
    if (!inputDuration) {
      setInputDuration('5 phút');
    }
    setIsLoadingMeta(false);
    setFetchSuccessMsg('Đã tự động lấy tiêu đề và ảnh bìa từ YouTube!');
  };

  // Lưu video mới hoặc cập nhật video
  const handleSaveVideoItem = () => {
    if (!inputTitle.trim()) {
      alert('Vui lòng nhập tên video');
      return;
    }

    const yid = extractYouTubeId(inputUrl) || '';
    const newVideoItem: Video = {
      youtube_id: yid,
      title: inputTitle.trim(),
      duration_text: inputDuration.trim() || '4 phút',
      description: inputDescription.trim() || undefined,
      thumbnail_url: inputThumb || (yid ? `https://i.ytimg.com/vi/${yid}/hqdefault.jpg` : undefined),
    };

    if (editingIndex !== null) {
      const updated = [...videoList];
      updated[editingIndex] = newVideoItem;
      setVideoList(updated);
      setEditingIndex(null);
    } else {
      setVideoList([...videoList, newVideoItem]);
    }

    // Reset form
    setAddMode('none');
    setInputUrl('');
    setInputTitle('');
    setInputDuration('');
    setInputDescription('');
    setInputThumb('');
    setFetchSuccessMsg('');
  };

  const handleFinish = () => {
    onSaveVideos(videoList);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-[480px] max-h-[90vh] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Nút kéo trên mobile */}
        <div className="w-12 h-1.5 bg-line-strong rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Thanh tiêu đề Modal */}
        <div className="flex items-start justify-between p-5 pb-3 border-b border-line">
          <div className="flex flex-col gap-1">
            <h3 className="text-[22px] font-extrabold text-ink leading-tight">
              Danh sách video
            </h3>
            <p className="text-[14px] text-muted leading-tight">
              {videoList.length} video · 1 trang có thể chứa từ 1 đến nhiều video · bấm ▲ ▼ để đổi thứ tự
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-ink transition-colors shrink-0"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Danh sách video cuộn */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          {videoList.map((vid, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-2 p-3.5 rounded-[20px] bg-white border border-line shadow-xs"
            >
              <div className="flex items-start gap-3">
                {/* Thumbnail */}
                <div className="relative w-[100px] h-[64px] rounded-[12px] bg-[#1C2735] overflow-hidden shrink-0 flex items-center justify-center">
                  {vid.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={vid.thumbnail_url}
                      alt={vid.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-white/50">
                      <SpineIllustration className="w-8 h-8 opacity-40" />
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[12px] font-bold px-1.5 py-0.5 rounded-sm">
                    {vid.duration_text || '04:00'}
                  </span>
                </div>

                {/* Thông tin */}
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <h4 className="text-[17px] font-bold text-ink leading-snug truncate">
                    {vid.title}
                  </h4>
                  <span className="text-[14px] text-muted">
                    {vid.duration_text || '4 phút'} · {vid.youtube_id ? 'YouTube' : 'Tập tin'}
                  </span>
                  {vid.description && (
                    <p className="text-[13px] text-muted line-clamp-1">
                      {vid.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Các nút hành động: ▲, ▼, Sửa, Xóa */}
              <div className="flex items-center justify-between pt-2 border-t border-line/60">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    className="w-9 h-9 rounded-[10px] bg-surface-2 flex items-center justify-center text-ink disabled:opacity-30 transition-transform active:scale-90"
                    aria-label="Di chuyển lên"
                  >
                    <ChevronUp size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === videoList.length - 1}
                    className="w-9 h-9 rounded-[10px] bg-surface-2 flex items-center justify-center text-ink disabled:opacity-30 transition-transform active:scale-90"
                    aria-label="Di chuyển xuống"
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(idx)}
                    className="flex items-center gap-1 h-9 px-3 rounded-[10px] bg-surface-2 text-ink text-[14px] font-bold hover:bg-line transition-colors"
                  >
                    <Edit2 size={14} />
                    <span>Sửa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    className="flex items-center gap-1 h-9 px-3 rounded-[10px] bg-[#FBE7E1] text-[#7A2F12] text-[14px] font-bold hover:bg-[#F2B38A]/40 transition-colors"
                  >
                    <Trash2 size={14} />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Khung + Thêm video */}
          <div className="flex flex-col gap-3 p-4 rounded-[22px] border-2 border-dashed border-primary/40 bg-primary-soft/20 mt-1">
            <div className="flex items-center gap-2 text-primary font-bold text-[16px]">
              <Plus size={20} strokeWidth={2.5} />
              <span>Thêm video mới</span>
            </div>

            {addMode === 'none' ? (
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setAddMode('upload')}
                  className="flex items-center justify-center gap-2 h-[48px] rounded-[14px] bg-white border border-line text-ink font-bold text-[15px] hover:border-primary transition-all shadow-xs"
                >
                  <Upload size={18} className="text-primary" />
                  <span>Tải file lên</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAddMode('youtube')}
                  className="flex items-center justify-center gap-2 h-[48px] rounded-[14px] bg-white border border-line text-ink font-bold text-[15px] hover:border-primary transition-all shadow-xs"
                >
                  <LinkIcon size={18} className="text-primary" />
                  <span>Dán link YouTube</span>
                </button>
              </div>
            ) : (
              /* Form nhập video */
              <div className="flex flex-col gap-3 bg-white p-4 rounded-[18px] border border-line shadow-xs">
                {addMode === 'youtube' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-bold text-ink">
                      Đường dẫn YouTube
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="flex-1 h-[44px] px-3 rounded-[12px] border border-line text-[15px] text-ink focus:outline-hidden focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={handleFetchYoutube}
                        disabled={isLoadingMeta || !inputUrl}
                        className="h-[44px] px-3 rounded-[12px] bg-primary text-white font-bold text-[14px] shrink-0 disabled:opacity-50"
                      >
                        {isLoadingMeta ? 'Đang tải...' : 'Lấy thông tin'}
                      </button>
                    </div>
                    {fetchSuccessMsg && (
                      <span className="text-[13px] text-primary font-semibold">
                        ✓ {fetchSuccessMsg}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] font-bold text-ink">
                    Tiêu đề video
                  </label>
                  <input
                    type="text"
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)}
                    placeholder="Ví dụ: 05. Thoát vị đĩa đệm"
                    className="w-full h-[44px] px-3 rounded-[12px] border border-line text-[15px] text-ink focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[14px] font-bold text-ink">
                      Thời lượng
                    </label>
                    <input
                      type="text"
                      value={inputDuration}
                      onChange={(e) => setInputDuration(e.target.value)}
                      placeholder="Ví dụ: 5 phút"
                      className="w-full h-[44px] px-3 rounded-[12px] border border-line text-[15px] text-ink focus:outline-hidden focus:border-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[14px] font-bold text-ink">
                      Mô tả ngắn
                    </label>
                    <input
                      type="text"
                      value={inputDescription}
                      onChange={(e) => setInputDescription(e.target.value)}
                      placeholder="Tùy chọn"
                      className="w-full h-[44px] px-3 rounded-[12px] border border-line text-[15px] text-ink focus:outline-hidden focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
                  <button
                    type="button"
                    onClick={() => {
                      setAddMode('none');
                      setEditingIndex(null);
                    }}
                    className="h-10 px-4 rounded-[12px] bg-surface-2 text-ink text-[14px] font-bold"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveVideoItem}
                    className="h-10 px-5 rounded-[12px] bg-primary text-white text-[14px] font-bold shadow-xs"
                  >
                    {editingIndex !== null ? 'Cập nhật' : 'Thêm vào danh sách'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nút Xong dưới cùng */}
        <div className="p-4 border-t border-line bg-surface flex justify-center">
          <button
            type="button"
            onClick={handleFinish}
            className="flex items-center justify-center h-[56px] min-h-[48px] w-full rounded-[16px] bg-primary text-white font-extrabold text-[19px] transition-transform active:scale-[0.98] shadow-sm"
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  );
}
