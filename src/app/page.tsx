import React from 'react';
import { getSettings, getTopicsWithCounts } from '../lib/data';
import HomeHeader from '../components/HomeHeader';
import HomeSectionsClient from '../components/HomeSectionsClient';
import BottomNav from '../components/BottomNav';
import QbizBooksOpeningSplash from '../components/QbizBooksOpeningSplash';
import { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `${settings?.app_name || 'Qbiz Books'} · Tủ Sách Y Khoa & Khám Phá Cơ Thể`,
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
      {/* Hiệu ứng 3D mở sách Qbiz Books khi vào trang chủ */}
      <QbizBooksOpeningSplash />

      {/* 1. Header chuẩn iPhone: Lời chào Dr. Tùng + Tìm kiếm + Avatar + Brand Card phong cách MEDICA LEARN */}
      <HomeHeader
        initialAppName={settings.app_name}
        initialAppSubtitle={settings.app_subtitle}
        initialBrandTagline={settings.brand_tagline}
        initialLogoUrl={settings.logo_url}
        initialHotline={settings.hotline}
        initialZaloUrl={settings.zalo_url}
      />

      {/* 2. Lưới chuyên đề học (Learning Paths) & Các khối nội dung sắp xếp */}
      <HomeSectionsClient
        initialSectionsOrder={settings.home_sections_order}
        initialHiddenSections={settings.hidden_home_sections}
        topicsWithCounts={topicsWithCounts}
        topicsTitle={settings.topics_title || 'Chuyên Đề Học'}
        authorProfile={settings.author_profile}
        recommendedBooksTitle={settings.recommended_books_title}
        recommendedBooksSubtitle={settings.recommended_books_subtitle}
        recommendedBooks={settings.recommended_books}
        initialBooksLayout={settings.recommended_books_layout}
        appName={settings.app_name}
        appSubtitle={settings.app_subtitle}
        brandTagline={settings.brand_tagline}
        logoUrl={settings.logo_url}
        hotline={settings.hotline}
        zaloUrl={settings.zalo_url}
        welcomeTitle={settings.welcome_title}
        welcomeMessage={settings.welcome_message}
        welcomeVideoUrl={settings.welcome_video_url}
      />

      {/* 3. Thanh điều hướng dưới cùng */}
      <BottomNav />
    </main>
  );
}
