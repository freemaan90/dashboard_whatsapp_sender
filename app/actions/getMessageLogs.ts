'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.BACKEND_URL;

export interface MessageLog {
  id: string;
  phone: string;
  messageText: string;
  sentAt: string;
  channelType?: 'OFFICIAL' | 'UNOFFICIAL';
  wamid?: string;
}

export async function getMessageLogs(limit = 50): Promise<MessageLog[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get('whatsapp_token')?.value;

  if (!token) {
    throw new Error('No autorizado');
  }

  const res = await fetch(`${API_URL}/whatsapp-sender/messages?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Error al obtener mensajes (${res.status})`);
  }

  return res.json();
}
