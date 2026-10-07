'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, BookOpen, ChevronDown, Clock3, Eye, EyeOff, HelpCircle, Pencil, Play, PlaySquare, Plus, Trash2 } from 'lucide-react';
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

interface TopicPageItem { page: Page; orderNumber: number; videoCount: number }
interface TopicFaqVideo { video: Video; index: number; pageSlug: string; pageId?: string; pageTitle?: string }
interface TopicFaqItem { id: string; question: string; answer: string; image_url?: string; resources?: FaqResource[]; learning_answers?: Array<{ id: string; text: string; target_topic_id?: string; target_page_id: string; target_video_index: number; video_links?: Array<{ id: string; target_topic_id: string; target_page_id: string; target_video_index: number }>; resolved_video_links?: Array<{ id: string; href: string; title: string; thumbnail_url?: string | null }>; target_url?: string; target_kind?: string; video_title?: string }> }
interface TopicFaq { id: string; title: string; items: TopicFaqItem[] }
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
    setResume(getStoredXemTiep());
    setCompletedIds(getCompletedPages());
    checkAdminStatus().then((status) => {
      setIsAdmin(status.isAdmin && (canManageTopic(topic.id, status.user) || canManageTopic(topic.slug, status.user)));
    });
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

  const displayedFaqs = useMemo(() => {
    if (!faqManagerLoaded) return faqs;
    return managedFaqBlocks.filter((block) => block.is_visible && block.data.faq_surface !== 'overview').flatMap((block) => {
      const items = (block.data.items || []).filter((item) => item.is_visible !== false && (item.question.trim() || item.answer.trim()))
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
            <div className="mt-2 flex items-center gap-1.5 flex-nowrap text-[10px] font-bold text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-1 rounded-[7px] bg-white/90 dark:bg-white/10 px-2 py-0.5 border border-slate-200 dark:border-white/10 shrink-0 whitespace-nowrap">
                <BookOpen size={10} className="text-blue-600 shrink-0" />{visiblePages.length} bài
              </span>
              <span className="inline-flex items-center gap-1 rounded-[7px] bg-white/90 dark:bg-white/10 px-2 py-0.5 border border-slate-200 dark:border-white/10 shrink-0 whitespace-nowrap">
                <PlaySquare size={10} className="text-emerald-600 shrink-0" />{totalVideos} video
              </span>
              <span className="inline-flex items-center gap-1 rounded-[7px] bg-white/90 dark:bg-white/10 px-2 py-0.5 border border-slate-200 dark:border-white/10 shrink-0 whitespace-nowrap">
                <Clock3 size={10} className="text-amber-600 shrink-0" />~{totalVideos * 5}p
              </span>
            </div>
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-2.5 border-t border-slate-200/70 pt-2.5 dark:border-white/10">
          <div className="min-w-0 flex-1 rounded-[12px] bg-white/75 px-2 py-1.5 dark:bg-white/5">
            <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-300"><span className="inline-flex items-center gap-1"><BarChart3 size={12} />Tiến độ</span><span>{completedIds.filter((id) => visiblePages.some(({ page }) => page.id === id)).length}/{visiblePages.length}</span></div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-black/30"><div className="h-full rounded-full bg-gradient-to-r from-[#F5B923] to-[#F6D86F] transition-[width]" style={{ width: `${progress}%` }} /></div>
          </div>
          <Link href={actionHref} prefetch={true} onClick={playTapSound} className="flex min-h-[40px] shrink-0 items-center justify-center gap-1.5 rounded-[12px] bg-gradient-to-r from-[#204DA4] to-[#173B85] px-2.5 text-[11px] font-black text-white shadow-[0_6px_14px_-10px_rgba(30,58,138,.7)] active:scale-[.98] sm:px-4 sm:text-[13px] cursor-pointer">
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
        <div className="flex flex-col gap-3">
          <PageListClient initialPages={pages} topic={topic} />

          {/* Cẩm Nang Bỏ Túi & Mã QR (Xếp dưới cùng lộ trình học, chuẩn tinh gọn 1 dòng) */}
          <button
            type="button"
            onClick={() => {
              playTapSound();
              setShowHandbookModal(true);
            }}
            className="w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-[15px] bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-slate-50 dark:from-[#181033] dark:to-[#120B24] border border-blue-200/80 dark:border-purple-800/60 shadow-2xs hover:border-blue-400 active:scale-[0.99] transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-[10px] bg-blue-600 dark:bg-purple-600 text-white flex items-center justify-center font-bold text-[14px] shrink-0 shadow-2xs">
                📚
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-nowrap">
                  <span className="text-[13px] font-black text-slate-900 dark:text-white truncate">
                    Cẩm nang bỏ túi & Mã QR
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-purple-900/80 text-blue-700 dark:text-purple-200 shrink-0">
                    {visiblePages.length} bài
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  Bản in màu A4 chất lượng cao · Quét QR mở video tức thì
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-blue-700 dark:text-purple-300 bg-white dark:bg-purple-950 px-2.5 py-1.5 rounded-[9px] border border-blue-200/80 dark:border-purple-700/60 shadow-2xs shrink-0 whitespace-nowrap">
              <span>Xem ngay</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      ) : (
        <section className="flex flex-col gap-2.5" role="tabpanel">
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
          {displayedFaqs.length ? displayedFaqs.map((faq) => (
            <article key={faq.id} className="overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-[0_5px_18px_-16px_rgba(15,23,42,.55)] dark:border-white/10 dark:bg-[#170F2F]">
              <header className="border-b border-slate-100 bg-slate-50/70 px-3.5 py-3 dark:border-white/10 dark:bg-white/[.025]">
                <div className="flex items-center justify-between gap-2"><h3 className="text-[13px] font-extrabold leading-snug text-slate-900 dark:text-white">{faq.title}</h3><span className="shrink-0 text-[9px] font-bold text-slate-500 dark:text-slate-400">{faq.items.length} câu</span></div>
              </header>
              <div className="flex flex-col gap-1.5 p-2.5">
                {faq.items.map((item) => {
                  const itemKey = `${faq.id}:${item.id}`;
                  return <div key={item.id} className="overflow-hidden rounded-[11px] border border-slate-200 dark:border-white/10">
                    <button type="button" aria-expanded={openFaq === itemKey} onClick={() => setOpenFaq(openFaq === itemKey ? null : itemKey)} className="flex min-h-[44px] w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-[12px] font-extrabold text-slate-900 dark:text-white">
                      <span>{item.question}</span><ChevronDown size={16} className={`shrink-0 text-slate-400 transition-transform ${openFaq === itemKey ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === itemKey && <div className="border-t border-slate-100 px-3 py-2.5 dark:border-white/10">{item.answer && <p className="whitespace-pre-line text-[11.5px] leading-relaxed text-slate-600 dark:text-slate-300">{item.answer}</p>}
                      {item.image_url && <img src={item.image_url} alt="" loading="lazy" className="mt-2.5 max-h-64 w-full rounded-[10px] border border-slate-200 object-cover dark:border-white/10" />}
                      {!!item.learning_answers?.length && <div className="mt-3 flex flex-col gap-1.5">{item.learning_answers.map((answer, index) => {
                        const video = faqVideos.find((entry) => entry.page_id === answer.target_page_id && entry.index === answer.target_video_index);
                        const href = answer.target_url || (video ? `/${topic.slug}/${video.page_slug}?v=${video.index}` : undefined);
                        return <div key={answer.id} className="rounded-[9px] bg-blue-50/80 p-2.5 dark:bg-blue-950/20">{answer.text && <p className="text-[10px] font-bold leading-relaxed text-slate-700 dark:text-slate-200">{answer.text}</p>}{href && <div className={answer.text ? 'mt-2' : ''}>{answer.target_kind === 'topic' ? <Link href={href} className="inline-flex min-h-8 items-center gap-1 rounded-full border border-[#D7E3F3] bg-white px-3 text-[10.5px] font-bold text-[#234B8B] dark:border-white/10 dark:bg-white/5 dark:text-blue-200">Xem chuyên đề <span aria-hidden="true">›</span></Link> : <VideoLessonLink href={href} title={answer.video_title || video?.video.title || 'Mở video bài học'} thumbnailUrl={video?.video.thumbnail_url} />}</div>}{answer.resolved_video_links?.map((linked) => <VideoLessonLink key={linked.id} href={linked.href} title={linked.title} thumbnailUrl={linked.thumbnail_url} />)}</div>;
                      })}</div>}
                      {item.resources?.length ? <div className="mt-2.5 flex flex-col gap-1.5">{item.resources.map((resource, index) => <a key={`${item.id}-resource-${index}`} href={resource.url} target={/^https?:\/\//i.test(resource.url) ? '_blank' : undefined} rel={/^https?:\/\//i.test(resource.url) ? 'noreferrer' : undefined} className="flex min-w-0 items-center gap-2 rounded-[9px] border border-slate-100 bg-slate-50/80 p-1.5 text-slate-700 hover:border-blue-200 hover:bg-blue-50/70 dark:border-white/10 dark:bg-white/[.035] dark:text-slate-200 dark:hover:border-blue-400/30">{resource.thumbnail_url ? <img src={resource.thumbnail_url} alt="" loading="lazy" className="h-9 w-[52px] shrink-0 rounded-[6px] object-cover" /> : <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-200"><Play size={14} fill="currentColor" /></span>}<span className="min-w-0 flex-1 line-clamp-2 text-[10px] font-bold">{resource.title || resource.url}</span><ArrowRight size={14} className="shrink-0 text-blue-600 dark:text-blue-300" /></a>)}</div> : null}
                    </div>}
                  </div>;
                })}
              </div>
            </article>
          )) : !faqManagerOpen && <div className="rounded-[16px] border border-slate-200 bg-white p-4 text-[13px] text-slate-500 dark:border-white/10 dark:bg-[#170F2F] dark:text-slate-300">Chuyên đề này chưa có câu hỏi thường gặp.</div>}
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
