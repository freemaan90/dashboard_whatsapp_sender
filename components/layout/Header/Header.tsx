'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { removeToken } from '@/lib/auth';
import { Icon } from '@/components/ui/Icon';
import styles from './Header.module.css';

const navItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <Icon name="Home" size={20} aria-hidden="true" />,
  },
  {
    name: 'WhatsApp',
    path: '/dashboard/whatsapp',
    icon: <Icon name="MessageSquare" size={20} aria-hidden="true" />,
  },
  {
    name: 'Sesiones',
    path: '/dashboard/sessions',
    icon: <Icon name="MessageSquare" size={20} aria-hidden="true" />,
  },
  {
    name: 'Usuarios',
    path: '/dashboard/users',
    icon: <Icon name="Users" size={20} aria-hidden="true" />,
  },
  {
    name: 'Actividad',
    path: '/dashboard/activity',
    icon: <Icon name="Activity" size={20} aria-hidden="true" />,
  },
];

interface HeaderProps {
  notificationCount?: number;
}

export default function Header({ notificationCount = 3 }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userMenuBtnId = 'user-menu-btn';
  const userMenuDropdownId = 'user-menu-dropdown';

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showUserMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  // Close dropdown and mobile menu on Escape key
  useEffect(() => {
    if (!showUserMenu && !mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowUserMenu(false);
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showUserMenu, mobileMenuOpen, closeMobileMenu]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Top bar: logo + actions */}
        <div className={styles.topBar}>
          <div className={styles.brand}>
            <div className={styles.logo} aria-hidden="true">
              <span className={styles.logoText}>W</span>
            </div>
            <div>
              <span className={styles.appName}>WhatsApp Manager</span>
              <span className={styles.appSubtitle}>Panel de Control</span>
            </div>
          </div>

          <div className={styles.actions}>
            {/* Hamburger button — only visible on mobile */}
            <button
              className={styles.hamburger}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              title={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-sidebar"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? (
                <Icon name="X" size={24} aria-hidden="true" />
              ) : (
                <Icon name="Menu" size={24} aria-hidden="true" />
              )}
            </button>

            <button className={styles.iconBtn} aria-label={`Notificaciones${notificationCount > 0 ? `, ${notificationCount} sin leer` : ''}`} title="Notificaciones">
              <span className={styles.notificationWrapper}>
                <Icon name="Bell" size={20} aria-hidden="true" />
                {notificationCount > 0 && (
                  <span className={styles.notificationBadge} aria-hidden="true">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </span>
            </button>

            <div className={styles.userMenuWrapper} ref={userMenuRef}>
              <button
                id={userMenuBtnId}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={styles.userMenuBtn}
                aria-expanded={showUserMenu}
                aria-haspopup="menu"
                aria-controls={userMenuDropdownId}
                aria-label="Menú de usuario"
                type="button"
              >
                <div className={styles.avatar} aria-hidden="true">
                  <span className={styles.avatarText}>U</span>
                </div>
                <Icon name="ChevronDown" size={16} aria-hidden="true" />
              </button>

              {showUserMenu && (
                <div
                  id={userMenuDropdownId}
                  className={styles.dropdown}
                  role="menu"
                  aria-labelledby={userMenuBtnId}
                >
                  <button className={styles.dropdownItem} role="menuitem" type="button">
                    <Icon name="User" size={16} aria-hidden="true" />
                    Mi Perfil
                  </button>
                  <button className={styles.dropdownItem} role="menuitem" type="button">
                    <Icon name="Settings" size={16} aria-hidden="true" />
                    Configuración
                  </button>
                  <hr className={styles.dropdownDivider} />
                  <button
                    onClick={handleLogout}
                    className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                    role="menuitem"
                    type="button"
                  >
                    <Icon name="LogOut" size={16} aria-hidden="true" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop navigation bar — hidden on mobile */}
        <nav className={`${styles.nav} ${styles.navDesktop}`} aria-label="Navegación principal">
          <div className={styles.navList}>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className={styles.mobileOverlay}
          aria-hidden="true"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile sidebar */}
      <div
        id="mobile-sidebar"
        className={`${styles.mobileSidebar} ${mobileMenuOpen ? styles.mobileSidebarOpen : ''}`}
        aria-hidden={!mobileMenuOpen}
        // Prevent keyboard access to sidebar contents when closed
        {...(!mobileMenuOpen ? { inert: '' } : {})}
      >
        <div className={styles.mobileSidebarHeader}>
          <div className={styles.brand}>
            <div className={styles.logo} aria-hidden="true">
              <span className={styles.logoText}>W</span>
            </div>
            <span className={styles.appName}>WhatsApp Manager</span>
          </div>
          <button
            className={styles.iconBtn}
            aria-label="Cerrar menú"
            title="Cerrar menú"
            onClick={closeMobileMenu}
          >
            <Icon name="X" size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className={styles.mobileSidebarNav} aria-label="Navegación móvil">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`${styles.mobileSidebarLink} ${isActive ? styles.mobileSidebarLinkActive : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={closeMobileMenu}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
