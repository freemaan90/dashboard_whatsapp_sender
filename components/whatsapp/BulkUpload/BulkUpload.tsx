'use client';

import { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { parseExcelPhones, interpolateMessage } from '@/lib/parseExcelPhones';
import { normalizeArgPhone } from '@/lib/validatePhone';
import { sendMessage } from '@/app/actions/sendMessage';
import styles from './BulkUpload.module.css';

export type BulkSendState = 'idle' | 'sending' | 'done';

interface BulkUploadProps {
  onPhonesLoaded: (phones: string[]) => void;
  disabled?: boolean;
  sessionId: string | null;
  message: string;
  /** Llamado cada vez que cambia el estado de envío */
  onStatusChange?: (state: { status: BulkSendState; sent: number; failed: number; total: number; hasValid: boolean }) => void;
  /** El padre puede disparar el envío pasando una función de registro */
  registerSend?: (fn: () => void) => void;
}

export function BulkUpload({ onPhonesLoaded, disabled, sessionId, message, onStatusChange, registerSend }: BulkUploadProps) {
  const [validPhones, setValidPhones] = useState<string[]>([]);
  const [invalidPhones, setInvalidPhones] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [sendStatus, setSendStatus] = useState<BulkSendState>('idle');
  const [sent, setSent] = useState(0);
  const [failed, setFailed] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  // Ref para acceder al estado más reciente dentro de handleBulkSend
  const validPhonesRef = useRef<Array<{ phone: string; fields: Record<string, string> }>>([]);

  async function processFile(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls') {
      setError('Formato de archivo no compatible. Solo se aceptan archivos .xlsx o .xls.');
      setFileName('');
      setValidPhones([]);
      validPhonesRef.current = [];
      setInvalidPhones([]);
      onPhonesLoaded([]);
      onStatusChange?.({ status: 'idle', sent: 0, failed: 0, total: 0, hasValid: false });
      return;
    }

    setError('');
    setFileName(file.name);

    try {
      const { rows } = await parseExcelPhones(file);

      if (rows.length === 0) {
        setError('No se encontraron números en la primera columna del archivo.');
        setValidPhones([]);
        validPhonesRef.current = [];
        setInvalidPhones([]);
        onPhonesLoaded([]);
        onStatusChange?.({ status: 'idle', sent: 0, failed: 0, total: 0, hasValid: false });
        return;
      }

      const valid: string[] = [];
      const invalid: string[] = [];
      const validRows: Array<{ phone: string; fields: Record<string, string> }> = [];

      for (const row of rows) {
        const val = row.fields['telefono'] ?? '';
        const normalized = normalizeArgPhone(val);
        if (normalized) {
          valid.push(normalized);        // keep for UI state (string[])
          validRows.push({ phone: normalized, fields: row.fields });
        } else {
          invalid.push(val);
        }
      }

      setValidPhones(valid);
      validPhonesRef.current = validRows;
      setInvalidPhones(invalid);
      onPhonesLoaded(valid);
      onStatusChange?.({ status: 'idle', sent: 0, failed: 0, total: valid.length, hasValid: valid.length > 0 });

      if (valid.length === 0) {
        setError('Todos los números son inválidos. Corrija el archivo antes de continuar.');
      }
    } catch {
      setError('Error al leer el archivo. Verifique que sea un Excel válido.');
      setValidPhones([]);
      validPhonesRef.current = [];
      setInvalidPhones([]);
      onPhonesLoaded([]);
      onStatusChange?.({ status: 'idle', sent: 0, failed: 0, total: 0, hasValid: false });
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  async function handleBulkSend() {
    const rows = validPhonesRef.current;
    if (!sessionId) {
      setError('No hay sesión activa. Ve a la sección Sesión para conectar tu cuenta.');
      return;
    }
    if (!message.trim()) {
      setError('Escribe un mensaje antes de enviar.');
      return;
    }
    if (rows.length === 0) return;

    setSendStatus('sending');
    setSent(0);
    setFailed(0);
    setError('');
    onStatusChange?.({ status: 'sending', sent: 0, failed: 0, total: rows.length, hasValid: true });

    let sentCount = 0;
    let failedCount = 0;

    for (const row of rows) {
      try {
        const interpolated = interpolateMessage(message, row.fields);
        await sendMessage(sessionId, row.phone, interpolated);
        sentCount++;
        setSent(sentCount);
      } catch {
        failedCount++;
        setFailed(failedCount);
      }
      onStatusChange?.({ status: 'sending', sent: sentCount, failed: failedCount, total: rows.length, hasValid: true });
    }

    setSendStatus('done');
    onStatusChange?.({ status: 'done', sent: sentCount, failed: failedCount, total: rows.length, hasValid: true });
  }

  // Registrar la función de envío en el padre
  registerSend?.(handleBulkSend);

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Envío masivo</span>
        <span className={styles.sectionHint}>Cargá un archivo Excel (.xlsx / .xls) con los números en la primera columna</span>
      </div>

      {/* Drop zone */}
      <div
        className={`${styles.dropZone} ${isDragOver ? styles.dropZoneActive : ''}`}
        onClick={() => !disabled && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
        aria-label="Cargar archivo Excel con números de teléfono"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          disabled={disabled}
          style={{ display: 'none' }}
        />

        {fileName ? (
          <>
            <FileSpreadsheet className={styles.fileIcon} size={24} />
            <span className={styles.fileName}>{fileName}</span>
          </>
        ) : (
          <>
            <Upload className={styles.fileIcon} size={24} />
            <span>Arrastra un archivo .xlsx / .xls o haz clic para seleccionar</span>
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className={styles.errorText}>
          <AlertCircle size={14} style={{ display: 'inline', marginRight: 4 }} />
          {error}
        </p>
      )}

      {/* Stats */}
      {(validPhones.length > 0 || invalidPhones.length > 0) && (
        <div className={styles.stats}>
          <span className={styles.validCount}>
            <CheckCircle2 size={14} style={{ display: 'inline', marginRight: 4 }} />
            {validPhones.length} válidos
          </span>
          {invalidPhones.length > 0 && (
            <span className={styles.invalidCount}>
              <AlertCircle size={14} style={{ display: 'inline', marginRight: 4 }} />
              {invalidPhones.length} inválidos
            </span>
          )}
        </div>
      )}

      {/* Invalid list */}
      {invalidPhones.length > 0 && (
        <ul className={styles.invalidList}>
          {invalidPhones.map((phone, i) => (
            <li key={i}>{phone}</li>
          ))}
        </ul>
      )}

      {/* Progress during sending */}
      {sendStatus === 'sending' && (
        <p className={styles.progress}>
          Enviando... {sent} / {validPhones.length}
        </p>
      )}

      {/* Summary after done */}
      {sendStatus === 'done' && (
        <div className={styles.summary}>
          <span>Envío completado: {sent} enviados, {failed} fallidos</span>
          <button
            className={styles.resetButton}
            onClick={() => {
              setSendStatus('idle');
              setSent(0);
              setFailed(0);
              onStatusChange?.({ status: 'idle', sent: 0, failed: 0, total: validPhones.length, hasValid: validPhones.length > 0 });
            }}
          >
            Nuevo envío
          </button>
        </div>
      )}
    </div>
  );
}
