'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import styles from './UserPanel.module.css';

interface User {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
}

export default function UserPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeletonAvatarRow}>
          <div className={styles.skeletonAvatar}></div>
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLineWide}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <p className={styles.errorText}>No se pudo cargar la información del usuario</p>
      </div>
    );
  }

  const initial = user.name
    ? user.name.charAt(0).toUpperCase()
    : user.email.charAt(0).toUpperCase();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Información del Usuario</h2>

      <div className={styles.avatarRow}>
        <div className={styles.avatar} aria-hidden="true">
          <span className={styles.avatarInitial}>{initial}</span>
        </div>
        <div>
          <h3 className={styles.userName}>{user.name || 'Usuario'}</h3>
          <p className={styles.userEmail}>{user.email}</p>
        </div>
      </div>

      <div className={styles.infoList}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>ID de Usuario</span>
          <span className={styles.infoValue}>#{user.id}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Miembro desde</span>
          <span className={styles.infoValue}>
            {new Date(user.createdAt).toLocaleDateString('es-AR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <div className={styles.infoRowLast}>
          <span className={styles.infoLabel}>Estado</span>
          <span className={styles.statusBadge}>
            <span className={styles.statusDot} aria-hidden="true"></span>
            Activo
          </span>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.editButton}>
          Editar Perfil
        </button>
      </div>
    </div>
  );
}
