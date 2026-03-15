/**
 * ProgressBar Component
 *
 * Barra de progreso para cargas con duración conocida.
 * Soporta valor (0-100), etiqueta opcional y usa tokens de diseño.
 *
 * Requisitos: 11.3
 */

import React from 'react';
import styles from './ProgressBar.module.css';

export interface ProgressBarProps {
  /** Valor de progreso entre 0 y 100 */
  value: number;
  /** Etiqueta descriptiva opcional */
  label?: string;
  /** Mostrar el porcentaje numéricamente */
  showValue?: boolean;
  /** Clase CSS adicional */
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showValue = false,
  className,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      {(label || showValue) && (
        <div className={styles.header}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && (
            <span className={styles.value} aria-hidden="true">
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? `Progreso: ${Math.round(clamped)}%`}
      >
        <div
          className={styles.fill}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
