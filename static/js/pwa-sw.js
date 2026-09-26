const FB_PWA_CACHE = 'fanyabiashara-pwa-v3';
const FB_OFFLINE_URL = '/offline';
const FB_PRECACHE = [
  '/offline',
  '/pwa/offline.png',
  '/pwa/icon-192.png',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(FB_PWA_CACHE).then(function (cache) {
      return Promise.all(
        FB_PRECACHE.map(function (url) {
          return cache.add(url).catch(function () {});
        })
      );
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) {
          return k !== FB_PWA_CACHE;
        }).map(function (k) {
          return caches.delete(k);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  var url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(function () {
        return caches.match(FB_OFFLINE_URL).then(function (cached) {
          return cached || caches.match(event.request);
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request).then(function (resp) {
      return resp;
    }).catch(function () {
      return caches.match(event.request);
    })
  );
});
