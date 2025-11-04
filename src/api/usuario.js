import axios from "axios";

const API_URL = "https://back-salubridad.sistemasudh.com/users";
//const API_URL = "http://localhost:3000/users"; // usar localhost para desarrollo

// Obtener token del localStorage
const obtenerToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token disponible. Por favor, inicia sesión.");
  }
  return token;
};

// Configurar headers con token
const configurarHeaders = (isMultipart = false) => {
  const token = obtenerToken();
  const headers = {
    "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
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

// Actualizar rol de un usuario
export const actualizarRolUsuario = async (id, nuevoRol) => {
  try {
    const headers = configurarHeaders(); // ahora application/json
    const response = await axios.patch(
      `${API_URL}/${id}/role`,
      { rol: nuevoRol }, // coincide con backend
      headers
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar rol:", error.response?.data || error);
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

// Obtener establecimientos seguidos
export const obtenerEstablecimientosSeguidos = async (userId) => {
  try {
    const token = obtenerToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // Si se pasa userId usamos /users/:id/seguidos, si no usamos /users/seguidos (backend toma user del token)
    const url = userId ? `${API_URL}/${userId}/seguidos` : `${API_URL}/seguidos`;
    const response = await axios.get(url, { headers });

    // Intentar adaptarnos a distintas formas de respuesta
    return response.data.establecimientosSeguidos || response.data || [];
  } catch (error) {
    console.error("Error al obtener establecimientos seguidos:", error.response?.data || error.message || error);
    throw error;
  }
};

// Obtener comentarios (userId opcional, intenta localStorage si no se pasa)
export const obtenerComentariosUsuario = async (userId) => {
  try {
    const id =
      userId ||
      (() => {
        const stored = localStorage.getItem("user");
        if (!stored) return null;
        try {
          const parsed = JSON.parse(stored);
          return parsed?._id || parsed?.id || parsed?.userId || null;
        } catch {
          return null;
        }
      })();

    if (!id) throw new Error("ID de usuario no disponible. Inicia sesión o pasa userId.");

    const url = `${API_URL}/${id}/comentarios`;
    const resp = await axios.get(url, configurarHeaders());
    // Puede devolver { comentarios: [...] } o arreglo directo
    return resp.data.comentarios || resp.data || [];
  } catch (error) {
    console.error("Error al obtener comentarios del usuario:", error.response?.data || error.message || error);
    throw error;
  }
};

// Obtener promociones de los establecimientos que sigue el usuario
export const obtenerPromocionesUsuario = async (userId) => {
  try {
    const id =
      userId ||
      (() => {
        const stored = localStorage.getItem("user");
        if (!stored) return null;
        try {
          const parsed = JSON.parse(stored);
          return parsed?._id || parsed?.id || parsed?.userId || null;
        } catch {
          return null;
        }
      })();

    if (!id) throw new Error("ID de usuario no disponible. Inicia sesión o pasa userId.");

    const url = `${API_URL}/${id}/promociones`;
    const resp = await axios.get(url, configurarHeaders());
    return resp.data.promociones || resp.data || [];
  } catch (error) {
    console.error("Error al obtener promociones del usuario:", error.response?.data || error.message || error);
    throw error;
  }
}

// Obtener totales del usuario (comentarios hechos y establecimientos seguidos)
export const obtenerTotalesUsuario = async (userId) => {
  try {
    const id =
      userId ||
      (() => {
        const stored = localStorage.getItem("user");
        if (!stored) return null;
        try {
          const parsed = JSON.parse(stored);
          return parsed?._id || parsed?.id || parsed?.userId || null;
        } catch {
          return null;
        }
      })();

    if (!id) throw new Error("ID de usuario no disponible. Inicia sesión o pasa userId.");

    const url = `${API_URL}/${id}/totales`;
    const resp = await axios.get(url, configurarHeaders());
    // resp.data: { totalComentarios, totalEstablecimientosSeguidos }
    return resp.data || {};
  } catch (error) {
    console.error("Error al obtener totales del usuario:", error.response?.data || error.message || error);
    throw error;
  }
};

// Enviar solicitud para ser vendedor
export const solicitarVendedor = async () => {
  try {
    const headers = configurarHeaders(); // ya agrega el token automáticamente
    const response = await axios.post(`${API_URL}/solicitar-vendedor`, {}, headers);
    return response.data;
  } catch (error) {
    console.error("Error al solicitar ser vendedor:", error.response?.data || error.message || error);
    throw error;
  }
};

// Obtener seguidores de un vendedor (userId opcional)
export const obtenerSeguidoresVendedor = async (userId) => {
  try {
    const id =
      userId ||
      (() => {
        const stored = localStorage.getItem("user");
        if (!stored) return null;
        try {
          const parsed = JSON.parse(stored);
          return parsed?._id || parsed?.id || null;
        } catch {
          return null;
        }
      })();

    if (!id) throw new Error("ID de usuario no disponible. Inicia sesión o pasa userId.");

    const url = `${API_URL}/${id}/seguidores`;
    const resp = await axios.get(url, configurarHeaders());
    // resp.data: { total, seguidores }
    return resp.data || { total: 0, seguidores: [] };
  } catch (error) {
    console.error("Error al obtener seguidores del vendedor:", error.response?.data || error.message || error);
    throw error;
  }
};

// Obtener comentarios recibidos en los establecimientos del vendedor
export const obtenerComentariosRecibidosUsuario = async (userId) => {
  try {
    const id =
      userId ||
      (() => {
        const stored = localStorage.getItem("user");
        if (!stored) return null;
        try {
          const parsed = JSON.parse(stored);
          return parsed?._id || parsed?.id || null;
        } catch {
          return null;
        }
      })();

    if (!id) throw new Error("ID de usuario no disponible. Inicia sesión o pasa userId.");

    const url = `${API_URL}/${id}/comentarios-recibidos`;
    const resp = await axios.get(url, configurarHeaders());
    // resp.data: { total, comentarios }
    return resp.data || { total: 0, comentarios: [] };
  } catch (error) {
    console.error("Error al obtener comentarios recibidos:", error.response?.data || error.message || error);
    throw error;
  }
};
