'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowLeft,
  Clock,
  Plus,
  ChevronUp,
  ChevronDown,
  Edit2,
  MoreVertical,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Share2,
  CheckCircle2,
  Circle,
  MessageCircle,
  Bookmark,
  X,
  Check,
} from 'lucide-react';
import QRCode from 'qrcode';
import { Topic, Page, Block, Video, FileItem } from '../lib/types';
import { generateUuid, isValidUuid } from '../lib/uuid';
import PageHeaderBar, { TocItem, FontSizeOption, ThemeModeOption } from './PageHeaderBar';
import BlockRenderer from './BlockRenderer';
import TextBlock from './blocks/TextBlock';
import ComparisonBlock from './blocks/ComparisonBlock';
import EditBlockModal from './admin/EditBlockModal';
import VideoManagerModal from './admin/VideoManagerModal';
import AddBlockDrawer from './admin/AddBlockDrawer';
import EditPageModal from './admin/EditPageModal';
import AdminSettingsModal from './admin/AdminSettingsModal';
import MedicalDocumentsTab from './MedicalDocumentsTab';
import dynamic from 'next/dynamic';
const FlipbookViewer = dynamic(() => import('./FlipbookViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-purple-950/20 rounded-[14px] border border-slate-200 dark:border-purple-500/20 text-slate-500 text-[12px] font-medium">
      Đang tải tài liệu sách 3D...
    </div>
  ),
});
import { checkAdminStatus, setAdminClient, canManageTopic } from '../lib/adminAuth';
import { deleteBlockApi, saveBlockApi } from '../lib/apiAdmin';
import {
  getStoredBlocks,
  saveStoredBlocks,
  getStoredPageStatus,
  saveStoredPageStatus,
  getStoredPage,
  saveStoredPage,
  getStoredAppSettings,
  DEFAULT_APP_SETTINGS,
  AppCustomSettings,
} from '../lib/storage';

const TOPIC_EBOOK_MAP: Record<string, { title: string }> = {
  'cot-song': { title: 'Hiểu đúng về cột sống' },
  'dinh-duong': { title: 'Dinh dưỡng chuyên sâu & Chuyển hóa' },
  'nuoc': { title: 'Khoa học nguồn nước & Cân bằng tế bào' },
  'co-the-nguoi': { title: 'Atlas giải phẫu cơ thể người' },
  'tieu-hoa': { title: 'Giải phẫu ứng dụng hệ tiêu hóa' },
  'noi-tiet-chuyen-hoa': { title: 'Cơ chế nội tiết & Chuyển hóa' },
  'gan-mat-tuy': { title: 'Giải phẫu gan mật & Chức năng chuyển hóa' },
  'mien-dich': { title: 'Gốc bệnh & Miễn dịch học cơ thể' },
  'tuan-hoan': { title: 'Hệ tuần hoàn & Sinh lý tim mạch' },
  'tim-mach': { title: 'Giải phẫu & Sinh lý tim mạch' },
  'ho-hap': { title: 'Giải phẫu & Cơ chế hô hấp' },
};
import {
  isPageSaved,
  toggleSavePage,
  isPageCompleted,
  togglePageCompleted,
} from '../lib/learningProgress';
import { playTapSound, playSuccessChime } from '../lib/audioFeedback';
import { getUserPhone } from '../lib/userSync';
import UserSyncModal from './UserSyncModal';
import Anatomy3DModal from './Anatomy3DModal';
import { Settings as SettingsIcon } from 'lucide-react';

const get3DSystemForTopic = (slug: string): string => {
  if (slug === 'cot-song') return 'skeletal';
  if (slug === 'tieu-hoa' || slug === 'gan-mat-tuy' || slug === 'noi-tiet-chuyen-hoa' || slug === 'dinh-duong') return 'visceral';
  if (slug === 'co-the-nguoi') return 'muscular';
  if (slug === 'nuoc') return 'cardiovascular';
  if (slug === 'mien-dich') return 'lymphatic';
  return 'skeletal';
};

interface ContentViewerProps {
  topic: Topic;
  page: Page;
  pageIndex: number;
  totalPages: number;
  blocks: Block[];
  nextPage: Page | null;
  nextPageIndex: number | null;
  prevPage?: Page | null;
  prevPageIndex?: number | null;
  defaultActiveVideoIndex?: number;
  pageSlugMap?: Record<string, { slug: string; topicSlug: string; title: string; cover_url?: string }>;
}

export default function ContentViewer({
  topic,
  page,
  pageIndex,
  totalPages,
  blocks: initialBlocks,
  nextPage,
  nextPageIndex,
  prevPage = null,
  prevPageIndex = null,
  defaultActiveVideoIndex = 0,
  pageSlugMap,
}: ContentViewerProps) {
  const router = useRouter();

  useEffect(() => {
    if (prevPage) router.prefetch(`/${topic.slug}/${prevPage.slug}`);
    if (nextPage) router.prefetch(`/${topic.slug}/${nextPage.slug}`);
    router.prefetch(`/${topic.slug}`);
  }, [router, topic.slug, prevPage, nextPage]);

  const [fontSizeMode, setFontSizeMode] = useState<FontSizeOption>('normal');
  const [isAdmin, setIsAdmin] = useState(false);
  const [supabaseOk, setSupabaseOk] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(page);
  const [pageStatus, setPageStatus] = useState<'draft' | 'published'>(page.status);
  const [appCustomSettings, setAppCustomSettings] = useState<AppCustomSettings>(() => getStoredAppSettings());
  // Khởi tạo và chuẩn hóa danh sách khối (loại bỏ khối sách ảo/flipbook tự sinh theo yêu cầu người dùng)
  const initializeBlocks = (rawBlocks: Block[]): Block[] => {
    let list = rawBlocks.filter(
      (b) => b.display_style !== 'flipbook' && b.type !== 'books' && b.display_style !== 'books'
    );
    list.sort((a, b) => a.sort_order - b.sort_order);
    return list.map((b, idx) => ({ ...b, sort_order: idx + 1 }));
  };

  const [blockList, setBlockList] = useState<Block[]>(() => initializeBlocks(initialBlocks));

  // Modals
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [showVideoManager, setShowVideoManager] = useState(false);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [showEditPageModal, setShowEditPageModal] = useState(false);
  const [showAdminSettingsModal, setShowAdminSettingsModal] = useState(false);
  const [show3DModal, setShow3DModal] = useState(false);
  const [activeMenuBlockId, setActiveMenuBlockId] = useState<string | null>(null);

  // Đọc dữ liệu từ localStorage khi client mount
  useEffect(() => {
    try {
      // 1. Cỡ chữ (3 kiểu: small, normal, large)
      const savedFontSize = localStorage.getItem('co_chu');
      if (savedFontSize === 'small' || savedFontSize === 'nho') {
        setFontSizeMode('small');
      } else if (savedFontSize === 'large' || savedFontSize === 'lon') {
        setFontSizeMode('large');
      } else {
        setFontSizeMode('normal');
      }

      // 2. Quyền Admin & Trạng thái kết nối dữ liệu (Kiểm tra quyền quản lý chủ đề nếu là Giảng viên)
      checkAdminStatus().then((status) => {
        const canManage = canManageTopic(topic.id, status.user) || canManageTopic(topic.slug, status.user);
        setIsAdmin(status.isAdmin && canManage);
        setSupabaseOk(status.supabaseOk);
      });


      // 3. Trạng thái và thông tin trang
      const storedPage = getStoredPage(page.id, page);
      setCurrentPage(storedPage);
      setPageStatus(getStoredPageStatus(page.id, storedPage.status));

      // 4. Khối nội dung đã sửa
      const loadedBlocks = getStoredBlocks(page.id, initialBlocks);
      setBlockList(initializeBlocks(loadedBlocks));

      // 5. Trạng thái đã lưu, đã hoàn thành, theme & cài đặt tư vấn
      setIsSaved(isPageSaved(page.id));
      setIsCompleted(isPageCompleted(page.id));
      const rawTheme = localStorage.getItem('giao_dien');
      const savedTheme: ThemeModeOption = rawTheme === 'dark' || rawTheme === 'gray' ? rawTheme : 'light';
      setThemeMode(savedTheme);
      const appSet = getStoredAppSettings();
      if (appSet) {
        setConsultSettings({ zalo_url: appSet.zalo_url, hotline: appSet.hotline });
        setAppCustomSettings(appSet);
      }
    } catch {
      // Bỏ qua lỗi truy cập client storage
    }
  }, [page.id, initialBlocks, page.status, page]);

  // Lưu thông tin bài học đang xem để Trợ lý AI (nút nổi & trang trợ lý) bám đuổi ngữ cảnh bài học
  useEffect(() => {
    try {
      if (topic && currentPage) {
        const lessonContext = {
          topic_slug: topic.slug,
          topic_title: topic.title,
          page_slug: currentPage.slug,
          page_title: currentPage.title,
          page_summary: currentPage.summary || '',
        };
        sessionStorage.setItem('qbiz_current_lesson', JSON.stringify(lessonContext));
        window.dispatchEvent(new CustomEvent('qbiz_current_lesson_changed', { detail: lessonContext }));
      }
    } catch {
      // Bỏ qua lỗi truy cập client storage
    }
  }, [topic?.slug, topic?.title, currentPage?.slug, currentPage?.title, currentPage?.summary]);

  const [saveErrorMsg, setSaveErrorMsg] = useState('');
  const [shareNoticeMsg, setShareNoticeMsg] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeModeOption>('light');
  const [consultSettings, setConsultSettings] = useState<{ zalo_url?: string; hotline?: string } | null>({
    zalo_url: DEFAULT_APP_SETTINGS.zalo_url,
    hotline: DEFAULT_APP_SETTINGS.hotline,
  });
  const [showPhoneSyncModal, setShowPhoneSyncModal] = useState(false);
  const [phoneSyncReason, setPhoneSyncReason] = useState<'bookmark' | 'manual'>('bookmark');
  const [activeTab, setActiveTab] = useState<'syllabus' | 'summary' | 'resources'>('syllabus');

  // Modal Chia sẻ mã QR & Link
  const [showShareModal, setShowShareModal] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  const handleSelectTocItem = (blockId: string) => {
    const target = blockList.find((b) => b.id === blockId);
    if (target) {
      if (target.type === 'videos') {
        setActiveTab('syllabus');
      } else if (target.type === 'text') {
        setActiveTab('summary');
      } else {
        setActiveTab('resources');
      }
    }
    setTimeout(() => {
      const el = document.getElementById(`block-${blockId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleToggleBookmark = () => {
    playTapSound();
    const newState = toggleSavePage({
      page_id: page.id,
      topic_slug: topic.slug,
      topic_title: topic.title,
      page_slug: page.slug,
      page_title: currentPage.title,
      page_number: pageIndex,
      saved_at: Date.now(),
    });
    setIsSaved(newState);
    setShareNoticeMsg(newState ? 'Đã lưu bài học vào mục Đã lưu' : 'Đã bỏ lưu bài học');
    setTimeout(() => setShareNoticeMsg(''), 2500);

    // Chỉ nhảy ra khi họ ấn lưu và chưa có số điện thoại
    if (newState && !getUserPhone()) {
      setPhoneSyncReason('bookmark');
      setShowPhoneSyncModal(true);
    }
  };

  const handleToggleCompleted = () => {
    const newState = togglePageCompleted(page.id);
    setIsCompleted(newState);
    if (newState) {
      playSuccessChime();
    } else {
      playTapSound();
    }
    setShareNoticeMsg(newState ? 'Tuyệt vời! Đã hiểu bài học này ✓' : 'Đã hủy đánh dấu hoàn thành');
    setTimeout(() => setShareNoticeMsg(''), 2500);
  };

  const handleThemeChange = (mode: ThemeModeOption) => {
    setThemeMode(mode);
    try {
      localStorage.setItem('giao_dien', mode);
      document.documentElement.classList.remove('dark', 'gray');
      document.body.classList.remove('dark', 'gray');
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      }
        const targetColor = mode === 'dark' ? '#0C0817' : '#FFFFFF';
        let m = document.getElementById('app-theme-color') as HTMLMetaElement | null;
        if (!m) m = document.querySelector('meta[name="theme-color"]');
        if (!m) {
          m = document.createElement('meta');
          m.id = 'app-theme-color';
          m.name = 'theme-color';
          document.head.appendChild(m);
        }
        m.setAttribute('content', targetColor);
        m.removeAttribute('media');
        const allMetas = document.querySelectorAll('meta[name="theme-color"]');
        allMetas.forEach((el) => {
          if (el !== m) el.remove();
        });
        window.dispatchEvent(new Event('giao_dien_changed'));
      } catch {
        // Bỏ qua
      }
  };

  const handleOpenShareModal = async () => {
    playTapSound();
    const url = typeof window !== 'undefined' ? window.location.href : '';
    setShareUrl(url);
    setIsCopied(false);
    setShowShareModal(true);

    try {
      if (url) {
        const qr = await QRCode.toDataURL(url, {
          width: 320,
          margin: 2,
          color: {
            dark: '#111827',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        });
        setQrCodeDataUrl(qr);
      }
    } catch {
      // Bỏ qua lỗi sinh QR
    }
  };

  const handleCopyLink = async () => {
    playTapSound();
    const targetUrl = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
    let copied = false;
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(targetUrl);
        copied = true;
      } catch {
        // Tiếp tục thử fallback
      }
    }

    if (!copied && typeof document !== 'undefined') {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = targetUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        copied = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch {
        copied = false;
      }
    }

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleShare = handleOpenShareModal;

  const handleFontSizeChange = (mode: FontSizeOption) => {
    setFontSizeMode(mode);
    try {
      localStorage.setItem('co_chu', mode);
    } catch {
      // Bỏ qua
    }
  };

  const handleToggleAdmin = () => {
    const nextState = !isAdmin;
    setIsAdmin(nextState);
    setAdminClient(nextState);
  };

  const handleToggleStatus = async () => {
    const nextStatus = pageStatus === 'published' ? 'draft' : 'published';
    const ok = await saveStoredPageStatus(page.id, nextStatus);
    if (!ok) {
      setSaveErrorMsg('Chưa lưu được – chưa kết nối dữ liệu');
      setTimeout(() => setSaveErrorMsg(''), 4000);
      return;
    }
    setPageStatus(nextStatus);
  };

  const triggerSaveBlocks = async (blocks: Block[]) => {
    const ok = await saveStoredBlocks(page.id, blocks);
    if (!ok) {
      setSaveErrorMsg('Chưa lưu được – chưa kết nối dữ liệu');
      setTimeout(() => setSaveErrorMsg(''), 4000);
    }
  };

  const handleSavePage = async (updated: Partial<Page>) => {
    const ok = await saveStoredPage(page.id, updated);
    if (!ok) {
      setSaveErrorMsg('Chưa lưu được – chưa kết nối dữ liệu');
      setTimeout(() => setSaveErrorMsg(''), 4000);
      return;
    }
    const newPage = { ...currentPage, ...updated };
    setCurrentPage(newPage);
    if (updated.status) {
      setPageStatus(updated.status);
    }
  };

  // Di chuyển khối lên
  const handleMoveBlockUp = (index: number) => {
    if (index <= 0 || index >= blockList.length) return;
    playTapSound();
    const updated = [...blockList];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    const reindexed = updated.map((b, idx) => ({ ...b, sort_order: idx + 1 }));
    setBlockList(reindexed);
    triggerSaveBlocks(reindexed);
  };

  // Di chuyển khối xuống
  const handleMoveBlockDown = (index: number) => {
    if (index < 0 || index >= blockList.length - 1) return;
    playTapSound();
    const updated = [...blockList];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    const reindexed = updated.map((b, idx) => ({ ...b, sort_order: idx + 1 }));
    setBlockList(reindexed);
    triggerSaveBlocks(reindexed);
  };

  // Di chuyển khối tóm tắt lên trong tab Tóm tắt cốt lõi
  const handleMoveSummaryBlockUp = (bId: string) => {
    const sIdx = summaryBlocks.findIndex((b) => b.id === bId);
    if (sIdx <= 0) return;
    const prevBlock = summaryBlocks[sIdx - 1];
    const currIdx = blockList.findIndex((b) => b.id === bId);
    const prevIdx = blockList.findIndex((b) => b.id === prevBlock.id);
    if (currIdx === -1 || prevIdx === -1) return;
    playTapSound();
    const updated = [...blockList];
    const temp = updated[currIdx];
    updated[currIdx] = updated[prevIdx];
    updated[prevIdx] = temp;
    const reindexed = updated.map((b, idx) => ({ ...b, sort_order: idx + 1 }));
    setBlockList(reindexed);
    triggerSaveBlocks(reindexed);
  };

  // Di chuyển khối tóm tắt xuống trong tab Tóm tắt cốt lõi
  const handleMoveSummaryBlockDown = (bId: string) => {
    const sIdx = summaryBlocks.findIndex((b) => b.id === bId);
    if (sIdx === -1 || sIdx >= summaryBlocks.length - 1) return;
    const nextBlock = summaryBlocks[sIdx + 1];
    const currIdx = blockList.findIndex((b) => b.id === bId);
    const nextIdx = blockList.findIndex((b) => b.id === nextBlock.id);
    if (currIdx === -1 || nextIdx === -1) return;
    playTapSound();
    const updated = [...blockList];
    const temp = updated[currIdx];
    updated[currIdx] = updated[nextIdx];
    updated[nextIdx] = temp;
    const reindexed = updated.map((b, idx) => ({ ...b, sort_order: idx + 1 }));
    setBlockList(reindexed);
    triggerSaveBlocks(reindexed);
  };

  // Xóa khối
  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khối nội dung này?')) return;
    const res = await deleteBlockApi(blockId);
    if (!res.success) {
      setSaveErrorMsg(res.error || 'Chưa lưu được – chưa kết nối dữ liệu');
      setTimeout(() => setSaveErrorMsg(''), 4000);
      return;
    }
    const updated = blockList.filter((b) => b.id !== blockId);
    const reindexed = updated.map((b, idx) => ({ ...b, sort_order: idx + 1 }));
    setBlockList(reindexed);
    setActiveMenuBlockId(null);
    triggerSaveBlocks(reindexed);
  };

  // Nhân bản khối
  const handleDuplicateBlock = (index: number) => {
    const target = blockList[index];
    const duplicate: Block = {
      ...JSON.parse(JSON.stringify(target)),
      id: generateUuid(),
    };
    const updated = [...blockList];
    updated.splice(index + 1, 0, duplicate);
    const reindexed = updated.map((b, idx) => ({ ...b, sort_order: idx + 1 }));
    setBlockList(reindexed);
    triggerSaveBlocks(reindexed);
    setActiveMenuBlockId(null);
  };

  // Bật tắt ẩn/hiện khối
  const handleToggleVisibility = (blockId: string) => {
    const updated = blockList.map((b) => {
      if (b.id === blockId) {
        return { ...b, is_visible: !b.is_visible };
      }
      return b;
    });
    setBlockList(updated);
    triggerSaveBlocks(updated);
    setActiveMenuBlockId(null);
  };

  // Lưu khối sau khi sửa
  const handleSaveBlock = async (updatedBlock: Block) => {
    const updated = blockList.map((b) => (b.id === updatedBlock.id ? updatedBlock : b));
    setBlockList(updated);
    const res = await saveBlockApi(updatedBlock);
    if (!res.success) {
      setSaveErrorMsg(res.error || 'Chưa lưu được khối, vui lòng thử lại');
      setTimeout(() => setSaveErrorMsg(''), 4000);
    } else {
      setShareNoticeMsg('Đã lưu thay đổi khối thành công!');
      setTimeout(() => setShareNoticeMsg(''), 2500);
    }
  };

  // Thêm khối mới
  const handleAddBlock = async (newBlock: Block) => {
    const blockWithOrder = { ...newBlock, sort_order: blockList.length + 1 };
    const updated = [...blockList, blockWithOrder];
    setBlockList(updated);
    const res = await saveBlockApi(blockWithOrder);
    if (!res.success) {
      setSaveErrorMsg(res.error || 'Chưa lưu được khối mới, vui lòng thử lại');
      setTimeout(() => setSaveErrorMsg(''), 4000);
    } else {
      setShareNoticeMsg('Đã thêm khối mới thành công!');
      setTimeout(() => setShareNoticeMsg(''), 2500);
    }
  };

    // Lưu video sau khi quản lý
    const handleSaveVideos = (newVideos: Video[]) => {
      const updated = blockList.map((b) => {
        if (b.type === 'videos') {
          return {
            ...b,
            data: {
              ...b.data,
              videos: newVideos,
            },
          };
        }
        return b;
      });
      setBlockList(updated);
      triggerSaveBlocks(updated);
    };

  // Tạo danh sách mục lục phong phú, chi tiết từ các khối hiển thị
  const tocItems: TocItem[] = (() => {
    const textStyleCounts: Record<string, number> = {};

    return blockList
      .filter((b) => b.is_visible && b.display_style !== 'flipbook' && b.type !== 'books' && b.display_style !== 'books')
      .map((block) => {

        if (block.type === 'videos') {
          const firstVid = block.data?.videos?.[0];
          const vidTitle = firstVid?.title ? `: ${firstVid.title}` : '';
          const shortTitle = vidTitle.length > 32 ? vidTitle.slice(0, 30) + '…' : vidTitle;
          return { id: block.id, label: `Video bài giảng${shortTitle}` };
        }

        if (block.type === 'text') {
          if (block.data?.title?.trim()) {
            return { id: block.id, label: block.data.title.trim() };
          }

          const style = block.display_style || 'text';
          textStyleCounts[style] = (textStyleCounts[style] || 0) + 1;
          const count = textStyleCounts[style];

          let baseLabel = 'Đoạn văn';
          switch (style) {
            case 'y_nghia':
              baseLabel = 'Ý nghĩa';
              break;
            case 'diem_can_nho':
              baseLabel = 'Điểm cần nhớ';
              break;
            case 'chu_y':
              baseLabel = 'Lưu ý quan trọng';
              break;
            case 'sai_lam':
              baseLabel = 'Sai lầm thường gặp';
              break;
            case 'giai_phap':
              baseLabel = 'Giải pháp phục hồi';
              break;
            case 'html':
              baseLabel = 'Khối HTML';
              break;
            default:
              baseLabel = block.data?.mode === 'html' ? 'Khối HTML' : 'Đoạn văn';
          }

          // Trích xuất từ khóa tiêu đề từ dòng đầu tiên nếu có
          const firstLine = block.data?.lines?.[0]?.trim() || '';
          const boldMatch = firstLine.match(/\*\*(.*?)\*\*/);
          if (boldMatch && boldMatch[1]) {
            const topicSnippet = boldMatch[1].trim();
            const shortSnippet = topicSnippet.length > 25 ? topicSnippet.slice(0, 23) + '…' : topicSnippet;
            return { id: block.id, label: `${baseLabel}: ${shortSnippet}` };
          }

          return {
            id: block.id,
            label: count > 1 ? `${baseLabel} (${count})` : baseLabel,
          };
        }

        if (block.type === 'links' && block.display_style === 'related') {
          return { id: block.id, label: 'Bài học liên quan trong chuyên đề' };
        }

        if (block.type === 'files') {
          const firstFile = block.data?.files?.[0];
          const fileName = firstFile?.name ? `: ${firstFile.name}` : '';
          const shortName = fileName.length > 28 ? fileName.slice(0, 26) + '…' : fileName;
          return { id: block.id, label: `Tài liệu y khoa${shortName}` };
        }

        if (block.type === 'comparison') {
          const lTitle = block.data?.left_title;
          const rTitle = block.data?.right_title;
          if (lTitle && rTitle) {
            return { id: block.id, label: `So sánh: ${lTitle} & ${rTitle}` };
          }
          return { id: block.id, label: 'Bảng so sánh 2 cột' };
        }

        if (block.type === 'images') {
          return { id: block.id, label: 'Thư viện hình ảnh giải phẫu' };
        }

        return null;
      })
      .filter((item): item is TocItem => item !== null);
  })();

  const formattedOrder = String(pageIndex).padStart(2, '0');

  // Khối video để quản lý
  const videoBlock = blockList.find((b) => b.type === 'videos');
  const currentVideos = videoBlock && videoBlock.type === 'videos' ? videoBlock.data.videos : [];

  // Tính thời lượng học ước tính
  const estimatedStudyMinutes = (() => {
    let mins = 0;
    if (currentVideos && currentVideos.length > 0) {
      for (const v of currentVideos) {
        if (v.duration_text) {
          const match = v.duration_text.match(/(\d+)/);
          if (match) {
            if (v.duration_text.includes(':')) {
              const parts = v.duration_text.split(':');
              const m = parseInt(parts[0], 10) || 0;
              mins += m > 0 ? m : 5;
            } else {
              mins += parseInt(match[1], 10);
            }
            continue;
          }
        }
        mins += 5;
      }
    } else {
      mins = 5;
    }
    return Math.max(mins, 3);
  })();

  const isHtmlTextBlock = (b: Block) =>
    b.type === 'text' && ((b.data as any)?.mode === 'html' || b.display_style === 'html');
  const summaryBlocks = blockList.filter(
    (b) => (b.type === 'text' && !isHtmlTextBlock(b)) || b.type === 'comparison'
  );
  const textBlocks = summaryBlocks;
  const filesBlocks = blockList.filter((b) => b.type === 'files');
  const customFiles: FileItem[] = filesBlocks.flatMap((b) => (b.type === 'files' ? b.data.files : []));
  const relatedLinksBlock = blockList.find((b) => b.type === 'links' && b.display_style === 'related');

  const getBlockTitle = (block: Block): string => {
    if (block.display_style === 'flipbook') {
      return 'QUẢN TRỊ KHỐI SÁCH';
    }
    if (block.type === 'books') {
      return block.data.title?.trim() ? block.data.title.trim().toUpperCase() : 'KHỐI SÁCH';
    }
    if (block.type === 'videos') {
      return 'DANH SÁCH VIDEO';
    }
    if (block.type === 'text') {
      if (block.data.title?.trim()) {
        const isHtml = block.data.mode === 'html' || block.display_style === 'html';
        return isHtml
          ? `[HTML] ${block.data.title.trim().toUpperCase()}`
          : block.data.title.trim().toUpperCase();
      }
      if (block.data.mode === 'html' || block.display_style === 'html') {
        return 'KHỐI HTML TÙY BIẾN';
      }
      switch (block.display_style) {
        case 'y_nghia':
          return 'Ý NGHĨA';
        case 'diem_can_nho':
          return 'ĐIỂM CẦN NHỚ';
        case 'chu_y':
          return 'CHÚ Ý';
        case 'sai_lam':
          return 'SAI LẦM THƯỜNG GẶP';
        case 'giai_phap':
          return 'GIẢI PHÁP';
        default:
          return 'ĐOẠN VĂN';
      }
    }
    if (block.type === 'images') {
      return block.display_style === 'gallery' ? 'BỘ SƯU TẬP ẢNH' : 'HÌNH ẢNH';
    }
    if (block.type === 'files') {
      return 'TÀI LIỆU Y KHOA';
    }
    if (block.type === 'comparison') {
      const left = block.data.left_title || 'Uống nước sai lầm';
      const right = block.data.right_title || 'Uống nước khoa học';
      return `SO SÁNH: ${left.toUpperCase()} ↔ ${right.toUpperCase()}`;
    }
    if (block.type === 'links') {
      return block.display_style === 'related' ? 'BÀI LIÊN QUAN' : 'LIÊN KẾT NGOÀI';
    }
    return 'KHỐI NỘI DUNG';
  };

  const renderBlockItem = (
    block: Block,
    idx: number
  ) => {
    if (!isAdmin && !block.is_visible) return null;

    // Loại bỏ khối sách/flipbook khỏi bài học (kiến thức đã có trong phần Tóm tắt, tránh vướng víu)
    if (block.display_style === 'flipbook' || block.type === 'books' || block.display_style === 'books') {
      return null;
    }

    // Nếu bài học đã có khối Video (đã tích hợp sẵn 3 tab: Giáo trình, Tóm tắt cốt lõi, Tài liệu):
    if (videoBlock) {
      // Khi đang xem tab 'Tài liệu' (resources):
      // Tuyệt đối không hiển thị bất kỳ khối nào bên dưới VideosBlock.
      // Đúng nguyên tắc của người dùng: "Tài liệu chỉ là nơi chứa tài liệu còn tất cả những thứ không liên quan đến tài liệu xóa hết"
      if (activeTab === 'resources' && block.id !== videoBlock.id) {
        return null;
      }

      // Khi đang xem tab 'Tóm tắt cốt lõi' (summary):
      // Tất cả nội dung tóm tắt (văn bản, bảng so sánh...) đã nằm trọn vẹn trong tab summaryContent của VideosBlock
      if (activeTab === 'summary' && block.id !== videoBlock.id) {
        return null;
      }

      // Khi đang xem tab 'Giáo trình' (syllabus):
      // Khối tóm tắt văn bản, bảng so sánh và tệp tài liệu đã nằm trong tab riêng, không hiển thị lặp lại bên dưới video
      if (block.type === 'text' && !isHtmlTextBlock(block)) {
        return null;
      }
      if (block.type === 'comparison') {
        return null;
      }
      if (block.type === 'files') {
        return null;
      }
    }

    const blockTitle = getBlockTitle(block);

    return (
      <div
        key={block.id}
        id={`block-${block.id}`}
        className={`relative transition-all cv-auto-large ${
          isAdmin
            ? 'p-2.5 rounded-[22px] border-2 border-dashed border-[#2D5B94]/30 dark:border-purple-500/40 bg-white/40 dark:bg-[#160E2E]/40'
            : ''
        } ${!block.is_visible ? 'opacity-50' : ''}`}
      >
        {/* Thanh điều khiển của Admin trên từng khối */}
        {isAdmin && (
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-line/60">
            <span className="text-[12px] font-extrabold text-muted uppercase tracking-wider">
              {blockTitle}
            </span>

            <div className="flex items-center gap-1.5">
              {/* Nút Sửa */}
              <button
                type="button"
                onClick={() => {
                  setEditingBlock(block);
                }}
                className="flex items-center gap-1 h-8 px-3 rounded-[10px] bg-white dark:bg-[#1C123D] border border-line text-ink font-bold text-[13px] hover:border-primary shadow-2xs cursor-pointer"
              >
                <Edit2 size={13} className="text-primary" />
                <span>Sửa</span>
              </button>

              {/* Nút Di chuyển lên ▲ */}
              <button
                type="button"
                onClick={() => handleMoveBlockUp(idx)}
                disabled={idx === 0}
                className="w-8 h-8 rounded-[10px] bg-white dark:bg-[#1C123D] border border-line flex items-center justify-center text-ink disabled:opacity-30 shadow-2xs cursor-pointer"
                aria-label="Di chuyển khối lên"
              >
                <ChevronUp size={16} />
              </button>

              {/* Nút Di chuyển xuống ▼ */}
              <button
                type="button"
                onClick={() => handleMoveBlockDown(idx)}
                disabled={idx === blockList.length - 1}
                className="w-8 h-8 rounded-[10px] bg-white dark:bg-[#1C123D] border border-line flex items-center justify-center text-ink disabled:opacity-30 shadow-2xs cursor-pointer"
                aria-label="Di chuyển khối xuống"
              >
                <ChevronDown size={16} />
              </button>

              {/* Nút Menu ⋮ */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setActiveMenuBlockId(
                      activeMenuBlockId === block.id ? null : block.id
                    )
                  }
                  className="w-8 h-8 rounded-[10px] bg-white dark:bg-[#1C123D] border border-line flex items-center justify-center text-ink shadow-2xs cursor-pointer"
                  aria-label="Tùy chọn khối"
                >
                  <MoreVertical size={16} />
                </button>

                {/* Dropdown Menu ⋮ */}
                {activeMenuBlockId === block.id && (
                  <div className="absolute right-0 top-9 w-[180px] bg-white dark:bg-[#1C123D] rounded-[16px] border border-line shadow-xl py-1.5 z-50 animate-in fade-in duration-150">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(block.id)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[14px] font-bold text-ink hover:bg-surface-2 dark:hover:bg-white/10 cursor-pointer"
                    >
                      {block.is_visible ? (
                        <>
                          <EyeOff size={16} />
                          <span>Ẩn khối này</span>
                        </>
                      ) : (
                        <>
                          <Eye size={16} />
                          <span>Hiện khối này</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateBlock(idx)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[14px] font-bold text-ink hover:bg-surface-2 dark:hover:bg-white/10 cursor-pointer"
                    >
                      <Copy size={16} />
                      <span>Nhân bản khối</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBlock(block.id)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[14px] font-bold text-[#E5484D] dark:text-[#FFA099] hover:bg-[#FBE7E1] dark:hover:bg-red-950/40 cursor-pointer"
                    >
                      <Trash2 size={16} />
                      <span>Xóa khối</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Nội dung khối */}
        <BlockRenderer
          block={block}
          fontSizeMode="normal"
          defaultActiveVideoIndex={defaultActiveVideoIndex}
          isAdmin={isAdmin}
          onOpenVideoManager={() => setShowVideoManager(true)}
          onSaveVideos={handleSaveVideos}
          pageId={page.id}
          topicSlug={topic.slug}
          topicTitle={topic.title}
          pageSlug={page.slug}
          pageTitle={currentPage.title}
          pageNumber={pageIndex}
          pageCoverUrl={currentPage.cover_url}
          pageSlugMap={pageSlugMap}
          progressAction={
            <button
              type="button"
              onClick={handleToggleCompleted}
              className={`inline-flex items-center gap-1 whitespace-nowrap px-2 py-0.5 rounded-full border text-[10px] sm:text-[11px] font-bold transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0 ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-500 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-500 animate-breathe-emerald'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-500 hover:text-emerald-700 dark:bg-[#1E1342] dark:text-purple-200 dark:border-purple-800/60'
              }`}
              title={isCompleted ? 'Bấm để hủy đánh dấu' : 'Bấm để đánh dấu đã hiểu bài này'}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                  <span>Đã hiểu bài ✓</span>
                </>
              ) : (
                <>
                  <Circle size={14} className="text-slate-400 dark:text-purple-400 stroke-[2]" />
                  <span>Đánh dấu đã hiểu</span>
                </>
              )}
            </button>
          }
          nextPage={
            nextPage
              ? {
                  slug: nextPage.slug,
                  title: nextPage.title,
                  orderNumber: nextPageIndex || 0,
                }
              : null
          }
          summaryContent={
            block.type === 'videos' ? (
              <div className="flex flex-col gap-3 py-1">
                {textBlocks
                  .filter((b) => isAdmin || b.is_visible)
                  .map((b, textIdx) => (
                    <div
                      key={b.id}
                      id={`block-${b.id}`}
                      className={`relative transition-all ${
                        isAdmin
                          ? 'p-2 rounded-[20px] border-2 border-dashed border-[#2D5B94]/30 dark:border-purple-500/40 bg-white/40 dark:bg-[#160E2E]/40'
                          : ''
                      } ${!b.is_visible ? 'opacity-50' : ''}`}
                    >
                      {/* Thanh điều khiển của Admin trên từng khối tóm tắt */}
                      {isAdmin && (
                        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-line/60">
                          <span className="text-[11.5px] font-extrabold text-muted uppercase tracking-wider">
                            {getBlockTitle(b)}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {/* Nút Sửa */}
                            <button
                              type="button"
                              onClick={() => setEditingBlock(b)}
                              className="flex items-center gap-1 h-7 px-2.5 rounded-[8px] bg-white dark:bg-[#1C123D] border border-line text-ink font-bold text-[12px] hover:border-primary shadow-2xs cursor-pointer"
                            >
                              <Edit2 size={12} className="text-primary" />
                              <span>Sửa</span>
                            </button>

                            {/* Nút Di chuyển lên ▲ */}
                            <button
                              type="button"
                              onClick={() => handleMoveSummaryBlockUp(b.id)}
                              disabled={textIdx === 0}
                              className="w-7 h-7 rounded-[8px] bg-white dark:bg-[#1C123D] border border-line flex items-center justify-center text-ink disabled:opacity-30 shadow-2xs cursor-pointer"
                              title="Di chuyển lên"
                            >
                              <ChevronUp size={13} />
                            </button>

                            {/* Nút Di chuyển xuống ▼ */}
                            <button
                              type="button"
                              onClick={() => handleMoveSummaryBlockDown(b.id)}
                              disabled={textIdx === textBlocks.filter((x) => isAdmin || x.is_visible).length - 1}
                              className="w-7 h-7 rounded-[8px] bg-white dark:bg-[#1C123D] border border-line flex items-center justify-center text-ink disabled:opacity-30 shadow-2xs cursor-pointer"
                              title="Di chuyển xuống"
                            >
                              <ChevronDown size={13} />
                            </button>

                            {/* Nút Ẩn/Hiện */}
                            <button
                              type="button"
                              onClick={() => handleToggleVisibility(b.id)}
                              className="w-7 h-7 rounded-[8px] bg-white dark:bg-[#1C123D] border border-line flex items-center justify-center text-ink shadow-2xs cursor-pointer"
                              title={b.is_visible ? 'Ẩn mục này' : 'Hiện mục này'}
                            >
                              {b.is_visible ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>

                            {/* Nút Xóa */}
                            <button
                              type="button"
                              onClick={() => handleDeleteBlock(b.id)}
                              className="w-7 h-7 rounded-[8px] bg-white dark:bg-[#1C123D] border border-line flex items-center justify-center text-[#E5484D] shadow-2xs cursor-pointer"
                              title="Xóa mục này"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      )}

                      {b.type === 'comparison' ? (
                        <ComparisonBlock
                          blockId={`block-${b.id}`}
                          leftTitle={b.data.left_title}
                          leftLines={b.data.left_lines}
                          rightTitle={b.data.right_title}
                          rightLines={b.data.right_lines}
                        />
                      ) : b.type === 'text' ? (
                        <TextBlock
                          blockId={`block-${b.id}`}
                          displayStyle={b.display_style}
                          title={b.data.title}
                          titleColor={b.data.title_color}
                          mode={b.data.mode}
                          html={b.data.html}
                          lines={b.data.lines}
                          format={b.data.format}
                          fontSizeMode={fontSizeMode}
                          fontSize={b.data.font_size}
                          textColor={b.data.text_color}
                          textAlign={b.data.text_align}
                          images={b.data.images}
                          files={b.data.files}
                          videos={b.data.videos}
                        />
                      ) : null}
                    </div>
                  ))}

                {textBlocks.filter((b) => isAdmin || b.is_visible).length === 0 && (
                  <p className="text-muted text-[14px] p-4 text-center">
                    Chưa có tóm tắt bằng văn bản cho bài học này.
                  </p>
                )}

                {/* Nút thêm tóm tắt mới dành cho Admin ngay trong tab Tóm tắt cốt lõi */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setShowAddDrawer(true)}
                    className="flex items-center justify-center gap-1.5 h-10 w-full rounded-[12px] border border-dashed border-primary text-primary font-bold text-[13.5px] hover:bg-primary-soft/30 transition-colors cursor-pointer mt-1"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                    <span>+ Thêm mục tóm tắt cốt lõi</span>
                  </button>
                )}
              </div>
            ) : undefined
          }
          resourcesContent={
            block.type === 'videos' ? (
              <MedicalDocumentsTab
                topicSlug={topic.slug}
                topicTitle={topic.title}
                pageTitle={page.title}
                customFiles={customFiles}
                isAdmin={isAdmin}
              />
            ) : undefined
          }
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    );
  };

  return (
    <main className="flex-1 flex flex-col px-4 sm:px-5 pt-0 pb-16 sm:pb-20 gap-0.5 sm:gap-1.5">
      {/* 1. ĐÃ BỎ THANH ĐEN ĐỈNH ĐẦU ĐỂ TIẾT KIỆM DIỆN TÍCH THEO YÊU CẦU CỦA ANH */}

      {/* 2. Thanh điều hướng trang: ‹ [Chủ đề] + [Mục lục] + [⋮] */}
      <PageHeaderBar
        topicTitle={topic.title}
        topicSlug={topic.slug}
        tocItems={tocItems}
        fontSizeMode={fontSizeMode}
        onFontSizeChange={handleFontSizeChange}
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
        onOpenSettings={() => setShowAdminSettingsModal(true)}
        onShare={handleShare}
        isSaved={isSaved}
        onToggleSave={handleToggleBookmark}
        themeMode={themeMode}
        onThemeChange={handleThemeChange}
        onOpenPhoneSync={() => {
          setPhoneSyncReason('manual');
          setShowPhoneSyncModal(true);
        }}
        onSelectTocItem={handleSelectTocItem}
        onOpen3DModal={() => setShow3DModal(true)}
      />

      {/* 3. Phần đầu bài viết: Badge BÀI 01 / 04 + Tiêu đề lớn (Không lặp lại tên chủ đề) */}
      <div className="flex flex-col gap-1.5 sm:gap-2" style={{ zoom: fontSizeMode === 'small' ? 0.9 : fontSizeMode === 'large' ? 1.15 : 1 } as React.CSSProperties}>
      <section className="flex flex-col gap-0.5 -mt-1 sm:-mt-0.5">
        {isAdmin && (
          <div className="flex items-center justify-end gap-1.5 -mb-0.5">
            <button
              type="button"
              onClick={() => setShowEditPageModal(true)}
              className="flex items-center gap-1 h-5 px-1.5 rounded-[6px] bg-white border border-line text-ink font-bold text-[10px] hover:border-primary shadow-2xs"
              title="Sửa tên bài & tóm tắt"
            >
              <Edit2 size={10} className="text-primary" />
              <span>Sửa</span>
            </button>

            <button
              type="button"
              onClick={handleToggleStatus}
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border transition-all ${
                pageStatus === 'published'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-[#FFF1E6] text-[#8A3A14] border-[#F2B38A]'
              }`}
              title="Bấm để đổi trạng thái"
            >
              {pageStatus === 'published' ? '● Hiện' : '○ Nháp'}
            </button>
          </div>
        )}
        <h1 className="text-[20px] sm:text-[24px] font-extrabold text-ink leading-[1.14]">
          {currentPage.title}
        </h1>
        {currentPage.summary && (
          <p className="text-[11.5px] sm:text-[12.5px] text-muted font-normal leading-snug mt-0">
            {currentPage.summary}
          </p>
        )}
      </section>

      {/* 4. Danh sách tất cả các khối theo đúng thứ tự sắp xếp */}
      <div className="flex flex-col gap-2.5 sm:gap-3.5">
        {blockList
          .filter((b) => {
            if (!isAdmin && !b.is_visible) return false;
            return true;
          })
          .map((block) => {
            const actualIdx = blockList.findIndex((item) => item.id === block.id);
            return renderBlockItem(block, actualIdx);
          })}

        {blockList.filter((b) => isAdmin || b.is_visible).length === 0 && (
          <div className="p-8 text-center bg-white rounded-[22px] border border-line my-4">
            <p className="text-[17px] text-muted font-medium">
              Bài học đang được cập nhật nội dung.
            </p>
          </div>
        )}
      </div>
      </div>{/* /font-zoom wrapper */}

      {/* 5. Nút "+ Thêm nội dung" (Hiện khi ở chế độ Admin, đặt ở cuối danh sách các khối) */}
      {isAdmin && (
        <div className="flex flex-col gap-2 mt-2">
          <button
            type="button"
            onClick={() => setShowAddDrawer(true)}
            className="flex items-center justify-center gap-2 h-[52px] min-h-[48px] w-full rounded-[16px] border-2 border-dashed border-primary bg-primary-soft/30 text-primary font-extrabold text-[17px] transition-transform active:scale-[0.98] shadow-2xs hover:bg-primary-soft/50 cursor-pointer"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>Thêm nội dung</span>
          </button>
        </div>
      )}

      {/* 6.5. Thẻ Cầu Nối Sách Chuyên Sâu (Smart Ebook Companion - Chuẩn 1 Dòng Mobile-First) */}
      {(appCustomSettings.show_ebook_bridge ?? true) && (
        <a
          href={`${appCustomSettings.ebook_app_url || 'https://qbiz-ebook.vercel.app'}?topic=${topic.slug}&page=${currentPage.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={playTapSound}
          className="w-full h-11 flex items-center justify-between gap-2 px-3 rounded-[13px] bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-slate-50 dark:from-[#081820] dark:to-[#051017] border border-emerald-300/80 dark:border-emerald-800/60 shadow-2xs hover:border-emerald-500 active:scale-[0.99] transition-all cursor-pointer text-left group mt-2"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-[13px] shrink-0 shadow-2xs">
              📖
            </span>
            <span className="text-[11.5px] sm:text-[12.5px] font-black text-slate-900 dark:text-white truncate">
              {TOPIC_EBOOK_MAP[topic.slug]?.title || `Sách ${topic.title}`}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-emerald-950 px-2 py-1 rounded-[8px] border border-emerald-200/80 dark:border-emerald-700/60 shadow-2xs shrink-0 whitespace-nowrap">
            <span>Đọc Ebook</span>
            <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </a>
      )}

      {/* 7. Cuối trang: Nút Chia sẻ và Thẻ tư vấn Zalo */}
      <section className="flex flex-col gap-2 mt-4 pt-3 border-t border-line/50">
        {/* Nút Chia sẻ trang này (Khung mờ, chữ thường, không quá nổi bật) */}
        <button
          type="button"
          onClick={handleOpenShareModal}
          className="flex items-center justify-center gap-2 h-[42px] min-h-[40px] w-full rounded-[12px] bg-slate-100/60 dark:bg-purple-950/20 border border-slate-200/80 dark:border-purple-900/40 text-slate-600 dark:text-purple-300 font-medium text-[13.5px] transition-all hover:bg-slate-200/60 dark:hover:bg-purple-950/40 hover:text-slate-900 dark:hover:text-white active:scale-[0.99] cursor-pointer mt-0.5"
        >
          <Share2 size={15} className="text-slate-500 dark:text-purple-400 stroke-[1.8]" />
          <span>Chia sẻ trang này</span>
        </button>

        {/* Thẻ tư vấn Chuyên gia / Zalo chuẩn nhận diện màu xanh Zalo */}
        {(consultSettings?.zalo_url || consultSettings?.hotline) && (
          <a
            href={consultSettings.zalo_url || `https://zalo.me/${consultSettings.hotline}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 sm:p-3.5 rounded-[16px] bg-white dark:bg-purple-950/40 border border-[#0068FF]/30 dark:border-[#0068FF]/50 hover:border-[#0068FF] transition-all shadow-2xs mt-1.5 group active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-10 h-10 rounded-[12px] bg-[#0068FF] text-white flex items-center justify-center shrink-0 shadow-sm font-black text-[13px] tracking-tight">
                Zalo
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-[13px] sm:text-[13.5px] font-black text-slate-900 dark:text-white leading-tight">
                  Cần tư vấn về cơ thể?
                </span>
                <span className="text-[11.5px] font-semibold text-[#0068FF] dark:text-sky-300 leading-tight mt-0.5">
                  Nhắn tin trao đổi qua Zalo
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0068FF] hover:bg-[#0055D4] text-white text-[12px] font-black shadow-xs shrink-0 ml-2 transition-colors">
              <span>Nhắn Zalo</span>
              <span className="text-[13px] font-bold">›</span>
            </div>
          </a>
        )}
      </section>

      {/* 8. Thanh điều hướng treo dính sát đáy chân màn hình (Sticky Bottom Dock) - Siêu gọn, giảm 50% diện tích theo yêu cầu */}
      <aside
        aria-label="Điều hướng bài học dính sát đáy chân màn hình"
        className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none"
      >
        <div className="w-full max-w-[540px] px-3 pt-1.5 pb-[max(8px,env(safe-area-inset-bottom))] bg-white/95 dark:bg-[#0E0820]/95 backdrop-blur-md border-t border-slate-200/90 dark:border-purple-900/60 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.5)] pointer-events-auto transition-all">
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {/* Nút Khung chữ nhật Bài trước / Quay lại - 1 dòng siêu gọn */}
            {prevPage ? (
              <a
                href={`/${topic.slug}/${prevPage.slug}`}
                onClick={playTapSound}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-[10px] bg-slate-100 dark:bg-[#1E1438] border border-slate-300/90 dark:border-purple-700/60 hover:bg-slate-200 dark:hover:bg-[#281A4E] text-slate-800 dark:text-white transition-all shadow-xs group active:scale-[0.98] h-[36px] overflow-hidden cursor-pointer"
              >
                <ArrowLeft size={13} strokeWidth={2.5} className="shrink-0 text-slate-500 dark:text-purple-300 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-[11.5px] sm:text-[12px] font-bold truncate">
                  Bài {String(prevPageIndex).padStart(2, '0')}: {prevPage.title}
                </span>
              </a>
            ) : (
              <a
                href={`/${topic.slug}`}
                onClick={playTapSound}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-[10px] bg-slate-100 dark:bg-[#1E1438] border border-slate-300/90 dark:border-purple-700/60 hover:bg-slate-200 dark:hover:bg-[#281A4E] text-slate-800 dark:text-white transition-all shadow-xs group active:scale-[0.98] h-[36px] overflow-hidden cursor-pointer"
              >
                <ArrowLeft size={13} strokeWidth={2.5} className="shrink-0 text-slate-500 dark:text-purple-300 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-[11.5px] sm:text-[12px] font-bold truncate">
                  Về danh sách
                </span>
              </a>
            )}

            {/* Nút Khung chữ nhật Bài tiếp theo - 1 dòng siêu gọn */}
            {nextPage ? (
              <a
                href={`/${topic.slug}/${nextPage.slug}`}
                onClick={playTapSound}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-[10px] bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white font-black shadow-sm shadow-blue-600/20 border border-blue-300/50 hover:brightness-105 transition-all group active:scale-[0.98] h-[36px] overflow-hidden cursor-pointer"
              >
                <span className="text-[11.5px] sm:text-[12px] font-black text-white truncate">
                  Bài {String(nextPageIndex).padStart(2, '0')}: {nextPage.title}
                </span>
                <ArrowRight size={13} strokeWidth={2.5} className="shrink-0 text-white group-hover:translate-x-0.5 transition-transform" />
              </a>
            ) : (
              <a
                href={`/${topic.slug}`}
                onClick={playTapSound}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-[10px] bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-sm shadow-emerald-500/20 border border-emerald-400/40 hover:brightness-105 transition-all group active:scale-[0.98] h-[36px] overflow-hidden cursor-pointer"
              >
                <span className="text-[11.5px] sm:text-[12px] font-bold text-white truncate">
                  Hoàn thành bài
                </span>
                <CheckCircle2 size={14} strokeWidth={2.5} className="shrink-0 text-white" />
              </a>
            )}
          </div>
        </div>
      </aside>

      {/* 7. Bảng điều khiển quản trị trang (Hiện khi isAdmin = true) */}
      {isAdmin && (
        <section className="flex flex-col gap-2.5 mt-6 p-4 rounded-[22px] bg-primary-soft/30 dark:bg-[#160E2E]/60 border-2 border-dashed border-primary/40">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-extrabold uppercase text-primary dark:text-[#A78BFA] tracking-wider">
              Quản trị nhanh
            </span>
            <span className="text-[12px] text-muted font-bold">
              {blockList.length} khối nội dung
            </span>
          </div>

          {/* Trạng thái kết nối dữ liệu */}
          <div
            className={`px-3 py-2 rounded-[12px] text-[12px] font-extrabold flex items-center gap-2 ${
              supabaseOk
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40'
                : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/40'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                supabaseOk ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'
              }`}
            />
            <span className="leading-tight">
              {supabaseOk
                ? 'Dữ liệu: Đã kết nối ✓'
                : 'Dữ liệu: CHƯA kết nối – nội dung sửa sẽ không được lưu'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setShowAddDrawer(true)}
              className="flex items-center justify-center gap-1.5 h-11 rounded-[12px] bg-white dark:bg-[#1C123D] border border-line text-ink font-bold text-[14px] hover:border-primary shadow-2xs cursor-pointer"
            >
              <Plus size={16} className="text-primary" />
              <span>+ Thêm khối</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAdminSettingsModal(true)}
              className="flex items-center justify-center gap-1.5 h-11 rounded-[12px] bg-white dark:bg-[#1C123D] border border-line text-ink font-bold text-[14px] hover:border-primary shadow-2xs cursor-pointer"
            >
              <SettingsIcon size={16} className="text-primary" />
              <span>Cài đặt app</span>
            </button>
          </div>

          <div className="flex items-center justify-end pt-1 text-[13px]">
            <button
              type="button"
              onClick={handleToggleAdmin}
              className="text-[#8A3A14] dark:text-[#93C5FD] font-bold py-1 hover:underline cursor-pointer"
            >
              Thoát sửa
            </button>
          </div>
        </section>
      )}

      {/* Thông báo lỗi khi lưu thất bại (không im lặng) */}
      {saveErrorMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-red-600 text-white font-extrabold text-[14px] shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {saveErrorMsg}
        </div>
      )}

      {/* Thông báo chia sẻ / chép link */}
      {shareNoticeMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-primary text-white font-extrabold text-[14px] shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {shareNoticeMsg}
        </div>
      )}

      {/* Modals của Admin */}
      {editingBlock && (
        <EditBlockModal
          isOpen={true}
          onClose={() => setEditingBlock(null)}
          block={editingBlock}
          onSaveBlock={handleSaveBlock}
        />
      )}

      {showVideoManager && (
        <VideoManagerModal
          isOpen={true}
          onClose={() => setShowVideoManager(false)}
          videos={currentVideos}
          onSaveVideos={handleSaveVideos}
        />
      )}

      {showAddDrawer && (
        <AddBlockDrawer
          isOpen={true}
          onClose={() => setShowAddDrawer(false)}
          pageId={page.id}
          onAddBlock={handleAddBlock}
          nextSortOrder={blockList.length + 1}
          initialYoutubeUrl={currentVideos?.[0]?.youtube_id ? `https://www.youtube.com/watch?v=${currentVideos[0].youtube_id}` : ''}
          topicTitle={topic.title}
          pageTitle={currentPage.title}
        />
      )}

      {showEditPageModal && (
        <EditPageModal
          isOpen={true}
          onClose={() => setShowEditPageModal(false)}
          page={currentPage}
          topicId={topic.id}
          onSaved={(updated) => {
            setCurrentPage(updated);
            setPageStatus(updated.status);
          }}
        />
      )}

      {showAdminSettingsModal && (
        <AdminSettingsModal
          isOpen={true}
          onClose={() => setShowAdminSettingsModal(false)}
          onLogout={() => setIsAdmin(false)}
        />
      )}

      {/* Modal Mô hình Giải Phẫu 3D Tương Tác */}
      {show3DModal && (
        <Anatomy3DModal
          isOpen={true}
          onClose={() => setShow3DModal(false)}
          initialSystem={get3DSystemForTopic(topic.slug)}
          topicTitle={topic.title}
        />
      )}

      {/* Modal Lưu tiến độ & Đồng bộ qua SĐT */}
      <UserSyncModal
        isOpen={showPhoneSyncModal}
        onClose={() => setShowPhoneSyncModal(false)}
        reason={phoneSyncReason}
      />

      {/* Modal Chia sẻ có Mã QR và Link chuẩn (theo mẫu hình ảnh) */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[999] flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="relative w-full max-w-[340px] sm:max-w-[360px] bg-[#FAF8F5] dark:bg-[#160E28] rounded-[24px] p-5 sm:p-6 shadow-2xl border border-stone-200/80 dark:border-purple-900/60 flex flex-col items-center text-center animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút Đóng X góc trên phải */}
            <button
              type="button"
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-200/70 dark:bg-purple-900/50 text-slate-600 dark:text-purple-200 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-purple-800 transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {/* Tiêu đề ngắn gọn cần thiết, không từ thừa */}
            <h3 className="text-[17px] font-extrabold text-slate-800 dark:text-white mt-1">
              Mã QR bài học
            </h3>

            {/* Khung chứa ảnh mã QR chuẩn sắc nét */}
            <div className="p-3.5 bg-white rounded-[20px] shadow-sm border border-slate-200/60 mt-4 mb-3 flex items-center justify-center">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt={`Mã QR bài học ${currentPage.title}`}
                  className="w-[190px] h-[190px] object-contain rounded-[8px]"
                />
              ) : (
                <div className="w-[190px] h-[190px] bg-slate-100 rounded-[8px] flex items-center justify-center text-slate-400 text-[12px]">
                  Đang tạo mã QR...
                </div>
              )}
            </div>

            {/* Hướng dẫn quét và Tên bài học */}
            <p className="text-[13px] text-slate-600 dark:text-purple-200 leading-snug">
              Quét mã QR để mở bài học
            </p>
            <p className="text-[14.5px] font-extrabold text-slate-900 dark:text-white leading-tight mt-0.5 max-w-[280px] truncate">
              {currentPage.title}
            </p>

            {/* Đường dẫn link chuẩn */}
            <p className="text-[11.5px] text-slate-400 dark:text-purple-300/70 font-mono break-all max-w-[280px] line-clamp-1 mt-2 mb-4">
              {shareUrl}
            </p>

            {/* Nút Sao chép link chuẩn */}
            <button
              type="button"
              onClick={handleCopyLink}
              className={`w-full h-[46px] rounded-[14px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
                isCopied
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[#2E313D] dark:bg-purple-800 hover:bg-[#20222B] text-white shadow-sm'
              }`}
            >
              {isCopied ? (
                <>
                  <Check size={17} strokeWidth={2.5} />
                  <span>Đã sao chép link!</span>
                </>
              ) : (
                <>
                  <Copy size={16} strokeWidth={2.2} />
                  <span>Sao chép link bài học</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
