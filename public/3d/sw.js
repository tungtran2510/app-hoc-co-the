/**
 * Service Worker - Atlas Giải Phẫu 3D (v6.0.0)
 * PWA Offline First, Per-System 3D Model Caching & Background Sync
 */

const CACHE_VERSION = 'atlas-v6';
const STATIC_CACHE = `atlas-static-${CACHE_VERSION}`;
const MODELS_CACHE = `atlas-models-${CACHE_VERSION}`;
const DATA_CACHE = `atlas-data-${CACHE_VERSION}`;

// Pre-cached critical app shell & Draco wasm decoders
const CRITICAL_ASSETS = [
  './',
  './index.html',
  './favicon.svg',
  './draco/draco_decoder.wasm',
  './draco/draco_wasm_wrapper.js',
  './data/systems.json',
  './data/lexicon.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      // Best-effort pre-caching of critical assets
      return Promise.allSettled(
        CRITICAL_ASSETS.map((url) =>
          cache.add(url).catch((err) => console.warn(`[SW] Pre-cache skip ${url}:`, err.message))
        )
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (![STATIC_CACHE, MODELS_CACHE, DATA_CACHE].includes(key)) {
            console.log(`[SW] Deleting obsolete cache: ${key}`);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension / dev server hot-reload websockets
  if (request.method !== 'GET' || url.protocol.startsWith('ws') || url.protocol === 'chrome-extension:') {
    return;
  }

  // 1. 3D GLB MODELS: Cache-First strategy
  if (url.pathname.includes('/models/') && url.pathname.endsWith('.glb')) {
    event.respondWith(
      caches.open(MODELS_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          console.error('[SW] Model fetch failed offline:', url.pathname);
          throw error;
        }
      })
    );
    return;
  }

  // 2. DRACO DECODERS & ANATOMY DATA: Cache-First strategy
  if (url.pathname.includes('/draco/') || url.pathname.includes('/data/')) {
    event.respondWith(
      caches.open(DATA_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          // Revalidate in background
          fetch(request).then((res) => {
            if (res.ok) cache.put(request, res);
          }).catch(() => {});
          return cachedResponse;
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      })
    );
    return;
  }

  // 3. APP SHELL & STATIC ASSETS: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok && request.url.startsWith(self.location.origin)) {
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, networkResponse.clone()));
        }
        return networkResponse;
      }).catch((err) => {
        if (request.mode === 'navigate') {
          return caches.match('./index.html') || caches.match('/');
        }
        throw err;
      });

      return cachedResponse || fetchPromise;
    })
  );
});

// Communication with UI (Pre-caching models, cache inspection, quota)
self.addEventListener('message', async (event) => {
  const { type, payload } = event.data || {};
  const client = event.source;

  if (type === 'PRECACHE_MODEL') {
    const { modelUrl, systemId } = payload;
    try {
      const cache = await caches.open(MODELS_CACHE);
      const req = new Request(modelUrl);
      
      const response = await fetch(req);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      await cache.put(req, response.clone());
      client.postMessage({
        type: 'MODEL_PRECACHED_SUCCESS',
        payload: { systemId, modelUrl }
      });
    } catch (err) {
      client.postMessage({
        type: 'MODEL_PRECACHED_ERROR',
        payload: { systemId, modelUrl, error: err.message }
      });
    }
  }

  if (type === 'GET_CACHED_SYSTEMS') {
    try {
      const cache = await caches.open(MODELS_CACHE);
      const requests = await cache.keys();
      const cachedUrls = requests.map((r) => r.url);
      client.postMessage({
        type: 'CACHED_SYSTEMS_LIST',
        payload: { cachedUrls }
      });
    } catch (err) {
      client.postMessage({ type: 'CACHED_SYSTEMS_LIST', payload: { cachedUrls: [] } });
    }
  }

  if (type === 'DELETE_CACHED_MODEL') {
    const { modelUrl, systemId } = payload;
    try {
      const cache = await caches.open(MODELS_CACHE);
      const deleted = await cache.delete(modelUrl);
      client.postMessage({
        type: 'MODEL_DELETED_SUCCESS',
        payload: { systemId, deleted }
      });
    } catch (err) {
      client.postMessage({ type: 'MODEL_DELETED_ERROR', payload: { error: err.message } });
    }
  }

  if (type === 'CLEAR_ALL_CACHES') {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    client.postMessage({ type: 'ALL_CACHES_CLEARED' });
  }
});
