'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Activity, ChevronRight } from 'lucide-react';

interface BodyRegion {
  id: string;
  name: string;
  subName: string;
  topicSlug: string;
  pageSlug?: string;
  icon: string;
  color: string;
  keywords: string[];
  symptoms: string;
}

export const BODY_REGIONS: BodyRegion[] = [
  {
    id: 'cervical',
    name: 'Cổ & Vai Gáy',
    subName: 'Đốt sống C1-C7 · Thoái hóa cơ vai',
    topicSlug: 'cot-song',
    pageSlug: 'co-gan-day-chang',
    icon: '🦴',
    color: 'from-blue-600 to-indigo-600',
    keywords: ['cổ', 'vai gáy', 'đốt sống cổ', 'dây chằng'],
    symptoms: 'Mỏi cổ, tê lan xuống bả vai, cúi ngửa đau',
  },
  {
    id: 'lumbar',
    name: 'Cột Sống Thắt Lưng & Đĩa Đệm',
    subName: 'L1-L5, S1 · Giảm xóc sinh học',
    topicSlug: 'cot-song',
    pageSlug: 'dia-dem',
    icon: '⚡',
    color: 'from-indigo-600 to-sky-600',
    keywords: ['thắt lưng', 'đĩa đệm', 'thoát vị', 'lưng'],
    symptoms: 'Đau thắt lưng khi ngồi lâu, cúi vác nặng',
  },
  {
    id: 'pelvis',
    name: 'Khung Chậu & Khớp Chi',
    subName: 'Khớp háng · Khớp gối · Bàn chân',
    topicSlug: 'co-the-nguoi',
    icon: '🏃',
    color: 'from-purple-600 to-indigo-600',
    keywords: ['khung chậu', 'khớp háng', 'khớp gối', 'chuỗi động học'],
    symptoms: 'Lệch trục chịu lực, cứng khớp buổi sáng',
  },
  {
    id: 'digestive',
    name: 'Hệ Tiêu Hóa & Đường Ruột',
    subName: 'Dạ dày · Ruột non · Vi sinh đường ruột',
    topicSlug: 'tieu-hoa',
    icon: '🫀',
    color: 'from-rose-600 to-amber-600',
    keywords: ['tiêu hóa', 'dạ dày', 'đường ruột', 'men vi sinh'],
    symptoms: 'Đầy hơi, khó tiêu, hấp thu dưỡng chất kém',
  },
  {
    id: 'water',
    name: 'Nước & Cân Bằng Tế Bào',
    subName: 'Áp suất thẩm thấu · Cụm phân tử nhỏ',
    topicSlug: 'nuoc',
    icon: '💧',
    color: 'from-cyan-600 to-teal-600',
    keywords: ['nước', 'điện giải', 'thẩm thấu', 'bù nước'],
    symptoms: 'Khô miệng, tuần hoàn máu kém, mệt mỏi âm thầm',
  },
  {
    id: 'liver',
    name: 'Gan - Mật - Thải Độc',
    subName: 'Lọc độc tố · Dự trữ năng lượng Glycogen',
    topicSlug: 'gan-mat-tuy',
    icon: '🌿',
    color: 'from-emerald-600 to-green-600',
    keywords: ['gan', 'mật', 'thải độc', 'tụy'],
    symptoms: 'Nóng trong, mệt mỏi sau ăn, rối loạn chuyển hóa',
  },
  {
    id: 'endocrine',
    name: 'Nội Tiết & Chuyển Hóa',
    subName: 'Tuyến giáp · Hormones · Trao đổi chất',
    topicSlug: 'noi-tiet-chuyen-hoa',
    icon: '🔬',
    color: 'from-amber-600 to-yellow-600',
    keywords: ['nội tiết', 'tuyến giáp', 'hormone', 'trao đổi chất'],
    symptoms: 'Rối loạn giấc ngủ, tăng giảm cân bất thường',
  },
  {
    id: 'immune',
    name: 'Hệ Miễn Dịch & Tế Bào',
    subName: 'Bạch cầu · Kháng thể tự nhiên · Phản ứng viêm',
    topicSlug: 'mien-dich',
    icon: '🛡️',
    color: 'from-teal-600 to-emerald-700',
    keywords: ['miễn dịch', 'đề kháng', 'viêm', 'kháng thể'],
    symptoms: 'Dễ cảm cúm, vết thương lâu lành, dị ứng',
  },
];

interface BodyMapNavigatorProps {
  onSelectKeyword?: (keyword: string) => void;
}

export default function BodyMapNavigator({ onSelectKeyword }: BodyMapNavigatorProps) {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion>(BODY_REGIONS[0]);

  const handleRegionClick = (region: BodyRegion) => {
    setSelectedRegion(region);
    if (onSelectKeyword) {
      onSelectKeyword(region.keywords[0]);
    }
  };

  const targetHref = selectedRegion.pageSlug
    ? `/${selectedRegion.topicSlug}/${selectedRegion.pageSlug}`
    : `/${selectedRegion.topicSlug}`;

  return (
    <div className="flex flex-col gap-2.5 rounded-[18px] bg-gradient-to-br from-slate-50 via-white to-slate-100/70 dark:from-[#160D30] dark:via-[#140B2B] dark:to-[#0D071D] border border-slate-200/90 dark:border-purple-800/40 p-3 sm:p-3.5 shadow-2xs">
      {/* Tiêu đề thanh lịch */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-primary/10 dark:bg-[#F8DF7B]/15 text-primary dark:text-[#F8DF7B] flex items-center justify-center text-[11px] font-black">
            ✦
          </span>
          <h3 className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Bản Đồ Cơ Thể 1 Chạm
          </h3>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary-soft text-primary border border-primary/20">
          Chạm để tra bài
        </span>
      </div>

      <p className="text-[11.5px] text-slate-500 dark:text-purple-300/70 leading-snug">
        Chạm trực tiếp vào vùng bạn quan tâm để mở nhanh bài học và bài tập liên quan:
      </p>

      {/* Lưới các vùng cơ thể (Grid 2 cột gọn gàng trên mobile) */}
      <div className="grid grid-cols-2 gap-1.5 pt-0.5">
        {BODY_REGIONS.map((r) => {
          const isSelected = selectedRegion.id === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => handleRegionClick(r)}
              className={`h-11 px-2.5 rounded-[12px] border text-left flex items-center gap-2 transition-all cursor-pointer select-none active:scale-[0.98] ${
                isSelected
                  ? 'bg-white dark:bg-[#1E113E] border-primary text-slate-900 dark:text-white shadow-xs ring-1 ring-primary/30'
                  : 'bg-white/70 dark:bg-[#140B28]/60 border-slate-200 dark:border-purple-800/30 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <span className="text-[15px] shrink-0">{r.icon}</span>
              <div className="min-w-0 flex-1">
                <span className="text-[11.5px] font-extrabold truncate block leading-tight">
                  {r.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Thẻ xem nhanh vùng đang chọn (1 Dòng Mobile-First) */}
      {selectedRegion && (
        <div className="mt-1 p-2.5 rounded-[13px] bg-primary/5 dark:bg-white/5 border border-primary/20 dark:border-white/10 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px]">{selectedRegion.icon}</span>
              <span className="text-[12px] font-black text-slate-900 dark:text-white truncate">
                {selectedRegion.name}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-300 truncate mt-0.5">
              {selectedRegion.symptoms}
            </p>
          </div>

          <Link
            href={targetHref}
            className="h-7.5 px-3 rounded-[9px] bg-primary text-white text-[11px] font-extrabold flex items-center gap-1 shadow-2xs hover:opacity-90 active:scale-95 transition-all shrink-0 whitespace-nowrap"
          >
            <span>Học ngay</span>
            <ArrowRight size={11} />
          </Link>
        </div>
      )}
    </div>
  );
}
