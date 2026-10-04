import React from 'react';
import { Metadata } from 'next';
import { getSettings, getTopicsWithCounts } from '../../lib/data';
import TopicListClient from '../../components/TopicListClient';
import BottomNav from '../../components/BottomNav';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Chuyên đề · Tất cả bài học',
  description: 'Tất cả chuyên đề và bài học giải phẫu, chăm sóc cơ thể',
};

export default async function AllTopicsPage() {
  const [settings, topicsWithCounts] = await Promise.all([getSettings(), getTopicsWithCounts(true)]);

  return (
    <main className="flex-1 flex flex-col px-4 sm:px-5 pt-4 pb-28 gap-4 max-w-lg md:max-w-3xl mx-auto w-full">

      <TopicListClient
        initialTopics={topicsWithCounts}
        initialTopicsTitle={settings.topics_title || 'Chuyên Đề Học'}
        initialDisplay={settings.topics_display}
        hideViewAll
        enableSearch
      />

      <BottomNav />
    </main>
  );
}
