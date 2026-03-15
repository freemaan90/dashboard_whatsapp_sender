'use client';

/**
 * QRCodeModal Component
 *
 * Modal dedicado para mostrar el código QR de conexión de WhatsApp.
 * Gestiona los estados: cargando, mostrando QR y error.
 *
 * Requisitos: 7.3, 7.10
 */

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { Button } from '@/components/ui/Button';
import styles from './QRCodeModal.module.css';

export interface QRCodeModalProps {
  /** Controla si el modal está visible */
  isOpen: boolean;
  /** Callback al cerrar/cancelar el modal */
  onClose: () => void;
  /** Código QR en formato base64 o URL; null cuando aún no está disponible */
  qrCode: string | null;
  /** true mientras el QR se está generando */
  loading: boolean;
  /** Mensaje de error, si lo hay */
  error?: string;
  /** ID de la sesión asociada */
  sessionId: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  qrCode,
  loading,
  error,
  sessionId,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Conectar WhatsApp"
      size="sm"
    >
      <div className={styles.content}>
        {/* Estado: cargando — QR aún no disponible */}
        {loading && !qrCode && (
          <div className={styles.loadingState}>
            <Spinner size="lg" label="Generando código QR..." />
            <p className={styles.loadingText}>Generando código QR...</p>
            <p className={styles.loadingHint}>
              Esto puede tomar unos segundos
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancelar
            </Button>
          </div>
        )}

        {/* Estado: QR disponible */}
        {!loading && qrCode && (
          <div className={styles.qrState}>
            <div className={styles.qrWrapper}>
              <img
                src={qrCode}
                alt={`Código QR para conectar WhatsApp — sesión ${sessionId}`}
                className={styles.qrImage}
              />
            </div>
            <p className={styles.qrCaption}>
              Escanea este código con tu dispositivo
            </p>
            <p className={styles.qrHint}>
              Abre WhatsApp → Dispositivos vinculados → Vincular dispositivo
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancelar sesión
            </Button>
          </div>
        )}

        {/* Estado: error */}
        {!loading && !qrCode && error && (
          <div className={styles.errorState}>
            <div className={styles.errorIcon} aria-hidden="true">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className={styles.errorText}>{error}</p>
            <Button
              variant="primary"
              size="sm"
              onClick={onClose}
            >
              Cerrar
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

QRCodeModal.displayName = 'QRCodeModal';

export default QRCodeModal;
