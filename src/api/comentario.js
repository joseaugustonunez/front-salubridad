import axios from "axios";

const API_URL = "https://back-salubridad.sistemasudh.com/comentarios";

// Obtener token del localStorage
const obtenerToken = () => {
  const token = localStorage.getItem("token");
  console.log("Token obtenido:", token); // Asegúrate de que el token esté disponible
  return token;
};

// Configurar headers con token
const configurarHeaders = () => {
  const token = obtenerToken();
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log("Headers configurados:", headers); // Asegúrate de que los headers sean correctos
  return { headers };
};

// Obtener todos los comentarios de un establecimiento
export const obtenerComentariosPorEstablecimiento = async (establecimientoId) => {
  console.log("ID de establecimiento:", establecimientoId);
  try {
    const response = await axios.get(
      `${API_URL}/establecimiento/${establecimientoId}`,
      configurarHeaders()
    );
    console.log("Comentarios del establecimiento:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los comentarios:", error);
    throw error;
  }
};


export const obtenerComentarios = async (establecimientoId) => {
  try {
    const response = await axios.get(`${API_URL}/establecimiento/${establecimientoId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener comentarios", error);
    throw error;
  }
};

// Crear un nuevo comentario
export const crearComentario = async (data) => {
  try {
    const response = await axios.post(`${API_URL}`, data, configurarHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al crear el comentario:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Ocurrió un error al crear el comentario."
    );
  }
};

// Editar un comentario
export const editarComentario = async (id, data) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, data, configurarHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al editar comentario", error);
    throw error;
  }
};

// Eliminar un comentario
export const eliminarComentario = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, configurarHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al eliminar comentario", error);
    throw error;
  }
};
