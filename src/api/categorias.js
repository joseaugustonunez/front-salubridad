import axios from "axios";

const API_URL = "http://back-salubridad.sistemasudh.com/categorias"; // Asegúrate de que esta URL sea correcta

// Obtener todas las Categorías
export const obtenerCategorias = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener categorías", error);
    throw error;
  }
};

// Crear Categoría
export const crearCategoria = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

// Editar Categoría con PATCH
export const editarCategoria = async (id, data) => {
  const response = await axios.patch(`${API_URL}/${id}`, data);
  return response.data;
};

// Eliminar Categoría
export const eliminarCategoria = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
