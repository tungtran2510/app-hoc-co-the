'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, BookOpen, ChevronDown, ChevronRight, Clock3, Eye, EyeOff, HelpCircle, Pencil, Play, PlaySquare, Plus, Sparkles, Trash2 } from 'lucide-react';
import { Block, FaqResource, Page, Topic, Video } from '../lib/types';
import { getCompletedPages, getStoredXemTiep, XemTiepInfo } from '../lib/learningProgress';
import PageListClient from './PageListClient';
import { checkAdminStatus, canManageTopic } from '../lib/adminAuth';
import { deleteBlockApi, getAdminHeaders, saveBlockApi } from '../lib/apiAdmin';
import { generateUuid } from '../lib/uuid';
import EditBlockModal from './admin/EditBlockModal';
import VideoLessonLink from './VideoLessonLink';
import { playTapSound } from '../lib/audioFeedback';
import TopicHandbookModal from './TopicHandbookModal';
import AchievementBadgeCard from './AchievementBadgeCard';

interface TopicPageItem { page: Page; orderNumber: number; videoCount: number }
interface TopicFaqVideo { video: Video; index: number; pageSlug: string; pageId?: string; pageTitle?: string }
interface TopicFaqItem {
  id: string;
  question: string;
  answer: string;
  key_takeaway?: string;
  image_url?: string;
  resources?: FaqResource[];
  learning_answers?: Array<{
    id: string;
    text: string;
    target_topic_id?: string;
    target_page_id?: string;
    target_video_index?: number;
    video_links?: Array<{ id: string; target_topic_id: string; target_page_id: string; target_video_index: number }>;
    resolved_video_links?: Array<{ id: string; href: string; title: string; thumbnail_url?: string | null }>;
    target_url?: string;
    target_kind?: string;
    video_title?: string;
  }>;
}
interface TopicFaq {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  colorTheme?: string;
  iconName?: string;
  items: TopicFaqItem[];
}
type FaqBlock = Extract<Block, { type: 'faq' }>;
interface ManagedFaqBlock extends FaqBlock {
  page_title: string;
  page_slug: string;
  page_sort_order: number;
  videos: TopicFaqVideo[];
}
interface TopicVideoOption { key: string; page_id: string; page_title: string; page_slug: string; topic_id: string; topic_title: string; topic_slug: string; video: Video; index: number }

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
  const [showHandbookModal, setShowHandbookModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [faqManagerOpen, setFaqManagerOpen] = useState(false);
  const [managedFaqBlocks, setManagedFaqBlocks] = useState<ManagedFaqBlock[]>([]);
  const [faqPages, setFaqPages] = useState<Page[]>([]);
  const [faqVideos, setFaqVideos] = useState<TopicVideoOption[]>([]);
  const [faqManagerLoading, setFaqManagerLoading] = useState(false);
  const [faqManagerLoaded, setFaqManagerLoaded] = useState(false);
  const [faqError, setFaqError] = useState('');
  const [editingFaqBlock, setEditingFaqBlock] = useState<FaqBlock | null>(null);

  useEffect(() => {
    const handleProgress = () => {
      setResume(getStoredXemTiep());
      setCompletedIds(getCompletedPages());
    };
    handleProgress();
    checkAdminStatus().then((status) => {
      setIsAdmin(status.isAdmin && (canManageTopic(topic.id, status.user) || canManageTopic(topic.slug, status.user)));
    });
    window.addEventListener('learning_progress_changed', handleProgress);
    return () => window.removeEventListener('learning_progress_changed', handleProgress);
  }, [topic.id, topic.slug]);

  const loadFaqManager = async () => {
    setFaqManagerLoading(true);
    setFaqError('');
    try {
      const response = await fetch(`/api/admin/topic-faqs?topicId=${encodeURIComponent(topic.id)}`, { headers: getAdminHeaders(), cache: 'no-store' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Không tải được FAQ của chuyên đề');
      setManagedFaqBlocks((data.blocks || []).filter((block: ManagedFaqBlock) => block.data.faq_surface !== 'overview'));
      setFaqPages(data.pages || []);
      setFaqVideos(data.videos || []);
      setFaqManagerLoaded(true);
    } catch (error) {
      setFaqError(error instanceof Error ? error.message : 'Không tải được FAQ của chuyên đề');
    } finally {
      setFaqManagerLoading(false);
    }
  };

  const displayedFaqs: TopicFaq[] = useMemo(() => {
    if (!faqManagerLoaded) return faqs;
    return managedFaqBlocks.filter((block) => block.is_visible && block.data.faq_surface !== 'overview').flatMap((block) => {
      const items: TopicFaqItem[] = (block.data.items || []).filter((item) => item.is_visible !== false && (item.question.trim() || item.answer.trim()))
        .map((item) => ({ ...item, id: `${block.id}-${item.id}`, learning_answers: (item.learning_answers || []).map((answer) => {
          const video = faqVideos.find((entry) => entry.page_id === answer.target_page_id && entry.index === answer.target_video_index);
          const resolved_video_links = (answer.video_links || []).flatMap((linked) => {
            const linkedVideo = faqVideos.find((entry) => entry.page_id === linked.target_page_id && entry.index === linked.target_video_index);
            return linkedVideo ? [{ id: linked.id, href: `/${topic.slug}/${linkedVideo.page_slug}?v=${linkedVideo.index}`, title: linkedVideo.video.title || `Video ${linkedVideo.index}`, thumbnail_url: linkedVideo.video.thumbnail_url }] : [];
          });
          return { ...answer, resolved_video_links, target_url: video ? `/${topic.slug}/${video.page_slug}?v=${video.index}` : answer.target_topic_id === topic.id ? `/${topic.slug}` : undefined, target_kind: video ? 'video' : answer.target_topic_id === topic.id ? 'topic' : undefined, video_title: video?.video.title || (video ? `Video ${video.index}` : undefined) };
        }) }));
      if (!items.length) return [];
      return [{ id: block.id, title: block.data.title || 'Vấn đề thường gặp', items }];
    });
  }, [faqManagerLoaded, managedFaqBlocks, faqVideos, faqs, topic.slug]);

  const handleSaveFaqBlock = async (updatedBlock: Block): Promise<boolean> => {
    if (updatedBlock.type !== 'faq') return false;
    const result = await saveBlockApi(updatedBlock);
    if (!result.success) {
      setFaqError(result.error || 'Chưa lưu được khối câu hỏi');
      return false;
    }
    setManagedFaqBlocks((current) => {
      const existing = current.some((block) => block.id === updatedBlock.id);
      const page = faqPages.find((item) => item.id === updatedBlock.page_id);
      const nextBlock: ManagedFaqBlock = {
        ...updatedBlock,
        page_title: page?.title || 'Bài học',
        page_slug: page?.slug || '',
        page_sort_order: page?.sort_order || 0,
        videos: current.find((block) => block.id === updatedBlock.id)?.videos || [],
      };
      return existing ? current.map((block) => block.id === updatedBlock.id ? nextBlock : block) : [...current, nextBlock];
    });
    setFaqManagerLoaded(true);
    setFaqError('');
    return true;
  };

  const handleAddFaqBlock = () => {
    const anchorPageId = faqPages[0]?.id;
    if (!anchorPageId) return;
    const page = faqPages.find((item) => item.id === anchorPageId);
    if (!page) return;
    const block: FaqBlock = {
      id: generateUuid(),
      page_id: page.id,
      type: 'faq',
      display_style: 'accordion',
      sort_order: managedFaqBlocks.filter((item) => item.page_id === page.id).length + 1,
      is_visible: true,
      data: { title: 'Vấn đề thường gặp', faq_surface: 'topic', items: [{ id: generateUuid(), question: '', answer: '', is_visible: true, learning_answers: [] }] },
    };
    setEditingFaqBlock(block);
  };

  const handleAddFaqQuestion = () => {
    const topicBlock = managedFaqBlocks.find((block) => block.data.faq_surface !== 'overview');
    if (!topicBlock) {
      handleAddFaqBlock();
      return;
    }
    setEditingFaqBlock({
      ...topicBlock,
      data: {
        ...topicBlock.data,
        faq_surface: 'topic',
        items: [...topicBlock.data.items, { id: generateUuid(), question: '', answer: '', is_visible: true, learning_answers: [] }],
      },
    });
  };

  const handleToggleFaqBlock = async (block: ManagedFaqBlock) => {
    const updated = { ...block, is_visible: !block.is_visible };
    const result = await saveBlockApi(updated);
    if (!result.success) {
      setFaqError(result.error || 'Chưa cập nhật được trạng thái hiển thị');
      return;
    }
    setManagedFaqBlocks((current) => current.map((item) => item.id === block.id ? updated : item));
  };

  const handleDeleteFaqBlock = async (block: ManagedFaqBlock) => {
    if (!window.confirm(`Xóa khung FAQ trong bài “${block.page_title}”?`)) return;
    const result = await deleteBlockApi(block.id);
    if (!result.success) {
      setFaqError(result.error || 'Chưa xóa được khung FAQ');
      return;
    }
    setManagedFaqBlocks((current) => current.filter((item) => item.id !== block.id));
  };

  const visiblePages = pages.filter(({ page }) => page.is_visible && page.status === 'published');
  const progress = visiblePages.length ? Math.min(100, Math.round((completedIds.filter((id) => visiblePages.some(({ page }) => page.id === id)).length / visiblePages.length) * 100)) : 0;
  const completedCount = completedIds.filter((id) => visiblePages.some(({ page }) => page.id === id)).length;
  const cleanTopicSlug = topic.slug.replace('cot-song-that-lung', 'cot-song');
  const resumeTopicSlug = (resume?.topic_slug || '').replace('cot-song-that-lung', 'cot-song');
  const continuePage = resumeTopicSlug === cleanTopicSlug ? resume : null;
  const firstPage = visiblePages[0]?.page;
  const actionHref = continuePage?.page_slug
    ? `/${topic.slug}/${continuePage.page_slug}?v=${continuePage.video_index || 1}`
    : firstPage ? `/${topic.slug}/${firstPage.slug}` : `/${topic.slug}`;
  const cover = topic.cover_url || `/images/topics/${topic.slug}.webp`;

  return (
    <>
      <section className="overflow-hidden rounded-[16px] border border-[#CAD5E5] bg-gradient-to-br from-white via-[#FAFBFE] to-[#F2F6FC] p-2 sm:p-3 shadow-[0_6px_20px_-16px_rgba(30,58,138,.35)] dark:border-[#55436F] dark:from-[#1A1236] dark:via-[#17102D] dark:to-[#100B20] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,.045),0_10px_22px_-16px_rgba(0,0,0,.8)]">
        <div className="grid grid-cols-[76px_1fr] sm:grid-cols-[96px_1fr] items-center gap-2 sm:gap-3">
          <div className="relative w-[76px] h-[76px] sm:w-[96px] sm:h-[96px] aspect-square overflow-hidden rounded-[12px] border border-white/80 bg-[#101D43] shadow-[0_4px_10px_-6px_rgba(0,0,0,.45)] dark:border-white/15 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt={topic.title} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 py-0 flex flex-col justify-center">
            <div className="flex items-center justify-between gap-1 flex-nowrap">
              <span className="inline-flex rounded-full bg-[#F4C94E] px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-[#16264A] shrink-0">
                Chuyên đề đào tạo
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                Tác giả: <strong className="text-slate-800 dark:text-white">Tùng Dinh Dưỡng</strong>
              </span>
            </div>
            <h1 className="mt-0.5 text-[17px] sm:text-[22px] font-black uppercase leading-[1.12] tracking-tight text-[#101B38] dark:text-white truncate">
              {topic.title}
            </h1>
            {topic.description && (
              <p className="mt-0.5 line-clamp-1 text-[10px] leading-tight text-slate-600 dark:text-slate-300 sm:text-[12px]">
                {topic.description}
              </p>
            )}
            <div className="mt-1 flex items-center gap-1 sm:gap-1.5 flex-nowrap text-[9px] sm:text-[10px] font-bold text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-1 rounded-[6px] bg-white/90 dark:bg-white/10 px-1.5 py-0.5 border border-slate-200 dark:border-white/10 shrink-0 whitespace-nowrap">
                <BookOpen size={9} className="text-blue-600 shrink-0" />{visiblePages.length} bài
              </span>
              <span className="inline-flex items-center gap-1 rounded-[6px] bg-white/90 dark:bg-white/10 px-1.5 py-0.5 border border-slate-200 dark:border-white/10 shrink-0 whitespace-nowrap">
                <PlaySquare size={9} className="text-emerald-600 shrink-0" />{totalVideos} video
              </span>
              <span className="inline-flex items-center gap-1 rounded-[6px] bg-white/90 dark:bg-white/10 px-1.5 py-0.5 border border-slate-200 dark:border-white/10 shrink-0 whitespace-nowrap">
                <Clock3 size={9} className="text-amber-600 shrink-0" />~{totalVideos * 5}p
              </span>
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 border-t border-slate-200/60 pt-2 dark:border-white/10">
          <div className="min-w-0 flex-1 rounded-[10px] bg-white/80 px-2 py-1 dark:bg-white/5">
            <div className="flex items-center justify-between gap-1.5 text-[9.5px] sm:text-[10px] font-bold text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-1">
                <BarChart3 size={11} className={continuePage ? 'text-amber-500' : ''} />
                {completedCount > 0 ? 'Tiến độ' : continuePage ? 'Đang học dở' : 'Tiến độ'}
              </span>
              <span>
                {completedCount > 0
                  ? `${completedCount}/${visiblePages.length} bài`
                  : continuePage
                  ? `Bài ${String(continuePage.page_number || 1).padStart(2, '0')}/${String(visiblePages.length).padStart(2, '0')}`
                  : `0/${visiblePages.length}`}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-black/30">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#F5B923] to-[#F6D86F] transition-[width]"
                style={{
                  width: `${
                    progress > 0
                      ? progress
                      : continuePage
                      ? Math.min(90, Math.max(16, Math.round(((continuePage.page_number || 1) / visiblePages.length) * 100 * 0.5)))
                      : 0
                  }%`
                }}
              />
            </div>
          </div>
          <Link
            href={actionHref}
            prefetch={true}
            onClick={playTapSound}
            className="flex h-[34px] sm:h-[38px] shrink-0 items-center justify-center gap-1.5 rounded-[10px] bg-gradient-to-r from-[#204DA4] to-[#173B85] px-2.5 sm:px-3 text-[11px] sm:text-[12px] font-black text-white shadow-xs active:scale-[.98] cursor-pointer"
          >
            <Play size={13} fill="currentColor" />
            <span>{continuePage ? 'Tiếp tục học' : 'Bắt đầu học'}</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      <div role="tablist" aria-label="Nội dung chuyên đề" className="grid grid-cols-2 gap-2">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'path'}
          onClick={() => {
            playTapSound();
            setTab('path');
          }}
          className={`flex h-[38px] sm:h-[42px] items-center justify-center gap-1.5 rounded-[11px] text-[12px] font-black transition-colors cursor-pointer ${
            tab === 'path' ? 'bg-[#1E4697] text-white shadow-xs' : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300'
          }`}
        >
          <BookOpen size={15} />
          <span>Lộ trình ({visiblePages.length})</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'faq'}
          onClick={() => {
            playTapSound();
            setTab('faq');
          }}
          className={`flex h-[38px] sm:h-[42px] items-center justify-center gap-1.5 rounded-[11px] text-[12px] font-black transition-colors cursor-pointer ${
            tab === 'faq' ? 'bg-[#1E4697] text-white shadow-xs' : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300'
          }`}
        >
          <HelpCircle size={15} />
          <span>Vấn đề thường gặp</span>
          {displayedFaqs.reduce((sum, f) => sum + f.items.length, 0) > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[9.5px] font-bold ${
              tab === 'faq' ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-sky-950/80 text-blue-700 dark:text-sky-300'
            }`}>
              {displayedFaqs.reduce((sum, f) => sum + f.items.length, 0)}
            </span>
          )}
        </button>
      </div>

      {tab === 'path' ? (
        <div className="flex flex-col gap-3">
          <PageListClient initialPages={pages} topic={topic} />

          {/* Cẩm Nang Y Khoa & Mã QR (Đồng bộ màu sắc Midnight Navy & Electric Cyan cùng Huy hiệu) */}
          <button
            type="button"
            onClick={() => {
              playTapSound();
              setShowHandbookModal(true);
            }}
            className="w-full h-11 flex items-center justify-between gap-1.5 px-3 rounded-[14px] bg-gradient-to-r from-[#0B1528] via-[#102244] to-[#0A1628] border border-sky-500/40 shadow-[0_4px_16px_-4px_rgba(14,42,92,0.35)] hover:border-cyan-400/70 active:scale-[0.99] transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-[#0284C7] to-[#2563EB] text-white flex items-center justify-center font-bold text-[13px] shrink-0 shadow-2xs border border-sky-300/30">
                📚
              </span>
              <span className="text-[12.5px] font-black text-white shrink-0">
                Cẩm nang y khoa
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-cyan-300 border border-cyan-400/30 shrink-0 shadow-2xs">
                Mã QR ({visiblePages.length} bài)
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-black text-white bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-1 rounded-[8px] shadow-sm shrink-0 whitespace-nowrap group-hover:brightness-110 transition-all">
              <span>Bản in A4</span>
              <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform text-white" />
            </div>
          </button>

          {/* Thẻ Huy Hiệu Hoàn Thành Chuyên Đề (Dưới cùng của lộ trình học, nổi bật & phong cách khác hẳn) */}
          <AchievementBadgeCard
            topicTitle={topic.title}
            topicSlug={topic.slug}
            progress={progress}
            completedLessons={completedIds.filter((id) => visiblePages.some(({ page }) => page.id === id)).length}
            totalLessons={visiblePages.length}
            activeLessonNumber={continuePage?.page_number}
            className="mb-12"
          />
        </div>
      ) : (
        <section className="flex flex-col gap-3 mb-14" role="tabpanel">
          {/* Header Chuyên mục Vấn đề thường gặp */}
          <div className="flex items-center justify-between px-1 pt-1">
            <div>
              <span className="text-[9.5px] font-black uppercase tracking-wider text-blue-600 dark:text-sky-400">
                Lâm sàng & Giải đáp
              </span>
              <h2 className="text-[15px] sm:text-[17px] font-black text-slate-900 dark:text-white leading-tight">
                Vấn đề thường gặp theo từng mục
              </h2>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-sky-950/60 border border-blue-200/80 dark:border-sky-800/60 text-blue-700 dark:text-sky-300 font-extrabold text-[10.5px] shrink-0">
              {displayedFaqs.reduce((sum, f) => sum + f.items.length, 0)} câu hỏi
            </span>
          </div>

          {isAdmin && <div className="flex items-center justify-between gap-2 rounded-[14px] border border-blue-200 bg-blue-50/70 px-3 py-2 dark:border-blue-400/20 dark:bg-blue-950/20">
            <div className="min-w-0"><p className="text-[11px] font-extrabold text-blue-900 dark:text-blue-100">Quản lý vấn đề thường gặp</p><p className="text-[10px] text-blue-800/75 dark:text-blue-200/75">Mỗi câu hỏi có thể có nhiều hướng trả lời gắn với video bài học.</p></div>
            <button type="button" onClick={() => { const next = !faqManagerOpen; setFaqManagerOpen(next); if (next && !faqManagerLoaded) void loadFaqManager(); }} className="flex h-8 shrink-0 items-center gap-1 rounded-[9px] bg-[#1E4697] px-2.5 text-[10px] font-extrabold text-white"><Pencil size={12} />{faqManagerOpen ? 'Đóng' : 'Quản lý'}</button>
          </div>}
          {faqManagerOpen && isAdmin && <div className="flex flex-col gap-2 rounded-[16px] border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#170F2F]">
            <button type="button" onClick={handleAddFaqQuestion} disabled={!faqPages.length} className="flex h-9 w-full items-center justify-center gap-1 rounded-[9px] bg-[#1E4697] px-2.5 text-[11px] font-extrabold text-white disabled:opacity-50"><Plus size={14} />Thêm câu hỏi</button>
            {faqManagerLoading && <p className="py-2 text-center text-[11px] text-slate-500">Đang tải cấu hình FAQ…</p>}
            {!faqManagerLoading && managedFaqBlocks.length === 0 && <p className="py-2 text-center text-[11px] text-slate-500 dark:text-slate-400">Chưa có vấn đề thường gặp. Thêm khung mới để nhập câu hỏi và các hướng trả lời.</p>}
            {managedFaqBlocks.map((block) => {
              return <div key={block.id} className="flex flex-col gap-2.5 rounded-[13px] border border-slate-200 p-2.5 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-extrabold text-slate-800 dark:text-white">{block.data.title || 'Vấn đề thường gặp'}</p><p className="truncate text-[10px] text-slate-500 dark:text-slate-400">{(block.data.items || []).length} câu · {block.is_visible ? 'Đang hiện' : 'Đang ẩn'}</p></div>
                        <button type="button" onClick={() => setEditingFaqBlock(block)} title="Sửa tiêu đề, câu hỏi và hướng học" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-200"><Pencil size={14} /></button>
                  <button type="button" onClick={() => void handleToggleFaqBlock(block)} title={block.is_visible ? 'Ẩn khung' : 'Hiện khung'} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200">{block.is_visible ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                  <button type="button" onClick={() => void handleDeleteFaqBlock(block)} title="Xóa khung FAQ" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-300"><Trash2 size={14} /></button>
                </div>
              </div>;
            })}
            {faqError && <p role="alert" className="rounded-[9px] bg-red-50 px-2.5 py-2 text-[11px] font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-200">{faqError}</p>}
          </div>}

          {/* Danh sách từng MỤC lớn */}
          {displayedFaqs.length ? displayedFaqs.map((faq, catIdx) => (
            <article
              key={faq.id}
              className="overflow-hidden rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#150F2C] shadow-2xs"
            >
              {/* Header của từng MỤC */}
              <header className="border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-slate-50 via-blue-50/20 to-transparent dark:from-white/[0.04] dark:to-transparent px-3.5 py-3">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-[10px] bg-blue-600/10 dark:bg-sky-500/20 text-blue-700 dark:text-sky-300 flex items-center justify-center shrink-0 mt-0.5 font-black text-[13px] border border-blue-500/20 shadow-2xs">
                      {String(catIdx + 1).padStart(2, '0')}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-[13px] sm:text-[14px] font-black leading-snug text-slate-900 dark:text-white">
                          {faq.title}
                        </h3>
                        {faq.badge && (
                          <span className="px-2 py-0.5 rounded-[6px] bg-blue-100 dark:bg-sky-950/80 text-blue-800 dark:text-sky-200 font-bold text-[9px]">
                            {faq.badge}
                          </span>
                        )}
                      </div>
                      {faq.subtitle && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {faq.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {faq.items.length} câu
                  </span>
                </div>
              </header>

              {/* Danh sách câu hỏi trong MỤC */}
              <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/60 p-1.5 sm:p-2">
                {faq.items.map((item, qIdx) => {
                  const itemKey = `${faq.id}:${item.id}`;
                  const isOpen = openFaq === itemKey;
                  return (
                    <div key={item.id} className="transition-colors rounded-[12px] overflow-hidden">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => {
                          playTapSound();
                          setOpenFaq(isOpen ? null : itemKey);
                        }}
                        className={`flex min-h-[46px] w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer ${
                          isOpen ? 'bg-blue-50/50 dark:bg-white/[0.03]' : 'hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-[9.5px] shrink-0 mt-0.5">
                            Q{qIdx + 1}
                          </span>
                          <span className="text-[12.5px] font-black text-slate-900 dark:text-white leading-snug">
                            {item.question}
                          </span>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 bg-blue-100 text-blue-700 dark:bg-sky-950 dark:text-sky-300' : 'bg-slate-100 text-slate-400 dark:bg-white/10'
                        }`}>
                          <ChevronDown size={14} strokeWidth={2.5} />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-3 pb-3 pt-1 text-[12px] leading-relaxed text-slate-700 dark:text-slate-300 border-t border-slate-100/80 dark:border-slate-800/60 bg-slate-50/40 dark:bg-white/[0.015]">
                          {/* Nội dung câu trả lời */}
                          <div className="whitespace-pre-line leading-relaxed pl-7 py-1 text-[11.5px] sm:text-[12px]">
                            {item.answer}
                          </div>

                          {/* Điểm cốt lõi rút ra (Key Takeaway) nếu có */}
                          {item.key_takeaway && (
                            <div className="mt-2.5 ml-7 p-2.5 rounded-[10px] bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-start gap-2">
                              <Sparkles size={14} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                              <div className="text-[11px] text-amber-900 dark:text-amber-200 font-bold leading-snug">
                                <span className="font-black text-amber-800 dark:text-amber-300">Điểm cốt lõi: </span>
                                {item.key_takeaway}
                              </div>
                            </div>
                          )}

                          {/* Liên kết tới video bài học liên quan */}
                          {!!item.learning_answers?.length && (
                            <div className="mt-2.5 ml-7 flex flex-col gap-1.5">
                              {item.learning_answers.map((answer) => {
                                const href = answer.target_url;
                                if (!href) return null;
                                return (
                                  <Link
                                    key={answer.id}
                                    href={href}
                                    onClick={playTapSound}
                                    className="inline-flex items-center gap-2 p-2 rounded-[10px] bg-blue-50 hover:bg-blue-100/80 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 border border-blue-200/80 dark:border-blue-800/60 text-blue-800 dark:text-sky-300 text-[11px] font-extrabold transition-all group active:scale-[0.99] w-fit"
                                  >
                                    <div className="w-5 h-5 rounded-[6px] bg-blue-600 text-white flex items-center justify-center shrink-0">
                                      <Play size={10} fill="currentColor" />
                                    </div>
                                    <span className="truncate">
                                      {answer.video_title || 'Xem bài giảng chi tiết liên quan'}
                                    </span>
                                    <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          )) : !faqManagerOpen && (
            <div className="rounded-[16px] border border-slate-200 bg-white p-4 text-[13px] text-slate-500 dark:border-white/10 dark:bg-[#170F2F] dark:text-slate-300 text-center">
              Chuyên đề này đang được cập nhật câu hỏi thường gặp.
            </div>
          )}
        </section>
      )}
                      {editingFaqBlock && <EditBlockModal isOpen onClose={() => setEditingFaqBlock(null)} block={editingFaqBlock} onSaveBlock={handleSaveFaqBlock} faqTopicOptions={[{ id: topic.id, title: topic.title }]} faqVideoOptions={faqVideos.map((entry) => ({ key: entry.key, page_id: entry.page_id, page_title: entry.page_title, video_title: entry.video.title || `Video ${entry.index}`, thumbnail_url: entry.video.thumbnail_url, index: entry.index, topic_id: entry.topic_id, topic_title: entry.topic_title }))} />}
      {showHandbookModal && (
        <TopicHandbookModal
          isOpen={true}
          onClose={() => setShowHandbookModal(false)}
          topic={topic}
          pages={visiblePages}
        />
      )}
    </>
  );
}
