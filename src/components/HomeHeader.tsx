'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, User, Settings, ShieldCheck } from 'lucide-react';
import { checkIsAdminClient } from '../lib/adminAuth';
import { getStoredAppSettings } from '../lib/storage';
import AdminSettingsModal from './admin/AdminSettingsModal';

interface HomeHeaderProps {
  initialAppName: string;
}

export default function HomeHeader({ initialAppName }: HomeHeaderProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [appName, setAppName] = useState(initialAppName);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    checkIsAdminClient().then(setIsAdmin);
    const stored = getStoredAppSettings();
    if (stored.app_name) {
      setAppName(stored.app_name);
    }
  }, []);

  return (
    <>
      <header className="flex items-center justify-between h-[52px]">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-[12px] bg-primary flex items-center justify-center text-white shadow-xs">
            <BookOpen size={22} strokeWidth={2.5} />
          </div>
          <span className="text-[20px] font-extrabold text-ink leading-tight">
            {appName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-1 h-9 px-2.5 rounded-full bg-primary-soft text-primary font-bold text-[12px] border border-primary/30 shadow-2xs hover:bg-primary-soft/80"
                title="Cài đặt quản trị"
              >
                <Settings size={14} />
                <span>Quản trị</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="w-9 h-9 rounded-full bg-white border border-line flex items-center justify-center text-primary hover:text-primary-dark transition-colors shadow-2xs"
                aria-label="Cài đặt tài khoản"
              >
                <User size={18} />
              </button>
            </div>
          ) : (
            <Link
              href="/dang-nhap"
              className="w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center text-muted hover:text-primary transition-colors shadow-2xs"
              aria-label="Đăng nhập quản trị"
              title="Đăng nhập quản trị"
            >
              <User size={20} />
            </Link>
          )}
        </div>
      </header>

      {showSettings && (
        <AdminSettingsModal
          isOpen={true}
          onClose={() => setShowSettings(false)}
          onSettingsSaved={() => {
            const stored = getStoredAppSettings();
            if (stored.app_name) setAppName(stored.app_name);
          }}
          onLogout={() => setIsAdmin(false)}
        />
      )}
    </>
  );
}
