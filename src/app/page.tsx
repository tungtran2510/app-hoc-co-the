import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { getSettings, getTopics, getPagesByTopic, getContinue } from '../lib/data';
import ContinueCard from '../components/ContinueCard';
import TopicCard from '../components/TopicCard';
import BottomNav from '../components/BottomNav';
import HomeHeader from '../components/HomeHeader';

export default async function HomePage() {
  const [settings, topics, continueInfo] = await Promise.all([
    getSettings(),
    getTopics(),
    getContinue(),
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

  const continueUrl = continueInfo
    ? `/${continueInfo.topic_slug}/${continueInfo.page_slug}`
    : '/cot-song/tong-quan-ve-cot-song';

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

      {/* 3. Ô tìm kiếm (Lệnh 01: chỉ hiển thị) */}
      <section>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted">
            <Search size={22} />
          </div>
          <input
            type="text"
            readOnly
            placeholder="Tìm bài, ví dụ: đĩa đệm"
            className="w-full h-[58px] min-h-[48px] pl-12 pr-4 rounded-[20px] bg-white border-[1.5px] border-line text-[17px] text-ink placeholder:text-muted focus:outline-hidden cursor-default shadow-2xs"
            aria-label="Tìm kiếm nội dung"
          />
        </div>
      </section>

      {/* 4. Thẻ Xem tiếp (hiển thị khi có dữ liệu) */}
      {continueInfo && (
        <section>
          <ContinueCard info={continueInfo} />
        </section>
      )}

      {/* 5 & 6. Tiêu đề Chủ đề + Lưới 2 cột các thẻ Chủ đề */}
      <section className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] font-extrabold text-ink leading-tight">
            Chủ đề
          </h2>
          <span className="text-[16px] text-muted font-medium">
            {topics.length} chủ đề
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {topicsWithCounts.map(({ topic, pageCount }) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              pageCount={pageCount}
            />
          ))}
        </div>
      </section>

      {/* 7. Thanh điều hướng dưới cùng */}
      <BottomNav continueUrl={continueUrl} />
    </main>
  );
}
