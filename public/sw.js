// FacturaDo Service Worker — v2026.07.21b
// Estrategia: Network First con fallback a caché
// Actualización AUTOMÁTICA: sin intervención del usuario

const CACHE_NAME = 'facturado-v2026.07.21b';
const OFFLINE_PAGE = '/';

const PRE_CACHE = ['/', '/manifest.json'];

// Canal BroadcastChannel para notificar a la página que hay nueva versión activa
const updateChannel = new BroadcastChannel('facturado-sw-update');

// ── INSTALL: skipWaiting INMEDIATO ───────────────────────────────────────────
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Se activa de una sola, sin esperar que cierren pestañas
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRE_CACHE))
  );
});

// ── ACTIVATE: Limpia cachés viejas y toma control ────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => {
            console.log('[SW] Borrando caché antigua:', k);
            return caches.delete(k);
          })
        )
      )
      .then(() => self.clients.claim()) // Toma control de todas las tabs abiertas
      .then(() => {
        // Avisa a todas las pestañas que la nueva versión ya está activa
        updateChannel.postMessage({ type: 'SW_UPDATED', version: CACHE_NAME });
      })
  );
});

// ── FETCH: Network First ─────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Excluir APIs externas — se acceden siempre en tiempo real
  const isExternal =
    url.hostname.includes('insforge') ||
    url.hostname.includes('supabase') ||
    url.hostname.includes('googleapis') ||
    url.hostname.includes('cloudinary') ||
    url.hostname.includes('googletagmanager') ||
    url.hostname.includes('openrouter') ||
    url.hostname.includes('testsprite') ||
    url.hostname.includes('testprite');

  if (isExternal) return;

  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return res;
      })
      .catch(() =>
        caches.match(request).then((cached) => {
          if (cached) return cached;
          if (request.mode === 'navigate') return caches.match(OFFLINE_PAGE);
          return new Response('Sin conexión', { status: 503 });
        })
      )
  );
});

// ── MENSAJE: skipWaiting manual (por si acaso) ───────────────────────────────
self.addEventListener('message', (event) => {
  if (event?.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
