'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Topic, Page } from '../lib/types';
import { getStoredXemTiep, XemTiepInfo } from '../lib/learningProgress';

interface TopicMainButtonProps {
  topic: Topic;
  firstPage: Page | null;
}

export default function TopicMainButton({ topic, firstPage }: TopicMainButtonProps) {
  const [continueInfo, setContinueInfo] = useState<XemTiepInfo | null>(null);

  useEffect(() => {
    try {
      const stored = getStoredXemTiep();
      if (stored && stored.topic_slug === topic.slug) {
        setContinueInfo(stored);
      }
    } catch {
      // Bỏ qua
    }
  }, [topic.slug]);

  if (!firstPage) return null;

  if (continueInfo && continueInfo.page_slug) {
    const formattedNum = String(continueInfo.page_number || 1).padStart(2, '0');
    return (
      <Link
        href={`/${topic.slug}/${continueInfo.page_slug}?v=${continueInfo.video_index || 1}`}
        prefetch={false}
        className="flex items-center justify-between px-4 h-[44px] min-h-[44px] w-full rounded-[13px] bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-[14px] sm:text-[15px] transition-all active:scale-[0.99] shadow-[0_4px_14px_rgba(30,58,138,0.25)]"
      >
        <span className="truncate pr-2">
          ▶ Xem tiếp: Bài {formattedNum} · {continueInfo.page_title}
        </span>
        <ArrowRight size={17} strokeWidth={2.5} className="shrink-0" />
      </Link>
    );
  }

  return (
    <Link
      href={`/${topic.slug}/${firstPage.slug}`}
      prefetch={false}
      className="flex items-center justify-between px-4 h-[44px] min-h-[44px] w-full rounded-[13px] bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-[14px] sm:text-[15px] transition-all active:scale-[0.99] shadow-[0_4px_14px_rgba(30,58,138,0.25)]"
    >
      <span className="truncate pr-2">
        ▶ Bắt đầu học: Bài 01 · {firstPage.title}
      </span>
      <ArrowRight size={17} strokeWidth={2.5} className="shrink-0" />
    </Link>
  );
}
