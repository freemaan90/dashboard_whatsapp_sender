import React, { memo } from 'react';
import styles from './StatsCards.module.css';

interface TrendIndicator {
  value: number;
  direction: 'up' | 'down';
}

interface StatsCardsProps {
  stats: {
    totalSessions: number;
    activeSessions: number;
    totalActivities: number;
    trends?: {
      totalSessions?: TrendIndicator;
      activeSessions?: TrendIndicator;
      totalActivities?: TrendIndicator;
    };
  };
}

const Trend = memo(function Trend({ trend }: { trend: TrendIndicator }) {
  const isUp = trend.direction === 'up';
  return (
    <span className={`${styles.trend} ${isUp ? styles.trendUp : styles.trendDown}`} aria-label={`${isUp ? 'Incremento' : 'Decremento'} del ${trend.value}%`}>
      <svg className={styles.trendIcon} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        {isUp
          ? <path d="M8 4l5 5H3l5-5z" />
          : <path d="M8 12L3 7h10l-5 5z" />
        }
      </svg>
      {trend.value}%
    </span>
  );
});

export default memo(function StatsCards({ stats }: StatsCardsProps) {
  const trends = stats.trends ?? {};

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.cardInner}>
          <div>
            <p className={styles.label}>Total Sesiones</p>
            <p className={styles.value}>{stats.totalSessions}</p>
            {trends.totalSessions && <Trend trend={trends.totalSessions} />}
          </div>
          <div className={`${styles.iconWrapper} ${styles.iconWrapperBlue}`}>
            <svg className={`${styles.icon} ${styles.iconBlue}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardInner}>
          <div>
            <p className={styles.label}>Sesiones Activas</p>
            <p className={`${styles.value} ${styles.valueSuccess}`}>{stats.activeSessions}</p>
            {trends.activeSessions && <Trend trend={trends.activeSessions} />}
          </div>
          <div className={`${styles.iconWrapper} ${styles.iconWrapperGreen}`}>
            <svg className={`${styles.icon} ${styles.iconGreen}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardInner}>
          <div>
            <p className={styles.label}>Actividades</p>
            <p className={styles.value}>{stats.totalActivities}</p>
            {trends.totalActivities && <Trend trend={trends.totalActivities} />}
          </div>
          <div className={`${styles.iconWrapper} ${styles.iconWrapperPurple}`}>
            <svg className={`${styles.icon} ${styles.iconPurple}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
})
