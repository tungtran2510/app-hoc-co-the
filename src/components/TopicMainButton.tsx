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
        className="flex items-center justify-center gap-2 h-[58px] min-h-[48px] w-full rounded-[16px] bg-primary text-white font-extrabold text-[19px] transition-transform active:scale-[0.98] shadow-sm"
      >
        <span>
          Xem tiếp: {formattedNum} {continueInfo.page_title}
        </span>
        <ArrowRight size={20} strokeWidth={2.5} />
      </Link>
    );
  }

  return (
    <Link
      href={`/${topic.slug}/${firstPage.slug}`}
      className="flex items-center justify-center gap-2 h-[58px] min-h-[48px] w-full rounded-[16px] bg-primary text-white font-extrabold text-[19px] transition-transform active:scale-[0.98] shadow-sm"
    >
      <span>Bắt đầu: 01 {firstPage.title}</span>
      <ArrowRight size={20} strokeWidth={2.5} />
    </Link>
  );
}
