'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
import { generateUuid } from '../lib/uuid';
import PageHeaderBar, { TocItem, FontSizeOption, ThemeModeOption } from './PageHeaderBar';
import BlockRenderer from './BlockRenderer';
import EditBlockModal from './admin/EditBlockModal';
import VideoManagerModal from './admin/VideoManagerModal';
import AddBlockDrawer from './admin/AddBlockDrawer';
import EditPageModal from './admin/EditPageModal';
import AdminSettingsModal from './admin/AdminSettingsModal';
import MedicalDocumentsTab from './MedicalDocumentsTab';
import FlipbookViewer from './FlipbookViewer';
import { checkAdminStatus, setAdminClient } from '../lib/adminAuth';
import { deleteBlockApi } from '../lib/apiAdmin';
import {
  getStoredBlocks,
  saveStoredBlocks,
  getStoredPageStatus,
  saveStoredPageStatus,
  getStoredPage,
  saveStoredPage,
  getStoredAppSettings,
  DEFAULT_APP_SETTINGS,
} from '../lib/storage';
import {
  isPageSaved,
  toggleSavePage,
  isPageCompleted,
  togglePageCompleted,
} from '../lib/learningProgress';
import { playTapSound, playSuccessChime } from '../lib/audioFeedback';
import { getUserPhone } from '../lib/userSync';
import UserSyncModal from './UserSyncModal';
import { Settings as SettingsIcon } from 'lucide-react';

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
}: ContentViewerProps) {
  const [fontSizeMode, setFontSizeMode] = useState<FontSizeOption>('normal');
  const [isAdmin, setIsAdmin] = useState(false);
  const [supabaseOk, setSupabaseOk] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(page);
  const [pageStatus, setPageStatus] = useState<'draft' | 'published'>(page.status);
  const [blockList, setBlockList] = useState<Block[]>(initialBlocks);

  // Modals
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [showVideoManager, setShowVideoManager] = useState(false);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [showEditPageModal, setShowEditPageModal] = useState(false);
  const [showAdminSettingsModal, setShowAdminSettingsModal] = useState(false);
  const [activeMenuBlockId, setActiveMenuBlockId] = useState<string | null>(null);

  // Quản lý khối Sách lật 3D (Độc lập, tách rời danh sách phát, quản trị di chuyển/ẩn hiện)
  const [flipbookOrder, setFlipbookOrder] = useState<number>(1); // 0: trên video, 1: ngay dưới playlist, 2: cuối trang
  const [flipbookHidden, setFlipbookHidden] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storageKey = `flipbook_pos_${topic.slug}_${page.slug}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.order === 'number') setFlipbookOrder(parsed.order);
        if (typeof parsed.hidden === 'boolean') setFlipbookHidden(parsed.hidden);
      }
    } catch {}
  }, [topic.slug, page.slug]);

  const handleFlipbookMoveUp = () => {
    setFlipbookOrder((prev) => {
      const next = Math.max(0, prev - 1);
      try {
        localStorage.setItem(
          `flipbook_pos_${topic.slug}_${page.slug}`,
          JSON.stringify({ order: next, hidden: flipbookHidden })
        );
      } catch {}
      return next;
    });
  };

  const handleFlipbookMoveDown = () => {
    setFlipbookOrder((prev) => {
      const next = Math.min(2, prev + 1);
      try {
        localStorage.setItem(
          `flipbook_pos_${topic.slug}_${page.slug}`,
          JSON.stringify({ order: next, hidden: flipbookHidden })
        );
      } catch {}
      return next;
    });
  };

  const handleFlipbookToggleVisibility = () => {
    setFlipbookHidden((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(
          `flipbook_pos_${topic.slug}_${page.slug}`,
          JSON.stringify({ order: flipbookOrder, hidden: next })
        );
      } catch {}
      return next;
    });
  };

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

      // 2. Quyền Admin & Trạng thái kết nối dữ liệu
      checkAdminStatus().then((status) => {
        setIsAdmin(status.isAdmin);
        setSupabaseOk(status.supabaseOk);
      });

      // 3. Trạng thái và thông tin trang
      const storedPage = getStoredPage(page.id, page);
      setCurrentPage(storedPage);
      setPageStatus(getStoredPageStatus(page.id, storedPage.status));

      // 4. Khối nội dung đã sửa
      const loadedBlocks = getStoredBlocks(page.id, initialBlocks);
      setBlockList(loadedBlocks);

      // 5. Trạng thái đã lưu, đã hoàn thành, theme & cài đặt tư vấn
      setIsSaved(isPageSaved(page.id));
      setIsCompleted(isPageCompleted(page.id));
      const rawTheme = localStorage.getItem('giao_dien');
      const savedTheme: ThemeModeOption = rawTheme === 'dark' || rawTheme === 'gray' ? rawTheme : 'light';
      setThemeMode(savedTheme);
      const appSet = getStoredAppSettings();
      if (appSet) {
        setConsultSettings({ zalo_url: appSet.zalo_url, hotline: appSet.hotline });
      }
    } catch {
      // Bỏ qua lỗi truy cập client storage
    }
  }, [page.id, initialBlocks, page.status, page]);

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
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', mode === 'dark' ? '#0C0817' : '#F5F6FA');
      }
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
    if (index === 0) return;
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
    if (index === blockList.length - 1) return;
    const updated = [...blockList];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
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
  const handleSaveBlock = (updatedBlock: Block) => {
    const updated = blockList.map((b) => (b.id === updatedBlock.id ? updatedBlock : b));
    setBlockList(updated);
    triggerSaveBlocks(updated);
  };

  // Thêm khối mới
  const handleAddBlock = (newBlock: Block) => {
    const updated = [...blockList, { ...newBlock, sort_order: blockList.length + 1 }];
    setBlockList(updated);
    triggerSaveBlocks(updated);
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

  // Tạo danh sách mục lục từ các khối hiển thị
  const tocItems: TocItem[] = blockList
    .filter((b) => b.is_visible)
    .map((block) => {
      if (block.type === 'videos') {
        return { id: block.id, label: 'Danh sách video' };
      }
      if (block.type === 'text') {
        switch (block.display_style) {
          case 'y_nghia':
            return { id: block.id, label: 'Ý nghĩa' };
          case 'diem_can_nho':
            return { id: block.id, label: 'Điểm cần nhớ' };
          case 'chu_y':
            return { id: block.id, label: 'Chú ý' };
          case 'sai_lam':
            return { id: block.id, label: 'Sai lầm thường gặp' };
          case 'giai_phap':
            return { id: block.id, label: 'Giải pháp' };
          default:
            return null;
        }
      }
      if (block.type === 'links' && block.display_style === 'related') {
        return { id: block.id, label: 'Bài liên quan' };
      }
      if (block.type === 'files') {
        return { id: block.id, label: 'Tài liệu' };
      }
      if (block.type === 'images') {
        return { id: block.id, label: 'Hình ảnh' };
      }
      return null;
    })
    .filter((item): item is TocItem => item !== null);

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

  const textBlocks = blockList.filter((b) => b.type === 'text');
  const filesBlocks = blockList.filter((b) => b.type === 'files');
  const customFiles: FileItem[] = filesBlocks.flatMap((b) => (b.type === 'files' ? b.data.files : []));
  const relatedLinksBlock = blockList.find((b) => b.type === 'links' && b.display_style === 'related');

  const renderBlockItem = (
    block: Block,
    idx: number,
    isSubBlock = false
  ) => {
    if (!isAdmin && !block.is_visible) return null;

    const blockTitle =
      block.type === 'videos'
        ? 'DANH SÁCH VIDEO'
        : block.type === 'text'
        ? block.display_style.toUpperCase().replace('_', ' ')
        : block.type === 'images'
        ? 'HÌNH ẢNH'
        : block.type === 'files'
        ? 'TÀI LIỆU'
        : 'BÀI LIÊN QUAN';

    return (
      <div
        key={block.id}
        id={`block-${block.id}`}
        className={`relative transition-all ${
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
                  if (block.type === 'videos') {
                    setShowVideoManager(true);
                  } else {
                    setEditingBlock(block);
                  }
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
          fontSizeMode={fontSizeMode}
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
              <div className="flex flex-col gap-4">
                {textBlocks.map((b) => renderBlockItem(b, blockList.indexOf(b), true))}
                {textBlocks.length === 0 && (
                  <p className="text-muted text-[14px] p-4 text-center">
                    Chưa có tóm tắt bằng văn bản cho bài học này.
                  </p>
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

  // Khối sách lật 3D độc lập (Tách rời danh sách phát, quản trị di chuyển/ẩn hiện)
  const renderFlipbookBlock = () => (
    <FlipbookViewer
      key="independent-flipbook-block"
      topicTitle={topic.title}
      pageTitle={currentPage.title}
      isAdmin={isAdmin}
      isHidden={flipbookHidden}
      onToggleVisibility={handleFlipbookToggleVisibility}
      onMoveUp={handleFlipbookMoveUp}
      onMoveDown={handleFlipbookMoveDown}
      isFirst={flipbookOrder === 0}
      isLast={flipbookOrder === 2}
    />
  );

  return (
    <main className="flex-1 flex flex-col px-5 pt-2 pb-16 sm:pb-20 gap-3 sm:gap-3.5">
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
      />

      {/* 3. Phần đầu bài viết: Badge BÀI 01 / 04 + Tiêu đề lớn (Không lặp lại tên chủ đề) */}
      <section className="flex flex-col gap-1.5 mt-1">
        <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#1E3A8A] dark:bg-purple-950/60 dark:border-purple-800/40 dark:text-purple-300 text-[12px] font-black tracking-wider uppercase shrink-0">
              <span>BÀI {formattedOrder}</span>
              {totalPages > 0 && (
                <span className="text-[#1E3A8A]/70 dark:text-purple-300/60 font-semibold">/ {String(totalPages).padStart(2, '0')}</span>
              )}
            </div>

            {estimatedStudyMinutes > 0 && (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/90 dark:bg-purple-950/50 dark:border-purple-800/40 dark:text-purple-300 text-[11px] font-bold shrink-0">
                <Clock size={12} className="text-slate-500 dark:text-purple-400 stroke-[2.3]" />
                <span>~{estimatedStudyMinutes} phút</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Thanh Tab nhỏ Đã hiểu bài trên cùng chuẩn người dùng yêu cầu */}
            <button
              type="button"
              onClick={handleToggleCompleted}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[12px] font-bold transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0 ${
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

            {isAdmin && (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEditPageModal(true)}
                  className="flex items-center gap-1 h-7 px-2 rounded-[8px] bg-white border border-line text-ink font-bold text-[11.5px] hover:border-primary shadow-2xs"
                  title="Sửa tên bài & tóm tắt"
                >
                  <Edit2 size={12} className="text-primary" />
                  <span>Sửa</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleStatus}
                  className={`text-[11.5px] font-bold px-2 py-0.5 rounded-full border transition-all ${
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
          </div>
        </div>
        <h1 className="text-[28px] sm:text-[30px] font-extrabold text-ink leading-[1.2]">
          {currentPage.title}
        </h1>
        {currentPage.summary && (
          <p className="text-[15px] text-muted font-normal leading-relaxed mt-0.5">
            {currentPage.summary}
          </p>
        )}
      </section>

      {/* 4. Danh sách các khối */}
      {blockList.filter((b) => isAdmin || b.is_visible).length === 0 ? (
        <div className="flex flex-col gap-4">
          {renderFlipbookBlock()}
          <div className="p-8 text-center bg-white rounded-[22px] border border-line my-4">
            <p className="text-[17px] text-muted font-medium">
              Bài học đang được cập nhật nội dung.
            </p>
          </div>
        </div>
      ) : videoBlock ? (
        <div className="flex flex-col gap-4">
          {/* Vị trí 0: Khối sách lật phía trên video nếu Admin chọn chuyển lên */}
          {flipbookOrder === 0 && renderFlipbookBlock()}

          {/* Khối video là trung tâm lớp học EdTech (chứa 3 tab: Giáo trình, Tóm tắt cốt lõi, Tài liệu) */}
          {renderBlockItem(videoBlock, blockList.indexOf(videoBlock), false)}

          {/* Vị trí 1 (Mặc định): Khối sách lật 3D độc lập ngay dưới danh sách bài học */}
          {flipbookOrder === 1 && renderFlipbookBlock()}

          {/* Các khối khác (nếu có khối nào không thuộc text / resource / videoBlock) */}
          {blockList
            .filter(
              (b) =>
                b.id !== videoBlock.id &&
                b.type !== 'text' &&
                b.type !== 'files' &&
                b.type !== 'links' &&
                b.type !== 'images' &&
                b.type !== 'comparison'
            )
            .map((b) => renderBlockItem(b, blockList.indexOf(b), false))}

          {/* Vị trí 2: Khối sách lật ở cuối cùng */}
          {flipbookOrder === 2 && renderFlipbookBlock()}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {flipbookOrder === 0 && renderFlipbookBlock()}
          {blockList.map((block, idx) => renderBlockItem(block, idx, false))}
          {flipbookOrder > 0 && renderFlipbookBlock()}
        </div>
      )}

      {/* 5. Nút "+ Thêm nội dung" (Hiện khi ở chế độ Admin) */}
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

      {/* 6. Bài học liên quan trong chuyên đề (hiển thị đúng vị trí điều hướng cuối trang, không đặt lẫn vào tab Tài liệu) */}
      {relatedLinksBlock && (
        <section className="flex flex-col gap-2 mt-2">
          {renderBlockItem(relatedLinksBlock, blockList.indexOf(relatedLinksBlock), false)}
        </section>
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
            className="flex items-center justify-between p-3 sm:p-3.5 rounded-[16px] bg-[#0068FF]/[0.06] dark:bg-[#0068FF]/[0.12] border-[1.5px] border-[#0068FF]/30 dark:border-[#0068FF]/40 hover:border-[#0068FF] transition-all shadow-2xs mt-1.5 group active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-10 h-10 rounded-[12px] bg-[#0068FF] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#0068FF]/30 font-black text-[13.5px] tracking-tight">
                Zalo
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-[13px] sm:text-[13.5px] font-black text-slate-900 dark:text-white leading-tight">
                  Cần tư vấn về cơ thể?
                </span>
                <span className="text-[11.5px] font-semibold text-[#0068FF] dark:text-[#60A5FA] leading-tight mt-0.5">
                  Nhắn tin trao đổi qua Zalo
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0068FF] group-hover:bg-[#0055d4] text-white text-[12px] font-black shadow-sm shadow-[#0068FF]/25 shrink-0 ml-2 transition-colors">
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
              <Link
                href={`/${topic.slug}/${prevPage.slug}`}
                prefetch={true}
                onClick={playTapSound}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-[10px] bg-slate-100 dark:bg-[#1E1438] border border-slate-300/90 dark:border-purple-700/60 hover:bg-slate-200 dark:hover:bg-[#281A4E] text-slate-800 dark:text-white transition-all shadow-xs group active:scale-[0.98] h-[36px] overflow-hidden"
              >
                <ArrowLeft size={13} strokeWidth={2.5} className="shrink-0 text-slate-500 dark:text-purple-300 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-[11.5px] sm:text-[12px] font-bold truncate">
                  Bài {String(prevPageIndex).padStart(2, '0')}: {prevPage.title}
                </span>
              </Link>
            ) : (
              <Link
                href={`/${topic.slug}`}
                prefetch={true}
                onClick={playTapSound}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-[10px] bg-slate-100 dark:bg-[#1E1438] border border-slate-300/90 dark:border-purple-700/60 hover:bg-slate-200 dark:hover:bg-[#281A4E] text-slate-800 dark:text-white transition-all shadow-xs group active:scale-[0.98] h-[36px] overflow-hidden"
              >
                <ArrowLeft size={13} strokeWidth={2.5} className="shrink-0 text-slate-500 dark:text-purple-300 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-[11.5px] sm:text-[12px] font-bold truncate">
                  Về danh sách
                </span>
              </Link>
            )}

            {/* Nút Khung chữ nhật Bài tiếp theo - 1 dòng siêu gọn */}
            {nextPage ? (
              <Link
                href={`/${topic.slug}/${nextPage.slug}`}
                prefetch={true}
                onClick={playTapSound}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-[10px] bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-sm shadow-indigo-500/20 border border-indigo-400/40 hover:brightness-105 transition-all group active:scale-[0.98] h-[36px] overflow-hidden"
              >
                <span className="text-[11.5px] sm:text-[12px] font-bold text-white truncate">
                  Bài {String(nextPageIndex).padStart(2, '0')}: {nextPage.title}
                </span>
                <ArrowRight size={13} strokeWidth={2.5} className="shrink-0 text-white group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <Link
                href={`/${topic.slug}`}
                prefetch={true}
                onClick={playTapSound}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-[10px] bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-sm shadow-emerald-500/20 border border-emerald-400/40 hover:brightness-105 transition-all group active:scale-[0.98] h-[36px] overflow-hidden"
              >
                <span className="text-[11.5px] sm:text-[12px] font-bold text-white truncate">
                  Hoàn thành bài
                </span>
                <CheckCircle2 size={14} strokeWidth={2.5} className="shrink-0 text-white" />
              </Link>
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
              className="text-[#8A3A14] dark:text-[#F8DF7B] font-bold py-1 hover:underline cursor-pointer"
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
