'use client';

import React, { useState } from 'react';
import {
  X,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  FileText,
  Video as VideoIcon,
  Link as LinkIcon,
  Check,
} from 'lucide-react';
import { Block, Image as ImageType, FileItem, Video } from '../../lib/types';
import { extractYouTubeId, fetchYouTubeMeta } from '../../lib/youtube';

interface EditBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  block: Block;
  onSaveBlock: (updatedBlock: Block) => void;
}

export default function EditBlockModal({
  isOpen,
  onClose,
  block,
  onSaveBlock,
}: EditBlockModalProps) {
  // State cho text block
  const [textLines, setTextLines] = useState<string>(
    block.type === 'text' ? block.data.lines.join('\n') : ''
  );
  const [displayStyle, setDisplayStyle] = useState<string>(
    block.type === 'text' ? block.display_style : 'van_ban'
  );
  const [textFormat, setTextFormat] = useState<'paragraph' | 'numbered' | 'bullet'>(
    block.type === 'text' ? block.data.format || 'paragraph' : 'paragraph'
  );

  // Đính kèm phương tiện (Ảnh, File, Video) ngay trong khối chữ
  const [attachedImages, setAttachedImages] = useState<ImageType[]>(
    block.type === 'text' && block.data.images ? [...block.data.images] : []
  );
  const [attachedFiles, setAttachedFiles] = useState<FileItem[]>(
    block.type === 'text' && block.data.files ? [...block.data.files] : []
  );
  const [attachedVideos, setAttachedVideos] = useState<Video[]>(
    block.type === 'text' && block.data.videos ? [...block.data.videos] : []
  );

  // Toggle các form thêm đính kèm gọn gàng
  const [activeAttachTab, setActiveAttachTab] = useState<'none' | 'image' | 'file' | 'video'>('none');
  const [inputImageUrl, setInputImageUrl] = useState('');
  const [inputImageCaption, setInputImageCaption] = useState('');
  const [inputFileName, setInputFileName] = useState('');
  const [inputFileUrl, setInputFileUrl] = useState('');
  const [inputVideoUrl, setInputVideoUrl] = useState('');
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);

  // State cho images block gốc
  const [imageList, setImageList] = useState<ImageType[]>(
    block.type === 'images' ? [...block.data.images] : []
  );

  // State cho files block gốc
  const [fileList, setFileList] = useState<FileItem[]>(
    block.type === 'files' ? [...block.data.files] : []
  );

  if (!isOpen) return null;

  // Thêm ảnh đính kèm
  const handleAddAttachedImage = () => {
    if (!inputImageUrl.trim()) {
      alert('Vui lòng dán link ảnh');
      return;
    }
    setAttachedImages([
      ...attachedImages,
      { url: inputImageUrl.trim(), caption: inputImageCaption.trim() || undefined },
    ]);
    setInputImageUrl('');
    setInputImageCaption('');
    setActiveAttachTab('none');
  };

  // Thêm file PDF đính kèm
  const handleAddAttachedFile = () => {
    if (!inputFileName.trim() || !inputFileUrl.trim()) {
      alert('Vui lòng nhập tên tài liệu và link file');
      return;
    }
    setAttachedFiles([
      ...attachedFiles,
      { name: inputFileName.trim(), url: inputFileUrl.trim(), size_bytes: 2000000 },
    ]);
    setInputFileName('');
    setInputFileUrl('');
    setActiveAttachTab('none');
  };

  // Thêm video đính kèm
  const handleAddAttachedVideo = async () => {
    const yid = extractYouTubeId(inputVideoUrl);
    if (!yid) {
      alert('Vui lòng nhập link YouTube hợp lệ');
      return;
    }
    setIsLoadingVideo(true);
    const meta = await fetchYouTubeMeta(yid);
    setAttachedVideos([
      ...attachedVideos,
      {
        youtube_id: yid,
        title: meta.title,
        thumbnail_url: meta.thumbnail_url,
        duration_text: '5 phút',
      },
    ]);
    setIsLoadingVideo(false);
    setInputVideoUrl('');
    setActiveAttachTab('none');
  };

  const handleSave = () => {
    if (block.type === 'text') {
      const lines = textLines
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const updated: Block = {
        ...block,
        display_style: displayStyle,
        data: {
          lines: lines.length > 0 ? lines : ['Nội dung mới'],
          format: textFormat,
          images: attachedImages.length > 0 ? attachedImages : undefined,
          files: attachedFiles.length > 0 ? attachedFiles : undefined,
          videos: attachedVideos.length > 0 ? attachedVideos : undefined,
        },
      };
      onSaveBlock(updated);
    } else if (block.type === 'images') {
      const updated: Block = {
        ...block,
        data: {
          images: imageList,
        },
      };
      onSaveBlock(updated);
    } else if (block.type === 'files') {
      const updated: Block = {
        ...block,
        data: {
          files: fileList,
        },
      };
      onSaveBlock(updated);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-[480px] max-h-[92vh] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-line">
          <h3 className="text-[19px] font-extrabold text-ink">
            Chỉnh sửa khối nội dung
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-ink"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3.5">
          {block.type === 'text' && (
            <>
              {/* Chọn kiểu khối chữ */}
              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-bold text-ink">
                  Kiểu hiển thị khối
                </label>
                <select
                  value={displayStyle}
                  onChange={(e) => setDisplayStyle(e.target.value)}
                  className="w-full h-[44px] px-3 rounded-[12px] bg-white border border-line text-[15px] text-ink font-semibold focus:border-primary"
                >
                  <option value="van_ban">Văn bản (không nhãn, chữ đoạn)</option>
                  <option value="y_nghia">Ý NGHĨA (nền ngọc nhạt)</option>
                  <option value="diem_can_nho">ĐIỂM CẦN NHỚ (nền xanh dương nhạt)</option>
                  <option value="chu_y">CHÚ Ý (nền cam nhạt)</option>
                  <option value="sai_lam">SAI LẦM THƯỜNG GẶP (nền đỏ nhạt)</option>
                  <option value="giai_phap">GIẢI PHÁP · ỨNG DỤNG (nền xanh lá nhạt)</option>
                </select>
              </div>

              {/* Định dạng danh sách */}
              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-bold text-ink">
                  Định dạng danh sách
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTextFormat('paragraph')}
                    className={`h-10 rounded-[10px] font-bold text-[13px] ${
                      textFormat === 'paragraph'
                        ? 'bg-primary text-white shadow-2xs'
                        : 'bg-surface-2 text-ink border border-line'
                    }`}
                  >
                    Đoạn văn
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextFormat('numbered')}
                    className={`h-10 rounded-[10px] font-bold text-[13px] ${
                      textFormat === 'numbered'
                        ? 'bg-primary text-white shadow-2xs'
                        : 'bg-surface-2 text-ink border border-line'
                    }`}
                  >
                    Số 1, 2, 3
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextFormat('bullet')}
                    className={`h-10 rounded-[10px] font-bold text-[13px] ${
                      textFormat === 'bullet'
                        ? 'bg-primary text-white shadow-2xs'
                        : 'bg-surface-2 text-ink border border-line'
                    }`}
                  >
                    Dấu chấm •
                  </button>
                </div>
              </div>

              {/* Nội dung chữ */}
              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-bold text-ink flex items-center justify-between">
                  <span>Nội dung (mỗi dòng 1 ý)</span>
                  <span className="text-[12px] text-muted font-normal">Hỗ trợ **chữ đậm**</span>
                </label>
                <textarea
                  rows={4}
                  value={textLines}
                  onChange={(e) => setTextLines(e.target.value)}
                  placeholder="Nhập nội dung vào đây..."
                  className="w-full p-3 rounded-[14px] border border-line text-[15px] text-ink leading-relaxed focus:border-primary"
                />
              </div>

              {/* HÀNG NÚT GỌN GÀNG ĐÍNH KÈM THÊM: ẢNH / PDF / VIDEO (Theo đúng yêu cầu của anh) */}
              <div className="flex flex-col gap-2 pt-1 border-t border-line/60">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-extrabold text-muted uppercase tracking-wider">
                    Đính kèm thêm:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveAttachTab(activeAttachTab === 'image' ? 'none' : 'image')}
                      className={`flex items-center gap-1 h-8 px-2.5 rounded-[8px] text-[13px] font-bold transition-all ${
                        activeAttachTab === 'image'
                          ? 'bg-primary text-white'
                          : 'bg-surface-2 text-ink border border-line'
                      }`}
                    >
                      <ImageIcon size={14} />
                      <span>+ Ảnh</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveAttachTab(activeAttachTab === 'file' ? 'none' : 'file')}
                      className={`flex items-center gap-1 h-8 px-2.5 rounded-[8px] text-[13px] font-bold transition-all ${
                        activeAttachTab === 'file'
                          ? 'bg-primary text-white'
                          : 'bg-surface-2 text-ink border border-line'
                      }`}
                    >
                      <FileText size={14} />
                      <span>+ PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveAttachTab(activeAttachTab === 'video' ? 'none' : 'video')}
                      className={`flex items-center gap-1 h-8 px-2.5 rounded-[8px] text-[13px] font-bold transition-all ${
                        activeAttachTab === 'video'
                          ? 'bg-primary text-white'
                          : 'bg-surface-2 text-ink border border-line'
                      }`}
                    >
                      <VideoIcon size={14} />
                      <span>+ Video</span>
                    </button>
                  </div>
                </div>

                {/* Form thêm Ảnh nhỏ gọn */}
                {activeAttachTab === 'image' && (
                  <div className="flex flex-col gap-1.5 p-3 rounded-[12px] bg-surface-2 border border-line text-[13px] animate-in fade-in">
                    <input
                      type="url"
                      value={inputImageUrl}
                      onChange={(e) => setInputImageUrl(e.target.value)}
                      placeholder="Dán đường dẫn ảnh..."
                      className="w-full h-9 px-2.5 rounded-[8px] border border-line text-[14px]"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputImageCaption}
                        onChange={(e) => setInputImageCaption(e.target.value)}
                        placeholder="Chú thích ảnh (tùy chọn)..."
                        className="flex-1 h-9 px-2.5 rounded-[8px] border border-line text-[14px]"
                      />
                      <button
                        type="button"
                        onClick={handleAddAttachedImage}
                        className="h-9 px-3.5 rounded-[8px] bg-primary text-white font-bold text-[13px] shrink-0"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                )}

                {/* Form thêm PDF nhỏ gọn */}
                {activeAttachTab === 'file' && (
                  <div className="flex flex-col gap-1.5 p-3 rounded-[12px] bg-surface-2 border border-line text-[13px] animate-in fade-in">
                    <input
                      type="text"
                      value={inputFileName}
                      onChange={(e) => setInputFileName(e.target.value)}
                      placeholder="Tên tài liệu (vd: Hướng dẫn chăm sóc.pdf)..."
                      className="w-full h-9 px-2.5 rounded-[8px] border border-line text-[14px]"
                    />
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={inputFileUrl}
                        onChange={(e) => setInputFileUrl(e.target.value)}
                        placeholder="Đường dẫn file PDF..."
                        className="flex-1 h-9 px-2.5 rounded-[8px] border border-line text-[14px]"
                      />
                      <button
                        type="button"
                        onClick={handleAddAttachedFile}
                        className="h-9 px-3.5 rounded-[8px] bg-primary text-white font-bold text-[13px] shrink-0"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                )}

                {/* Form thêm Video nhỏ gọn */}
                {activeAttachTab === 'video' && (
                  <div className="flex flex-col gap-1.5 p-3 rounded-[12px] bg-surface-2 border border-line text-[13px] animate-in fade-in">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={inputVideoUrl}
                        onChange={(e) => setInputVideoUrl(e.target.value)}
                        placeholder="Dán link YouTube (youtube.com/watch?v=... hoặc youtu.be/...)"
                        className="flex-1 h-9 px-2.5 rounded-[8px] border border-line text-[14px]"
                      />
                      <button
                        type="button"
                        onClick={handleAddAttachedVideo}
                        disabled={isLoadingVideo}
                        className="h-9 px-3.5 rounded-[8px] bg-primary text-white font-bold text-[13px] shrink-0 disabled:opacity-50"
                      >
                        {isLoadingVideo ? 'Đang lấy...' : 'Thêm'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Danh sách các đính kèm hiện có trong khối này */}
                {(attachedImages.length > 0 || attachedFiles.length > 0 || attachedVideos.length > 0) && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {attachedImages.map((img, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 h-7 px-2 rounded-full bg-[#E3ECF7] text-[#244A78] text-[12px] font-bold"
                      >
                        <span>📷 Ảnh {i + 1}</span>
                        <button
                          type="button"
                          onClick={() => setAttachedImages(attachedImages.filter((_, idx) => idx !== i))}
                          className="hover:text-red-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {attachedFiles.map((f, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 h-7 px-2 rounded-full bg-[#E0EDEB] text-[#2F6B63] text-[12px] font-bold"
                      >
                        <span className="truncate max-w-[120px]">📄 {f.name}</span>
                        <button
                          type="button"
                          onClick={() => setAttachedFiles(attachedFiles.filter((_, idx) => idx !== i))}
                          className="hover:text-red-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {attachedVideos.map((v, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 h-7 px-2 rounded-full bg-[#FFF1E6] text-[#8A3A14] text-[12px] font-bold"
                      >
                        <span className="truncate max-w-[120px]">🎬 {v.title}</span>
                        <button
                          type="button"
                          onClick={() => setAttachedVideos(attachedVideos.filter((_, idx) => idx !== i))}
                          className="hover:text-red-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Dành cho block images gốc */}
          {block.type === 'images' && (
            <div className="flex flex-col gap-3">
              <label className="text-[14px] font-bold text-ink">
                Danh sách ảnh ({imageList.length})
              </label>
              <div className="flex flex-col gap-2">
                {imageList.map((img, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-[12px] bg-surface-2 border border-line">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="w-12 h-12 rounded-[8px] object-cover" />
                    <span className="flex-1 text-[13px] truncate">{img.caption || img.url}</span>
                    <button
                      type="button"
                      onClick={() => setImageList(imageList.filter((_, i) => i !== idx))}
                      className="p-1.5 text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dành cho block files gốc */}
          {block.type === 'files' && (
            <div className="flex flex-col gap-3">
              <label className="text-[14px] font-bold text-ink">
                Danh sách tài liệu ({fileList.length})
              </label>
              <div className="flex flex-col gap-2">
                {fileList.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-[12px] bg-surface-2 border border-line">
                    <span className="text-[14px] font-bold truncate max-w-[260px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setFileList(fileList.filter((_, i) => i !== idx))}
                      className="p-1.5 text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 px-5 border-t border-line flex items-center justify-end gap-2.5 bg-surface">
          <button
            type="button"
            onClick={onClose}
            className="h-[46px] min-h-[44px] px-4 rounded-[12px] bg-surface-2 text-ink font-bold text-[15px]"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center justify-center gap-1.5 h-[46px] min-h-[44px] px-6 rounded-[12px] bg-primary text-white font-extrabold text-[15px] shadow-sm"
          >
            <Save size={16} />
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
