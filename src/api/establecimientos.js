import axios from "axios";

// Asegúrate de que la URL sea válida según tu backend
const API_URL = "http://localhost:3000/establecimientos";

// Función para obtener el token desde el almacenamiento local
const obtenerToken = () => {
  const token = localStorage.getItem("token");
  console.log("Token obtenido:", token); // Asegúrate de que el token esté disponible
  return token;
};

// Función para configurar los headers
const configurarHeaders = () => {
  const token = obtenerToken();
  if (!token) {
    console.error("Token no encontrado");
    return {};
  }

  return {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  };
};
export const configurarHeadersJSON = () => {
  const token = localStorage.getItem("token"); // o donde tengas guardado el token
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};
export const configurarHeadersFormData = () => {
  const token = localStorage.getItem("token"); // o donde tengas guardado el token
  return {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };
};
export const obtenerEstablecimientoDelUsuario = async (usuarioId) => {
  try {
    const response = await axios.get(`${API_URL}/usuario/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el establecimiento del usuario:", error);
    throw error;
  }
};
export const crearEstablecimiento = async (data) => {
  try {
    const formData = new FormData();

    formData.append("nombre", data.nombre);
    if (data.descripcion) formData.append("descripcion", data.descripcion);

    // Enviar ubicaciones y horarios como arrays JSON
    formData.append("ubicacion", JSON.stringify(data.ubicacion));
    formData.append("horario", JSON.stringify(data.horario));

    // Añadir múltiples categorías y tipos
    data.categoria.forEach((cat) => formData.append("categoria", cat));
    data.tipo.forEach((tip) => formData.append("tipo", tip));

    if (data.telefono) formData.append("telefono", data.telefono);

    if (data.redesSociales) {
      formData.append("redesSociales", JSON.stringify(data.redesSociales));
    }

    if (data.imagen) formData.append("imagen", data.imagen);
    if (data.portada) formData.append("portada", data.portada);

    if (data.imagenes && data.imagenes.length > 0) {
      data.imagenes.forEach((img) => {
        formData.append("imagenes", img);
      });
    }

    const response = await axios.post(API_URL, formData, configurarHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al crear el establecimiento:", error.response?.data || error.message);
    throw error;
  }
};




// Obtener todos los establecimientos
export const obtenerEstablecimientos = async () => {
  try {
    const response = await axios.get(API_URL, configurarHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al obtener los establecimientos:", error);
    throw error;
  }
};
export const obtenerEstablecimientosAprobados = async () => {
  try {
    const response = await axios.get(`${API_URL}/aprobados`, configurarHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al obtener los establecimientos:", error);
    throw error;
  }
};

// Obtener un establecimiento por ID
export const obtenerEstablecimientoPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, configurarHeadersJSON());
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el establecimiento con ID ${id}:`, error);
    throw error;
  }
};

// Buscar establecimientos por nombre
export const buscarEstablecimientosPorNombre = async (nombre) => {
  try {
    // Esta petición podría no necesitar autenticación
    const response = await axios.get(`${API_URL}/buscar`, {
      params: { nombre }, // Enviar el nombre como parámetro de consulta
    });
    return response.data;
  } catch (error) {
    console.error(`Error al buscar establecimientos con el nombre "${nombre}":`, error);
    throw error;
  }
};

// Editar establecimiento (PATCH)
export const editarEstablecimiento = async (id, data) => {
  try {
    // Normaliza los campos de referencia a solo IDs
    const camposReferencia = ['ubicacion', 'categoria', 'tipo', 'horario'];
    const normalizarIds = (arr) =>
      Array.isArray(arr)
        ? arr.map(val => (typeof val === 'object' && val !== null && val._id ? val._id : val))
        : arr;

    if (data.imagen || data.portada || (data.imagenes && data.imagenes.length > 0)) {
      const formData = new FormData();

      Object.keys(data).forEach(key => {
        if (key === 'imagen' || key === 'portada' || key === 'imagenes') return;

        // Si es un campo de referencia, agregar solo los IDs
        if (camposReferencia.includes(key) && Array.isArray(data[key])) {
          normalizarIds(data[key]).forEach(val => formData.append(key, val));
        } else if (typeof data[key] === 'object' && data[key] !== null) {
          // Para objetos simples (ej: redesSociales)
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });

      if (data.imagen) formData.append("imagen", data.imagen);
      if (data.portada) formData.append("portada", data.portada);

      if (data.imagenes && data.imagenes.length > 0) {
        data.imagenes.forEach(img => {
          formData.append("imagenes", img);
        });
      }

      const headers = { Authorization: `Bearer ${obtenerToken()}` };
      const response = await axios.patch(`${API_URL}/${id}`, formData, { headers });
      return response.data;
    } else {
      // Si no hay archivos, enviamos como JSON normal
      const cleanData = { ...data };
      camposReferencia.forEach(key => {
        if (Array.isArray(cleanData[key])) {
          cleanData[key] = normalizarIds(cleanData[key]);
        }
      });
      const response = await axios.patch(`${API_URL}/${id}`, cleanData, configurarHeadersJSON());
      return response.data;
    }
  } catch (error) {
    console.error(`Error al editar el establecimiento con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar establecimiento
export const eliminarEstablecimiento = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, configurarHeadersJSON());
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el establecimiento con ID ${id}:`, error);
    throw error;
  }
};

// Seguir establecimiento
export const seguirEstablecimiento = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/${id}/seguir`,
      {},  // Enviar un objeto vacío en lugar de null
      configurarHeadersJSON()
    );
    return response.data;
  } catch (error) {
    console.error(`Error al seguir el establecimiento con ID ${id}:`, error);
    throw error;
  }
};

// Dejar de seguir establecimiento
export const dejarDeSeguirEstablecimiento = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/${id}/dejar-de-seguir`,
      {},  // Enviar un objeto vacío en lugar de null
      configurarHeadersJSON()
    );
    return response.data;
  } catch (error) {
    console.error(`Error al dejar de seguir el establecimiento con ID ${id}:`, error);
    throw error;
  }
};

// Dar like a un establecimiento
export const likeEstablecimiento = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/${id}/like`,
      {},  // Enviar un objeto vacío en lugar de null
      configurarHeadersJSON()
    );
    return response.data;
  } catch (error) {
    console.error(`Error al dar like al establecimiento con ID ${id}:`, error);
    throw error;
  }
};

// Quitar like a un establecimiento
export const quitarLikeEstablecimiento = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/${id}/quitar-like`,
      {},  // Enviar un objeto vacío en lugar de null
      configurarHeadersJSON()
    );
    return response.data;
  } catch (error) {
    console.error(`Error al quitar like al establecimiento con ID ${id}:`, error);
    throw error;
  }
};
export const actualizarVerificado = async (id, verificado) => {
  const res = await axios.put(`${API_URL}/${id}/verificado`, { verificado });
  return res.data;
};

// Cambiar estado
export const actualizarEstado = async (id, estado) => {
  const res = await axios.put(`${API_URL}/${id}/estado`, { estado });
  return res.data;
};
export const imagenesService = {
  
  agregarImagenes: async (id, imagenes) => {
    try {
      console.log("Iniciando carga de imágenes para establecimiento:", id);
      console.log("Cantidad de imágenes a subir:", imagenes.length);
      
      if (!imagenes || imagenes.length === 0) {
        throw new Error("No hay imágenes para subir");
      }
      
      const formData = new FormData();
      
      for (let i = 0; i < imagenes.length; i++) {
        if (imagenes[i] instanceof File) {
          console.log(`Añadiendo imagen ${i + 1}:`, imagenes[i].name);
          // CAMBIO REALIZADO AQUÍ
          formData.append('imagenes', imagenes[i]); 
        } else {
          console.error(`El elemento ${i} no es un archivo válido:`, imagenes[i]);
        }
      }
      
      console.log("Contenido del FormData:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${obtenerToken()}`
        }
      };
      
      console.log("Enviando petición a:", `${API_URL}/${id}/imagenes`);
      
      const response = await axios.post(
        `${API_URL}/${id}/imagenes`,
        formData,
        config
      );
      
      console.log('Imágenes agregadas exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al agregar imágenes:', error);
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
        console.error('Estado HTTP:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor');
      } else {
        console.error('Error de configuración:', error.message);
      }
      throw error;
    }
  },
  
  eliminarImagen: async (id, nombreImagen) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${id}/imagenes`,
        {
          headers: {
            'Authorization': `Bearer ${obtenerToken()}`
          },
          data: { nombreImagen }
        }
      );
      
      console.log('Imagen eliminada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      throw error;
    }
  },
  
  actualizarImagenPrincipal: async (id, imagen) => {
  try {
    // Validations
    if (!imagen || !(imagen instanceof File)) {
      throw new Error('Archivo de imagen no válido');
    }

    // Validate file type and size
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(imagen.type)) {
      throw new Error('Tipo de archivo no permitido. Use JPEG, PNG o WebP');
    }

    // Size limit (5MB)
    const maxTamano = 5 * 1024 * 1024;
    if (imagen.size > maxTamano) {
      throw new Error('El archivo es demasiado grande. Máximo 5MB');
    }

    // Create FormData - key must be 'imagen' to match backend
    const formData = new FormData();
    formData.append('imagen', imagen, imagen.name);
    
    // Log request details
    console.log('Upload Principal - Request Details:', {
      id,
      fileName: imagen.name,
      fileType: imagen.type,
      fileSize: imagen.size
    });

    const response = await axios.put(
      `${API_URL}/${id}/imagen-principal`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${obtenerToken()}`,
          // Don't set Content-Type manually, let browser set correct boundary
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Progreso de subida: ${percentCompleted}%`);
        }
      }
    );
    
    console.log('Imagen principal actualizada:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error detallado al actualizar imagen principal:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
},

actualizarImagenPortada: async (id, portada) => {
  try {
    // Validations
    if (!portada || !(portada instanceof File)) {
      throw new Error('Archivo de imagen no válido');
    }

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(portada.type)) {
      throw new Error('Tipo de archivo no permitido. Use JPEG, PNG o WebP');
    }

    const maxTamano = 5 * 1024 * 1024;
    if (portada.size > maxTamano) {
      throw new Error('El archivo es demasiado grande. Máximo 5MB');
    }

    // Create FormData - key must be 'portada' to match backend
    const formData = new FormData();
    formData.append('portada', portada, portada.name);
    
    // Log request details
    console.log('Upload Portada - Request Details:', {
      id,
      fileName: portada.name,
      fileType: portada.type,
      fileSize: portada.size
    });

    const response = await axios.put(
      `${API_URL}/${id}/imagen-portada`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${obtenerToken()}`,
          // Don't set Content-Type manually
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Progreso de subida de portada: ${percentCompleted}%`);
        }
      }
    );
    
    console.log('Imagen de portada actualizada:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error detallado al actualizar imagen de portada:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
},

  
  reordenarImagenes: async (id, nuevaOrdenImagenes) => {
    try {
      const response = await axios.put(
        `${API_URL}/${id}/imagenes/reordenar`,
        { nuevaOrdenImagenes },
        configurarHeadersJSON()
      );
      
      console.log('Orden de imágenes actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al reordenar imágenes:', error);
      throw error;
    }
  },
  
  obtenerUrlImagen: (nombreImagen) => {
    if (!nombreImagen) return null;
    return `http://localhost:3000/uploads/${nombreImagen}`;
  }
};
