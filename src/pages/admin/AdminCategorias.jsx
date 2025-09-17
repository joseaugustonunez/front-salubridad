import { useState, useEffect } from "react";
import { obtenerCategorias, crearCategoria, eliminarCategoria, editarCategoria } from "../../api/categorias"
import { motion } from "framer-motion";
// Componente principal
export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Colores de la aplicación
  const colors = {
    primary: "#49C581",
    secondary: "#337179",
    dark: "#254A5D",
    accent: "#F8485E",
    light: "#37a6ca"
  };

  // Cargar datos al iniciar
  useEffect(() => {
    fetchCategorias();
  }, []);

  // Función para obtener todas las categorías
  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const data = await obtenerCategorias();
      setCategorias(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar las categorías. Por favor, intente nuevamente.");
      console.error("Error fetching categorias:", err);
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Abrir modal en modo edición
  const handleEdit = (categoria) => {
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      fechaCreacion: categoria.fechaCreacion,
      createdAt: categoria.createdAt
    });
    setCurrentId(categoria._id);
    setEditMode(true);
    setShowModal(true);
  };

  // Abrir modal para crear nueva categoría
  const handleOpenCreate = () => {
    setFormData({ nombre: "", descripcion: "" });
    setEditMode(false);
    setCurrentId(null);
    setShowModal(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  // Ejecutar eliminación
  const handleDelete = async () => {
    try {
      await eliminarCategoria(deleteId);
      setCategorias(categorias.filter(categoria => categoria._id !== deleteId));
      showNotification("Categoría eliminada con éxito", "success");
    } catch (err) {
      showNotification("Error al eliminar la categoría", "error");
      console.error("Error deleting categoria:", err);
    } finally {
      setShowConfirmDelete(false);
      setDeleteId(null);
    }
  };

  // Enviar formulario (crear o editar)
  const handleSubmit = async () => {
    try {
      if (editMode) {
        // Editar categoría existente
        const updatedCategoria = await editarCategoria(currentId, formData);
        setCategorias(categorias.map(cat => (cat._id === currentId ? updatedCategoria : cat)));
        showNotification("Categoría actualizada con éxito", "success");
      } else {
        // Crear nueva categoría
        const newCategoria = await crearCategoria(formData);
        setCategorias([...categorias, newCategoria]);
        showNotification("Categoría creada con éxito", "success");
      }
      setShowModal(false);
      setFormData({ nombre: "", descripcion: "" });
    } catch (err) {
      showNotification(`Error al ${editMode ? "actualizar" : "crear"} la categoría`, "error");
      console.error(`Error ${editMode ? "updating" : "creating"} categoria:`, err);
    }
  };

  // Mostrar notificación
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100  ">
      <div
        className="pt-32 pb-12 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.secondary} 100%)`,
        }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 text-center"
          >
            Gestión de <span style={{ color: colors.primary }}>Categorias</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-white/90 max-w-xl mx-auto mb-8 text-center"
          >
            Aquí puedes gestionar las Categorias de la aplicación
          </motion.p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 bg-white/20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 bg-white/20 -ml-20 -mb-20"></div>
      </div>
      <div className="min-h-screen mx-4">
        {/* Encabezado */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6" style={{ borderTop: `4px solid ${colors.primary}` }}>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold" style={{ color: colors.dark }}>Gestión de Categorías</h1>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-md text-white flex items-center gap-2"
              style={{ backgroundColor: colors.primary }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva Categoría
            </button>
          </div>
        </div>

        {/* Notificación */}
        {notification.show && (
          <div
            className={`fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
          >
            {notification.message}
          </div>
        )}

        {/* Lista de categorías */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2" style={{ borderColor: colors.secondary }}></div>
            </div>
          ) : error ? (
            <div className="text-center p-4 text-red-600">{error}</div>
          ) : categorias.length === 0 ? (
            <div className="text-center p-4 text-gray-500">No hay categorías disponibles</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b" style={{ borderColor: `${colors.light}40` }}>
                    <th className="px-4 py-3 text-left" style={{ color: colors.dark }}>Nombre</th>
                    <th className="px-4 py-3 text-left" style={{ color: colors.dark }}>Descripción</th>
                    <th className="px-4 py-3 text-left" style={{ color: colors.dark }}>Fecha Creación</th>
                    <th className="px-4 py-3 text-left" style={{ color: colors.dark }}>Última Actualización</th>
                    <th className="px-4 py-3 text-right" style={{ color: colors.dark }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((categoria) => (
                    <tr key={categoria._id} className="border-b hover:bg-gray-50" style={{ borderColor: `${colors.light}20` }}>
                      <td className="px-4 py-3 font-medium" style={{ color: colors.secondary }}>{categoria.nombre}</td>
                      <td className="px-4 py-3 text-gray-700">{categoria.descripcion}</td>
                      <td className="px-4 py-3 text-gray-700 text-sm">{formatDate(categoria.fechaCreacion)}</td>
                      <td className="px-4 py-3 text-gray-700 text-sm">{formatDate(categoria.updatedAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(categoria)}
                            className="p-1.5 rounded-md text-white"
                            style={{ backgroundColor: colors.light }}
                            title="Editar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleConfirmDelete(categoria._id)}
                            className="p-1.5 rounded-md text-white"
                            style={{ backgroundColor: colors.accent }}
                            title="Eliminar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal para crear/editar */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
              <div className="py-4 px-6" style={{ backgroundColor: colors.primary }}>
                <h3 className="text-lg font-medium text-white">{editMode ? "Editar Categoría" : "Crear Nueva Categoría"}</h3>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Categoría
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: `${colors.secondary}60` }}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: `${colors.secondary}60` }}
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 rounded-md text-white"
                    style={{ backgroundColor: editMode ? colors.light : colors.primary }}
                  >
                    {editMode ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmación de eliminación */}
        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
              <div className="py-4 px-6" style={{ backgroundColor: colors.accent }}>
                <h3 className="text-lg font-medium text-white">Confirmar Eliminación</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-6">¿Está seguro que desea eliminar esta categoría? Esta acción no se puede deshacer.</p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-md text-white"
                    style={{ backgroundColor: colors.accent }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}