'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import api from '@/lib/api';
import { deleteSessionById } from '@/app/actions/deleteSessionById';
import { Badge } from '@/components/ui/Badge';
import type { BadgeVariant } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast/ToastContext';
import styles from './SessionCard.module.css';

interface SessionCardProps {
  session: any;
  onUpdate: () => void;
}

const SessionCard = memo(function SessionCard({ session, onUpdate }: SessionCardProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { showToast } = useToast();

  const checkStatus = useCallback(async () => {
    try {
      const response = await api.get(`/whatsapp-sender/status/${session.sessionId}`);
      if (response.data.qrBase64) {
        setQrCode(response.data.qrBase64);
      }
      setErrorCount(0);
      setHasError(false);
    } catch (error) {
      console.error('Error checking status:', error);
      setErrorCount((prev) => {
        const next = prev + 1;
        if (next >= 3) setHasError(true);
        return next;
      });
    }
  }, [session.sessionId]);

  useEffect(() => {
    if (session.channelType !== 'OFFICIAL' && session.isActive && !session.isReady) {
      checkStatus();
      const interval = setInterval(checkStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [session.channelType, session.isActive, session.isReady, checkStatus]);

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      await deleteSessionById(session.sessionId);
      setShowDeleteModal(false);
      showToast('Sesión eliminada correctamente', 'success');
      onUpdate();
    } catch (error: any) {
      showToast(error.message || 'Error al eliminar sesión', 'error');
    } finally {
      setLoading(false);
    }
  }, [session.sessionId, showToast, onUpdate]);

  const handleOpenDeleteModal = useCallback(() => setShowDeleteModal(true), []);
  const handleCloseDeleteModal = useCallback(() => setShowDeleteModal(false), []);

  const badgeVariant: BadgeVariant = hasError
    ? 'error'
    : session.isReady
    ? 'success'
    : session.isActive
    ? 'warning'
    : 'default';

  const badgeLabel = hasError
    ? 'Error'
    : session.isReady
    ? 'Conectado'
    : session.isActive
    ? 'Esperando QR'
    : 'Inactivo';

  const isOfficial = session.channelType === 'OFFICIAL';

  return (
    <>
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.info}>
          <h3 className={styles.phoneNumber}>{session.phoneNumber}</h3>
          <p className={styles.sessionId}>
            {isOfficial ? `ID: ${session.phoneNumberId}` : `ID: ${session.sessionId}`}
          </p>
        </div>
        <div className={styles.actions}>
          <Badge variant={isOfficial ? 'info' : 'default'} size="sm">
            {isOfficial ? 'Oficial' : 'No oficial'}
          </Badge>
          <Badge variant={badgeVariant} size="sm">
            {badgeLabel}
          </Badge>
          <button
            onClick={handleOpenDeleteModal}
            disabled={loading}
            className={styles.deleteButton}
            aria-label="Eliminar sesión"
            title="Eliminar sesión"
          >
            <svg className={styles.deleteIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {qrCode && !session.isReady && (
        <div className={styles.qrWrapper}>
          <div className={styles.qrBox}>
            <img src={qrCode} alt="Código QR para conectar WhatsApp" className={styles.qrImage} />
            <p className={styles.qrCaption}>Escanea este código con tu dispositivo</p>
          </div>
        </div>
      )}

      {session.isReady && (
        <div className={styles.connectedNotice}>
          <p className={styles.connectedText}>
            <svg className={styles.connectedIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Sesión conectada y lista para usar
          </p>
        </div>
      )}

      <div className={styles.footer}>
        <p>Creado: {new Date(session.createdAt).toLocaleString('es-AR')}</p>
      </div>
    </div>

    <Modal
      isOpen={showDeleteModal}
      onClose={handleCloseDeleteModal}
      title="Eliminar sesión"
      size="sm"
    >
      <p>
        ¿Estás seguro de que deseas eliminar la sesión para{' '}
        <strong>{session.phoneNumber}</strong>? Esta acción no se puede deshacer.
      </p>
      <div className={styles.modalFooter}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={handleCloseDeleteModal}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="button"
          className={styles.confirmDeleteButton}
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </Modal>
    </>
  );
});

export default SessionCard;
