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
  HelpCircle,
  Crop,
} from 'lucide-react';
import { Block, Image as ImageType, FileItem, Video, RecommendedBook, FaqResource } from '../../lib/types';
import EditSingleRecommendedBookModal from './EditSingleRecommendedBookModal';
import { extractYouTubeId, fetchYouTubeMeta } from '../../lib/youtube';
import { uploadImageFile, uploadPdfFile } from '../../lib/storageUpload';
import { generateUuid } from '../../lib/uuid';
import ImageCropModal, { AspectRatioOption } from './ImageCropModal';

const TITLE_COLORS = [
  { name: 'Đen than', hex: '#1E293B' },
  { name: 'Tím đậm', hex: '#4C1D95' },
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
  { name: 'Tím than', hex: '#3B1262', preview: '#3B1262' },
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
    snippet: `<div style="background: linear-gradient(135deg, #fdfbf7 0%, #fef3c7 100%); border-left: 4px solid #d97706; padding: 14px 16px; border-radius: 12px; margin: 10px 0;">\n  <div style="font-weight: 700; color: #92400e; margin-bottom: 4px;">💡 Điểm cốt lõi cần nhớ</div>\n  <p style="margin: 0; color: #78350f; line-height: 1.6; font-size: 15px;">Nội dung giải thích chi tiết, ngắn gọn và dễ hiểu tại đây.</p>\n</div>`,
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
  onSaveBlock: (updatedBlock: Block) => void | boolean | Promise<void | boolean>;
  faqTopicOptions?: Array<{ id: string; title: string }>;
  faqVideoOptions?: Array<{ key: string; page_id: string; page_title: string; video_title: string; thumbnail_url?: string | null; index: number; topic_id: string; topic_title: string }>;
}

export default function EditBlockModal({
  isOpen,
  onClose,
  block,
  onSaveBlock,
  faqTopicOptions,
  faqVideoOptions,
}: EditBlockModalProps) {
  // State cho text block: Tiêu đề & Màu sắc
  const [blockTitle, setBlockTitle] = useState<string>(
    block.type === 'text' ? block.data.title || '' : ''
  );
  const [titleColor, setTitleColor] = useState<string>(
    block.type === 'text' ? block.data.title_color || '#1E293B' : '#1E293B'
  );
  // Chế độ khối: 'text' (Văn bản thường) hoặc 'html' (Mã HTML tùy biến)
  const [blockMode, setBlockMode] = useState<'text' | 'html'>(
    block.type === 'text'
      ? block.data.mode || (block.display_style === 'html' ? 'html' : 'text')
      : 'text'
  );
  const [htmlContent, setHtmlContent] = useState<string>(
    block.type === 'text'
      ? block.data.html || (block.display_style === 'html' ? (block.data.lines || []).join('\n') : '')
      : ''
  );
  const [showHtmlPreview, setShowHtmlPreview] = useState<boolean>(false);

  // State cho text block
  const [textLines, setTextLines] = useState<string>(
    block.type === 'text'
      ? block.display_style === 'html' && !block.data.html
        ? ''
        : (block.data.lines || []).join('\n')
      : ''
  );
  const [displayStyle, setDisplayStyle] = useState<string>(
    block.type === 'text' ? (block.display_style === 'html' ? 'van_ban' : block.display_style) : 'van_ban'
  );
  const [textFormat, setTextFormat] = useState<'paragraph' | 'numbered' | 'bullet'>(
    block.type === 'text' ? block.data.format || 'paragraph' : 'paragraph'
  );
  const [fontSize, setFontSize] = useState<string>(
    block.type === 'text' ? block.data.font_size || '' : ''
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

  // Modal cắt khung ảnh cho mọi loại ảnh trong block
  const [cropModalData, setCropModalData] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
    aspect: AspectRatioOption;
    onSave: (newUrl: string) => void;
  } | null>(null);

  // State cho images block gốc
  const [imageList, setImageList] = useState<ImageType[]>(
    block.type === 'images' && Array.isArray(block.data.images) ? [...block.data.images] : []
  );
  const [newImgUrl, setNewImgUrl] = useState<string>(
    block.type === 'images' && block.display_style === 'single' && Array.isArray(block.data.images) && block.data.images[0]?.url
      ? block.data.images[0].url
      : ''
  );
  const [newImgCaption, setNewImgCaption] = useState<string>(
    block.type === 'images' && block.display_style === 'single' && Array.isArray(block.data.images) && block.data.images[0]?.caption
      ? block.data.images[0].caption
      : ''
  );

  // State cho files block gốc
  const [fileList, setFileList] = useState<FileItem[]>(
    block.type === 'files' ? [...block.data.files] : []
  );
  const [newFileName, setNewFileName] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [bookCoverUrl, setBookCoverUrl] = useState<string>(
    block.type === 'files' ? block.data.cover_url || '' : ''
  );
  const [bookTitleInput, setBookTitleInput] = useState<string>(
    block.type === 'files' ? block.data.title || '' : ''
  );

  // State cho links block gốc
  const [linkList, setLinkList] = useState<{ page_id?: string; url?: string; label?: string }[]>(
    block.type === 'links' ? [...block.data.items] : []
  );
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // State cho videos block gốc
  const [videoList, setVideoList] = useState<Video[]>(
    block.type === 'videos' && Array.isArray(block.data.videos) ? [...block.data.videos] : []
  );
  const [newVidUrl, setNewVidUrl] = useState<string>(
    block.type === 'videos' && block.display_style === 'single' && Array.isArray(block.data.videos) && block.data.videos[0]?.youtube_id
      ? `https://www.youtube.com/watch?v=${block.data.videos[0].youtube_id}`
      : ''
  );
  const [newVidTitle, setNewVidTitle] = useState<string>(
    block.type === 'videos' && block.display_style === 'single' && Array.isArray(block.data.videos) && block.data.videos[0]?.title
      ? block.data.videos[0].title
      : ''
  );
  const [newVidDuration, setNewVidDuration] = useState<string>(
    block.type === 'videos' && block.display_style === 'single' && Array.isArray(block.data.videos) && block.data.videos[0]?.duration_text
      ? block.data.videos[0].duration_text
      : '5 phút'
  );
  const [newVidThumb, setNewVidThumb] = useState<string>(
    block.type === 'videos' && block.display_style === 'single' && Array.isArray(block.data.videos) && block.data.videos[0]?.thumbnail_url
      ? block.data.videos[0].thumbnail_url
      : ''
  );

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

  // State cho FAQ block
  const [faqTitle, setFaqTitle] = useState(
    block.type === 'faq' ? block.data.title || 'Hỏi - Đáp Thường Gặp (FAQ)' : 'Hỏi - Đáp Thường Gặp (FAQ)'
  );
  const [faqItems, setFaqItems] = useState<Array<{ id: string; question: string; answer: string; is_visible?: boolean; image_url?: string; resources?: FaqResource[]; learning_answers?: Array<{ id: string; text: string; target_topic_id?: string; target_page_id: string; target_video_index: number; video_links?: Array<{ id: string; target_topic_id: string; target_page_id: string; target_video_index: number }> }> }>>(
    block.type === 'faq' && Array.isArray(block.data.items)
      ? block.data.items.map((it) => {
          const learningAnswers = [...(it.learning_answers || [])];
          const legacyAnswer = it.answer?.trim();
          if (legacyAnswer) {
            const firstEmptyAnswer = learningAnswers.findIndex((answer) => !answer.text?.trim());
            if (firstEmptyAnswer >= 0) learningAnswers[firstEmptyAnswer] = { ...learningAnswers[firstEmptyAnswer], text: legacyAnswer };
            else learningAnswers.unshift({ id: generateUuid(), text: legacyAnswer, target_page_id: '', target_video_index: 0 });
          }
          return { ...it, answer: '', learning_answers: learningAnswers };
        })
      : []
  );
  const [faqVideoSearch, setFaqVideoSearch] = useState<Record<string, string>>({});
  const [faqVideoSearchActive, setFaqVideoSearchActive] = useState<Record<string, boolean>>({});
  const [faqAdditionalVideoSearch, setFaqAdditionalVideoSearch] = useState<Record<string, string>>({});
  const [faqAdditionalVideoSearchActive, setFaqAdditionalVideoSearchActive] = useState<Record<string, boolean>>({});
  const [expandedFaqAnswers, setExpandedFaqAnswers] = useState<Record<string, boolean>>({});
  const [expandedFaqItems, setExpandedFaqItems] = useState<Record<string, boolean>>({});
  const [faqAnswerLinkMode, setFaqAnswerLinkMode] = useState<Record<string, 'topic' | 'video'>>({});

  const handleAddFaqItem = () => {
    const id = generateUuid();
    setFaqItems([
      ...faqItems,
      {
        id,
        question: '',
        answer: '',
        is_visible: true,
        resources: [],
        learning_answers: [],
      },
    ]);
    setExpandedFaqItems((current) => ({ ...current, [id]: true }));
  };

  const handleUpdateFaqItem = (id: string, updates: Partial<{ question: string; answer: string; is_visible: boolean; image_url: string; resources: FaqResource[]; learning_answers: Array<{ id: string; text: string; target_topic_id?: string; target_page_id: string; target_video_index: number; video_links?: Array<{ id: string; target_topic_id: string; target_page_id: string; target_video_index: number }> }> }>) => {
    setFaqItems(faqItems.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const handleAddFaqResource = (item: (typeof faqItems)[number], kind: 'video' | 'link') => {
    handleUpdateFaqItem(item.id, {
      resources: [...(item.resources || []), { title: '', url: '', kind }],
    });
  };

  const handleAddLearningAnswer = (item: (typeof faqItems)[number]) => {
    const id = generateUuid();
    handleUpdateFaqItem(item.id, { learning_answers: [...(item.learning_answers || []), { id, text: '', target_topic_id: '', target_page_id: '', target_video_index: 0 }] });
    setExpandedFaqAnswers((current) => ({ ...current, [id]: true }));
  };

  const handleUpdateLearningAnswer = (item: (typeof faqItems)[number], answerId: string, updates: Partial<{ text: string; target_topic_id: string; target_page_id: string; target_video_index: number; video_links: Array<{ id: string; target_topic_id: string; target_page_id: string; target_video_index: number }> }>) => {
    handleUpdateFaqItem(item.id, { learning_answers: (item.learning_answers || []).map((answer) => answer.id === answerId ? { ...answer, ...updates } : answer) });
  };

  const handleUpdateAdditionalVideo = (item: (typeof faqItems)[number], answer: (NonNullable<(typeof faqItems)[number]['learning_answers']>)[number], videoId: string, updates: Partial<{ target_topic_id: string; target_page_id: string; target_video_index: number }>) => {
    handleUpdateLearningAnswer(item, answer.id, { video_links: (answer.video_links || []).map((video) => video.id === videoId ? { ...video, ...updates } : video) });
  };

  const handleMoveLearningAnswer = (item: (typeof faqItems)[number], index: number, direction: 'up' | 'down') => {
    const answers = [...(item.learning_answers || [])];
    const next = direction === 'up' ? index - 1 : index + 1;
    if (next < 0 || next >= answers.length) return;
    [answers[index], answers[next]] = [answers[next], answers[index]];
    handleUpdateFaqItem(item.id, { learning_answers: answers });
  };

  const handleDeleteFaqItem = (id: string) => {
    setFaqItems(faqItems.filter((item) => item.id !== id));
  };

  const handleMoveFaqItem = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= faqItems.length) return;
    const next = [...faqItems];
    const temp = next[index];
    next[index] = next[nextIndex];
    next[nextIndex] = temp;
    setFaqItems(next);
  };

  // State cho khối sách
  const [booksTitle, setBooksTitle] = useState<string>(block.type === 'books' ? block.data.title || '' : '');
  const [booksItems, setBooksItems] = useState<RecommendedBook[]>(
    block.type === 'books' && Array.isArray(block.data.books) ? block.data.books.map((b) => ({ ...b })) : []
  );
  const [editingBook, setEditingBook] = useState<RecommendedBook | null>(null);

  const handleAddBooksItem = () => {
    const nb: RecommendedBook = {
      id: generateUuid(),
      title: 'Tên cuốn sách mới',
      author: 'Tùng Dinh Dưỡng',
      cover_url: null,
      description: 'Mô tả ngắn gọn về cuốn sách này.',
      is_visible: true,
    };
    setBooksItems([...booksItems, nb]);
    setEditingBook(nb);
  };

  const handleMoveBooksItem = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= booksItems.length) return;
    const next = [...booksItems];
    const temp = next[index];
    next[index] = next[nextIndex];
    next[nextIndex] = temp;
    setBooksItems(next);
  };

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

  const handleSave = async () => {
    if (block.type === 'text') {
      const lines = textLines
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const isHtml = blockMode === 'html';
      const cleanHtml = isHtml ? htmlContent.trim() : undefined;

      const finalAttachedImages = [...attachedImages];
      if (inputImageUrl.trim()) {
        finalAttachedImages.push({ url: inputImageUrl.trim(), caption: inputImageCaption.trim() || undefined });
      }
      const finalAttachedFiles = [...attachedFiles];
      if (inputFileUrl.trim()) {
        finalAttachedFiles.push({ name: inputFileName.trim() || 'Tài liệu PDF', url: inputFileUrl.trim(), size_bytes: 2000000 });
      }
      const finalAttachedVideos = [...attachedVideos];
      if (inputVideoUrl.trim()) {
        const yid = extractYouTubeId(inputVideoUrl);
        if (yid) {
          finalAttachedVideos.push({
            youtube_id: yid,
            title: 'Video bài giảng',
            thumbnail_url: `https://i.ytimg.com/vi/${yid}/hqdefault.jpg`,
            duration_text: '5 phút',
          });
        }
      }

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
          font_size: fontSize || undefined,
          text_color: textColor.trim() || undefined,
          text_align: textAlign,
          images: finalAttachedImages.length > 0 ? finalAttachedImages : undefined,
          files: finalAttachedFiles.length > 0 ? finalAttachedFiles : undefined,
          videos: finalAttachedVideos.length > 0 ? finalAttachedVideos : undefined,
        },
      };
      const saved = await onSaveBlock(updated);
      if (saved === false) return;
      onClose();
      return;
    } else if (block.type === 'images') {
      let finalImages = [...imageList];
      if (block.display_style === 'single') {
        const targetUrl = newImgUrl.trim() || (imageList[0]?.url || '');
        if (targetUrl) {
          finalImages = [
            {
              url: targetUrl,
              caption: newImgCaption.trim() || undefined,
            },
          ];
        } else {
          finalImages = [];
        }
      } else {
        if (newImgUrl.trim()) {
          finalImages.push({
            url: newImgUrl.trim(),
            caption: newImgCaption.trim() || undefined,
          });
        }
      }
      const updated: Block = {
        ...block,
        data: {
          images: finalImages,
        },
      };
      onSaveBlock(updated);
    } else if (block.type === 'files') {
      const finalFiles = [...fileList];
      if (newFileUrl.trim()) {
        finalFiles.push({
          name: newFileName.trim() || 'Tài liệu PDF',
          url: newFileUrl.trim(),
          size_bytes: 1500000,
        });
      }
      const updated: Block = {
        ...block,
        data: {
          files: finalFiles,
          title: bookTitleInput.trim() || undefined,
          cover_url: bookCoverUrl.trim() || undefined,
        },
      };
      onSaveBlock(updated);
    } else if (block.type === 'links') {
      const finalLinks = [...linkList];
      if (newLinkLabel.trim() || newLinkUrl.trim()) {
        finalLinks.push({
          label: newLinkLabel.trim() || 'Liên kết',
          url: newLinkUrl.trim() || '#',
        });
      }
      const updated: Block = {
        ...block,
        data: {
          items: finalLinks,
        },
      };
      onSaveBlock(updated);
    } else if (block.type === 'videos') {
      let finalVideos = [...videoList];
      if (block.display_style === 'single') {
        const yid = extractYouTubeId(newVidUrl) || '';
        finalVideos = [
          {
            youtube_id: yid,
            title: newVidTitle.trim() || (yid ? `Video bài học (${yid})` : 'Video bài học'),
            duration_text: newVidDuration.trim() || '5 phút',
            thumbnail_url: newVidThumb.trim() || (yid ? `https://i.ytimg.com/vi/${yid}/hqdefault.jpg` : undefined),
          },
        ];
      } else {
        if (newVidUrl.trim()) {
          const yid = extractYouTubeId(newVidUrl) || '';
          if (yid || newVidTitle.trim()) {
            finalVideos.push({
              youtube_id: yid,
              title: newVidTitle.trim() || (yid ? `Video bài học (${yid})` : 'Video bài học'),
              duration_text: newVidDuration.trim() || '5 phút',
              thumbnail_url: newVidThumb.trim() || (yid ? `https://i.ytimg.com/vi/${yid}/hqdefault.jpg` : undefined),
            });
          }
        }
      }
      const updated: Block = {
        ...block,
        data: {
          videos: finalVideos,
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
    } else if (block.type === 'faq') {
      const cleanItems = faqItems
        .map((it) => ({
          id: it.id || generateUuid(),
          question: it.question.trim(),
          answer: it.answer.trim(),
          is_visible: it.is_visible !== false,
          learning_answers: (it.learning_answers || []).filter((answer) => answer.text.trim() || answer.target_topic_id || answer.target_page_id || answer.video_links?.some((video) => video.target_page_id)).map((answer) => ({ ...answer, text: answer.text.trim(), video_links: (answer.video_links || []).filter((video) => video.target_page_id) })),
          image_url: it.image_url?.trim() || undefined,
          resources: (it.resources || []).filter((resource) => resource.url.trim()).map((resource) => ({
            ...resource,
            title: resource.title.trim() || resource.url.trim(),
            url: resource.url.trim(),
            thumbnail_url: resource.thumbnail_url?.trim() || undefined,
          })),
        }))
        .filter((it) => it.question.length > 0 || it.answer.length > 0);

      const updated: Block = {
        ...block,
        data: {
          ...block.data,
          title: faqTitle.trim() || 'Hỏi - Đáp Thường Gặp (FAQ)',
          items: cleanItems,
        },
      };
      const saved = await onSaveBlock(updated);
      if (saved === false) return;
      onClose();
      return;
    } else if (block.type === 'books') {
      const updated: Block = {
        ...block,
        data: {
          title: booksTitle.trim(),
          books: booksItems.map((b) => ({ ...b, title: (b.title || '').trim() || 'Tên cuốn sách' })),
        },
      };
      onSaveBlock(updated);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="h-[90dvh] max-h-[90dvh] w-full max-w-[480px] bg-white dark:bg-[#160E2E] rounded-t-[22px] sm:h-[90vh] sm:max-h-[90vh] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200 border dark:border-white/10">
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

                  {/* Văn bản thường đi kèm (hiển thị phía trên HTML) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[14px] font-bold text-ink flex items-center justify-between">
                      <span>Văn bản thường (tùy chọn)</span>
                      <span className="text-[11.5px] text-muted font-normal">Hiện phía trên mã HTML · mỗi dòng 1 đoạn</span>
                    </label>
                    <textarea
                      rows={3}
                      value={htmlContent.trim() && textLines === 'Khối nội dung HTML' ? '' : textLines}
                      onChange={(e) => setTextLines(e.target.value)}
                      placeholder="Nhập văn bản thường nếu cần..."
                      className="w-full p-3 rounded-[14px] border border-line text-[15px] text-ink leading-relaxed focus:border-primary"
                    />
                    <span className="text-[11.5px] text-muted">Ảnh, PDF, video: dùng nút "+ Ảnh / + PDF / + Video" ở mục Đính kèm bên dưới.</span>
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
                      <option value="diem_can_nho">ĐIỂM CẦN NHỚ (nền tím nhạt)</option>
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
                        {fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : fontSize === 'xlarge' ? '21px' : fontSize === 'normal' ? '16px' : 'Tự động'} • {textColor || 'Tự động'}
                      </span>
                    </div>

                    {/* Cỡ chữ */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-muted">Cỡ chữ văn bản:</span>
                        <button
                          type="button"
                          onClick={() => setFontSize('')}
                          className={`h-6 px-2 rounded-[7px] text-[11px] font-bold cursor-pointer border ${
                            fontSize === '' ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-[#1C123D] border-line text-ink'
                          }`}
                          title="Theo cỡ chữ chung của trang (người học đổi được)"
                        >
                          Tự động
                        </button>
                      </div>
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
                                backgroundColor: isSel ? (col.hex || '#8B5CF6') : undefined,
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
                              setAttachedImages((prev) => [
                                ...prev,
                                { url: res.url, caption: inputImageCaption.trim() || undefined },
                              ]);
                              setInputImageUrl('');
                              setInputImageCaption('');
                              setActiveAttachTab('none');
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
                              setAttachedFiles((prev) => [
                                ...prev,
                                { name: inputFileName.trim() || res.fileName, url: res.url, size_bytes: file.size },
                              ]);
                              setInputFileName('');
                              setInputFileUrl('');
                              setActiveAttachTab('none');
                            } catch (err: any) {
                              alert(err.message || 'Lỗi tải file PDF');
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
              {block.display_style === 'single' ? (
                /* GIAO DIỆN ẢNH ĐƠN (SINGLE IMAGE) */
                <div className="flex flex-col gap-3 p-3.5 rounded-[16px] bg-surface-2 border border-line">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-ink flex items-center gap-1.5">
                      <ImageIcon size={16} className="text-primary" />
                      <span>Cài đặt ảnh đơn</span>
                    </span>
                    {(newImgUrl || imageList[0]?.url) && (
                      <button
                        type="button"
                        onClick={() => {
                          setNewImgUrl('');
                          setImageList([]);
                        }}
                        className="text-[12px] text-red-500 hover:text-red-700 font-bold underline cursor-pointer"
                      >
                        Xóa ảnh này
                      </button>
                    )}
                  </div>

                  {/* Xem trước ảnh đơn */}
                  {(newImgUrl || imageList[0]?.url) ? (
                    <div className="relative rounded-[12px] overflow-hidden border border-line bg-surface max-h-[260px] flex items-center justify-center group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={newImgUrl || imageList[0]?.url}
                        alt="Ảnh đơn"
                        className="w-full h-auto max-h-[260px] object-contain rounded-[12px]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setCropModalData({
                            isOpen: true,
                            url: newImgUrl || imageList[0]?.url || '',
                            title: 'Cắt & Căn Khung Ảnh Đơn',
                            aspect: 'auto',
                            onSave: (newUrl) => {
                              setNewImgUrl(newUrl);
                              setImageList([{ url: newUrl, caption: newImgCaption.trim() || undefined }]);
                            },
                          })
                        }
                        className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-[8px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[12px] flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                      >
                        <Crop size={14} strokeWidth={2.5} />
                        <span>Cắt & Căn khung</span>
                      </button>
                    </div>
                  ) : (
                    <div className="py-8 px-4 border-2 border-dashed border-line rounded-[14px] flex flex-col items-center justify-center text-center gap-2 bg-surface">
                      <ImageIcon size={32} className="text-muted/60" />
                      <span className="text-[13px] text-muted font-medium">Chưa có ảnh nào được chọn</span>
                    </div>
                  )}

                  {/* Nút tải ảnh hoặc dán link */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <label className="flex-1 flex items-center justify-center gap-2 h-11 px-4 rounded-[12px] bg-primary text-white font-bold text-[14px] cursor-pointer hover:bg-primary/90 transition-colors shadow-2xs">
                        <Upload size={16} />
                        <span>{isUploadingMedia ? 'Đang nén ảnh...' : 'Chọn ảnh từ thiết bị'}</span>
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
                              setImageList([{ url: res.url, caption: newImgCaption.trim() || undefined }]);
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

                    <div className="flex gap-1.5 items-center">
                      <input
                        type="url"
                        value={newImgUrl}
                        onChange={(e) => {
                          setNewImgUrl(e.target.value);
                          if (e.target.value.trim()) {
                            setImageList([{ url: e.target.value.trim(), caption: newImgCaption.trim() || undefined }]);
                          }
                        }}
                        placeholder="Hoặc dán URL ảnh (https://...)..."
                        className="flex-1 h-10 px-3 rounded-[10px] border border-line text-[13px] bg-surface"
                      />
                    </div>

                    <input
                      type="text"
                      value={newImgCaption}
                      onChange={(e) => {
                        setNewImgCaption(e.target.value);
                        if (newImgUrl || imageList[0]?.url) {
                          setImageList([{ url: newImgUrl || imageList[0]?.url || '', caption: e.target.value.trim() || undefined }]);
                        }
                      }}
                      placeholder="Chú thích ảnh (tùy chọn)..."
                      className="w-full h-10 px-3 rounded-[10px] border border-line text-[13px] bg-surface"
                    />
                  </div>
                </div>
              ) : (
                /* GIAO DIỆN BỘ SƯU TẬP ẢNH (GALLERY) */
                <>
                  <div className="flex flex-col gap-2 p-3.5 rounded-[14px] bg-surface-2 border border-line">
                    <span className="text-[13px] font-bold text-ink">+ Thêm ảnh vào bộ sưu tập</span>
                    <div className="flex gap-2">
                      <label className="flex-1 flex items-center justify-center gap-1.5 h-10 px-3 rounded-[10px] bg-primary text-white font-bold text-[13px] cursor-pointer hover:bg-primary/90 transition-colors shadow-2xs">
                        <Upload size={15} />
                        <span>{isUploadingMedia ? 'Đang nén...' : 'Chọn ảnh từ máy'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              setIsUploadingMedia(true);
                              const res = await uploadImageFile(file);
                              setImageList((prev) => [
                                ...prev,
                                { url: res.url, caption: newImgCaption.trim() || undefined },
                              ]);
                              setNewImgUrl('');
                              setNewImgCaption('');
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

                    <div className="flex gap-1.5">
                      <input
                        type="url"
                        value={newImgUrl}
                        onChange={(e) => setNewImgUrl(e.target.value)}
                        placeholder="Hoặc dán đường dẫn ảnh..."
                        className="flex-1 h-9 px-3 rounded-[8px] border border-line text-[13px] bg-surface"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newImgCaption}
                        onChange={(e) => setNewImgCaption(e.target.value)}
                        placeholder="Chú thích ảnh..."
                        className="flex-1 h-9 px-3 rounded-[8px] border border-line text-[13px] bg-surface"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageToBlock}
                        className="h-9 px-4 rounded-[8px] bg-primary text-white font-bold text-[13px] cursor-pointer"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>

                  <label className="text-[13px] font-bold text-ink">
                    Danh sách ảnh ({imageList.length}) - Chạm ảnh để cắt khung
                  </label>
                  <div className="flex flex-col gap-2">
                    {imageList.map((img, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2.5 rounded-[12px] bg-surface-2 border border-line">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <div
                          onClick={() =>
                            setCropModalData({
                              isOpen: true,
                              url: img.url,
                              title: `Cắt Ảnh #${idx + 1} Trong Khối`,
                              aspect: 'auto',
                              onSave: (newUrl) => {
                                setImageList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, url: newUrl } : item))
                                );
                              },
                            })
                          }
                          className="w-12 h-12 rounded-[8px] overflow-hidden shrink-0 cursor-pointer relative group border border-line hover:border-amber-400"
                          title="Nhấn vào để cắt khung ảnh"
                        >
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Crop size={14} className="text-amber-300" />
                          </div>
                        </div>
                        <span className="flex-1 text-[13px] truncate">{img.caption || img.url}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setCropModalData({
                              isOpen: true,
                              url: img.url,
                              title: `Cắt Ảnh #${idx + 1} Trong Khối`,
                              aspect: 'auto',
                              onSave: (newUrl) => {
                                setImageList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, url: newUrl } : item))
                                );
                              },
                            })
                          }
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md cursor-pointer"
                          title="Cắt ảnh này"
                        >
                          <Crop size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageList(imageList.filter((_, i) => i !== idx))}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                          title="Xóa ảnh này"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Dành cho block files gốc */}
          {block.type === 'files' && (
            <div className="flex flex-col gap-3">
              {/* QUẢN LÝ ẢNH BÌA SÁCH (ATLAS / EBOOK COVER) & TIÊU ĐỀ LỚP PHỦ */}
              <div className="flex flex-col gap-3 p-3.5 rounded-[16px] bg-amber-500/10 dark:bg-amber-950/20 border border-amber-400/40">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-black text-amber-900 dark:text-amber-200 flex items-center gap-1.5 uppercase tracking-wide">
                    <ImageIcon size={15} className="text-amber-600 dark:text-amber-400" />
                    <span>Lớp phủ ảnh bìa sách & Tiêu đề</span>
                  </span>
                  {bookCoverUrl && (
                    <button
                      type="button"
                      onClick={() => setBookCoverUrl('')}
                      className="text-[11.5px] text-red-500 hover:text-red-700 font-bold underline cursor-pointer"
                    >
                      Dùng bìa chuẩn mặc định
                    </button>
                  )}
                </div>

                {/* Tiêu đề hiển thị trên bìa sách */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-ink flex items-center gap-1">
                    <Type size={13} className="text-amber-500" />
                    <span>Tiêu đề hiển thị trên lớp phủ bìa:</span>
                  </label>
                  <input
                    type="text"
                    value={bookTitleInput}
                    onChange={(e) => setBookTitleInput(e.target.value)}
                    placeholder="Nhập tiêu đề sách hiển thị trên bìa (vd: Atlas Giải Phẫu Cột Sống 3D)..."
                    className="h-9 px-3 rounded-[8px] border border-line text-[13px] bg-surface text-ink w-full font-serif font-bold"
                  />
                </div>

                {/* Chọn mẫu nền sạch không có chữ */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11.5px] font-bold text-muted">
                    Chọn nhanh mẫu màu nền sạch sang trọng (Không in sẵn chữ):
                  </span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { name: 'Xanh Navy', url: '/documents/covers/clean_cover_navy.png' },
                      { name: 'Lục Bảo', url: '/documents/covers/clean_cover_emerald.png' },
                      { name: 'Đỏ Rượu', url: '/documents/covers/clean_cover_burgundy.png' },
                      { name: 'Đêm Midnight', url: '/documents/covers/clean_cover_slate.png' },
                      { name: 'Khung Vàng', url: '/documents/covers/clean_cover_pure_frame.png' },
                    ].map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setBookCoverUrl(preset.url)}
                        className={`flex flex-col items-center gap-1 p-1 rounded-[8px] border cursor-pointer transition-all ${
                          (bookCoverUrl || '/documents/covers/clean_cover_navy.png') === preset.url
                            ? 'border-amber-500 bg-amber-500/20 font-bold'
                            : 'border-line bg-surface hover:border-amber-400/50'
                        }`}
                      >
                        <div className="w-full aspect-square rounded-[4px] overflow-hidden bg-slate-900 border border-black/10">
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] text-ink truncate w-full text-center">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Xem trước và Tự tải ảnh lên */}
                <div className="flex items-center gap-3 pt-2 border-t border-amber-400/20">
                  <div
                    onClick={() => {
                      if (bookCoverUrl) {
                        setCropModalData({
                          isOpen: true,
                          url: bookCoverUrl,
                          title: 'Cắt & Căn Khung Ảnh Bìa Sách',
                          aspect: '1:1',
                          onSave: (newUrl) => setBookCoverUrl(newUrl),
                        });
                      }
                    }}
                    className={`w-16 h-16 rounded-[10px] bg-slate-900 border border-amber-400/50 overflow-hidden relative shrink-0 shadow-sm flex items-center justify-center group ${
                      bookCoverUrl ? 'cursor-pointer hover:border-amber-300' : ''
                    }`}
                    title={bookCoverUrl ? 'Nhấn để cắt khung ảnh bìa' : undefined}
                  >
                    <img
                      src={bookCoverUrl || '/documents/covers/clean_cover_navy.png'}
                      alt="Bìa sách"
                      className="w-full h-full object-cover"
                    />
                    {bookCoverUrl && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Crop size={16} className="text-amber-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 h-9 px-3 rounded-[10px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[12.5px] cursor-pointer shadow-xs transition-colors shrink-0">
                        <Upload size={14} />
                        <span>{isUploadingMedia ? 'Đang tải...' : 'Tải ảnh nền riêng'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const input = e.target;
                            const file = input.files?.[0];
                            if (!file) return;
                            try {
                              setIsUploadingMedia(true);
                              const res = await uploadImageFile(file);
                              setBookCoverUrl(res.url);
                            } catch (err: any) {
                              alert(err?.message || 'Không tải được ảnh lên. Vui lòng thử lại.');
                            } finally {
                              setIsUploadingMedia(false);
                              input.value = '';
                            }
                          }}
                          disabled={isUploadingMedia}
                          className="hidden"
                        />
                      </label>

                      {bookCoverUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setCropModalData({
                              isOpen: true,
                              url: bookCoverUrl,
                              title: 'Cắt & Căn Khung Ảnh Bìa Sách',
                              aspect: '1:1',
                              onSave: (newUrl) => setBookCoverUrl(newUrl),
                            })
                          }
                          className="h-9 px-3 rounded-[10px] bg-surface-2 hover:bg-surface border border-line text-ink font-bold text-[12px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Crop size={13} className="text-amber-500" />
                          <span>Cắt ảnh</span>
                        </button>
                      )}
                    </div>

                    <span className="text-[11px] text-muted font-medium">Tự tải ảnh lên (JPG, PNG, WebP)</span>

                    <input
                      type="url"
                      value={bookCoverUrl}
                      onChange={(e) => setBookCoverUrl(e.target.value)}
                      placeholder="Hoặc dán URL ảnh nền (https://...)..."
                      className="h-8 px-2.5 rounded-[8px] border border-line text-[12px] bg-surface text-ink w-full"
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
                          setFileList((prev) => [...prev, { name: res.fileName, url: res.url, size_bytes: file.size }]);
                          setNewFileName('');
                          setNewFileUrl('');
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
              {block.display_style === 'single' ? (
                /* GIAO DIỆN VIDEO ĐƠN (SINGLE VIDEO) */
                <div className="flex flex-col gap-3 p-3.5 rounded-[16px] bg-surface-2 border border-line">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-ink flex items-center gap-1.5">
                      <VideoIcon size={16} className="text-primary" />
                      <span>Cài đặt video đơn</span>
                    </span>
                    {(newVidUrl || videoList[0]?.youtube_id) && (
                      <button
                        type="button"
                        onClick={() => {
                          setNewVidUrl('');
                          setNewVidTitle('');
                          setNewVidThumb('');
                          setVideoList([]);
                        }}
                        className="text-[12px] text-red-500 hover:text-red-700 font-bold underline cursor-pointer"
                      >
                        Xóa video này
                      </button>
                    )}
                  </div>

                  {/* Xem trước video hoặc thumbnail */}
                  {(() => {
                    const yid = extractYouTubeId(newVidUrl) || videoList[0]?.youtube_id;
                    const thumb = newVidThumb || (yid ? `https://i.ytimg.com/vi/${yid}/hqdefault.jpg` : videoList[0]?.thumbnail_url);
                    if (thumb) {
                      return (
                        <div className="relative rounded-[12px] overflow-hidden border border-line aspect-video bg-black flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={thumb} alt="Video preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                              <VideoIcon size={24} className="ml-0.5" />
                            </div>
                          </div>
                          {yid && (
                            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-[4px] bg-black/70 text-white text-[11px] font-mono">
                              YouTube ID: {yid}
                            </span>
                          )}
                        </div>
                      );
                    }
                    return (
                      <div className="py-8 px-4 border-2 border-dashed border-line rounded-[14px] flex flex-col items-center justify-center text-center gap-2 bg-surface">
                        <VideoIcon size={32} className="text-muted/60" />
                        <span className="text-[13px] text-muted font-medium">Chưa có link video YouTube</span>
                      </div>
                    );
                  })()}

                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-ink">Đường dẫn YouTube:</label>
                      <input
                        type="url"
                        value={newVidUrl}
                        onChange={async (e) => {
                          const url = e.target.value;
                          setNewVidUrl(url);
                          const yid = extractYouTubeId(url);
                          if (yid) {
                            try {
                              const meta = await fetchYouTubeMeta(yid);
                              if (!newVidTitle.trim()) setNewVidTitle(meta.title);
                              if (!newVidThumb.trim()) setNewVidThumb(meta.thumbnail_url);
                            } catch {}
                          }
                        }}
                        placeholder="Dán link YouTube (youtube.com/watch?v=... hoặc youtu.be/...)"
                        className="h-10 px-3 rounded-[10px] border border-line text-[13px] bg-surface"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-ink">Tiêu đề video:</label>
                      <input
                        type="text"
                        value={newVidTitle}
                        onChange={(e) => setNewVidTitle(e.target.value)}
                        placeholder="Tiêu đề hiển thị..."
                        className="h-10 px-3 rounded-[10px] border border-line text-[13px] bg-surface"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[12px] font-bold text-ink">Thời lượng:</label>
                        <input
                          type="text"
                          value={newVidDuration}
                          onChange={(e) => setNewVidDuration(e.target.value)}
                          placeholder="5 phút"
                          className="h-10 px-3 rounded-[10px] border border-line text-[13px] bg-surface"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[12px] font-bold text-ink">Ảnh bìa video:</label>
                        <label className="flex items-center justify-center gap-1.5 h-10 px-2 rounded-[10px] bg-primary-soft text-primary font-bold text-[12px] border border-primary/30 cursor-pointer hover:bg-primary-soft/80 shrink-0">
                          <Upload size={14} />
                          <span>{isUploadingMedia ? 'Đang nén...' : 'Tải ảnh bìa'}</span>
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
                      </div>
                    </div>

                    {newVidThumb && (
                      <input
                        type="url"
                        value={newVidThumb}
                        onChange={(e) => setNewVidThumb(e.target.value)}
                        placeholder="URL ảnh bìa..."
                        className="h-8 px-2.5 rounded-[8px] border border-line text-[11px] text-muted bg-surface"
                      />
                    )}
                  </div>
                </div>
              ) : (
                /* GIAO DIỆN DANH SÁCH VIDEO */
                <>
                  <div className="flex flex-col gap-2 p-3.5 rounded-[14px] bg-surface-2 border border-line">
                    <span className="text-[13px] font-bold text-ink">+ Thêm video YouTube mới</span>
                    <input
                      type="url"
                      value={newVidUrl}
                      onChange={async (e) => {
                        const url = e.target.value;
                        setNewVidUrl(url);
                        const yid = extractYouTubeId(url);
                        if (yid && !newVidTitle) {
                          try {
                            const meta = await fetchYouTubeMeta(yid);
                            setNewVidTitle(meta.title);
                            setNewVidThumb(meta.thumbnail_url);
                          } catch {}
                        }
                      }}
                      placeholder="Dán link YouTube (youtube.com/watch?v=... hoặc youtu.be/...)"
                      className="h-10 px-3 rounded-[10px] border border-line text-[13px] bg-surface"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newVidTitle}
                        onChange={(e) => setNewVidTitle(e.target.value)}
                        placeholder="Tiêu đề video..."
                        className="flex-1 h-9 px-3 rounded-[8px] border border-line text-[13px] bg-surface"
                      />
                      <input
                        type="text"
                        value={newVidDuration}
                        onChange={(e) => setNewVidDuration(e.target.value)}
                        placeholder="5 phút"
                        className="w-20 h-9 px-2 rounded-[8px] border border-line text-[13px] bg-surface"
                      />
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="url"
                        value={newVidThumb}
                        onChange={(e) => setNewVidThumb(e.target.value)}
                        placeholder="Lớp phủ ảnh (URL ảnh bìa / thumbnail)..."
                        className="flex-1 h-9 px-3 rounded-[8px] border border-line text-[13px] bg-surface"
                      />
                      <label className="flex items-center gap-1 h-9 px-3 rounded-[8px] bg-primary-soft text-primary font-bold text-[12px] border border-primary/30 cursor-pointer hover:bg-primary-soft/80 shrink-0">
                        <Upload size={13} />
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
                        className="h-9 px-4 rounded-[8px] bg-primary text-white font-bold text-[13px] cursor-pointer"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>

                  <label className="text-[13px] font-bold text-ink">
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
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
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

          {/* Form chỉnh sửa khối FAQ (Accordion) */}
          {block.type === 'faq' && (
            <div className="flex flex-col gap-2.5">
              {/* Tiêu đề khối FAQ */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-ink flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-primary" />
                  <span>Tiêu đề</span>
                </label>
                <input
                  type="text"
                  value={faqTitle}
                  onChange={(e) => setFaqTitle(e.target.value)}
                  placeholder="Ví dụ: Hỏi - Đáp Thường Gặp (FAQ)"
                    className="w-full h-9 px-2.5 rounded-[8px] bg-surface border border-line text-[13px] font-semibold text-ink focus:border-primary focus:outline-hidden"
                />
              </div>

              {/* Danh sách các câu hỏi & trả lời */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-ink">
                    Câu hỏi ({faqItems.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddFaqItem}
                    className="flex items-center gap-1 h-8 px-2.5 rounded-[8px] bg-primary text-white text-[12px] font-bold hover:bg-primary-hover cursor-pointer"
                  >
                    <Plus size={13} strokeWidth={2.5} />
                    <span>Thêm câu hỏi</span>
                  </button>
                </div>

                {faqItems.length === 0 ? (
                  <div className="p-5 rounded-[14px] border border-dashed border-line text-center flex flex-col items-center justify-center gap-1.5 bg-slate-50/50">
                    <HelpCircle size={22} className="text-muted/60" />
                    <p className="text-[12.5px] text-muted font-medium">Chưa có câu hỏi nào trong khối này.</p>
                    <button
                      type="button"
                      onClick={handleAddFaqItem}
                      className="text-[12px] font-bold text-primary hover:underline cursor-pointer"
                    >
                      + Thêm câu hỏi đầu tiên
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {faqItems.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="p-2.5 rounded-[10px] bg-white dark:bg-[#1A0E35] border border-line flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <button type="button" onClick={() => setExpandedFaqItems((current) => ({ ...current, [item.id]: !current[item.id] }))} aria-expanded={!!expandedFaqItems[item.id]} aria-label={`${expandedFaqItems[item.id] ? 'Thu gọn' : 'Mở'} câu hỏi: ${item.question || `Câu hỏi mới ${idx + 1}`}`} className="flex min-w-0 flex-1 items-center gap-1.5 text-left text-[12px] font-bold text-ink">
                            {expandedFaqItems[item.id] ? <ChevronUp size={15} className="shrink-0" /> : <ChevronDown size={15} className="shrink-0" />}
                            <span className="truncate">{item.question || `Câu hỏi mới ${idx + 1}`}</span>
                          </button>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleUpdateFaqItem(item.id, { is_visible: item.is_visible === false })}
                              className="flex h-7 items-center gap-1 rounded-[7px] px-1.5 text-[10px] font-semibold text-muted hover:bg-surface-2 hover:text-ink"
                              title={item.is_visible === false ? 'Hiện câu hỏi' : 'Ẩn câu hỏi'}
                            >
                              {item.is_visible === false ? <Eye size={13} /> : <EyeOff size={13} />}
                              {item.is_visible === false ? 'Ẩn' : 'Hiện'}
                            </button>
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveFaqItem(idx, 'up')}
                              className="w-6.5 h-6.5 rounded-[6px] bg-surface-2 text-muted hover:text-ink disabled:opacity-30 flex items-center justify-center cursor-pointer"
                              title="Lên trên"
                            >
                              <ChevronUp size={13} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === faqItems.length - 1}
                              onClick={() => handleMoveFaqItem(idx, 'down')}
                              className="w-6.5 h-6.5 rounded-[6px] bg-surface-2 text-muted hover:text-ink disabled:opacity-30 flex items-center justify-center cursor-pointer"
                              title="Xuống dưới"
                            >
                              <ChevronDown size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteFaqItem(item.id)}
                              className="w-6.5 h-6.5 rounded-[6px] bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center ml-0.5 cursor-pointer"
                              title="Xóa câu hỏi này"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {expandedFaqItems[item.id] && <>
                        <div className="flex flex-col gap-1">
                          <input
                            type="text"
                            value={item.question}
                            onChange={(e) => handleUpdateFaqItem(item.id, { question: e.target.value })}
                            placeholder="Nhập câu hỏi…"
                            aria-label={`Câu hỏi ${idx + 1}`}
                            className="w-full h-8.5 px-2.5 rounded-[8px] bg-surface border border-line text-[13px] font-bold text-ink focus:border-primary focus:outline-hidden"
                          />
                        </div>

                          {!faqVideoOptions && <div className="flex flex-col gap-1">
                            <label className="text-[11.5px] font-bold text-ink">
                            Câu trả lời <span className="text-red-500">*</span>
                            </label>
                          <textarea
                            rows={3}
                            value={item.answer}
                            onChange={(e) => handleUpdateFaqItem(item.id, { answer: e.target.value })}
                            placeholder="Nhập câu trả lời ngắn gọn…"
                            className="w-full p-2.5 rounded-[8px] bg-surface border border-line text-[12.5px] text-ink leading-relaxed focus:border-primary focus:outline-hidden resize-none"
                          />
                          </div>}

                        {faqVideoOptions ? <div className="flex flex-col gap-2 border-t border-line pt-2">
                          <div className="flex items-center justify-between gap-2"><p className="text-[12px] font-bold text-ink">Câu trả lời ({(item.learning_answers || []).length})</p><button type="button" onClick={() => handleAddLearningAnswer(item)} className="shrink-0 rounded-[7px] px-2 py-1.5 text-[11px] font-bold text-primary hover:bg-primary-soft">+ Thêm câu trả lời</button></div>
                          {(item.learning_answers || []).map((answer, answerIndex) => {
                            const selectedVideo = faqVideoOptions.find((video) => video.page_id === answer.target_page_id && video.index === answer.target_video_index);
                            const selectedTopic = faqTopicOptions?.find((topic) => topic.id === answer.target_topic_id);
                            const query = faqVideoSearch[answer.id] ?? (selectedVideo ? `${selectedVideo.topic_title} · ${selectedVideo.page_title} · ${selectedVideo.video_title}` : '');
                            const matches = query.trim() ? faqVideoOptions.filter((video) => `${video.topic_title} ${video.page_title} ${video.video_title}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())).slice(0, 8) : [];
                            const isExpanded = !!expandedFaqAnswers[answer.id];
                            const linkMode = faqAnswerLinkMode[answer.id] || (answer.target_page_id ? 'video' : answer.target_topic_id ? 'topic' : '');
                            const preview = answer.text.trim() || (selectedVideo ? selectedVideo.video_title : selectedTopic ? `Mở chuyên đề: ${selectedTopic.title}` : 'Chạm để viết câu trả lời');
                            return <div key={answer.id} className="overflow-hidden rounded-[9px] border border-line bg-surface">
                              <div className="flex min-h-10 items-center gap-1 px-2">
                                <button type="button" onClick={() => setExpandedFaqAnswers((current) => ({ ...current, [answer.id]: !current[answer.id] }))} aria-expanded={isExpanded} className="flex min-w-0 flex-1 items-center justify-between gap-2 py-2 text-left">
                                  <span className="min-w-0"><span className="block text-[11px] font-bold text-ink">Câu trả lời {answerIndex + 1}</span>{!isExpanded && <span className="block truncate text-[10px] text-muted">{preview}</span>}</span>
                                  <ChevronDown size={15} className={`shrink-0 text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>
                                <button type="button" disabled={answerIndex === 0} onClick={() => handleMoveLearningAnswer(item, answerIndex, 'up')} title="Lên" className="px-1 text-[10px] text-muted disabled:opacity-30">↑</button>
                                <button type="button" disabled={answerIndex === (item.learning_answers || []).length - 1} onClick={() => handleMoveLearningAnswer(item, answerIndex, 'down')} title="Xuống" className="px-1 text-[10px] text-muted disabled:opacity-30">↓</button>
                                <button type="button" onClick={() => handleUpdateFaqItem(item.id, { learning_answers: (item.learning_answers || []).filter((entry) => entry.id !== answer.id) })} className="px-1 text-[10px] font-semibold text-red-600">Xóa</button>
                              </div>
                              {isExpanded && <div className="flex flex-col gap-2 border-t border-line p-2">
                                <textarea rows={2} value={answer.text} onChange={(event) => handleUpdateLearningAnswer(item, answer.id, { text: event.target.value })} placeholder="Viết câu trả lời…" className="w-full resize-y rounded-[7px] border border-line bg-white p-2 text-[12px] text-ink dark:bg-[#160E2E]" />
                                <div className="flex gap-1.5">
                                  <button type="button" onClick={() => { setFaqAnswerLinkMode((current) => ({ ...current, [answer.id]: 'topic' })); handleUpdateLearningAnswer(item, answer.id, { target_topic_id: answer.target_topic_id || faqTopicOptions?.[0]?.id || '', target_page_id: '', target_video_index: 0 }); setFaqVideoSearchActive((current) => ({ ...current, [answer.id]: false })); }} className={`h-8 flex-1 rounded-[7px] border px-2 text-[10px] font-bold ${linkMode === 'topic' ? 'border-primary bg-primary-soft text-primary' : 'border-line bg-white text-muted dark:bg-[#160E2E]'}`}>Chọn chuyên đề</button>
                                  <button type="button" onClick={() => { setFaqAnswerLinkMode((current) => ({ ...current, [answer.id]: 'video' })); handleUpdateLearningAnswer(item, answer.id, { target_topic_id: '', target_page_id: '', target_video_index: 0 }); setFaqVideoSearch((current) => ({ ...current, [answer.id]: '' })); setFaqVideoSearchActive((current) => ({ ...current, [answer.id]: true })); }} className={`h-8 flex-1 rounded-[7px] border px-2 text-[10px] font-bold ${linkMode === 'video' ? 'border-primary bg-primary-soft text-primary' : 'border-line bg-white text-muted dark:bg-[#160E2E]'}`}>Thêm video</button>
                                </div>
                                {linkMode === 'topic' && <select value={answer.target_topic_id || faqTopicOptions?.[0]?.id || ''} onChange={(event) => handleUpdateLearningAnswer(item, answer.id, { target_topic_id: event.target.value, target_page_id: '', target_video_index: 0 })} aria-label={`Chuyên đề của câu trả lời ${answerIndex + 1}`} className="h-9 w-full rounded-[7px] border border-line bg-white px-2 text-[12px] text-ink dark:bg-[#160E2E]">{faqTopicOptions?.map((topic) => <option key={topic.id} value={topic.id}>{topic.title}</option>)}</select>}
                                {linkMode === 'video' && <div className="flex flex-col gap-2">
                                  <div className="flex gap-1.5"><input type="search" value={query} onFocus={() => setFaqVideoSearchActive((current) => ({ ...current, [answer.id]: true }))} onChange={(event) => { setFaqVideoSearch((current) => ({ ...current, [answer.id]: event.target.value })); setFaqVideoSearchActive((current) => ({ ...current, [answer.id]: true })); }} placeholder="Tìm video bài học…" aria-label={`Tìm video ${answerIndex + 1}`} className="h-9 min-w-0 flex-1 rounded-[7px] border border-line bg-white px-2 text-[11px] text-ink dark:bg-[#160E2E]" />{selectedVideo && <button type="button" onClick={() => { handleUpdateLearningAnswer(item, answer.id, { target_topic_id: '', target_page_id: '', target_video_index: 0 }); setFaqVideoSearch((current) => ({ ...current, [answer.id]: '' })); }} className="rounded-[7px] border border-line px-2 text-[10px] font-bold text-red-600">Xóa</button>}</div>
                                  {faqVideoSearchActive[answer.id] && query.trim() && <div className="max-h-48 overflow-y-auto rounded-[8px] border border-line bg-white p-1 shadow-sm dark:bg-[#1A0E35]">{matches.length > 0 ? matches.map((video) => <button key={video.key} type="button" onClick={() => { handleUpdateLearningAnswer(item, answer.id, { target_topic_id: video.topic_id, target_page_id: video.page_id, target_video_index: video.index }); setFaqVideoSearch((current) => ({ ...current, [answer.id]: `${video.topic_title} · ${video.page_title} · ${video.video_title}` })); setFaqVideoSearchActive((current) => ({ ...current, [answer.id]: false })); }} className="flex w-full items-center gap-2 rounded-[6px] p-1.5 text-left hover:bg-blue-50 dark:hover:bg-white/10">{video.thumbnail_url ? <img src={video.thumbnail_url} alt="" className="h-11 w-[68px] shrink-0 rounded-[5px] object-cover" /> : <span className="flex h-11 w-[68px] shrink-0 items-center justify-center rounded-[5px] bg-red-600 text-white"><VideoIcon size={17} /></span>}<span className="min-w-0"><span className="block truncate text-[9px] font-bold text-red-600">{video.topic_title} · {video.page_title}</span><span className="block line-clamp-2 text-[10px] font-semibold text-ink">{video.video_title}</span></span></button>) : <p className="px-2 py-2 text-[11px] text-muted">Không tìm thấy video.</p>}</div>}
                                  {selectedVideo && <div className="flex min-w-0 items-center gap-2 rounded-[8px] border border-line bg-white p-1.5 dark:bg-[#160E2E]">{selectedVideo.thumbnail_url ? <img src={selectedVideo.thumbnail_url} alt="" className="h-10 w-[62px] shrink-0 rounded-[5px] object-cover" /> : <span className="flex h-10 w-[62px] shrink-0 items-center justify-center rounded-[5px] bg-red-600 text-white"><VideoIcon size={17} /></span>}<span className="min-w-0"><span className="block truncate text-[9px] font-bold text-red-600">{selectedVideo.topic_title} · {selectedVideo.page_title}</span><span className="block line-clamp-2 text-[10px] font-semibold text-ink">{selectedVideo.video_title}</span></span></div>}
                                  {!!answer.video_links?.length && <div className="flex flex-col gap-1.5">{answer.video_links.map((linkedVideo, linkedIndex) => {
                                    const linkedOption = faqVideoOptions.find((video) => video.page_id === linkedVideo.target_page_id && video.index === linkedVideo.target_video_index);
                                    const linkedQuery = faqAdditionalVideoSearch[linkedVideo.id] ?? (linkedOption ? `${linkedOption.topic_title} · ${linkedOption.page_title} · ${linkedOption.video_title}` : '');
                                    const linkedMatches = linkedQuery.trim() ? faqVideoOptions.filter((video) => `${video.topic_title} ${video.page_title} ${video.video_title}`.toLocaleLowerCase().includes(linkedQuery.trim().toLocaleLowerCase())).slice(0, 8) : [];
                                    return <div key={linkedVideo.id} className="rounded-[8px] border border-line bg-white p-1.5 dark:bg-[#160E2E]">{linkedOption && !faqAdditionalVideoSearchActive[linkedVideo.id] ? <div className="flex items-center gap-2">{linkedOption.thumbnail_url ? <img src={linkedOption.thumbnail_url} alt="" className="h-10 w-[62px] shrink-0 rounded-[5px] object-cover" /> : <span className="flex h-10 w-[62px] items-center justify-center rounded-[5px] bg-red-600 text-white"><VideoIcon size={17} /></span>}<span className="min-w-0 flex-1"><span className="block truncate text-[9px] font-bold text-red-600">{linkedOption.topic_title} · {linkedOption.page_title}</span><span className="block line-clamp-2 text-[10px] font-semibold text-ink">{linkedOption.video_title}</span></span><button type="button" onClick={() => handleUpdateLearningAnswer(item, answer.id, { video_links: (answer.video_links || []).filter((entry) => entry.id !== linkedVideo.id) })} className="px-1 text-[10px] font-bold text-red-600">Xóa</button></div> : <><input type="search" value={linkedQuery} onFocus={() => setFaqAdditionalVideoSearchActive((current) => ({ ...current, [linkedVideo.id]: true }))} onChange={(event) => { setFaqAdditionalVideoSearch((current) => ({ ...current, [linkedVideo.id]: event.target.value })); setFaqAdditionalVideoSearchActive((current) => ({ ...current, [linkedVideo.id]: true })); }} placeholder={`Tìm video tiếp theo ${linkedIndex + 1}…`} className="h-9 w-full rounded-[7px] border border-line bg-white px-2 text-[11px] text-ink dark:bg-[#160E2E]" />{faqAdditionalVideoSearchActive[linkedVideo.id] && linkedQuery.trim() && <div className="mt-1 max-h-40 overflow-y-auto">{linkedMatches.map((video) => <button key={video.key} type="button" onClick={() => { handleUpdateAdditionalVideo(item, answer, linkedVideo.id, { target_topic_id: video.topic_id, target_page_id: video.page_id, target_video_index: video.index }); setFaqAdditionalVideoSearch((current) => ({ ...current, [linkedVideo.id]: '' })); setFaqAdditionalVideoSearchActive((current) => ({ ...current, [linkedVideo.id]: false })); }} className="flex w-full items-center gap-2 rounded-[6px] p-1.5 text-left hover:bg-blue-50 dark:hover:bg-white/10">{video.thumbnail_url ? <img src={video.thumbnail_url} alt="" className="h-11 w-[68px] shrink-0 rounded-[5px] object-cover" /> : <span className="flex h-11 w-[68px] shrink-0 items-center justify-center rounded-[5px] bg-red-600 text-white"><VideoIcon size={17} /></span>}<span className="min-w-0"><span className="block truncate text-[9px] font-bold text-red-600">{video.topic_title} · {video.page_title}</span><span className="block line-clamp-2 text-[10px] font-semibold text-ink">{video.video_title}</span></span></button>)}</div>}</>}</div>;
                                  })}</div>}
                                  <button type="button" onClick={() => { const id = generateUuid(); handleUpdateLearningAnswer(item, answer.id, { video_links: [...(answer.video_links || []), { id, target_topic_id: '', target_page_id: '', target_video_index: 0 }] }); setFaqAdditionalVideoSearchActive((current) => ({ ...current, [id]: true })); }} className="self-start rounded-[7px] border border-dashed border-primary/40 px-2.5 py-1.5 text-[10px] font-bold text-primary"><Plus size={12} className="mr-1 inline" />Thêm video tiếp theo</button>
                                </div>}
                              </div>}
                            </div>;
                          })}
                        </div> : <>
                        <div className="flex flex-col gap-1">
                          <label className="text-[11.5px] font-bold text-ink">Ảnh minh họa (không bắt buộc)</label>
                          <div className="flex gap-1.5">
                            <input
                              type="url"
                              value={item.image_url || ''}
                              onChange={(e) => handleUpdateFaqItem(item.id, { image_url: e.target.value })}
                              placeholder="Dán đường dẫn ảnh"
                              className="h-8.5 min-w-0 flex-1 rounded-[8px] border border-line bg-surface px-2.5 text-[12px] text-ink focus:border-primary focus:outline-hidden"
                            />
                            <label className="flex h-8.5 shrink-0 cursor-pointer items-center gap-1 rounded-[8px] bg-primary-soft px-2 text-[10px] font-bold text-primary">
                              <Upload size={12} />{isUploadingMedia ? 'Đang tải' : 'Tải ảnh'}
                              <input type="file" accept="image/*" className="hidden" disabled={isUploadingMedia} onChange={async (event) => {
                                const file = event.target.files?.[0];
                                if (!file) return;
                                try {
                                  setIsUploadingMedia(true);
                                  const result = await uploadImageFile(file);
                                  handleUpdateFaqItem(item.id, { image_url: result.url });
                                } catch (error: any) {
                                  alert(error.message || 'Tải ảnh chưa thành công');
                                } finally {
                                  setIsUploadingMedia(false);
                                  event.target.value = '';
                                }
                              }} />
                            </label>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 rounded-[11px] border border-line/70 bg-slate-50/70 p-2.5 dark:bg-white/[.025]">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <label className="text-[11.5px] font-bold text-ink">Video hoặc liên kết gợi ý</label>
                            <div className="flex gap-1.5">
                              <button type="button" onClick={() => handleAddFaqResource(item, 'video')} className="rounded-[7px] bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-200">+ Video</button>
                              <button type="button" onClick={() => handleAddFaqResource(item, 'link')} className="rounded-[7px] bg-slate-200 px-2 py-1 text-[10px] font-bold text-slate-700 dark:bg-white/10 dark:text-slate-200">+ Liên kết</button>
                            </div>
                          </div>
                          {(item.resources || []).map((resource, resourceIndex) => (
                            <div key={`${item.id}-resource-${resourceIndex}`} className="grid grid-cols-[1fr_auto] gap-1.5">
                              <div className="flex min-w-0 flex-col gap-1.5">
                                <input
                                  type="text"
                                  value={resource.title}
                                  onChange={(e) => handleUpdateFaqItem(item.id, { resources: (item.resources || []).map((entry, index) => index === resourceIndex ? { ...entry, title: e.target.value } : entry) })}
                                  placeholder={resource.kind === 'video' ? 'Tên video' : 'Tên liên kết'}
                                  className="h-8 w-full rounded-[7px] border border-line bg-surface px-2 text-[11px] text-ink focus:border-primary focus:outline-hidden"
                                />
                                <input
                                  type="url"
                                  value={resource.url}
                                  onChange={(e) => handleUpdateFaqItem(item.id, { resources: (item.resources || []).map((entry, index) => index === resourceIndex ? { ...entry, url: e.target.value } : entry) })}
                                  placeholder="Link bài học / video / website"
                                  className="h-8 w-full rounded-[7px] border border-line bg-surface px-2 text-[11px] text-ink focus:border-primary focus:outline-hidden"
                                />
                                {resource.kind === 'video' && <input
                                  type="url"
                                  value={resource.thumbnail_url || ''}
                                  onChange={(e) => handleUpdateFaqItem(item.id, { resources: (item.resources || []).map((entry, index) => index === resourceIndex ? { ...entry, thumbnail_url: e.target.value } : entry) })}
                                  placeholder="Link ảnh thumbnail (nếu có)"
                                  className="h-8 w-full rounded-[7px] border border-line bg-surface px-2 text-[11px] text-ink focus:border-primary focus:outline-hidden"
                                />}
                              </div>
                              <button type="button" onClick={() => handleUpdateFaqItem(item.id, { resources: (item.resources || []).filter((_, index) => index !== resourceIndex) })} className="flex h-8 w-8 items-center justify-center self-start rounded-[7px] bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-300" aria-label="Xóa liên kết">×</button>
                            </div>
                          ))}
                        </div>
                        </>}
                        </>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form chỉnh sửa khối sách */}
          {block.type === 'books' && (
            <div className="flex flex-col gap-3.5">
              <div className="p-3.5 rounded-[16px] bg-slate-50 dark:bg-white/5 border border-line flex flex-col gap-2">
                <label className="text-[13px] font-black text-ink uppercase tracking-wide">Tiêu đề khối sách</label>
                <input
                  type="text"
                  value={booksTitle}
                  onChange={(e) => setBooksTitle(e.target.value)}
                  placeholder="Ví dụ: Sách gợi ý"
                  className="w-full h-9.5 px-3 rounded-[10px] bg-white dark:bg-[#160E2E] border border-line text-[14px] font-bold text-ink focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-black text-ink uppercase tracking-wide">
                    Danh sách sách ({booksItems.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddBooksItem}
                    className="flex items-center gap-1 h-7.5 px-2.5 rounded-[8px] bg-primary text-white text-[12px] font-bold hover:bg-primary-hover cursor-pointer shadow-2xs"
                  >
                    <Plus size={13} strokeWidth={2.5} />
                    <span>Thêm sách</span>
                  </button>
                </div>

                {booksItems.map((bk, idx) => (
                  <div
                    key={bk.id || idx}
                    className="flex items-center gap-2.5 p-2.5 rounded-[14px] bg-white dark:bg-[#1A0E35] border border-line"
                  >
                    <div className="w-[42px] aspect-[3/4] shrink-0 rounded-[6px] overflow-hidden bg-surface-2 border border-line">
                      {bk.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={bk.cover_url} alt="" className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-ink line-clamp-2 leading-snug">{bk.title || 'Chưa có tên'}</p>
                      <button
                        type="button"
                        onClick={() => setEditingBook(bk)}
                        className="mt-1 text-[12px] font-bold text-primary hover:underline cursor-pointer"
                      >
                        Sửa sách này
                      </button>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveBooksItem(idx, 'up')}
                        className="w-6.5 h-6.5 rounded-[6px] bg-surface-2 text-muted disabled:opacity-30 flex items-center justify-center cursor-pointer"
                        title="Lên trên"
                      >
                        <ChevronUp size={13} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === booksItems.length - 1}
                        onClick={() => handleMoveBooksItem(idx, 'down')}
                        className="w-6.5 h-6.5 rounded-[6px] bg-surface-2 text-muted disabled:opacity-30 flex items-center justify-center cursor-pointer"
                        title="Xuống dưới"
                      >
                        <ChevronDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setBooksItems(booksItems.filter((b) => b.id !== bk.id))}
                        className="w-6.5 h-6.5 rounded-[6px] bg-red-50 text-red-600 flex items-center justify-center cursor-pointer"
                        title="Xóa sách này"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <EditSingleRecommendedBookModal
                isOpen={Boolean(editingBook)}
                book={editingBook}
                onClose={() => setEditingBook(null)}
                onSaved={(updated: RecommendedBook) => {
                  setBooksItems(booksItems.map((b) => (b.id === updated.id ? updated : b)));
                  setEditingBook(null);
                }}
              />
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

      {/* MODAL CẮT VÀ CĂN KHUNG ẢNH */}
      {cropModalData && (
        <ImageCropModal
          isOpen={cropModalData.isOpen}
          imageUrl={cropModalData.url}
          title={cropModalData.title}
          defaultAspect={cropModalData.aspect}
          onClose={() => setCropModalData(null)}
          onCropSaved={async (newUrl) => {
            cropModalData.onSave(newUrl);
            setCropModalData(null);
          }}
        />
      )}
    </div>
  );
}
