'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.BACKEND_URL;

export async function sendMessage(
  sessionId: string,
  phone: string,
  message: string
): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  const token = cookieStore.get('whatsapp_token')?.value;

  if (!token) {
    throw new Error('No autorizado');
  }

  const res = await fetch(`${API_URL}/whatsapp-sender/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ sessionId, phone, message }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    if (res.status === 400) {
      throw new Error(error.message || 'La sesión no está lista para enviar mensajes');
    }
    if (res.status === 503) {
      throw new Error('Servicio no disponible, intenta más tarde');
    }
    throw new Error(error.message || `Error al enviar el mensaje (${res.status})`);
  }

  return res.json();
}
