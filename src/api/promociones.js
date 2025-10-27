import axios from "axios";

const API_URL = "https://back-salubridad.sistemasudh.com/promociones";
//const API_URL = "http://localhost:3000/promociones";
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
// Obtener token
const obtenerToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No hay token disponible. Por favor, inicia sesión.");
    }
    return token;
  }
  return null;
};

// Configurar headers
const configurarHeaders = (contentType = "application/json") => {
  const token = obtenerToken();
  const headers = {
    "Content-Type": contentType,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return { headers };
};

// Manejo de errores
const handleError = (error) => {
  console.error("Axios error:", error);
};

// Funciones API
export const obtenerPromociones = async () => {
  try {
    const config = configurarHeaders();
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    handleError(error);
    return [];
  }
};

export const obtenerPromocionPorId = async (id) => {
  try {
    const config = configurarHeaders();
    const response = await axios.get(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const obtenerPromocionesPorEstablecimiento = async (establecimientoId) => {
  const res = await axios.get(`${API_URL}/establecimiento/${establecimientoId}`, getAuthHeaders());
  return res.data;
};

export const crearPromocion = async (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  const res = await axios.post(API_URL, formData, getAuthHeaders());
  return res.data;
};

export const actualizarPromocion = async (id, data) => {
  // Si hay imagen, usa FormData
  if (data.imagen instanceof File) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const res = await axios.patch(`${API_URL}/${id}`, formData, getAuthHeaders());
    return res.data;
  }
  // Si no hay imagen, envía JSON
  const res = await axios.patch(
    `${API_URL}/${id}`,
    data,
    configurarHeaders("application/json")
  );
  return res.data;
};

export const eliminarPromocion = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return res.data;
};

