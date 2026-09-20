// Service worker: caches the app so it opens instantly and works offline.
// When you change any app file, change CACHE_VERSION so installed copies pick up the update.
const CACHE_VERSION = 'daily-planner-v1';

const APP_FILES = [
  './',
  './index.html',
  './support.js',
  './register-sw.js',
  './manifest.webmanifest',
  './backup.html',
  './fonts/fonts.css',
  './fonts/instrument-sans-latin-wght-normal.woff2',
  './fonts/instrument-sans-latin-ext-wght-normal.woff2',
  './fonts/newsreader-latin-opsz-normal.woff2',
  './fonts/newsreader-latin-ext-opsz-normal.woff2',
  './fonts/newsreader-latin-opsz-italic.woff2',
  './fonts/newsreader-latin-ext-opsz-italic.woff2',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Pages: try the network first so updates show up, fall back to the saved copy when offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('./index.html')))
    );
    return;
  }

  // Everything else: saved copy first, refreshed in the background.
  event.respondWith(
    caches.match(req).then((hit) => {
      const refresh = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || refresh;
    })
  );
});
