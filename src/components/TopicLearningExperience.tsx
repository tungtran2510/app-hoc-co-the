'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, BookOpen, ChevronDown, Clock3, HelpCircle, Play, PlaySquare } from 'lucide-react';
import { Page, Topic, Video } from '../lib/types';
import { getCompletedPages, getStoredXemTiep, XemTiepInfo } from '../lib/learningProgress';
import PageListClient from './PageListClient';

interface TopicPageItem { page: Page; orderNumber: number; videoCount: number }
interface TopicFaq { id: string; question: string; answer: string; pageTitle: string; videos: Array<{ video: Video; index: number; pageSlug: string }> }

export default function TopicLearningExperience({
  topic,
  pages,
  totalVideos,
  faqs,
}: {
  topic: Topic;
  pages: TopicPageItem[];
  totalVideos: number;
  faqs: TopicFaq[];
}) {
  const [tab, setTab] = useState<'path' | 'faq'>('path');
  const [resume, setResume] = useState<XemTiepInfo | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<string | null>(faqs[0]?.id || null);

  useEffect(() => {
    setResume(getStoredXemTiep());
    setCompletedIds(getCompletedPages());
  }, []);

  const visiblePages = pages.filter(({ page }) => page.is_visible && page.status === 'published');
  const progress = visiblePages.length ? Math.min(100, Math.round((completedIds.filter((id) => visiblePages.some(({ page }) => page.id === id)).length / visiblePages.length) * 100)) : 0;
  const continuePage = resume?.topic_slug === topic.slug ? resume : null;
  const firstPage = visiblePages[0]?.page;
  const actionHref = continuePage?.page_slug
    ? `/${topic.slug}/${continuePage.page_slug}?v=${continuePage.video_index || 1}`
    : firstPage ? `/${topic.slug}/${firstPage.slug}` : `/${topic.slug}`;
  const cover = topic.cover_url || `/images/topics/${topic.slug}.png`;

  return (
    <>
      <section className="overflow-hidden rounded-[20px] border-2 border-[#CAD5E5] bg-gradient-to-br from-white via-[#FAFBFE] to-[#F2F6FC] p-2.5 shadow-[0_10px_26px_-20px_rgba(30,58,138,.4)] dark:border-[#55436F] dark:from-[#1A1236] dark:via-[#17102D] dark:to-[#100B20] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,.045),0_12px_26px_-18px_rgba(0,0,0,.8)] sm:p-3">
        <div className="grid grid-cols-[minmax(92px,31%)_1fr] items-center gap-2.5 sm:gap-3.5">
          <div className="relative aspect-square overflow-hidden rounded-[15px] border border-white/80 bg-[#101D43] shadow-[0_5px_12px_-7px_rgba(0,0,0,.45)] dark:border-white/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt={topic.title} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 py-0.5">
            <span className="inline-flex rounded-full bg-[#F4C94E] px-2 py-0.5 text-[8px] font-black uppercase tracking-wide text-[#16264A]">Chuyên đề đào tạo</span>
            <h1 className="mt-1.5 text-[19px] font-black uppercase leading-[1.08] tracking-tight text-[#101B38] dark:text-white sm:text-[24px]">{topic.title}</h1>
            <p className="mt-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300">Tác giả: <strong className="text-slate-900 dark:text-white">Tùng Dinh Dưỡng</strong></p>
            {topic.description && <p className="mt-1.5 line-clamp-2 text-[10.5px] leading-snug text-slate-600 dark:text-slate-300 sm:text-[13px]">{topic.description}</p>}
            <div className="mt-2 grid grid-cols-3 gap-1">
              <span className="inline-flex min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-[9px] border border-slate-200 bg-white/90 px-1 py-1 text-[9px] font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"><BookOpen size={11} className="shrink-0" />{visiblePages.length} bài học</span>
              <span className="inline-flex min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-[9px] border border-slate-200 bg-white/90 px-1 py-1 text-[9px] font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"><PlaySquare size={11} className="shrink-0" />{totalVideos} video</span>
              <span className="inline-flex min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-[9px] border border-slate-200 bg-white/90 px-1 py-1 text-[9px] font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"><Clock3 size={11} className="shrink-0" />~{totalVideos * 5} phút</span>
            </div>
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-2.5 border-t border-slate-200/70 pt-2.5 dark:border-white/10">
          <div className="min-w-0 flex-1 rounded-[12px] bg-white/75 px-2 py-1.5 dark:bg-white/5">
            <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-300"><span className="inline-flex items-center gap-1"><BarChart3 size={12} />Tiến độ</span><span>{completedIds.filter((id) => visiblePages.some(({ page }) => page.id === id)).length}/{visiblePages.length}</span></div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-black/30"><div className="h-full rounded-full bg-gradient-to-r from-[#F5B923] to-[#F6D86F] transition-[width]" style={{ width: `${progress}%` }} /></div>
          </div>
          <Link href={actionHref} className="flex min-h-[40px] shrink-0 items-center justify-center gap-1.5 rounded-[12px] bg-gradient-to-r from-[#204DA4] to-[#173B85] px-2.5 text-[11px] font-black text-white shadow-[0_6px_14px_-10px_rgba(30,58,138,.7)] active:scale-[.98] sm:px-4 sm:text-[13px]">
            <Play size={15} fill="currentColor" />{continuePage ? 'Tiếp tục học' : 'Bắt đầu học'}<ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <div role="tablist" aria-label="Nội dung chuyên đề" className="grid grid-cols-2 gap-2">
        <button type="button" role="tab" aria-selected={tab === 'path'} onClick={() => setTab('path')} className={`flex min-h-[44px] items-center justify-center gap-2 rounded-[13px] text-[13px] font-black transition-colors ${tab === 'path' ? 'bg-[#1E4697] text-white shadow-md' : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300'}`}>
          <BookOpen size={17} /> Lộ trình
        </button>
        <button type="button" role="tab" aria-selected={tab === 'faq'} onClick={() => setTab('faq')} className={`flex min-h-[44px] items-center justify-center gap-2 rounded-[13px] text-[13px] font-black transition-colors ${tab === 'faq' ? 'bg-[#1E4697] text-white shadow-md' : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300'}`}>
          <HelpCircle size={17} /> Vấn đề thường gặp
        </button>
      </div>

      {tab === 'path' ? (
        <PageListClient initialPages={pages} topic={topic} />
      ) : (
        <section className="flex flex-col gap-2" role="tabpanel">
          {faqs.length ? faqs.map((faq) => (
            <article key={faq.id} className="overflow-hidden rounded-[15px] border border-slate-200 bg-white dark:border-white/10 dark:bg-[#170F2F]">
              <button type="button" aria-expanded={openFaq === faq.id} onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)} className="flex min-h-[50px] w-full items-center justify-between gap-3 px-3.5 py-3 text-left text-[13px] font-extrabold text-slate-900 dark:text-white">
                <span>{faq.question}</span><ChevronDown size={17} className={`shrink-0 text-slate-400 transition-transform ${openFaq === faq.id ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === faq.id && <div className="border-t border-slate-100 px-3.5 py-3 dark:border-white/10"><p className="mb-1 text-[10px] font-bold uppercase text-blue-700 dark:text-blue-300">{faq.pageTitle}</p><p className="whitespace-pre-line text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">{faq.answer}</p>
                {faq.videos.length > 0 && <div className="mt-3 border-t border-slate-100 pt-2.5 dark:border-white/10"><p className="mb-2 text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-300">Video gợi ý trong bài học</p><div className="flex flex-col gap-1.5">{faq.videos.map(({ video, index, pageSlug }) => <Link key={`${faq.id}-${index}`} href={`/${topic.slug}/${pageSlug}?v=${index}`} className="flex min-w-0 items-center gap-2 rounded-[11px] border border-slate-100 bg-slate-50/80 p-1.5 transition-colors hover:border-blue-200 hover:bg-blue-50/70 dark:border-white/10 dark:bg-white/[.035] dark:hover:border-blue-400/30 dark:hover:bg-blue-950/20"><div className="relative h-10 w-[58px] shrink-0 overflow-hidden rounded-[7px] bg-slate-200 dark:bg-slate-800">{video.thumbnail_url && <img src={video.thumbnail_url} alt="" className="h-full w-full object-cover" loading="lazy" />}<span className="absolute inset-0 flex items-center justify-center bg-black/20 text-white"><Play size={15} fill="currentColor" /></span></div><span className="min-w-0 flex-1 line-clamp-2 text-[11px] font-bold leading-snug text-slate-700 dark:text-slate-200">{video.title || `Video ${index}`}</span><ArrowRight size={15} className="shrink-0 text-blue-600 dark:text-blue-300" /></Link>)}</div></div>}
              </div>}
            </article>
          )) : <div className="rounded-[16px] border border-slate-200 bg-white p-4 text-[13px] text-slate-500 dark:border-white/10 dark:bg-[#170F2F] dark:text-slate-300">Chuyên đề này chưa có câu hỏi thường gặp.</div>}
        </section>
      )}
    </>
  );
}
