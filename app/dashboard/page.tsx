'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SessionCard from '@/components/SessionCard';
import ActivityFeed from '@/components/ActivityFeed';
import StatsCards from '@/components/StatsCards';
import SessionPanel from '@/components/panels/SessionPanel';
import UserPanel from '@/components/panels/UserPanel';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { getSessions } from '@/app/actions/getSessions';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Mostrar UI inmediatamente
    setInitialLoading(false);

    // Cargar datos en background
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Cargar sesiones primero (más importante)
      const sessionsData = await getSessions();
      setSessions(sessionsData);
      setSessionsLoading(false);

      // Luego cargar stats
      const statsRes = await api.get('/users/stats');
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      setSessionsLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner} role="status" aria-label="Cargando"></div>
          <p className={styles.loadingText}>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      {stats ? (
        <StatsCards stats={stats} />
      ) : (
        <div className={styles.skeletonGrid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <Skeleton variant="text" width={96} height={16} />
              <Skeleton variant="text" width={64} height={32} />
            </div>
          ))}
        </div>
      )}

      <div className={styles.mainGrid}>
        <div className={styles.mainColumn}>
          <div id="session-panel">
            <SessionPanel onSessionCreated={loadData} />
          </div>

          <div>
            <h2 className={styles.sessionsTitle}>Mis Sesiones</h2>
            <div className={styles.sessionsList}>
              {sessionsLoading ? (
                <>
                  {[1, 2].map((i) => (
                    <div key={i} className={styles.skeletonSessionCard}>
                      <div className={styles.skeletonSessionHeader}>
                        <Skeleton variant="circle" width={40} height={40} />
                        <div className={styles.skeletonSessionInfo}>
                          <Skeleton variant="text" width={120} height={16} />
                          <Skeleton variant="text" width={80} height={12} />
                        </div>
                      </div>
                      <Skeleton variant="text" width={60} height={22} />
                    </div>
                  ))}
                </>
              ) : sessions.length === 0 ? (
                <EmptyState
                  title="No tienes sesiones activas"
                  description="Crea una nueva sesión para comenzar a enviar mensajes"
                  action={{
                    label: 'Crear sesión',
                    onClick: () => {
                      const panel = document.getElementById('session-panel');
                      panel?.scrollIntoView({ behavior: 'smooth' });
                    },
                  }}
                />
              ) : (
                sessions.map((session) => (
                  <SessionCard key={session.id} session={session} onUpdate={loadData} />
                ))
              )}
            </div>
          </div>
        </div>

        <div className={styles.sideColumn}>
          <UserPanel />
          <ActivityFeed />
        </div>
      </div>
    </DashboardLayout>
  );
}
