'use server';

import { cookies } from 'next/headers';
import { MessageTemplate } from '../interfaces/messageTemplate.interface';

const API_URL = process.env.BACKEND_URL;

export async function getTemplates(): Promise<MessageTemplate[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get('whatsapp_token')?.value;

  if (!token) {
    return [];
  }

  try {
    const res = await fetch(`${API_URL}/templates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error('[getTemplates]', error.message || `HTTP ${res.status}`);
      return [];
    }

    return res.json().catch(() => []);
  } catch (err) {
    console.error('[getTemplates] Error de red:', err);
    return [];
  }
}
