'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, ArrowUp, ArrowDown, Eye, EyeOff, Trash2, Check, X, BookOpen, LayoutGrid, Lightbulb, Search, SlidersHorizontal, Star, Flame, ChevronDown, CircleHelp, Play, Pencil } from 'lucide-react';
import TopicTile, { TopicsDisplayMode, TOPICS_DISPLAY_OPTIONS, topicsContainerClass } from './TopicTile';
import { DEFAULT_TOPIC_COVERS } from './TopicCard';
import { Block, Topic, TopicsGuide } from '../lib/types';
import { generateUuid } from '../lib/uuid';
import { playTapSound } from '../lib/audioFeedback';
import TopicsGuideModal from './TopicsGuideModal';
import { checkIsAdminClient } from '../lib/adminAuth';
import { getAdminHeaders, saveBlockApi, saveTopicApi, deleteTopicApi } from '../lib/apiAdmin';
import { saveSettingsApi } from '../lib/apiAdmin';
import EditTopicModal from './admin/EditTopicModal';
import EditBlockModal from './admin/EditBlockModal';
import VideoLessonLink from './VideoLessonLink';
import SectionOrderControls from './admin/SectionOrderControls';
import {
  getTopicDisplayPreferenceKey,
  getTopicDisplayPreferences,
  getUserPhone,
  saveTopicDisplayPreference,
  TopicDisplayScope,
} from '../lib/userSync';

interface TopicListClientProps {
  initialTopics: {
    topic: Topic;
    pageCount: number;
  }[];
  initialTopicsTitle?: string | null;
  sectionIndex?: number;
  totalSections?: number;
  isHidden?: boolean;
  onToggleVisibility?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onOpenReorderModal?: () => void;
  initialDisplay?: TopicsDisplayMode | null;
  hideViewAll?: boolean;
  enableSearch?: boolean;
  initialDescription?: string | null;
  initialGuide?: TopicsGuide | null;
  initialFeaturedTopicIds?: string[] | null;
  initialFaqs?: {
    id: string;
    blockId: string;
    itemId: string;
    block: Extract<Block, { type: 'faq' }>;
    question: string;
    answer: string;
    faqCategoryId: string;
    faqCategoryTitle: string;
    topicId: string;
    topicTitle: string;
    topicSlug: string;
    pageTitle: string;
    learningAnswers: { id: string; text: string; topicId: string; topicTitle: string; destinationType?: 'video' | 'topic'; href?: string; videoTitle: string; thumbnailUrl?: string | null; linkedVideos?: Array<{ href: string; title: string; thumbnailUrl?: string | null }> }[];
    videos: { title: string; thumbnailUrl?: string | null; href: string }[];
  }[];
  initialFaqVideos?: { key: string; page_id: string; page_title: string; page_slug: string; video_title: string; thumbnail_url?: string | null; index: number; topic_id: string; topic_title: string; topic_slug: string }[];
  initialFaqTopics?: { id: string; title: string }[];
  settingsScope?: 'home' | 'page';
}

export default function TopicListClient({
  initialTopics,
  initialTopicsTitle,
  sectionIndex,
  totalSections,
  isHidden,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  onOpenReorderModal,
  initialDisplay,
  hideViewAll = false,
  enableSearch = false,
  initialDescription,
  initialGuide,
  initialFeaturedTopicIds = [],
  initialFaqs = [],
  initialFaqVideos = [],
  initialFaqTopics = [],
  settingsScope = 'home',
}: TopicListClientProps) {
  const router = useRouter();
  const [topicsWithCounts, setTopicsWithCounts] = useState(initialTopics);
  const [topicsTitle, setTopicsTitle] = useState(
    initialTopicsTitle && initialTopicsTitle !== 'Chọn chủ đề' ? initialTopicsTitle : 'Chuyên Đề Học'
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(
    initialTopicsTitle && initialTopicsTitle !== 'Chọn chủ đề' ? initialTopicsTitle : 'Chuyên Đề Học'
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminResolved, setIsAdminResolved] = useState(false);
  const [userPhoneRevision, setUserPhoneRevision] = useState(0);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [displayMode, setDisplayMode] = useState<TopicsDisplayMode>(
    initialDisplay || (enableSearch || settingsScope === 'page' ? 'catalog' : 'card')
  );
  const [query, setQuery] = useState('');
  const [topicsDesc, setTopicsDesc] = useState(initialDescription || 'Hệ thống chuyên đề & bài học giải phẫu cơ thể');
  const [descDraft, setDescDraft] = useState(topicsDesc);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [guide, setGuide] = useState<TopicsGuide | null>(initialGuide || null);
  const [showGuide, setShowGuide] = useState(false);
  const [showDisplayMenu, setShowDisplayMenu] = useState(false);
  const [featuredTopicIds, setFeaturedTopicIds] = useState<string[]>(initialFeaturedTopicIds || []);
  const [topicFaqRows, setTopicFaqRows] = useState(initialFaqs);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState('all');
  const [editingFaqBlock, setEditingFaqBlock] = useState<Extract<Block, { type: 'faq' }> | null>(null);
  const [faqCategoryPickerOpen, setFaqCategoryPickerOpen] = useState(false);
  const [faqCategoryPickerAction, setFaqCategoryPickerAction] = useState<'category' | 'question'>('category');
  const [newFaqCategoryName, setNewFaqCategoryName] = useState('');
  const [faqSaveError, setFaqSaveError] = useState('');
  const lessonFetchStarted = React.useRef(false);
  // Tìm cả tên bài học: chỉ tải dữ liệu tìm kiếm một lần khi người dùng bắt đầu gõ
  const [lessonIndex, setLessonIndex] = useState<
    { id: string; title: string; slug: string; topic_slug: string; topic_title: string; page_number: number; summary: string | null }[] | null
  >(null);
  const displayOptions = enableSearch
    ? TOPICS_DISPLAY_OPTIONS.filter((opt) => ['card', 'logo', 'catalog'].includes(opt.value))
    : TOPICS_DISPLAY_OPTIONS;

  useEffect(() => setTopicFaqRows(initialFaqs), [initialFaqs]);

  const filteredFaqRows = useMemo(() => topicFaqRows.filter((faq) => selectedFaqCategory === 'all'
    ? true
    : faq.faqCategoryId === selectedFaqCategory), [topicFaqRows, selectedFaqCategory]);

  const faqCategories = useMemo(() => Array.from(new Map(topicFaqRows.map((faq) => [faq.faqCategoryId, faq.faqCategoryTitle])).entries()).map(([id, title]) => ({ id, title })), [topicFaqRows]);

  const handleAddFaqQuestion = async (categoryId: string) => {
    const category = faqCategories.find((item) => item.id === categoryId);
    if (!category) return;
    setFaqCategoryPickerOpen(false);
    setSelectedFaqCategory(categoryId);
    setFaqSaveError('');
    const existing = topicFaqRows.find((faq) => faq.faqCategoryId === categoryId)?.block;
    if (existing) {
      setEditingFaqBlock({ ...existing, data: { ...existing.data, items: [...existing.data.items, { id: generateUuid(), question: '', answer: '', is_visible: true, learning_answers: [] }] } });
      return;
    }
  };

  const handleCreateFaqCategory = async () => {
    const title = newFaqCategoryName.trim();
    if (!title) return;
    const duplicate = faqCategories.find((category) => category.title.toLocaleLowerCase() === title.toLocaleLowerCase());
    if (duplicate) {
      setNewFaqCategoryName('');
      setFaqCategoryPickerOpen(false);
      await handleAddFaqQuestion(duplicate.id);
      return;
    }
    const categoryId = generateUuid();
    const storageTopic = initialFaqTopics[0];
    if (!storageTopic) {
      setFaqSaveError('Chưa có bài học để lưu danh mục.');
      return;
    }
    setFaqSaveError('');
    try {
      const response = await fetch(`/api/admin/topic-faqs?topicId=${encodeURIComponent(storageTopic.id)}`, { headers: getAdminHeaders(), cache: 'no-store' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Không tải được dữ liệu để tạo danh mục');
      const page = result.pages?.[0];
      if (!page) throw new Error('Chưa có bài học để lưu danh mục.');
      const block: Extract<Block, { type: 'faq' }> = {
        id: generateUuid(), page_id: page.id, type: 'faq', display_style: 'accordion',
        sort_order: (result.blocks || []).filter((item: { page_id: string }) => item.page_id === page.id).length + 1,
        is_visible: true,
        data: { title: `Vấn đề thường gặp · ${title}`, faq_surface: 'overview', faq_category_id: categoryId, faq_category_title: title, items: [{ id: generateUuid(), question: '', answer: '', is_visible: true, learning_answers: [] }] },
      };
      setSelectedFaqCategory(categoryId);
      setFaqCategoryPickerOpen(false);
      setNewFaqCategoryName('');
      setEditingFaqBlock(block);
    } catch (error) {
      setFaqSaveError(error instanceof Error ? error.message : 'Không tạo được câu hỏi mới.');
    }
  };

  const handleSaveFaqBlock = async (block: Block): Promise<boolean> => {
    if (block.type !== 'faq') return false;
    const result = await saveBlockApi(block);
    if (!result.success) {
      setFaqSaveError(result.error || 'Chưa lưu được phần vấn đề thường gặp.');
      return false;
    }
    setFaqSaveError('');
    router.refresh();
    return true;
  };

  useEffect(() => {
    if (!enableSearch || lessonFetchStarted.current || query.trim().length < 2) return;
    lessonFetchStarted.current = true;
    fetch('/api/search')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.pages)) setLessonIndex(d.pages);
      })
      .catch(() => {
        lessonFetchStarted.current = false;
      });
  }, [enableSearch, query]);

  useEffect(() => {
    checkIsAdminClient().then((admin) => {
      setIsAdmin(admin);
      setIsAdminResolved(true);
    });
    if (initialTopicsTitle && initialTopicsTitle !== 'Chọn chủ đề') {
      setTopicsTitle(initialTopicsTitle);
    } else {
      setTopicsTitle('Chuyên Đề Học');
    }

    const handleTextsUpdated = (e: any) => {
      if (e.detail?.topicsTitle) {
        setTopicsTitle(e.detail.topicsTitle);
      }
    };
    window.addEventListener('home_texts_updated', handleTextsUpdated);
    return () => window.removeEventListener('home_texts_updated', handleTextsUpdated);
  }, [initialTopicsTitle]);

  useEffect(() => {
    const handleUserPhoneUpdated = () => setUserPhoneRevision((revision) => revision + 1);
    window.addEventListener('user_phone_updated', handleUserPhoneUpdated);
    return () => window.removeEventListener('user_phone_updated', handleUserPhoneUpdated);
  }, []);

  useEffect(() => {
    if (!isAdminResolved || isAdmin) return;
    setDisplayMode(initialDisplay || (enableSearch || settingsScope === 'page' ? 'catalog' : 'card'));
    const scope: TopicDisplayScope = settingsScope === 'page' ? 'page' : 'home';
    const preferenceKey = scope === 'page' ? 'topics_page_display' : 'home_topics_display';
    const phone = getUserPhone();
    const storageKey = getTopicDisplayPreferenceKey(scope, phone);
    const isSupportedMode = (value: string | null): value is TopicsDisplayMode =>
      Boolean(value && TOPICS_DISPLAY_OPTIONS.some((opt) => opt.value === value));

    try {
      const saved = window.localStorage.getItem(storageKey);
      if (isSupportedMode(saved)) setDisplayMode(saved);
    } catch {
      // Keep the admin-configured default if browser storage is unavailable.
    }

    if (!phone) return;
    let active = true;
    getTopicDisplayPreferences(phone).then(({ success, preferences }) => {
      if (!active || !success) return;
      const saved = preferences?.[preferenceKey];
      if (typeof saved !== 'string' || !isSupportedMode(saved)) return;
      setDisplayMode(saved);
      try {
        window.localStorage.setItem(storageKey, saved);
      } catch {
        // Cloud preference remains authoritative when local storage is unavailable.
      }
    });
    return () => { active = false; };
  }, [settingsScope, isAdmin, isAdminResolved, initialDisplay, userPhoneRevision]);

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= topicsWithCounts.length) return;

    const list = [...topicsWithCounts];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Chuẩn hóa và gán lại sort_order liên tục 1, 2, 3...
    const reordered = list.map((item, idx) => ({
      ...item,
      topic: {
        ...item.topic,
        sort_order: idx + 1,
      },
    }));

    setTopicsWithCounts(reordered);

    const [res1, res2] = await Promise.all([
      saveTopicApi(reordered[index].topic),
      saveTopicApi(reordered[targetIndex].topic),
    ]);
    if (!res1.success || !res2.success) {
      alert('Chưa lưu được – chưa kết nối dữ liệu');
      // Phục hồi lại vị trí cũ
      setTopicsWithCounts(topicsWithCounts);
    }
  };

  const handleToggleVisible = async (index: number) => {
    const list = [...topicsWithCounts];
    const item = list[index];
    const updated = {
      ...item.topic,
      is_visible: !item.topic.is_visible,
    };
    item.topic = updated;
    setTopicsWithCounts([...list]);
    const res = await saveTopicApi(updated);
    if (!res.success) {
      alert(res.error || 'Chưa lưu được – chưa kết nối dữ liệu');
      item.topic.is_visible = !item.topic.is_visible;
      setTopicsWithCounts([...list]);
    }
  };

  const handleDelete = async (topicId: string, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa chủ đề "${title}" không? Hành động này sẽ xóa cả các bài học bên trong.`)) {
      const res = await deleteTopicApi(topicId);
      if (res.success) {
        setTopicsWithCounts((prev) => prev.filter((t) => t.topic.id !== topicId));
      } else {
        alert(res.error || 'Chưa lưu được – chưa kết nối dữ liệu');
      }
    }
  };

  const handleSaved = (savedTopic: Topic) => {
    setTopicsWithCounts((prev) => {
      const idx = prev.findIndex(
        (t) => t.topic.id === savedTopic.id || (t.topic.slug && t.topic.slug === savedTopic.slug)
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], topic: savedTopic };
        return next;
      } else {
        return [...prev, { topic: savedTopic, pageCount: 0 }];
      }
    });
  };

  const handleSaveTitle = async () => {
    const trimmed = titleDraft.trim() || 'Chuyên Đề Học';
    setTopicsTitle(trimmed);
    setIsEditingTitle(false);
    await saveSettingsApi({ topics_title: trimmed });
  };

  const handleSaveDesc = async () => {
    const trimmed = descDraft.trim() || 'Hệ thống chuyên đề & bài học giải phẫu cơ thể';
    setTopicsDesc(trimmed);
    setIsEditingDesc(false);
    const res = await saveSettingsApi({ topics_description: trimmed });
    if (!res.success) {
      alert(res.error || 'Chưa lưu được – chưa kết nối dữ liệu');
    }
  };

  const handleChangeDisplay = async (mode: TopicsDisplayMode) => {
    const prev = displayMode;
    setDisplayMode(mode);
    const admin = isAdminResolved ? isAdmin : await checkIsAdminClient();
    if (admin !== isAdmin) {
      setIsAdmin(admin);
      setIsAdminResolved(true);
    }
    if (!admin) {
      const scope: TopicDisplayScope = settingsScope === 'page' ? 'page' : 'home';
      const phone = getUserPhone();
      try {
        window.localStorage.setItem(getTopicDisplayPreferenceKey(scope, phone), mode);
      } catch {
        // Continue with a cloud save for signed-in users.
      }
      if (phone && !(await saveTopicDisplayPreference(phone, scope, mode))) {
        alert('Đã đổi kiểu hiển thị trên thiết bị này nhưng chưa đồng bộ được với tài khoản. Vui lòng thử lại khi có kết nối.');
      }
      return;
    }
    const field = settingsScope === 'page' ? 'topics_page_display' : 'home_topics_display';
    const res = await saveSettingsApi({ [field]: mode });
    if (!res.success) {
      alert(res.error || 'Chưa lưu được – chưa kết nối dữ liệu');
      setDisplayMode(prev);
    }
  };

  const handleToggleFeatured = async (topicId: string) => {
    const previous = featuredTopicIds;
    const next = previous.includes(topicId)
      ? previous.filter((id) => id !== topicId)
      : [...previous, topicId];
    setFeaturedTopicIds(next);
    const res = await saveSettingsApi({ featured_topic_ids: next });
    if (!res.success) {
      setFeaturedTopicIds(previous);
      alert(res.error || 'Chưa lưu được chuyên đề nổi bật');
    }
  };

  return (
    <section className="flex flex-col gap-2 mt-1">
      {/* KHỐI NÚT ĐIỀU KHIỂN DÀNH CHO ADMIN - ĐẶT TRÊN ĐẦU KHỐI (FULL-WIDTH ADMIN BAR) */}
      {isAdmin && onMoveUp && onMoveDown && onOpenReorderModal && typeof sectionIndex === 'number' && typeof totalSections === 'number' && (
        <SectionOrderControls
          sectionTitle="CHUYÊN ĐỀ HỌC"
          sectionIndex={sectionIndex}
          totalSections={totalSections}
          isHidden={isHidden}
          onToggleVisibility={onToggleVisibility}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onOpenReorderModal={onOpenReorderModal}
          onEdit={() => setIsCreating(true)}
          editLabel="+ Thêm chuyên đề"
        />
      )}

      {/* Hàng 1: Tiêu đề chuyên đề học + Xem tất cả */}
      <div className="flex items-center justify-between gap-2">
        {isAdmin && isEditingTitle ? (
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <input
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') setIsEditingTitle(false);
              }}
              className="h-8 px-2.5 rounded-[8px] border border-primary bg-white dark:bg-[#1E1342] text-[15px] font-bold text-ink flex-1 min-w-0 shadow-2xs"
              placeholder="Tên chuyên đề..."
              autoFocus
            />
            <button
              type="button"
              onClick={handleSaveTitle}
              className="w-8 h-8 rounded-[8px] bg-primary text-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
              title="Lưu tên chuyên đề"
            >
              <Check size={16} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => setIsEditingTitle(false)}
              className="w-8 h-8 rounded-[8px] bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white flex items-center justify-center shrink-0 cursor-pointer"
              title="Hủy"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 shrink-0">
            <h2 className={`${enableSearch ? 'text-[25px] sm:text-[28px]' : 'text-[18px] sm:text-[19px]'} font-black text-ink tracking-tight leading-tight whitespace-nowrap`}>
              {topicsTitle || 'Chuyên Đề Học'}
            </h2>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setTitleDraft(topicsTitle || 'Chuyên Đề Học');
                  setIsEditingTitle(true);
                }}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-primary transition-colors cursor-pointer shrink-0"
                title="Sửa tiêu đề chuyên đề học"
              >
                <Edit2 size={13} />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 shrink-0">
          {!hideViewAll && enableSearch && (
            <Link
              href="/chuyen-de"
              prefetch={true}
              onClick={() => playTapSound()}
              className="text-[13px] font-black uppercase tracking-wider text-[#1E3A8A] hover:text-[#172554] dark:text-[#F8DF7B] dark:hover:text-amber-200 flex items-center gap-0.5 cursor-pointer active:opacity-75 transition-colors"
              title="Xem tất cả chuyên đề"
            >
              <span>Xem tất cả</span>
              <span className="text-[15px]">›</span>
            </Link>
          )}
          {!enableSearch && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDisplayMenu((v) => !v)}
                title="Chọn cách hiển thị chuyên đề"
                aria-label="Chọn cách hiển thị chuyên đề"
                aria-expanded={showDisplayMenu}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300/70 bg-slate-100/70 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 active:scale-95 dark:border-white/15 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15 dark:hover:text-white"
              >
                <SlidersHorizontal size={16} strokeWidth={2} />
              </button>
              {showDisplayMenu && (
                <div className="absolute right-0 top-10 z-30 w-44 rounded-[14px] border border-slate-200 bg-white p-1.5 shadow-lg dark:border-white/15 dark:bg-[#1B1431]">
                  <span className="px-2 pt-1 text-[10.5px] font-extrabold uppercase text-slate-500 dark:text-slate-300">Chọn cách hiển thị</span>
                  {displayOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        handleChangeDisplay(opt.value);
                        setShowDisplayMenu(false);
                      }}
                      className={`block h-8 w-full rounded-[8px] px-2.5 text-left text-[12.5px] font-bold ${
                        displayMode === opt.value ? 'bg-primary text-white' : 'text-slate-700 hover:bg-primary-soft dark:text-slate-200 dark:hover:bg-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {enableSearch && (
            <button
              type="button"
              onClick={() => setShowGuide(true)}
              className="relative overflow-hidden inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-gradient-to-r from-primary to-[#3B82F6] border border-white/30 text-white text-[13px] font-extrabold cursor-pointer shadow-[0_6px_16px_-4px_rgba(30,58,138,0.55)] hover:shadow-[0_8px_20px_-4px_rgba(30,58,138,0.65)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200"
            >
              <BookOpen size={16} strokeWidth={2.5} className="relative" />
              <span className="relative">Hướng dẫn</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent animate-shimmer-sweep" />
            </button>
          )}
        </div>
      </div>

      {/* Hàng 2: Mô tả phụ (quản trị viên sửa được) */}
      {isAdmin && isEditingDesc ? (
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={descDraft}
            onChange={(e) => setDescDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveDesc();
              if (e.key === 'Escape') setIsEditingDesc(false);
            }}
            className="h-8 px-2.5 rounded-[8px] border border-primary bg-white dark:bg-[#1E1342] text-[13px] text-ink flex-1 min-w-0 shadow-2xs"
            placeholder="Mô tả chuyên đề..."
            autoFocus
          />
          <button
            type="button"
            onClick={handleSaveDesc}
            className="w-8 h-8 rounded-[8px] bg-primary text-white flex items-center justify-center shrink-0 cursor-pointer"
            title="Lưu mô tả"
          >
            <Check size={16} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => setIsEditingDesc(false)}
            className="w-8 h-8 rounded-[8px] bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white flex items-center justify-center shrink-0 cursor-pointer"
            title="Hủy"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <p className={`${enableSearch ? 'text-[13px] sm:text-[14px]' : 'text-[12px]'} text-muted`}>{topicsDesc}</p>
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setDescDraft(topicsDesc);
                setIsEditingDesc(true);
              }}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-primary cursor-pointer shrink-0"
              title="Sửa mô tả chuyên đề"
            >
              <Edit2 size={12} />
            </button>
          )}
        </div>
      )}

      {/* Nút Hướng dẫn + ô tìm chuyên đề (chỉ hiện ở trang Chuyên đề) */}
      {enableSearch && (
        <div className="flex items-center gap-2">
          <label className="relative flex-1 min-w-0">
            <Search size={20} strokeWidth={2.4} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#071735]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm chuyên đề..."
              className="w-full h-11 pl-12 pr-4 rounded-[15px] bg-white dark:bg-[#160D30] border border-slate-200 dark:border-purple-800/40 text-[14px] text-ink focus:border-primary focus:outline-hidden shadow-2xs"
            />
          </label>
          <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowDisplayMenu((v) => !v)}
                title="Kiểu hiển thị chuyên đề"
                aria-label="Kiểu hiển thị chuyên đề"
                className="w-11 h-11 rounded-[15px] bg-white dark:bg-[#21183A] border border-slate-200 dark:border-white/15 text-[#1E3A8A] dark:text-slate-100 flex items-center justify-center cursor-pointer active:scale-95 transition-transform shadow-2xs"
              >
                <SlidersHorizontal size={20} strokeWidth={2.4} />
              </button>
              {showDisplayMenu && (
                <div className="absolute right-0 top-11 z-30 w-44 p-1.5 rounded-[14px] bg-white dark:bg-[#160D30] border border-slate-200 dark:border-purple-800/40 shadow-lg flex flex-col gap-1">
                  <span className="text-[10.5px] font-extrabold uppercase text-muted dark:text-slate-300 px-2 pt-1">Chọn bố cục</span>
                  {displayOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        handleChangeDisplay(opt.value);
                        setShowDisplayMenu(false);
                      }}
                  className={`h-8 px-2.5 rounded-[8px] text-left text-[12.5px] font-bold cursor-pointer ${
                        displayMode === opt.value ? 'bg-primary text-white' : 'text-slate-700 hover:bg-primary-soft dark:text-slate-200 dark:hover:bg-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
          </div>
          <TopicsGuideModal
            isOpen={showGuide}
            onClose={() => setShowGuide(false)}
            guide={guide}
            isAdmin={isAdmin}
            onSaved={(g) => setGuide(g)}
          />
        </div>
      )}

      {/* Chọn kiểu hiển thị chuyên đề (chỉ quản trị viên thấy) */}
      {isAdmin && !enableSearch && (
        <div className="flex items-center gap-1.5 flex-wrap p-1.5 rounded-[12px] bg-slate-100 dark:bg-white/5 border border-line">
          <span className="text-[11px] font-extrabold uppercase text-muted dark:text-slate-300 px-1.5">Kiểu hiển thị</span>
          {displayOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleChangeDisplay(opt.value)}
              className={`h-7 px-2.5 rounded-[8px] text-[12px] font-bold cursor-pointer transition-colors ${
                displayMode === opt.value
                  ? 'bg-[#1E3A8A] text-amber-300 shadow-xs'
                  : 'bg-white dark:bg-[#261B40] text-slate-700 dark:text-[#E6DCFA] border border-line'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {enableSearch && query.trim().length >= 2 && lessonIndex && (() => {
        const q = query.trim().toLowerCase();
        const hits = lessonIndex
          .filter((p) => p.title.toLowerCase().includes(q) || (p.summary || '').toLowerCase().includes(q))
          .slice(0, 8);
        if (hits.length === 0) return null;
        return (
          <div className="flex flex-col gap-1.5 p-2.5 rounded-[16px] bg-primary-soft/60 border border-primary/15">
            <span className="text-[11px] font-extrabold uppercase tracking-wide text-primary px-1">Bài học phù hợp</span>
            {hits.map((p) => (
              <a
                key={p.id}
                href={`/${p.topic_slug}/${p.slug}`}
                onClick={() => playTapSound()}
                className="flex items-center gap-2 px-3 py-2 rounded-[12px] bg-white border border-slate-200/80 active:scale-[0.99] transition-transform"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wider text-primary truncate">{p.topic_title}</p>
                  <p className="text-[13.5px] font-extrabold text-ink leading-snug line-clamp-1">
                    Bài {p.page_number}: {p.title}
                  </p>
                </div>
                <span className="text-primary text-[16px] shrink-0">›</span>
              </a>
            ))}
          </div>
        );
      })()}

      {enableSearch && query.trim().length === 0 && (() => {
        const featured = topicsWithCounts.filter(({ topic }) => topic.is_visible && featuredTopicIds.includes(topic.id));
        if (featured.length === 0) return null;
        return (
          <section className="mt-2 flex flex-col gap-2.5" aria-label="Chuyên đề nổi bật">
            <div className="flex items-center justify-between gap-2">
              <h3 className="flex items-center gap-1.5 text-[17px] font-black text-[#071735]">
                <Flame size={19} className="fill-orange-500 text-orange-500" />
                Chuyên đề nổi bật
              </h3>
            </div>
            <div role="region" aria-label="Chuyên đề nổi bật, vuốt ngang để xem thêm" tabIndex={0} className="-mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:gap-3 sm:px-0">
              {featured.map(({ topic, pageCount }) => (
                <div key={`featured-${topic.id}`} className="relative w-fit max-w-[86vw] shrink-0 snap-start">
                  <a href={`/${topic.slug}`} onClick={() => playTapSound()} className="relative flex min-h-[82px] w-fit min-w-[190px] max-w-full items-center gap-2 rounded-[17px] border border-slate-200/80 bg-white p-2.5 pr-7 shadow-[0_10px_28px_-22px_rgba(15,23,42,.65)] active:scale-[0.98] transition-transform">
                    <div className="h-[58px] w-[58px] shrink-0 overflow-hidden rounded-[13px] bg-[#170B3D]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={topic.cover_url || DEFAULT_TOPIC_COVERS[topic.slug] || ''} alt={topic.title} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 max-w-[190px] text-[11.5px] font-black leading-[1.15] text-[#071735]">{topic.title}</p>
                      <p className="mt-1 flex items-center gap-1 whitespace-nowrap text-[10px] font-semibold text-slate-500"><BookOpen size={11} />{pageCount > 0 ? `${pageCount} bài học` : 'Sắp ra mắt'}</p>
                    </div>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-[#2D5B94]">›</span>
                  </a>
                  {isAdmin && (
                    <button type="button" onClick={() => handleToggleFeatured(topic.id)} className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[#071735] shadow" title="Bỏ nổi bật">
                      <Star size={12} className="fill-current" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {enableSearch && query.trim().length === 0 && (
        <div className="mt-2 flex items-center gap-2">
          <LayoutGrid size={18} className="text-[#1E3A8A]" />
          <h3 className="text-[17px] font-black text-[#071735]">Theo nhóm chủ đề</h3>
        </div>
      )}

      <div className={topicsContainerClass(displayMode)}>
        {topicsWithCounts.map(({ topic, pageCount }, index) => {
          // Người xem bình thường không thấy chủ đề bị ẩn
          if (!topic.is_visible && !isAdmin) return null;
          if (query.trim() && !topic.title.toLowerCase().includes(query.trim().toLowerCase())) return null;
          if (enableSearch && query.trim().length === 0 && featuredTopicIds.includes(topic.id)) return null;

          return (
            <div
              key={topic.id}
              className="relative flex flex-col group cv-auto"
            >
              <div className="relative">
                <TopicTile
                  mode={displayMode}
                  topic={topic}
                  pageCount={pageCount}
                  boldTitle={!enableSearch}
                />

                {/* Nhãn Đang ẩn nếu admin */}
                {!topic.is_visible && isAdmin && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[11px] font-bold">
                    Đang ẩn
                  </div>
                )}
              </div>

              {/* Ghi chú học tập (admin nhập ở "Sửa chủ đề"), tối đa 2 dòng */}
              {!enableSearch && topic.meta_note && topic.meta_note.trim() && (
                <div className="mt-1.5 flex items-start gap-2 px-3 py-2 rounded-[12px] bg-primary-soft/70 dark:bg-purple-950/50 border border-primary/15 dark:border-purple-700/40 border-l-[3px] border-l-primary">
                  <Lightbulb size={14} strokeWidth={2.4} className="text-primary dark:text-[#F8DF7B] mt-[2px] shrink-0" />
                  <p className="text-[12px] leading-snug text-slate-700 dark:text-purple-100 font-medium line-clamp-2">
                    {topic.meta_note}
                  </p>
                </div>
              )}

              {/* Thanh công cụ quản trị trên mỗi thẻ chuyên đề */}
              {isAdmin && (
                <div className="flex items-center justify-between mt-1 px-1.5 py-1 rounded-[10px] bg-slate-900/80 dark:bg-[#1A103C]/95 border border-slate-300/30 dark:border-purple-700/60 text-white text-[11.5px] font-bold shadow-2xs backdrop-blur-xs">
                  <button
                    type="button"
                    onClick={() => setEditingTopic(topic)}
                    className="flex items-center gap-1 h-6 px-2 rounded-[6px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10.5px] uppercase tracking-wide cursor-pointer transition-transform active:scale-95 shadow-2xs"
                    title="Sửa chủ đề"
                  >
                    <Edit2 size={10} strokeWidth={2.5} />
                    <span>Sửa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(topic.id)}
                    className={`w-6 h-6 rounded-[6px] flex items-center justify-center cursor-pointer active:scale-90 ${featuredTopicIds.includes(topic.id) ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-amber-300 hover:bg-white/15'}`}
                    title={featuredTopicIds.includes(topic.id) ? 'Bỏ nổi bật' : 'Đặt làm nổi bật'}
                  >
                    <Star size={12} strokeWidth={2.2} className={featuredTopicIds.includes(topic.id) ? 'fill-current' : ''} />
                  </button>

                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      className="w-6 h-6 rounded-[6px] flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/15 disabled:opacity-20 cursor-pointer active:scale-90"
                      title="Chuyển lên"
                    >
                      <ArrowUp size={12} strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      disabled={index === topicsWithCounts.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      className="w-6 h-6 rounded-[6px] flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/15 disabled:opacity-20 cursor-pointer active:scale-90"
                      title="Chuyển xuống"
                    >
                      <ArrowDown size={12} strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleVisible(index)}
                      className="w-6 h-6 rounded-[6px] flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/15 cursor-pointer active:scale-90"
                      title={topic.is_visible ? 'Ẩn chủ đề' : 'Hiện chủ đề'}
                    >
                      {topic.is_visible ? <Eye size={12} strokeWidth={2.2} /> : <EyeOff size={12} strokeWidth={2.5} className="text-amber-400" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(topic.id, topic.title)}
                      className="w-6 h-6 rounded-[6px] flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500/80 cursor-pointer active:scale-90"
                      title="Xóa chủ đề"
                    >
                      <Trash2 size={12} strokeWidth={2.2} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {enableSearch && query.trim().length === 0 && (initialFaqs.length > 0 || isAdmin) && (
        <section aria-labelledby="topic-faq-heading" className="mt-5 border-t border-slate-200/80 pt-5 dark:border-white/10">
          <div className="rounded-[22px] border border-[#D8E2F0] bg-gradient-to-b from-[#F5F8FD] to-[#EEF3FA] p-3 shadow-[0_10px_28px_-25px_rgba(24,52,103,.7)] dark:border-white/10 dark:from-[#191330] dark:to-[#130E25] sm:p-4">
            <header className="mb-3 flex items-center justify-between gap-3 px-0.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[#E1EBFA] text-[#214B91] dark:bg-blue-400/10 dark:text-blue-200">
                  <CircleHelp size={19} />
                </span>
                <div className="min-w-0">
                  <h3 id="topic-faq-heading" className="text-[15px] font-black leading-tight text-[#102144] dark:text-white sm:text-[17px]">Vấn đề thường gặp</h3>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">Chọn chủ đề để xem câu hỏi và hướng học phù hợp</p>
                </div>
              </div>
              <span className="shrink-0 rounded-full border border-[#DCE5F2] bg-white/80 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">{filteredFaqRows.length} câu hỏi</span>
            </header>

            <div className="mb-2 flex flex-wrap items-center gap-1.5" aria-label="Lọc vấn đề theo chủ đề">
              <button type="button" onClick={() => setSelectedFaqCategory('all')} aria-pressed={selectedFaqCategory === 'all'} className={`rounded-full border px-3 py-1.5 text-[10px] font-extrabold transition-colors ${selectedFaqCategory === 'all' ? 'border-[#214B91] bg-[#214B91] text-white' : 'border-[#DCE5F2] bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200'}`}>Tất cả</button>
              {faqCategories.map((category) => <button key={category.id} type="button" onClick={() => setSelectedFaqCategory(category.id)} aria-pressed={selectedFaqCategory === category.id} className={`rounded-full border px-3 py-1.5 text-[10px] font-extrabold transition-colors ${selectedFaqCategory === category.id ? 'border-[#214B91] bg-[#214B91] text-white' : 'border-[#DCE5F2] bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200'}`}>{category.title}</button>)}
              {isAdmin && <button type="button" onClick={() => { setFaqCategoryPickerAction('category'); setFaqCategoryPickerOpen((open) => !open); }} className="inline-flex min-h-[30px] items-center gap-1 rounded-full border border-dashed border-[#214B91] px-3 py-1.5 text-[10px] font-extrabold text-[#214B91] dark:border-blue-300 dark:text-blue-200"><Plus size={12} />Thêm danh mục</button>}
            </div>

            {isAdmin && <div className="mb-2 flex justify-start"><button type="button" onClick={() => { if (selectedFaqCategory !== 'all') void handleAddFaqQuestion(selectedFaqCategory); else { setFaqCategoryPickerAction('question'); setFaqCategoryPickerOpen(true); } }} className="inline-flex min-h-8 items-center gap-1 rounded-[9px] bg-[#214B91] px-2.5 text-[10px] font-extrabold text-white"><Plus size={13} />Thêm câu hỏi</button></div>}

            {isAdmin && faqCategoryPickerOpen && <div className="mb-3 rounded-[12px] border border-blue-200 bg-white p-2.5 dark:border-blue-400/20 dark:bg-[#191330]"><div className="mb-2 flex items-center justify-between gap-2"><p className="text-[11px] font-extrabold text-[#102144] dark:text-white">{faqCategoryPickerAction === 'category' ? 'Tên danh mục mới' : 'Chọn danh mục cho câu hỏi mới'}</p><button type="button" onClick={() => setFaqCategoryPickerOpen(false)} aria-label="Đóng" className="rounded p-1 text-slate-500"><X size={14} /></button></div>{faqCategoryPickerAction === 'category' ? <form onSubmit={(event) => { event.preventDefault(); void handleCreateFaqCategory(); }} className="flex gap-2"><input autoFocus value={newFaqCategoryName} onChange={(event) => setNewFaqCategoryName(event.target.value)} placeholder="Nhập tên danh mục bạn muốn…" aria-label="Tên danh mục mới" className="h-9 min-w-0 flex-1 rounded-[8px] border border-[#DCE5F2] bg-white px-2.5 text-[11px] text-slate-800 outline-none focus:border-[#214B91] dark:border-white/10 dark:bg-white/5 dark:text-white" /><button type="submit" disabled={!newFaqCategoryName.trim()} className="inline-flex h-9 shrink-0 items-center gap-1 rounded-[8px] bg-[#214B91] px-2.5 text-[10px] font-extrabold text-white disabled:opacity-40"><Plus size={13} />Tạo danh mục</button></form> : <div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto">{faqCategories.map((category) => <button key={category.id} type="button" onClick={() => void handleAddFaqQuestion(category.id)} className="rounded-full border border-[#DCE5F2] bg-slate-50 px-2.5 py-1.5 text-[10px] font-bold text-slate-700 hover:border-[#214B91] hover:text-[#214B91] dark:border-white/10 dark:bg-white/5 dark:text-slate-200">{category.title}</button>)}{faqCategories.length === 0 && <p className="text-[10px] text-slate-500">Chưa có danh mục. Hãy thêm danh mục trước.</p>}</div>}</div>}

            {faqSaveError && <p role="alert" className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-[11px] font-bold text-red-700 dark:bg-red-950/30 dark:text-red-200">{faqSaveError}</p>}

            <div className="flex flex-col gap-2">
              {filteredFaqRows.map((faq) => {
                const answers = faq.learningAnswers;
                const label = faq.faqCategoryTitle;
                return <div key={faq.id} className="flex items-start gap-1.5">
                  <details className="group min-w-0 flex-1 overflow-hidden rounded-[15px] border border-slate-200/90 bg-white shadow-[0_3px_10px_-9px_rgba(15,23,42,.35)] dark:border-white/10 dark:bg-[#1B1630]">
                    <summary className="flex min-h-[54px] cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-3 text-left [&::-webkit-details-marker]:hidden">
                      <span className="min-w-0 flex-1"><span className="mb-1 block text-[9px] font-extrabold uppercase tracking-[.08em] text-[#315991] dark:text-blue-300">{label}</span><span className="block text-[12.5px] font-extrabold leading-snug text-slate-900 dark:text-slate-100 sm:text-[13px]">{faq.question}</span></span>
                      <ChevronDown size={17} className="shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="border-t border-slate-100 px-3.5 pb-3.5 pt-3 dark:border-white/10">
                      {faq.answer && <p className="whitespace-pre-line text-[12px] leading-relaxed text-slate-600 dark:text-slate-300">{faq.answer}</p>}
                      {answers.length > 0 && <div className="flex flex-col gap-2">{answers.map((answer, index) => <div key={answer.id} className="rounded-[11px] bg-[#F1F6FD] p-2.5 dark:bg-blue-950/20">{answers.length > 1 && <span className="mb-1 block text-[9px] font-black uppercase tracking-wide text-[#315991] dark:text-blue-300">Trả lời {index + 1}</span>}{answer.text && <p className="mb-2 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">{answer.text}</p>}{answer.href && (answer.destinationType === 'topic' ? <a href={answer.href} onClick={() => playTapSound()} className="inline-flex min-h-8 items-center gap-1 rounded-full border border-[#D7E3F3] bg-white px-3 text-[10.5px] font-bold text-[#234B8B] dark:border-white/10 dark:bg-white/5 dark:text-blue-200">Xem chuyên đề <span aria-hidden="true">›</span></a> : <VideoLessonLink href={answer.href} title={answer.videoTitle} thumbnailUrl={answer.thumbnailUrl} />)}{answer.linkedVideos?.map((video, videoIndex) => <VideoLessonLink key={`${answer.id}-video-${videoIndex}`} href={video.href} title={video.title} thumbnailUrl={video.thumbnailUrl} />)}</div>)}</div>}
                    </div>
                  </details>
                  {isAdmin && <button type="button" onClick={() => { setFaqSaveError(''); setEditingFaqBlock(faq.block); }} title="Sửa vấn đề thường gặp này" aria-label={`Sửa: ${faq.question}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] border border-blue-200 bg-white text-blue-700 shadow-sm dark:border-blue-300/15 dark:bg-[#1B1630] dark:text-blue-200"><Pencil size={15} /></button>}
                </div>;
              })}
            </div>
          </div>
        </section>
      )}

      {!enableSearch && !hideViewAll && (
        <Link
          href="/chuyen-de"
          prefetch={true}
          onClick={() => playTapSound()}
          className="mt-1 inline-flex min-h-9 items-center justify-center gap-1 self-center rounded-full px-4 text-[12px] font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-primary"
          title="Xem tất cả chuyên đề"
        >
          Xem tất cả chuyên đề <span aria-hidden="true">›</span>
        </Link>
      )}

      {/* Modal Sửa chủ đề */}
      {editingTopic && (
        <EditTopicModal
          topic={editingTopic}
          onClose={() => setEditingTopic(null)}
          onSaved={handleSaved}
        />
      )}
      {editingFaqBlock && <EditBlockModal isOpen onClose={() => setEditingFaqBlock(null)} block={editingFaqBlock} onSaveBlock={handleSaveFaqBlock} faqTopicOptions={initialFaqTopics} faqVideoOptions={initialFaqVideos.map((video) => ({ key: video.key, page_id: video.page_id, page_title: video.page_title, video_title: video.video_title, thumbnail_url: video.thumbnail_url, index: video.index, topic_id: video.topic_id, topic_title: video.topic_title }))} />}

      {/* Modal Thêm chủ đề mới */}
      {isCreating && (
        <EditTopicModal
          topic={null}
          nextSortOrder={topicsWithCounts.length + 1}
          onClose={() => setIsCreating(false)}
          onSaved={handleSaved}
        />
      )}
    </section>
  );
}
