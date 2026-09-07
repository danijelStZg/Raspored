// Service worker za "Moj raspored" — cache app shella za rad bez interneta.
// Podaci o rasporedu žive u localStorage, ne ovise o service workeru.

const CACHE_NAME = 'raspored-shell-v5';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon-16.png',
  './lib/lz-string.min.js',
  './lib/jsqr.js',
  './lib/qrcode.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Stale-while-revalidate: posluži iz cachea odmah (ako postoji), a u pozadini
// osvježi cache s mreže — sljedeći put je ažurirano, a offline uvijek radi.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Vanjski resursi (npr. Google Fonts) — pusti mrežu, ne blokiraj na njima ako padnu.
  const isSameOrigin = new URL(event.request.url).origin === self.location.origin;
  if (!isSameOrigin){
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200){
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
