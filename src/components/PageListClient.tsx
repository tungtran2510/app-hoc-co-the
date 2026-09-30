'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, ArrowUp, ArrowDown, Eye, EyeOff, Trash2, FileText } from 'lucide-react';
import PageCard from './PageCard';
import { Page, Topic } from '../lib/types';
import { checkIsAdminClient } from '../lib/adminAuth';
import { savePageApi, deletePageApi } from '../lib/apiAdmin';
import EditPageModal from './admin/EditPageModal';
import { getStoredTienDo, TienDoMap } from '../lib/learningProgress';

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

  useEffect(() => {
    checkIsAdminClient().then((admin) => setIsAdmin(admin));
    try {
      setTienDo(getStoredTienDo());
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

    await Promise.all([
      savePageApi(current.page),
      savePageApi(target.page),
    ]);
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
    await savePageApi(updated);
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
    await savePageApi(updated);
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
        alert(res.error || 'Chưa xóa được trang, thử lại');
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
    <section className="flex flex-col gap-3 mt-0.5">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-extrabold text-ink leading-tight">
          Danh sách nội dung
        </h2>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-primary text-white font-bold text-[13px] shadow-xs hover:bg-primary-dark cursor-pointer transition-all"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Thêm trang</span>
          </button>
        )}
      </div>

      {visiblePages.length > 0 ? (
        <>
          <p className="text-[15px] text-muted font-medium leading-normal">
            Gợi ý: nếu mới bắt đầu, nên xem theo thứ tự 01 → 02 → 03.
          </p>

          <div className="flex flex-col gap-3 mt-0.5">
            {visiblePages.map(({ page, orderNumber, videoCount }, index) => {
              const pageTienDo = tienDo[page.id];
              const watchedVideos = pageTienDo?.watched || [];
              const lastVideo = pageTienDo?.last_video;

              return (
                <div key={page.id} className="relative flex flex-col group">
                  <div className="relative">
                    <PageCard
                      page={page}
                      topic={topic}
                      orderNumber={orderNumber}
                      videoCount={videoCount}
                      watchedVideos={watchedVideos}
                      lastVideo={lastVideo}
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
