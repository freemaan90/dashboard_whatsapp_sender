'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { removeToken } from '@/lib/auth';
import styles from './Header.module.css';

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.row}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoText}>W</span>
            </div>
            <div>
              <h1 className={styles.appName}>WhatsApp Manager</h1>
              <p className={styles.appSubtitle}>Panel de Control</p>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.iconBtn} aria-label="Notificaciones" title="Notificaciones">
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            <div className={styles.userMenuWrapper}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={styles.userMenuBtn}
                aria-expanded={showUserMenu}
                aria-haspopup="menu"
                aria-label="Menú de usuario"
              >
                <div className={styles.avatar}>
                  <span className={styles.avatarText}>U</span>
                </div>
                <svg className={styles.chevron} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className={styles.dropdown} role="menu">
                  <button className={styles.dropdownItem} role="menuitem">
                    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Mi Perfil
                  </button>
                  <button className={styles.dropdownItem} role="menuitem">
                    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Configuración
                  </button>
                  <hr className={styles.dropdownDivider} />
                  <button
                    onClick={handleLogout}
                    className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                    role="menuitem"
                  >
                    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
