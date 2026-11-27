const CACHE = 'spf-shell-v6';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-any-192.png', 'icon-any-512.png', 'icon-mask-192.png', 'icon-mask-512.png', 'apple-touch-icon.png', 'logo.webp'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  // API कॉल कधीही cache करू नका; फक्त ॲपची स्वतःची फाइल
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
