import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { getSettings, getTopics, getPagesByTopic } from '../lib/data';
import HomeContinueSection from '../components/HomeContinueSection';
import TopicListClient from '../components/TopicListClient';
import AuthorIntroSection from '../components/AuthorIntroSection';
import BottomNav from '../components/BottomNav';
import HomeHeader from '../components/HomeHeader';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `${settings?.app_name || 'Học Cơ Thể'} · Hiểu Về Cơ Thể`,
    description: 'Ứng dụng học hiểu kiến thức về cơ thể theo lộ trình chuẩn y khoa',
  };
}

export default async function HomePage() {
  const [settings, topics] = await Promise.all([
    getSettings(),
    getTopics(true),
  ]);

  // Lấy số trang của từng chủ đề
  const topicsWithCounts = await Promise.all(
    topics.map(async (topic) => {
      const pages = await getPagesByTopic(topic.id);
      return {
        topic,
        pageCount: pages.length,
      };
    })
  );

  return (
    <main className="flex-1 flex flex-col px-5 pt-4 pb-28 gap-6">
      {/* 1. Thanh đầu trang: Logo + Tên App + Quản trị */}
      <HomeHeader initialAppName={settings.app_name} />

      {/* 2. Lời chào */}
      <section className="flex flex-col gap-1">
        <span className="text-[16px] text-muted font-normal leading-normal">
          Xin chào!
        </span>
        <h1 className="text-[28px] font-extrabold text-ink leading-[1.2]">
          Hôm nay mình học gì?
        </h1>
      </section>

      {/* 3. Ô tìm kiếm (bấm vào mở /tim-kiem) */}
      <section>
        <Link
          href="/tim-kiem"
          className="relative block w-full group cursor-pointer"
          aria-label="Mở trang tìm kiếm"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted">
            <Search size={22} />
          </div>
          <input
            type="text"
            readOnly
            placeholder="Tìm bài, ví dụ: đĩa đệm"
            className="w-full h-[58px] min-h-[48px] pl-12 pr-4 rounded-[20px] bg-white border-[1.5px] border-line text-[17px] text-ink placeholder:text-muted focus:outline-hidden cursor-pointer shadow-2xs group-hover:border-primary/50 transition-colors"
            tabIndex={-1}
          />
        </Link>
      </section>

      {/* 4. Thẻ Xem tiếp (đọc từ localStorage client, chưa có -> ẩn) */}
      <HomeContinueSection />

      {/* 5 & 6. Lưới 2 cột các thẻ Chủ đề kèm quản trị */}
      <TopicListClient initialTopics={topicsWithCounts} />

      {/* 7. Khối giới thiệu tác giả & các sách đã làm ở cuối trang chủ */}
      <AuthorIntroSection initialProfile={settings.author_profile} />

      {/* 8. Thanh điều hướng dưới cùng */}
      <BottomNav />
    </main>
  );
}
