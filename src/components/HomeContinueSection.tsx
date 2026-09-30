'use client';

import React, { useState, useEffect } from 'react';
import ContinueCard from './ContinueCard';
import { getStoredXemTiep, saveStoredXemTiep, XemTiepInfo } from '../lib/learningProgress';
import { getUserPhone, LEARNING_PROGRESS_EVENT, syncUserProgress } from '../lib/userSync';
import { checkIsAdminClient } from '../lib/adminAuth';
import { Page } from '../lib/types';
import { samplePages } from '../data/sample';
import EditPageModal from './admin/EditPageModal';

const DEFAULT_FEATURED_LESSON: XemTiepInfo = {
  topic_title: 'Cột sống',
  topic_slug: 'cot-song',
  page_title: 'Tư thế và vận động',
  page_slug: 'tu-the-va-van-dong',
  page_number: 5,
  video_title: 'Tư thế sinh hoạt và vận động đúng giúp bảo vệ cột sống, giảm đau và phòng ngừa chấn thương.',
  video_index: 1,
  video_total: 1,
  updated_at: Date.now(),
  cover_url: '/images/lessons/tu-the-va-van-dong.jpg',
};

export default function HomeContinueSection() {
  const [continueInfo, setContinueInfo] = useState<XemTiepInfo | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [editingPageData, setEditingPageData] = useState<Page | null>(null);

  const updateFromLocal = () => {
    try {
      const data = getStoredXemTiep();
      if (data && data.topic_slug && data.page_slug) {
        data.topic_slug = data.topic_slug.replace('cot-song-that-lung', 'cot-song');
        // Nếu chưa có ảnh bìa trong lưu trữ cũ, tìm ảnh bìa tương ứng
        if (!data.cover_url) {
          const matched = samplePages.find((p) => p.slug === data.page_slug);
          if (matched?.cover_url) {
            data.cover_url = matched.cover_url;
          }
        }
        setContinueInfo(data);
      } else {
        setContinueInfo(null);
      }
    } catch {
      setContinueInfo(null);
    }
  };

  useEffect(() => {
    checkIsAdminClient().then((admin) => setIsAdmin(admin));
    const phone = getUserPhone();
    updateFromLocal();

    if (phone) {
      syncUserProgress(phone, 'sync').then((res) => {
        if (res.success) {
          updateFromLocal();
        }
      });
    }

    const handleUpdate = () => {
      updateFromLocal();
    };

    window.addEventListener(LEARNING_PROGRESS_EVENT, handleUpdate);
    window.addEventListener('learning_progress_changed', handleUpdate);
    return () => {
      window.removeEventListener(LEARNING_PROGRESS_EVENT, handleUpdate);
      window.removeEventListener('learning_progress_changed', handleUpdate);
    };
  }, []);

  const displayInfo = continueInfo || DEFAULT_FEATURED_LESSON;

  const handleEditPage = () => {
    const targetSlug = displayInfo.page_slug || 'tu-the-va-van-dong';
    const matched = samplePages.find((p) => p.slug === targetSlug);
    const pageObj: Page = matched
      ? { ...matched, cover_url: displayInfo.cover_url || matched.cover_url }
      : {
          id: 'page-featured',
          workspace_id: 'default',
          topic_id: 'topic-cot-song',
          slug: targetSlug,
          title: displayInfo.page_title || 'Tư thế và vận động',
          summary: displayInfo.video_title || null,
          cover_url: displayInfo.cover_url || '/images/lessons/tu-the-va-van-dong.jpg',
          sort_order: displayInfo.page_number || 5,
          is_visible: true,
          status: 'published',
          access_mode: null,
        };
    setEditingPageData(pageObj);
    setIsEditingPage(true);
  };

  const handlePageSaved = (saved: Page) => {
    const updated: XemTiepInfo = {
      ...displayInfo,
      page_title: saved.title,
      cover_url: saved.cover_url,
    };
    setContinueInfo(updated);
    saveStoredXemTiep(updated);
    setIsEditingPage(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('learning_progress_changed'));
    }
  };

  return (
    <section>
      <ContinueCard
        info={displayInfo}
        isAdmin={isAdmin}
        onEditPage={handleEditPage}
      />

      {isEditingPage && editingPageData && (
        <EditPageModal
          isOpen={true}
          page={editingPageData}
          topicId={editingPageData.topic_id}
          onClose={() => setIsEditingPage(false)}
          onSaved={handlePageSaved}
        />
      )}
    </section>
  );
}
