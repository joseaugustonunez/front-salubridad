import axios from "axios";

const API_URL = "http://back-salubridad.sistemasudh.com/horarios"; // Asegúrate de que esta URL sea correcta

// Obtener todos los Horarios
export const obtenerHorarios = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener horarios", error);
    throw error;
  }
};

// Crear Horario
export const crearHorario = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

// Editar Horario con PATCH
export const editarHorario = async (id, data) => {
  const response = await axios.patch(`${API_URL}/${id}`, data);
  return response.data;
};

// Eliminar Horario
export const eliminarHorario = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
