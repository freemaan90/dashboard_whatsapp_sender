'use client';

import { useState, useEffect } from 'react';
import { createWhatsappSession } from '@/app/actions/createSessionById';
import { deleteSessionById } from '@/app/actions/deleteSessionById';
import { getSessions } from '@/app/actions/getSessions';
import api from '@/lib/api';
import Spinner from '@/components/ui/Spinner/Spinner';
import styles from './SessionView.module.css';

export default function SessionView() {
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pollingSessionId, setPollingSessionId] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Cargar sesiones al montar
  useEffect(() => {
    loadSessions();
  }, []);

  // Polling para obtener el QR
  useEffect(() => {
    if (!pollingSessionId) return;

    let attempts = 0;
    const MAX_ATTEMPTS = 40;

    const interval = setInterval(async () => {
      attempts++;
      
      try {
        const response = await api.get(`/whatsapp-sender/status/${pollingSessionId}`);
        
        if (response.data.qrBase64) {
          setQrCode(response.data.qrBase64);
          setPollingSessionId(null);
          clearInterval(interval);
        }
        
        // Verificar si ya está autenticado
        if (response.data.isReady) {
          setQrCode(null);
          setPollingSessionId(null);
          setLoading(false);
          loadSessions();
          clearInterval(interval);
        }
        
        if (attempts >= MAX_ATTEMPTS) {
          setError('El QR no estuvo disponible a tiempo');
          setPollingSessionId(null);
          setLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Error checking QR status:', err);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [pollingSessionId]);

  const loadSessions = async () => {
    try {
      const sessions = await getSessions();
      const active = sessions.find((s: any) => s.isReady);
      setActiveSession(active || null);
    } catch (err) {
      console.error('Error loading sessions:', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setQrCode(null);

    if (!sessionId.trim()) {
      setError('Por favor ingresa un número de teléfono');
      return;
    }

    setLoading(true);
    try {
      const result = await createWhatsappSession(sessionId.trim());
      
      if (result.success) {
        setCurrentSessionId(sessionId.trim());
        setPollingSessionId(sessionId.trim());
        setSessionId('');
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear la sesión');
      setLoading(false);
    }
  };

  const handleCloseSession = async () => {
    if (!activeSession) return;

    if (!confirm('¿Estás seguro de cerrar esta sesión?')) return;

    try {
      await deleteSessionById(activeSession.sessionId);
      setActiveSession(null);
      loadSessions();
    } catch (err: any) {
      setError(err.message || 'Error al cerrar la sesión');
    }
  };

  const handleCancelSession = async () => {
    if (!currentSessionId) return;

    if (!confirm('¿Estás seguro de cancelar esta sesión?')) return;

    try {
      await deleteSessionById(currentSessionId);
      setQrCode(null);
      setPollingSessionId(null);
      setCurrentSessionId(null);
      setLoading(false);
      loadSessions();
    } catch (err: any) {
      setError(err.message || 'Error al cancelar la sesión');
    }
  };

  if (loadingSessions) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingContent}>
          <Spinner size="lg" label="Cargando sesiones..." />
          <p className={styles.loadingText}>Cargando...</p>
        </div>
      </div>
    );
  }

  // Si hay sesión activa
  if (activeSession && !loading) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.activeHeader}>
            <div className={styles.activeIconWrapper}>
              <svg className={styles.activeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className={styles.activeTitle}>Sesión Activa</h2>
            <p className={styles.activeSubtitle}>Tu sesión está conectada y lista para usar</p>
          </div>

          <div className={styles.sessionInfo}>
            <div className={styles.sessionInfoRow}>
              <span className={styles.sessionInfoLabel}>Número de teléfono</span>
              <span className={styles.sessionInfoValue}>{activeSession.sessionId}</span>
            </div>
            <div className={styles.sessionInfoRow}>
              <span className={styles.sessionInfoLabel}>Estado</span>
              <span className={styles.statusBadge}>
                <span className={styles.statusDot} aria-hidden="true" />
                Conectado
              </span>
            </div>
          </div>

          <button onClick={handleCloseSession} className={styles.closeButton}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  // Si no hay sesión activa - mostrar formulario
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h2 className={styles.pageTitle}>Crear Nueva Sesión</h2>
        
        <form onSubmit={handleCreateSession} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="sessionId" className={styles.label}>
              Número de Teléfono
            </label>
            <input
              type="text"
              id="sessionId"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="549111234567"
              className={styles.input}
              disabled={loading}
            />
            <p className={styles.hint}>
              Formato: código de país + código de área + número (sin espacios ni guiones)
            </p>
          </div>

          {error && (
            <div className={styles.errorAlert} role="alert">
              <p className={styles.errorText}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Creando...' : 'Crear Sesión'}
          </button>
        </form>

        {loading && !qrCode && (
          <div className={styles.section}>
            <div className={styles.spinnerSection}>
              <Spinner size="lg" label="Generando código QR..." />
              <p className={styles.spinnerLabel}>Generando código QR...</p>
              <p className={styles.spinnerHint}>Esto puede tomar unos segundos</p>
              <button
                onClick={handleCancelSession}
                className={styles.cancelLink}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {qrCode && (
          <div className={styles.section}>
            <div className={styles.qrHeader}>
              <h3 className={styles.qrTitle}>Escanea el código QR</h3>
              <button
                onClick={handleCancelSession}
                className={styles.cancelLink}
              >
                Cancelar
              </button>
            </div>
            <div className={styles.qrWrapper}>
              <div className={styles.qrBox}>
                <img src={qrCode} alt="Código QR para conectar WhatsApp" className={styles.qrImage} />
                <p className={styles.qrCaption}>
                  Abre tu aplicación y escanea este código
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
