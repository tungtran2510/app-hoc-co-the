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
  ChevronUp,
  ChevronDown,
  Upload,
  Code,
  Eye,
  EyeOff,
  Palette,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignJustify,
  Type,
} from 'lucide-react';
import { Block, Image as ImageType, FileItem, Video } from '../../lib/types';
import { extractYouTubeId, fetchYouTubeMeta } from '../../lib/youtube';
import { uploadImageFile, uploadPdfFile } from '../../lib/storageUpload';

const TITLE_COLORS = [
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Lam', hex: '#2563EB' },
  { name: 'Ngọc', hex: '#0D9488' },
  { name: 'Lá', hex: '#16A34A' },
  { name: 'Đỏ', hex: '#DC2626' },
  { name: 'Cam', hex: '#EA580C' },
  { name: 'Vàng', hex: '#CA8A04' },
  { name: 'Tím', hex: '#7C3AED' },
];

const TEXT_COLORS = [
  { name: 'Tự động', hex: '', preview: '#94A3B8' },
  { name: 'Than tối', hex: '#1E293B', preview: '#1E293B' },
  { name: 'Xám đậm', hex: '#475569', preview: '#475569' },
  { name: 'Navy y khoa', hex: '#1E3A8A', preview: '#1E3A8A' },
  { name: 'Ngọc thạch', hex: '#0D9488', preview: '#0D9488' },
  { name: 'Xanh lá', hex: '#16A34A', preview: '#16A34A' },
  { name: 'Đỏ nổi bật', hex: '#DC2626', preview: '#DC2626' },
  { name: 'Cam cảnh báo', hex: '#EA580C', preview: '#EA580C' },
  { name: 'Hổ phách', hex: '#CA8A04', preview: '#CA8A04' },
  { name: 'Tím hoàng gia', hex: '#7C3AED', preview: '#7C3AED' },
  { name: 'Trắng sáng', hex: '#FFFFFF', preview: '#E2E8F0' },
];

const FONT_SIZE_OPTIONS = [
  { value: 'small', label: 'Nhỏ', px: '14px' },
  { value: 'normal', label: 'Tiêu chuẩn', px: '16px' },
  { value: 'large', label: 'Lớn', px: '18px' },
  { value: 'xlarge', label: 'Rất lớn', px: '21px' },
];

const HTML_TEMPLATES = [
  {
    label: '💡 Hộp thông tin',
    snippet: `<div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-left: 4px solid #2563eb; padding: 14px 16px; border-radius: 12px; margin: 10px 0;">\n  <div style="font-weight: 700; color: #1e40af; margin-bottom: 4px;">💡 Điểm cốt lõi cần nhớ</div>\n  <p style="margin: 0; color: #1e3a8a; line-height: 1.6; font-size: 15px;">Nội dung giải thích chi tiết, ngắn gọn và dễ hiểu tại đây.</p>\n</div>`,
  },
  {
    label: '⚠️ Cảnh báo',
    snippet: `<div style="background: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #dc2626; padding: 14px 16px; border-radius: 12px; margin: 10px 0;">\n  <div style="font-weight: 700; color: #991b1b; margin-bottom: 4px;">⚠️ Lưu ý sai lầm thường gặp</div>\n  <p style="margin: 0; color: #7f1d1d; line-height: 1.6; font-size: 15px;">Tránh cúi gập cổ nhìn điện thoại quá lâu hoặc mang vác vật nặng sai tư thế.</p>\n</div>`,
  },
  {
    label: '💬 Trích dẫn',
    snippet: `<blockquote style="margin: 12px 0; padding: 12px 16px; border-left: 3px solid #0d9488; background: #f0fdf4; border-radius: 0 12px 12px 0; font-style: italic; color: #134e4a; font-size: 15px; line-height: 1.6;">\n  "Cột sống là cột trụ nâng đỡ toàn bộ cơ thể. Chăm sóc đĩa đệm hôm nay là giữ gìn sự linh hoạt cho tương lai."\n  <div style="text-align: right; font-style: normal; font-weight: 700; font-size: 13px; color: #047857; margin-top: 6px;">— Bác sĩ Chuyên khoa</div>\n</blockquote>`,
  },
  {
    label: '📊 Bảng 2 cột',
    snippet: `<div style="overflow-x: auto; margin: 10px 0;">\n  <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">\n    <thead>\n      <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">\n        <th style="padding: 8px 12px; color: #1e293b; font-weight: 700;">Nên làm</th>\n        <th style="padding: 8px 12px; color: #1e293b; font-weight: 700;">Nên tránh</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr style="border-bottom: 1px solid #e2e8f0;">\n        <td style="padding: 8px 12px; color: #166534;">✔ Ngồi thẳng lưng, vai thả lỏng</td>\n        <td style="padding: 8px 12px; color: #991b1b;">✘ Ngồi gù lưng, vắt chéo chân</td>\n      </tr>\n      <tr>\n        <td style="padding: 8px 12px; color: #166534;">✔ Đổi tư thế sau 45 phút</td>\n        <td style="padding: 8px 12px; color: #991b1b;">✘ Bất động liên tục > 2 giờ</td>\n      </tr>\n    </tbody>\n  </table>\n</div>`,
  },
];

function sanitizeHtml(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '');
}

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
  // State cho text block: Tiêu đề & Màu sắc
  const [blockTitle, setBlockTitle] = useState<string>(
    block.type === 'text' ? block.data.title || '' : ''
  );
  const [titleColor, setTitleColor] = useState<string>(
    block.type === 'text' ? block.data.title_color || '#1E3A8A' : '#1E3A8A'
  );
  // Chế độ khối: 'text' (Văn bản thường) hoặc 'html' (Mã HTML tùy biến)
  const [blockMode, setBlockMode] = useState<'text' | 'html'>(
    block.type === 'text'
      ? block.data.mode || (block.display_style === 'html' ? 'html' : 'text')
      : 'text'
  );
  const [htmlContent, setHtmlContent] = useState<string>(
    block.type === 'text'
      ? block.data.html || (block.display_style === 'html' ? block.data.lines.join('\n') : '')
      : ''
  );
  const [showHtmlPreview, setShowHtmlPreview] = useState<boolean>(false);

  // State cho text block
  const [textLines, setTextLines] = useState<string>(
    block.type === 'text' ? block.data.lines.join('\n') : ''
  );
  const [displayStyle, setDisplayStyle] = useState<string>(
    block.type === 'text' ? (block.display_style === 'html' ? 'van_ban' : block.display_style) : 'van_ban'
  );
  const [textFormat, setTextFormat] = useState<'paragraph' | 'numbered' | 'bullet'>(
    block.type === 'text' ? block.data.format || 'paragraph' : 'paragraph'
  );
  const [fontSize, setFontSize] = useState<string>(
    block.type === 'text' ? block.data.font_size || 'normal' : 'normal'
  );
  const [textColor, setTextColor] = useState<string>(
    block.type === 'text' ? block.data.text_color || '' : ''
  );
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>(
    block.type === 'text' ? block.data.text_align || 'left' : 'left'
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
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // State cho images block gốc
  const [imageList, setImageList] = useState<ImageType[]>(
    block.type === 'images' ? [...block.data.images] : []
  );
  const [newImgUrl, setNewImgUrl] = useState('');
  const [newImgCaption, setNewImgCaption] = useState('');

  // State cho files block gốc
  const [fileList, setFileList] = useState<FileItem[]>(
    block.type === 'files' ? [...block.data.files] : []
  );
  const [newFileName, setNewFileName] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [bookCoverUrl, setBookCoverUrl] = useState<string>(
    block.type === 'files' ? block.data.cover_url || '' : ''
  );

  // State cho links block gốc
  const [linkList, setLinkList] = useState<{ page_id?: string; url?: string; label?: string }[]>(
    block.type === 'links' ? [...block.data.items] : []
  );
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // State cho videos block gốc
  const [videoList, setVideoList] = useState<Video[]>(
    block.type === 'videos' ? [...block.data.videos] : []
  );
  const [newVidUrl, setNewVidUrl] = useState('');
  const [newVidTitle, setNewVidTitle] = useState('');
  const [newVidDuration, setNewVidDuration] = useState('5 phút');
  const [newVidThumb, setNewVidThumb] = useState('');

  // State cho comparison block
  const [leftTitle, setLeftTitle] = useState(
    block.type === 'comparison' ? block.data.left_title || 'Nên làm / Đốt sống khỏe' : 'Nên làm'
  );
  const [leftLinesText, setLeftLinesText] = useState(
    block.type === 'comparison' && block.data.left_lines ? block.data.left_lines.join('\n') : ''
  );
  const [rightTitle, setRightTitle] = useState(
    block.type === 'comparison' ? block.data.right_title || 'Tránh làm / Nguy cơ thoái hóa' : 'Tránh làm'
  );
  const [rightLinesText, setRightLinesText] = useState(
    block.type === 'comparison' && block.data.right_lines ? block.data.right_lines.join('\n') : ''
  );

  if (!isOpen) return null;

  // Thêm ảnh đính kèm trong text
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

  // Thêm file PDF đính kèm trong text
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

  // Thêm video đính kèm trong text
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

  // Thêm ảnh vào block images
  const handleAddImageToBlock = () => {
    if (!newImgUrl.trim()) return;
    setImageList([...imageList, { url: newImgUrl.trim(), caption: newImgCaption.trim() || undefined }]);
    setNewImgUrl('');
    setNewImgCaption('');
  };

  // Thêm file vào block files
  const handleAddFileToBlock = () => {
    if (!newFileName.trim() || !newFileUrl.trim()) return;
    setFileList([...fileList, { name: newFileName.trim(), url: newFileUrl.trim(), size_bytes: 1500000 }]);
    setNewFileName('');
    setNewFileUrl('');
  };

  // Thêm link vào block links
  const handleAddLinkToBlock = () => {
    if (!newLinkLabel.trim()) return;
    setLinkList([...linkList, { label: newLinkLabel.trim(), url: newLinkUrl.trim() || '#' }]);
    setNewLinkLabel('');
    setNewLinkUrl('');
  };

  // Thêm video vào block videos
  const handleAddVideoToBlock = async () => {
    const yid = extractYouTubeId(newVidUrl) || '';
    let title = newVidTitle.trim();
    let thumb = yid ? `https://i.ytimg.com/vi/${yid}/hqdefault.jpg` : undefined;

    if (!title && yid) {
      const meta = await fetchYouTubeMeta(yid);
      title = meta.title;
      if (!newVidThumb) {
        thumb = meta.thumbnail_url;
      }
    }

    if (!title && !yid) {
      alert('Vui lòng dán link YouTube hoặc nhập tên video');
      return;
    }

    setVideoList([
      ...videoList,
      {
        youtube_id: yid,
        title: title || `Video bài học (${yid})`,
        duration_text: newVidDuration.trim() || '5 phút',
        thumbnail_url: newVidThumb.trim() || thumb,
      },
    ]);
    setNewVidUrl('');
    setNewVidTitle('');
    setNewVidThumb('');
  };

  const handleSave = () => {
    if (block.type === 'text') {
      const lines = textLines
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const isHtml = blockMode === 'html';
      const cleanHtml = isHtml ? htmlContent.trim() : undefined;

      const updated: Block = {
        ...block,
        display_style: isHtml ? 'html' : displayStyle,
        data: {
          title: blockTitle.trim() || undefined,
          title_color: titleColor || undefined,
          mode: blockMode,
          html: cleanHtml,
          lines: lines.length > 0 ? lines : (isHtml ? ['Khối nội dung HTML'] : ['Nội dung mới']),
          format: textFormat,
          font_size: fontSize,
          text_color: textColor.trim() || undefined,
          text_align: textAlign,
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
          cover_url: bookCoverUrl.trim() || undefined,
        },
      };
      onSaveBlock(updated);
    } else if (block.type === 'links') {
      const updated: Block = {
        ...block,
        data: {
          items: linkList,
        },
      };
      onSaveBlock(updated);
    } else if (block.type === 'videos') {
      const updated: Block = {
        ...block,
        data: {
          videos: videoList,
        },
      };
      onSaveBlock(updated);
    } else if (block.type === 'comparison') {
      const leftLines = leftLinesText
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      const rightLines = rightLinesText
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      const updated: Block = {
        ...block,
        data: {
          left_title: leftTitle.trim() || 'Nên làm / Đốt sống khỏe',
          left_lines: leftLines.length > 0 ? leftLines : ['Nội dung cột 1'],
          right_title: rightTitle.trim() || 'Tránh làm / Nguy cơ thoái hóa',
          right_lines: rightLines.length > 0 ? rightLines : ['Nội dung cột 2'],
        },
      };
      onSaveBlock(updated);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-[480px] max-h-[92vh] bg-white dark:bg-[#160E2E] rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200 border dark:border-white/10">
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
              {/* 1. Tiêu đề đoạn văn & Màu sắc tiêu đề */}
              <div className="flex flex-col gap-2.5 p-3.5 rounded-[16px] bg-slate-50 dark:bg-white/5 border border-line">
                <div className="flex items-center justify-between">
                  <label className="text-[14px] font-extrabold text-ink flex items-center gap-1.5">
                    <span>Tiêu đề đoạn văn</span>
                    <span className="text-[12px] text-muted font-normal">(tùy chọn)</span>
                  </label>
                  {blockTitle.trim() && (
                    <span
                      className="text-[11.5px] font-bold px-2 py-0.5 rounded-full border truncate max-w-[140px]"
                      style={{
                        color: titleColor,
                        borderColor: titleColor + '50',
                        backgroundColor: titleColor + '15',
                      }}
                    >
                      {blockTitle}
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  value={blockTitle}
                  onChange={(e) => setBlockTitle(e.target.value)}
                  placeholder="Nhập tiêu đề khối (VD: Cấu tạo đĩa đệm, Lưu ý quan trọng...)"
                  className="w-full h-[42px] px-3.5 rounded-[12px] bg-white dark:bg-[#1E1342] border border-line text-[15px] font-bold text-ink focus:border-primary focus:outline-none transition-all"
                  style={{ color: blockTitle ? titleColor : undefined }}
                />

                {/* Chọn màu sắc tiêu đề */}
                <div className="flex flex-col gap-1.5 pt-1 border-t border-line/60">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] font-bold text-muted flex items-center gap-1.5">
                      <Palette size={13} className="text-primary" />
                      <span>Màu sắc tiêu đề:</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={titleColor}
                        onChange={(e) => setTitleColor(e.target.value)}
                        className="w-6 h-6 rounded-md border border-line cursor-pointer p-0 bg-transparent"
                        title="Bấm để chọn màu tùy thích"
                      />
                      <span className="text-[11px] font-mono text-muted">{titleColor}</span>
                    </div>
                  </div>

                  {/* 8 Màu chips chuẩn y khoa / thiết kế */}
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {TITLE_COLORS.map((col) => {
                      const isSelected = titleColor.toLowerCase() === col.hex.toLowerCase();
                      return (
                        <button
                          key={col.hex}
                          type="button"
                          onClick={() => setTitleColor(col.hex)}
                          className={`h-7 px-1.5 rounded-[8px] flex items-center justify-center text-[11px] font-bold transition-all border cursor-pointer ${
                            isSelected
                              ? 'ring-2 ring-primary ring-offset-1 text-white shadow-xs'
                              : 'border-line text-ink bg-white dark:bg-[#1C123D] hover:scale-105'
                          }`}
                          style={{
                            backgroundColor: isSelected ? col.hex : undefined,
                          }}
                          title={col.name}
                        >
                          {isSelected ? (
                            <Check size={12} className="stroke-[3]" />
                          ) : (
                            <span
                              className="w-2.5 h-2.5 rounded-full mr-1 shrink-0"
                              style={{ backgroundColor: col.hex }}
                            />
                          )}
                          <span className="truncate">{col.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. Segmented Control 2 Chế độ: Văn bản thường vs Mã HTML tùy biến */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-extrabold text-ink">
                  Chế độ khối nội dung
                </label>
                <div className="grid grid-cols-2 p-1 rounded-[14px] bg-surface-2 border border-line">
                  <button
                    type="button"
                    onClick={() => setBlockMode('text')}
                    className={`h-[38px] rounded-[10px] flex items-center justify-center gap-2 font-bold text-[14px] transition-all cursor-pointer ${
                      blockMode === 'text'
                        ? 'bg-white dark:bg-[#1C123D] text-primary shadow-xs'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    <FileText size={16} />
                    <span>Văn bản thường</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlockMode('html')}
                    className={`h-[38px] rounded-[10px] flex items-center justify-center gap-2 font-bold text-[14px] transition-all cursor-pointer ${
                      blockMode === 'html'
                        ? 'bg-white dark:bg-[#1C123D] text-primary shadow-xs'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    <Code size={16} />
                    <span>Mã HTML tùy biến</span>
                  </button>
                </div>
              </div>

              {/* 3. Chi tiết theo từng chế độ */}
              {blockMode === 'html' ? (
                <div className="flex flex-col gap-2.5">
                  {/* Mẫu HTML chèn nhanh & nút xem trước */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] font-bold text-muted flex items-center gap-1">
                        <Sparkles size={13} className="text-amber-500" />
                        <span>Mẫu HTML dựng sẵn (bấm để chèn):</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowHtmlPreview(!showHtmlPreview)}
                        className={`flex items-center gap-1 text-[12px] font-bold px-2 py-0.5 rounded-[6px] transition-all cursor-pointer ${
                          showHtmlPreview
                            ? 'bg-primary text-white shadow-2xs'
                            : 'bg-surface-2 text-ink border border-line hover:border-primary'
                        }`}
                      >
                        {showHtmlPreview ? <EyeOff size={12} /> : <Eye size={12} />}
                        <span>{showHtmlPreview ? 'Ẩn xem trước' : 'Xem trước HTML'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {HTML_TEMPLATES.map((tmpl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            const current = htmlContent.trim();
                            setHtmlContent(current ? `${current}\n\n${tmpl.snippet}` : tmpl.snippet);
                          }}
                          className="h-8 px-2 rounded-[8px] bg-white dark:bg-[#1C123D] border border-line hover:border-primary text-ink text-[12px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                        >
                          <span>{tmpl.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Textarea soạn mã HTML */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[14px] font-bold text-ink flex items-center justify-between">
                      <span>Mã HTML tùy biến</span>
                      <span className="text-[11.5px] font-mono text-muted">Hỗ trợ HTML5 & inline CSS</span>
                    </label>
                    <textarea
                      rows={6}
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      placeholder="<div>Nhập hoặc dán mã HTML tại đây...</div>"
                      className="w-full p-3 rounded-[14px] border border-line text-[13.5px] font-mono leading-relaxed focus:border-primary bg-slate-900 text-emerald-400 dark:bg-black/60 focus:outline-none"
                    />
                  </div>

                  {/* Khung xem trước trực tiếp */}
                  {showHtmlPreview && (
                    <div className="flex flex-col gap-2 p-3.5 rounded-[14px] bg-slate-50 dark:bg-white/5 border-2 border-dashed border-primary/40 animate-in fade-in">
                      <div className="flex items-center justify-between pb-1.5 border-b border-line text-[12px] font-extrabold text-primary">
                        <span>👁️ XEM TRƯỚC HIỂN THỊ THỰC TẾ:</span>
                      </div>
                      {blockTitle.trim() && (
                        <h4
                          className="text-[18px] font-extrabold m-0 pt-0.5"
                          style={{ color: titleColor }}
                        >
                          {blockTitle}
                        </h4>
                      )}
                      <div
                        className="p-3 bg-white dark:bg-[#160E2E] rounded-[10px] border border-line text-ink text-[15px] leading-relaxed overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html:
                            sanitizeHtml(htmlContent) ||
                            '<p class="text-muted italic text-[13px] m-0">Chưa có mã HTML. Bấm vào các nút mẫu phía trên để chèn nhanh.</p>',
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                /* Khối Văn bản thường */
                <>
                  {/* Chọn kiểu khối chữ */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[14px] font-bold text-ink">
                      Kiểu hiển thị khối
                    </label>
                    <select
                      value={displayStyle}
                      onChange={(e) => setDisplayStyle(e.target.value)}
                      className="w-full h-[44px] px-3 rounded-[12px] bg-white dark:bg-[#1E1342] border border-line text-[15px] text-ink font-semibold focus:border-primary"
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
                        className={`h-10 rounded-[10px] font-bold text-[13px] transition-all cursor-pointer ${
                          textFormat === 'paragraph'
                            ? 'bg-primary text-white shadow-2xs'
                            : 'bg-surface-2 text-ink border border-line hover:border-primary'
                        }`}
                      >
                        Đoạn văn
                      </button>
                      <button
                        type="button"
                        onClick={() => setTextFormat('numbered')}
                        className={`h-10 rounded-[10px] font-bold text-[13px] transition-all cursor-pointer ${
                          textFormat === 'numbered'
                            ? 'bg-primary text-white shadow-2xs'
                            : 'bg-surface-2 text-ink border border-line hover:border-primary'
                        }`}
                      >
                        Số 1, 2, 3
                      </button>
                      <button
                        type="button"
                        onClick={() => setTextFormat('bullet')}
                        className={`h-10 rounded-[10px] font-bold text-[13px] transition-all cursor-pointer ${
                          textFormat === 'bullet'
                            ? 'bg-primary text-white shadow-2xs'
                            : 'bg-surface-2 text-ink border border-line hover:border-primary'
                        }`}
                      >
                        Gạch đầu dòng
                      </button>
                    </div>
                  </div>

                  {/* Cài đặt Cỡ chữ, Màu chữ & Căn lề */}
                  <div className="flex flex-col gap-2.5 p-3 rounded-[16px] bg-slate-50 dark:bg-white/5 border border-line">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-extrabold text-ink flex items-center gap-1.5">
                        <Type size={14} className="text-primary" />
                        <span>Cài đặt chữ & Màu sắc</span>
                      </span>
                      <span className="text-[11px] text-muted font-mono">
                        {fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : fontSize === 'xlarge' ? '21px' : '16px'} • {textColor || 'Tự động'}
                      </span>
                    </div>

                    {/* Cỡ chữ */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[12px] font-bold text-muted">Cỡ chữ văn bản:</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {FONT_SIZE_OPTIONS.map((opt) => {
                          const isSel = fontSize === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setFontSize(opt.value)}
                              className={`h-9 rounded-[9px] flex flex-col items-center justify-center transition-all cursor-pointer border ${
                                isSel
                                  ? 'bg-primary text-white border-primary shadow-xs font-black'
                                  : 'bg-white dark:bg-[#1C123D] border-line text-ink hover:border-primary font-bold'
                              }`}
                            >
                              <span className="text-[12px] leading-tight">{opt.label}</span>
                              <span className={`text-[10px] leading-tight ${isSel ? 'text-white/80' : 'text-muted'}`}>{opt.px}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Căn lề */}
                    <div className="flex flex-col gap-1 pt-1 border-t border-line/50">
                      <span className="text-[12px] font-bold text-muted">Căn lề:</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setTextAlign('left')}
                          className={`h-8 rounded-[8px] flex items-center justify-center gap-1 text-[12px] font-bold transition-all cursor-pointer border ${
                            textAlign === 'left'
                              ? 'bg-primary text-white border-primary shadow-2xs'
                              : 'bg-white dark:bg-[#1C123D] border-line text-ink'
                          }`}
                        >
                          <AlignLeft size={13} />
                          <span>Căn trái</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTextAlign('center')}
                          className={`h-8 rounded-[8px] flex items-center justify-center gap-1 text-[12px] font-bold transition-all cursor-pointer border ${
                            textAlign === 'center'
                              ? 'bg-primary text-white border-primary shadow-2xs'
                              : 'bg-white dark:bg-[#1C123D] border-line text-ink'
                          }`}
                        >
                          <AlignCenter size={13} />
                          <span>Giữa</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTextAlign('justify')}
                          className={`h-8 rounded-[8px] flex items-center justify-center gap-1 text-[12px] font-bold transition-all cursor-pointer border ${
                            textAlign === 'justify'
                              ? 'bg-primary text-white border-primary shadow-2xs'
                              : 'bg-white dark:bg-[#1C123D] border-line text-ink'
                          }`}
                        >
                          <AlignJustify size={13} />
                          <span>Căn đều</span>
                        </button>
                      </div>
                    </div>

                    {/* Màu chữ */}
                    <div className="flex flex-col gap-1.5 pt-1 border-t border-line/50">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-muted flex items-center gap-1">
                          <Palette size={12} className="text-primary" />
                          <span>Màu chữ:</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={textColor || '#1E293B'}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-5 h-5 rounded border border-line cursor-pointer p-0 bg-transparent"
                            title="Chọn màu tự do"
                          />
                          {textColor ? (
                            <button
                              type="button"
                              onClick={() => setTextColor('')}
                              className="text-[10.5px] text-red-500 hover:underline font-bold"
                            >
                              Đặt lại
                            </button>
                          ) : (
                            <span className="text-[10.5px] text-muted italic">Mặc định</span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                        {TEXT_COLORS.map((col) => {
                          const isSel = (textColor === '' && col.hex === '') || (textColor.toLowerCase() === col.hex.toLowerCase() && col.hex !== '');
                          return (
                            <button
                              key={col.name}
                              type="button"
                              onClick={() => setTextColor(col.hex)}
                              className={`h-7 px-1.5 rounded-[7px] flex items-center justify-center text-[10.5px] font-bold transition-all border cursor-pointer ${
                                isSel
                                  ? 'ring-2 ring-primary ring-offset-1 text-white shadow-2xs'
                                  : 'border-line text-ink bg-white dark:bg-[#1C123D] hover:scale-105'
                              }`}
                              style={{
                                backgroundColor: isSel ? (col.hex || '#2563EB') : undefined,
                              }}
                              title={col.name}
                            >
                              {col.hex ? (
                                <span
                                  className="w-2.5 h-2.5 rounded-full mr-1 shrink-0 border border-black/10"
                                  style={{ backgroundColor: col.hex }}
                                />
                              ) : null}
                              <span className="truncate">{col.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Nội dung dòng chữ */}
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

                  {/* Xem trước trực tiếp đoạn văn */}
                  {textLines.trim() && (
                    <div className="flex flex-col gap-1 p-2.5 rounded-[12px] bg-slate-50 dark:bg-white/5 border border-line/70">
                      <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
                        Xem trước chữ hiển thị:
                      </span>
                      <p
                        className={`m-0 leading-relaxed ${
                          fontSize === 'small'
                            ? 'text-[14px]'
                            : fontSize === 'large'
                            ? 'text-[18px]'
                            : fontSize === 'xlarge'
                            ? 'text-[21px]'
                            : 'text-[16px]'
                        }`}
                        style={{
                          color: textColor || undefined,
                          textAlign: textAlign,
                        }}
                      >
                        {textLines.split('\n')[0] || 'Nội dung văn bản'}
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* HÀNG NÚT GỌN GÀNG ĐÍNH KÈM THÊM: ẢNH / PDF / VIDEO */}
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
                    <div className="flex gap-1.5">
                      <input
                        type="url"
                        value={inputImageUrl}
                        onChange={(e) => setInputImageUrl(e.target.value)}
                        placeholder="Dán đường dẫn ảnh..."
                        className="flex-1 h-9 px-2.5 rounded-[8px] border border-line text-[14px]"
                      />
                      <label className="flex items-center gap-1 h-9 px-2.5 rounded-[8px] bg-primary-soft text-primary font-bold text-[12px] border border-primary/30 cursor-pointer shrink-0">
                        <Upload size={13} />
                        <span>{isUploadingMedia ? 'Đang nén...' : 'Chọn từ máy'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              setIsUploadingMedia(true);
                              const res = await uploadImageFile(file);
                              setInputImageUrl(res.url);
                            } catch (err: any) {
                              alert(err.message || 'Lỗi tải ảnh');
                            } finally {
                              setIsUploadingMedia(false);
                              e.target.value = '';
                            }
                          }}
                          disabled={isUploadingMedia}
                          className="hidden"
                        />
                      </label>
                    </div>
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
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={inputFileName}
                        onChange={(e) => setInputFileName(e.target.value)}
                        placeholder="Tên tài liệu..."
                        className="flex-1 h-9 px-2.5 rounded-[8px] border border-line text-[14px]"
                      />
                      <label className="flex items-center gap-1 h-9 px-2.5 rounded-[8px] bg-primary-soft text-primary font-bold text-[12px] border border-primary/30 cursor-pointer shrink-0">
                        <Upload size={13} />
                        <span>{isUploadingMedia ? 'Đang tải...' : 'Chọn file PDF'}</span>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              setIsUploadingMedia(true);
                              const res = await uploadPdfFile(file);
                              setInputFileName(res.fileName);
                              setInputFileUrl(res.url);
                            } catch (err: any) {
                              alert(err.message || 'Lỗi tải file PDF');
                            } finally {
                              setIsUploadingMedia(false);
                            }
                          }}
                          disabled={isUploadingMedia}
                          className="hidden"
                        />
                      </label>
                    </div>
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
                          className="hover:text-red-700 ml-0.5"
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
                          className="hover:text-red-700 ml-0.5"
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
                          className="hover:text-red-700 ml-0.5"
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
              <div className="flex flex-col gap-1.5 p-3 rounded-[14px] bg-surface-2 border border-line">
                <span className="text-[13px] font-bold text-ink">+ Thêm ảnh mới</span>
                <div className="flex gap-1.5">
                  <input
                    type="url"
                    value={newImgUrl}
                    onChange={(e) => setNewImgUrl(e.target.value)}
                    placeholder="Dán đường dẫn ảnh..."
                    className="flex-1 h-10 px-3 rounded-[10px] border border-line text-[14px]"
                  />
                  <label className="flex items-center gap-1 h-10 px-3 rounded-[10px] bg-primary-soft text-primary font-bold text-[13px] border border-primary/30 cursor-pointer hover:bg-primary-soft/80 shrink-0">
                    <Upload size={14} />
                    <span>{isUploadingMedia ? 'Đang nén...' : 'Chọn từ máy'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          setIsUploadingMedia(true);
                          const res = await uploadImageFile(file);
                          setNewImgUrl(res.url);
                        } catch (err: any) {
                          alert(err.message || 'Lỗi tải ảnh');
                        } finally {
                          setIsUploadingMedia(false);
                          e.target.value = '';
                        }
                      }}
                      disabled={isUploadingMedia}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImgCaption}
                    onChange={(e) => setNewImgCaption(e.target.value)}
                    placeholder="Chú thích ảnh..."
                    className="flex-1 h-10 px-3 rounded-[10px] border border-line text-[14px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageToBlock}
                    className="h-10 px-4 rounded-[10px] bg-primary text-white font-bold text-[14px] cursor-pointer"
                  >
                    Thêm
                  </button>
                </div>
              </div>

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
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
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
              {/* QUẢN LÝ ẢNH BÌA SÁCH (ATLAS / EBOOK COVER) */}
              <div className="flex flex-col gap-2 p-3.5 rounded-[16px] bg-amber-500/10 dark:bg-amber-950/20 border border-amber-400/40">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-black text-amber-900 dark:text-amber-200 flex items-center gap-1.5 uppercase tracking-wide">
                    <ImageIcon size={15} className="text-amber-600 dark:text-amber-400" />
                    <span>Ảnh bìa sách (Atlas / Ebook)</span>
                  </span>
                  {bookCoverUrl && (
                    <button
                      type="button"
                      onClick={() => setBookCoverUrl('')}
                      className="text-[11.5px] text-red-500 hover:text-red-700 font-bold underline cursor-pointer"
                    >
                      Dùng bìa mặc định
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-20 rounded-[10px] bg-slate-900 border border-amber-400/50 overflow-hidden relative shrink-0 shadow-sm flex items-center justify-center">
                    <img
                      src={bookCoverUrl || '/images/book_cover_blank.jpg'}
                      alt="Bìa sách"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 h-9 px-3 rounded-[10px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[12.5px] cursor-pointer shadow-xs transition-colors shrink-0">
                        <Upload size={14} />
                        <span>{isUploadingMedia ? 'Đang tải...' : 'Thay ảnh bìa sách'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              setIsUploadingMedia(true);
                              const res = await uploadImageFile(file);
                              setBookCoverUrl(res.url);
                            } catch (err: any) {
                              const reader = new FileReader();
                              reader.onload = (re) => {
                                if (re.target?.result) setBookCoverUrl(String(re.target.result));
                              };
                              reader.readAsDataURL(file);
                            } finally {
                              setIsUploadingMedia(false);
                            }
                          }}
                          disabled={isUploadingMedia}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11.5px] text-muted font-medium">Tự tải ảnh lên (JPG, PNG, WebP)</span>
                    </div>

                    <input
                      type="url"
                      value={bookCoverUrl}
                      onChange={(e) => setBookCoverUrl(e.target.value)}
                      placeholder="Hoặc dán link ảnh bìa (https://...)..."
                      className="h-8 px-2.5 rounded-[8px] border border-line text-[12.5px] bg-surface text-ink w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 p-3 rounded-[14px] bg-surface-2 border border-line">
                <span className="text-[13px] font-bold text-ink">+ Thêm tài liệu PDF mới</span>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Tên tài liệu..."
                  className="h-10 px-3 rounded-[10px] border border-line text-[14px]"
                />
                <div className="flex gap-1.5">
                  <input
                    type="url"
                    value={newFileUrl}
                    onChange={(e) => setNewFileUrl(e.target.value)}
                    placeholder="Đường dẫn file (https://...)..."
                    className="flex-1 h-10 px-3 rounded-[10px] border border-line text-[14px]"
                  />
                  <label className="flex items-center gap-1 h-10 px-3 rounded-[10px] bg-primary-soft text-primary font-bold text-[13px] border border-primary/30 cursor-pointer hover:bg-primary-soft/80 shrink-0">
                    <Upload size={14} />
                    <span>{isUploadingMedia ? 'Đang tải...' : 'Chọn file PDF'}</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          setIsUploadingMedia(true);
                          const res = await uploadPdfFile(file);
                          setNewFileName(res.fileName);
                          setNewFileUrl(res.url);
                        } catch (err: any) {
                          alert(err.message || 'Lỗi tải file PDF');
                        } finally {
                          setIsUploadingMedia(false);
                        }
                      }}
                      disabled={isUploadingMedia}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddFileToBlock}
                    className="h-10 px-5 rounded-[10px] bg-primary text-white font-bold text-[14px] cursor-pointer"
                  >
                    Thêm vào danh sách
                  </button>
                </div>
              </div>

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
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dành cho block links gốc (Bài liên quan) */}
          {block.type === 'links' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5 p-3 rounded-[14px] bg-surface-2 border border-line">
                <span className="text-[13px] font-bold text-ink">+ Thêm liên kết mới</span>
                <input
                  type="text"
                  value={newLinkLabel}
                  onChange={(e) => setNewLinkLabel(e.target.value)}
                  placeholder="Tiêu đề hiển thị..."
                  className="h-10 px-3 rounded-[10px] border border-line text-[14px]"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="Đường dẫn liên kết (/cot-song/dia-dem hoặc https://...)"
                    className="flex-1 h-10 px-3 rounded-[10px] border border-line text-[14px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddLinkToBlock}
                    className="h-10 px-4 rounded-[10px] bg-primary text-white font-bold text-[14px]"
                  >
                    Thêm
                  </button>
                </div>
              </div>

              <label className="text-[14px] font-bold text-ink">
                Danh sách liên kết ({linkList.length})
              </label>
              <div className="flex flex-col gap-2">
                {linkList.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-[12px] bg-surface-2 border border-line">
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-[14px] font-bold truncate">{item.label}</span>
                      <span className="text-[12px] text-muted truncate">{item.url || item.page_id}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLinkList(linkList.filter((_, i) => i !== idx))}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dành cho block videos gốc nếu mở qua EditBlockModal */}
          {block.type === 'videos' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5 p-3 rounded-[14px] bg-surface-2 border border-line">
                <span className="text-[13px] font-bold text-ink">+ Thêm video YouTube mới</span>
                <input
                  type="url"
                  value={newVidUrl}
                  onChange={(e) => setNewVidUrl(e.target.value)}
                  placeholder="Dán link YouTube (youtube.com/watch?v=... hoặc youtu.be/...)"
                  className="h-10 px-3 rounded-[10px] border border-line text-[14px]"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newVidTitle}
                    onChange={(e) => setNewVidTitle(e.target.value)}
                    placeholder="Tiêu đề video..."
                    className="flex-1 h-10 px-3 rounded-[10px] border border-line text-[14px]"
                  />
                  <input
                    type="text"
                    value={newVidDuration}
                    onChange={(e) => setNewVidDuration(e.target.value)}
                    placeholder="5 phút"
                    className="w-20 h-10 px-2 rounded-[10px] border border-line text-[14px]"
                  />
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="url"
                    value={newVidThumb}
                    onChange={(e) => setNewVidThumb(e.target.value)}
                    placeholder="Lớp phủ ảnh (URL ảnh bìa / thumbnail)..."
                    className="flex-1 h-10 px-3 rounded-[10px] border border-line text-[14px]"
                  />
                  <label className="flex items-center gap-1 h-10 px-3 rounded-[10px] bg-primary-soft text-primary font-bold text-[13px] border border-primary/30 cursor-pointer hover:bg-primary-soft/80 shrink-0">
                    <Upload size={14} />
                    <span>{isUploadingMedia ? 'Đang nén...' : 'Chọn ảnh bìa'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          setIsUploadingMedia(true);
                          const res = await uploadImageFile(file);
                          setNewVidThumb(res.url);
                        } catch (err: any) {
                          alert(err.message || 'Lỗi tải ảnh');
                        } finally {
                          setIsUploadingMedia(false);
                          e.target.value = '';
                        }
                      }}
                      disabled={isUploadingMedia}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleAddVideoToBlock}
                    className="h-10 px-4 rounded-[10px] bg-primary text-white font-bold text-[14px] cursor-pointer"
                  >
                    Thêm
                  </button>
                </div>
              </div>

              <label className="text-[14px] font-bold text-ink">
                Danh sách video ({videoList.length})
              </label>
              <div className="flex flex-col gap-2">
                {videoList.map((vid, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-[12px] bg-surface-2 border border-line">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      {vid.thumbnail_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={vid.thumbnail_url} alt="" className="w-12 h-8 rounded-[6px] object-cover" />
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-[14px] font-bold truncate">{vid.title}</span>
                        <span className="text-[12px] text-muted truncate">{vid.duration_text} · {vid.youtube_id}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVideoList(videoList.filter((_, i) => i !== idx))}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form chỉnh sửa So sánh 2 mặt (Comparison) */}
          {block.type === 'comparison' && (
            <div className="flex flex-col gap-4">
              {/* Cột 1: Bên trái */}
              <div className="p-3.5 rounded-[18px] bg-emerald-50 border border-emerald-300 flex flex-col gap-2.5 shadow-2xs">
                <label className="text-[13px] font-extrabold text-emerald-950 uppercase tracking-wide">
                  Cột 1: Nên làm / Bình thường (Màu xanh lá)
                </label>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-bold text-emerald-950">Tiêu đề cột 1:</span>
                  <input
                    type="text"
                    value={leftTitle}
                    onChange={(e) => setLeftTitle(e.target.value)}
                    placeholder="Ví dụ: Nên làm / Đốt sống khỏe"
                    className="w-full h-10 px-3 rounded-[10px] bg-white border border-emerald-300 text-[15px] font-bold text-emerald-950 focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-bold text-emerald-950">Các ý (mỗi dòng một ý):</span>
                  <textarea
                    rows={4}
                    value={leftLinesText}
                    onChange={(e) => setLeftLinesText(e.target.value)}
                    placeholder="Nhập các ý cần làm, mỗi dòng một ý..."
                    className="w-full p-3 rounded-[10px] bg-white border border-emerald-300 text-[15px] text-ink leading-relaxed"
                  />
                </div>
              </div>

              {/* Cột 2: Bên phải */}
              <div className="p-3.5 rounded-[18px] bg-[#FBE7E1] border border-[#9B3B32]/30 flex flex-col gap-2.5 shadow-2xs">
                <label className="text-[13px] font-extrabold text-[#7A2F12] uppercase tracking-wide">
                  Cột 2: Tránh làm / Bệnh lý (Màu đỏ gạch)
                </label>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-bold text-[#7A2F12]">Tiêu đề cột 2:</span>
                  <input
                    type="text"
                    value={rightTitle}
                    onChange={(e) => setRightTitle(e.target.value)}
                    placeholder="Ví dụ: Tránh làm / Nguy cơ thoái hóa"
                    className="w-full h-10 px-3 rounded-[10px] bg-white border border-[#9B3B32]/30 text-[15px] font-bold text-[#7A2F12] focus:border-accent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-bold text-[#7A2F12]">Các ý (mỗi dòng một ý):</span>
                  <textarea
                    rows={4}
                    value={rightLinesText}
                    onChange={(e) => setRightLinesText(e.target.value)}
                    placeholder="Nhập các ý cần tránh, mỗi dòng một ý..."
                    className="w-full p-3 rounded-[10px] bg-white border border-[#9B3B32]/30 text-[15px] text-ink leading-relaxed"
                  />
                </div>
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
