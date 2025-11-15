import axios from "axios";

const API_URL = "https://back-salubridad.sistemasudh.com/comentarios";
//const API_URL = "http://localhost:3000/comentarios";
// Obtener token del localStorage
const obtenerToken = () => {
  const token = localStorage.getItem("token");
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

  return { headers };
};

// Obtener todos los comentarios de un establecimiento
export const obtenerComentariosPorEstablecimiento = async (establecimientoId) => {
  try {
    const response = await axios.get(
      `${API_URL}/establecimiento/${establecimientoId}`,
      configurarHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener los comentarios:", error);
    throw error;
  }
};

// Obtener comentarios por usuario
export const obtenerComentariosPorUsuario = async (userId) => {
  try {
    const url = userId ? `${API_URL}/usuario/${userId}` : `${API_URL}/usuario`;
    const response = await axios.get(url, configurarHeaders());
    return response.data; // { total, comentarios } o similar
  } catch (error) {
    console.error("Error al obtener comentarios por usuario:", error.response?.data || error);
    throw error;
  }
};

// Obtener todos los comentarios
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
