/**
 * Avatar Component
 *
 * Componente de avatar reutilizable con soporte para imágenes y fallback a iniciales.
 * Incluye textos alternativos para accesibilidad.
 *
 * Requisitos: 3.5, 10.4
 */

'use client';

import React, { useState } from 'react';
import styles from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  /** URL de la imagen del avatar */
  src?: string;
  /** Texto alternativo para accesibilidad (requerido) */
  alt: string;
  /** Nombre del usuario para generar iniciales como fallback */
  name?: string;
  /** Tamaño del avatar */
  size?: AvatarSize;
  /** Clase CSS adicional */
  className?: string;
}

/** Genera las iniciales a partir de un nombre (primera letra de la primera y última palabra) */
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = React.memo(({
  src,
  alt,
  name,
  size = 'md',
  className,
}) => {
  const [imgError, setImgError] = useState(false);

  const showImage = src && !imgError;
  const initials = name ? getInitials(name) : '';

  const classNames = [
    styles.avatar,
    styles[`avatar--${size}`],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames} role="img" aria-label={alt}>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={styles.avatar__image}
          onError={() => setImgError(true)}
        />
      ) : (
        <span className={styles.avatar__initials} aria-hidden="true">
          {initials}
        </span>
      )}
    </span>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;
