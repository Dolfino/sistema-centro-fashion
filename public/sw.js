const CACHE_NAME = 'sinalizacao-mall-v3281-shell-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/_expo/static/js/web/entry-*.js',
  '/assets/assets/maps/SETOR_AZUL.png',
  '/assets/assets/maps/SETOR_VERDE.png',
  '/assets/assets/maps/SETOR_AMARELO.png',
  '/assets/assets/maps/SETOR_ROXO.png',
  '/assets/assets/maps/SETOR_BRANCO.png',
  '/assets/assets/maps/CFF_2025_NIVEL_1.png',
  '/favicon.ico',
];

// Service Worker Install — Pre-cache App Shell e Assets Cartográficos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching App Shell e plantas cartográficas...');
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[SW] Cache parcial instalado com fallback offline:', err);
      });
    })
  );
  self.skipWaiting();
});

// Service Worker Activate — Limpeza de Caches Antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Service Worker Fetch — Estratégia Cache First com Fallback para Rede
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // Fallback offline se a rede falhar e o recurso for a página principal
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
