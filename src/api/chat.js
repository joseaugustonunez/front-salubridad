import axios from "axios";

const API_CHAT = "https://back-salubridad.sistemasudh.com/chat";

export const enviarMensajeChat = async (mensaje) => {
  try {
    const response = await axios.post(API_CHAT, { mensaje });
    return response.data; // { respuesta: "texto generado por el bot" }
  } catch (error) {
    console.error("Error al enviar mensaje al chat:", error);
    throw error;
  }
};
