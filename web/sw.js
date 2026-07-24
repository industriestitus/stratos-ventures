const CACHE_NAME = 'stratos-v44';
const LOCAL_ASSETS = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];
const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0/dist/chartjs-adapter-date-fns.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/marked@15.0.7/marked.min.js',
  'https://cdn.jsdelivr.net/npm/dompurify@3.2.4/dist/purify.min.js'
];
const MAX_CACHE_ENTRIES = 200;

const API_DOMAINS = ['financialmodelingprep', 'finnhub', 'exchangerate-api', 'yahoo'];
function isApiCall(hostname) {
  return API_DOMAINS.some(d => hostname.includes(d));
}

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(LOCAL_ASSETS)
        .then(() => Promise.allSettled(CDN_ASSETS.map(u => cache.add(u)))
          .then(results => {
            results.forEach((r, i) => { if (r.status === 'rejected') console.warn('CDN cache failed:', CDN_ASSETS[i], r.reason) });
          })))
  );
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => caches.open(CACHE_NAME).then(cache =>
        cache.keys().then(keys => {
          if (keys.length > MAX_CACHE_ENTRIES) {
            const toDelete = keys.slice(0, keys.length - MAX_CACHE_ENTRIES);
            return Promise.all(toDelete.map(k => cache.delete(k)));
          }
        })
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  if (isApiCall(url.hostname)) {
    e.respondWith(fetch(e.request).catch(() => new Response('{"error":"offline"}', {status:503,headers:{'Content-Type':'application/json'}})));
    return;
  }

  if (url.hostname.includes('workers.dev')) {
    e.respondWith(
      fetch(e.request).then(response => {
        return response;
      }).catch(() => new Response('{"error":"offline"}', {status:503,headers:{'Content-Type':'application/json'}}))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone)).catch(err => console.warn('Cache put failed:', err));
        }
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
