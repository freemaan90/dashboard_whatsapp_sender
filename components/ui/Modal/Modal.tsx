'use client';

/**
 * Modal Component
 *
 * Diálogo modal accesible con gestión de foco, animaciones y soporte de teclado.
 * Usa React Portal para renderizar fuera del árbol de componentes.
 *
 * Requisitos: 3.7, 8.3, 10.8, 10.9
 */

import React, { useEffect, useRef, useCallback, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  /** Controla si el modal está visible */
  isOpen: boolean;
  /** Callback al cerrar el modal */
  onClose: () => void;
  /** Título del modal (mostrado en el header) */
  title: string;
  /** Contenido del modal */
  children: React.ReactNode;
  /** Tamaño del modal */
  size?: ModalSize;
  /** Clase CSS adicional para el contenedor del modal */
  className?: string;
}

/** Selectores de elementos enfocables dentro del modal */
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/** Duration of the exit animation in ms — must match CSS --duration-normal */
const EXIT_ANIMATION_DURATION = 300;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className,
}) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  /** Elemento que tenía el foco antes de abrir el modal (Req 10.9) */
  const previousFocusRef = useRef<HTMLElement | null>(null);

  /**
   * `mounted` tracks whether the portal is in the DOM.
   * `exiting` tracks whether the exit animation is playing.
   */
  const [mounted, setMounted] = useState(isOpen);
  const [exiting, setExiting] = useState(false);

  /** Obtiene todos los elementos enfocables dentro del modal */
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!dialogRef.current) return [];
    return Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    );
  }, []);

  /** Handle mount/unmount with exit animation */
  useEffect(() => {
    if (isOpen) {
      setExiting(false);
      setMounted(true);
    } else if (mounted) {
      // Trigger exit animation, then unmount
      setExiting(true);
      const timer = setTimeout(() => {
        setMounted(false);
        setExiting(false);
      }, EXIT_ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Gestión de foco al abrir/cerrar (Req 10.8, 10.9) */
  useEffect(() => {
    if (isOpen && mounted) {
      // Guardar el elemento activo antes de abrir
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Mover el foco al primer elemento enfocable del modal
      requestAnimationFrame(() => {
        const focusable = getFocusableElements();
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          dialogRef.current?.focus();
        }
      });

      // Bloquear scroll del body
      document.body.style.overflow = 'hidden';
    } else {
      // Devolver el foco al elemento que abrió el modal
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, mounted, getFocusableElements]);

  /** Trampa de foco (Tab / Shift+Tab) y cierre con ESC (Req 10.8) */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = getFocusableElements();
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          // Shift+Tab: si el foco está en el primer elemento, ir al último
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          // Tab: si el foco está en el último elemento, ir al primero
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [onClose, getFocusableElements]
  );

  /** Cierre al hacer clic en el backdrop */
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!mounted) return null;

  const backdropClasses = [
    styles.backdrop,
    exiting ? styles['backdrop--exiting'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const dialogClasses = [
    styles.dialog,
    styles[`dialog--${size}`],
    exiting ? styles['dialog--exiting'] : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return createPortal(
    <div
      className={backdropClasses}
      onClick={exiting ? undefined : handleBackdropClick}
      aria-hidden="false"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={dialogClasses}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar modal"
            title="Cerrar modal"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M15 5L5 15M5 5l10 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

Modal.displayName = 'Modal';

export default Modal;
