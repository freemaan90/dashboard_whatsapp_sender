'use server';

const API_URL = process.env.BACKEND_URL; // ej: http://localhost:3001

export async function createWhatsappSession(sessionId: string) {
  // 1. Crear sesión en el microservicio
  const createRes = await fetch(`${API_URL}/whatsapp-sender/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
    cache: 'no-store',
  });

  if (!createRes.ok) {
    throw new Error('No se pudo crear la sesión de WhatsApp');
  }

  // 2. Esperar activamente hasta que el QR esté disponible
  const qr = await waitForQR(sessionId);

  // 3. Devolver QR al frontend
  return {
    sessionId,
    qrBase64: qr,
  };
}

async function waitForQR(sessionId: string): Promise<string> {
  const MAX_ATTEMPTS = 40; // ~20 segundos
  const DELAY = 500;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const statusRes = await fetch(
      `${API_URL}/whatsapp-sender/status/${sessionId}`,
      { cache: 'no-store' },
    );

    if (statusRes.ok) {
      const data = await statusRes.json();

      if (data.qrBase64) {
        return data.qrBase64;
      }
    }

    await new Promise((r) => setTimeout(r, DELAY));
  }

  throw new Error('El QR no estuvo disponible a tiempo');
}
