import axios from "axios";

const API_URL = "https://back-salubridad.sistemasudh.com/users";

// Obtener token del localStorage
const obtenerToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token disponible. Por favor, inicia sesión.");
  }
  return token;
};

// Configurar headers con token
const configurarHeaders = () => {
  const token = obtenerToken();
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return { headers };
};

// Obtener todos los usuarios (con filtros opcionales)
export const obtenerUsuarios = async (filtros) => {
  try {
    let url = API_URL;

    if (filtros) {
      const params = new URLSearchParams();

      if (filtros.email) params.append("email", filtros.email);
      if (filtros.nombreUsuario) params.append("nombreUsuario", filtros.nombreUsuario);
      if (filtros.rol) params.append("rol", filtros.rol);

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await axios.get(url, configurarHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios", error);
    throw error;
  }
};

// Obtener un usuario por ID
export const obtenerUsuarioPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuario", error);
    throw error;
  }
};

// Crear un nuevo usuario
export const crearUsuario = async (data) => {
  try {
    const response = await axios.post(API_URL, {
      ...data,
      fechaCreacion: new Date(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear usuario", error);
    throw error;
  }
};

// Subir foto de perfil
export const subirFotoPerfil = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const response = await axios.post(`${API_URL}/${id}/profile-picture`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.fotoPerfil;
  } catch (error) {
    console.error("Error al subir la foto de perfil:", error);
    throw error;
  }
};

// Subir foto de portada
export const subirFotoPortada = async (id, file) => {
  const formData = new FormData();
  formData.append("coverPhoto", file);

  try {
    const response = await axios.post(`${API_URL}/${id}/cover-photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Foto de portada actualizada:", response.data.fotoPortada);
    return response.data.fotoPortada;
  } catch (error) {
    console.error("Error al subir la foto de portada:", error);
    throw error;
  }
};

// Actualizar datos de un usuario
export const actualizarUsuario = async (id, data) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar usuario", error);
    throw error;
  }
};

// Eliminar un usuario
export const eliminarUsuario = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar usuario", error);
    throw error;
  }
};
