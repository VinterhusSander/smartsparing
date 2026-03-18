const CACHE_NAME = "smartsparing-v4";

const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/app.css",
  "/app.mjs",
  "/manifest.json",
  "/favicon.ico",
  "/icon.png",
  "/terms.html",
  "/privacy.html",

  "/data/api.js",

  "/logic/i18n.js",
  "/logic/user-controller.js",

  "/ui/user-create.js",
  "/ui/user-delete.js",
  "/ui/user-edit.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      for (const url of URLS_TO_CACHE) {
        try {
          await cache.add(url);
        } catch (error) {
          console.warn("Could not cache:", url, error);
        }
      }
    })()
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      );

      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
        const offlineFallback = await caches.match("/index.html");
        if (offlineFallback) {
          return offlineFallback;
        }
        throw error;
      }
    })()
  );
});