'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.BACKEND_URL;

export async function cancelMetaOnboarding(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get('whatsapp_token')?.value;

  if (!token) throw new Error('No autorizado');

  const res = await fetch(`${API_URL}/whatsapp-onboarding/session`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  // 204 No Content = success, 404 = no session (also fine)
  if (!res.ok && res.status !== 404) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Error al cancelar la sesión (${res.status})`);
  }
}
