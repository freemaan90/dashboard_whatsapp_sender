import React from 'react';
import styles from './Grid.module.css';

export type GridGap = 'sm' | 'md' | 'lg';
export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface GridProps {
  children: React.ReactNode;
  cols?: GridCols;
  colsMd?: GridCols;
  colsLg?: GridCols;
  gap?: GridGap;
  className?: string;
}

export interface GridItemProps {
  children: React.ReactNode;
  span?: GridCols;
  spanMd?: GridCols;
  spanLg?: GridCols;
  className?: string;
}

export function Grid({
  children,
  cols = 12,
  colsMd,
  colsLg,
  gap = 'md',
  className,
}: GridProps) {
  const gapClass = gap === 'sm' ? styles.gapSm : gap === 'lg' ? styles.gapLg : styles.gapMd;
  const classes = [styles.grid, gapClass, className].filter(Boolean).join(' ');

  const cssVars = {
    '--cols': cols,
    ...(colsMd !== undefined && { '--cols-md': colsMd }),
    ...(colsLg !== undefined && { '--cols-lg': colsLg }),
  } as React.CSSProperties;

  return (
    <div className={classes} style={cssVars}>
      {children}
    </div>
  );
}

export function GridItem({ children, span, spanMd, spanLg, className }: GridItemProps) {
  const classes = [styles.item, className].filter(Boolean).join(' ');

  const cssVars = {
    ...(span !== undefined && { '--span': span }),
    ...(spanMd !== undefined && { '--span-md': spanMd }),
    ...(spanLg !== undefined && { '--span-lg': spanLg }),
  } as React.CSSProperties;

  return (
    <div className={classes} style={cssVars}>
      {children}
    </div>
  );
}

export default Grid;
