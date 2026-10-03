'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { FontSizeOption } from '../PageHeaderBar';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqBlockProps {
  blockId: string;
  title?: string;
  items?: FaqItem[];
  fontSizeMode?: FontSizeOption;
}

export default function FaqBlock({
  blockId,
  title = 'Hỏi - Đáp Thường Gặp (FAQ)',
  items = [],
  fontSizeMode = 'normal',
}: FaqBlockProps) {
  // Mặc định mở câu hỏi đầu tiên
  const [openIds, setOpenIds] = useState<Record<string, boolean>>(() => {
    if (items.length > 0 && items[0]?.id) {
      return { [items[0].id]: true };
    }
    return {};
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const questionSizeClass =
    fontSizeMode === 'small'
      ? 'text-[14px]'
      : fontSizeMode === 'large'
      ? 'text-[17px]'
      : 'text-[15.5px]';

  const answerSizeClass =
    fontSizeMode === 'small'
      ? 'text-[13.5px]'
      : fontSizeMode === 'large'
      ? 'text-[16.5px]'
      : 'text-[15px]';

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div id={blockId} className="w-full scroll-mt-20 my-2">
      <div className="p-4 sm:p-5 rounded-[22px] bg-gradient-to-b from-slate-50 to-purple-50/25 dark:from-[#1A0E35] dark:to-[#130826] border border-slate-200/90 dark:border-purple-500/25 shadow-2xs flex flex-col gap-3">
        {/* Header khối FAQ */}
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200/80 dark:border-purple-500/20">
          <div className="w-7 h-7 rounded-[8px] bg-purple-900 text-amber-300 dark:bg-purple-800 dark:text-amber-200 flex items-center justify-center shrink-0 shadow-2xs">
            <HelpCircle size={16} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h3 className="text-[15px] sm:text-[16px] font-black text-slate-900 dark:text-white uppercase tracking-wide leading-tight">
              {title || 'Hỏi - Đáp Thường Gặp (FAQ)'}
            </h3>
          </div>
        </div>

        {/* Danh sách accordion các câu hỏi */}
        <div className="flex flex-col gap-2">
          {items.map((item, idx) => {
            const isOpen = !!openIds[item.id];
            return (
              <div
                key={item.id || idx}
                className={`rounded-[14px] border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white dark:bg-[#1F113E] border-purple-300/80 dark:border-purple-500/50 shadow-xs'
                    : 'bg-white/80 dark:bg-[#160D2C] border-slate-200/80 dark:border-purple-500/20 hover:border-purple-200'
                }`}
              >
                {/* Nút bấm mở/đóng câu hỏi */}
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-3 sm:p-3.5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      Q{idx + 1}
                    </span>
                    <span
                      className={`${questionSizeClass} font-extrabold text-slate-900 dark:text-white leading-snug`}
                    >
                      {item.question}
                    </span>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'bg-purple-900 text-white rotate-180'
                        : 'bg-slate-100 dark:bg-purple-950 text-slate-600 dark:text-purple-300'
                    }`}
                  >
                    <ChevronDown size={14} strokeWidth={2.5} />
                  </div>
                </button>

                {/* Phần câu trả lời mở rộng */}
                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-0 sm:px-4 sm:pb-4 border-t border-slate-100 dark:border-purple-500/15 animate-in fade-in duration-150">
                    <div className="pt-2.5 pl-2.5 border-l-2 border-amber-500/70 dark:border-amber-400/80 text-slate-700 dark:text-purple-100">
                      <p
                        className={`${answerSizeClass} font-medium leading-relaxed whitespace-pre-line`}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
