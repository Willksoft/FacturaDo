import { useEffect } from 'react';

/**
 * Hook que registra /sw.js y fuerza recarga automática
 * cuando el Service Worker detecta una nueva versión.
 *
 * No requiere interacción del usuario — la actualización
 * ocurre automáticamente (se recarga la página en background).
 */
export function usePwaUpdate(): void {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // Evitar recargas en bucle: marcamos si ya recargamos en esta sesión
    const RELOAD_FLAG = 'facturado_sw_reloaded';

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        // Escuchar el BroadcastChannel del SW que avisa cuando se activa
        const channel = new BroadcastChannel('facturado-sw-update');
        channel.addEventListener('message', (event) => {
          if (event.data?.type === 'SW_UPDATED') {
            // Solo recargamos si no lo hicimos ya en esta carga de página
            if (!sessionStorage.getItem(RELOAD_FLAG)) {
              sessionStorage.setItem(RELOAD_FLAG, '1');
              console.log('[PWA] Nueva versión activa, recargando…', event.data.version);
              window.location.reload();
            }
          }
        });

        // Si ya hay un SW en espera (raro con skipWaiting pero por si acaso)
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        // Cuando se descarga una actualización
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              // Forzar skipWaiting por si acaso no se llamó en el install del SW
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });

        // Limpiar el flag de recarga cuando la página carga normalmente
        // (así la próxima actualización volverá a poder recargar)
        window.addEventListener('load', () => {
          sessionStorage.removeItem(RELOAD_FLAG);
        }, { once: true });

        // Revisar actualizaciones silenciosamente cada 5 minutos
        const interval = setInterval(() => {
          registration.update().catch(() => {/* sin red, silencioso */});
        }, 5 * 60 * 1000);

        return () => {
          clearInterval(interval);
          channel.close();
        };
      } catch (err) {
        console.warn('[PWA] Error registrando service worker:', err);
      }
    };

    registerSW();
  }, []);
}
