'use client';

import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className={styles.layout}>
      <Header />
      <Navbar />
      <main className={styles.main} id="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}
