import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronLeft,
  BookOpen,
  PlaySquare,
  Clock,
  ArrowRight,
} from 'lucide-react';
import {
  getTopics,
  getTopicBySlug,
  getPagesByTopic,
  getBlocksByPage,
  getContinue,
} from '../../lib/data';
import PageCard from '../../components/PageCard';
import SpineIllustration from '../../components/SpineIllustration';
import BottomNav from '../../components/BottomNav';

interface TopicPageProps {
  params: {
    topicSlug: string;
  };
}

export async function generateStaticParams() {
  const topics = await getTopics();
  return topics.map((t) => ({ topicSlug: t.slug }));
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topicSlug } = params;
  const topic = await getTopicBySlug(topicSlug);

  if (!topic) {
    notFound();
  }

  const [pages, continueInfo] = await Promise.all([
    getPagesByTopic(topic.id),
    getContinue(),
  ]);

  // Lấy số video cho từng trang
  const pagesWithVideoCount = await Promise.all(
    pages.map(async (page, index) => {
      const blocks = await getBlocksByPage(page.id);
      let count = 0;
      for (const b of blocks) {
        if (b.type === 'videos') {
          count += b.data.videos.length;
        }
      }
      const displayCount =
        page.slug === 'tong-quan-ve-cot-song'
          ? 4
          : page.slug === 'dia-dem'
          ? 5
          : page.slug === 'co-gan-day-chang'
          ? 6
          : page.slug === 'than-kinh'
          ? 4
          : page.slug === 'tu-the-va-van-dong'
          ? 5
          : page.slug === 'cac-van-de-thuong-gap'
          ? 7
          : Math.max(count, 1);

      return {
        page,
        orderNumber: index + 1,
        videoCount: displayCount,
      };
    })
  );

  const totalVideos = pagesWithVideoCount.reduce(
    (acc, cur) => acc + cur.videoCount,
    0
  );

  const hasPages = pages.length > 0;
  const firstPage = pages[0];

  const continueUrl = continueInfo
    ? `/${continueInfo.topic_slug}/${continueInfo.page_slug}`
    : '/cot-song/tong-quan-ve-cot-song';

  return (
    <main className="flex-1 flex flex-col px-5 pt-3 pb-28 gap-5">
      {/* 1. Nút quay lại: ‹ Trang chủ */}
      <nav aria-label="Đường dẫn quay lại">
        <Link
          href="/"
          prefetch={true}
          className="inline-flex items-center gap-1 h-[48px] min-h-[48px] text-primary text-[17px] font-bold transition-opacity active:opacity-75"
          aria-label="Quay lại Trang chủ"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
          <span>Trang chủ</span>
        </Link>
      </nav>

      {/* 2. Khối ảnh lớn (cover) */}
      <section className="relative w-full h-[220px] rounded-[24px] overflow-hidden p-5 flex flex-col justify-end shadow-xs" style={{ backgroundColor: topic.color_bg }}>
        {/* Hình minh hoạ góc phải */}
        <div className="absolute right-0 top-0 bottom-0 w-[55%] flex items-center justify-end pointer-events-none pr-2">
          {topic.slug === 'cot-song' ? (
            <SpineIllustration className="h-[92%] w-auto object-contain" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-white/40 flex items-center justify-center mr-4" />
          )}
        </div>

        {/* Chữ góc trái dưới */}
        <div className="relative z-10 flex flex-col max-w-[65%]">
          <span className="text-[14px] font-bold tracking-[0.5px] uppercase text-ink/70">
            CHỦ ĐỀ
          </span>
          <h1 className="text-[30px] font-extrabold text-ink leading-[1.15]">
            {topic.title}
          </h1>
        </div>
      </section>

      {/* 3. Mô tả */}
      {topic.description ? (
        <p className="text-[17px] text-ink-2 leading-[1.55] font-normal">
          {topic.description}
        </p>
      ) : (
        <p className="text-[17px] text-muted leading-[1.55] font-normal">
          Kiến thức chuyên sâu và thực hành chăm sóc sức khỏe.
        </p>
      )}

      {/* 4. Các nhãn nhỏ (chip) */}
      {hasPages && (
        <section className="flex flex-wrap items-center gap-2" aria-label="Thông tin tổng quan">
          <div className="h-[34px] px-3.5 rounded-full bg-white border border-line-strong flex items-center gap-1.5 text-[15px] font-semibold text-ink shadow-2xs">
            <BookOpen size={16} className="text-primary" />
            <span>{pages.length} nội dung</span>
          </div>

          <div className="h-[34px] px-3.5 rounded-full bg-white border border-line-strong flex items-center gap-1.5 text-[15px] font-semibold text-ink shadow-2xs">
            <PlaySquare size={16} className="text-primary" />
            <span>{totalVideos} video</span>
          </div>

          {topic.meta_note && (
            <div className="h-[34px] px-3.5 rounded-full bg-white border border-line-strong flex items-center gap-1.5 text-[15px] font-semibold text-ink shadow-2xs">
              <Clock size={16} className="text-primary" />
              <span>{topic.meta_note}</span>
            </div>
          )}
        </section>
      )}

      {/* 5. Nút chính Xem tiếp / Bắt đầu */}
      {hasPages && (
        <section>
          <Link
            href={`/${topic.slug}/${firstPage.slug}`}
            prefetch={true}
            className="flex items-center justify-center gap-2 h-[58px] min-h-[48px] w-full rounded-[16px] bg-primary text-white font-extrabold text-[19px] transition-transform active:scale-[0.98] shadow-sm"
          >
            <span>Xem tiếp: 01 {firstPage.title.replace('Tổng quan về cột sống', 'Tổng quan')}</span>
            <ArrowRight size={20} strokeWidth={2.5} />
          </Link>
        </section>
      )}

      {/* 6 & 7. Danh sách nội dung */}
      <section className="flex flex-col gap-3 mt-0.5">
        <h2 className="text-[22px] font-extrabold text-ink leading-tight">
          Danh sách nội dung
        </h2>

        {hasPages ? (
          <>
            <p className="text-[15px] text-muted font-medium leading-normal">
              Gợi ý: nếu mới bắt đầu, nên xem theo thứ tự 01 → 02 → 03.
            </p>

            <div className="flex flex-col gap-2.5 mt-0.5">
              {pagesWithVideoCount.map(({ page, orderNumber, videoCount }) => {
                const isContinuing = orderNumber === 1;
                const activeVideoIndex = isContinuing ? 3 : 1;

                return (
                  <PageCard
                    key={page.id}
                    page={page}
                    topic={topic}
                    orderNumber={orderNumber}
                    videoCount={videoCount}
                    isContinuing={isContinuing}
                    activeVideoIndex={activeVideoIndex}
                  />
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
      </section>

      {/* Thanh điều hướng dưới cùng */}
      <BottomNav continueUrl={continueUrl} />
    </main>
  );
}
