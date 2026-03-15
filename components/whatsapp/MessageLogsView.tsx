'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMessageLogs, type MessageLog } from '@/app/actions/getMessageLogs';
import { getFailedMessageLogs, type FailedMessageLog } from '@/app/actions/getFailedMessageLogs';
import Spinner from '@/components/ui/Spinner/Spinner';
import styles from './MessageLogsView.module.css';

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export default function MessageLogsView() {
  const [sentMessages, setSentMessages] = useState<MessageLog[]>([]);
  const [failedMessages, setFailedMessages] = useState<FailedMessageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [sent, failed] = await Promise.all([
        getMessageLogs(),
        getFailedMessageLogs(),
      ]);
      setSentMessages(sent);
      setFailedMessages(failed);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los registros');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrapper}>
          <Spinner size="lg" label="Cargando registros..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.errorAlert} role="alert">
            <p className={styles.errorText}>{error}</p>
            <button onClick={loadLogs} className={styles.retryButton} type="button">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h2 className={styles.pageTitle}>Registro de Mensajes</h2>

        {/* Sección Enviados */}
        <section className={styles.section} aria-labelledby="sent-heading">
          <h3 id="sent-heading" className={styles.sectionTitle}>
            <svg className={styles.sectionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Enviados
            <span className={styles.badge}>{sentMessages.length}</span>
          </h3>

          {sentMessages.length === 0 ? (
            <p className={styles.emptyState}>No hay mensajes enviados aún</p>
          ) : (
            <ul className={styles.logList} aria-label="Mensajes enviados">
              {sentMessages.map((msg) => (
                <li key={msg.id} className={styles.logItem}>
                  <div className={styles.logHeader}>
                    <span className={styles.phone}>{msg.phone}</span>
                    <time className={styles.date} dateTime={msg.sentAt}>
                      {formatDate(msg.sentAt)}
                    </time>
                  </div>
                  <p className={styles.messageText}>{msg.messageText}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Sección Fallidos */}
        <section className={styles.section} aria-labelledby="failed-heading">
          <h3 id="failed-heading" className={styles.sectionTitle}>
            <svg className={styles.sectionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Fallidos
            <span className={`${styles.badge} ${styles['badge--error']}`}>{failedMessages.length}</span>
          </h3>

          {failedMessages.length === 0 ? (
            <p className={styles.emptyState}>No hay mensajes fallidos</p>
          ) : (
            <ul className={styles.logList} aria-label="Mensajes fallidos">
              {failedMessages.map((msg) => (
                <li key={msg.id} className={`${styles.logItem} ${styles['logItem--failed']}`}>
                  <div className={styles.logHeader}>
                    <span className={styles.phone}>{msg.phone}</span>
                    <time className={styles.date} dateTime={msg.failedAt}>
                      {formatDate(msg.failedAt)}
                    </time>
                  </div>
                  <p className={styles.messageText}>{msg.messageText}</p>
                  <p className={styles.failureReason}>
                    <span className={styles.failureLabel}>Motivo: </span>
                    {msg.failureReason}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
