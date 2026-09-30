'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, ArrowUp, ArrowDown, Eye, EyeOff, Trash2 } from 'lucide-react';
import TopicCard from './TopicCard';
import { Topic } from '../lib/types';
import { checkIsAdminClient } from '../lib/adminAuth';
import { saveTopicApi, deleteTopicApi } from '../lib/apiAdmin';
import EditTopicModal from './admin/EditTopicModal';
import SectionOrderControls from './admin/SectionOrderControls';

interface TopicListClientProps {
  initialTopics: {
    topic: Topic;
    pageCount: number;
  }[];
  initialTopicsTitle?: string | null;
  sectionIndex?: number;
  totalSections?: number;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onOpenReorderModal?: () => void;
}

export default function TopicListClient({
  initialTopics,
  initialTopicsTitle,
  sectionIndex,
  totalSections,
  onMoveUp,
  onMoveDown,
  onOpenReorderModal,
}: TopicListClientProps) {
  const [topicsWithCounts, setTopicsWithCounts] = useState(initialTopics);
  const [topicsTitle, setTopicsTitle] = useState(initialTopicsTitle || 'Chọn chủ đề');
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    checkIsAdminClient().then((admin) => setIsAdmin(admin));
    if (initialTopicsTitle) setTopicsTitle(initialTopicsTitle);

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
    const current = list[index];
    const target = list[targetIndex];

    const currentOrder = current.topic.sort_order;
    current.topic.sort_order = target.topic.sort_order;
    target.topic.sort_order = currentOrder;

    list[index] = target;
    list[targetIndex] = current;

    setTopicsWithCounts(list);

    const [res1, res2] = await Promise.all([
      saveTopicApi(current.topic),
      saveTopicApi(target.topic),
    ]);
    if (!res1.success || !res2.success) {
      alert('Chưa lưu được – chưa kết nối dữ liệu');
      // Phục hồi lại vị trí cũ
      current.topic.sort_order = target.topic.sort_order;
      target.topic.sort_order = currentOrder;
      list[index] = current;
      list[targetIndex] = target;
      setTopicsWithCounts([...list]);
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

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[19px] sm:text-[21px] font-bold font-serif tracking-wider uppercase text-ink leading-tight">
          {topicsTitle}
        </h2>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/cot-song"
            prefetch={true}
            className="text-[13px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer active:opacity-75 transition-opacity"
            title="Xem danh sách bài học chủ đề Cột sống"
          >
            <span>Xem tất cả</span>
            <span className="text-[15px]">›</span>
          </Link>

          {isAdmin && onMoveUp && onMoveDown && onOpenReorderModal && typeof sectionIndex === 'number' && typeof totalSections === 'number' && (
            <SectionOrderControls
              sectionIndex={sectionIndex}
              totalSections={totalSections}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onOpenReorderModal={onOpenReorderModal}
            />
          )}

          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-primary text-white font-bold text-[13px] shadow-xs hover:bg-primary-dark cursor-pointer transition-all"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Thêm chủ đề</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-1">
        {topicsWithCounts.map(({ topic, pageCount }, index) => {
          // Người xem bình thường không thấy chủ đề bị ẩn
          if (!topic.is_visible && !isAdmin) return null;

          return (
            <div key={topic.id} className="relative flex flex-col group">
              <div className="relative">
                <TopicCard topic={topic} pageCount={pageCount} />

                {/* Nhãn Đang ẩn nếu admin */}
                {!topic.is_visible && isAdmin && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[11px] font-bold">
                    Đang ẩn
                  </div>
                )}
              </div>

              {/* Thanh công cụ quản trị trên mỗi thẻ */}
              {isAdmin && (
                <div className="flex items-center justify-between mt-1 px-1 py-1 rounded-[10px] bg-black/85 text-white text-[12px] font-bold">
                  <button
                    type="button"
                    onClick={() => setEditingTopic(topic)}
                    className="p-1.5 rounded hover:bg-white/20 text-white flex items-center gap-1"
                    title="Sửa chủ đề"
                  >
                    <Edit2 size={13} />
                    <span>Sửa</span>
                  </button>

                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      className="p-1 rounded hover:bg-white/20 disabled:opacity-30"
                      title="Chuyển lên"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={index === topicsWithCounts.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      className="p-1 rounded hover:bg-white/20 disabled:opacity-30"
                      title="Chuyển xuống"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleVisible(index)}
                    className="p-1 rounded hover:bg-white/20"
                    title={topic.is_visible ? 'Ẩn chủ đề' : 'Hiện chủ đề'}
                  >
                    {topic.is_visible ? <Eye size={14} /> : <EyeOff size={14} className="text-amber-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(topic.id, topic.title)}
                    className="p-1 rounded hover:bg-red-500/80 text-red-300 hover:text-white"
                    title="Xóa chủ đề"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>
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
