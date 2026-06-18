// HSK بالعربي — Service Worker
// النسخة: 1.1.0

const CACHE_NAME = "hsk-ar-v2";

// الملفات الأساسية التي تُخزَّن عند التثبيت
const STATIC_ASSETS = [
  "/",
  "/offline",
  "/dashboard",
  "/hsk-levels",
  "/grammar",
  "/radicals",
  "/practice",
  "/pricing",
  "/sign-in",
  "/sign-up",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// ===== التثبيت =====
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // تخزين كل ملف على حدة — لو فشل واحد يكمل الباقي
      return Promise.allSettled(
        STATIC_ASSETS.map((asset) => cache.add(asset))
      );
    })
  );
  self.skipWaiting();
});

// ===== التفعيل =====
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ===== اعتراض الطلبات =====
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // تجاهل الطلبات غير HTTP
  if (!request.url.startsWith("http")) return;

  // تجاهل طلبات Supabase والـ API — دائماً من الشبكة
  if (
    url.hostname.includes("supabase") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/")
  ) {
    return;
  }

  // صفحات المحتوى: Cache First (أسرع للمستخدم)
  const contentPages = ["/hsk-levels", "/grammar", "/radicals", "/practice"];
  if (contentPages.some((page) => url.pathname.startsWith(page))) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // حدّث الكاش في الخلفية
          fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, response);
                });
              }
            })
            .catch(() => {});
          return cached;
        }
        return fetch(request).catch(() => caches.match("/offline"));
      })
    );
    return;
  }

  // باقي الصفحات: Network First
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          if (request.destination === "document") {
            return caches.match("/offline");
          }
        });
      })
  );
});
