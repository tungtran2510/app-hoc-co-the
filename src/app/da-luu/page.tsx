'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Bookmark,
  Trash2,
  ChevronRight,
  BookOpen,
  Smartphone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { getSavedPages, SavedPageInfo, toggleSavePage } from '../../lib/learningProgress';
import { getUserPhone, syncUserProgress, LEARNING_PROGRESS_EVENT } from '../../lib/userSync';
import UserSyncModal from '../../components/UserSyncModal';
import BottomNav from '../../components/BottomNav';

const quickExploreTopics = [
  {
    slug: 'cot-song',
    title: 'Cá»™t sá»‘ng & ÄÄ©a Ä‘á»‡m',
    badge: 'SPINE & BONE',
    icon: '/images/topics/cot-song.png',
    count: '6 bÃ i há»c',
  },
  {
    slug: 'dinh-duong',
    title: 'Dinh dÆ°á»¡ng ná»n táº£ng',
    badge: 'NUTRITION',
    icon: '/images/topics/dinh-duong.png',
    count: '4 bÃ i há»c',
  },
  {
    slug: 'co-the-nguoi',
    title: 'CÆ¡ thá»ƒ ngÆ°á»i 3D',
    badge: 'ANATOMY 3D',
    icon: '/images/topics/co-the-nguoi.png',
    count: 'Tá»•ng quan',
  },
  {
    slug: 'tieu-hoa',
    title: 'Há»‡ tiÃªu hÃ³a',
    badge: 'DIGESTIVE',
    icon: '/images/topics/tieu-hoa.png',
    count: 'ChuyÃªn Ä‘á»',
  },
];

export default function SavedPages() {
  const [savedList, setSavedList] = useState<SavedPageInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPhoneSync, setShowPhoneSync] = useState(false);
  const [userPhone, setUserPhone] = useState<string | null>(null);

  const formatPhone = (p: string) => {
    const clean = p.replace(/[^0-9]/g, '');
    if (clean.length === 10) {
      return `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`;
    }
    return clean;
  };

  const refreshList = () => {
    try {
      const list = getSavedPages();
      setSavedList(list);
    } catch {
      setSavedList([]);
    }
  };

  useEffect(() => {
    refreshList();
    setIsLoading(false);

    // Náº¿u Ä‘Ã£ cÃ³ sá»‘ Ä‘iá»‡n thoáº¡i lÆ°u tá»« trÆ°á»›c, tá»± Ä‘á»™ng táº£i má»›i tá»« mÃ¡y chá»§
    const phone = getUserPhone();
    setUserPhone(phone);
    if (phone) {
      syncUserProgress(phone, 'sync').then((res) => {
        if (res.success) {
          refreshList();
        }
      });
    }

    const handleUpdate = () => {
      refreshList();
      setUserPhone(getUserPhone());
    };

    window.addEventListener(LEARNING_PROGRESS_EVENT, handleUpdate);
    window.addEventListener('learning_progress_changed', handleUpdate);
    return () => {
      window.removeEventListener(LEARNING_PROGRESS_EVENT, handleUpdate);
      window.removeEventListener('learning_progress_changed', handleUpdate);
    };
  }, []);

  const handleRemove = (e: React.MouseEvent, page: SavedPageInfo) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavePage(page);
    refreshList();
  };

  return (
    <main className="flex-1 flex flex-col px-4 sm:px-5 pt-3 pb-28 gap-5 max-w-lg mx-auto w-full">
      {/* 1. Header chuáº©n iOS */}
      <header className="flex items-center justify-between h-[48px]">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-purple-700 dark:text-purple-300 text-[16px] font-extrabold pr-2 transition-opacity active:opacity-75"
          aria-label="Quay láº¡i trang chá»§"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
          <span>Trang chá»§</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* NÃºt Ä‘á»“ng bá»™ SÄT */}
          <button
            type="button"
            onClick={() => setShowPhoneSync(true)}
            className="flex items-center gap-1.5 h-8 px-2.5 rounded-[10px] bg-white dark:bg-[#1E1342] border border-slate-200 dark:border-purple-800/40 text-slate-700 dark:text-purple-200 hover:text-purple-700 dark:hover:text-[#F8DF7B] text-[12px] font-bold shadow-2xs cursor-pointer active:scale-95 transition-all"
            title="LÆ°u & Äá»“ng bá»™ qua Sá»‘ Ä‘iá»‡n thoáº¡i"
          >
            <Smartphone size={13} />
            <span>{userPhone ? formatPhone(userPhone) : 'Äá»“ng bá»™ SÄT'}</span>
            {userPhone && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
          </button>

          <div className="flex items-center gap-1.5 ml-0.5 px-2.5 py-1 rounded-[10px] bg-amber-50 dark:bg-purple-950/60 border border-amber-300 dark:border-purple-800/40">
            <Bookmark size={15} className="text-amber-700 dark:text-[#F8DF7B] fill-current" />
            <span className="text-[13px] font-black text-amber-700 dark:text-[#F8DF7B]">ÄÃ£ lÆ°u</span>
          </div>
        </div>
      </header>

      {/* 2. TiÃªu Ä‘á» trang trá»ng */}
      <section className="flex flex-col gap-1.5 pt-1">
        <h1 className="text-[24px] sm:text-[26px] font-black text-slate-900 dark:text-white leading-tight">
          BÃ i há»c Ä‘Ã£ lÆ°u
        </h1>
        <p className="text-[13px] sm:text-[13.5px] text-slate-600 dark:text-purple-200/80 leading-relaxed font-normal">
          {savedList.length > 0
            ? `${savedList.length} bÃ i há»c báº¡n Ä‘Ã£ Ä‘Ã¡nh dáº¥u Ä‘á»ƒ Ã´n táº­p & tra cá»©u nhanh`
            : 'ÄÃ¡nh dáº¥u cÃ¡c bÃ i há»c quan trá»ng Ä‘á»ƒ má»Ÿ xem láº¡i báº¥t cá»© khi nÃ o báº¡n cáº§n'}
        </p>
      </section>


      {/* 4. Danh sÃ¡ch bÃ i há»c Ä‘Ã£ lÆ°u (Giao diá»‡n tháº» ChuyÃªn nghiá»‡p) */}
      {isLoading ? (
        <div className="p-8 text-center bg-white dark:bg-[#160D30] rounded-[22px] border border-slate-200 dark:border-purple-800/40">
          <p className="text-[14px] text-slate-500 dark:text-purple-300 font-medium">Äang táº£i dá»¯ liá»‡u bÃ i há»c...</p>
        </div>
      ) : savedList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-7 bg-white dark:bg-[#160D30] rounded-[24px] border border-slate-200/80 dark:border-purple-800/40 text-center gap-3.5 my-1 shadow-xs">
          <div className="w-14 h-14 rounded-[18px] bg-amber-50 dark:bg-purple-950/80 text-amber-700 dark:text-[#F8DF7B] flex items-center justify-center shadow-inner-xs">
            <Bookmark size={26} strokeWidth={2.2} />
          </div>
          <div className="flex flex-col gap-1 max-w-[280px]">
            <h2 className="text-[18px] font-black text-slate-900 dark:text-white">
              ChÆ°a cÃ³ bÃ i há»c nÃ o
            </h2>
            <p className="text-[13px] text-slate-500 dark:text-purple-300 leading-relaxed font-normal">
              Khi há»c má»™t bÃ i giáº£ng, báº¡n hÃ£y báº¥m biá»ƒu tÆ°á»£ng LÆ°u á»Ÿ gÃ³c pháº£i bÃ i há»c Ä‘á»ƒ xem láº¡i nhanh táº¡i Ä‘Ã¢y.
            </p>
          </div>
          <Link
            href="/cot-song"
            className="flex items-center justify-center gap-2 h-11 px-5 rounded-[12px] bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-600 dark:to-indigo-600 text-white font-black text-[13.5px] shadow-sm active:scale-95 transition-transform"
          >
            <BookOpen size={16} />
            <span>KhÃ¡m phÃ¡ Cá»™t sá»‘ng ngay</span>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {savedList.map((item) => {
            const topicIcon = `/images/topics/${item.topic_slug}.png`;

            return (
              <div
                key={item.page_id}
                className="p-3.5 sm:p-4 rounded-[20px] bg-white dark:bg-[#160D30] border border-slate-200/90 dark:border-purple-800/40 shadow-xs hover:shadow-md transition-all flex flex-col gap-3 group"
              >
                {/* HÃ ng trÃªn: Logo chuyÃªn Ä‘á» + TiÃªu Ä‘á» + NÃºt xÃ³a */}
                <div className="flex items-start gap-3">
                  {/* Thumbnail ChuyÃªn Ä‘á» 3D */}
                  <div className="relative w-12 h-12 rounded-[14px] bg-slate-50 dark:bg-purple-950/70 border border-slate-200 dark:border-purple-800/50 p-1 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={topicIcon}
                      alt={item.topic_title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                        const fallback = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center text-purple-700 dark:text-[#F8DF7B]">
                      <BookOpen size={18} />
                    </div>

                    {/* Sá»‘ bÃ i */}
                    <span className="absolute bottom-0 right-0 px-1 py-0.2 rounded-tl-[6px] bg-purple-900 text-amber-300 text-[8.5px] font-black">
                      #{item.page_number}
                    </span>
                  </div>

                  {/* ThÃ´ng tin bÃ i há»c */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase text-purple-700 dark:text-[#F8DF7B] tracking-wider truncate">
                        {item.topic_title}
                      </span>
                      <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-[5px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                        ÄÃ£ lÆ°u
                      </span>
                    </div>

                    <h3 className="text-[15.5px] sm:text-[16.5px] font-black text-slate-900 dark:text-white leading-snug line-clamp-2 mt-0.5 group-hover:text-purple-700 dark:group-hover:text-[#F8DF7B] transition-colors">
                      {item.page_title}
                    </h3>
                  </div>

                  {/* NÃºt xÃ³a khá»i danh sÃ¡ch Ä‘Ã£ lÆ°u */}
                  <button
                    type="button"
                    onClick={(e) => handleRemove(e, item)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors shrink-0 cursor-pointer"
                    aria-label="XÃ³a bÃ i há»c khá»i danh sÃ¡ch Ä‘Ã£ lÆ°u"
                    title="Bá» lÆ°u bÃ i há»c nÃ y"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* HÃ ng dÆ°á»›i: NÃºt má»Ÿ bÃ i há»c rÃµ rÃ ng chuyÃªn nghiá»‡p */}
                <Link
                  href={`/${item.topic_slug}/${item.page_slug}`}
                  className="w-full h-10 rounded-[12px] bg-slate-900 dark:bg-white/10 dark:border dark:border-white/15 hover:opacity-95 text-white font-bold text-[13px] flex items-center justify-center gap-1.5 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span>Má»Ÿ há»c bÃ i nÃ y</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Khá»‘i Gá»£i Ã½ KhÃ¡m PhÃ¡ ThÃªm ChuyÃªn Äá» (XÃ³a bá» cáº£m giÃ¡c trá»‘ng tráº£i) */}
      <section className="flex flex-col gap-2.5 pt-2 border-t border-slate-200/70 dark:border-purple-800/30">
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-purple-200 text-[12px] font-black uppercase tracking-wide">
          <Compass size={14} className="text-amber-600 dark:text-[#F8DF7B]" />
          <span>Gá»£i Ã½ khÃ¡m phÃ¡ thÃªm chuyÃªn Ä‘á»:</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {quickExploreTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/${topic.slug}`}
              className="p-3 rounded-[16px] bg-white dark:bg-[#160D30] border border-slate-200/80 dark:border-purple-800/40 hover:border-purple-500/50 dark:hover:border-[#F8DF7B]/60 shadow-2xs hover:shadow-xs transition-all flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-[11px] bg-slate-50 dark:bg-purple-950/70 p-1 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-purple-800/40 group-hover:scale-105 transition-transform overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={topic.icon}
                  alt={topic.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-extrabold uppercase text-purple-700 dark:text-[#F8DF7B] tracking-wider truncate">
                  {topic.badge}
                </span>
                <span className="text-[12px] font-black text-slate-900 dark:text-white leading-tight truncate mt-0.5 group-hover:text-purple-700 dark:group-hover:text-[#F8DF7B] transition-colors">
                  {topic.title}
                </span>
                <span className="text-[10.5px] text-slate-400 dark:text-purple-300/70 font-medium">
                  {topic.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Thanh Ä‘iá»u hÆ°á»›ng dÆ°á»›i cÃ¹ng */}
      <BottomNav />

      {/* 7. Modal LÆ°u tiáº¿n Ä‘á»™ & Äá»“ng bá»™ qua SÄT */}
      <UserSyncModal
        isOpen={showPhoneSync}
        onClose={() => setShowPhoneSync(false)}
        reason="manual"
        onSuccess={refreshList}
      />
    </main>
  );
}
