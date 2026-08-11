const CACHE = 'playzone-v4';
const CORE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/shared/icon-192.png',
  '/shared/icon-512.png',
  '/shared/apple-touch-icon.png',
  '/games/meccha-chameleon/manifest.json',
  '/games/meccha-chameleon/icon-192.png',
  '/games/meccha-chameleon/icon-512.png',
  '/games/meccha-chameleon/apple-touch-icon.png',
  '/games/angry-birds/index.html',
  '/games/balloon-math/index.html',
  '/games/math-monster/index.html',
  '/games/number-line-frog/index.html',
  '/games/pacman-virus/index.html',
  '/games/patan-frog/index.html',
  '/games/balloon-pop/index.html',
  '/games/dance-party/index.html',
  '/games/flower-farm/index.html',
  '/games/jet-wing-adventure/index.html',
  '/games/jump-ball/index.html',
  '/games/lightsaber-fruit/index.html',
  '/games/meccha-chameleon/index.html',
  '/games/meteor-smasher/index.html',
  '/games/shape-draw-party/index.html',
  '/games/steves-adventure/index.html',
  '/games/suika/index.html',
  '/games/word-bomb-squad/index.html'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Cache-first for Google Fonts so games keep their look offline
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.match(req).then(r => r || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }))
    );
    return;
  }

  if (url.origin !== location.origin) return;

  // Network-first for HTML, cache fallback
  const isHTML = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');
  if (isHTML) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('/index.html')))
    );
    return;
  }

  // Cache-first for static same-origin
  e.respondWith(
    caches.match(req).then(r => r || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }).catch(() => r))
  );
});
