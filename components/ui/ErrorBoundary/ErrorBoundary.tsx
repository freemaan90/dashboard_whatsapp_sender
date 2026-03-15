/**
 * ErrorBoundary Component
 *
 * Componente de clase React que captura errores de renderizado en el árbol
 * de componentes hijo y muestra una UI de fallback comprensible para el usuario.
 * Incluye opción de reintentar para recuperarse del error.
 *
 * Requisitos: 16.1, 16.4, 16.5
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

export interface ErrorBoundaryProps {
  /** Componentes hijos a proteger */
  children: ReactNode;
  /** UI de fallback personalizada (reemplaza la UI por defecto) */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Callback cuando se captura un error */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Título del mensaje de error por defecto */
  errorTitle?: string;
  /** Descripción del mensaje de error por defecto */
  errorDescription?: string;
  /** Texto del botón de reintento */
  retryLabel?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Icono de advertencia para la UI de fallback
 */
const WarningIcon: React.FC = () => (
  <svg
    className={styles.icon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
    focusable="false"
    width="48"
    height="48"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
    />
  </svg>
);

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static displayName = 'ErrorBoundary';

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Registrar el error en consola para debugging (Req 16.7)
    console.error('[ErrorBoundary] Error capturado:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset(): void {
    this.setState({ hasError: false, error: null });
  }

  render(): ReactNode {
    const { hasError, error } = this.state;
    const {
      children,
      fallback,
      errorTitle = 'Algo salió mal',
      errorDescription = 'Ocurrió un error inesperado. Por favor, intenta de nuevo.',
      retryLabel = 'Reintentar',
    } = this.props;

    if (!hasError) {
      return children;
    }

    // Fallback personalizado
    if (fallback) {
      if (typeof fallback === 'function') {
        return fallback(error!, this.handleReset);
      }
      return fallback;
    }

    // UI de fallback por defecto
    return (
      <div
        className={styles.errorBoundary}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <WarningIcon />

        <div className={styles.content}>
          <h2 className={styles.title}>{errorTitle}</h2>
          <p className={styles.description}>{errorDescription}</p>

          {/* Mostrar detalles técnicos solo en desarrollo (Req 16.6) */}
          {process.env.NODE_ENV === 'development' && error && (
            <details className={styles.details}>
              <summary className={styles.detailsSummary}>
                Detalles técnicos
              </summary>
              <pre className={styles.errorStack}>
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}

          <button
            type="button"
            className={styles.retryButton}
            onClick={this.handleReset}
          >
            {retryLabel}
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
