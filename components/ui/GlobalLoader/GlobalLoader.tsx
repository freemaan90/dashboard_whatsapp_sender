'use client';

/**
 * GlobalLoader Component
 *
 * Barra de progreso global fija en la parte superior del viewport.
 * Detecta cambios de ruta mediante usePathname y muestra la barra
 * durante las transiciones de página.
 *
 * Requisitos: 11.9
 */

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './GlobalLoader.module.css';

type LoadState = 'idle' | 'loading' | 'complete';

export function GlobalLoader() {
  const pathname = usePathname();
  const [state, setState] = useState<LoadState>('idle');
  const prevPathname = useRef(pathname);
  const completeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Limpiar timers anteriores
    if (completeTimer.current) {
      clearTimeout(completeTimer.current);
      completeTimer.current = null;
    }

    if (pathname !== prevPathname.current) {
      // Nueva ruta detectada → iniciar animación de carga
      prevPathname.current = pathname;
      setState('loading');

      // Después de un tick, marcar como completo para animar hasta el 100%
      completeTimer.current = setTimeout(() => {
        setState('complete');

        // Ocultar la barra después de que la transición de salida termine
        completeTimer.current = setTimeout(() => {
          setState('idle');
        }, 450); // duration-normal (300ms) + duration-fast (150ms)
      }, 100);
    }

    return () => {
      if (completeTimer.current) {
        clearTimeout(completeTimer.current);
      }
    };
  }, [pathname]);

  if (state === 'idle') return null;

  return (
    <div
      role="progressbar"
      aria-label="Cargando página"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={state === 'complete' ? 100 : 85}
      className={[
        styles.bar,
        state === 'loading' ? styles.loading : '',
        state === 'complete' ? styles.complete : '',
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

export default GlobalLoader;
