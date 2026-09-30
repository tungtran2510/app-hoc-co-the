import React from 'react';
import { getSettings, getTopics, getPagesByTopic } from '../lib/data';
import HomeHeader from '../components/HomeHeader';
import HomeGreetingSection from '../components/HomeGreetingSection';
import HomeContinueSection from '../components/HomeContinueSection';
import TopicListClient from '../components/TopicListClient';
import AuthorIntroSection from '../components/AuthorIntroSection';
import RecommendedBooksSection from '../components/RecommendedBooksSection';
import BottomNav from '../components/BottomNav';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

      {/* 2 & 3. Lời chào, Tiêu đề chính & Ô tìm kiếm (có nút sửa cho Quản trị viên) */}
      <HomeGreetingSection
        initialGreeting={settings.home_greeting}
        initialTitle={settings.home_title}
        initialSearchPlaceholder={settings.search_placeholder}
        initialTopicsTitle={settings.topics_title}
      />

      {/* 4. Thẻ Xem tiếp (đọc từ localStorage client, chưa có -> ẩn) */}
      <HomeContinueSection />

      {/* 5 & 6. Lưới 2 cột các thẻ Chủ đề kèm quản trị */}
      <TopicListClient
        initialTopics={topicsWithCounts}
        initialTopicsTitle={settings.topics_title}
      />

      {/* 7. Khối giới thiệu tác giả & các sách đã làm ở cuối trang chủ */}
      <AuthorIntroSection initialProfile={settings.author_profile} />

      {/* 8. Khối Sách Nên Đọc (Lưới 2 cột · Tỷ lệ ảnh dọc 3:4 · Sửa được mọi thông tin) */}
      <RecommendedBooksSection
        initialTitle={settings.recommended_books_title}
        initialSubtitle={settings.recommended_books_subtitle}
        initialBooks={settings.recommended_books}
      />

      {/* 9. Thanh điều hướng dưới cùng */}
      <BottomNav />
    </main>
  );
}
