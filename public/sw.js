// FacturaDo Service Worker — v2026.07.21
// Estrategia: Network First con fallback a caché
// Al detectar nueva versión notifica al cliente para que actualice

const CACHE_NAME = 'facturado-v2026.07.21';
const OFFLINE_PAGE = '/';

// Archivos a pre-cachear en la instalación
const PRE_CACHE = [
  '/',
  '/manifest.json',
];

// ── INSTALL: Pre-carga recursos esenciales ──────────────────────────────────
self.addEventListener('install', (event) => {
  // Actívate inmediatamente sin esperar a que se cierren las pestañas viejas
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRE_CACHE))
  );
});

// ── ACTIVATE: Elimina cachés antiguas ───────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('[SW] Eliminando caché antigua:', key);
            return caches.delete(key);
          })
      )
    ).then(() => {
      // Toma control de todas las pestañas abiertas inmediatamente
      return self.clients.claim();
    })
  );
});

// ── FETCH: Network First con fallback a caché ────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Solo interceptar peticiones GET
  if (request.method !== 'GET') return;

  // No interceptar peticiones a APIs externas (insforge, supabase, etc.)
  const url = new URL(request.url);
  const isExternalAPI = (
    url.hostname.includes('insforge') ||
    url.hostname.includes('supabase') ||
    url.hostname.includes('googleapis') ||
    url.hostname.includes('cloudinary') ||
    url.hostname.includes('googletagmanager') ||
    url.hostname.includes('openrouter')
  );
  if (isExternalAPI) return;

  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Guarda en caché la respuesta fresca
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        // Sin red: intenta desde caché
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // Fallback para navegación (páginas HTML)
          if (request.mode === 'navigate') {
            return caches.match(OFFLINE_PAGE);
          }
          return new Response('Sin conexión', { status: 503 });
        });
      })
  );
});

// ── MENSAJE: Soporte para skipWaiting forzado desde la UI ───────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
