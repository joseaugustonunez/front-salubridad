import axios from "axios";

const API_URL = "http://localhost:3000/ubicaciones"; // Asegúrate de que esta URL sea correcta

// Obtener todas las ubicaciones
export const obtenerUbicaciones = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener ubicaciones", error);
    throw error;
  }
};

// Crear una nueva ubicación
export const crearUbicacion = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error al crear ubicación", error);
    throw error;
  }
};

// Editar una ubicación existente
export const editarUbicacion = async (id, data) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al editar ubicación", error);
    throw error;
  }
};

// Eliminar una ubicación
export const eliminarUbicacion = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar ubicación", error);
    throw error;
  }
};
