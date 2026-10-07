'use client';

import React, { useState, useEffect, useRef } from 'react';
import { WifiOff, CheckCircle2, Download, CloudOff } from 'lucide-react';
import { getStoredAppSettings } from '../lib/storage';

const MAX_SAFE_BYTES = 30 * 1024 * 1024; // 30 MB an toàn tuyệt đối
const TWO_MINUTES_MS = 120 * 1000; // Đúng 2 phút theo yêu cầu

export interface OfflineProgressData {
  status: 'idle' | 'downloading' | 'completed' | 'error';
  current: number;
  total: number;
  progress: number;
  downloadedBytes: number;
  bytesFormatted: string;
  message?: string;
}

export default function OfflineManager() {
  const [isOffline, setIsOffline] = useState(false);
  const [showOnlinePill, setShowOnlinePill] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<OfflineProgressData>({
    status: 'idle',
    current: 0,
    total: 0,
    progress: 0,
    downloadedBytes: 0,
    bytesFormatted: '0 MB',
  });

  const isDownloadingRef = useRef(false);

  // 1. Lắng nghe trạng thái mạng Online / Offline
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOffline(!navigator.onLine);

    const handleOffline = () => {
      setIsOffline(true);
      setShowOnlinePill(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowOnlinePill(true);
      const timer = setTimeout(() => {
        setShowOnlinePill(false);
      }, 2500);
      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // 2. Hàm thực hiện tải ngầm dữ liệu Offline (tối đa 30MB)
  const runOfflineDownload = async (isManual = false) => {
    if (isDownloadingRef.current) return;
    if (typeof window === 'undefined' || !navigator.onLine) return;

    try {
      isDownloadingRef.current = true;
      const initial: OfflineProgressData = {
        status: 'downloading',
        current: 0,
        total: 0,
        progress: 0,
        downloadedBytes: 0,
        bytesFormatted: '0 MB',
        message: 'Đang kết nối danh sách bài học...',
      };
      setDownloadProgress(initial);
      window.dispatchEvent(new CustomEvent('qbiz_offline_progress', { detail: initial }));

      // Gọi API lấy danh sách bài học và hình ảnh
      const res = await fetch('/api/offline-pack');
      if (!res.ok) throw new Error('Không thể lấy danh sách gói ngoại tuyến');
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Dữ liệu gói ngoại tuyến lỗi');

      const allUrls: string[] = [...(data.urls || []), ...(data.images || [])];
      const total = allUrls.length;
      let current = 0;
      let totalBytes = 0;

      const cacheStorage = 'caches' in window ? await caches.open('qbiz-books-shell-v40') : null;
      const staticCache = 'caches' in window ? await caches.open('qbiz-books-static-v40') : null;

      for (const url of allUrls) {
        // Kiểm tra ngưỡng an toàn 30MB
        if (totalBytes >= MAX_SAFE_BYTES) {
          console.log(`[OfflineManager] Đã đạt ngưỡng an toàn 30MB (${(totalBytes / 1024 / 1024).toFixed(1)} MB). Dừng tải.`);
          break;
        }

        try {
          const fetchRes = await fetch(url, { priority: 'low' });
          if (fetchRes.status === 200) {
            const clone = fetchRes.clone();
            const blob = await fetchRes.blob();
            const itemSize = blob.size || 0;
            totalBytes += itemSize;

            if (url.startsWith('/_next/') || url.includes('/images/') || url.includes('supabase.co')) {
              if (staticCache) await staticCache.put(url, new Response(blob, { headers: clone.headers }));
            } else {
              if (cacheStorage) await cacheStorage.put(url, new Response(blob, { headers: clone.headers }));
            }
          }
        } catch {
          // Bỏ qua lỗi từng file nhỏ để tiếp tục các file khác
        }

        current++;
        const percent = Math.min(100, Math.round((current / total) * 100));
        const mb = (totalBytes / (1024 * 1024)).toFixed(1);

        const updateData: OfflineProgressData = {
          status: 'downloading',
          current,
          total,
          progress: percent,
          downloadedBytes: totalBytes,
          bytesFormatted: `${mb} MB`,
        };
        setDownloadProgress(updateData);
        window.dispatchEvent(new CustomEvent('qbiz_offline_progress', { detail: updateData }));

        // Nghỉ nhẹ 100ms giữa các request để giữ máy mượt mà không nghẽn CPU
        await new Promise((r) => setTimeout(r, 80));
      }

      const finishMb = (totalBytes / (1024 * 1024)).toFixed(1);
      const finished: OfflineProgressData = {
        status: 'completed',
        current,
        total,
        progress: 100,
        downloadedBytes: totalBytes,
        bytesFormatted: `${finishMb} MB`,
        message: `Đã lưu ${current}/${total} tài nguyên (${finishMb} MB) sẵn sàng dùng Offline!`,
      };
      setDownloadProgress(finished);
      window.dispatchEvent(new CustomEvent('qbiz_offline_progress', { detail: finished }));
      try {
        localStorage.setItem('qbiz_offline_cached_at', String(Date.now()));
        localStorage.setItem('qbiz_offline_cached_mb', finishMb);
      } catch {}
    } catch (err: any) {
      console.warn('[OfflineManager] Lỗi tải gói ngoại tuyến:', err);
      const errData: OfflineProgressData = {
        status: 'error',
        current: 0,
        total: 0,
        progress: 0,
        downloadedBytes: 0,
        bytesFormatted: '0 MB',
        message: err.message || 'Lỗi mạng khi tải gói',
      };
      setDownloadProgress(errData);
      window.dispatchEvent(new CustomEvent('qbiz_offline_progress', { detail: errData }));
    } finally {
      isDownloadingRef.current = false;
    }
  };

  // 3. Tự động kích hoạt sau đúng 2 phút (120 giây) sử dụng app nếu bật auto
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const settings = getStoredAppSettings();
    // Nếu quản trị tắt tính năng tự động tải thì không làm gì
    if (settings.auto_offline_cache === false) return;

    // Kiểm tra nếu đã tải gần đây trong vòng 24 giờ thì bỏ qua để tiết kiệm pin & mạng
    try {
      const lastCached = localStorage.getItem('qbiz_offline_cached_at');
      if (lastCached && Date.now() - Number(lastCached) < 24 * 60 * 60 * 1000) {
        return;
      }
    } catch {}

    const timer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => runOfflineDownload(false), { timeout: 3000 });
      } else {
        runOfflineDownload(false);
      }
    }, TWO_MINUTES_MS);

    return () => clearTimeout(timer);
  }, []);

  // 4. Lắng nghe yêu cầu kích hoạt tải thủ công từ Cài đặt
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleManualTrigger = () => {
      runOfflineDownload(true);
    };

    window.addEventListener('qbiz_start_offline_download', handleManualTrigger);
    return () => window.removeEventListener('qbiz_start_offline_download', handleManualTrigger);
  }, []);

  return (
    <>
      {/* THANH CẢNH BÁO TRẠNG THÁI NGOẠI TUYẾN (OFFLINE STATUS PILL) - TINH GỌN, CHUẨN 1 DÒNG */}
      {isOffline && (
        <aside
          role="status"
          aria-live="polite"
          aria-label="Thông báo chế độ ngoại tuyến"
          className="fixed top-2.5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600/95 dark:bg-amber-600/90 text-white shadow-lg border border-amber-400/80 backdrop-blur-md animate-in slide-in-from-top-2 duration-200 pointer-events-none select-none max-w-[90%]"
        >
          <WifiOff size={13} strokeWidth={2.6} className="shrink-0 text-amber-200 animate-pulse" />
          <span className="text-[11.5px] font-black tracking-tight whitespace-nowrap">
            Chế độ ngoại tuyến: Đọc từ bộ nhớ máy
          </span>
        </aside>
      )}

      {/* THANH BÁO ĐÃ KẾT NỐI LẠI INTERNET */}
      {showOnlinePill && !isOffline && (
        <aside
          role="status"
          aria-live="polite"
          aria-label="Thông báo đã kết nối lại mạng"
          className="fixed top-2.5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/95 dark:bg-emerald-600/90 text-white shadow-lg border border-emerald-400/80 backdrop-blur-md animate-in slide-in-from-top-2 duration-200 pointer-events-none select-none max-w-[90%]"
        >
          <CheckCircle2 size={13} strokeWidth={2.6} className="shrink-0 text-emerald-200" />
          <span className="text-[11.5px] font-black tracking-tight whitespace-nowrap">
            Đã kết nối lại Internet ✓
          </span>
        </aside>
      )}
    </>
  );
}
