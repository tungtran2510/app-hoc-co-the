'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, ChevronLeft, ShieldCheck } from 'lucide-react';
import { setAdminClient, DEFAULT_ADMIN_PASSWORD } from '../../lib/adminAuth';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    if (password === DEFAULT_ADMIN_PASSWORD || password === 'admin123') {
      setAdminClient(true);
      // Chuyển hướng về trang nội dung để trải nghiệm chế độ sửa
      router.push('/cot-song/tong-quan-ve-cot-song');
      router.refresh();
    } else {
      setErrorMsg('Mật khẩu không đúng. Vui lòng nhập lại (Mật khẩu mặc định: admin123).');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col px-5 pt-3 pb-16 justify-between max-w-[480px] mx-auto w-full">
      {/* Nút quay lại */}
      <nav aria-label="Đường dẫn quay lại">
        <Link
          href="/"
          className="inline-flex items-center gap-1 h-[52px] min-h-[48px] text-primary text-[18px] font-bold transition-opacity active:opacity-75"
          aria-label="Quay lại Trang chủ"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
          <span>Trang chủ</span>
        </Link>
      </nav>

      <div className="flex flex-col gap-6 my-auto py-8">
        {/* Biểu tượng khóa */}
        <div className="w-20 h-20 rounded-[24px] bg-primary-soft text-primary flex items-center justify-center mx-auto shadow-xs">
          <Lock size={36} strokeWidth={2.5} />
        </div>

        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-[28px] font-extrabold text-ink leading-tight">
            Quản trị nội dung
          </h1>
          <p className="text-[17px] text-muted font-normal leading-relaxed">
            Nhập mật khẩu để bật chế độ chỉnh sửa, thêm video, hình ảnh và tài liệu.
          </p>
        </div>

        {/* Form đăng nhập */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-password"
              className="text-[16px] font-bold text-ink"
            >
              Mật khẩu quản trị
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu (mặc định: admin123)"
              className="w-full h-[58px] min-h-[48px] px-4 rounded-[18px] bg-white border-[1.5px] border-line text-[18px] text-ink placeholder:text-muted focus:outline-hidden focus:border-primary transition-colors shadow-2xs"
              autoFocus
              required
            />
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-[14px] bg-[#FBE7E1] border border-[#F2B38A] text-[#7A2F12] text-[15px] font-medium leading-snug">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 h-[62px] min-h-[48px] w-full rounded-[18px] bg-primary text-white font-extrabold text-[20px] transition-transform active:scale-[0.98] shadow-sm disabled:opacity-60 mt-2"
          >
            <span>{isSubmitting ? 'Đang kiểm tra...' : 'Vào chế độ chỉnh sửa'}</span>
            <ArrowRight size={22} strokeWidth={2.5} />
          </button>
        </form>

        {/* Thông tin hỗ trợ */}
        <div className="flex items-center gap-2 p-3.5 rounded-[16px] bg-surface-2 border border-line text-muted text-[14px] mt-4">
          <ShieldCheck size={20} className="text-primary shrink-0" />
          <span>
            Hệ thống bảo mật 1 mật khẩu nhanh gọn, thao tác trực tiếp trên giao diện điện thoại.
          </span>
        </div>
      </div>

      <div className="text-center text-[14px] text-muted">
        Ứng dụng học hiểu cơ thể · Phiên bản 1.0
      </div>
    </main>
  );
}
