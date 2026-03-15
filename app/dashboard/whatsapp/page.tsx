'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WhatsAppSidebar from '@/components/whatsapp/WhatsAppSidebar';
import SessionView from '@/components/whatsapp/SessionView';
import MessagesView from '@/components/whatsapp/MessagesView';
import styles from './whatsapp.module.css';

export default function WhatsAppPage() {
  const [activeView, setActiveView] = useState<'session' | 'messages'>('session');

  return (
    <DashboardLayout>
      <div className={styles.layout}>
        <WhatsAppSidebar activeView={activeView} onViewChange={setActiveView} />

        <div className={styles.contentPanel}>
          {activeView === 'session' ? <SessionView /> : <MessagesView />}
        </div>
      </div>
    </DashboardLayout>
  );
}
