'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.BACKEND_URL; // ej: http://localhost:3001

export async function createWhatsappSession(sessionId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('whatsapp_token')?.value;

  if (!token) {
    throw new Error('No autorizado');
  }

  // Crear sesión en el microservicio
  const createRes = await fetch(`${API_URL}/whatsapp-sender/session`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ sessionId }),
    cache: 'no-store',
  });

  if (!createRes.ok) {
    const error = await createRes.json().catch(() => ({}));
    throw new Error(error.message || 'No se pudo crear la sesión de WhatsApp');
  }

  const data = await createRes.json();
  
  return {
    sessionId,
    success: true,
    data,
  };
}
