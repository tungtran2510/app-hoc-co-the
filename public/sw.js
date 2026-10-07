// Service Worker PWA Chuyên Nghiệp Cho Qbiz Books
// Lưu sẵn toàn bộ chức năng, giao diện, shell, tabs và bài học cốt lõi trên điện thoại
// Đạt tốc độ phản hồi tức thì (< 1ms) khi người dùng chuyển đổi các mục hoặc vào bài học
// TUÂN THỦ CHỈ THỊ: Chỉ tải từ mạng khi người dùng ấn vào tài liệu sách / video dung lượng lớn

const CACHE_NAME = 'qbiz-books-shell-v40';
const STATIC_ASSETS_CACHE = 'qbiz-books-static-v40';

// Lắng nghe lệnh xóa cache từ Admin Client khi có thay đổi nội dung/vị trí
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_PAGE_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('[SW] HTML cache cleared on admin update');
    });
  }
});

// Danh sách tài nguyên Shell và các trang cốt lõi cần tải sẵn vào bộ nhớ điện thoại
const PRECACHE_SHELL_URLS = [
  '/',
  '/chuyen-de',
  '/da-luu',
  '/tim-kiem',
  '/tro-ly-ai',
  '/cot-song',
  '/cot-song/tong-quan-ve-cot-song',
  '/cot-song/tu-the-va-van-dong',
  '/dinh-duong',
  '/nuoc',
  '/tieu-hoa',
  '/co-the-nguoi',
  '/noi-tiet-chuyen-hoa',
  '/gan-mat-tuy',
  '/mien-dich',
  '/favicon.ico',
  '/apple-icon.png',
  '/app_logo.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-192.png',
  '/icon-maskable-512.png',
  '/images/book_cover_blank.jpg',
  '/spine_hero_clean.png',
];

// Next App Router payloads (RSC) phải luôn khớp với HTML/JS đang chạy.
// Cache RSC cũ theo từng request đã khiến một trang cũ có thể gắn lại modal
// toàn màn hình và chặn thao tác sau khi người dùng chuyển tab.

// Cài đặt SW & Tải sẵn Shell ngầm vào điện thoại
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_SHELL_URLS).catch((err) => {
        console.warn('[SW] Pre-caching partial failure, continuing:', err);
      });
    })
  );
});

// Kích hoạt SW & Dọn dẹp cache cũ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== STATIC_ASSETS_CACHE) {
            console.log('[SW] Purging old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Điều phối yêu cầu mạng & Bộ nhớ đệm (Caching & Fetching Strategy)
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Chỉ áp dụng cho yêu cầu GET
  if (request.method !== 'GET') return;

  // 2. TUÂN THỦ: Không can thiệp các luồng stream video YouTube hoặc file tài liệu lớn
  if (
    url.hostname.includes('youtube.com') ||
    url.hostname.includes('googlevideo.com') ||
    url.hostname.includes('ytimg.com') ||
    url.pathname.endsWith('.pdf') ||
    url.pathname.includes('/documents/pdf/')
  ) {
    // Để mạng tự tải tự nhiên khi người dùng bấm vào xem
    return;
  }

  // 2b. MANIFEST & BRAND ICONS: Luôn nạp mới từ mạng để cập nhật theme_color và icon chuẩn tức thì
  if (
    url.pathname.startsWith('/manifest.') ||
    url.pathname === '/app_logo.png' ||
    url.pathname === '/icon-192.png' ||
    url.pathname === '/icon-512.png' ||
    url.pathname === '/icon-maskable-192.png' ||
    url.pathname === '/icon-maskable-512.png' ||
    url.pathname === '/apple-icon.png' ||
    url.pathname === '/favicon.ico'
  ) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(STATIC_ASSETS_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 3. Next.js App Router RSC Payloads: luôn dùng mạng khi online để tránh
  // ghép giao diện từ cache cũ với bundle mới. Cache chỉ là fallback offline.
  const isRSC = url.searchParams.has('_rsc') || request.headers.get('rsc') === '1' || request.headers.get('RSC') === '1';
  if (isRSC) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        try {
          const networkResponse = await fetch(request);
          if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return cachedResponse || new Response('Offline page data unavailable', { status: 503 });
        }
      })
    );
    return;
  }

  // 4. Với các file tĩnh Next.js (_next/static, CSS, JS, fonts, icon):
  // Chiến lược: CACHE FIRST (Có sẵn trên máy là dùng ngay lập tức 0ms)
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(
      caches.open(STATIC_ASSETS_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        try {
          const networkResponse = await fetch(request);
          if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return cachedResponse || new Response('Offline Asset Not Found', { status: 503 });
        }
      })
    );
    return;
  }

  // 4b. Với hình ảnh giải phẫu lưu trên Supabase Storage (*.supabase.co):
  // Chiến lược: STALE WHILE REVALIDATE (Hiện ngay từ cache nếu có, đồng thời cập nhật ngầm nếu có mạng)
  if (
    url.hostname.includes('supabase.co') &&
    (url.pathname.includes('/storage/v1/object/public/') || url.pathname.includes('/images/'))
  ) {
    event.respondWith(
      caches.open(STATIC_ASSETS_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 5. Với các trang điều hướng HTML (Trang chủ, Chuyên đề, Bài học, Đã lưu, Trợ lý AI, Quản trị):
  // Chiến lược: NETWORK FIRST WITH TIMEOUT FALLBACK
  // Luôn nạp mới từ mạng để phản ánh tức thì các thay đổi của Admin (vị trí khối, tài liệu, chữ vừa sửa).
  // Nếu mất mạng hoặc mạng chậm quá 2 giây: Fallback mượt mà về Shell Cache có sẵn trên điện thoại.
  if (request.mode === 'navigate') {
    // Nếu vào trang quản trị hoặc đăng nhập: Luôn trực tiếp từ mạng
    if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/dang-nhap')) {
      event.respondWith(fetch(request).catch(() => caches.match(request) || caches.match('/')));
      return;
    }

    event.respondWith(
      (async () => {
        try {
          const networkPromise = fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          });

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Network timeout')), 2200)
          );

          return await Promise.race([networkPromise, timeoutPromise]);
        } catch {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = await caches.match('/');
          if (fallback) return fallback;
          return new Response('Trang ngoại tuyến hiện chưa có sẵn', { status: 503 });
        }
      })()
    );
    return;
  }
});
