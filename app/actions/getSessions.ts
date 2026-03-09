"use server";

export async function getSessions() {
  const url = `${process.env.BACKEND_URL}/whatsapp-sender/sessions`;

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Backend error: ${res.status}`);
  }

  return res.json();
}
