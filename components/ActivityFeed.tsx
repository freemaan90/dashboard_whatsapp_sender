'use client';

import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import api from '@/lib/api';
import { EmptyState } from '@/components/ui/EmptyState';
import styles from './ActivityFeed.module.css';

const VISIBLE_LIMIT = 5;

/* ─── ActivityItem ─────────────────────────────────────────────────────── */

interface ActivityItemProps {
  activity: any;
  formatTime: (date: string) => string;
}

const ActivityItem = memo(function ActivityItem({ activity, formatTime }: ActivityItemProps) {
  const icon = getActivityIcon(activity.type);
  return (
    <div className={styles.item}>
      {icon}
      <div className={styles.content}>
        <p className={styles.description}>{activity.description}</p>
        <p className={styles.timestamp}>{formatTime(activity.createdAt)}</p>
      </div>
    </div>
  );
});

/* ─── Icon helper (module-level, no re-creation on render) ─────────────── */

function getActivityIcon(type: string) {
  switch (type) {
    case 'session_created':
      return (
        <div className={`${styles.iconWrapper} ${styles.iconBlue}`}>
          <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      );
    case 'session_deleted':
      return (
        <div className={`${styles.iconWrapper} ${styles.iconRed}`}>
          <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    case 'qr_generated':
      return (
        <div className={`${styles.iconWrapper} ${styles.iconPurple}`}>
          <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
      );
    case 'login_success':
      return (
        <div className={`${styles.iconWrapper} ${styles.iconGreen}`}>
          <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </div>
      );
    default:
      return (
        <div className={`${styles.iconWrapper} ${styles.iconGray}`}>
          <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
  }
}

/* ─── ActivityFeed ─────────────────────────────────────────────────────── */

export default function ActivityFeed() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const response = await api.get('/users/activity?limit=20');
      setActivities(response.data);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = useCallback((date: string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now.getTime() - activityDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return activityDate.toLocaleDateString('es-AR');
  }, []);

  const visibleActivities = useMemo(
    () => (showAll ? activities : activities.slice(0, VISIBLE_LIMIT)),
    [activities, showAll]
  );

  const handleToggleShowAll = useCallback(() => setShowAll((prev) => !prev), []);

  if (loading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Actividad Reciente</h2>
        <div className={styles.list}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonItem}>
              <div className={styles.skeletonAvatar}></div>
              <div className={styles.skeletonContent}>
                <div className={styles.skeletonLine} style={{ width: '75%' }}></div>
                <div className={styles.skeletonLineShort}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Actividad Reciente</h2>
      <div className={`${styles.list} ${showAll ? styles.listScrollable : ''}`}>
        {activities.length === 0 ? (
          <EmptyState
            title="No hay actividad reciente"
            description="Las acciones que realices aparecerán aquí"
          />
        ) : (
          visibleActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} formatTime={formatTime} />
          ))
        )}
      </div>
      {activities.length > VISIBLE_LIMIT && (
        <button
          className={styles.verMas}
          onClick={handleToggleShowAll}
        >
          {showAll ? 'Ver menos' : `Ver más (${activities.length - VISIBLE_LIMIT} más)`}
        </button>
      )}
    </div>
  );
}
