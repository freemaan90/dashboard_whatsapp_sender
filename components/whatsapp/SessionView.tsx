'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [pendingSession, setPendingSession] = useState<any>(null); // sesión en DB pero no lista aún
  const [loadingSessions, setLoadingSessions] = useState(true);

  const loadSessions = useCallback(async () => {
    try {
      const sessions = await getSessions();
      const active = sessions.find((s: any) => s.isReady);
      const pending = !active ? sessions.find((s: any) => s.isActive && !s.isReady) : null;
      setActiveSession(active || null);
      setPendingSession(pending || null);
    } catch (err) {
      console.error('Error loading sessions:', err);
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  // Cargar sesiones al montar — reintenta si viene vacío (microservicio puede estar inicializando)
  useEffect(() => {
    let cancelled = false;

    const tryLoad = async (attemptsLeft: number) => {
      if (cancelled) return;
      await loadSessions();
      if (cancelled || attemptsLeft <= 0) return;
      // Si no hay sesión activa, reintentar en 2s (el microservicio puede estar arrancando)
      setTimeout(() => tryLoad(attemptsLeft - 1), 2000);
    };

    tryLoad(2); // hasta 3 intentos en total
    return () => { cancelled = true; };
  }, [loadSessions]);

  // Polling para sesión pendiente (existe en DB pero microservicio aún inicializando)
  useEffect(() => {
    if (!pendingSession || pollingSessionId) return;

    let attempts = 0;
    const MAX_ATTEMPTS = 240; // 2 minutos (240 * 500ms)

    const interval = setInterval(async () => {
      attempts++;
      try {
        const response = await api.get(`/whatsapp-sender/status/${pendingSession.sessionId}`);

        if (response.data?.isReady) {
          clearInterval(interval);
          setPendingSession(null);
          loadSessions();
          return;
        }

        if (response.data?.qrBase64) {
          clearInterval(interval);
          setPendingSession(null);
          setCurrentSessionId(pendingSession.sessionId);
          setPollingSessionId(pendingSession.sessionId);
          setLoading(true);
          setQrCode(response.data.qrBase64);
          return;
        }
      } catch {
        // silencioso
      }

      if (attempts >= MAX_ATTEMPTS) {
        clearInterval(interval);
        setPendingSession(null);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [pendingSession, pollingSessionId, loadSessions]);

  // Polling para obtener el QR (sesión nueva)
  useEffect(() => {
    if (!pollingSessionId) return;

    let attempts = 0;
    const MAX_ATTEMPTS = 240; // 2 minutos (240 * 500ms)

    const interval = setInterval(async () => {
      attempts++;
      
      try {
        const response = await api.get(`/whatsapp-sender/status/${pollingSessionId}`);
        
        console.log(`[POLLING] attempt=${attempts} sessionId=${pollingSessionId} isReady=${response.data?.isReady}`);

        if (response.data.qrBase64 && !qrCode) {
          setQrCode(response.data.qrBase64);
          // NO detener el polling — seguir verificando hasta que isReady sea true
        }
        
        // Verificar si ya está autenticado
        if (response.data.isReady) {
          setQrCode(null);
          setPollingSessionId(null);
          setLoading(false);
          await new Promise((r) => setTimeout(r, 500));
          loadSessions();
          clearInterval(interval);
        }
        
        if (attempts >= MAX_ATTEMPTS) {
          try {
            const finalCheck = await api.get(`/whatsapp-sender/status/${pollingSessionId}`);
            if (finalCheck.data.isReady) {
              setQrCode(null);
              setPollingSessionId(null);
              setLoading(false);
              loadSessions();
              clearInterval(interval);
              return;
            }
          } catch {}
          setError('Tiempo de espera agotado. Intentá escanear el QR de nuevo.');
          setPollingSessionId(null);
          setLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Error checking QR status:', err);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [pollingSessionId, loadSessions]);

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

  // Sesión en DB pero microservicio aún inicializando
  if (pendingSession && !loading) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.spinnerSection}>
            <Spinner size="lg" label="Recuperando sesión..." />
            <p className={styles.spinnerLabel}>Recuperando sesión activa...</p>
            <p className={styles.spinnerHint}>
              Se detectó una sesión para <strong>{pendingSession.sessionId}</strong>. Conectando con WhatsApp...
            </p>
          </div>
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

        <div className={styles.refreshSection}>
          <p className={styles.refreshHint}>¿Ya tenés una sesión activa en tu celular?</p>
          <button
            type="button"
            onClick={() => { setLoadingSessions(true); loadSessions(); }}
            className={styles.refreshButton}
          >
            Verificar estado
          </button>
        </div>

        {loading && !qrCode && (
          <div className={styles.section}>
            <div className={styles.spinnerSection}>
              <Spinner size="lg" label="Conectando sesión..." />
              <p className={styles.spinnerLabel}>Conectando sesión...</p>
              <p className={styles.spinnerHint}>Si ya tenías una sesión activa en tu celular, esto puede tardar unos segundos</p>
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
