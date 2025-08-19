import { useState, useEffect } from "react";
import { obtenerTipos, crearTipo, editarTipo, eliminarTipo } from "../../api/tipos"; // Asegúrate de que la ruta sea correcta
import { motion } from "framer-motion";


// Componente principal
export default function AdminTipos() {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ tipo_nombre: "" });
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
    fetchTipos();
  }, []);

  // Función para obtener todos los tipos
  const fetchTipos = async () => {
    try {
      setLoading(true);
      const data = await obtenerTipos();
      setTipos(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los tipos. Por favor, intente nuevamente.");
      console.error("Error fetching tipos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Abrir modal en modo edición
  const handleEdit = (tipo) => {
    setFormData({ tipo_nombre: tipo.tipo_nombre });
    setCurrentId(tipo._id);
    setEditMode(true);
    setShowModal(true);
  };

  // Abrir modal para crear nuevo tipo
  const handleOpenCreate = () => {
    setFormData({ tipo_nombre: "" });
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
      await eliminarTipo(deleteId);
      setTipos(tipos.filter(tipo => tipo._id !== deleteId));
      showNotification("Tipo eliminado con éxito", "success");
    } catch (err) {
      showNotification("Error al eliminar el tipo", "error");
      console.error("Error deleting tipo:", err);
    } finally {
      setShowConfirmDelete(false);
      setDeleteId(null);
    }
  };

  // Enviar formulario (crear o editar)
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    try {
      if (editMode) {
        // Editar tipo existente
        const updatedTipo = await editarTipo(currentId, formData);
        setTipos(tipos.map(tipo => (tipo._id === currentId ? updatedTipo : tipo)));
        showNotification("Tipo actualizado con éxito", "success");
      } else {
        // Crear nuevo tipo
        const newTipo = await crearTipo(formData);
        setTipos([...tipos, newTipo]);
        showNotification("Tipo creado con éxito", "success");
      }
      setShowModal(false);
      setFormData({ tipo_nombre: "" });
    } catch (err) {
      showNotification(`Error al ${editMode ? "actualizar" : "crear"} el tipo`, "error");
      console.error(`Error ${editMode ? "updating" : "creating"} tipo:`, err);
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
    <div className="min-h-screen bg-gray-100 ">
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
                 Gestión de <span style={{ color: colors.primary }}>Tipos</span>
               </motion.h1>
     
               <motion.p
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: 0.2 }}
                 className="text-lg text-white/90 max-w-xl mx-auto mb-8 text-center"
               >
                 Aquí puedes gestionar los Tipos de la aplicación
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
          <h1 className="text-2xl font-bold" style={{ color: colors.dark }}>Gestión de Tipos</h1>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-md text-white flex items-center gap-2"
            style={{ backgroundColor: colors.primary }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Tipo
          </button>
        </div>
      </div>

      {/* Notificación */}
      {notification.show && (
        <div 
          className={`fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${
            notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Lista de tipos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2" style={{ borderColor: colors.secondary }}></div>
          </div>
        ) : error ? (
          <div className="text-center p-4 text-red-600">{error}</div>
        ) : tipos.length === 0 ? (
          <div className="text-center p-4 text-gray-500">No hay tipos disponibles</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b" style={{ borderColor: `${colors.light}40` }}>
                  <th className="px-4 py-3 text-left" style={{ color: colors.dark }}>ID</th>
                  <th className="px-4 py-3 text-left" style={{ color: colors.dark }}>Nombre</th>
                  <th className="px-4 py-3 text-right" style={{ color: colors.dark }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tipos.map((tipo) => (
                  <tr key={tipo._id} className="border-b hover:bg-gray-50" style={{ borderColor: `${colors.light}20` }}>
                    <td className="px-4 py-3 text-gray-700 text-sm">{tipo._id}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: colors.secondary }}>{tipo.tipo_nombre}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(tipo)}
                          className="p-1.5 rounded-md text-white"
                          style={{ backgroundColor: colors.light }}
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleConfirmDelete(tipo._id)}
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
              <h3 className="text-lg font-medium text-white">{editMode ? "Editar Tipo" : "Crear Nuevo Tipo"}</h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label htmlFor="tipo_nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Tipo
                </label>
                <input
                  type="text"
                  id="tipo_nombre"
                  name="tipo_nombre"
                  value={formData.tipo_nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: `${colors.secondary}60` }}
                />
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
              <p className="text-gray-700 mb-6">¿Está seguro que desea eliminar este tipo? Esta acción no se puede deshacer.</p>
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