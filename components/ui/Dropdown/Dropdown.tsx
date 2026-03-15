'use client';

/**
 * Dropdown Component
 *
 * Menú desplegable accesible con posicionamiento dinámico, navegación por teclado
 * y atributos ARIA completos.
 *
 * Requisitos: 3.8, 10.1, 10.5
 */

import React, { useEffect, useRef, useState, useCallback, useId } from 'react';
import styles from './Dropdown.module.css';

export type DropdownPlacement = 'bottom-start' | 'bottom-end';

export interface DropdownItem {
  /** Texto visible del ítem */
  label: string;
  /** Acción al activar el ítem */
  onClick: () => void;
  /** Icono opcional (ReactNode) */
  icon?: React.ReactNode;
  /** Si el ítem está deshabilitado */
  disabled?: boolean;
}

export interface DropdownProps {
  /** Elemento que activa el dropdown */
  trigger: React.ReactNode;
  /** Lista de ítems del menú */
  items: DropdownItem[];
  /** Posicionamiento del menú respecto al trigger */
  placement?: DropdownPlacement;
  /** Clase CSS adicional para el contenedor */
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  placement = 'bottom-start',
  className,
}) => {
  const menuId = useId();
  const triggerId = useId();

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  /** Índices de ítems habilitados para navegación */
  const enabledIndices = items
    .map((item, i) => (item.disabled ? null : i))
    .filter((i): i is number => i !== null);

  const open = useCallback(() => {
    setIsOpen(true);
    setFocusedIndex(-1);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  /** Activar ítem por índice */
  const activateItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (item && !item.disabled) {
        item.onClick();
        close();
        triggerRef.current?.focus();
      }
    },
    [items, close]
  );

  /** Cerrar al hacer clic fuera del componente */
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, close]);

  /** Mover foco al primer ítem habilitado al abrir */
  useEffect(() => {
    if (isOpen && menuRef.current) {
      // Pequeño delay para que el DOM esté listo
      requestAnimationFrame(() => {
        const firstEnabled = enabledIndices[0];
        if (firstEnabled !== undefined) {
          setFocusedIndex(firstEnabled);
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /** Sincronizar foco real del DOM con focusedIndex */
  useEffect(() => {
    if (!isOpen || focusedIndex === -1) return;
    const menuItems = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
    if (menuItems && menuItems[focusedIndex]) {
      menuItems[focusedIndex].focus();
    }
  }, [focusedIndex, isOpen]);

  /** Gestión de teclado en el trigger */
  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
        case 'ArrowDown':
          e.preventDefault();
          open();
          break;
        case 'ArrowUp':
          e.preventDefault();
          open();
          break;
        case 'Escape':
          e.preventDefault();
          close();
          break;
      }
    },
    [open, close]
  );

  /** Gestión de teclado en el menú */
  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLUListElement>) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          close();
          triggerRef.current?.focus();
          break;

        case 'ArrowDown': {
          e.preventDefault();
          const currentPos = enabledIndices.indexOf(focusedIndex);
          const nextIndex =
            currentPos < enabledIndices.length - 1
              ? enabledIndices[currentPos + 1]
              : enabledIndices[0];
          if (nextIndex !== undefined) setFocusedIndex(nextIndex);
          break;
        }

        case 'ArrowUp': {
          e.preventDefault();
          const currentPos = enabledIndices.indexOf(focusedIndex);
          const prevIndex =
            currentPos > 0
              ? enabledIndices[currentPos - 1]
              : enabledIndices[enabledIndices.length - 1];
          if (prevIndex !== undefined) setFocusedIndex(prevIndex);
          break;
        }

        case 'Home': {
          e.preventDefault();
          const first = enabledIndices[0];
          if (first !== undefined) setFocusedIndex(first);
          break;
        }

        case 'End': {
          e.preventDefault();
          const last = enabledIndices[enabledIndices.length - 1];
          if (last !== undefined) setFocusedIndex(last);
          break;
        }

        case 'Tab':
          close();
          break;
      }
    },
    [close, enabledIndices, focusedIndex]
  );

  const containerClasses = [styles.container, className ?? '']
    .filter(Boolean)
    .join(' ');

  const menuClasses = [
    styles.menu,
    styles[`menu--${placement}`],
    isOpen ? styles['menu--open'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={containerRef} className={containerClasses}>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        className={styles.trigger}
        onClick={toggle}
        onKeyDown={handleTriggerKeyDown}
      >
        {trigger}
      </button>

      {/* Menu */}
      {isOpen && (
        <ul
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-labelledby={triggerId}
          className={menuClasses}
          onKeyDown={handleMenuKeyDown}
        >
          {items.map((item, index) => (
            <li key={index} role="none">
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                tabIndex={focusedIndex === index ? 0 : -1}
                className={[
                  styles.item,
                  item.disabled ? styles['item--disabled'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => activateItem(index)}
                onMouseEnter={() => {
                  if (!item.disabled) setFocusedIndex(index);
                }}
              >
                {item.icon && (
                  <span className={styles.itemIcon} aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <span className={styles.itemLabel}>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

Dropdown.displayName = 'Dropdown';

export default Dropdown;
