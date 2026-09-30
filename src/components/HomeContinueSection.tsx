'use client';

import React, { useState, useEffect } from 'react';
import ContinueCard from './ContinueCard';
import { getStoredXemTiep, XemTiepInfo } from '../lib/learningProgress';
import { getUserPhone, LEARNING_PROGRESS_EVENT, syncUserProgress } from '../lib/userSync';

export default function HomeContinueSection() {
  const [continueInfo, setContinueInfo] = useState<XemTiepInfo | null>(null);

  const updateFromLocal = () => {
    try {
      const data = getStoredXemTiep();
      if (data && data.topic_slug && data.page_slug) {
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

  if (continueInfo) {
    return (
      <section>
        <ContinueCard info={continueInfo} />
      </section>
    );
  }

  return null;
}
