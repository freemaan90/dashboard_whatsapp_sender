'use client';

/**
 * Página de Error del Servidor (500)
 *
 * Error boundary global de Next.js App Router.
 * Se muestra cuando ocurre un error inesperado en el servidor o en el cliente.
 * Incluye botón de reintento y navegación de regreso al dashboard.
 *
 * Requisitos: 16.9
 */

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './error.module.css';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Registrar el error en consola para debugging (Requisito 16.7)
    console.error('[ErrorBoundary]', error);
  }, [error]);

  return (
    <main className={styles.page} id="main-content">
      <div className={styles.container}>
        {/* Código de error */}
        <p className={styles.code} aria-hidden="true">500</p>

        {/* Icono ilustrativo */}
        <div className={styles.iconWrapper} aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h1 className={styles.title}>Algo salió mal</h1>
        <p className={styles.description}>
          Ocurrió un error inesperado en el servidor. Por favor, intenta de nuevo o regresa al dashboard.
        </p>

        {/* Código de error técnico — solo en desarrollo (Requisito 16.6) */}
        {process.env.NODE_ENV === 'development' && error?.digest && (
          <p className={styles.digest}>
            Código: <code>{error.digest}</code>
          </p>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={reset}
            className={styles.retryButton}
          >
            Intentar de nuevo
          </button>
          <Link href="/dashboard" className={styles.dashboardLink}>
            Ir al Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
