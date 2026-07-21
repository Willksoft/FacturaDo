import { useEffect, useState, useCallback } from 'react';

interface UsePwaUpdateReturn {
  /** Hay una nueva versión disponible esperando activarse */
  updateAvailable: boolean;
  /** Aplica la actualización (recarga la página con la nueva versión) */
  applyUpdate: () => void;
}

/**
 * Hook que registra el Service Worker y detecta cuando hay
 * una nueva versión disponible para notificar al usuario.
 */
export function usePwaUpdate(): UsePwaUpdateReturn {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  const applyUpdate = useCallback(() => {
    if (waitingWorker) {
      // Le dice al SW en espera que se active ahora
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    // Recarga la página para usar el nuevo SW activo
    window.location.reload();
  }, [waitingWorker]);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          // 'importScripts' scope
          scope: '/',
        });

        // Verificar si ya hay un SW en espera al cargar
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setUpdateAvailable(true);
        }

        // Detectar cuando un nuevo SW termina de instalarse y queda en espera
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // Hay un nuevo SW instalado esperando activarse
              setWaitingWorker(newWorker);
              setUpdateAvailable(true);
            }
          });
        });

        // Escuchar cuando el SW controlador cambia (después de skipWaiting)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          // Evitar recargas en loop
          window.location.reload();
        });

        // Revisar actualizaciones cada 60 segundos si la app está abierta
        const interval = setInterval(() => {
          registration.update().catch(() => {
            // Silencioso si no hay red
          });
        }, 60 * 1000);

        return () => clearInterval(interval);
      } catch (err) {
        console.warn('[PWA] Error al registrar el service worker:', err);
      }
    };

    registerSW();
  }, []);

  return { updateAvailable, applyUpdate };
}
