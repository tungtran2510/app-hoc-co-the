'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, ArrowUp, ArrowDown, Eye, EyeOff, Trash2, FileText, Check, Play } from 'lucide-react';
import PageCard from './PageCard';
import { Page, Topic } from '../lib/types';
import { checkIsAdminClient } from '../lib/adminAuth';
import { savePageApi, deletePageApi } from '../lib/apiAdmin';
import EditPageModal from './admin/EditPageModal';
import { getStoredTienDo, TienDoMap, getCompletedPages } from '../lib/learningProgress';

interface PageItemData {
  page: Page;
  orderNumber: number;
  videoCount: number;
}

interface PageListClientProps {
  initialPages: PageItemData[];
  topic: Topic;
}

export default function PageListClient({ initialPages, topic }: PageListClientProps) {
  const [pagesWithCount, setPagesWithCount] = useState<PageItemData[]>(initialPages);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [tienDo, setTienDo] = useState<TienDoMap>({});
  const [completedPages, setCompletedPages] = useState<string[]>([]);

  useEffect(() => {
    checkIsAdminClient().then((admin) => setIsAdmin(admin));
    try {
      setTienDo(getStoredTienDo());
      setCompletedPages(getCompletedPages());
    } catch {
      // Bỏ qua
    }
  }, []);

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pagesWithCount.length) return;

    const list = [...pagesWithCount];
    const current = list[index];
    const target = list[targetIndex];

    const currentOrder = current.page.sort_order;
    current.page.sort_order = target.page.sort_order;
    target.page.sort_order = currentOrder;

    list[index] = target;
    list[targetIndex] = current;

    // Cập nhật lại số thứ tự hiển thị
    const reordered = list.map((item, idx) => ({
      ...item,
      orderNumber: idx + 1,
    }));

    setPagesWithCount(reordered);

    const [res1, res2] = await Promise.all([
      savePageApi(current.page),
      savePageApi(target.page),
    ]);
    if (!res1.success || !res2.success) {
      alert('Chưa lưu được – chưa kết nối dữ liệu');
      // Phục hồi lại vị trí cũ
      current.page.sort_order = target.page.sort_order;
      target.page.sort_order = currentOrder;
      list[index] = current;
      list[targetIndex] = target;
      setPagesWithCount(list.map((item, idx) => ({ ...item, orderNumber: idx + 1 })));
    }
  };

  const handleToggleVisible = async (index: number) => {
    const list = [...pagesWithCount];
    const item = list[index];
    const updated = {
      ...item.page,
      is_visible: !item.page.is_visible,
    };
    item.page = updated;
    setPagesWithCount([...list]);
    const res = await savePageApi(updated);
    if (!res.success) {
      alert(res.error || 'Chưa lưu được – chưa kết nối dữ liệu');
      item.page.is_visible = !item.page.is_visible;
      setPagesWithCount([...list]);
    }
  };

  const handleToggleStatus = async (index: number) => {
    const list = [...pagesWithCount];
    const item = list[index];
    const nextStatus = item.page.status === 'published' ? 'draft' : 'published';
    const updated = {
      ...item.page,
      status: nextStatus as 'draft' | 'published',
    };
    item.page = updated;
    setPagesWithCount([...list]);
    const res = await savePageApi(updated);
    if (!res.success) {
      alert(res.error || 'Chưa lưu được – chưa kết nối dữ liệu');
      item.page.status = item.page.status === 'published' ? 'draft' : 'published';
      setPagesWithCount([...list]);
    }
  };

  const handleDelete = async (pageId: string, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa bài học "${title}" không? Hành động này không thể hoàn tác.`)) {
      const res = await deletePageApi(pageId);
      if (res.success) {
        setPagesWithCount((prev) =>
          prev
            .filter((p) => p.page.id !== pageId)
            .map((item, idx) => ({ ...item, orderNumber: idx + 1 }))
        );
      } else {
        alert(res.error || 'Chưa lưu được – chưa kết nối dữ liệu');
      }
    }
  };

  const handleSaved = (savedPage: Page) => {
    setPagesWithCount((prev) => {
      const idx = prev.findIndex((p) => p.page.id === savedPage.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], page: savedPage };
        return next;
      } else {
        return [
          ...prev,
          {
            page: savedPage,
            orderNumber: prev.length + 1,
            videoCount: 0,
          },
        ];
      }
    });
  };

  const visiblePages = pagesWithCount.filter(
    (item) => isAdmin || (item.page.is_visible && item.page.status === 'published')
  );

  return (
    <section className="flex flex-col gap-3.5 mt-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-[18px] sm:text-[20px] font-black text-ink uppercase tracking-wide">
            LỘ TRÌNH ĐÀO TẠO THEO BƯỚC
          </h2>
          <span className="text-[11px] font-black text-primary bg-primary-soft px-2 py-0.5 rounded-full border border-primary/20">
            {visiblePages.length} BƯỚC
          </span>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-primary text-white font-bold text-[12px] shadow-xs hover:bg-primary-dark cursor-pointer transition-all"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Thêm bài</span>
          </button>
        )}
      </div>

      {visiblePages.length > 0 ? (
        <>
          <p className="text-[14px] text-muted font-medium leading-normal -mt-1">
            Gợi ý: nếu mới bắt đầu, nên xem theo thứ tự 01 → 02 → 03.
          </p>

          <div className="flex flex-col mt-1">
            {visiblePages.map(({ page, orderNumber, videoCount }, index) => {
              const pageTienDo = tienDo[page.id];
              const watchedVideos = pageTienDo?.watched || [];
              const lastVideo = pageTienDo?.last_video;
              const isCompleted = completedPages.includes(page.id);
              const hasStarted = isCompleted || watchedVideos.length > 0 || (lastVideo !== undefined && lastVideo > 0);
              const isLast = index === visiblePages.length - 1;

              return (
                <div key={page.id} className="relative flex gap-2.5 sm:gap-3.5 group">
                  {/* CỘT TIMELINE BÊN TRÁI (Mockup 2) */}
                  <div className="flex flex-col items-center shrink-0 w-8 sm:w-9 pt-3.5">
                    {/* Node hình tròn */}
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        isCompleted
                          ? 'bg-[#0E6B5A] text-white shadow-xs'
                          : hasStarted
                          ? 'bg-[#0E6B5A] text-white ring-4 ring-[#0E6B5A]/25 shadow-xs'
                          : 'bg-white border-2 border-line text-muted font-bold text-[12px] sm:text-[13px]'
                      }`}
                    >
                      {isCompleted ? (
                        <Check size={16} strokeWidth={3} />
                      ) : hasStarted ? (
                        <Play size={13} fill="currentColor" className="ml-0.5" />
                      ) : (
                        <span>{String(orderNumber).padStart(2, '0')}</span>
                      )}
                    </div>

                    {/* Đường nối Timeline dọc */}
                    {!isLast && (
                      <div className="w-0.5 flex-1 min-h-[36px] bg-line-strong/60 my-1 group-hover:bg-primary/40 transition-colors" />
                    )}
                  </div>

                  {/* THẺ BÀI HỌC BÊN PHẢI */}
                  <div className="flex-1 min-w-0 pb-3">
                    <div className="relative">
                      <PageCard
                        page={page}
                        topic={topic}
                        orderNumber={orderNumber}
                        videoCount={videoCount}
                        watchedVideos={watchedVideos}
                        lastVideo={lastVideo}
                        isCompleted={isCompleted}
                      />

                      {/* Huy hiệu Quản trị: Bản nháp / Đang ẩn */}
                      {isAdmin && (
                        <div className="absolute top-2 right-12 flex items-center gap-1.5">
                          {page.status === 'draft' && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[11px] font-extrabold">
                              Bản nháp
                            </span>
                          )}
                          {!page.is_visible && (
                            <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-white text-[11px] font-extrabold">
                              Đang ẩn
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                  {/* Thanh công cụ Admin trên mỗi thẻ trang */}
                  {isAdmin && (
                    <div className="flex items-center justify-between mt-1 px-2.5 py-1.5 rounded-[12px] bg-black/85 text-white text-[12px] font-bold shadow-xs">
                      <button
                        type="button"
                        onClick={() => setEditingPage(page)}
                        className="p-1 rounded hover:bg-white/20 text-white flex items-center gap-1 cursor-pointer"
                        title="Sửa trang"
                      >
                        <Edit2 size={13} />
                        <span>Sửa</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMove(index, 'up')}
                          className="p-1 rounded hover:bg-white/20 disabled:opacity-30 cursor-pointer"
                          title="Chuyển lên"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={index === visiblePages.length - 1}
                          onClick={() => handleMove(index, 'down')}
                          className="p-1 rounded hover:bg-white/20 disabled:opacity-30 cursor-pointer"
                          title="Chuyển xuống"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(index)}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                          page.status === 'published'
                            ? 'bg-emerald-600/80 text-white'
                            : 'bg-amber-600/80 text-white'
                        }`}
                        title="Đổi trạng thái"
                      >
                        {page.status === 'published' ? 'Đang hiện' : 'Bản nháp'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleVisible(index)}
                        className="p-1 rounded hover:bg-white/20 cursor-pointer"
                        title={page.is_visible ? 'Ẩn trang' : 'Hiện trang'}
                      >
                        {page.is_visible ? <Eye size={14} /> : <EyeOff size={14} className="text-amber-400" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(page.id, page.title)}
                        className="p-1 rounded hover:bg-red-500/80 text-red-300 hover:text-white cursor-pointer"
                        title="Xóa trang"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        </>
      ) : (
        <div className="p-8 text-center bg-white rounded-[22px] border border-line my-4">
          <p className="text-[17px] text-muted font-medium">
            Nội dung đang được cập nhật.
          </p>
        </div>
      )}

      {/* Modal Sửa trang */}
      {editingPage && (
        <EditPageModal
          isOpen={true}
          page={editingPage}
          topicId={topic.id}
          onClose={() => setEditingPage(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Modal Thêm trang mới */}
      {isCreating && (
        <EditPageModal
          isOpen={true}
          page={null}
          topicId={topic.id}
          nextSortOrder={pagesWithCount.length + 1}
          onClose={() => setIsCreating(false)}
          onSaved={handleSaved}
        />
      )}
    </section>
  );
}
