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
  RotateCcw,
} from 'lucide-react';
import { Topic, Page, Block, Video } from '../lib/types';
import PageHeaderBar, { TocItem } from './PageHeaderBar';
import BlockRenderer from './BlockRenderer';
import AdminBar from './admin/AdminBar';
import EditBlockModal from './admin/EditBlockModal';
import VideoManagerModal from './admin/VideoManagerModal';
import AddBlockDrawer from './admin/AddBlockDrawer';
import { checkIsAdminClient, setAdminClient } from '../lib/adminAuth';
import {
  getStoredBlocks,
  saveStoredBlocks,
  resetStoredBlocks,
  getStoredPageStatus,
  saveStoredPageStatus,
} from '../lib/storage';

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
  const [fontSizeMode, setFontSizeMode] = useState<'normal' | 'large'>('normal');
  const [isAdmin, setIsAdmin] = useState(false);
  const [pageStatus, setPageStatus] = useState<'draft' | 'published'>(page.status);
  const [blockList, setBlockList] = useState<Block[]>(initialBlocks);

  // Modals
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [showVideoManager, setShowVideoManager] = useState(false);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [activeMenuBlockId, setActiveMenuBlockId] = useState<string | null>(null);

  // Đọc dữ liệu từ localStorage khi client mount
  useEffect(() => {
    try {
      // 1. Cỡ chữ
      const savedFontSize = localStorage.getItem('co_chu');
      if (savedFontSize === 'large' || savedFontSize === 'lon') {
        setFontSizeMode('large');
      }

      // 2. Quyền Admin
      setIsAdmin(checkIsAdminClient());

      // 3. Trạng thái trang
      setPageStatus(getStoredPageStatus(page.id, page.status));

      // 4. Khối nội dung đã sửa
      const loadedBlocks = getStoredBlocks(page.id, initialBlocks);
      setBlockList(loadedBlocks);
    } catch {
      // Bỏ qua lỗi truy cập client storage
    }
  }, [page.id, initialBlocks, page.status]);

  const handleFontSizeChange = (mode: 'normal' | 'large') => {
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

  const handleToggleStatus = () => {
    const nextStatus = pageStatus === 'published' ? 'draft' : 'published';
    setPageStatus(nextStatus);
    saveStoredPageStatus(page.id, nextStatus);
  };

  // Di chuyển khối lên
  const handleMoveBlockUp = (index: number) => {
    if (index === 0) return;
    const updated = [...blockList];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setBlockList(updated);
    saveStoredBlocks(page.id, updated);
  };

  // Di chuyển khối xuống
  const handleMoveBlockDown = (index: number) => {
    if (index === blockList.length - 1) return;
    const updated = [...blockList];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setBlockList(updated);
    saveStoredBlocks(page.id, updated);
  };

  // Xóa khối
  const handleDeleteBlock = (blockId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khối nội dung này?')) return;
    const updated = blockList.filter((b) => b.id !== blockId);
    setBlockList(updated);
    saveStoredBlocks(page.id, updated);
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
    saveStoredBlocks(page.id, updated);
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
    saveStoredBlocks(page.id, updated);
    setActiveMenuBlockId(null);
  };

  // Lưu khối sau khi sửa
  const handleSaveBlock = (updatedBlock: Block) => {
    const updated = blockList.map((b) => (b.id === updatedBlock.id ? updatedBlock : b));
    setBlockList(updated);
    saveStoredBlocks(page.id, updated);
  };

  // Thêm khối mới
  const handleAddBlock = (newBlock: Block) => {
    const updated = [...blockList, newBlock];
    setBlockList(updated);
    saveStoredBlocks(page.id, updated);
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
    saveStoredBlocks(page.id, updated);
  };

  // Khôi phục mặc định
  const handleResetToDefault = () => {
    if (confirm('Khôi phục toàn bộ khối về dữ liệu ban đầu?')) {
      resetStoredBlocks(page.id);
      setBlockList(initialBlocks);
    }
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
    <main className="flex-1 flex flex-col px-5 pt-2 pb-16 gap-5">
      {/* 1. Thanh công cụ Admin trên cùng nếu đang bật chế độ sửa */}
      {isAdmin && (
        <AdminBar
          onExitAdmin={handleToggleAdmin}
          status={pageStatus}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* 2. Thanh điều hướng trang: ‹ [Chủ đề] + [Mục lục] + [⋮] */}
      <PageHeaderBar
        topicTitle={topic.title}
        topicSlug={topic.slug}
        tocItems={tocItems}
        fontSizeMode={fontSizeMode}
        onFontSizeChange={handleFontSizeChange}
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
      />

      {/* 3. Phần đầu bài viết: Dòng nhỏ CỘT SỐNG · 01 + Tiêu đề lớn */}
      <section className="flex flex-col gap-1.5 mt-1">
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-extrabold tracking-[0.5px] uppercase text-muted">
            {topic.title.toUpperCase()} · {formattedOrder}
          </span>
          {isAdmin && (
            <span
              className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${
                pageStatus === 'published'
                  ? 'bg-[#E6F2EF] text-[#0A4F43]'
                  : 'bg-[#FFF1E6] text-[#8A3A14]'
              }`}
            >
              {pageStatus === 'published' ? 'Đang hiện' : 'Bản nháp'}
            </span>
          )}
        </div>
        <h1 className="text-[30px] font-extrabold text-ink leading-[1.2]">
          {page.title}
        </h1>
      </section>

      {/* 4. Danh sách các khối */}
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
                  ? 'p-2.5 rounded-[24px] border-2 border-dashed border-[#2D5B94]/30 bg-white/40'
                  : ''
              } ${!block.is_visible ? 'opacity-50' : ''}`}
            >
              {/* Thanh điều khiển của Admin trên từng khối (Đúng như Screenshot 1) */}
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
              />
            </div>
          );
        })}
      </div>

      {/* 5. Nút "+ Thêm nội dung" (Hiện khi ở chế độ Admin - Đúng như Screenshot 1) */}
      {isAdmin && (
        <div className="flex flex-col gap-2 mt-2">
          <button
            type="button"
            onClick={() => setShowAddDrawer(true)}
            className="flex items-center justify-center gap-2 h-[56px] min-h-[48px] w-full rounded-[18px] border-2 border-dashed border-primary bg-primary-soft/30 text-primary font-extrabold text-[18px] transition-transform active:scale-[0.98] shadow-2xs hover:bg-primary-soft/50"
          >
            <Plus size={22} strokeWidth={2.5} />
            <span>Thêm nội dung</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="self-center flex items-center gap-1.5 text-[14px] text-muted hover:text-ink font-semibold mt-1 py-1"
          >
            <RotateCcw size={14} />
            <span>Khôi phục dữ liệu mẫu ban đầu</span>
          </button>
        </div>
      )}

      {/* 6. Cuối trang: Gợi ý theo lộ trình + Nút Tiếp theo */}
      <section className="flex flex-col gap-2 mt-6 pt-4 border-t border-line/60">
        <p className="text-[16px] text-muted font-medium">
          Gợi ý theo lộ trình
        </p>

        {nextPage ? (
          <Link
            href={`/${topic.slug}/${nextPage.slug}`}
            className="flex items-center justify-center gap-2.5 h-[64px] min-h-[48px] w-full rounded-[18px] bg-primary text-white font-extrabold text-[20px] transition-transform active:scale-[0.98] shadow-sm"
          >
            <span>
              Tiếp theo: {String(nextPageIndex).padStart(2, '0')} {nextPage.title}
            </span>
            <ArrowRight size={22} strokeWidth={2.5} />
          </Link>
        ) : (
          <Link
            href={`/${topic.slug}`}
            className="flex items-center justify-center gap-2.5 h-[64px] min-h-[48px] w-full rounded-[18px] bg-primary text-white font-extrabold text-[20px] transition-transform active:scale-[0.98] shadow-sm"
          >
            <span>Về danh sách {topic.title}</span>
            <ArrowRight size={22} strokeWidth={2.5} />
          </Link>
        )}
      </section>

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
    </main>
  );
}
