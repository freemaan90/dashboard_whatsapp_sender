'use client'

import { useEffect, useState } from "react";
import { WhatsappSession } from "../interfaces/whatsappSession.interface";
import { createWhatsappSession } from "../actions/createSessionById";

interface Props {
  session: WhatsappSession[]
}

export const ClientComponent = ({ session }: Props) => {

  const [tel, setTel] = useState("5493413646222");
  const [qr, setQr] = useState('')

  useEffect(() => {
    if (session?.length > 0) {
      setQr(session[0].qrBase64!)
    }
  }, [session])

const handleSubmit = async () => {
  const data = await createWhatsappSession(tel);
  setQr(data.qrBase64)
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
    </>
  );
};
