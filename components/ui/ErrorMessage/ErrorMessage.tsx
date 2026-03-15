/**
 * ErrorMessage Component
 *
 * Componente de error inline que muestra mensajes de error comprensibles
 * para el usuario, con opción de reintentar para errores de red.
 *
 * Requisitos: 16.1, 16.4, 16.5
 */

import React from 'react';
import styles from './ErrorMessage.module.css';

export type ErrorMessageVariant = 'inline' | 'banner' | 'card';

export interface ErrorMessageProps {
  /** Mensaje de error principal */
  message: string;
  /** Descripción adicional o sugerencia de resolución */
  description?: string;
  /** Variante visual */
  variant?: ErrorMessageVariant;
  /** Callback para reintentar la operación (muestra botón de reintento) */
  onRetry?: () => void;
  /** Texto del botón de reintento */
  retryLabel?: string;
  /** Clase CSS adicional */
  className?: string;
  /** ID para asociar con aria-describedby */
  id?: string;
}

/**
 * Icono de error (X en círculo)
 */
const ErrorIcon: React.FC = () => (
  <svg
    className={styles.icon}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    width="20"
    height="20"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
      clipRule="evenodd"
    />
  </svg>
);

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  description,
  variant = 'inline',
  onRetry,
  retryLabel = 'Reintentar',
  className,
  id,
}) => {
  const classNames = [
    styles.errorMessage,
    styles[`errorMessage--${variant}`],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      id={id}
      className={classNames}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <ErrorIcon />

      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
        {onRetry && (
          <button
            type="button"
            className={styles.retryButton}
            onClick={onRetry}
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
};

ErrorMessage.displayName = 'ErrorMessage';

export default ErrorMessage;
