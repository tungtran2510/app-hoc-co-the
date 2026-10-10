'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CircleHelp,
  ChevronDown,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Stethoscope,
  Activity,
  Layers,
  Shield,
  Zap,
  Bot,
} from 'lucide-react';
import { playTapSound } from '../lib/audioFeedback';
import { getAllTopicFaqGroups, MasterFaqCategory, MasterFaqItem, TopicFaqGroup } from '../data/topicFaqs';

export default function AllTopicsFaqHub() {
  const allGroups = useMemo(() => getAllTopicFaqGroups(), []);
  const [selectedTopicSlug, setSelectedTopicSlug] = useState<string>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // Tính tổng số câu hỏi trên toàn bộ hệ thống
  const totalSystemQuestions = useMemo(() => {
    return allGroups.reduce((acc, g) => acc + g.totalQuestions, 0);
  }, [allGroups]);

  // Lọc theo chuyên đề được chọn
  const displayedGroups = useMemo(() => {
    if (selectedTopicSlug === 'all') {
      return allGroups;
    }
    return allGroups.filter((g) => g.topicSlug === selectedTopicSlug);
  }, [allGroups, selectedTopicSlug]);

  const handleToggleFaq = (id: string) => {
    playTapSound();
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  const handleSelectTopicFilter = (slug: string) => {
    playTapSound();
    setSelectedTopicSlug(slug);
    setExpandedFaqId(null);
  };

  return (
    <section aria-labelledby="all-topics-faq-heading" className="mt-6 border-t border-slate-200/80 pt-6 dark:border-white/10">
      <div className="rounded-[24px] border border-[#D8E2F0] bg-gradient-to-b from-[#F7FAFD] via-[#F1F6FC] to-[#EEF4FB] p-3.5 sm:p-5 shadow-[0_12px_32px_-24px_rgba(24,52,103,0.45)] dark:border-white/10 dark:from-[#18122E] dark:via-[#140E27] dark:to-[#100A20]">
        
        {/* HEADER KHỐI FAQ */}
        <header className="mb-3.5 flex flex-col gap-1.5 px-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#214B91] dark:text-blue-300">
              <CircleHelp size={15} strokeWidth={2.5} className="shrink-0" />
              LÂM SÀNG & GIẢI ĐÁP TOÀN DIỆN
            </span>
            <span className="shrink-0 rounded-full border border-blue-200/90 bg-white/90 px-2.5 py-0.5 text-[11px] font-black text-[#214B91] shadow-2xs dark:border-blue-400/20 dark:bg-white/10 dark:text-blue-200">
              {totalSystemQuestions} câu hỏi
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <h2 id="all-topics-faq-heading" className="text-[17px] sm:text-[19px] font-black leading-tight text-[#0F172A] dark:text-white">
              Vấn đề thường gặp theo chuyên đề
            </h2>
            <p className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400">
              Hỏi đáp cơ chế bệnh lý, tự chăm sóc & hướng dẫn thực hành
            </p>
          </div>
        </header>

        {/* THANH LỌC DANH MỤC TRƯỢT NGANG (CATEGORY PILLS) */}
        <div
          role="tablist"
          aria-label="Lọc vấn đề thường gặp theo chuyên đề"
          className="mb-4 flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-3.5 px-3.5 sm:mx-0 sm:px-0"
        >
          {/* Nút Tất cả */}
          <button
            type="button"
            role="tab"
            aria-selected={selectedTopicSlug === 'all'}
            onClick={() => handleSelectTopicFilter('all')}
            className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-black transition-all active:scale-95 cursor-pointer ${
              selectedTopicSlug === 'all'
                ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white shadow-sm'
                : 'border-[#DCE5F2] bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200'
            }`}
          >
            <span>Tất cả</span>
            <span className={`text-[10px] ${selectedTopicSlug === 'all' ? 'text-blue-200' : 'text-slate-400'}`}>
              ({totalSystemQuestions})
            </span>
          </button>

          {/* Các chuyên đề */}
          {allGroups.map((g) => {
            const isSelected = selectedTopicSlug === g.topicSlug;
            return (
              <button
                key={g.topicSlug}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelectTopicFilter(g.topicSlug)}
                className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-black transition-all active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white shadow-sm'
                    : 'border-[#DCE5F2] bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200'
                }`}
              >
                <span>{g.topicIcon}</span>
                <span>{g.topicTitle}</span>
                <span className={`text-[10px] ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                  ({g.totalQuestions})
                </span>
              </button>
            );
          })}
        </div>

        {/* DANH SÁCH CÁC CHUYÊN ĐỀ & MỤC CÂU HỎI */}
        <div className="flex flex-col gap-5">
          {displayedGroups.map((group) => (
            <div key={group.topicSlug} className="flex flex-col gap-3">
              
              {/* Header của từng chuyên đề (Khi xem Tất cả hoặc xem từng chuyên đề) */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 pb-2 dark:border-white/10">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[14px] dark:bg-blue-900/40">
                    {group.topicIcon}
                  </span>
                  <div className="min-w-0 flex items-center gap-2">
                    <h3 className="text-[14px] sm:text-[15px] font-black text-[#0F172A] dark:text-white truncate">
                      {group.topicTitle}
                    </h3>
                    <span className="hidden sm:inline-block rounded-md bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 text-[10px] font-extrabold text-slate-600 dark:text-slate-300">
                      {group.topicBadge}
                    </span>
                  </div>
                </div>

                {group.topicSlug !== 'chung' && (
                  <Link
                    href={`/${group.topicSlug}`}
                    prefetch={true}
                    onClick={() => playTapSound()}
                    className="inline-flex shrink-0 items-center gap-1 text-[11px] font-black text-[#1E3A8A] hover:underline dark:text-blue-300 active:scale-95"
                  >
                    <span>Xem chuyên đề</span>
                    <ArrowRight size={12} strokeWidth={2.5} />
                  </Link>
                )}
              </div>

              {/* Các khối mục trong chuyên đề */}
              <div className="flex flex-col gap-3">
                {group.categories.map((category, catIdx) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    categoryIndex={catIdx + 1}
                    topicSlug={group.topicSlug}
                    expandedFaqId={expandedFaqId}
                    onToggleFaq={handleToggleFaq}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ==========================================
// COMPONENT CARD TỪNG MỤC CÂU HỎI (MỤC CON BẬC 1)
// MẶC ĐỊNH THU GỌN CÁC MỤC CON BÊN TRONG (CÂU HỎI)
// ==========================================
interface CategoryCardProps {
  category: MasterFaqCategory;
  categoryIndex: number;
  topicSlug: string;
  expandedFaqId: string | null;
  onToggleFaq: (id: string) => void;
}

function CategoryCard({
  category,
  categoryIndex,
  topicSlug,
  expandedFaqId,
  onToggleFaq,
}: CategoryCardProps) {
  const [isCategoryExpanded, setIsCategoryExpanded] = useState<boolean>(false);
  const indexFormatted = String(categoryIndex).padStart(2, '0');

  const handleToggleCategory = () => {
    playTapSound();
    setIsCategoryExpanded((prev) => !prev);
  };

  return (
    <div
      className={`rounded-[18px] border transition-all ${
        isCategoryExpanded
          ? 'border-blue-300/80 bg-white shadow-[0_6px_20px_-10px_rgba(30,58,138,0.15)] dark:border-blue-500/30 dark:bg-[#1B1630]'
          : 'border-slate-200/90 bg-white shadow-[0_4px_16px_-12px_rgba(15,23,42,0.08)] hover:border-blue-200/80 dark:border-white/10 dark:bg-[#1B1630]'
      } p-3 sm:p-4`}
    >
      {/* HEADER CỦA MỤC CON BẬC 1: BẤM ĐỂ MỞ / THU GỌN CÁC CÂU HỎI BÊN TRONG */}
      <button
        type="button"
        onClick={handleToggleCategory}
        className="w-full flex items-start justify-between gap-2.5 text-left cursor-pointer group active:scale-[0.99] transition-transform"
        aria-expanded={isCategoryExpanded}
      >
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[13px] font-black transition-colors ${
              isCategoryExpanded
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 group-hover:bg-blue-100'
            }`}
          >
            {indexFormatted}
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="text-[13.5px] sm:text-[14.5px] font-black leading-snug text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
              {category.title}
            </h4>
            {category.subtitle && (
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                {category.badge && (
                  <span className="rounded-[6px] bg-blue-50 px-1.5 py-0.5 text-[9px] font-extrabold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {category.badge}
                  </span>
                )}
                <p className="text-[11px] leading-tight text-slate-500 dark:text-slate-400">
                  {category.subtitle}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Góc phải: Số câu + Nút mũi tên xoay */}
        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
          <span
            className={`rounded-full border px-2 py-0.5 text-[9.5px] font-bold transition-colors ${
              isCategoryExpanded
                ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-900/30 dark:text-blue-300'
                : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
            }`}
          >
            {category.items.length} câu
          </span>
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 ${
              isCategoryExpanded
                ? 'rotate-180 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
                : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 dark:bg-white/10 dark:text-slate-400'
            }`}
          >
            <ChevronDown size={14} strokeWidth={2.5} />
          </span>
        </div>
      </button>

      {/* DANH SÁCH CÂU HỎI CON BÊN TRONG: CHỈ HIỂN THỊ KHI ĐƯỢC MỞ RỘNG (MẶC ĐỊNH THU GỌN) */}
      {isCategoryExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/10 flex flex-col gap-2 animate-fade-in">
          {category.items.map((item, itemIdx) => {
            const isExpanded = expandedFaqId === item.id;
            const qNumber = `Q${itemIdx + 1}`;

            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-[13px] border border-slate-100 bg-[#FBFDFF] transition-all dark:border-white/10 dark:bg-[#150F26]"
              >
                <button
                  type="button"
                  onClick={() => onToggleFaq(item.id)}
                  aria-expanded={isExpanded}
                  className="flex w-full min-h-[46px] items-center justify-between gap-2.5 px-3 py-2.5 text-left cursor-pointer hover:bg-slate-50/80 active:bg-slate-100/80 dark:hover:bg-white/5"
                >
                <div className="flex min-w-0 flex-1 items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-6 shrink-0 items-center justify-center rounded-[6px] bg-blue-100/70 text-[10px] font-black text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {qNumber}
                  </span>
                  <span className="text-[12.5px] sm:text-[13px] font-extrabold leading-snug text-slate-800 dark:text-slate-100">
                    {item.question}
                  </span>
                </div>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                    isExpanded
                      ? 'rotate-180 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-slate-400'
                  }`}
                >
                  <ChevronDown size={15} strokeWidth={2.5} />
                </span>
              </button>

              {/* NỘI DUNG MỞ RỘNG */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-white px-3.5 pb-3.5 pt-3 dark:border-white/10 dark:bg-[#1B1630]">
                  {/* Trả lời lâm sàng */}
                  <p className="whitespace-pre-line text-[12px] leading-relaxed text-slate-700 dark:text-slate-200">
                    {item.answer}
                  </p>

                  {/* KHỐI ĐIỂM CỐT LÕI (KEY TAKEAWAY) */}
                  {item.key_takeaway && (
                    <div className="mt-2.5 flex items-start gap-2 rounded-[11px] border border-amber-200/90 bg-amber-50/80 p-2.5 dark:border-amber-500/20 dark:bg-amber-950/20">
                      <Sparkles size={14} className="mt-0.5 shrink-0 fill-amber-500 text-amber-500" />
                      <p className="text-[11.5px] font-bold leading-snug text-amber-950 dark:text-amber-200">
                        <span className="font-black text-amber-800 dark:text-amber-300">Điểm cốt lõi:</span>{' '}
                        {item.key_takeaway}
                      </p>
                    </div>
                  )}

                  {/* NÚT HỌC BÀI LIÊN QUAN HOẶC XEM CHUYÊN ĐỀ */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    {item.related_lesson && (
                      <Link
                        href={`/${topicSlug}/${item.related_lesson.slug}${
                          item.related_lesson.video_index ? `?v=${item.related_lesson.video_index}` : ''
                        }`}
                        prefetch={true}
                        onClick={() => playTapSound()}
                        className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 text-[11px] font-black text-blue-700 transition-colors hover:bg-blue-100 active:scale-95 dark:border-blue-500/30 dark:bg-blue-900/30 dark:text-blue-200"
                      >
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white text-[9px]">
                          ▶
                        </span>
                        <span className="truncate max-w-[220px]">
                          {item.related_lesson.title}
                        </span>
                        <ArrowRight size={11} strokeWidth={2.5} />
                      </Link>
                    )}

                    {topicSlug !== 'chung' && !item.related_lesson && (
                      <Link
                        href={`/${topicSlug}`}
                        prefetch={true}
                        onClick={() => playTapSound()}
                        className="inline-flex min-h-[34px] items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 text-[11px] font-bold text-slate-700 transition-colors hover:bg-slate-100 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                      >
                        <span>Mở chuyên đề</span>
                        <ArrowRight size={11} strokeWidth={2.5} />
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    )}
  </div>
);
}

