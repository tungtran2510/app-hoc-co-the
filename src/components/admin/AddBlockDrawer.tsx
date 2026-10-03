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
  Columns2,
  Code,
} from 'lucide-react';
import { Block } from '../../lib/types';
import { generateUuid } from '../../lib/uuid';

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
    const id = generateUuid();
    let newBlock: Block;

    if (type === 'text') {
      let defaultLines = ['Nội dung mới của khối này. Bấm nút Sửa để thay đổi chữ.'];
      let format: 'paragraph' | 'numbered' | 'bullet' = 'paragraph';
      let title: string | undefined = undefined;
      let title_color: string | undefined = undefined;
      let mode: 'text' | 'html' = displayStyle === 'html' ? 'html' : 'text';
      let html: string | undefined = undefined;

      if (displayStyle === 'html') {
        title = 'Khối HTML tùy biến';
        title_color = '#1E293B';
        mode = 'html';
        html = `<div style="background: linear-gradient(135deg, #fdfbf7 0%, #fef3c7 100%); border-left: 4px solid #d97706; padding: 14px 16px; border-radius: 12px; margin: 8px 0;">\n  <div style="font-weight: 700; color: #92400e; margin-bottom: 4px;">💡 Điểm cốt lõi cần nhớ</div>\n  <p style="margin: 0; color: #78350f; line-height: 1.6; font-size: 15px;">Nội dung giải thích chi tiết, định dạng HTML chuyên nghiệp và dễ tùy biến.</p>\n</div>`;
        defaultLines = ['Khối nội dung HTML tùy biến'];
      } else if (displayStyle === 'diem_can_nho') {
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
          title,
          title_color,
          mode,
          html,
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
    } else if (type === 'comparison') {
      newBlock = {
        id,
        page_id: pageId,
        type: 'comparison',
        display_style: 'two_column',
        sort_order: nextSortOrder,
        is_visible: true,
        data: {
          left_title: 'Nên làm / Đốt sống khỏe',
          left_lines: [
            'Ngồi thẳng lưng, giữ vai thả lỏng',
            'Đổi tư thế sau mỗi 30–45 phút',
            'Uống đủ nước để nuôi dưỡng đĩa đệm',
          ],
          right_title: 'Tránh làm / Nguy cơ thoái hóa',
          right_lines: [
            'Cúi gập cổ nhìn điện thoại quá lâu',
            'Ngồi vắt chéo chân hoặc gù lưng',
            'Mang vác vật nặng sai tư thế',
          ],
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
      <div className="w-full max-w-[480px] max-h-[85vh] bg-white dark:bg-[#160E2E] rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 border dark:border-white/10">
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
            className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-ink cursor-pointer"
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
                className="flex items-center gap-2.5 p-3 rounded-[16px] bg-[#E6F2EF] dark:bg-[#062D26] text-[#0A4F43] dark:text-[#5EEAD4] transition-all text-left font-bold text-[15px] border border-[#0E6B5A]/20 dark:border-teal-500/40"
              >
                <Lightbulb size={20} className="text-[#0E6B5A] dark:text-[#5EEAD4] shrink-0" />
                <span>Ý nghĩa</span>
              </button>
              <button
                type="button"
                onClick={() => createAndAdd('text', 'diem_can_nho')}
                className="flex items-center gap-2.5 p-3 rounded-[16px] bg-[#EDE9FE] dark:bg-[#2E1065] text-[#581C87] dark:text-[#E9D5FF] transition-all text-left font-bold text-[15px] border border-[#581C87]/20 dark:border-purple-500/40"
              >
                <SquareCheck size={20} className="text-[#581C87] dark:text-[#E9D5FF] shrink-0" />
                <span>Điểm cần nhớ</span>
              </button>
              <button
                type="button"
                onClick={() => createAndAdd('text', 'chu_y')}
                className="flex items-center gap-2.5 p-3 rounded-[16px] bg-[#FFF1E6] dark:bg-[#381A0B] text-[#8A3A14] dark:text-[#FDBA74] transition-all text-left font-bold text-[15px] border border-[#B4501F]/20 dark:border-orange-500/40"
              >
                <TriangleAlert size={20} className="text-[#B4501F] dark:text-[#FDBA74] shrink-0" />
                <span>Chú ý</span>
              </button>
              <button
                type="button"
                onClick={() => createAndAdd('text', 'sai_lam')}
                className="flex items-center gap-2.5 p-3 rounded-[16px] bg-[#FBE7E1] dark:bg-[#38110D] text-[#7A2F12] dark:text-[#FCA5A5] transition-all text-left font-bold text-[15px] border border-[#9B3B32]/20 dark:border-red-500/40"
              >
                <CircleX size={20} className="text-[#9B3B32] dark:text-[#FCA5A5] shrink-0" />
                <span>Sai lầm thường gặp</span>
              </button>
              <button
                type="button"
                onClick={() => createAndAdd('text', 'giai_phap')}
                className="flex items-center gap-2.5 p-3 rounded-[16px] bg-[#EDF3E4] dark:bg-[#1E2E0E] text-[#3C5420] dark:text-[#BEF264] transition-all text-left font-bold text-[15px] border border-[#4E6B2A]/20 dark:border-lime-500/40"
              >
                <Wrench size={20} className="text-[#4E6B2A] dark:text-[#BEF264] shrink-0" />
                <span>Giải pháp</span>
              </button>
              <button
                type="button"
                onClick={() => createAndAdd('comparison', 'two_column')}
                className="col-span-2 flex items-center justify-center gap-2.5 p-3 rounded-[16px] bg-gradient-to-r from-[#E6F2EF] to-[#FBE7E1] dark:from-[#062D26]/80 dark:to-[#38110D]/80 hover:opacity-95 transition-all font-bold text-[15px] border border-line dark:border-purple-500/40 shadow-2xs"
              >
                <Columns2 size={20} className="text-primary dark:text-[#C4B5FD] shrink-0" />
                <span className="text-ink dark:text-white">So sánh 2 mặt (Đúng – Sai / Khỏe – Bệnh)</span>
              </button>
              <button
                type="button"
                onClick={() => createAndAdd('text', 'html')}
                className="col-span-2 flex items-center justify-center gap-2.5 p-3 rounded-[16px] bg-gradient-to-r from-purple-50 to-amber-50 dark:from-purple-950/60 dark:to-amber-950/60 hover:opacity-95 transition-all font-bold text-[15px] border border-purple-200 dark:border-purple-500/40 shadow-2xs"
              >
                <Code size={20} className="text-primary dark:text-purple-300 shrink-0" />
                <span className="text-ink dark:text-white">Khối HTML tùy biến (Rich HTML)</span>
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
