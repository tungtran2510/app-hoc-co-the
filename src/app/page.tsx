import React from 'react';
import { getSettings, getTopicsWithCounts } from '../lib/data';
import HomeHeader from '../components/HomeHeader';
import HomeGreetingSection from '../components/HomeGreetingSection';
import HomeContinueSection from '../components/HomeContinueSection';
import HomeSectionsClient from '../components/HomeSectionsClient';
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
  const [settings, topicsWithCounts] = await Promise.all([
    getSettings(),
    getTopicsWithCounts(true),
  ]);

  return (
    <main className="flex-1 flex flex-col px-4 sm:px-5 pt-3 pb-28 gap-4 sm:gap-5">
      {/* 1. Thanh đầu trang: Logo + Tên App + Quản trị */}
      <HomeHeader
        initialAppName={settings.app_name}
        initialAppSubtitle={settings.app_subtitle}
        initialLogoUrl={settings.logo_url}
        initialHotline={settings.hotline}
        initialZaloUrl={settings.zalo_url}
      />

      {/* 2 & 3. Lời chào, Tiêu đề chính & Ô tìm kiếm (có nút sửa cho Quản trị viên) */}
      <HomeGreetingSection
        initialGreeting={settings.home_greeting}
        initialTitle={settings.home_title}
        initialSearchPlaceholder={settings.search_placeholder}
        initialTopicsTitle={settings.topics_title}
      />

      {/* 4. Thẻ Xem tiếp (đọc từ localStorage client, chưa có -> ẩn) */}
      <HomeContinueSection />

      {/* 5, 6, 7, 8. Các khối nội dung có thể sắp xếp thứ tự: Chủ đề, Tác giả, Sách nên đọc */}
      <HomeSectionsClient
        initialSectionsOrder={settings.home_sections_order}
        topicsWithCounts={topicsWithCounts}
        topicsTitle={settings.topics_title}
        authorProfile={settings.author_profile}
        recommendedBooksTitle={settings.recommended_books_title}
        recommendedBooksSubtitle={settings.recommended_books_subtitle}
        recommendedBooks={settings.recommended_books}
        initialBooksLayout={settings.recommended_books_layout}
      />

      {/* 9. Thanh điều hướng dưới cùng */}
      <BottomNav />
    </main>
  );
}
