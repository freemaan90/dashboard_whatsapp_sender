/**
 * EmptyState Component
 *
 * Componente de estado vacío con ilustración SVG opcional y call-to-action.
 * Se aplica a listas vacías, feeds sin actividad y otras secciones sin datos.
 *
 * Requisitos: 16.2, 16.3
 */

import React from 'react';
import styles from './EmptyState.module.css';

export interface EmptyStateAction {
  /** Texto del botón de acción */
  label: string;
  /** Callback al hacer clic en el botón */
  onClick: () => void;
}

export interface EmptyStateProps {
  /** Título principal del estado vacío */
  title: string;
  /** Descripción o mensaje de ayuda */
  description?: string;
  /** Ilustración SVG opcional */
  illustration?: React.ReactNode;
  /** Acción principal (botón call-to-action) */
  action?: EmptyStateAction;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Ilustración SVG por defecto para estado vacío genérico
 */
const DefaultIllustration: React.FC = () => (
  <svg
    className={styles.illustration}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    {/* Caja / bandeja vacía */}
    <rect x="20" y="55" width="80" height="45" rx="6" fill="var(--color-bg-muted)" />
    <path
      d="M20 70h80"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M44 70l6-15h20l6 15"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Líneas decorativas (documentos) */}
    <rect x="38" y="20" width="44" height="28" rx="4" fill="var(--color-bg-subtle)" stroke="var(--color-border-default)" strokeWidth="1.5" />
    <line x1="46" y1="30" x2="74" y2="30" stroke="var(--color-border-strong)" strokeWidth="2" strokeLinecap="round" />
    <line x1="46" y1="37" x2="66" y2="37" stroke="var(--color-border-default)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  illustration,
  action,
  className,
}) => {
  const classNames = [styles.emptyState, className].filter(Boolean).join(' ');

  return (
    <div className={classNames} role="status" aria-label={title}>
      <div className={styles.illustrationWrapper}>
        {illustration ?? <DefaultIllustration />}
      </div>

      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
        {action && (
          <button
            type="button"
            className={styles.actionButton}
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

EmptyState.displayName = 'EmptyState';

export default EmptyState;
