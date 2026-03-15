import React from 'react';
import styles from './Container.module.css';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: ContainerSize;
}

export function Container({ children, className, size = 'xl' }: ContainerProps) {
  const classes = [styles.container, styles[size], className].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
}

export default Container;
