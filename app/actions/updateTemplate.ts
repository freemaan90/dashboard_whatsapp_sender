'use server';

import { cookies } from 'next/headers';
import { MessageTemplate } from '../interfaces/messageTemplate.interface';

const API_URL = process.env.BACKEND_URL;

export async function updateTemplate(
  id: string,
  data: { name?: string; content?: string }
): Promise<MessageTemplate> {
  const cookieStore = await cookies();
  const token = cookieStore.get('whatsapp_token')?.value;

  if (!token) {
    throw new Error('No autorizado');
  }

  const res = await fetch(`${API_URL}/templates/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Error al actualizar plantilla (${res.status})`);
  }

  return res.json();
}
