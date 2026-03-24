'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { startMetaOnboarding } from '@/app/actions/startMetaOnboarding';
import { getMetaOnboardingStatus, OnboardingStatusResponse } from '@/app/actions/getMetaOnboardingStatus';
import { selectMetaWaba } from '@/app/actions/selectMetaWaba';
import { selectMetaPhone } from '@/app/actions/selectMetaPhone';
import { cancelMetaOnboarding } from '@/app/actions/cancelMetaOnboarding';
import Spinner from '@/components/ui/Spinner/Spinner';
import styles from './MetaOnboardingFlow.module.css';

interface MetaOnboardingFlowProps {
  onCompleted?: (whatsappSessionId: string) => void;
}

type FlowStep =
  | 'idle'
  | 'redirecting'
  | 'waiting_callback'
  | 'waba_selection'
  | 'phone_selection'
  | 'completed'
  | 'error';

export default function MetaOnboardingFlow({ onCompleted }: MetaOnboardingFlowProps) {
  const [step, setStep] = useState<FlowStep>('idle');
  const [error, setError] = useState('');
  const [statusData, setStatusData] = useState<OnboardingStatusResponse | null>(null);
  const [selectedWaba, setSelectedWaba] = useState('');
  const [selectedPhone, setSelectedPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    let attempts = 0;
    const MAX = 120; // 2 minutos a 1s por intento

    pollingRef.current = setInterval(async () => {
      attempts++;
      try {
        const data = await getMetaOnboardingStatus();
        if (!data) {
          stopPolling();
          setStep('idle');
          return;
        }

        setStatusData(data);

        if (data.status === 'waba_selection_required') {
          stopPolling();
          setStep('waba_selection');
        } else if (data.status === 'phone_selection_required') {
          stopPolling();
          setStep('phone_selection');
        } else if (data.status === 'completed') {
          stopPolling();
          setStep('completed');
          onCompleted?.(data.whatsappSessionId ?? '');
        } else if (data.status === 'failed') {
          stopPolling();
          setError('El proceso de autenticación falló. Intentá de nuevo.');
          setStep('error');
        } else if (data.status === 'cancelled') {
          stopPolling();
          setStep('idle');
        }
      } catch {
        // silencioso — seguir intentando
      }

      if (attempts >= MAX) {
        stopPolling();
        setError('Tiempo de espera agotado. Intentá de nuevo.');
        setStep('error');
      }
    }, 1000);
  }, [stopPolling, onCompleted]);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const handleStart = async () => {
    setError('');
    setStep('redirecting');
    try {
      const { authorizationUrl } = await startMetaOnboarding();
      setStep('waiting_callback');
      startPolling();
      // Abrir Meta OAuth en nueva pestaña para no perder el estado del dashboard
      window.open(authorizationUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar el flujo con Meta');
      setStep('error');
    }
  };

  const handleSelectWaba = async () => {
    if (!selectedWaba) return;
    setSubmitting(true);
    try {
      await selectMetaWaba(selectedWaba);
      setStep('waiting_callback');
      startPolling();
    } catch (err: any) {
      setError(err.message || 'Error al seleccionar la cuenta WABA');
      setStep('error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectPhone = async () => {
    if (!selectedPhone) return;
    setSubmitting(true);
    try {
      await selectMetaPhone(selectedPhone);
      setStep('waiting_callback');
      startPolling();
    } catch (err: any) {
      setError(err.message || 'Error al seleccionar el número de teléfono');
      setStep('error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    stopPolling();
    try {
      await cancelMetaOnboarding();
    } catch {
      // ignorar error al cancelar
    }
    setStep('idle');
    setError('');
    setStatusData(null);
    setSelectedWaba('');
    setSelectedPhone('');
  };

  // ── Idle: botón inicial ──────────────────────────────────────────────────
  if (step === 'idle') {
    return (
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.metaIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 7.5c.828 0 1.5.672 1.5 1.5v3c0 .828-.672 1.5-1.5 1.5H7.5C6.672 15.5 6 14.828 6 14v-3c0-.828.672-1.5 1.5-1.5h9z" />
            </svg>
          </div>
          <div>
            <h3 className={styles.title}>Conectar con Meta</h3>
            <p className={styles.description}>
              Vinculá tu cuenta de WhatsApp Business directamente desde Meta. No necesitás ingresar credenciales manualmente.
            </p>
          </div>
        </div>
        <button onClick={handleStart} className={styles.primaryButton}>
          Conectar con Meta
        </button>
      </div>
    );
  }

  // ── Redirecting ──────────────────────────────────────────────────────────
  if (step === 'redirecting') {
    return (
      <div className={styles.panel}>
        <div className={styles.spinnerSection}>
          <Spinner size="md" label="Preparando autenticación..." />
          <p className={styles.spinnerLabel}>Preparando autenticación con Meta...</p>
        </div>
      </div>
    );
  }

  // ── Waiting for OAuth callback ───────────────────────────────────────────
  if (step === 'waiting_callback') {
    return (
      <div className={styles.panel}>
        <div className={styles.spinnerSection}>
          <Spinner size="md" label="Esperando autorización..." />
          <p className={styles.spinnerLabel}>Esperando que completes la autorización en Meta...</p>
          <p className={styles.spinnerHint}>
            Se abrió una nueva pestaña con el formulario de Meta. Completá el proceso allí y volvé aquí.
          </p>
          <button onClick={handleCancel} className={styles.cancelLink}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  // ── WABA selection ───────────────────────────────────────────────────────
  if (step === 'waba_selection') {
    const wabas = statusData?.availableWabas ?? [];
    return (
      <div className={styles.panel}>
        <h3 className={styles.title}>Seleccioná tu cuenta WABA</h3>
        <p className={styles.description}>
          Se encontraron múltiples cuentas de WhatsApp Business. Elegí la que querés conectar.
        </p>
        <div className={styles.optionList} role="radiogroup" aria-label="Cuentas WABA disponibles">
          {wabas.map((waba) => (
            <label key={waba.id} className={`${styles.optionItem} ${selectedWaba === waba.id ? styles.optionSelected : ''}`}>
              <input
                type="radio"
                name="waba"
                value={waba.id}
                checked={selectedWaba === waba.id}
                onChange={() => setSelectedWaba(waba.id)}
                className={styles.radioInput}
              />
              <span className={styles.optionLabel}>{waba.name}</span>
              <span className={styles.optionId}>{waba.id}</span>
            </label>
          ))}
        </div>
        <div className={styles.actions}>
          <button
            onClick={handleSelectWaba}
            disabled={!selectedWaba || submitting}
            className={styles.primaryButton}
          >
            {submitting ? 'Confirmando...' : 'Confirmar'}
          </button>
          <button onClick={handleCancel} className={styles.secondaryButton}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  // ── Phone selection ──────────────────────────────────────────────────────
  if (step === 'phone_selection') {
    const phones = statusData?.availablePhones ?? [];
    return (
      <div className={styles.panel}>
        <h3 className={styles.title}>Seleccioná el número de teléfono</h3>
        <p className={styles.description}>
          Se encontraron múltiples números en tu cuenta. Elegí el que querés usar.
        </p>
        <div className={styles.optionList} role="radiogroup" aria-label="Números de teléfono disponibles">
          {phones.map((phone) => (
            <label key={phone.id} className={`${styles.optionItem} ${selectedPhone === phone.id ? styles.optionSelected : ''}`}>
              <input
                type="radio"
                name="phone"
                value={phone.id}
                checked={selectedPhone === phone.id}
                onChange={() => setSelectedPhone(phone.id)}
                className={styles.radioInput}
              />
              <span className={styles.optionLabel}>{phone.displayPhoneNumber}</span>
              <span className={styles.optionId}>{phone.id}</span>
            </label>
          ))}
        </div>
        <div className={styles.actions}>
          <button
            onClick={handleSelectPhone}
            disabled={!selectedPhone || submitting}
            className={styles.primaryButton}
          >
            {submitting ? 'Confirmando...' : 'Confirmar'}
          </button>
          <button onClick={handleCancel} className={styles.secondaryButton}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  // ── Completed ────────────────────────────────────────────────────────────
  if (step === 'completed') {
    return (
      <div className={styles.panel}>
        <div className={styles.successSection}>
          <div className={styles.successIcon} aria-hidden="true">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className={styles.successTitle}>¡Cuenta conectada!</h3>
          <p className={styles.description}>
            Tu cuenta de WhatsApp Business fue vinculada correctamente con Meta.
          </p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.panel}>
      <div className={styles.errorSection}>
        <p className={styles.errorText}>{error || 'Ocurrió un error inesperado.'}</p>
        <button onClick={handleCancel} className={styles.primaryButton}>
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
