// This is the "Offline page" service worker

const CACHE = "pwabuilder-page";

const offlineFallbackPage = "./offline.html";

self.addEventListener("install", function (event) {
  console.log("[PWA Builder] Install Event processing");

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("[PWA Builder] Cached offline page during install");

      if (offlineFallbackPage === "./offline.html") {
        return cache.addAll([
          './',
          './index.html',
          'offline.html',
          './manifest.json',
          './pwabuilder-sw.js'
        ]);
      }

      return cache.add(offlineFallbackPage);
    })
  );
});


self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(function (error) {

      if (
        event.request.destination !== "document" ||
        event.request.mode !== "navigate"
      ) {
        return;
      }

      console.error("[PWA Builder] Network request Failed. Serving offline page " + error);
      return caches.open(CACHE).then(function (cache) {
        return cache.match(offlineFallbackPage);
      });
    })
  );
});

self.addEventListener("refreshOffline", function () {
  const offlinePageRequest = new Request(offlineFallbackPage);

  return fetch(offlineFallbackPage).then(function (response) {
    return caches.open(CACHE).then(function (cache) {
      console.log("[PWA Builder] Offline page updated from refreshOffline event: " + response.url);
      return cache.put(offlinePageRequest, response);
    });
  });
});
