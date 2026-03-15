/**
 * Card Component
 *
 * Componente de tarjeta reutilizable con sub-componentes Header, Body y Footer opcionales.
 * Soporta variantes de elevación (flat, elevated) y estado interactivo con onClick.
 *
 * Requisitos: 3.3, 19.3
 */

import React from 'react';
import styles from './Card.module.css';

export type CardElevation = 'flat' | 'elevated';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Variante de elevación de la tarjeta */
  elevation?: CardElevation;
  /** Hace la tarjeta interactiva/clickeable */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Elemento HTML semántico a renderizar */
  as?: 'article' | 'div' | 'section';
  children: React.ReactNode;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/* ─── Sub-componentes ───────────────────────────────────────────────────── */

const CardHeader: React.FC<CardHeaderProps> = ({ children, className, ...rest }) => (
  <div
    className={[styles.header, className].filter(Boolean).join(' ')}
    {...rest}
  >
    {children}
  </div>
);
CardHeader.displayName = 'Card.Header';

const CardBody: React.FC<CardBodyProps> = ({ children, className, ...rest }) => (
  <div
    className={[styles.body, className].filter(Boolean).join(' ')}
    {...rest}
  >
    {children}
  </div>
);
CardBody.displayName = 'Card.Body';

const CardFooter: React.FC<CardFooterProps> = ({ children, className, ...rest }) => (
  <div
    className={[styles.footer, className].filter(Boolean).join(' ')}
    {...rest}
  >
    {children}
  </div>
);
CardFooter.displayName = 'Card.Footer';

/* ─── Componente principal ──────────────────────────────────────────────── */

const CardBase: React.FC<CardProps> = ({
  elevation = 'flat',
  onClick,
  as: Tag = 'div',
  children,
  className,
  ...rest
}) => {
  const isInteractive = Boolean(onClick);

  const classNames = [
    styles.card,
    styles[`card--${elevation}`],
    isInteractive ? styles['card--interactive'] : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      className={classNames}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive
          ? (e: React.KeyboardEvent<HTMLElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.(e as unknown as React.MouseEvent<HTMLElement>);
              }
            }
          : undefined
      }
      {...rest}
    >
      {children}
    </Tag>
  );
};

CardBase.displayName = 'Card';

/* ─── Exportación con sub-componentes ──────────────────────────────────── */

export const Card = Object.assign(CardBase, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});

export default Card;
