import React from 'react';
import { getSettings, getTopicsWithCounts } from '../lib/data';
import HomeHeader from '../components/HomeHeader';
import HomeSectionsClient from '../components/HomeSectionsClient';
import BottomNav from '../components/BottomNav';
import QbizBooksOpeningSplash from '../components/QbizBooksOpeningSplash';
import { Metadata } from 'next';
import homeStyles from './home-page.module.css';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `${settings?.app_name || 'Qbiz Books'} · Tủ Sách Y Khoa & Khám Phá Cơ Thể`;
  const description = 'Ứng dụng học hiểu kiến thức về cơ thể và chăm sóc sức khỏe chủ động';
  const ogImage = settings?.logo_url || '/spine_hero_clean.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'vi_VN',
      siteName: settings?.app_name || 'Qbiz Books',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function HomePage() {
  const [settings, topicsWithCounts] = await Promise.all([
    getSettings(),
    getTopicsWithCounts(false),
  ]);

  return (
    <main className={`${homeStyles.homePage} flex-1 flex flex-col font-[var(--font-be-vietnam-pro)] bg-[radial-gradient(ellipse_75%_22%_at_50%_0%,rgba(214,179,106,0.10),transparent_75%),linear-gradient(180deg,#FBFAF7_0%,#F6F7F9_48%,#FBFAF7_100%)] dark:bg-none dark:bg-[#0C0817] px-4 sm:px-5 pt-3 pb-28 gap-4 sm:gap-5`}>
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
        topicsDisplay={settings.home_topics_display || settings.topics_display}
        featuredTopicIds={settings.featured_topic_ids}
        topicsDescription={settings.topics_description}
        authorProfile={settings.author_profile}
        recommendedBooksTitle={settings.recommended_books_title}
        recommendedBooksSubtitle={settings.recommended_books_subtitle}
        recommendedBooks={settings.recommended_books}
        initialBooksLayout={settings.recommended_books_layout}
        flatBooksTitle={settings.flat_books_title}
        flatBooks={settings.flat_books}
        appName={settings.app_name}
        appSubtitle={settings.app_subtitle}
        brandTagline={settings.brand_tagline}
        logoUrl={settings.logo_url}
        hotline={settings.hotline}
        zaloUrl={settings.zalo_url}
        welcomeTitle={settings.welcome_title}
        welcomeMessage={settings.welcome_message}
        welcomeVideoUrl={settings.welcome_video_url}
        initialCustomBlocks={settings.home_custom_blocks}
      />

      {/* 3. Thanh điều hướng dưới cùng */}
      <BottomNav />
    </main>
  );
}
