'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [pagesWithCount, setPagesWithCount] = useState<PageItemData[]>(initialPages);
  const [activePageId, setActivePageId] = useState<string | null>(null);
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
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Cập nhật lại số thứ tự hiển thị và sort_order liên tục 1, 2, 3...
    const reordered = list.map((item, idx) => ({
      ...item,
      orderNumber: idx + 1,
      page: {
        ...item.page,
        sort_order: idx + 1,
      },
    }));

    setPagesWithCount(reordered);

    const [res1, res2] = await Promise.all([
      savePageApi(reordered[index].page),
      savePageApi(reordered[targetIndex].page),
    ]);
    if (!res1.success || !res2.success) {
      alert('Chưa lưu được – chưa kết nối dữ liệu');
      // Phục hồi lại vị trí cũ
      setPagesWithCount(pagesWithCount);
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
    router.refresh();
  };

  const visiblePages = pagesWithCount.filter(
    (item) => isAdmin || (item.page.is_visible && item.page.status === 'published')
  );

  return (
    <section className="flex flex-col gap-2 mt-1">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] sm:text-[16.5px] font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">
          LỘ TRÌNH {visiblePages.length} BƯỚC · {visiblePages.length} BÀI HỌC
        </h2>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1 h-7.5 px-2.5 rounded-full bg-[#1E3A8A] hover:bg-[#172554] text-amber-300 font-bold text-[11.5px] shadow-xs cursor-pointer transition-all shrink-0"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Thêm bài</span>
          </button>
        )}
      </div>

      {visiblePages.length > 0 ? (
        <>
          <p className="text-[12px] sm:text-[12.5px] text-slate-500 dark:text-white/70 font-medium leading-tight truncate -mt-0.5">
            Gợi ý: Nên xem lần lượt theo thứ tự từ 01 → 02 → 03.
          </p>

          <div className="relative flex flex-col gap-2.5 mt-1">
            {/* Đường kẻ dọc nối liền các bước lộ trình (như Ảnh mẫu 2) */}
            <div
              className="absolute left-[13.5px] top-5 bottom-5 w-[2px] bg-slate-200/90 dark:bg-purple-800/40 pointer-events-none z-0"
              aria-hidden="true"
            />

            {visiblePages.map(({ page, orderNumber, videoCount }, index) => {
              const pageTienDo = tienDo[page.id];
              const watchedVideos = pageTienDo?.watched || [];
              const lastVideo = pageTienDo?.last_video;
              const isCompleted = completedPages.includes(page.id);
              const formattedOrder = String(orderNumber).padStart(2, '0');

              return (
                <div key={page.id} className="w-full relative group flex flex-col gap-1.5">
                  <div className="w-full flex items-center gap-2 sm:gap-2.5">
                    {/* Cột mốc tròn số thứ tự trên dòng lộ trình (như Ảnh mẫu 2) */}
                    <div
                      className={`w-[29px] h-[29px] rounded-full flex items-center justify-center text-[11px] font-black shrink-0 shadow-2xs z-10 font-mono transition-colors ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border-[1.5px] border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-600/50'
                          : 'bg-white dark:bg-[#160D30] text-slate-500 dark:text-white/75 border-[1.5px] border-slate-200 dark:border-purple-500/40'
                      }`}
                      title={`Bước ${formattedOrder}`}
                    >
                      {formattedOrder}
                    </div>

                    {/* Thẻ bài học PageCard */}
                    <div className="flex-1 min-w-0">
                      <PageCard
                        page={page}
                        topic={topic}
                        orderNumber={orderNumber}
                        videoCount={videoCount}
                        watchedVideos={watchedVideos}
                        lastVideo={lastVideo}
                        isCompleted={isCompleted}
                        isActive={activePageId === page.id}
                        onActivate={() => setActivePageId(page.id)}
                      />
                    </div>
                  </div>

                  {/* Huy hiệu Quản trị: Bản nháp / Đang ẩn */}
                  {isAdmin && (
                    <div className="pl-[37px] flex items-center gap-1.5">
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

                  {/* Thanh công cụ Admin trên mỗi thẻ trang */}
                  {isAdmin && (
                    <div className="ml-[37px] flex items-center justify-between mt-1 px-2.5 py-1.5 rounded-[12px] bg-slate-900 text-white text-[12px] font-bold shadow-xs">
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
