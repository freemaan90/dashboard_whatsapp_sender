'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WhatsAppSidebar from '@/components/whatsapp/WhatsAppSidebar';
import SessionView from '@/components/whatsapp/SessionView';
import MessagesView from '@/components/whatsapp/MessagesView';
import MessageLogsView from '@/components/whatsapp/MessageLogsView';
import styles from './whatsapp.module.css';

type ActiveView = 'session' | 'messages' | 'logs';

export default function WhatsAppPage() {
  const [activeView, setActiveView] = useState<ActiveView>('session');

  return (
    <DashboardLayout>
      <div className={styles.layout}>
        <WhatsAppSidebar activeView={activeView} onViewChange={setActiveView} />

        <div className={styles.contentPanel}>
          {activeView === 'session' && <SessionView />}
          {activeView === 'messages' && <MessagesView />}
          {activeView === 'logs' && <MessageLogsView />}
        </div>
      </div>
    </DashboardLayout>
  );
}
