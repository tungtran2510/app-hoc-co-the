'use client';

import React from 'react';
import { Edit3, Eye, FileEdit } from 'lucide-react';

interface AdminBarProps {
  onExitAdmin: () => void;
  status: 'draft' | 'published';
  onToggleStatus: () => void;
}

export default function AdminBar({
  onExitAdmin,
  status,
  onToggleStatus,
}: AdminBarProps) {
  const isPublished = status === 'published';

  return (
    <div className="sticky top-0 left-0 right-0 z-50 bg-[#111A24] text-white px-4 py-2.5 flex items-center justify-between shadow-md -mx-5 -mt-2 mb-3">
      {/* Bên trái: Trạng thái đang sửa */}
      <div className="flex items-center gap-2">
        <Edit3 size={18} className="text-[#F2B38A]" />
        <span className="text-[16px] font-bold text-white tracking-wide">
          Đang sửa trang này
        </span>
      </div>

      {/* Bên phải: Nút Xong */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleStatus}
          className={`flex items-center gap-1.5 h-[36px] px-3 rounded-full text-[14px] font-bold transition-all ${
            isPublished
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-[#FFF1E6] text-[#8A3A14]'
          }`}
          title="Bấm để đổi trạng thái trang"
        >
          {isPublished ? (
            <>
              <Eye size={15} />
              <span>Đang hiện</span>
            </>
          ) : (
            <>
              <FileEdit size={15} />
              <span>Bản nháp</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onExitAdmin}
          className="h-[36px] px-4 rounded-full bg-primary hover:bg-primary-dark text-white font-extrabold text-[15px] transition-transform active:scale-95 shadow-xs"
        >
          Xong
        </button>
      </div>
    </div>
  );
}
