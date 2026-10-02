'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    deferredPrompt?: any;
  }
}

export default function PwaRegistrar() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => {})
        .catch(() => {});
    }

    // Tự động tải sẵn ngầm các trang và dữ liệu khi thiết bị rảnh (Idle Prefetching)
    const runIdlePrefetch = () => {
      const routesToPrefetch = ['/tro-ly-ai', '/da-luu', '/tim-kiem', '/cot-song', '/dinh-duong'];
      routesToPrefetch.forEach((route) => {
        fetch(route, { priority: 'low' }).catch(() => {});
      });

      // Ngầm nạp trước cấu hình AI training để ấn vào câu hỏi gợi ý là có ngay
      fetch('/api/ai/training', { priority: 'low' })
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data.ai_training) {
            try {
              localStorage.setItem('app_ai_training_cache_v1', JSON.stringify(data.ai_training));
            } catch {}
          }
        })
        .catch(() => {});
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(runIdlePrefetch, { timeout: 2000 });
    } else {
      setTimeout(runIdlePrefetch, 1000);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      window.deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return null;
}
