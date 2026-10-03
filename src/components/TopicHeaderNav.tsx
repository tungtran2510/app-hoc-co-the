'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Settings, ShieldCheck } from 'lucide-react';
import { checkIsAdminClient } from '../lib/adminAuth';
import AdminSettingsModal from './admin/AdminSettingsModal';

export default function TopicHeaderNav() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    checkIsAdminClient().then(setIsAdmin);
  }, []);

  return (
    <>
      <nav aria-label="Đường dẫn quay lại" className="flex items-center justify-between">
        <Link
          href="/"
          prefetch={true}
          className="inline-flex items-center gap-1 h-[48px] min-h-[48px] text-[#1E3A8A] hover:text-[#172554] dark:text-[#F8DF7B] text-[17px] font-extrabold transition-opacity active:opacity-75"
          aria-label="Quay lại Trang chủ"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
          <span>Trang chủ</span>
        </Link>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-1 h-8 px-2.5 rounded-full bg-blue-50 text-[#1E3A8A] dark:bg-purple-950 dark:text-[#F8DF7B] font-bold text-[12px] border border-blue-200 dark:border-purple-700/60 shadow-2xs hover:bg-blue-100"
            title="Cài đặt quản trị"
          >
            <Settings size={14} />
            <span>Quản trị</span>
          </button>
        )}
      </nav>

      {showSettings && (
        <AdminSettingsModal
          isOpen={true}
          onClose={() => setShowSettings(false)}
          onLogout={() => setIsAdmin(false)}
        />
      )}
    </>
  );
}
