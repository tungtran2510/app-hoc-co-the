'use client';

import React, { useState } from 'react';
import { Award, Share2, Check, Sparkles, Trophy } from 'lucide-react';
import { playTapSound } from '../lib/audioFeedback';

interface AchievementBadgeCardProps {
  topicTitle: string;
  topicSlug: string;
  progress: number;
  totalLessons: number;
}

export default function AchievementBadgeCard({
  topicTitle,
  topicSlug,
  progress,
  totalLessons,
}: AchievementBadgeCardProps) {
  const isCompleted = progress >= 100;
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    playTapSound();
    const shareText = `Tôi vừa hoàn thành 100% chuyên đề "${topicTitle}" trên ứng dụng Học Cơ Thể! Cùng chăm sóc sức khỏe chủ động nhé: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: `Hoàn thành chuyên đề ${topicTitle}`,
        text: shareText,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div
      className={`p-3 rounded-[16px] border transition-all flex items-center justify-between gap-2.5 ${
        isCompleted
          ? 'bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/5 dark:from-amber-900/30 dark:to-yellow-950/20 border-amber-400/80 dark:border-amber-600/60 shadow-xs'
          : 'bg-slate-50 dark:bg-white/5 border-dashed border-slate-300 dark:border-white/10'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0 shadow-2xs border ${
            isCompleted
              ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-amber-950 border-amber-300 animate-bounce duration-1000'
              : 'bg-slate-200 dark:bg-white/10 text-slate-400 border-slate-300 dark:border-white/10'
          }`}
        >
          {isCompleted ? <Trophy size={18} strokeWidth={2.5} /> : <Award size={18} />}
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[9.5px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded ${
                isCompleted
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200'
                  : 'bg-slate-200 dark:bg-white/10 text-slate-500'
              }`}
            >
              {isCompleted ? 'Huy hiệu danh dự' : 'Mục tiêu chứng nhận'}
            </span>
          </div>
          <span className="text-[12px] font-black text-slate-900 dark:text-white truncate mt-0.5">
            {isCompleted ? `Đã thấu hiểu ${topicTitle}` : `Huy hiệu: Thấu hiểu ${topicTitle}`}
          </span>
          <p className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate">
            {isCompleted
              ? `Xuất sắc hoàn thành đủ ${totalLessons}/${totalLessons} bài học!`
              : `Hoàn thành ${totalLessons} bài để mở khóa huy hiệu số`}
          </p>
        </div>
      </div>

      {isCompleted ? (
        <button
          type="button"
          onClick={handleShare}
          className="h-8 px-2.5 rounded-[9px] bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 text-[11px] font-black flex items-center gap-1 shadow-2xs hover:opacity-90 active:scale-95 transition-all shrink-0 whitespace-nowrap cursor-pointer"
        >
          {copied ? <Check size={12} strokeWidth={3} /> : <Share2 size={12} strokeWidth={2.5} />}
          <span>{copied ? 'Đã sao chép' : 'Chia sẻ'}</span>
        </button>
      ) : (
        <span className="text-[11px] font-extrabold text-slate-400 shrink-0 px-2">
          {progress}%
        </span>
      )}
    </div>
  );
}
