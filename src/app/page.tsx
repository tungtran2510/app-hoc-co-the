import React from 'react';
import Link from 'next/link';
import { BookOpen, Search, User } from 'lucide-react';
import { getSettings, getTopics, getPagesByTopic, getContinue } from '../lib/data';
import ContinueCard from '../components/ContinueCard';
import TopicCard from '../components/TopicCard';
import BottomNav from '../components/BottomNav';

export const revalidate = 0;

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
      {/* 1. Thanh đầu trang: Logo + Tên App + Nút đại diện người dùng dẫn đến /dang-nhap */}
      <header className="flex items-center justify-between h-[52px]">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-[12px] bg-primary flex items-center justify-center text-white shadow-xs">
            <BookOpen size={22} strokeWidth={2.5} />
          </div>
          <span className="text-[20px] font-extrabold text-ink leading-tight">
            {settings.app_name}
          </span>
        </div>

        {/* Nút cá nhân / quản trị */}
        <Link
          href="/dang-nhap"
          className="w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center text-muted hover:text-primary transition-colors"
          aria-label="Đăng nhập quản trị"
          title="Đăng nhập quản trị"
        >
          <User size={20} />
        </Link>
      </header>

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
