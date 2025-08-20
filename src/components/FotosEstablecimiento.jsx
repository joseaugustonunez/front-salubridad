import { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaImages, FaPlus } from 'react-icons/fa';
import { obtenerEstablecimientoPorId, imagenesService } from "../api/establecimientos";

const FotosEstablecimiento = ({ establecimientoId, tieneEstablecimiento }) => {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Define API URL with a fallback
  const apiUrl = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL 
    : 'https://back-salubridad.sistemasudh.com/';

  useEffect(() => {
    // Reset states when the component mounts or props change
    setFotos([]);
    setLoading(true);
    setError(null);

    if (tieneEstablecimiento && establecimientoId) {
      obtenerFotosEstablecimiento(establecimientoId);
    } else {
      // If no establecimientoId is provided, set loading to false
      setLoading(false);
    }
  }, [establecimientoId, tieneEstablecimiento]);

  // Debug function to help see what's happening
  const logDebugInfo = (message, data) => {
    console.log(`DEBUG - ${message}:`, data);
  };

  // Función para obtener las fotos del establecimiento
  const obtenerFotosEstablecimiento = async (id) => {
    try {
      setLoading(true);
      logDebugInfo("Intentando obtener fotos para establecimiento ID", id);
  
      try {
        const establecimiento = await obtenerEstablecimientoPorId(id);
        logDebugInfo("Datos del establecimiento obtenidos de API", establecimiento);
  
        // Procesar las imágenes del establecimiento
        const imagenes = procesarImagenesDesdeEstablecimiento(establecimiento);
  
        // Guardar en localStorage para futuros accesos
        localStorage.setItem(`establecimiento_${id}`, JSON.stringify(establecimiento));
  
        logDebugInfo("Imágenes procesadas", imagenes);
        setFotos(imagenes);
      } catch (apiError) {
        logDebugInfo("Error en la petición API, intentando desde localStorage", apiError);
  
        const establecimientoData = localStorage.getItem(`establecimiento_${id}`);
        if (establecimientoData) {
          const establecimiento = JSON.parse(establecimientoData);
          logDebugInfo("Datos del establecimiento recuperados de localStorage", establecimiento);
  
          const imagenes = procesarImagenesDesdeEstablecimiento(establecimiento);
          setFotos(imagenes);
        } else {
          throw new Error("No se pudo obtener información del establecimiento");
        }
      }
    } catch (error) {
      console.error("Error al obtener fotos del establecimiento:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para procesar imágenes desde el objeto establecimiento
  const procesarImagenesDesdeEstablecimiento = (establecimiento) => {
    const imagenes = [];
    
    if (!establecimiento) {
      console.warn("Establecimiento no definido al procesar imágenes");
      return imagenes;
    }
    
    // Imagen principal
    if (establecimiento.imagen) {
      const urlImagen = imagenesService.obtenerUrlImagen(establecimiento.imagen);
        
      imagenes.push({
        id: 'imagen_principal',
        tipo: 'principal',
        url: urlImagen,
        nombre: establecimiento.imagen
      });
    }
    
    // Imagen de portada
    if (establecimiento.portada) {
      const urlPortada = imagenesService.obtenerUrlImagen(establecimiento.portada);
        
      imagenes.push({
        id: 'imagen_portada',
        tipo: 'portada',
        url: urlPortada,
        nombre: establecimiento.portada
      });
    }
    
    // Imágenes adicionales
    if (establecimiento.imagenes && Array.isArray(establecimiento.imagenes) && establecimiento.imagenes.length > 0) {
      const imagenesAdicionales = establecimiento.imagenes.map((img, index) => {
        const urlImagen = imagenesService.obtenerUrlImagen(img);
          
        return {
          id: `imagen_${index}`,
          tipo: 'galeria',
          url: urlImagen,
          nombre: img
        };
      });
      
      imagenes.push(...imagenesAdicionales);
    }
    
    return imagenes;
  };

  // Función para abrir modal de imagen
  const handleOpenImage = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // Función para confirmar eliminación
  const handleConfirmDelete = (image) => {
    setImageToDelete(image);
    setIsDeleteModalOpen(true);
  };

  // Función para eliminar imagen
  const handleDeleteImage = async () => {
    try {
      if (!imageToDelete) return;
      
      setLoading(true);
      
      if (imageToDelete.tipo === 'principal') {
        // No permitir eliminar la imagen principal, solo reemplazarla
        alert("No puedes eliminar la imagen principal. Si deseas cambiarla, utiliza la opción de editar.");
        setIsDeleteModalOpen(false);
        setLoading(false);
        return;
      } else if (imageToDelete.tipo === 'portada') {
        // No permitir eliminar la imagen de portada, solo reemplazarla
        alert("No puedes eliminar la imagen de portada. Si deseas cambiarla, utiliza la opción de editar.");
        setIsDeleteModalOpen(false);
        setLoading(false);
        return;
      } else {
        // Eliminar imagen de la galería
        await imagenesService.eliminarImagen(establecimientoId, imageToDelete.nombre);
      }
      
      // Actualizar la vista tras eliminar
      await obtenerFotosEstablecimiento(establecimientoId);
      
      // Cerrar el modal de confirmación
      setIsDeleteModalOpen(false);
      setImageToDelete(null);
      
      // Mostrar notificación de éxito
      alert("Imagen eliminada con éxito");
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      setError("Error al eliminar la imagen: " + error.message);
      setLoading(false);
    }
  };

  // Función para editar imagen
  const handleEditImage = (image) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.onchange = async (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        
        try {
          setIsUploading(true);
          
          // Actualizar según el tipo de imagen
          if (image.tipo === 'principal') {
            await imagenesService.actualizarImagenPrincipal(establecimientoId, file);
          } else if (image.tipo === 'portada') {
            await imagenesService.actualizarImagenPortada(establecimientoId, file);
          } else if (image.tipo === 'galeria') {
            // Para imágenes de galería, eliminamos la anterior y subimos la nueva
            await imagenesService.eliminarImagen(establecimientoId, image.nombre);
            
            // Crear un array con el archivo para usar la función de agregar imágenes
            const nuevasImagenes = [file];
            await imagenesService.agregarImagenes(establecimientoId, nuevasImagenes);
          }
          
          // Actualizar la vista tras editar
          await obtenerFotosEstablecimiento(establecimientoId);
          
          // Cerrar modal si está abierto
          if (isModalOpen) {
            setIsModalOpen(false);
          }
          
          // Mostrar notificación de éxito
          alert("Imagen actualizada con éxito");
        } catch (error) {
          console.error("Error al actualizar la imagen:", error);
          setError("Error al actualizar la imagen: " + error.message);
        } finally {
          setIsUploading(false);
        }
      }
    };
    
    fileInput.click();
  };

  // Función para subir nueva imagen
  const handleUploadNewImage = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true; // Permitir selección múltiple
    
    fileInput.onchange = async (e) => {
      // Verificamos que hay archivos seleccionados
      if (e.target.files && e.target.files.length > 0) {
        try {
          setIsUploading(true);
          
          // IMPORTANTE: Crear array desde FileList para usar con agregarImagenes
          const archivos = Array.from(e.target.files);
          
          console.log("Archivos seleccionados:", archivos.length);
          archivos.forEach((file, index) => {
            console.log(`Archivo ${index+1}:`, file.name, file.type, file.size);
          });
          
          // Comprobar si hay archivos válidos
          if (archivos.some(file => !file.type.startsWith('image/'))) {
            alert("Por favor, selecciona solo archivos de imagen");
            setIsUploading(false);
            return;
          }
          
          // Subir las imágenes usando el servicio
          await imagenesService.agregarImagenes(establecimientoId, archivos);
          
          // Actualizar la vista tras subir las imágenes
          await obtenerFotosEstablecimiento(establecimientoId);
          
          // Mostrar notificación de éxito
          alert(`${archivos.length} imágenes subidas con éxito`);
        } catch (error) {
          console.error("Error al subir las imágenes:", error);
          if (error.response && error.response.data) {
            alert(`Error: ${error.response.data.message || "No se pudieron subir las imágenes"}`);
          } else {
            alert("Error al subir las imágenes: " + error.message);
          }
          setError("Error al subir las imágenes: " + error.message);
        } finally {
          setIsUploading(false);
        }
      } else {
        alert("No se seleccionaron archivos");
      }
    };
    
    fileInput.click();
  };

  // Modal para visualizar imagen seleccionada
  const ImageModal = () => {
    if (!selectedImage) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium">{selectedImage.tipo === 'principal' ? 'Imagen Principal' : 
              selectedImage.tipo === 'portada' ? 'Imagen de Portada' : 'Imagen de Galería'}</h3>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          <div className="p-4">
            <img 
              src={selectedImage.url} 
              alt={selectedImage.nombre} 
              className="max-w-full h-auto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300?text=Imagen+no+disponible";
              }}
            />
          </div>
          <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
            <button 
              onClick={() => handleEditImage(selectedImage)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
              disabled={isUploading}
            >
              <FaEdit className="mr-2" /> Editar
            </button>
            {selectedImage.tipo === 'galeria' && (
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  handleConfirmDelete(selectedImage);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md flex items-center"
                disabled={isUploading}
              >
                <FaTrash className="mr-2" /> Eliminar
              </button>
            )}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal para confirmar eliminación
  const DeleteConfirmationModal = () => {
    if (!imageToDelete) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-xl font-medium mb-4">Confirmar eliminación</h3>
          <p className="mb-6">
            ¿Estás seguro de que deseas eliminar esta imagen? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Cancelar
            </button>
            <button 
              onClick={handleDeleteImage}
              className="px-4 py-2 bg-red-500 text-white rounded-md flex items-center"
              disabled={loading}
            >
              {loading ? (
                <span className="mr-2 w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
              ) : (
                <FaTrash className="mr-2" />
              )}
              Eliminar
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar mensaje si no hay establecimiento
  if (!tieneEstablecimiento) {
    return (
      <div className="rounded-lg border border-gray-200 p-6 text-center">
        <FaImages size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium mb-2">No tienes un establecimiento registrado</h3>
        <p className="text-gray-500">
          Crea un establecimiento primero para poder gestionar sus fotos.
        </p>
      </div>
    );
  }

  // Renderizar mensaje de carga
  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando fotos...</p>
      </div>
    );
  }

  // Renderizar mensaje de error
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <div className="text-red-500 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2 text-red-700">Error al cargar las fotos</h3>
        <p className="text-red-600 mb-4">
          {error}
        </p>
        <button
          onClick={() => {
            setError(null);
            if (establecimientoId) obtenerFotosEstablecimiento(establecimientoId);
          }}
          className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Renderizar mensaje si no hay fotos
  if (fotos.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 p-6 text-center">
        <FaImages size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium mb-2">No hay fotos disponibles</h3>
        <p className="text-gray-500 mb-4">
          Aún no has subido fotos para tu establecimiento.
        </p>
        <button
          onClick={handleUploadNewImage}
          className="px-4 py-2 rounded-md text-white flex items-center mx-auto"
          style={{ backgroundColor: "#37a6ca" }}
          disabled={isUploading}
        >
          {isUploading ? (
            <span className="mr-2 w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
          ) : (
            <FaPlus size={16} className="mr-2" />
          )}
          Subir primera foto
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4">
      {/* Encabezado con botón de subir fotos */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium" style={{ color: "#254A5D" }}>
          Fotos del establecimiento ({fotos.length})
        </h3>
        <button
          onClick={handleUploadNewImage}
          className="px-4 py-2 rounded-md text-white flex items-center"
          style={{ backgroundColor: "#37a6ca" }}
          disabled={isUploading}
        >
          {isUploading ? (
            <span className="mr-2 w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
          ) : (
            <FaImages size={16} className="mr-2" />
          )}
          Subir fotos
        </button>
      </div>
      
      {/* Galería de imágenes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {fotos.map((foto) => (
          <div 
            key={foto.id} 
            className="group relative border border-gray-200 rounded-lg overflow-hidden"
            style={{ aspectRatio: '1/1' }}
          >
            <img 
              src={foto.url} 
              alt={foto.nombre}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error(`Error loading image: ${foto.url}`);
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300?text=Imagen+no+disponible";
              }}
            />
            
            {/* Etiqueta del tipo de imagen */}
            {foto.tipo !== 'galeria' && (
              <div 
                className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded"
              >
                {foto.tipo === 'principal' ? 'Principal' : 'Portada'}
              </div>
            )}
            
            {/* Overlay con botones */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenImage(foto)}
                  className="p-2 bg-white rounded-full"
                >
                  <FaImages size={16} style={{ color: "#254A5D" }} />
                </button>
                <button
                  onClick={() => handleEditImage(foto)}
                  className="p-2 bg-white rounded-full"
                  disabled={isUploading}
                >
                  <FaEdit size={16} style={{ color: "#37a6ca" }} />
                </button>
                {foto.tipo === 'galeria' && (
                  <button
                    onClick={() => handleConfirmDelete(foto)}
                    className="p-2 bg-white rounded-full"
                    disabled={isUploading}
                  >
                    <FaTrash size={16} className="text-red-500" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Modal para ver imagen seleccionada */}
      {isModalOpen && <ImageModal />}
      
      {/* Modal para confirmar eliminación */}
      {isDeleteModalOpen && <DeleteConfirmationModal />}
    </div>
  );
};

export default FotosEstablecimiento;