'use client';

import React from 'react';
import { CheckCircle2, XCircle, Check, X } from 'lucide-react';
import { FontSizeOption } from '../PageHeaderBar';

interface ComparisonBlockProps {
  blockId: string;
  leftTitle?: string;
  leftLines: string[];
  rightTitle?: string;
  rightLines: string[];
  fontSizeMode?: FontSizeOption;
}

export default function ComparisonBlock({
  blockId,
  leftTitle = 'Nên làm / Bình thường',
  leftLines = [],
  rightTitle = 'Tránh làm / Bệnh lý',
  rightLines = [],
  fontSizeMode = 'normal',
}: ComparisonBlockProps) {
  const textSizeClass =
    fontSizeMode === 'small'
      ? 'text-[15px]'
      : fontSizeMode === 'large'
      ? 'text-[18px]'
      : 'text-[16px]';

  return (
    <div id={blockId} className="w-full scroll-mt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Cột 1: Nên làm / Bình thường (Màu xanh lá y khoa chuẩn) */}
        <div className="p-4 sm:p-5 rounded-[22px] bg-emerald-50 border border-emerald-300/60 flex flex-col gap-3 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-emerald-200">
            <CheckCircle2 size={22} className="text-emerald-600 shrink-0" strokeWidth={2.5} />
            <h3 className="text-[16px] sm:text-[17px] font-extrabold text-emerald-950 uppercase tracking-wide leading-tight">
              {leftTitle}
            </h3>
          </div>

          <ul className="flex flex-col gap-2.5">
            {leftLines.map((line, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} strokeWidth={3} />
                </span>
                <span className={`${textSizeClass} text-emerald-950 font-medium leading-relaxed`}>
                  {line}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 2: Tránh làm / Bệnh lý (Màu đỏ gạch / cam đất) */}
        <div className="p-4 sm:p-5 rounded-[22px] bg-[#FBE7E1] border border-[#9B3B32]/30 flex flex-col gap-3 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#9B3B32]/20">
            <XCircle size={22} className="text-[#9B3B32] shrink-0" strokeWidth={2.5} />
            <h3 className="text-[16px] sm:text-[17px] font-extrabold text-[#7A2F12] uppercase tracking-wide leading-tight">
              {rightTitle}
            </h3>
          </div>

          <ul className="flex flex-col gap-2.5">
            {rightLines.map((line, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#9B3B32]/15 text-[#9B3B32] flex items-center justify-center shrink-0 mt-0.5">
                  <X size={13} strokeWidth={3} />
                </span>
                <span className={`${textSizeClass} text-[#7A2F12] font-medium leading-relaxed`}>
                  {line}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
