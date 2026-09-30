'use client';

import React, { useState, useEffect } from 'react';
import { Topic, AuthorProfile, RecommendedBook } from '../lib/types';
import { checkIsAdminClient } from '../lib/adminAuth';
import { saveSettingsApi } from '../lib/apiAdmin';
import TopicListClient from './TopicListClient';
import AuthorIntroSection from './AuthorIntroSection';
import RecommendedBooksSection from './RecommendedBooksSection';
import ReorderHomeSectionsModal from './admin/ReorderHomeSectionsModal';

interface HomeSectionsClientProps {
  initialSectionsOrder?: string[] | null;
  topicsWithCounts: {
    topic: Topic;
    pageCount: number;
  }[];
  topicsTitle?: string | null;
  authorProfile?: AuthorProfile | null;
  recommendedBooksTitle?: string | null;
  recommendedBooksSubtitle?: string | null;
  recommendedBooks?: RecommendedBook[];
  initialBooksLayout?: 'grid' | 'lookbook' | null;
}

const DEFAULT_SECTIONS_ORDER = ['topics', 'author', 'recommended_books'];

export default function HomeSectionsClient({
  initialSectionsOrder,
  topicsWithCounts,
  topicsTitle,
  authorProfile,
  recommendedBooksTitle,
  recommendedBooksSubtitle,
  recommendedBooks = [],
  initialBooksLayout,
}: HomeSectionsClientProps) {
  const [sectionsOrder, setSectionsOrder] = useState<string[]>(() => {
    if (Array.isArray(initialSectionsOrder) && initialSectionsOrder.length > 0) {
      const valid = initialSectionsOrder.filter((k) => DEFAULT_SECTIONS_ORDER.includes(k));
      DEFAULT_SECTIONS_ORDER.forEach((k) => {
        if (!valid.includes(k)) valid.push(k);
      });
      return valid;
    }
    return DEFAULT_SECTIONS_ORDER;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);

  useEffect(() => {
    checkIsAdminClient().then(setIsAdmin);
    if (initialSectionsOrder && initialSectionsOrder.length > 0) {
      const valid = initialSectionsOrder.filter((k) => DEFAULT_SECTIONS_ORDER.includes(k));
      DEFAULT_SECTIONS_ORDER.forEach((k) => {
        if (!valid.includes(k)) valid.push(k);
      });
      setSectionsOrder(valid);
    }
  }, [initialSectionsOrder]);

  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sectionsOrder.length) return;

    const nextOrder = [...sectionsOrder];
    const temp = nextOrder[index];
    nextOrder[index] = nextOrder[targetIndex];
    nextOrder[targetIndex] = temp;

    // Cập nhật giao diện ngay lập tức
    setSectionsOrder(nextOrder);

    // Lưu vào database ngầm
    const res = await saveSettingsApi({
      home_sections_order: nextOrder,
    });

    if (!res.success) {
      alert('Chưa thể lưu thứ tự khối – vui lòng kiểm tra kết nối mạng.');
      // Rollback
      setSectionsOrder(sectionsOrder);
    }
  };

  const handleModalSaved = (newOrder: string[]) => {
    setSectionsOrder(newOrder);
  };

  return (
    <>
      {sectionsOrder.map((sectionKey, index) => {
        if (sectionKey === 'topics') {
          return (
            <TopicListClient
              key="topics"
              initialTopics={topicsWithCounts}
              initialTopicsTitle={topicsTitle}
              sectionIndex={index}
              totalSections={sectionsOrder.length}
              onMoveUp={() => handleMoveSection(index, 'up')}
              onMoveDown={() => handleMoveSection(index, 'down')}
              onOpenReorderModal={() => setShowReorderModal(true)}
            />
          );
        }

        if (sectionKey === 'author') {
          return (
            <AuthorIntroSection
              key="author"
              initialProfile={authorProfile}
              sectionIndex={index}
              totalSections={sectionsOrder.length}
              onMoveUp={() => handleMoveSection(index, 'up')}
              onMoveDown={() => handleMoveSection(index, 'down')}
              onOpenReorderModal={() => setShowReorderModal(true)}
            />
          );
        }

        if (sectionKey === 'recommended_books') {
          return (
            <RecommendedBooksSection
              key="recommended_books"
              initialTitle={recommendedBooksTitle}
              initialSubtitle={recommendedBooksSubtitle}
              initialBooks={recommendedBooks}
              initialLayout={initialBooksLayout}
              sectionIndex={index}
              totalSections={sectionsOrder.length}
              onMoveUp={() => handleMoveSection(index, 'up')}
              onMoveDown={() => handleMoveSection(index, 'down')}
              onOpenReorderModal={() => setShowReorderModal(true)}
            />
          );
        }

        return null;
      })}

      {/* Modal Sắp xếp thứ tự các khối */}
      <ReorderHomeSectionsModal
        isOpen={showReorderModal}
        currentOrder={sectionsOrder}
        onClose={() => setShowReorderModal(false)}
        onSaved={handleModalSaved}
      />
    </>
  );
}
