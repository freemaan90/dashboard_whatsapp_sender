/**
 * Badge Component
 *
 * Componente de insignia reutilizable para indicadores de estado.
 * Soporta variantes semánticas y tamaños.
 *
 * Requisitos: 3.4
 */

import React from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Variante visual del badge */
  variant?: BadgeVariant;
  /** Tamaño del badge */
  size?: BadgeSize;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = React.memo(({
  variant = 'default',
  size = 'md',
  children,
  className,
  ...rest
}) => {
  const classNames = [
    styles.badge,
    styles[`badge--${variant}`],
    styles[`badge--${size}`],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames} {...rest}>
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
