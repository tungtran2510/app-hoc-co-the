'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
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
} from 'lucide-react';
import { Topic, Page, Block, Video } from '../lib/types';
import PageHeaderBar, { TocItem, FontSizeOption, ThemeModeOption } from './PageHeaderBar';
import BlockRenderer from './BlockRenderer';
import EditBlockModal from './admin/EditBlockModal';
import VideoManagerModal from './admin/VideoManagerModal';
import AddBlockDrawer from './admin/AddBlockDrawer';
import EditPageModal from './admin/EditPageModal';
import AdminSettingsModal from './admin/AdminSettingsModal';
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
} from '../lib/storage';
import {
  isPageSaved,
  toggleSavePage,
  isPageCompleted,
  togglePageCompleted,
} from '../lib/learningProgress';
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
  const [consultSettings, setConsultSettings] = useState<{ zalo_url?: string; hotline?: string } | null>(null);
  const [showPhoneSyncModal, setShowPhoneSyncModal] = useState(false);
  const [phoneSyncReason, setPhoneSyncReason] = useState<'bookmark' | 'manual'>('bookmark');

  const handleToggleBookmark = () => {
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
      } else if (mode === 'gray') {
        document.documentElement.classList.add('gray');
        document.body.classList.add('gray');
      }
    } catch {
      // Bỏ qua
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: currentPage.title,
      text: currentPage.summary || `${topic.title} - ${currentPage.title}`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Người dùng hủy chia sẻ
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareNoticeMsg('Đã chép link');
        setTimeout(() => setShareNoticeMsg(''), 3000);
      } catch {
        // Bỏ qua
      }
    }
  };

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
    setBlockList(updated);
    triggerSaveBlocks(updated);
  };

  // Di chuyển khối xuống
  const handleMoveBlockDown = (index: number) => {
    if (index === blockList.length - 1) return;
    const updated = [...blockList];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setBlockList(updated);
    triggerSaveBlocks(updated);
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
    setBlockList(updated);
    setActiveMenuBlockId(null);
  };

  // Nhân bản khối
    const handleDuplicateBlock = (index: number) => {
      const target = blockList[index];
      const duplicate: Block = {
        ...JSON.parse(JSON.stringify(target)),
        id: `block-copy-${Date.now()}`,
      };
      const updated = [...blockList];
      updated.splice(index + 1, 0, duplicate);
      setBlockList(updated);
      triggerSaveBlocks(updated);
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
      const updated = [...blockList, newBlock];
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

  return (
    <main className="flex-1 flex flex-col px-5 pt-2 pb-16 gap-4">
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
      />

      {/* 3. Phần đầu bài viết: Dòng nhỏ CỘT SỐNG · 01 + Tiêu đề lớn */}
      <section className="flex flex-col gap-1 mt-0.5">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-extrabold tracking-[0.5px] uppercase text-muted">
            {topic.title.toUpperCase()} · {formattedOrder}
          </span>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEditPageModal(true)}
                className="flex items-center gap-1 h-7 px-2.5 rounded-[8px] bg-white border border-line text-ink font-bold text-[12px] hover:border-primary shadow-2xs"
                title="Sửa tên bài & tóm tắt"
              >
                <Edit2 size={12} className="text-primary" />
                <span>Sửa bài</span>
              </button>

              <button
                type="button"
                onClick={handleToggleStatus}
                className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                  pageStatus === 'published'
                    ? 'bg-[#E6F2EF] text-[#0A4F43] border-[#0E6B5A]/30'
                    : 'bg-[#FFF1E6] text-[#8A3A14] border-[#F2B38A]'
                }`}
                title="Bấm để đổi trạng thái"
              >
                {pageStatus === 'published' ? '● Đang hiện' : '○ Bản nháp'}
              </button>
            </div>
          )}
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
        <div className="p-8 text-center bg-white rounded-[22px] border border-line my-4">
          <p className="text-[17px] text-muted font-medium">
            Bài học đang được cập nhật nội dung.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {blockList.map((block, idx) => {
            // Nếu không phải admin và khối bị ẩn thì không hiển thị
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
              className={`relative transition-all ${
                isAdmin
                  ? 'p-2.5 rounded-[22px] border-2 border-dashed border-[#2D5B94]/30 bg-white/40'
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
                      className="flex items-center gap-1 h-8 px-3 rounded-[10px] bg-white border border-line text-ink font-bold text-[13px] hover:border-primary shadow-2xs"
                    >
                      <Edit2 size={13} className="text-primary" />
                      <span>Sửa</span>
                    </button>

                    {/* Nút Di chuyển lên ▲ */}
                    <button
                      type="button"
                      onClick={() => handleMoveBlockUp(idx)}
                      disabled={idx === 0}
                      className="w-8 h-8 rounded-[10px] bg-white border border-line flex items-center justify-center text-ink disabled:opacity-30 shadow-2xs"
                      aria-label="Di chuyển khối lên"
                    >
                      <ChevronUp size={16} />
                    </button>

                    {/* Nút Di chuyển xuống ▼ */}
                    <button
                      type="button"
                      onClick={() => handleMoveBlockDown(idx)}
                      disabled={idx === blockList.length - 1}
                      className="w-8 h-8 rounded-[10px] bg-white border border-line flex items-center justify-center text-ink disabled:opacity-30 shadow-2xs"
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
                        className="w-8 h-8 rounded-[10px] bg-white border border-line flex items-center justify-center text-ink shadow-2xs"
                        aria-label="Tùy chọn khối"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Dropdown Menu ⋮ */}
                      {activeMenuBlockId === block.id && (
                        <div className="absolute right-0 top-9 w-[180px] bg-white rounded-[16px] border border-line shadow-xl py-1.5 z-50 animate-in fade-in duration-150">
                          <button
                            type="button"
                            onClick={() => handleToggleVisibility(block.id)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[14px] font-bold text-ink hover:bg-surface-2"
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
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[14px] font-bold text-ink hover:bg-surface-2"
                          >
                            <Copy size={16} />
                            <span>Nhân bản khối</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBlock(block.id)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[14px] font-bold text-[#7A2F12] hover:bg-[#FBE7E1]"
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
                pageId={page.id}
                topicSlug={topic.slug}
                topicTitle={topic.title}
                pageSlug={page.slug}
                pageTitle={currentPage.title}
                pageNumber={pageIndex}
                nextPage={
                  nextPage
                    ? {
                        slug: nextPage.slug,
                        title: nextPage.title,
                        orderNumber: nextPageIndex || 0,
                      }
                    : null
                }
              />
            </div>
          );
        })}
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

      {/* Nút Đã hiểu bài này (Tự đánh dấu 1 chạm) */}
      <div className="mt-3">
        <button
          type="button"
          onClick={handleToggleCompleted}
          className={`flex items-center justify-center gap-2.5 h-[54px] min-h-[48px] w-full rounded-[18px] border-[1.5px] font-extrabold text-[16px] transition-all active:scale-[0.98] shadow-xs cursor-pointer ${
            isCompleted
              ? 'bg-[#E6F2EF] text-[#0A4F43] border-[#0E6B5A]'
              : 'bg-white border-line text-ink hover:border-primary'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 size={22} className="text-[#0E6B5A]" />
              <span>Đã hiểu bài học này ✓</span>
            </>
          ) : (
            <>
              <Circle size={22} className="text-muted" />
              <span>Đánh dấu đã hiểu bài này</span>
            </>
          )}
        </button>
      </div>

      {/* 6. Cuối trang: Gợi ý theo lộ trình + Nút Tiếp theo + Nút Chia sẻ */}
      <section className="flex flex-col gap-2 mt-4 pt-4 border-t border-line/60">
        <p className="text-[15px] text-muted font-medium">
          Gợi ý theo lộ trình
        </p>

        {nextPage ? (
          <Link
            href={`/${topic.slug}/${nextPage.slug}`}
            prefetch={true}
            className="flex items-center justify-center gap-2 h-[58px] min-h-[48px] w-full rounded-[16px] bg-primary text-white font-extrabold text-[19px] transition-transform active:scale-[0.98] shadow-sm"
          >
            <span>
              Tiếp theo: {String(nextPageIndex).padStart(2, '0')} {nextPage.title}
            </span>
            <ArrowRight size={20} strokeWidth={2.5} />
          </Link>
        ) : (
          <Link
            href={`/${topic.slug}`}
            prefetch={true}
            className="flex items-center justify-center gap-2 h-[58px] min-h-[48px] w-full rounded-[16px] bg-primary text-white font-extrabold text-[19px] transition-transform active:scale-[0.98] shadow-sm"
          >
            <span>Về danh sách {topic.title}</span>
            <ArrowRight size={20} strokeWidth={2.5} />
          </Link>
        )}

        {/* Nút Chia sẻ trang này (Cuối trang) */}
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center justify-center gap-2 h-[52px] min-h-[48px] w-full rounded-[16px] bg-white border-[1.5px] border-line-strong text-ink font-extrabold text-[16px] transition-transform active:scale-[0.98] shadow-2xs hover:bg-surface-2 cursor-pointer mt-1"
        >
          <Share2 size={18} className="text-primary" />
          <span>Chia sẻ trang này</span>
        </button>

        {/* Thẻ tư vấn Chuyên gia / Zalo (nếu có cấu hình) */}
        {(consultSettings?.zalo_url || consultSettings?.hotline) && (
          <a
            href={consultSettings.zalo_url || `https://zalo.me/${consultSettings.hotline}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-[18px] bg-primary-soft/40 border border-primary/30 text-ink hover:border-primary transition-all shadow-2xs mt-2"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-[12px] bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                <MessageCircle size={20} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] font-extrabold text-ink leading-tight">
                  Cần tư vấn thêm về cơ thể?
                </span>
                <span className="text-[12px] text-muted leading-tight">
                  Trao đổi cùng chuyên gia qua Zalo
                </span>
              </div>
            </div>
            <span className="text-[13px] font-bold text-primary shrink-0 ml-2">
              Nhắn Zalo ›
            </span>
          </a>
        )}
      </section>

      {/* 7. Bảng điều khiển quản trị trang (Hiện khi isAdmin = true) */}
      {isAdmin && (
        <section className="flex flex-col gap-2.5 mt-6 p-4 rounded-[22px] bg-primary-soft/30 border-2 border-dashed border-primary/40">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-extrabold uppercase text-primary tracking-wider">
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
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
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
              className="flex items-center justify-center gap-1.5 h-11 rounded-[12px] bg-white border border-line text-ink font-bold text-[14px] hover:border-primary shadow-2xs"
            >
              <Plus size={16} className="text-primary" />
              <span>+ Thêm khối</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAdminSettingsModal(true)}
              className="flex items-center justify-center gap-1.5 h-11 rounded-[12px] bg-white border border-line text-ink font-bold text-[14px] hover:border-primary shadow-2xs"
            >
              <SettingsIcon size={16} className="text-primary" />
              <span>Cài đặt app</span>
            </button>
          </div>

          <div className="flex items-center justify-end pt-1 text-[13px]">
            <button
              type="button"
              onClick={handleToggleAdmin}
              className="text-[#8A3A14] font-bold py-1 hover:underline cursor-pointer"
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
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#0E6B5A] text-white font-extrabold text-[14px] shadow-lg animate-in fade-in slide-in-from-bottom-2">
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
    </main>
  );
}
