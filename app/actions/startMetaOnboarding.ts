'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.BACKEND_URL;

export interface AuthorizeResponse {
  authorizationUrl: string;
}

export async function startMetaOnboarding(): Promise<AuthorizeResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('whatsapp_token')?.value;

  if (!token) throw new Error('No autorizado');

  const res = await fetch(`${API_URL}/whatsapp-onboarding/authorize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Error al iniciar el flujo OAuth (${res.status})`);
  }

  return res.json();
}
