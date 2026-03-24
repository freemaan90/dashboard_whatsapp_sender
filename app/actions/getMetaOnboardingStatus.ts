'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.BACKEND_URL;

export type OnboardingStatus =
  | 'pending'
  | 'callback_received'
  | 'waba_selection_required'
  | 'phone_selection_required'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface OnboardingStatusResponse {
  status: OnboardingStatus;
  whatsappSessionId?: string;
  availableWabas?: Array<{ id: string; name: string }>;
  availablePhones?: Array<{ id: string; displayPhoneNumber: string }>;
}

export async function getMetaOnboardingStatus(): Promise<OnboardingStatusResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('whatsapp_token')?.value;

  if (!token) throw new Error('No autorizado');

  const res = await fetch(`${API_URL}/whatsapp-onboarding/status`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Error al consultar estado (${res.status})`);
  }

  return res.json();
}
