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
