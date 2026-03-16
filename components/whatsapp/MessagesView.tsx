'use client';

import { useState, useEffect, useRef } from 'react';
import { getSessions } from '@/app/actions/getSessions';
import { sendMessage } from '@/app/actions/sendMessage';
import { sendOfficialMessage } from '@/app/actions/sendOfficialMessage';
import Spinner from '@/components/ui/Spinner/Spinner';
import TemplatesPanel from '@/components/whatsapp/TemplatesPanel/TemplatesPanel';
import { BulkUpload } from '@/components/whatsapp/BulkUpload/BulkUpload';
import { CSVBulkUpload } from '@/components/whatsapp/CSVBulkUpload/CSVBulkUpload';
import styles from './MessagesView.module.css';

type ChannelType = 'UNOFFICIAL' | 'OFFICIAL';
type InputMode = 'manual' | 'bulk';

interface Session {
  sessionId?: string;
  id?: string;
  phoneNumber?: string;
  channelType?: ChannelType;
  isReady?: boolean;
}

export default function MessagesView() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingSessions, setLoadingSessions] = useState(true);

  const [channel, setChannel] = useState<ChannelType>('UNOFFICIAL');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const [inputMode, setInputMode] = useState<InputMode>('manual');
  const [hsmMode, setHsmMode] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [languageCode, setLanguageCode] = useState('es');
  const [templateComponentsRaw, setTemplateComponentsRaw] = useState('[]');
  const [templateComponentsError, setTemplateComponentsError] = useState('');

  const [bulkCanSend, setBulkCanSend] = useState(false);
  const [bulkSending, setBulkSending] = useState(false);
  const bulkSendFnRef = useRef<(() => void) | null>(null);
  const [csvBulkCanSend, setCsvBulkCanSend] = useState(false);
  const [csvBulkSending, setCsvBulkSending] = useState(false);
  const csvBulkSendFnRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    getSessions()
      .then((data: Session[]) => {
        setSessions(data);
        // Auto-select first ready session matching current channel
        const active = data.find(
          (s) => s.isReady && (s.channelType ?? 'UNOFFICIAL') === channel,
        );
        setSelectedSessionId(active?.sessionId ?? active?.id ?? null);
      })
      .catch(() => setSessions([]))
      .finally(() => setLoadingSessions(false));
  }, []);

  // Re-select session when channel changes
  useEffect(() => {
    const active = sessions.find(
      (s) => s.isReady && (s.channelType ?? 'UNOFFICIAL') === channel,
    );
    setSelectedSessionId(active?.sessionId ?? active?.id ?? null);
  }, [channel, sessions]);

  const filteredSessions = sessions.filter(
    (s) => s.isReady && (s.channelType ?? 'UNOFFICIAL') === channel,
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!phoneNumber.trim()) {
      setError('Por favor ingresa el número de teléfono');
      return;
    }
    if (!selectedSessionId) {
      setError('No tienes una sesión activa para este canal');
      return;
    }

    if (channel === 'OFFICIAL' && hsmMode) {
      if (!templateName.trim()) {
        setError('Ingresa el nombre del template');
        return;
      }
      if (!languageCode.trim()) {
        setError('Ingresa el código de idioma');
        return;
      }
      let parsedComponents: unknown[] = [];
      try {
        parsedComponents = JSON.parse(templateComponentsRaw);
        setTemplateComponentsError('');
      } catch {
        setTemplateComponentsError('JSON inválido en templateComponents');
        return;
      }
      setLoading(true);
      try {
        await sendOfficialMessage({
          sessionId: selectedSessionId,
          phone: phoneNumber.trim(),
          templateName: templateName.trim(),
          languageCode: languageCode.trim(),
          templateComponents: parsedComponents as any,
        });
        setSuccess('Template enviado correctamente');
        setPhoneNumber('');
      } catch (err: any) {
        setError(err.message || 'Error al enviar el template');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!message.trim()) {
      setError('Por favor escribe un mensaje');
      return;
    }

    setLoading(true);
    try {
      if (channel === 'OFFICIAL') {
        await sendOfficialMessage({
          sessionId: selectedSessionId,
          phone: phoneNumber.trim(),
          message: message.trim(),
        });
      } else {
        await sendMessage(selectedSessionId, phoneNumber.trim(), message.trim());
      }
      setSuccess('Mensaje enviado correctamente');
      setPhoneNumber('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  const formDisabled = loading || !selectedSessionId;

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

        {/* Selector de canal */}
        <div className={styles.channelToggle} role="group" aria-label="Canal de envío">
          <button
            type="button"
            className={`${styles.channelButton} ${channel === 'UNOFFICIAL' ? styles.channelButtonActive : ''}`}
            onClick={() => setChannel('UNOFFICIAL')}
          >
            No oficial
          </button>
          <button
            type="button"
            className={`${styles.channelButton} ${channel === 'OFFICIAL' ? styles.channelButtonActive : ''}`}
            onClick={() => setChannel('OFFICIAL')}
          >
            Oficial (Meta)
          </button>
        </div>

        {/* Selector de sesión */}
        {filteredSessions.length > 0 ? (
          <div className={styles.field}>
            <label htmlFor="sessionSelect" className={styles.label}>
              Sesión activa
            </label>
            <select
              id="sessionSelect"
              className={styles.select}
              value={selectedSessionId ?? ''}
              onChange={(e) => setSelectedSessionId(e.target.value || null)}
            >
              {filteredSessions.map((s) => {
                const id = s.sessionId ?? s.id ?? '';
                return (
                  <option key={id} value={id}>
                    {s.phoneNumber ?? id}
                  </option>
                );
              })}
            </select>
          </div>
        ) : (
          <div className={styles.warningNotice} role="alert">
            <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              No tienes una sesión <strong>{channel === 'OFFICIAL' ? 'oficial' : 'no oficial'}</strong> activa.
              Ve a la sección <strong>Sesión</strong> para conectar tu cuenta.
            </p>
          </div>
        )}

        {channel === 'UNOFFICIAL' && (
          <TemplatesPanel onSelect={(content) => setMessage(content)} />
        )}

        <hr className={styles.divider} />

        <form onSubmit={handleSendMessage} className={styles.form}>
          {/* Toggle manual / masivo */}
          <div className={styles.modeToggle}>
            <button
              type="button"
              className={`${styles.modeButton} ${inputMode === 'manual' ? styles.modeButtonActive : ''}`}
              onClick={() => setInputMode('manual')}
            >
              Manual
            </button>
            <button
              type="button"
              className={`${styles.modeButton} ${inputMode === 'bulk' ? styles.modeButtonActive : ''}`}
              onClick={() => setInputMode('bulk')}
            >
              Envío masivo
            </button>
          </div>

          {inputMode === 'manual' ? (
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
          ) : (
            <>
              <BulkUpload
                sessionId={selectedSessionId}
                message={message}
                onPhonesLoaded={() => {}}
                onStatusChange={({ status, hasValid }) => {
                  setBulkCanSend(hasValid && status === 'idle');
                  setBulkSending(status === 'sending');
                }}
                registerSend={(fn) => { bulkSendFnRef.current = fn; }}
                disabled={csvBulkSending}
              />
              <CSVBulkUpload
                sessionId={selectedSessionId}
                message={message}
                onPhonesLoaded={() => {}}
                onStatusChange={({ status, hasValid }) => {
                  setCsvBulkCanSend(hasValid && status === 'idle');
                  setCsvBulkSending(status === 'sending');
                }}
                registerSend={(fn) => { csvBulkSendFnRef.current = fn; }}
                disabled={bulkSending}
              />
            </>
          )}

          {/* Modo HSM (solo canal oficial, modo manual) */}
          {channel === 'OFFICIAL' && inputMode === 'manual' && (
            <div className={styles.field}>
              <label className={styles.hsmToggleLabel}>
                <input
                  type="checkbox"
                  checked={hsmMode}
                  onChange={(e) => setHsmMode(e.target.checked)}
                  className={styles.hsmCheckbox}
                />
                Enviar como template HSM
              </label>
            </div>
          )}

          {/* Campos de template HSM */}
          {channel === 'OFFICIAL' && hsmMode && inputMode === 'manual' ? (
            <>
              <div className={styles.field}>
                <label htmlFor="templateName" className={styles.label}>
                  Nombre del template
                </label>
                <input
                  type="text"
                  id="templateName"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="hello_world"
                  className={styles.input}
                  disabled={formDisabled}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="languageCode" className={styles.label}>
                  Código de idioma
                </label>
                <input
                  type="text"
                  id="languageCode"
                  value={languageCode}
                  onChange={(e) => setLanguageCode(e.target.value)}
                  placeholder="es"
                  className={styles.input}
                  disabled={formDisabled}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="templateComponents" className={styles.label}>
                  Template Components (JSON)
                </label>
                <textarea
                  id="templateComponents"
                  value={templateComponentsRaw}
                  onChange={(e) => {
                    setTemplateComponentsRaw(e.target.value);
                    setTemplateComponentsError('');
                  }}
                  rows={4}
                  className={styles.textarea}
                  disabled={formDisabled}
                  placeholder='[{"type":"body","parameters":[{"type":"text","text":"valor"}]}]'
                />
                {templateComponentsError && (
                  <p className={styles.fieldError}>{templateComponentsError}</p>
                )}
              </div>
            </>
          ) : (
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
          )}

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

          {inputMode === 'manual' ? (
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
                  {channel === 'OFFICIAL' && hsmMode ? 'Enviar Template' : 'Enviar Mensaje'}
                </>
              )}
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={!bulkCanSend || bulkSending || csvBulkSending || !message.trim() || !selectedSessionId}
                className={styles.submitButton}
                onClick={() => bulkSendFnRef.current?.()}
              >
                {bulkSending ? (
                  <>
                    <Spinner size="sm" label="Enviando mensajes..." />
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Comenzar (Excel)
                  </>
                )}
              </button>
              <button
                type="button"
                disabled={!csvBulkCanSend || csvBulkSending || bulkSending || !message.trim() || !selectedSessionId}
                className={styles.submitButton}
                onClick={() => csvBulkSendFnRef.current?.()}
              >
                {csvBulkSending ? (
                  <>
                    <Spinner size="sm" label="Enviando mensajes..." />
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Comenzar (CSV)
                  </>
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
