'use client';

import React, { useState, useEffect } from 'react';
import ContinueCard from './ContinueCard';
import { getStoredXemTiep, XemTiepInfo } from '../lib/learningProgress';

export default function HomeContinueSection() {
  const [continueInfo, setContinueInfo] = useState<XemTiepInfo | null>(null);

  useEffect(() => {
    try {
      const data = getStoredXemTiep();
      if (data && data.topic_slug && data.page_slug) {
        setContinueInfo(data);
      }
    } catch {
      // Bỏ qua
    }
  }, []);

  if (!continueInfo) {
    return null;
  }

  return (
    <section>
      <ContinueCard info={continueInfo} />
    </section>
  );
}
