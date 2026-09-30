'use client';

import React, { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Block, Image as ImageType, FileItem } from '../../lib/types';
import { DEFAULT_BLOCK_STYLES } from '../../lib/blockStyles';

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

  // State cho images block
  const [imageList, setImageList] = useState<ImageType[]>(
    block.type === 'images' ? [...block.data.images] : []
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');

  // State cho files block
  const [fileList, setFileList] = useState<FileItem[]>(
    block.type === 'files' ? [...block.data.files] : []
  );
  const [newFileName, setNewFileName] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');

  if (!isOpen) return null;

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

  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      alert('Vui lòng nhập đường dẫn hình ảnh');
      return;
    }
    setImageList([
      ...imageList,
      {
        url: newImageUrl.trim(),
        caption: newImageCaption.trim() || undefined,
      },
    ]);
    setNewImageUrl('');
    setNewImageCaption('');
  };

  const handleAddFile = () => {
    if (!newFileName.trim() || !newFileUrl.trim()) {
      alert('Vui lòng nhập tên tài liệu và đường dẫn file');
      return;
    }
    setFileList([
      ...fileList,
      {
        name: newFileName.trim(),
        url: newFileUrl.trim(),
        size_bytes: 2500000,
      },
    ]);
    setNewFileName('');
    setNewFileUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-[480px] max-h-[90vh] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-line">
          <h3 className="text-[20px] font-extrabold text-ink">
            Chỉnh sửa khối nội dung
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-ink"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {/* Sửa khối Chữ (Text) */}
          {block.type === 'text' && (
            <>
              {/* Chọn kiểu khối chữ */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[15px] font-bold text-ink">
                  Kiểu hiển thị khối
                </label>
                <select
                  value={displayStyle}
                  onChange={(e) => setDisplayStyle(e.target.value)}
                  className="w-full h-[48px] px-3 rounded-[14px] bg-white border border-line text-[16px] text-ink font-semibold focus:border-primary"
                >
                  <option value="van_ban">Văn bản thông thường (không nhãn)</option>
                  <option value="y_nghia">Ý NGHĨA (nền ngọc nhạt)</option>
                  <option value="diem_can_nho">ĐIỂM CẦN NHỚ (nền xanh dương nhạt)</option>
                  <option value="chu_y">CHÚ Ý (nền cam nhạt)</option>
                  <option value="sai_lam">SAI LẦM THƯỜNG GẶP (nền đỏ nhạt)</option>
                  <option value="giai_phap">GIẢI PHÁP · ỨNG DỤNG (nền xanh lá nhạt)</option>
                </select>
              </div>

              {/* Chọn định dạng danh sách */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[15px] font-bold text-ink">
                  Định dạng danh sách
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTextFormat('paragraph')}
                    className={`h-11 rounded-[12px] font-bold text-[14px] ${
                      textFormat === 'paragraph'
                        ? 'bg-primary text-white'
                        : 'bg-surface-2 text-ink border border-line'
                    }`}
                  >
                    Đoạn văn
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextFormat('numbered')}
                    className={`h-11 rounded-[12px] font-bold text-[14px] ${
                      textFormat === 'numbered'
                        ? 'bg-primary text-white'
                        : 'bg-surface-2 text-ink border border-line'
                    }`}
                  >
                    Số thứ tự 1,2,3
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextFormat('bullet')}
                    className={`h-11 rounded-[12px] font-bold text-[14px] ${
                      textFormat === 'bullet'
                        ? 'bg-primary text-white'
                        : 'bg-surface-2 text-ink border border-line'
                    }`}
                  >
                    Dấu chấm •
                  </button>
                </div>
              </div>

              {/* Nội dung dòng chữ */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[15px] font-bold text-ink flex items-center justify-between">
                  <span>Nội dung (mỗi dòng 1 ý)</span>
                  <span className="text-[13px] text-muted font-normal">Hỗ trợ **chữ đậm**</span>
                </label>
                <textarea
                  rows={6}
                  value={textLines}
                  onChange={(e) => setTextLines(e.target.value)}
                  placeholder="Nhập nội dung vào đây..."
                  className="w-full p-3.5 rounded-[16px] border border-line text-[16px] text-ink leading-relaxed focus:border-primary"
                />
              </div>
            </>
          )}

          {/* Sửa khối Ảnh (Images) */}
          {block.type === 'images' && (
            <div className="flex flex-col gap-4">
              <label className="text-[15px] font-bold text-ink">
                Danh sách hình ảnh ({imageList.length})
              </label>

              <div className="flex flex-col gap-2">
                {imageList.map((img, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-[14px] bg-surface-2 border border-line"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt=""
                      className="w-14 h-14 rounded-[10px] object-cover bg-white"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-ink truncate">
                        {img.caption || img.url}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageList(imageList.filter((_, i) => i !== idx))}
                      className="p-2 text-[#7A2F12] hover:bg-[#FBE7E1] rounded-lg"
                      aria-label="Xóa ảnh"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Thêm ảnh mới */}
              <div className="flex flex-col gap-2 p-3.5 rounded-[16px] border border-line bg-white">
                <span className="text-[14px] font-bold text-ink">Thêm ảnh mới</span>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Dán đường dẫn ảnh (URL)..."
                  className="w-full h-11 px-3 rounded-[10px] border border-line text-[15px]"
                />
                <input
                  type="text"
                  value={newImageCaption}
                  onChange={(e) => setNewImageCaption(e.target.value)}
                  placeholder="Chú thích ảnh (tùy chọn)..."
                  className="w-full h-11 px-3 rounded-[10px] border border-line text-[15px]"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="flex items-center justify-center gap-1.5 h-11 rounded-[10px] bg-primary text-white font-bold text-[14px] mt-1"
                >
                  <Plus size={16} />
                  <span>Thêm ảnh</span>
                </button>
              </div>
            </div>
          )}

          {/* Sửa khối Files */}
          {block.type === 'files' && (
            <div className="flex flex-col gap-4">
              <label className="text-[15px] font-bold text-ink">
                Danh sách tài liệu ({fileList.length})
              </label>

              <div className="flex flex-col gap-2">
                {fileList.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-[14px] bg-surface-2 border border-line"
                  >
                    <span className="text-[15px] font-bold text-ink truncate max-w-[280px]">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFileList(fileList.filter((_, i) => i !== idx))}
                      className="p-2 text-[#7A2F12]"
                      aria-label="Xóa file"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 p-3.5 rounded-[16px] border border-line bg-white">
                <span className="text-[14px] font-bold text-ink">Thêm tài liệu PDF mới</span>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Tên tài liệu (ví dụ: Chăm sóc cột sống.pdf)"
                  className="w-full h-11 px-3 rounded-[10px] border border-line text-[15px]"
                />
                <input
                  type="url"
                  value={newFileUrl}
                  onChange={(e) => setNewFileUrl(e.target.value)}
                  placeholder="Đường dẫn file PDF..."
                  className="w-full h-11 px-3 rounded-[10px] border border-line text-[15px]"
                />
                <button
                  type="button"
                  onClick={handleAddFile}
                  className="flex items-center justify-center gap-1.5 h-11 rounded-[10px] bg-primary text-white font-bold text-[14px] mt-1"
                >
                  <Plus size={16} />
                  <span>Thêm tài liệu</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t border-line flex items-center justify-end gap-3 bg-surface">
          <button
            type="button"
            onClick={onClose}
            className="h-[52px] min-h-[48px] px-5 rounded-[14px] bg-surface-2 text-ink font-bold text-[16px]"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center justify-center gap-2 h-[52px] min-h-[48px] px-7 rounded-[14px] bg-primary text-white font-extrabold text-[16px] shadow-sm"
          >
            <Save size={18} />
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
