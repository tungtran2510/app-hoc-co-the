'use client';

import React from 'react';
import {
  X,
  Image as ImageIcon,
  Images,
  Video,
  ListVideo,
  FileText,
  Lightbulb,
  SquareCheck,
  TriangleAlert,
  CircleX,
  Wrench,
  Link2,
  ExternalLink,
  FileArchive,
} from 'lucide-react';
import { Block } from '../../lib/types';

interface AddBlockDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pageId: string;
  onAddBlock: (newBlock: Block) => void;
  nextSortOrder: number;
}

export default function AddBlockDrawer({
  isOpen,
  onClose,
  pageId,
  onAddBlock,
  nextSortOrder,
}: AddBlockDrawerProps) {
  if (!isOpen) return null;

  const createAndAdd = (type: Block['type'], displayStyle: string) => {
    const id = `block-custom-${Date.now()}`;
    let newBlock: Block;

    if (type === 'text') {
      let defaultLines = ['Nội dung mới của khối này. Bấm nút Sửa để thay đổi chữ.'];
      let format: 'paragraph' | 'numbered' | 'bullet' = 'paragraph';

      if (displayStyle === 'diem_can_nho') {
        format = 'numbered';
        defaultLines = ['Ý quan trọng thứ nhất.', 'Ý quan trọng thứ hai.'];
      } else if (displayStyle === 'giai_phap') {
        format = 'bullet';
        defaultLines = ['Hành động ứng dụng cụ thể.', 'Thói quen duy trì mỗi ngày.'];
      }

      newBlock = {
        id,
        page_id: pageId,
        type: 'text',
        display_style: displayStyle,
        sort_order: nextSortOrder,
        is_visible: true,
        data: {
          lines: defaultLines,
          format,
        },
      };
    } else if (type === 'videos') {
      newBlock = {
        id,
        page_id: pageId,
        type: 'videos',
        display_style: displayStyle as 'single' | 'playlist',
        sort_order: nextSortOrder,
        is_visible: true,
        data: {
          videos: [
            {
              youtube_id: '',
              title: 'Video mẫu mới',
              duration_text: '5 phút',
              description: 'Bấm Quản lý danh sách video để dán link YouTube.',
            },
          ],
        },
      };
    } else if (type === 'images') {
      newBlock = {
        id,
        page_id: pageId,
        type: 'images',
        display_style: displayStyle as 'single' | 'gallery',
        sort_order: nextSortOrder,
        is_visible: true,
        data: {
          images: [
            {
              url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
              caption: 'Hình ảnh giải phẫu minh họa',
            },
          ],
        },
      };
    } else if (type === 'links') {
      newBlock = {
        id,
        page_id: pageId,
        type: 'links',
        display_style: displayStyle as 'related' | 'external',
        sort_order: nextSortOrder,
        is_visible: true,
        data: {
          items:
            displayStyle === 'related'
              ? [{ page_id: 'page-cot-song-2', label: 'Cột sống · 02 Đĩa đệm' }]
              : [{ url: 'https://moh.gov.vn', label: 'Cổng thông tin Bộ Y tế' }],
        },
      };
    } else {
      newBlock = {
        id,
        page_id: pageId,
        type: 'files',
        display_style: 'pdf',
        sort_order: nextSortOrder,
        is_visible: true,
        data: {
          files: [
            {
              name: 'Tài liệu hướng dẫn thực hành.pdf',
              url: '#',
              size_bytes: 1800000,
            },
          ],
        },
      };
    }

    onAddBlock(newBlock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-[480px] max-h-[85vh] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Nút kéo */}
        <div className="w-12 h-1.5 bg-line-strong rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-line">
          <div>
            <h3 className="text-[20px] font-extrabold text-ink">
              Thêm nội dung mới
            </h3>
            <p className="text-[14px] text-muted">
              Chọn 1 trong 13 dạng khối nội dung dưới đây
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-ink"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Groups */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
          {/* Nhóm 1: Hình ảnh & Video */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[13px] font-extrabold tracking-[0.5px] uppercase text-muted">
              HÌNH ẢNH & VIDEO
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => createAndAdd('images', 'single')}
                className="flex items-center gap-2.5 p-3 rounded-[16px] bg-surface-2 hover:bg-primary-soft hover:text-primary transition-all text-left font-bold text-[15px] border border-line"
              >
                <ImageIcon size={20} className="text-primary shrink-0" />
                <span>Ảnh đơn</span>
              </button>
              <button
                type="button"
                onClick={() => createAndAdd('images', 'gallery')}
                className="flex items-center gap-2.5 p-3 rounded-[16px] bg-surface-2 hover:bg-primary-soft hover:text-primary transition-all text-left font-bold text-[15px] border border-line"
              >
                <Images size={20} className="text-primary shrink-0" />
                <span>Bộ sưu tập ảnh</span>
              </button>
              <button
                type="button"
                onClick={() => createAndAdd('videos', 'single')}
                className="flex items-center gap-2.5 p-3 rounded-[16px] bg-surface-2 hover:bg-primary-soft hover:text-primary transition-all text-left font-bold text-[15px] border border-line"
              >
                <Video size={20} className="text-primary shrink-0" />
                <span>Video đơn</span>
              </button>
              <button
                type="button"
                onClick={() => createAndAdd('videos', 'playlist')}
                className="flex items-center gap-2.5 p-3 rounded-[16px] bg-surface-2 hover:bg-primary-soft hover:text-primary transition-all text-left font-bold text-[15px] border border-line"
              >
                <ListVideo size={20} className="text-primary shrink-0" />
                <span>Danh sách video</span>
              </button>
            </div>
          </div>

          {/* Nhóm 2: Nội dung */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[13px] font-extrabold tracking-[0.5px] uppercase text-muted">
              NỘI DUNG
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => createAndAdd('text', 'van_ban')}
                className="flex items-center gap-2.5 p-3 rounded-[16px] bg-surface-2 hover:bg-primary-soft hover:text-primary transition-all text-left font-bold text-[15px] border border-line"
              >
                <FileText size={20} className="text-ink shrink-0" />
                <span>Văn bản</span>
              </button>
              <button
                type="button"
                onClick={() => createAndAdd('text', 'y_nghia')}
                className="flex items-center gap-2.5 p-3 rounded-[16px] bg-[#E6F2EF] text-[#0A4F43] transition-all text-left font-bold text-[15px] border border-[#0E6B5A]/20"
              >
                <Lightbulb size={20} className="text-[#0E6B5A] shrink-0" />
                <span>Ý nghĩa</span>
              </button>
              <button
                type="button"
                onClick={() => createAndAdd('text', 'diem_can_nho')}
                className="flex items-center gap-2.5 p-3 rounded-[16px] bg-[#E3ECF7] text-[#244A78] transition-all text-left font-bold text-[15px] border border-[#2D5B94]/20"
              >
                <SquareCheck size={20} className="text-[#2D5B94] shrink-0" />
                <span>Điểm cần nhớ</span>
              </button>
              <button
                type="button"
                onClick={() => createAndAdd('text', 'chu_y')}
                className="flex items-center gap-2.5 p-3 rounded-[16px] bg-[#FFF1E6] text-[#8A3A14] transition-all text-left font-bold text-[15px] border border-[#B4501F]/20"
              >
                <TriangleAlert size={20} className="text-[#B4501F] shrink-0" />
                <span>Chú ý</span>
              </button>
              <button
                type="button"
                onClick={() => createAndAdd('text', 'sai_lam')}
                className="flex items-center gap-2.5 p-3 rounded-[16px] bg-[#FBE7E1] text-[#7A2F12] transition-all text-left font-bold text-[15px] border border-[#9B3B32]/20"
              >
                <CircleX size={20} className="text-[#9B3B32] shrink-0" />
                <span>Sai lầm thường gặp</span>
              </button>
              <button
                type="button"
                onClick={() => createAndAdd('text', 'giai_phap')}
                className="flex items-center gap-2.5 p-3 rounded-[16px] bg-[#EDF3E4] text-[#3C5420] transition-all text-left font-bold text-[15px] border border-[#4E6B2A]/20"
              >
                <Wrench size={20} className="text-[#4E6B2A] shrink-0" />
                <span>Giải pháp</span>
              </button>
            </div>
          </div>

          {/* Nhóm 3: Liên kết & Tài liệu */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[13px] font-extrabold tracking-[0.5px] uppercase text-muted">
              LIÊN KẾT & TÀI LIỆU
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => createAndAdd('links', 'related')}
                className="flex items-center gap-2.5 p-3 rounded-[16px] bg-surface-2 hover:bg-primary-soft hover:text-primary transition-all text-left font-bold text-[15px] border border-line"
              >
                <Link2 size={20} className="text-primary shrink-0" />
                <span>Bài liên quan</span>
              </button>
              <button
                type="button"
                onClick={() => createAndAdd('links', 'external')}
                className="flex items-center gap-2.5 p-3 rounded-[16px] bg-surface-2 hover:bg-primary-soft hover:text-primary transition-all text-left font-bold text-[15px] border border-line"
              >
                <ExternalLink size={20} className="text-primary shrink-0" />
                <span>Link ngoài</span>
              </button>
              <button
                type="button"
                onClick={() => createAndAdd('files', 'pdf')}
                className="col-span-2 flex items-center justify-center gap-2.5 p-3 rounded-[16px] bg-surface-2 hover:bg-primary-soft hover:text-primary transition-all font-bold text-[15px] border border-line"
              >
                <FileArchive size={20} className="text-primary shrink-0" />
                <span>Tài liệu (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
