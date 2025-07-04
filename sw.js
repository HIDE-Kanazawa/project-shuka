const CACHE_NAME = 'shuka-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.min.css',
  '/css/loader.min.css',
  '/scripts.min.js',
  '/three-lanterns.min.js',
  '/js/loader.min.js',
  '/img/秀歌-メインビジュアル.webp',
  '/img/ローディング.webp',
  '/img/秀歌.webp',
  '/img/秀歌-春.webp',
  '/img/秀歌-夏.webp',
  '/img/秀歌-秋.webp',
  '/img/秀歌-冬.webp',
  '/img/秀歌-梅雨.webp',
  '/img/hide.webp',
  '/img/suno.webp',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});