import axios from "axios";

const API_CHAT = "https://back-salubridad.sistemasudh.com/chat";
//const API_CHAT = "http://localhost:3000/chat";

export const enviarMensajeChat = async (mensaje) => {
  try {
    // enviar con la clave `message` (el backend la espera)
    const response = await axios.post(API_CHAT, { message: mensaje });
    return response.data; // { respuesta: "texto generado por el bot" }
  } catch (error) {
    // log útil para ver por qué el backend responde 400
    console.error("Error al enviar mensaje al chat:", error.response?.data || error.message);
    // propaga el payload del error cuando exista para que el frontend lo muestre si hace falta
    throw error.response?.data || error;
  }
};