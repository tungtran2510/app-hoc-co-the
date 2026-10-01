'use client';

import React, { useState, useEffect } from 'react';
import { Topic, AuthorProfile, RecommendedBook, AuthorBook } from '../lib/types';
import { checkIsAdminClient } from '../lib/adminAuth';
import { saveSettingsApi } from '../lib/apiAdmin';
import { normalizeAuthorProfile, normalizeHomeSectionsOrder } from '../lib/data';
import TopicListClient from './TopicListClient';
import AuthorIntroSection, {
  AuthorProfileSection,
  AuthorBooksSection,
  AuthorPhilosophySection,
  AuthorContactSection,
} from './AuthorIntroSection';
import RecommendedBooksSection from './RecommendedBooksSection';
import ReorderHomeSectionsModal from './admin/ReorderHomeSectionsModal';
import EditAuthorModal from './admin/EditAuthorModal';
import BookDetailModal from './BookDetailModal';
import HomeContinueSection from './HomeContinueSection';

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

export default function HomeSectionsClient({
  initialSectionsOrder,
  topicsWithCounts,
  topicsTitle,
  authorProfile: initialAuthorProfile,
  recommendedBooksTitle,
  recommendedBooksSubtitle,
  recommendedBooks = [],
  initialBooksLayout,
}: HomeSectionsClientProps) {
  const [sectionsOrder, setSectionsOrder] = useState<string[]>(() =>
    normalizeHomeSectionsOrder(initialSectionsOrder)
  );

  const [authorProfile, setAuthorProfile] = useState<AuthorProfile>(() =>
    normalizeAuthorProfile(initialAuthorProfile)
  );

  const [isAdmin, setIsAdmin] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [authorModalTab, setAuthorModalTab] = useState<'author' | 'books' | 'contact' | 'extra'>('author');
  const [selectedAuthorBook, setSelectedAuthorBook] = useState<AuthorBook | null>(null);

  useEffect(() => {
    checkIsAdminClient().then(setIsAdmin);
    if (initialSectionsOrder) {
      setSectionsOrder(normalizeHomeSectionsOrder(initialSectionsOrder));
    }
  }, [initialSectionsOrder]);

  useEffect(() => {
    if (initialAuthorProfile) {
      setAuthorProfile(normalizeAuthorProfile(initialAuthorProfile));
    }
  }, [initialAuthorProfile]);

  const openAuthorModal = (tab: 'author' | 'books' | 'contact' | 'extra') => {
    setAuthorModalTab(tab);
    setShowAuthorModal(true);
  };

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
            <React.Fragment key="topics">
              <TopicListClient
                initialTopics={topicsWithCounts}
                initialTopicsTitle={topicsTitle}
                sectionIndex={index}
                totalSections={sectionsOrder.length}
                onMoveUp={() => handleMoveSection(index, 'up')}
                onMoveDown={() => handleMoveSection(index, 'down')}
                onOpenReorderModal={() => setShowReorderModal(true)}
              />

              {/* Khối Hoạt động gần đây (Recent Activity theo chuẩn ảnh tham chiếu iPhone) */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-[17.5px] sm:text-[18.5px] font-black text-ink tracking-tight">
                    Hoạt động gần đây
                  </h3>
                  <span className="text-[11.5px] font-black uppercase tracking-wider text-[#1E3A8A] dark:text-[#F8DF7B]">Đang học dở</span>
                </div>
                <HomeContinueSection />
              </div>
            </React.Fragment>
          );
        }

        if (sectionKey === 'author_profile') {
          return (
            <AuthorProfileSection
              key="author_profile"
              profile={authorProfile}
              isAdmin={isAdmin}
              sectionIndex={index}
              totalSections={sectionsOrder.length}
              onMoveUp={() => handleMoveSection(index, 'up')}
              onMoveDown={() => handleMoveSection(index, 'down')}
              onOpenReorderModal={() => setShowReorderModal(true)}
              onEdit={() => openAuthorModal('author')}
            />
          );
        }

        if (sectionKey === 'author_books') {
          return (
            <AuthorBooksSection
              key="author_books"
              profile={authorProfile}
              isAdmin={isAdmin}
              sectionIndex={index}
              totalSections={sectionsOrder.length}
              onMoveUp={() => handleMoveSection(index, 'up')}
              onMoveDown={() => handleMoveSection(index, 'down')}
              onOpenReorderModal={() => setShowReorderModal(true)}
              onEdit={() => openAuthorModal('books')}
              onSelectBook={(b) => setSelectedAuthorBook(b)}
            />
          );
        }

        if (sectionKey === 'author_philosophy') {
          return (
            <AuthorPhilosophySection
              key="author_philosophy"
              profile={authorProfile}
              isAdmin={isAdmin}
              sectionIndex={index}
              totalSections={sectionsOrder.length}
              onMoveUp={() => handleMoveSection(index, 'up')}
              onMoveDown={() => handleMoveSection(index, 'down')}
              onOpenReorderModal={() => setShowReorderModal(true)}
              onEdit={() => openAuthorModal('extra')}
            />
          );
        }

        if (sectionKey === 'author_contact') {
          return (
            <AuthorContactSection
              key="author_contact"
              profile={authorProfile}
              isAdmin={isAdmin}
              sectionIndex={index}
              totalSections={sectionsOrder.length}
              onMoveUp={() => handleMoveSection(index, 'up')}
              onMoveDown={() => handleMoveSection(index, 'down')}
              onOpenReorderModal={() => setShowReorderModal(true)}
              onEdit={() => openAuthorModal('contact')}
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

      {/* Modal chi tiết sách của tác giả */}
      {selectedAuthorBook && (
        <BookDetailModal
          book={{
            ...selectedAuthorBook,
            author: authorProfile.name || 'Tác giả',
            type: 'author',
          }}
          isAdmin={isAdmin}
          onClose={() => setSelectedAuthorBook(null)}
          onEdit={() => {
            setSelectedAuthorBook(null);
            openAuthorModal('books');
          }}
        />
      )}

      {/* Modal chỉnh sửa tác giả */}
      {showAuthorModal && (
        <EditAuthorModal
          isOpen={true}
          initialProfile={authorProfile}
          initialTab={authorModalTab}
          onClose={() => setShowAuthorModal(false)}
          onSaved={(newProfile) => {
            setAuthorProfile(newProfile);
          }}
        />
      )}

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
