'use client';

import { useState, useEffect } from 'react';
import { getSessions } from '@/app/actions/getSessions';
import { sendMessage } from '@/app/actions/sendMessage';
import Spinner from '@/components/ui/Spinner/Spinner';
import styles from './MessagesView.module.css';

export default function MessagesView() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loadingSessions, setLoadingSessions] = useState(true);

  useEffect(() => {
    getSessions()
      .then((sessions) => {
        const active = sessions.find((s: any) => s.isReady);
        setActiveSessionId(active?.sessionId ?? null);
      })
      .catch(() => setActiveSessionId(null))
      .finally(() => setLoadingSessions(false));
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!phoneNumber.trim() || !message.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!activeSessionId) {
      setError('No tienes una sesión activa');
      return;
    }

    setLoading(true);
    try {
      await sendMessage(activeSessionId, phoneNumber.trim(), message.trim());
      setSuccess('Mensaje enviado correctamente');
      setPhoneNumber('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  const formDisabled = loading || !activeSessionId;

  if (loadingSessions) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <Spinner size="lg" label="Cargando..." />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h2 className={styles.pageTitle}>Enviar Mensaje</h2>

        {!activeSessionId && (
          <div className={styles.warningNotice} role="alert">
            <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No tienes una sesión activa. Ve a la sección <strong>Sesión</strong> para conectar tu cuenta.</p>
          </div>
        )}

        <form onSubmit={handleSendMessage} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="phoneNumber" className={styles.label}>
              Número de Teléfono Destino
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="549111234567"
              className={styles.input}
              disabled={formDisabled}
            />
            <p className={styles.hint}>
              Formato: código de país + código de área + número (sin espacios ni guiones)
            </p>
          </div>

          <div className={styles.field}>
            <label htmlFor="message" className={styles.label}>
              Mensaje
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              rows={6}
              className={styles.textarea}
              disabled={formDisabled}
            />
          </div>

          {error && (
            <div className={styles.errorAlert} role="alert">
              <p className={styles.errorText}>{error}</p>
            </div>
          )}

          {success && (
            <div className={styles.successAlert} role="status">
              <p className={styles.successText}>{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={formDisabled}
            className={styles.submitButton}
          >
            {loading ? (
              <>
                <Spinner size="sm" label="Enviando mensaje..." />
                Enviando...
              </>
            ) : (
              <>
                <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Enviar Mensaje
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
