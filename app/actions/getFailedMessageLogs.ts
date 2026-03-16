'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.BACKEND_URL;

export interface FailedMessageLog {
  id: string;
  phone: string;
  messageText: string;
  failureReason: string;
  failedAt: string;
  channelType?: 'OFFICIAL' | 'UNOFFICIAL';
}

export async function getFailedMessageLogs(limit = 50): Promise<FailedMessageLog[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get('whatsapp_token')?.value;

  if (!token) {
    throw new Error('No autorizado');
  }

  const res = await fetch(`${API_URL}/whatsapp-sender/messages/failed?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Error al obtener mensajes fallidos (${res.status})`);
  }

  return res.json();
}
