'use client';

import React, { useState } from 'react';
import { Award, Share2, Check, Sparkles, Trophy, Lock } from 'lucide-react';
import { playTapSound } from '../lib/audioFeedback';

interface AchievementBadgeCardProps {
  topicTitle: string;
  topicSlug: string;
  progress: number;
  totalLessons: number;
  completedLessons?: number;
  className?: string;
}

export default function AchievementBadgeCard({
  topicTitle,
  topicSlug,
  progress,
  totalLessons,
  completedLessons,
  className = '',
}: AchievementBadgeCardProps) {
  const isCompleted = progress >= 100;
  const [copied, setCopied] = useState(false);
  const doneCount =
    typeof completedLessons === 'number'
      ? completedLessons
      : Math.min(totalLessons, Math.round((progress / 100) * totalLessons));

  const handleShare = () => {
    playTapSound();
    const shareText = `Tôi vừa hoàn thành 100% chuyên đề "${topicTitle}" trên ứng dụng Học Cơ Thể! Cùng chăm sóc sức khỏe chủ động nhé: ${window.location.href}`;
    if (navigator.share) {
      navigator
        .share({
          title: `Hoàn thành chuyên đề ${topicTitle}`,
          text: shareText,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-[16px] border p-2.5 sm:p-3 transition-all ${
        isCompleted
          ? 'bg-gradient-to-r from-[#071326] via-[#0E254A] to-[#081830] border-cyan-400/80 shadow-[0_6px_22px_-4px_rgba(6,182,212,0.35)]'
          : 'bg-gradient-to-r from-[#0B1528] via-[#102244] to-[#0A1628] border-sky-500/40 shadow-[0_6px_20px_-4px_rgba(14,42,92,0.35)]'
      } ${className}`}
    >
      {/* Vầng sáng công nghệ huyền bí phản chiếu trên góc thẻ */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-cyan-400/15 blur-xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-blue-600/15 blur-xl pointer-events-none" />

      <div className="relative z-10 flex items-center gap-2.5">
        {/* Biểu tượng Huy hiệu Neon Sapphire & Electric Cyan 3D nổi bật */}
        <div
          className={`w-11 h-11 rounded-[13px] flex items-center justify-center shrink-0 shadow-[0_0_14px_rgba(2,132,199,0.45)] border border-sky-300/40 ring-2 ${
            isCompleted
              ? 'bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 text-white ring-cyan-300/60 animate-bounce duration-1000'
              : 'bg-gradient-to-br from-[#0284C7] via-[#2563EB] to-[#4F46E5] text-white ring-sky-400/25'
          }`}
        >
          {isCompleted ? (
            <Trophy size={22} strokeWidth={2.5} className="drop-shadow-sm text-cyan-100" />
          ) : (
            <Award size={22} strokeWidth={2.4} className="drop-shadow-sm text-white" />
          )}
        </div>

        {/* Nội dung huy hiệu: Phân cấp rõ nét, chữ trắng sáng nổi bật, không nhạt */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
          {/* Hàng 1: Thẻ nhãn phong cách Cyber-Medical + Chỉ số hoàn thành */}
          <div className="flex items-center justify-between gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] text-[9.5px] font-black uppercase tracking-wider shadow-2xs shrink-0 ${
                isCompleted
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40'
                  : 'bg-sky-500/20 text-cyan-300 border border-cyan-400/30'
              }`}
            >
              <Sparkles size={10} className="text-cyan-300 shrink-0" />
              <span>{isCompleted ? 'Huy hiệu danh dự' : 'Mục tiêu chứng nhận'}</span>
            </span>

            <span className="text-[10px] font-black text-cyan-200 bg-sky-950/90 px-2 py-0.2 rounded-full border border-sky-500/50 shrink-0 shadow-2xs font-mono">
              {doneCount}/{totalLessons} bài ({progress}%)
            </span>
          </div>

          {/* Hàng 2: Tên huy hiệu chữ trắng tinh sáng, tương phản cao */}
          <div className="text-[13px] font-black text-white truncate drop-shadow-xs">
            {isCompleted ? `Đã thấu hiểu ${topicTitle}` : `Huy hiệu: Thấu hiểu ${topicTitle}`}
          </div>

          {/* Hàng 3: Dải tiến độ dạ quang Neon hoặc Nút chia sẻ khi hoàn thành */}
          {isCompleted ? (
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <span className="text-[10.5px] font-extrabold text-cyan-300 truncate">
                ✓ Đã mở khóa chứng nhận số xuất sắc!
              </span>
              <button
                type="button"
                onClick={handleShare}
                className="h-7 px-2.5 rounded-[8px] bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10.5px] font-black flex items-center gap-1 shadow-md hover:brightness-110 active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                {copied ? <Check size={11} strokeWidth={3} /> : <Share2 size={11} strokeWidth={2.5} />}
                <span>{copied ? 'Đã sao chép' : 'Chia sẻ'}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pt-0.5">
              <div className="flex-1 h-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 overflow-hidden p-0.2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 shadow-[0_0_8px_rgba(56,189,248,0.5)] transition-all duration-500"
                  style={{ width: `${Math.max(progress, 4)}%` }}
                />
              </div>
              <span className="inline-flex items-center gap-0.5 text-[9.5px] font-bold text-sky-300/80 shrink-0">
                <Lock size={10} className="text-cyan-400/80" />
                <span>Mở khóa khi học hết</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
