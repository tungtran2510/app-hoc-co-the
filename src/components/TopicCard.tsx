import React from 'react';
import Link from 'next/link';
import TopicIcon from './TopicIcon';
import { Topic } from '../lib/types';

interface TopicCardProps {
  topic: Topic;
  pageCount: number;
}

export default function TopicCard({ topic, pageCount }: TopicCardProps) {
  const subtitle = pageCount > 0 ? `${pageCount} nội dung` : 'Sắp có';

  return (
    <Link
      href={`/${topic.slug}`}
      className="flex flex-col justify-between h-[172px] rounded-[22px] p-4 transition-transform active:scale-[0.98] border border-line/40"
      style={{ backgroundColor: topic.color_bg }}
    >
      {/* Ô trắng chứa icon */}
      <div
        className="w-16 h-16 rounded-[18px] bg-white flex items-center justify-center shadow-xs"
        style={{ color: topic.color_fg }}
      >
        <TopicIcon name={topic.icon} size={36} />
      </div>

      {/* Tên & dòng phụ */}
      <div className="flex flex-col">
        <h3
          className="text-[20px] font-extrabold leading-[1.25] line-clamp-2"
          style={{ color: '#1B2330' }}
        >
          {topic.title}
        </h3>
        <span className="text-[15px] font-medium text-muted mt-0.5">
          {subtitle}
        </span>
      </div>
    </Link>
  );
}
