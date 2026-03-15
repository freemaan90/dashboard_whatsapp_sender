'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.BACKEND_URL;

export async function deleteSessionById(sessionId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('whatsapp_token')?.value;

  if (!token) {
    throw new Error('No autorizado');
  }

  const deleteResp = await fetch(`${API_URL}/whatsapp-sender/session`, {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ sessionId }),
    cache: 'no-store',
  });

  if (!deleteResp.ok) {
    const error = await deleteResp.json().catch(() => ({}));
    throw new Error(error.message || 'No se pudo borrar la sesión de WhatsApp');
  }

  // 👇 Esto sí es serializable
  const json = await deleteResp.json();

  return json;
}
