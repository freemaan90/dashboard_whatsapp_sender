export type ChannelType = 'OFFICIAL' | 'UNOFFICIAL';

export interface WhatsappSession {
  id?: string;
  sessionId?: string;
  phoneNumber?: string;
  channelType?: ChannelType;
  phoneNumberId?: string;
  wabaId?: string;
  isActive?: boolean;
  isReady?: boolean;
  createdAt?: string;
  // Campos legacy del microservicio unofficial
  browser?: {
    protocol: string;
  };
  page?: {
    _isDragging: boolean;
    _timeoutSettings: Record<string, unknown>;
    _tabId: string;
  };
  qrBase64?: string | null;
  lastRestart?: number;
  RESTART_COOLDOWN?: number;
  logger?: Record<string, unknown>;
}
