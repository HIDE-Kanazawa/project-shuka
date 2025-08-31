const VERSION = 'v3';
const STATIC_CACHE = `shuka-static-${VERSION}`;
const RUNTIME_CACHE = `shuka-runtime-${VERSION}`;

// Keep precache minimal and essential only
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/css/loader.css',
  '/scripts.js',
  '/js/loader.min.js',
  '/img/秀歌-メインビジュアル.webp',
  '/img/ローディング.webp',
  '/img/秀歌.webp',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
          .map(key => caches.delete(key))
      );
    })
  );
});

function isSameOrigin(request) {
  try { return new URL(request.url).origin === self.location.origin; } catch (e) { return false; }
}

function swr(cacheName, request, fetcher) {
  return caches.open(cacheName).then(cache => {
    return cache.match(request).then(cached => {
      const networkFetch = fetcher().then(response => {
        if (response && response.ok) {
          cache.put(request, response.clone());
        }
        return response;
      }).catch(() => cached || Response.error());
      return cached || networkFetch;
    });
  });
}

self.addEventListener('fetch', event => {
  const req = event.request;

  // Only handle GET
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Skip cross-origin requests (e.g., CDN for Three.js)
  if (!isSameOrigin(req)) return;

  // Do not cache audio/video to avoid large storage usage
  const dest = req.destination;
  if (dest === 'audio' || dest === 'video') return;

  if (dest === 'style' || dest === 'script' || dest === 'image' || dest === 'font') {
    event.respondWith(
      swr(RUNTIME_CACHE, req, () => fetch(req))
    );
    return;
  }

  // Default: try cache first, then network
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});