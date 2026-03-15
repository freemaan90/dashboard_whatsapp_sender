"use server";

import { cookies } from 'next/headers';

export async function getSessions() {
  const cookieStore = await cookies();
  const token = cookieStore.get('whatsapp_token')?.value;

  if (!token) {
    throw new Error('No autorizado');
  }

  const url = `${process.env.BACKEND_URL}/whatsapp-sender/sessions`;

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Backend error: ${res.status}`);
  }

  return res.json();
}
