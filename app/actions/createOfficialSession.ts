'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.BACKEND_URL;

export interface CreateOfficialSessionPayload {
  phoneNumberId: string;
  accessToken: string;
  wabaId: string;
  phoneNumber: string;
}

export async function createOfficialSession(
  payload: CreateOfficialSessionPayload,
): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  const token = cookieStore.get('whatsapp_token')?.value;

  if (!token) {
    throw new Error('No autorizado');
  }

  const res = await fetch(`${API_URL}/whatsapp-sender/sessions/official`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    if (res.status === 409) {
      throw new Error('Ya existe una sesión con ese Phone Number ID');
    }
    if (res.status === 422) {
      throw new Error('El token de acceso no es válido en Meta');
    }
    throw new Error(error.message || `Error al crear la sesión oficial (${res.status})`);
  }

  return { success: true };
}
