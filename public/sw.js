/* Avishkar AI service worker. CACHE and PRECACHE are stamped at build time. */
const CACHE = 'av-dev';
const PRECACHE = ["/","/verdicta","/veritune","/pilot","/journey","/privacy","/terms","/accessibility","/contact","/offline.html","/favicon.svg","/assets/img/logo.svg","/assets/fonts/poppins-200.woff2","/assets/fonts/poppins-300.woff2","/assets/fonts/poppins-400.woff2","/assets/fonts/poppins-500.woff2","/og-image.png"];
const PRECACHE_SET = new Set(PRECACHE);
const MAX_EXTRA = 48;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.allSettled(PRECACHE.map(async (url) => {
      try {
        const res = await fetch(new Request(url, { cache: 'reload' }));
        if (res && res.ok) await cache.put(url, res);
      } catch (e) { /* one missing file must not abort install */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

const FONT_HOSTS = new Set(['fonts.googleapis.com', 'fonts.gstatic.com']);
const ANALYTICS = /(google-analytics|googletagmanager|googleadservices|doubleclick|plausible|segment|hotjar|facebook\.net)/i;

function isStatic(url) {
  return /\.(?:css|js|mjs|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf)$/i.test(url.pathname);
}

async function trim(cache) {
  const keys = await cache.keys();
  const extra = [];
  for (const req of keys) {
    const path = new URL(req.url).pathname;
    if (!PRECACHE_SET.has(path)) extra.push(req);
  }
  const overflow = extra.length - MAX_EXTRA;
  for (let i = 0; i < overflow; i++) await cache.delete(extra[i]);
}

function put(cache, req, res) {
  if (!res) return;
  const opaque = res.type === 'opaque';
  if (!opaque && !res.ok) return;
  cache.put(req, res.clone()).then(() => trim(cache)).catch(() => {});
}

function networkFirst(req) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (res) => {
      if (settled) return;
      settled = true;
      resolve(res);
    };
    const timer = setTimeout(async () => {
      const cached = await caches.match(req);
      if (cached) finish(cached);
    }, 4500);
    fetch(req).then(async (res) => {
      const cache = await caches.open(CACHE);
      put(cache, req, res);
      clearTimeout(timer);
      finish(res);
    }).catch(async () => {
      clearTimeout(timer);
      finish((await caches.match(req)) || (await caches.match('/offline.html')) || Response.error());
    });
  });
}

function staleWhileRevalidate(req) {
  return caches.open(CACHE).then(async (cache) => {
    const cached = await cache.match(req);
    const fresh = fetch(req).then((res) => {
      put(cache, req, res);
      return res;
    }).catch(() => cached);
    return cached || fresh;
  });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (req.headers.has('range')) return;
  const url = new URL(req.url);
  if (url.protocol === 'chrome-extension:') return;
  if (ANALYTICS.test(url.hostname)) return;
  if (url.origin !== self.location.origin) {
    if (FONT_HOSTS.has(url.hostname)) event.respondWith(staleWhileRevalidate(req));
    return;
  }
  if (url.pathname.startsWith('/api/')) return;
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(networkFirst(req));
    return;
  }
  if (isStatic(url)) event.respondWith(staleWhileRevalidate(req));
});
