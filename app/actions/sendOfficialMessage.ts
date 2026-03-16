'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.BACKEND_URL;

export interface TemplateComponent {
  type: string;
  parameters?: Array<{ type: string; text?: string }>;
}

export interface SendOfficialMessagePayload {
  sessionId: string;
  phone: string;
  message?: string;
  templateName?: string;
  languageCode?: string;
  templateComponents?: TemplateComponent[];
}

export async function sendOfficialMessage(
  payload: SendOfficialMessagePayload,
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
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Error al enviar el mensaje (${res.status})`);
  }

  return res.json();
}
