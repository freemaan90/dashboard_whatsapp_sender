'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.BACKEND_URL;

export async function selectMetaPhone(phoneNumberId: string): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get('whatsapp_token')?.value;

  if (!token) throw new Error('No autorizado');

  const res = await fetch(`${API_URL}/whatsapp-onboarding/select-phone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ phoneNumberId }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Error al seleccionar teléfono (${res.status})`);
  }
}
