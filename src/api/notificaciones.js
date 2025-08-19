import axios from "axios";

const API_URL = "https://back-salubridad.sistemasudh.com/notificaciones"; // Ajusta la URL según tu backend

// Obtener todas las notificaciones de un usuario
export const obtenerNotificaciones = async (usuarioId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/${usuarioId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    throw error;
  }
};

// Crear una nueva notificación
export const crearNotificacion = async (data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(API_URL, {
      ...data,
      leida: false,
      fecha: new Date()
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear notificación", error);
    throw error;
  }
};

// Marcar una notificación como leída
export const marcarNotificacionLeida = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${API_URL}/${id}/marcarLeida`, 
      { leida: true }, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al marcar notificación como leída", error);
    throw error;
  }
};

// Eliminar una notificación
export const eliminarNotificacion = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar notificación", error);
    throw error;
  }
};
