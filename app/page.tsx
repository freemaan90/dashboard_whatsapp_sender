'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, []);

  return (
    <div className={styles.loadingScreen}>
      <div className={styles.spinner} role="status" aria-label="Cargando" />
    </div>
  );
}
