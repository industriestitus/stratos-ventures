const CACHE_NAME = 'stratos-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0/dist/chartjs-adapter-date-fns.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/marked@15.0.7/marked.min.js',
  'https://cdn.jsdelivr.net/npm/dompurify@3.2.4/dist/purify.min.js'
];

const LOCAL_ASSETS = ['./', './index.html', './manifest.json'];
const CDN_ASSETS = STATIC_ASSETS.filter(u => u.startsWith('http'));

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(LOCAL_ASSETS)
        .then(() => Promise.allSettled(CDN_ASSETS.map(u => cache.add(u)))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Network-first for API calls and D1
  if (url.pathname.startsWith('/api/') || url.hostname.includes('workers.dev') ||
      url.hostname.includes('financialmodelingprep') || url.hostname.includes('finnhub')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first for static assets
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
