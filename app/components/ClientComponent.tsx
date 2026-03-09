"use client";

import { useEffect, useState } from "react";
import { WhatsappSession } from "../interfaces/whatsappSession.interface";
import { createWhatsappSession } from "../actions/createSessionById";
import { deleteSessionById } from "../actions/deleteSessionById";

interface Props {
  session: WhatsappSession[];
  telNumber?: string
}

export const ClientComponent = ({ session, telNumber = '' }: Props) => {
  const [tel, setTel] = useState(telNumber);
  const [qr, setQr] = useState('');

  useEffect(() => {
    if (session?.length > 0) {
      setQr(session[0].qrBase64!);
    }
  }, [session]);

  const handleSubmit = async () => {
    const data = await createWhatsappSession(tel);
    setQr(data.qrBase64);
  };

  const handleDelete = async () => {
    const data = await deleteSessionById(tel);
    if (data) {
      setQr("");
    }
  };

  return (
    <>
      {qr && (
        <div style={{ marginBottom: 20 }}>
          <img
            src={qr}
            alt="QR de WhatsApp"
            style={{ width: 250, height: 250 }}
          />
        </div>
      )}

      <input
        type="text"
        placeholder="Tel"
        value={tel}
        onChange={(e) => setTel(e.target.value)}
      />

      <button onClick={handleSubmit}>Enviar</button>
      <button onClick={handleDelete}>Eliminar Instancia</button>
    </>
  );
};
