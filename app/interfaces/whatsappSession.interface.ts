export interface WhatsappSession {
  sessionId: string;
  browser: {
    protocol: string;
  };
  page: {
    _isDragging: boolean;
    _timeoutSettings: Record<string, unknown>;
    _tabId: string;
  };
  qrBase64: string | null; // puede venir null si ya está logueado
  isReady: boolean;
  lastRestart: number;
  RESTART_COOLDOWN: number;
  logger: {
    context: string;
    options: {
      logLevels: string[];
      colors: boolean;
      prefix: string;
    };
    localInstanceRef: {
      options: {
        logLevels: string[];
        colors: boolean;
        prefix: string;
      };
      inspectOptions: {
        depth: number;
        compact: boolean;
        colors: boolean;
      };
      context: string;
      originalContext: string;
    };
  };
}
