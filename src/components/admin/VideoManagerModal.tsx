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
  Sparkles,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';
import { Video } from '../../lib/types';
import { extractYouTubeId, fetchYouTubeMeta } from '../../lib/youtube';
import { uploadImageFile } from '../../lib/storageUpload';
import SpineIllustration from '../SpineIllustration';

interface VideoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: Video[];
  onSaveVideos: (newVideos: Video[]) => void;
}

const SAMPLE_PRESET_VIDEOS = [
  {
    title: 'Cấu tạo & chức năng cột sống',
    url: 'https://www.youtube.com/watch?v=c9kmCxFKHPY',
    id: 'c9kmCxFKHPY',
    duration: '4 phút',
  },
  {
    title: 'Cấu tạo cơ bản của đốt sống',
    url: 'https://www.youtube.com/watch?v=mVtS7TYDpbU',
    id: 'mVtS7TYDpbU',
    duration: '5 phút',
  },
  {
    title: 'Cơ và dây chằng cột sống',
    url: 'https://www.youtube.com/watch?v=yTfFaHohKbY',
    id: 'yTfFaHohKbY',
    duration: '6 phút',
  },
  {
    title: 'Giải phẫu tủy sống & thần kinh',
    url: 'https://www.youtube.com/watch?v=_uxMIfQfYGk',
    id: '_uxMIfQfYGk',
    duration: '4 phút',
  },
  {
    title: 'Giải phẫu & chức năng đĩa đệm',
    url: 'https://www.youtube.com/watch?v=z0FRTp5CVds',
    id: 'z0FRTp5CVds',
    duration: '5 phút',
  },
];

export default function VideoManagerModal({
  isOpen,
  onClose,
  videos,
  onSaveVideos,
}: VideoManagerModalProps) {
  const [videoList, setVideoList] = useState<Video[]>(videos);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form thêm video
  const [addMode, setAddMode] = useState<'none' | 'youtube' | 'upload' | 'bulk'>('none');
  const [inputUrl, setInputUrl] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [inputDuration, setInputDuration] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [inputThumb, setInputThumb] = useState('');
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [fetchSuccessMsg, setFetchSuccessMsg] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [bulkFeedback, setBulkFeedback] = useState('');

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
    if (!confirm('Bạn có chắc muốn xóa video này khỏi danh sách?')) return;
    const updated = videoList.filter((_, i) => i !== index);
    setVideoList(updated);
    if (editingIndex === index) {
      setEditingIndex(null);
      setAddMode('none');
    }
  };

  const [inputAspect, setInputAspect] = useState<'auto' | 'vertical' | 'horizontal'>('auto');

  // Bắt đầu sửa video
  const handleStartEdit = (index: number) => {
    const v = videoList[index];
    setEditingIndex(index);
    setInputTitle(v.title);
    setInputDuration(v.duration_text || '');
    setInputDescription(v.description || '');
    setInputUrl(v.youtube_id ? `https://www.youtube.com/watch?v=${v.youtube_id}` : '');
    setInputThumb(v.thumbnail_url || '');
    setInputAspect(
      v.is_vertical || v.aspect_ratio === 'vertical' || v.aspect_ratio === '9:16'
        ? 'vertical'
        : v.aspect_ratio === 'horizontal' || v.aspect_ratio === '16:9'
        ? 'horizontal'
        : 'auto'
    );
    setAddMode('youtube');
  };

  // Tự động lấy thông tin từ link YouTube
  const handleFetchYoutube = async () => {
    const yid = extractYouTubeId(inputUrl);
    if (!yid) {
      alert('Đường dẫn YouTube không hợp lệ. Vui lòng dán link dạng youtube.com/watch?v=... hoặc youtu.be/... hoặc ID 11 ký tự');
      return;
    }
    setIsLoadingMeta(true);
    setFetchSuccessMsg('');
    const meta = await fetchYouTubeMeta(yid);
    if (!inputTitle.trim()) {
      setInputTitle(meta.title);
    }
    // Chỉ ghi đè ảnh mặc định nếu người dùng chưa chọn lớp phủ riêng
    if (!inputThumb || inputThumb.includes('ytimg.com')) {
      setInputThumb(meta.thumbnail_url);
    }
    if (!inputDuration) {
      setInputDuration('5 phút');
    }

    // Tự động nhận diện video dọc (Shorts)
    if (inputUrl.includes('/shorts/')) {
      setInputAspect('vertical');
      setFetchSuccessMsg('Đã nhận diện: Video dọc YouTube Shorts (9:16) ↕');
    } else {
      try {
        const res = await fetch(`/api/video/detect-aspect?id=${encodeURIComponent(yid)}`);
        const data = await res.json();
        if (data?.is_vertical) {
          setInputAspect('vertical');
          setFetchSuccessMsg('Đã tự động nhận diện: Video dọc (9:16) ↕');
        } else {
          setInputAspect('horizontal');
          setFetchSuccessMsg('Đã nhận diện: Video bài giảng ngang (16:9) ↔');
        }
      } catch {
        setFetchSuccessMsg('Đã nhận diện video thành công!');
      }
    }
    setIsLoadingMeta(false);
  };

  // Chọn mẫu video có sẵn để test nhanh
  const handleApplyPreset = (preset: typeof SAMPLE_PRESET_VIDEOS[0]) => {
    setInputUrl(preset.url);
    setInputTitle(preset.title);
    setInputDuration(preset.duration);
    setInputThumb(`https://i.ytimg.com/vi/${preset.id}/hqdefault.jpg`);
    setInputAspect('horizontal');
    setFetchSuccessMsg(`Đã chọn mẫu: ${preset.title}`);
  };

  // Lưu video mới hoặc cập nhật video
  const handleSaveVideoItem = async () => {
    const yid = extractYouTubeId(inputUrl) || '';
    let finalTitle = inputTitle.trim();
    let finalThumb = inputThumb.trim();

    if (!finalTitle && yid) {
      setIsLoadingMeta(true);
      const meta = await fetchYouTubeMeta(yid);
      finalTitle = meta.title;
      finalThumb = meta.thumbnail_url;
      setIsLoadingMeta(false);
    }

    if (!finalTitle && !yid) {
      alert('Vui lòng dán đường dẫn YouTube hoặc nhập tiêu đề video.');
      return;
    }

    if (!finalTitle) {
      finalTitle = `Video bài học (${yid || 'Mới'})`;
    }

    const isVert =
      inputAspect === 'vertical' ||
      (inputAspect === 'auto' && inputUrl.includes('/shorts/'));

    const newVideoItem: Video = {
      youtube_id: yid,
      title: finalTitle,
      duration_text: inputDuration.trim() || '5 phút',
      description: inputDescription.trim() || undefined,
      thumbnail_url: finalThumb || (yid ? `https://i.ytimg.com/vi/${yid}/hqdefault.jpg` : undefined),
      is_vertical: isVert,
      aspect_ratio: isVert ? 'vertical' : 'horizontal',
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
    setInputAspect('auto');
    setFetchSuccessMsg('');
  };

  const handleBulkImport = async () => {
    if (!bulkText.trim()) return;
    setIsBulkLoading(true);
    setBulkFeedback('Đang xử lý và tải thông tin video...');
    const rawLines = bulkText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const added: Video[] = [];
    for (const line of rawLines) {
      const yid = extractYouTubeId(line);
      if (yid && !videoList.some((v) => v.youtube_id === yid) && !added.some((v) => v.youtube_id === yid)) {
        try {
          const meta = await fetchYouTubeMeta(yid);
          added.push({
            youtube_id: yid,
            title: meta.title || `Video ${yid}`,
            thumbnail_url: meta.thumbnail_url || `https://i.ytimg.com/vi/${yid}/hqdefault.jpg`,
            duration_text: '5 phút',
          });
        } catch {
          added.push({
            youtube_id: yid,
            title: `Video ${yid}`,
            thumbnail_url: `https://i.ytimg.com/vi/${yid}/hqdefault.jpg`,
            duration_text: '5 phút',
          });
        }
      }
    }

    if (added.length > 0) {
      setVideoList([...videoList, ...added]);
      setBulkFeedback(`Đã thêm thành công ${added.length} video mới!`);
      setTimeout(() => {
        setBulkText('');
        setBulkFeedback('');
        setAddMode('none');
      }, 1500);
    } else {
      setBulkFeedback('Không tìm thấy link YouTube mới hợp lệ.');
    }
    setIsBulkLoading(false);
  };

  const handleFinish = () => {
    onSaveVideos(videoList);
    onClose();
  };

  const currentExtractedId = extractYouTubeId(inputUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-[480px] max-h-[92vh] bg-white dark:bg-[#160E2E] rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 border dark:border-white/10">
        {/* Nút kéo trên mobile */}
        <div className="w-12 h-1.5 bg-line-strong rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Thanh tiêu đề Modal */}
        <div className="flex items-start justify-between p-5 pb-3 border-b border-line">
          <div className="flex flex-col gap-1">
            <h3 className="text-[22px] font-extrabold text-ink leading-tight">
              Quản lý danh sách video
            </h3>
            <p className="text-[14px] text-muted leading-tight">
              {videoList.length} video · Bấm ▲ ▼ đổi thứ tự · Sửa link YouTube để phát thật
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-ink transition-colors shrink-0 cursor-pointer"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Danh sách video cuộn */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3">
          {videoList.map((vid, idx) => {
            const thumbUrl =
              vid.thumbnail_url ||
              (vid.youtube_id ? `https://i.ytimg.com/vi/${vid.youtube_id}/hqdefault.jpg` : null);

            return (
              <div
                key={idx}
                className="flex flex-col gap-2 p-2.5 sm:p-3 rounded-[16px] bg-white dark:bg-[#1C123D] border border-line shadow-2xs"
              >
                <div className="flex items-start gap-2.5">
                  {/* Thumbnail */}
                  <div className="relative w-[88px] h-[54px] rounded-[10px] bg-[#1C2735] overflow-hidden shrink-0 flex items-center justify-center">
                    {thumbUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbUrl}
                        alt={vid.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-white/50">
                        <SpineIllustration className="w-6 h-6 opacity-40" />
                      </div>
                    )}
                    {vid.thumbnail_url && !vid.thumbnail_url.includes('ytimg.com') && (
                      <span className="absolute top-0.5 left-0.5 bg-emerald-600 text-white text-[8.5px] font-bold px-1 py-0.2 rounded-xs shadow-xs">
                        Lớp phủ riêng
                      </span>
                    )}
                    <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-white text-[10px] font-bold px-1 py-0.2 rounded-xs">
                      {vid.duration_text || '05:00'}
                    </span>
                  </div>

                  {/* Thông tin */}
                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <h4 className="text-[15px] font-bold text-ink leading-snug truncate">
                      {vid.title}
                    </h4>
                    {vid.youtube_id ? (
                      <span className="text-[11.5px] font-mono text-primary font-bold">
                        YouTube: {vid.youtube_id}
                      </span>
                    ) : (
                      <span className="text-[11.5px] text-red-500 font-medium">
                        Chưa có link video
                      </span>
                    )}
                    {vid.description && (
                      <p className="text-[12px] text-muted truncate">
                        {vid.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Các nút thao tác */}
                <div className="flex items-center justify-between pt-1.5 border-t border-line/60">
                  <div className="flex items-center gap-1.5">
                    {/* Di chuyển lên */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveUp(idx)}
                      className="w-7 h-7 rounded-[7px] bg-surface-2 flex items-center justify-center text-ink disabled:opacity-30 border border-line"
                      aria-label="Di chuyển lên"
                      title="Di chuyển lên"
                    >
                      <ChevronUp size={15} />
                    </button>

                    {/* Di chuyển xuống */}
                    <button
                      type="button"
                      disabled={idx === videoList.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className="w-7 h-7 rounded-[7px] bg-surface-2 flex items-center justify-center text-ink disabled:opacity-30 border border-line"
                      aria-label="Di chuyển xuống"
                      title="Di chuyển xuống"
                    >
                      <ChevronDown size={15} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Nút sửa */}
                    <button
                      type="button"
                      onClick={() => handleStartEdit(idx)}
                      className="flex items-center gap-1 h-7 px-2.5 rounded-[7px] bg-surface-2 text-ink text-[12px] font-bold border border-line hover:border-primary"
                    >
                      <Edit2 size={12} className="text-primary" />
                      <span>Sửa</span>
                    </button>

                    {/* Nút xóa */}
                    <button
                      type="button"
                      onClick={() => handleDelete(idx)}
                      className="flex items-center gap-1 h-7 px-2.5 rounded-[7px] bg-red-50 text-red-600 text-[12px] font-bold border border-red-200 hover:bg-red-100"
                    >
                      <Trash2 size={12} />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Khung + Thêm video */}
          <div className="flex flex-col gap-3 p-4 rounded-[22px] border-2 border-dashed border-primary/40 bg-primary-soft/20 mt-1">
            <div className="flex items-center justify-between text-primary font-bold text-[16px]">
              <div className="flex items-center gap-2">
                <Plus size={20} strokeWidth={2.5} />
                <span>{editingIndex !== null ? 'Chỉnh sửa video đã chọn' : 'Thêm video mới'}</span>
              </div>
            </div>

            {addMode === 'none' ? (
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAddMode('youtube')}
                  className="flex items-center justify-center gap-1.5 h-[48px] rounded-[14px] bg-white border border-line text-ink font-bold text-[13px] hover:border-primary transition-all shadow-xs"
                >
                  <LinkIcon size={16} className="text-primary shrink-0" />
                  <span>Dán 1 link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAddMode('bulk')}
                  className="flex items-center justify-center gap-1.5 h-[48px] rounded-[14px] bg-white border border-line text-ink font-bold text-[13px] hover:border-primary transition-all shadow-xs"
                >
                  <Upload size={16} className="text-primary shrink-0" />
                  <span>Dán nhiều link</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleApplyPreset(SAMPLE_PRESET_VIDEOS[0]);
                    setAddMode('youtube');
                  }}
                  className="flex items-center justify-center gap-1.5 h-[48px] rounded-[14px] bg-white border border-line text-primary font-bold text-[13px] hover:border-primary transition-all shadow-xs"
                >
                  <Sparkles size={16} className="shrink-0" />
                  <span>Video mẫu</span>
                </button>
              </div>
            ) : addMode === 'bulk' ? (
              /* Form nhập nhiều link cùng lúc */
              <div className="flex flex-col gap-3 bg-white p-4 rounded-[18px] border border-line shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-line">
                  <span className="text-[14px] font-extrabold text-ink uppercase tracking-wide">
                    Nhập nhiều video cùng lúc
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAddMode('none');
                      setBulkText('');
                      setBulkFeedback('');
                    }}
                    className="p-1 rounded-md text-muted hover:bg-surface-2"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-ink">
                    Dán danh sách link YouTube (mỗi link trên 1 dòng):
                  </label>
                  <textarea
                    rows={5}
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=...&#10;https://youtu.be/...&#10;https://www.youtube.com/shorts/..."
                    className="w-full p-3 rounded-[12px] bg-surface-2 border border-line text-[14px] font-mono text-ink leading-relaxed"
                  />
                  <span className="text-[12px] text-muted">
                    Hệ thống sẽ tự động nhận diện ID và tải thông tin tiêu đề, ảnh bìa tự động.
                  </span>
                </div>
                {bulkFeedback && (
                  <div className="p-2.5 rounded-[10px] bg-primary-soft text-primary font-bold text-[13px]">
                    {bulkFeedback}
                  </div>
                )}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setAddMode('none')}
                    className="h-10 px-3.5 rounded-[10px] bg-surface-2 text-ink font-bold text-[13px]"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkImport}
                    disabled={isBulkLoading || !bulkText.trim()}
                    className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-[10px] bg-primary text-white font-bold text-[13px] shadow-sm disabled:opacity-50"
                  >
                    {isBulkLoading ? 'Đang trích xuất...' : 'Nạp tự động toàn bộ'}
                  </button>
                </div>
              </div>
            ) : (
              /* Form nhập video */
              <div className="flex flex-col gap-3 bg-white p-4 rounded-[18px] border border-line shadow-xs">
                {/* Gợi ý mẫu nhanh */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-extrabold uppercase text-muted tracking-wider">
                    Gợi ý video mẫu sẵn có (Bấm để điền nhanh):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_PRESET_VIDEOS.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="text-[12px] font-bold px-2.5 py-1 rounded-full bg-surface-2 text-ink border border-line hover:border-primary hover:text-primary transition-all"
                      >
                        {preset.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] font-bold text-ink">
                    Đường dẫn YouTube hoặc YouTube ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... hoặc c9kmCxFKHPY"
                      className="flex-1 h-[44px] px-3 rounded-[12px] border border-line text-[15px] text-ink focus:outline-hidden focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={handleFetchYoutube}
                      disabled={isLoadingMeta || !inputUrl}
                      className="h-[44px] px-3.5 rounded-[12px] bg-primary text-white font-bold text-[13px] shrink-0 disabled:opacity-50"
                    >
                      {isLoadingMeta ? 'Đang lấy...' : 'Lấy thông tin'}
                    </button>
                  </div>
                  {currentExtractedId && (
                    <div className="flex items-center gap-2 mt-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://i.ytimg.com/vi/${currentExtractedId}/hqdefault.jpg`}
                        alt="Preview"
                        className="w-16 h-10 object-cover rounded-[6px] border border-line"
                      />
                      <span className="text-[12px] text-primary font-bold">
                        Đã nhận ID: {currentExtractedId}
                      </span>
                    </div>
                  )}
                  {fetchSuccessMsg && (
                    <span className="text-[13px] text-primary font-semibold">
                      ✓ {fetchSuccessMsg}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] font-bold text-ink">
                    Tiêu đề video
                  </label>
                  <input
                    type="text"
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)}
                    placeholder="Ví dụ: 01. Cấu tạo cột sống"
                    className="w-full h-[44px] px-3 rounded-[12px] border border-line text-[15px] text-ink focus:outline-hidden focus:border-primary"
                  />
                </div>

                {/* Tùy chọn Tỷ lệ hiển thị (Dọc 9:16 hoặc Ngang 16:9) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-ink flex items-center justify-between">
                    <span>Định dạng khung hình video:</span>
                    <span className="text-[11.5px] text-muted font-normal">Tự động nhận diện video dọc / ngang</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setInputAspect('auto')}
                      className={`py-2 px-1 text-[12px] font-bold rounded-[10px] border transition-colors cursor-pointer ${
                        inputAspect === 'auto'
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-surface-2 text-ink border-line hover:border-primary'
                      }`}
                    >
                      Tự động nhận diện
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputAspect('vertical')}
                      className={`py-2 px-1 text-[12px] font-bold rounded-[10px] border transition-colors cursor-pointer ${
                        inputAspect === 'vertical'
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-surface-2 text-ink border-line hover:border-primary'
                      }`}
                    >
                      ↕ Dạng dọc (9:16)
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputAspect('horizontal')}
                      className={`py-2 px-1 text-[12px] font-bold rounded-[10px] border transition-colors cursor-pointer ${
                        inputAspect === 'horizontal'
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-surface-2 text-ink border-line hover:border-primary'
                      }`}
                    >
                      ↔ Dạng ngang (16:9)
                    </button>
                  </div>
                </div>

                {/* Mục Lớp phủ ảnh bên ngoài (Ảnh bìa / Thumbnail) */}
                <div className="flex flex-col gap-2 p-3 rounded-[14px] bg-surface-2 border border-line">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-extrabold text-ink uppercase tracking-wide flex items-center gap-1.5">
                      <ImageIcon size={16} className="text-primary shrink-0" />
                      <span>Lớp phủ ảnh bên ngoài (Ảnh bìa video)</span>
                    </label>
                    {inputThumb && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        inputThumb.includes('ytimg.com')
                          ? 'bg-line text-muted'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {inputThumb.includes('ytimg.com') ? 'YouTube mặc định' : 'Lớp phủ riêng ✓'}
                      </span>
                    )}
                  </div>

                  <p className="text-[12px] text-muted leading-tight">
                    Ảnh phủ bên ngoài video trước khi bấm phát và làm ảnh đại diện trong danh sách phát (playxit).
                  </p>

                  <div className="flex items-center gap-3">
                    {/* Preview ảnh lớp phủ */}
                    <div className="relative w-[116px] h-[66px] rounded-[10px] bg-[#1C2735] overflow-hidden shrink-0 flex items-center justify-center border border-line">
                      {inputThumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={inputThumb}
                          alt="Lớp phủ video"
                          className="w-full h-full object-cover"
                        />
                      ) : currentExtractedId ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://i.ytimg.com/vi/${currentExtractedId}/hqdefault.jpg`}
                          alt="YouTube default"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-white/40 flex flex-col items-center">
                          <ImageIcon size={20} />
                          <span className="text-[10px] mt-0.5">Chưa có ảnh</span>
                        </div>
                      )}
                      {inputThumb && (
                        <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[3px] leading-none">
                          Xem trước
                        </span>
                      )}
                    </div>

                    {/* Các nút thao tác với lớp phủ ảnh */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Nút tải ảnh từ máy lên */}
                        <label className="flex items-center justify-center gap-1.5 h-[36px] px-3 rounded-[9px] bg-primary text-white font-bold text-[12px] cursor-pointer hover:bg-primary-strong active:scale-95 transition-all shadow-xs shrink-0">
                          <Upload size={13} />
                          <span>{isUploadingThumb ? 'Đang nén & tải...' : 'Tải ảnh từ máy'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingThumb}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                setIsUploadingThumb(true);
                                const res = await uploadImageFile(file);
                                setInputThumb(res.url);
                              } catch (err: any) {
                                alert(err.message || 'Lỗi khi tải ảnh');
                              } finally {
                                setIsUploadingThumb(false);
                                e.target.value = '';
                              }
                            }}
                            className="hidden"
                          />
                        </label>

                        {/* Nút khôi phục ảnh mặc định YouTube nếu đang có link riêng */}
                        {currentExtractedId && inputThumb && !inputThumb.includes('ytimg.com') && (
                          <button
                            type="button"
                            onClick={() => {
                              setInputThumb(`https://i.ytimg.com/vi/${currentExtractedId}/hqdefault.jpg`);
                            }}
                            className="flex items-center gap-1 h-[36px] px-2.5 rounded-[9px] bg-white border border-line text-muted hover:text-ink font-bold text-[12px] transition-colors"
                            title="Dùng lại ảnh mặc định YouTube"
                          >
                            <RotateCcw size={13} />
                            <span>Dùng ảnh YouTube</span>
                          </button>
                        )}
                      </div>

                      {/* Ô dán URL ảnh trực tiếp nếu muốn */}
                      <div className="flex items-center gap-1 w-full">
                        <input
                          type="url"
                          value={inputThumb}
                          onChange={(e) => setInputThumb(e.target.value)}
                          placeholder="Hoặc dán URL ảnh (https://...)..."
                          className="flex-1 min-w-0 h-[34px] px-2.5 rounded-[8px] bg-white border border-line text-[12px] text-ink focus:outline-hidden focus:border-primary"
                        />
                        {inputThumb && (
                          <button
                            type="button"
                            onClick={() => setInputThumb('')}
                            className="h-[34px] px-2.5 rounded-[8px] bg-white border border-line text-red-600 hover:bg-red-50 text-[12px] font-bold shrink-0"
                            title="Xóa ảnh lớp phủ"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
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
                    {editingIndex !== null ? 'Cập nhật video' : 'Thêm vào danh sách'}
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
            Xong và lưu danh sách
          </button>
        </div>
      </div>
    </div>
  );
}
