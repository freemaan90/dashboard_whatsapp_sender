/**
 * Skeleton Component
 *
 * Placeholder de carga para contenido que está siendo obtenido.
 * Soporta diferentes formas (text, circle, rect) y tamaños personalizados.
 * Implementa animación de pulso/shimmer sutil.
 *
 * Requisitos: 11.6
 */

import React from 'react';
import styles from './Skeleton.module.css';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

export interface SkeletonProps {
  /** Forma del skeleton */
  variant?: SkeletonVariant;
  /** Ancho (ej: '100%', '120px', '8rem') */
  width?: string | number;
  /** Alto (ej: '16px', '2rem') */
  height?: string | number;
  /** Clase CSS adicional */
  className?: string;
  /** Número de líneas de texto (solo para variant="text") */
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rect',
  width,
  height,
  className,
  lines = 1,
}) => {
  const inlineStyle: React.CSSProperties = {
    ...(width !== undefined && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height !== undefined && { height: typeof height === 'number' ? `${height}px` : height }),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div
        className={[styles.textGroup, className].filter(Boolean).join(' ')}
        aria-hidden="true"
      >
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className={styles.skeleton}
            style={{
              ...inlineStyle,
              // Última línea más corta para aspecto natural
              width: i === lines - 1 ? '70%' : (inlineStyle.width ?? '100%'),
            }}
          />
        ))}
      </div>
    );
  }

  const classNames = [
    styles.skeleton,
    styles[`skeleton--${variant}`],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classNames}
      style={inlineStyle}
      aria-hidden="true"
    />
  );
};

Skeleton.displayName = 'Skeleton';

export default Skeleton;
