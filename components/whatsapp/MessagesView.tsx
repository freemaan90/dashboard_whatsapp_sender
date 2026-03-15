'use client';

import { useState } from 'react';
import Spinner from '@/components/ui/Spinner/Spinner';
import styles from './MessagesView.module.css';

export default function MessagesView() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!phoneNumber.trim() || !message.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implementar envío de mensaje
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Mensaje enviado correctamente');
      setPhoneNumber('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h2 className={styles.pageTitle}>Enviar Mensaje</h2>
        
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
              disabled={loading}
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
              disabled={loading}
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
            disabled={loading}
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

        <div className={styles.infoNotice}>
          <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className={styles.infoContent}>
            <p className={styles.infoTitle}>Nota importante</p>
            <p>Asegúrate de tener una sesión activa antes de enviar mensajes. Ve a la sección &quot;Sesión&quot; para conectar tu cuenta.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
