'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, ArrowUp, ArrowDown, Eye, EyeOff, Trash2, Check, X } from 'lucide-react';
import TopicCard from './TopicCard';
import { Topic } from '../lib/types';
import { checkIsAdminClient } from '../lib/adminAuth';
import { saveTopicApi, deleteTopicApi } from '../lib/apiAdmin';
import { saveSettingsApi } from '../lib/apiAdmin';
import EditTopicModal from './admin/EditTopicModal';
import SectionOrderControls from './admin/SectionOrderControls';
import ScrollReveal from './ScrollReveal';

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
}: TopicListClientProps) {
  const [topicsWithCounts, setTopicsWithCounts] = useState(initialTopics);
  const [topicsTitle, setTopicsTitle] = useState(
    initialTopicsTitle && initialTopicsTitle !== 'Chọn chủ đề' ? initialTopicsTitle : 'Chuyên Đề Học'
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(
    initialTopicsTitle && initialTopicsTitle !== 'Chọn chủ đề' ? initialTopicsTitle : 'Chuyên Đề Học'
  );
  const [activeTopicSlug, setActiveTopicSlug] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    checkIsAdminClient().then((admin) => setIsAdmin(admin));
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
      const idx = prev.findIndex((t) => t.topic.id === savedTopic.id);
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
            <h2 className="text-[18px] sm:text-[19px] font-black text-ink tracking-tight leading-tight whitespace-nowrap">
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
          <Link
            href="/cot-song"
            prefetch={true}
            className="text-[13px] font-black uppercase tracking-wider text-[#1E3A8A] hover:text-[#172554] dark:text-[#F8DF7B] dark:hover:text-amber-200 flex items-center gap-0.5 cursor-pointer active:opacity-75 transition-colors"
            title="Xem danh sách bài học chủ đề Cột sống"
          >
            <span>Xem tất cả</span>
            <span className="text-[15px]">›</span>
          </Link>
        </div>
      </div>

      {/* Hàng 2: Mô tả phụ */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-[12px] text-muted">
          Hệ thống chuyên đề & bài học giải phẫu cơ thể
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mt-1.5">
        {topicsWithCounts.map(({ topic, pageCount }, index) => {
          // Người xem bình thường không thấy chủ đề bị ẩn
          if (!topic.is_visible && !isAdmin) return null;

          return (
            <ScrollReveal
              key={topic.id}
              animation="bubble-pop"
              delay={Math.min(index * 60, 480)}
              className="relative flex flex-col group"
            >
              <div className="relative">
                <TopicCard
                  topic={topic}
                  pageCount={pageCount}
                  isActive={activeTopicSlug === topic.slug}
                  onActivate={() => setActiveTopicSlug(topic.slug)}
                />

                {/* Nhãn Đang ẩn nếu admin */}
                {!topic.is_visible && isAdmin && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[11px] font-bold">
                    Đang ẩn
                  </div>
                )}
              </div>

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
            </ScrollReveal>
          );
        })}
      </div>

      {/* Modal Sửa chủ đề */}
      {editingTopic && (
        <EditTopicModal
          topic={editingTopic}
          onClose={() => setEditingTopic(null)}
          onSaved={handleSaved}
        />
      )}

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
