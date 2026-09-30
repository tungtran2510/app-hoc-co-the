import React from 'react';
import { getSettings, getTopicsWithCounts } from '../lib/data';
import HomeHeader from '../components/HomeHeader';
import HomeSectionsClient from '../components/HomeSectionsClient';
import BottomNav from '../components/BottomNav';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `${settings?.app_name || 'Học Cơ Thể'} · Hiểu Về Cơ Thể`,
    description: 'Ứng dụng học hiểu kiến thức về cơ thể và chăm sóc sức khỏe chủ động',
  };
}

export default async function HomePage() {
  const [settings, topicsWithCounts] = await Promise.all([
    getSettings(),
    getTopicsWithCounts(true),
  ]);

  return (
    <main className="flex-1 flex flex-col px-4 sm:px-5 pt-3 pb-28 gap-4 sm:gap-5">
      {/* 1. Header chuẩn iPhone: Lời chào Dr. Tùng + Tìm kiếm + Avatar + Brand Card phong cách MEDICA LEARN */}
      <HomeHeader
        initialAppName={settings.app_name}
        initialAppSubtitle={settings.app_subtitle}
        initialLogoUrl={settings.logo_url}
        initialHotline={settings.hotline}
        initialZaloUrl={settings.zalo_url}
      />

      {/* 2. Lưới chuyên đề học (Learning Paths) & Các khối nội dung sắp xếp */}
      <HomeSectionsClient
        initialSectionsOrder={settings.home_sections_order}
        topicsWithCounts={topicsWithCounts}
        topicsTitle={settings.topics_title || 'Chuyên Đề Học'}
        authorProfile={settings.author_profile}
        recommendedBooksTitle={settings.recommended_books_title}
        recommendedBooksSubtitle={settings.recommended_books_subtitle}
        recommendedBooks={settings.recommended_books}
        initialBooksLayout={settings.recommended_books_layout}
      />

      {/* 3. Thanh điều hướng dưới cùng */}
      <BottomNav />
    </main>
  );
}
