// This is the "Offline page" service worker

const CACHE = "pwabuilder-page";

const offlineFallbackPage = "offline.html";

self.addEventListener("install", function (event) {
  console.log("[PWA Builder] Install Event processing");

  event.waitUntil(
    caches.open(CACHE).then(async function (cache) {
      console.log("[PWA Builder] Cached offline page during install");

      if (offlineFallbackPage === "offline.html") {
        return cache.addAll([
          '/',
          '/index.html',
          '/js/manifest.json',
          '/serviceWorker/pwabuilder-sw-register.js',
          '/images/icons/icon-72x72.png',
          '/images/icons/icon-96x96.png',
          '/images/icons/icon-128x128.png',
          '/images/icons/icon-144x144.png',
          '/images/icons/icon-152x152.png',
          '/images/icons/icon-192x192.png',
          '/images/icons/icon-384x384.png',
          '/images/icons/icon-512x512.png',
        ]);
      }

      return cache.add(offlineFallbackPage);
    })
  );
});

self.addEventListener('activate', function activator(event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) {

      return key.indexOf(CACHE) !== 0;
    }).map(function (key) {

      return caches.delete(key);

    })
    );

  })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(async function (error) {

      if (
        event.request.destination !== "document" ||
        event.request.mode !== "navigate"
      ) {
        return;
      }

      console.error("[PWA Builder] Network request Failed. Serving offline page " + error);
      const cache = await caches.open(CACHE);
      return cache.match(offlineFallbackPage);
    })
  );
});

self.addEventListener("refreshOffline", async function () {
  const offlinePageRequest = new Request(offlineFallbackPage);

  return fetch(offlineFallbackPage).then(async function (response) {
    return caches.open(CACHE).then(function (cache) {
      console.log("[PWA Builder] Offline page updated from refreshOffline event: " + response.url);
      return cache.put(offlinePageRequest, response);
    });
  });
});

