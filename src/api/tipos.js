import axios from "axios";

const API_URL = "http://back-salubridad.sistemasudh.com/tipos"; // Asegúrate de que esta URL sea correcta

// Obtener todos los Tipos
export const obtenerTipos = async () => {
  const response = await axios.get(API_URL);
  return response.data; // Retorna los tipos obtenidos de la API
};

// Crear Tipo
export const crearTipo = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

// Editar Tipo con PATCH
export const editarTipo = async (id, data) => {
  const response = await axios.patch(`${API_URL}/${id}`, data);
  return response.data;
};

// Eliminar Tipo
export const eliminarTipo = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
