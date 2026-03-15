"use client";

/**
 * BrowserWarning
 *
 * Muestra un banner de advertencia cuando el navegador no soporta
 * características esenciales (CSS Custom Properties).
 *
 * Estrategia de detección:
 * - CSS: el banner se oculta por defecto con @supports (color: var(--test))
 *   y solo se muestra si el navegador NO soporta variables CSS.
 * - JS: como refuerzo, se verifica window.CSS.supports en el cliente.
 *
 * Requisitos: 20.9 (mensaje de advertencia), 20.10 (progressive enhancement)
 */

import { useEffect, useState } from "react";
import styles from "./BrowserWarning.module.css";

export function BrowserWarning() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Feature detection: CSS Custom Properties (variables CSS)
    const supportsCustomProps =
      window.CSS && window.CSS.supports && window.CSS.supports("color", "var(--test)");

    if (!supportsCustomProps) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className={styles.banner} role="alert" aria-live="polite">
      <p className={styles.message}>
        <strong>Navegador no compatible:</strong> Tu navegador no soporta algunas
        características modernas. Para la mejor experiencia, usa Chrome 90+,
        Firefox 88+, Safari 14+ o Edge 90+.
      </p>
      <button
        className={styles.dismiss}
        onClick={() => setShow(false)}
        aria-label="Cerrar advertencia"
      >
        ✕
      </button>
    </div>
  );
}
