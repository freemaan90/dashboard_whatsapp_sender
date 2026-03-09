'use server';

const API_URL = process.env.BACKEND_URL;

export async function deleteSessionById(sessionId: string) {
  const deleteResp = await fetch(`${API_URL}/whatsapp-sender/session`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
    cache: 'no-store',
  });

  if (!deleteResp.ok) {
    throw new Error('No se pudo borrar la sesión de WhatsApp');
  }

  // 👇 Esto sí es serializable
  const json = await deleteResp.json();

  return json;
}
