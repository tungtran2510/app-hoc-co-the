'use client';

import React, { useState, useEffect } from 'react';
import ContinueCard from './ContinueCard';
import { getStoredXemTiep, XemTiepInfo } from '../lib/learningProgress';
import { getUserPhone, LEARNING_PROGRESS_EVENT, syncUserProgress } from '../lib/userSync';

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
};

export default function HomeContinueSection() {
  const [continueInfo, setContinueInfo] = useState<XemTiepInfo | null>(null);

  const updateFromLocal = () => {
    try {
      const data = getStoredXemTiep();
      if (data && data.topic_slug && data.page_slug) {
        data.topic_slug = data.topic_slug.replace('cot-song-that-lung', 'cot-song');
        setContinueInfo(data);
      } else {
        setContinueInfo(null);
      }
    } catch {
      setContinueInfo(null);
    }
  };

  useEffect(() => {
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

  return (
    <section>
      <ContinueCard info={displayInfo} />
    </section>
  );
}
