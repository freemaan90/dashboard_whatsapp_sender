/**
 * Página 404 — Not Found
 *
 * Página personalizada para recursos no encontrados.
 * Incluye navegación de regreso al dashboard.
 *
 * Requisitos: 16.8
 */

import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.page} id="main-content">
      <div className={styles.container}>
        {/* Código de error */}
        <p className={styles.code} aria-hidden="true">404</p>

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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
            <path d="M11 8v3" />
            <path d="M11 14h.01" />
          </svg>
        </div>

        <h1 className={styles.title}>Página no encontrada</h1>
        <p className={styles.description}>
          Lo sentimos, la página que buscas no existe o fue movida a otra dirección.
        </p>

        <div className={styles.actions}>
          <Link href="/dashboard" className={styles.primaryLink}>
            Ir al Dashboard
          </Link>
          <Link href="/" className={styles.secondaryLink}>
            Página de inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
