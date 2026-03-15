/**
 * useCopyToClipboard
 *
 * Hook para copiar texto al portapapeles con notificación Toast automática.
 * Muestra un toast de éxito o error según el resultado de la operación.
 *
 * Requisitos: 19.5, 19.10
 */

'use client';

import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast/ToastContext';

interface UseCopyToClipboardOptions {
  /** Mensaje mostrado en el toast de éxito */
  successMessage?: string;
  /** Mensaje mostrado en el toast de error */
  errorMessage?: string;
}

interface UseCopyToClipboardReturn {
  /** Copia el texto al portapapeles y muestra una notificación */
  copy: (text: string) => Promise<void>;
  /** `true` durante 2 segundos después de una copia exitosa */
  copied: boolean;
}

const DEFAULT_SUCCESS = 'Copiado al portapapeles';
const DEFAULT_ERROR = 'No se pudo copiar al portapapeles';
const COPIED_RESET_DELAY = 2000;

export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {},
): UseCopyToClipboardReturn {
  const { successMessage = DEFAULT_SUCCESS, errorMessage = DEFAULT_ERROR } = options;
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string): Promise<void> => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        showToast(successMessage, 'success');
        setTimeout(() => setCopied(false), COPIED_RESET_DELAY);
      } catch {
        showToast(errorMessage, 'error');
      }
    },
    [successMessage, errorMessage, showToast],
  );

  return { copy, copied };
}

export default useCopyToClipboard;
