'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Layers, Activity, ChevronRight, Search as SearchIcon } from 'lucide-react';

export interface BodyRegion {
  id: string;
  name: string;
  subName: string;
  topicSlug: string;
  pageSlug?: string;
  icon: string;
  keywords: string[];
  symptoms: string;
}

export interface OrganSystem {
  id: string;
  name: string;
  subName: string;
  topicSlug: string;
  icon: string;
  keywords: string[];
  symptoms: string;
  regionsSummary: string;
}

export interface HealthSymptom {
  id: string;
  name: string;
  subName: string;
  topicSlug: string;
  pageSlug?: string;
  icon: string;
  keyword: string;
  relatedKeywords: string[];
  hint: string;
}

// 1. Dữ liệu Theo Bộ Phận Cơ Thể (8 Vùng Trọng Yếu)
export const BODY_REGIONS: BodyRegion[] = [
  {
    id: 'cervical',
    name: 'Cổ & Vai Gáy',
    subName: 'Đốt sống C1-C7 · Căng cơ vai',
    topicSlug: 'cot-song',
    pageSlug: 'co-gan-day-chang',
    icon: '🦴',
    keywords: ['cổ', 'vai gáy', 'đốt sống cổ', 'dây chằng'],
    symptoms: 'Mỏi cổ, căng cơ vai, đau khi nhìn màn hình máy tính lâu',
  },
  {
    id: 'lumbar',
    name: 'Cột Sống Thắt Lưng',
    subName: 'Đốt sống L1-L5 · Trục nâng đỡ',
    topicSlug: 'cot-song',
    pageSlug: 'tong-quan-ve-cot-song',
    icon: '⚡',
    keywords: ['thắt lưng', 'cột sống', 'lưng', 'tư thế ngồi'],
    symptoms: 'Đau thắt lưng khi ngồi lâu, cúi vác nặng, mỏi cơ lưng dưới',
  },
  {
    id: 'disc',
    name: 'Đĩa Đệm Giảm Xóc',
    subName: 'Nhân nhầy ngậm nước · Chống sốc',
    topicSlug: 'cot-song',
    pageSlug: 'dia-dem',
    icon: '🛡️',
    keywords: ['đĩa đệm', 'thoát vị', 'nhân nhầy', 'chèn ép'],
    symptoms: 'Chèn ép thần kinh tọa, đau buốt lan xuống chân, thoát vị',
  },
  {
    id: 'pelvis',
    name: 'Khung Chậu & Khớp Chi',
    subName: 'Khớp háng · Khớp gối · Bàn chân',
    topicSlug: 'co-the-nguoi',
    pageSlug: 'khung-xuong',
    icon: '🏃',
    keywords: ['khung chậu', 'khớp háng', 'khớp gối', 'chuỗi động học'],
    symptoms: 'Lệch trục chịu lực, cứng khớp gối buổi sáng, đau khớp háng',
  },
  {
    id: 'digestive',
    name: 'Dạ Dày & Đường Ruột',
    subName: 'Dạ dày · Ruột non · Hệ vi sinh',
    topicSlug: 'tieu-hoa',
    pageSlug: 'tong-quan-tieu-hoa',
    icon: '🫀',
    keywords: ['tiêu hóa', 'dạ dày', 'đường ruột', 'men vi sinh'],
    symptoms: 'Đầy hơi, khó tiêu, ợ chua, hấp thu dưỡng chất kém',
  },
  {
    id: 'water',
    name: 'Nước & Cân Bằng Tế Bào',
    subName: 'Áp suất thẩm thấu · Nước cụm nhỏ',
    topicSlug: 'nuoc',
    pageSlug: 'tam-quan-trong-cua-nuoc',
    icon: '💧',
    keywords: ['nước', 'uống nước', 'điện giải', 'thẩm thấu'],
    symptoms: 'Khô miệng, tế bào thiếu nước, máu đặc, uể oải chậm chuyển hóa',
  },
  {
    id: 'liver',
    name: 'Gan - Mật - Thải Độc',
    subName: 'Thải độc tố · Dự trữ năng lượng',
    topicSlug: 'gan-mat-tuy',
    pageSlug: 'chuc-nang-gan',
    icon: '🌿',
    keywords: ['gan', 'mật', 'thải độc', 'tụy'],
    symptoms: 'Nóng trong, mệt mỏi sau ăn dầu mỡ, chuyển hóa lipid kém',
  },
  {
    id: 'endocrine',
    name: 'Nội Tiết & Tuyến Giáp',
    subName: 'Trao đổi chất · Cân bằng hormone',
    topicSlug: 'noi-tiet-chuyen-hoa',
    pageSlug: 'tong-quan-noi-tiet',
    icon: '🔬',
    keywords: ['nội tiết', 'tuyến giáp', 'hormone', 'trao đổi chất'],
    symptoms: 'Rối loạn giấc ngủ, mệt mỏi kéo dài, chuyển hóa năng lượng chậm',
  },
];

// 2. Dữ liệu Theo Hệ Cơ Quan (6 Hệ Y Khoa Chính)
export const ORGAN_SYSTEMS: OrganSystem[] = [
  {
    id: 'sys-locomotor',
    name: 'Hệ Cơ Xương Khớp',
    subName: 'Trục cột sống, khớp chi & chuỗi vận động',
    topicSlug: 'cot-song',
    icon: '🦴',
    keywords: ['cột sống', 'đĩa đệm', 'vai gáy', 'dây chằng'],
    symptoms: 'Thoái hóa, thoát vị, chèn ép thần kinh và sai lệch trục cơ học',
    regionsSummary: 'Cổ vai gáy · Đĩa đệm · Thắt lưng · Khớp chi',
  },
  {
    id: 'sys-digestive',
    name: 'Hệ Tiêu Hóa & Vi Sinh',
    subName: 'Chuyển hóa thức ăn & hàng rào ruột',
    topicSlug: 'tieu-hoa',
    icon: '🫀',
    keywords: ['tiêu hóa', 'dạ dày', 'đường ruột', 'men vi sinh'],
    symptoms: 'Đầy hơi khó tiêu, viêm niêm mạc, rối loạn khuẩn ruột',
    regionsSummary: 'Dạ dày · Ruột non · Đại tràng · Men vi sinh',
  },
  {
    id: 'sys-cellular',
    name: 'Tế Bào & Quản Trị Nước',
    subName: 'Môi trường sống tế bào & điện giải',
    topicSlug: 'nuoc',
    icon: '💧',
    keywords: ['nước', 'uống nước', 'điện giải', 'thẩm thấu'],
    symptoms: 'Mất cân bằng áp suất thẩm thấu, tế bào nhiễm độc, uể oải',
    regionsSummary: 'Nước nội bào · Điện giải · Cụm phân tử nhỏ',
  },
  {
    id: 'sys-detox',
    name: 'Gan - Mật - Thải Độc',
    subName: 'Bộ máy lọc độc & chuyển hóa năng lượng',
    topicSlug: 'gan-mat-tuy',
    icon: '🌿',
    keywords: ['gan', 'mật', 'thải độc', 'tụy'],
    symptoms: 'Quá tải độc tố, ứ trệ dịch mật, kháng insulin tế bào',
    regionsSummary: 'Nhu mô gan · Túi mật · Tuyến tụy nội tiết',
  },
  {
    id: 'sys-immune',
    name: 'Hệ Miễn Dịch & Tế Bào',
    subName: 'Lá chắn đề kháng & phản ứng kháng viêm',
    topicSlug: 'mien-dich',
    icon: '🛡️',
    keywords: ['miễn dịch', 'đề kháng', 'kháng thể', 'viêm'],
    symptoms: 'Dễ cảm cúm, vết thương lâu lành, phản ứng viêm mạn tính',
    regionsSummary: 'Bạch cầu · Hạch bạch huyết · Kháng thể tự nhiên',
  },
  {
    id: 'sys-endocrine',
    name: 'Nội Tiết & Chuyển Hóa',
    subName: 'Điều hòa hormone & trao đổi chất',
    topicSlug: 'noi-tiet-chuyen-hoa',
    icon: '🔬',
    keywords: ['nội tiết', 'tuyến giáp', 'hormone', 'trao đổi chất'],
    symptoms: 'Rối loạn nhịp sinh học, bốc hỏa, mệt mỏi trao đổi chất',
    regionsSummary: 'Tuyến giáp · Thượng thận · Hệ chuyển hóa',
  },
];

// 3. Dữ liệu Theo Triệu Chứng Thường Gặp (6 Vấn Đề Điển Hình)
export const COMMON_SYMPTOMS: HealthSymptom[] = [
  {
    id: 'symp-neck',
    name: 'Đau Mỏi Cổ Vai Gáy',
    subName: 'Dân văn phòng, nhìn điện thoại nhiều',
    topicSlug: 'cot-song',
    pageSlug: 'co-gan-day-chang',
    icon: '💥',
    keyword: 'vai gáy',
    relatedKeywords: ['cổ', 'vai gáy', 'đốt sống cổ', 'cơ thang'],
    hint: 'Căng cơ thang, cứng cổ khi xoay đầu, tê lan vai',
  },
  {
    id: 'symp-back',
    name: 'Đau Thắt Lưng Ngồi Lâu',
    subName: 'Áp lực đè nén đốt sống L4-L5',
    topicSlug: 'cot-song',
    pageSlug: 'tong-quan-ve-cot-song',
    icon: '⚡',
    keyword: 'thắt lưng',
    relatedKeywords: ['thắt lưng', 'cột sống', 'tư thế ngồi', 'giãn cơ'],
    hint: 'Mỏi ê ẩm vùng thắt lưng sau ca làm việc, cúi gập khó',
  },
  {
    id: 'symp-disc',
    name: 'Thoát Vị Đĩa Đệm',
    subName: 'Nhân nhầy phồng rách chèn rễ thần kinh',
    topicSlug: 'cot-song',
    pageSlug: 'dia-dem',
    icon: '🩻',
    keyword: 'đĩa đệm',
    relatedKeywords: ['đĩa đệm', 'thoát vị', 'nhân nhầy', 'chèn ép'],
    hint: 'Đau buốt nhói lan xuống mông và chân (đau thần kinh tọa)',
  },
  {
    id: 'symp-gut',
    name: 'Đầy Bụng Khó Tiêu',
    subName: 'Mất cân bằng men vi sinh đường ruột',
    topicSlug: 'tieu-hoa',
    pageSlug: 'tong-quan-tieu-hoa',
    icon: '🫄',
    keyword: 'tiêu hóa',
    relatedKeywords: ['tiêu hóa', 'dạ dày', 'đường ruột', 'men vi sinh'],
    hint: 'Bụng căng trướng sau ăn, ợ hơi, hấp thu chất dinh dưỡng kém',
  },
  {
    id: 'symp-water',
    name: 'Thiếu Nước Tế Bào',
    subName: 'Uống ít nước hoặc uống sai cách',
    topicSlug: 'nuoc',
    pageSlug: 'tam-quan-trong-cua-nuoc',
    icon: '💧',
    keyword: 'uống nước',
    relatedKeywords: ['uống nước', 'điện giải', 'thẩm thấu', 'tế bào'],
    hint: 'Khô môi miệng, nước tiểu sẫm màu, uể oải chậm tuần hoàn',
  },
  {
    id: 'symp-joint',
    name: 'Cứng Khớp & Tê Bì',
    subName: 'Khớp gối, cổ chân, tắc nghẽn chuỗi động',
    topicSlug: 'co-the-nguoi',
    pageSlug: 'khung-xuong',
    icon: '🏃',
    keyword: 'khớp',
    relatedKeywords: ['khung chậu', 'khớp gối', 'chuỗi động học', 'khớp háng'],
    hint: 'Cứng khớp buổi sáng, tiếng kêu lục cục khi đứng lên ngồi xuống',
  },
];

interface BodyMapNavigatorProps {
  onSelectKeyword?: (keyword: string) => void;
}

export default function BodyMapNavigator({ onSelectKeyword }: BodyMapNavigatorProps) {
  const router = useRouter();

  // Tab lọc chính: 'region' (Bộ phận) | 'system' (Hệ cơ quan) | 'symptom' (Triệu chứng)
  const [activeTab, setActiveTab] = useState<'region' | 'system' | 'symptom'>('region');

  // Mục đang được chọn để xem chi tiết
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion>(BODY_REGIONS[0]);
  const [selectedSystem, setSelectedSystem] = useState<OrganSystem>(ORGAN_SYSTEMS[0]);
  const [selectedSymptom, setSelectedSymptom] = useState<HealthSymptom>(COMMON_SYMPTOMS[0]);

  // Điều hướng hoặc tìm kiếm từ khóa
  const handleKeywordClick = (kw: string) => {
    if (onSelectKeyword) {
      onSelectKeyword(kw);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-[20px] bg-white dark:bg-[#0E1A33] border border-slate-200 dark:border-blue-900/50 p-3.5 sm:p-4 shadow-2xs transition-all">
      {/* 1. Tiêu đề khối & Chế độ xem 1 chạm */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-blue-950 text-[#0E2A5C] dark:text-sky-300 flex items-center justify-center text-[11px] font-black shrink-0">
            ✦
          </span>
          <h2 className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">
            Bản Đồ Cơ Thể Thông Minh
          </h2>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-blue-950/80 text-[#0284C7] dark:text-sky-300 border border-sky-200 dark:border-blue-800 shrink-0 whitespace-nowrap">
          Tra cứu 1 chạm
        </span>
      </div>

      {/* 2. Thanh 3 Tab thông minh: Theo Bộ Phận · Theo Hệ Cơ Quan · Theo Triệu Chứng */}
      <div className="flex items-center p-1 rounded-[14px] bg-slate-100/90 dark:bg-blue-950/60 border border-slate-200/60 dark:border-blue-900/40 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('region')}
          className={`flex-1 h-8 rounded-[11px] text-[11.5px] font-extrabold transition-all cursor-pointer truncate ${
            activeTab === 'region'
              ? 'bg-white dark:bg-[#0E2A5C] text-[#0E2A5C] dark:text-white shadow-2xs'
              : 'text-slate-600 dark:text-sky-200/70 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Theo Bộ Phận
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('system')}
          className={`flex-1 h-8 rounded-[11px] text-[11.5px] font-extrabold transition-all cursor-pointer truncate ${
            activeTab === 'system'
              ? 'bg-white dark:bg-[#0E2A5C] text-[#0E2A5C] dark:text-white shadow-2xs'
              : 'text-slate-600 dark:text-sky-200/70 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Theo Hệ
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('symptom')}
          className={`flex-1 h-8 rounded-[11px] text-[11.5px] font-extrabold transition-all cursor-pointer truncate ${
            activeTab === 'symptom'
              ? 'bg-white dark:bg-[#0E2A5C] text-[#0E2A5C] dark:text-white shadow-2xs'
              : 'text-slate-600 dark:text-sky-200/70 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Triệu Chứng
        </button>
      </div>

      {/* 3. Khung danh sách tương ứng với từng Tab */}
      {/* 3.1. Tab 1: Theo Bộ Phận Cơ Thể (8 Vùng) */}
      {activeTab === 'region' && (
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-1.5">
            {BODY_REGIONS.map((r) => {
              const isSelected = selectedRegion.id === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRegion(r)}
                  className={`h-11 px-2.5 rounded-[12px] border text-left flex items-center gap-2 transition-all cursor-pointer select-none active:scale-[0.98] ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-blue-950/80 border-[#0284C7] dark:border-sky-400 text-[#0E2A5C] dark:text-white shadow-2xs ring-1 ring-sky-400/40'
                      : 'bg-white dark:bg-[#0E1A33]/70 border-slate-200/90 dark:border-blue-900/40 text-slate-700 dark:text-sky-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[15px] shrink-0">{r.icon}</span>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11.5px] font-extrabold truncate block leading-tight">
                      {r.name}
                    </span>
                    <span className="text-[9.5px] text-slate-500 dark:text-slate-400 truncate block">
                      {r.subName.split('·')[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Hộp xem chi tiết bộ phận đang chọn (Mobile-First 1 dòng thông minh) */}
          <div className="p-3 rounded-[14px] bg-sky-50/80 dark:bg-blue-950/50 border border-sky-200 dark:border-blue-900/60 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px]">{selectedRegion.icon}</span>
                  <span className="text-[13px] font-black text-[#0E2A5C] dark:text-sky-200 truncate">
                    {selectedRegion.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    ({selectedRegion.subName})
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                  {selectedRegion.symptoms}
                </p>
              </div>

              {/* Nút vào bài học */}
              <Link
                href={
                  selectedRegion.pageSlug
                    ? `/${selectedRegion.topicSlug}/${selectedRegion.pageSlug}`
                    : `/${selectedRegion.topicSlug}`
                }
                className="h-7.5 px-2.5 rounded-[9px] bg-[#0E2A5C] dark:bg-sky-500 text-white dark:text-slate-950 text-[11px] font-extrabold flex items-center gap-1 shadow-2xs hover:opacity-90 active:scale-95 transition-all shrink-0 whitespace-nowrap"
              >
                <span>Học ngay</span>
                <ArrowRight size={11} />
              </Link>
            </div>

            {/* Từ khóa con liên quan của bộ phận (Chạm để tra bài tức thì) */}
            <div className="flex items-center gap-1.5 pt-0.5 border-t border-sky-200/60 dark:border-blue-900/50 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 shrink-0">
                Từ khóa:
              </span>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                {selectedRegion.keywords.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => handleKeywordClick(kw)}
                    className="h-6 px-2 rounded-full bg-white dark:bg-[#0E1A33] border border-sky-200 dark:border-blue-800 text-[10.5px] font-bold text-[#0E2A5C] dark:text-sky-200 hover:border-sky-500 cursor-pointer shadow-2xs transition-all active:scale-95"
                  >
                    #{kw}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3.2. Tab 2: Theo Hệ Cơ Quan (6 Hệ Y Khoa) */}
      {activeTab === 'system' && (
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-1.5">
            {ORGAN_SYSTEMS.map((s) => {
              const isSelected = selectedSystem.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSystem(s)}
                  className={`h-11 px-2.5 rounded-[12px] border text-left flex items-center gap-2 transition-all cursor-pointer select-none active:scale-[0.98] ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-blue-950/80 border-[#0284C7] dark:border-sky-400 text-[#0E2A5C] dark:text-white shadow-2xs ring-1 ring-sky-400/40'
                      : 'bg-white dark:bg-[#0E1A33]/70 border-slate-200/90 dark:border-blue-900/40 text-slate-700 dark:text-sky-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[15px] shrink-0">{s.icon}</span>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11.5px] font-extrabold truncate block leading-tight">
                      {s.name}
                    </span>
                    <span className="text-[9.5px] text-slate-500 dark:text-slate-400 truncate block">
                      {s.regionsSummary.split('·')[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Hộp xem chi tiết hệ cơ quan đang chọn */}
          <div className="p-3 rounded-[14px] bg-sky-50/80 dark:bg-blue-950/50 border border-sky-200 dark:border-blue-900/60 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px]">{selectedSystem.icon}</span>
                  <span className="text-[13px] font-black text-[#0E2A5C] dark:text-sky-200 truncate">
                    {selectedSystem.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                  {selectedSystem.symptoms}
                </p>
              </div>

              {/* Nút vào chuyên đề */}
              <Link
                href={`/${selectedSystem.topicSlug}`}
                className="h-7.5 px-2.5 rounded-[9px] bg-[#0E2A5C] dark:bg-sky-500 text-white dark:text-slate-950 text-[11px] font-extrabold flex items-center gap-1 shadow-2xs hover:opacity-90 active:scale-95 transition-all shrink-0 whitespace-nowrap"
              >
                <span>Mở hệ</span>
                <ArrowRight size={11} />
              </Link>
            </div>

            {/* Từ khóa hệ */}
            <div className="flex items-center gap-1.5 pt-0.5 border-t border-sky-200/60 dark:border-blue-900/50 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 shrink-0">
                Tra cứu:
              </span>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                {selectedSystem.keywords.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => handleKeywordClick(kw)}
                    className="h-6 px-2 rounded-full bg-white dark:bg-[#0E1A33] border border-sky-200 dark:border-blue-800 text-[10.5px] font-bold text-[#0E2A5C] dark:text-sky-200 hover:border-sky-500 cursor-pointer shadow-2xs transition-all active:scale-95"
                  >
                    #{kw}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3.3. Tab 3: Theo Triệu Chứng Thường Gặp (6 Vấn Đề) */}
      {activeTab === 'symptom' && (
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-1.5">
            {COMMON_SYMPTOMS.map((sym) => {
              const isSelected = selectedSymptom.id === sym.id;
              return (
                <button
                  key={sym.id}
                  type="button"
                  onClick={() => setSelectedSymptom(sym)}
                  className={`h-11 px-2.5 rounded-[12px] border text-left flex items-center gap-2 transition-all cursor-pointer select-none active:scale-[0.98] ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-blue-950/80 border-[#0284C7] dark:border-sky-400 text-[#0E2A5C] dark:text-white shadow-2xs ring-1 ring-sky-400/40'
                      : 'bg-white dark:bg-[#0E1A33]/70 border-slate-200/90 dark:border-blue-900/40 text-slate-700 dark:text-sky-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[15px] shrink-0">{sym.icon}</span>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11.5px] font-extrabold truncate block leading-tight">
                      {sym.name}
                    </span>
                    <span className="text-[9.5px] text-slate-500 dark:text-slate-400 truncate block">
                      #{sym.keyword}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Hộp xem chi tiết triệu chứng đang chọn */}
          <div className="p-3 rounded-[14px] bg-sky-50/80 dark:bg-blue-950/50 border border-sky-200 dark:border-blue-900/60 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px]">{selectedSymptom.icon}</span>
                  <span className="text-[13px] font-black text-[#0E2A5C] dark:text-sky-200 truncate">
                    {selectedSymptom.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                  {selectedSymptom.hint}
                </p>
              </div>

              {/* Nút tra bài ngay */}
              <button
                type="button"
                onClick={() => handleKeywordClick(selectedSymptom.keyword)}
                className="h-7.5 px-2.5 rounded-[9px] bg-[#0E2A5C] dark:bg-sky-500 text-white dark:text-slate-950 text-[11px] font-extrabold flex items-center gap-1 shadow-2xs hover:opacity-90 active:scale-95 transition-all shrink-0 whitespace-nowrap cursor-pointer"
              >
                <SearchIcon size={11} />
                <span>Tra ngay</span>
              </button>
            </div>

            {/* Các từ khóa liên quan */}
            <div className="flex items-center gap-1.5 pt-0.5 border-t border-sky-200/60 dark:border-blue-900/50 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 shrink-0">
                Từ khóa:
              </span>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                {selectedSymptom.relatedKeywords.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => handleKeywordClick(kw)}
                    className="h-6 px-2 rounded-full bg-white dark:bg-[#0E1A33] border border-sky-200 dark:border-blue-800 text-[10.5px] font-bold text-[#0E2A5C] dark:text-sky-200 hover:border-sky-500 cursor-pointer shadow-2xs transition-all active:scale-95"
                  >
                    #{kw}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
