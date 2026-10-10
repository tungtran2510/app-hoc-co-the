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
import AllTopicsFaqHub from './AllTopicsFaqHub';
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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
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
  initialHiddenHomeTopicIds?: string[] | null;
  settingsScope?: 'home' | 'page';
}

export default function TopicListClient({
  initialTopics,
  initialTopicsTitle,
  sectionIndex,
  totalSections,
  isHidden,
  isCollapsed = false,
  onToggleCollapse,
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
  initialHiddenHomeTopicIds = [],
  initialFaqs = [],
  initialFaqVideos = [],
  initialFaqTopics = [],
  settingsScope = 'home',
}: TopicListClientProps) {
  const router = useRouter();
  const [topicsWithCounts, setTopicsWithCounts] = useState(initialTopics);
  const [hiddenHomeTopicIds, setHiddenHomeTopicIds] = useState<string[]>(initialHiddenHomeTopicIds || []);

  const hiddenHomeTopicIdsKey = (initialHiddenHomeTopicIds || []).join(',');
  useEffect(() => {
    if (initialHiddenHomeTopicIds) {
      setHiddenHomeTopicIds(initialHiddenHomeTopicIds);
    }
  }, [hiddenHomeTopicIdsKey]);
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
  const displayOptions = TOPICS_DISPLAY_OPTIONS;

  const initialFaqsCount = initialFaqs.length;
  useEffect(() => {
    setTopicFaqRows(initialFaqs);
  }, [initialFaqsCount]);

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
    const handleDisplayChange = (e: any) => {
      if (e.detail?.display && settingsScope === 'home') {
        setDisplayMode(e.detail.display);
      }
    };
    window.addEventListener('qbiz_home_topics_display_changed', handleDisplayChange);
    return () => window.removeEventListener('qbiz_home_topics_display_changed', handleDisplayChange);
  }, [settingsScope]);

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

    // Nếu đang ở Trang Tổng Quan (home): Chỉ ẩn/hiện chuyên đề trên Trang Chủ, KHÔNG can thiệp cờ toàn cục của chuyên đề
    if (settingsScope === 'home') {
      const isCurrentlyHiddenOnHome = hiddenHomeTopicIds.includes(item.topic.id);
      const nextHidden = isCurrentlyHiddenOnHome
        ? hiddenHomeTopicIds.filter((id) => id !== item.topic.id)
        : [...hiddenHomeTopicIds, item.topic.id];
      setHiddenHomeTopicIds(nextHidden);
      const res = await saveSettingsApi({
        hidden_home_topic_ids: nextHidden,
      });
      if (!res.success) {
        alert(res.error || 'Chưa lưu được cài đặt');
        setHiddenHomeTopicIds(hiddenHomeTopicIds);
      }
      return;
    }

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
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
          onToggleVisibility={onToggleVisibility}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onOpenReorderModal={onOpenReorderModal}
          onEdit={() => setIsCreating(true)}
          editLabel="+ Thêm chuyên đề"
        />
      )}

      {/* Khi Admin chọn thu gọn khối này, ẩn danh sách bên dưới */}
      {isAdmin && isCollapsed ? null : (
        <>
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
                title={`Kiểu hiển thị: ${displayOptions.find((o) => o.value === displayMode)?.label || 'Bố cục'}`}
                aria-label="Chọn kiểu hiển thị chuyên đề"
                aria-expanded={showDisplayMenu}
                className="w-8 h-8 rounded-full border border-slate-300/80 bg-white/90 dark:border-white/15 dark:bg-white/10 text-ink flex items-center justify-center shadow-2xs hover:bg-slate-50 dark:hover:bg-white/15 transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <SlidersHorizontal size={14} className="text-primary shrink-0" />
              </button>
              {showDisplayMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowDisplayMenu(false)} />
                  <div className="absolute right-0 top-9 z-40 w-44 rounded-[14px] border border-line bg-white dark:bg-[#1B1431] p-1.5 shadow-xl flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100">
                    <span className="px-2 pt-1 pb-0.5 text-[10px] font-extrabold uppercase tracking-wider text-muted block">Kiểu hiển thị</span>
                    {displayOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          handleChangeDisplay(opt.value);
                          setShowDisplayMenu(false);
                        }}
                        className={`flex items-center justify-between h-8.5 w-full rounded-[9px] px-2.5 text-left text-[12.5px] font-bold cursor-pointer transition-colors ${
                          displayMode === opt.value
                            ? 'bg-primary text-white shadow-2xs'
                            : 'text-ink hover:bg-surface-2'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {displayMode === opt.value && <Check size={14} className="stroke-[2.5]" />}
                      </button>
                    ))}
                  </div>
                </>
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
                  <Link href={`/${topic.slug}`} prefetch={true} onClick={() => playTapSound()} className="relative flex min-h-[82px] w-fit min-w-[215px] max-w-full items-center gap-2.5 rounded-[17px] border border-slate-200/80 bg-white p-2.5 pr-7 shadow-[0_10px_28px_-22px_rgba(15,23,42,.65)] active:scale-[0.98] transition-transform">
                    <div className="h-[58px] w-[58px] shrink-0 overflow-hidden rounded-[13px] bg-[#170B3D]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={topic.cover_url || DEFAULT_TOPIC_COVERS[topic.slug] || ''} alt={topic.title} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-[12px] font-black leading-[1.25] text-[#071735]">{topic.title}</p>
                      <p className="mt-1 flex items-center gap-1 whitespace-nowrap text-[10px] font-semibold text-slate-500"><BookOpen size={11} />{pageCount > 0 ? `${pageCount} bài học` : 'Sắp ra mắt'}</p>
                    </div>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-[#2D5B94]">›</span>
                  </Link>
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
          const isHiddenOnThisSurface =
            settingsScope === 'home'
              ? (hiddenHomeTopicIds.includes(topic.id) || !topic.is_visible)
              : (!topic.is_visible);
          if (isHiddenOnThisSurface && !isAdmin) return null;
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
                {isAdmin && (
                  settingsScope === 'home' && hiddenHomeTopicIds.includes(topic.id) ? (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 text-[10px] font-black shadow-xs">
                      Ẩn ở Trang chủ
                    </div>
                  ) : !topic.is_visible ? (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[11px] font-bold">
                      Đang ẩn
                    </div>
                  ) : null
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

              {/* Thanh công cụ quản trị trên mỗi thẻ chuyên đề (Tối ưu 100% cho điện thoại & mọi kích thước) */}
              {isAdmin && (
                <div className="mt-1 p-1 rounded-[10px] bg-slate-900/90 dark:bg-[#1A103C]/95 border border-slate-300/30 dark:border-purple-700/60 text-white shadow-2xs backdrop-blur-xs flex flex-col gap-1">
                  {/* Hàng 1: Nút Sửa chính + Nổi bật ⭐ + Ẩn/Hiện 👁 */}
                  <div className="flex items-center gap-1 justify-between">
                    <button
                      type="button"
                      onClick={() => setEditingTopic(topic)}
                      className="flex-1 flex items-center justify-center gap-0.5 h-6 px-1 rounded-[6px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10.5px] uppercase cursor-pointer transition-transform active:scale-95 shadow-2xs min-w-0"
                      title="Chỉnh sửa chủ đề này"
                    >
                      <Edit2 size={10} strokeWidth={2.8} className="shrink-0" />
                      <span className="truncate">Sửa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(topic.id)}
                      className={`w-6 h-6 rounded-[6px] flex items-center justify-center shrink-0 cursor-pointer active:scale-90 transition-colors ${
                        featuredTopicIds.includes(topic.id)
                          ? 'bg-amber-400 text-slate-950 shadow-2xs'
                          : 'text-slate-300 hover:text-amber-300 hover:bg-white/15'
                      }`}
                      title={featuredTopicIds.includes(topic.id) ? 'Bỏ nổi bật' : 'Đặt làm nổi bật (ưu tiên)'}
                    >
                      <Star size={11} strokeWidth={2.4} className={featuredTopicIds.includes(topic.id) ? 'fill-current' : ''} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleVisible(index)}
                      className={`w-6 h-6 rounded-[6px] flex items-center justify-center shrink-0 cursor-pointer active:scale-90 transition-colors ${
                        (settingsScope === 'home' ? !hiddenHomeTopicIds.includes(topic.id) : topic.is_visible)
                          ? 'text-slate-300 hover:text-white hover:bg-white/15'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                      }`}
                      title={
                        settingsScope === 'home'
                          ? (hiddenHomeTopicIds.includes(topic.id) ? 'Đang ẩn ở Trang chủ – Bấm để hiện' : 'Đang hiện ở Trang chủ – Bấm để ẩn')
                          : (topic.is_visible ? 'Đang hiện – Bấm để ẩn' : 'Đang ẩn – Bấm để hiện')
                      }
                    >
                      {(settingsScope === 'home' ? !hiddenHomeTopicIds.includes(topic.id) : topic.is_visible) ? (
                        <Eye size={11} strokeWidth={2.2} />
                      ) : (
                        <EyeOff size={11} strokeWidth={2.5} className="text-amber-400" />
                      )}
                    </button>
                  </div>

                  {/* Hàng 2: Di chuyển Lên ↑ + Xuống ↓ + Xóa 🗑 */}
                  <div className="flex items-center gap-1 pt-0.5 border-t border-white/10">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      className="flex-1 h-5.5 rounded-[5px] flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/15 disabled:opacity-20 cursor-pointer active:scale-90 transition-all bg-white/5"
                      title="Chuyển lên"
                    >
                      <ArrowUp size={11} strokeWidth={2.6} />
                    </button>

                    <button
                      type="button"
                      disabled={index === topicsWithCounts.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      className="flex-1 h-5.5 rounded-[5px] flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/15 disabled:opacity-20 cursor-pointer active:scale-90 transition-all bg-white/5"
                      title="Chuyển xuống"
                    >
                      <ArrowDown size={11} strokeWidth={2.6} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(topic.id, topic.title)}
                      className="w-6 h-5.5 rounded-[5px] flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500/80 cursor-pointer active:scale-90 transition-all shrink-0 bg-red-950/30"
                      title="Xóa chủ đề"
                    >
                      <Trash2 size={11} strokeWidth={2.4} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {enableSearch && query.trim().length === 0 && (
        <AllTopicsFaqHub />
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
        </>
      )}

      {/* Modal Sửa chủ đề */}
      {editingTopic && (
        <EditTopicModal
          topic={editingTopic}
          onClose={() => setEditingTopic(null)}
          onSaved={handleSaved}
          onDelete={handleDelete}
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
