import { useState, useEffect } from 'react';
import { obtenerEstablecimientoPorId } from "../../api/establecimientos";
import { eliminarComentario } from "../../api/comentario";
import { SiTiktok } from 'react-icons/si';
import { Trash2, Edit, Save, X, ChevronDown, ChevronUp, Facebook, Instagram, Twitter, Youtube, Linkedin, MapPin, Phone, Clock, Star } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from "react-hot-toast";
const AdminEstablecimientoDetalle = () => {
  const [establecimiento, setEstablecimiento] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    ubicacion: true,
    horario: true,
    redesSociales: true,
    categorias: true,
    tipos: true,
    comentarios: true,
    estadisticas: true
  });
  const handleDeleteComment = async (comentarioId) => {
    try {
      // Llamar a la API para eliminar el comentario
      await eliminarComentario(comentarioId);
  
      // Actualizar el estado local para eliminar el comentario de la UI
      setEstablecimiento(prevEstablecimiento => ({
        ...prevEstablecimiento,
        comentarios: prevEstablecimiento.comentarios.filter(
          comentario => comentario._id !== comentarioId
        )
      }));
  
      // Mostrar notificación de éxito
      toast.success("Comentario eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
      toast.error("No se pudo eliminar el comentario");
    }
  };
  

  // Obtener datos del establecimiento
  useEffect(() => {
    const fetchEstablecimiento = async () => {
      try {
        const data = await obtenerEstablecimientoPorId(id);
        setEstablecimiento(data);
        setFormData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el establecimiento:", error);
        setLoading(false);
      }
    };
  
    if (id) {
      fetchEstablecimiento();
    }
  }, [id]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Si estamos saliendo del modo edición, resetear los datos
      setFormData(establecimiento);
    }
    setEditMode(!editMode);
  };

  const handleInputChange = (e, section = null, index = null) => {
    const { name, value } = e.target;
    
    if (section && index !== null) {
      // Actualizando arrays anidados (como ubicación, horario, etc.)
      setFormData(prev => {
        const newData = {...prev};
        newData[section][index] = {
          ...newData[section][index],
          [name]: value
        };
        return newData;
      });
    } else if (section) {
      // Actualizando objetos anidados (como redesSociales)
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }));
    } else {
      // Actualizando campos de nivel superior
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCoordenadasChange = (e, index) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newUbicacion = [...prev.ubicacion];
      newUbicacion[index] = {
        ...newUbicacion[index],
        coordenadas: {
          ...newUbicacion[index].coordenadas,
          [name]: parseFloat(value)
        }
      };
      return {
        ...prev,
        ubicacion: newUbicacion
      };
    });
  };

  const handleSaveChanges = async () => {
    try {
      // Aquí iría la lógica para guardar los cambios
      // await actualizarEstablecimiento(formData._id, formData);
      setEstablecimiento(formData);
      setEditMode(false);
      alert("Cambios guardados correctamente");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("Error al guardar los cambios");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-bold text-gray-700">Cargando...</div>
      </div>
    );
  }

  if (!establecimiento) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-bold text-red-500">No se encontró el establecimiento</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-900 text-white p-32 shadow-md" style={{ background: `linear-gradient(to right, #254A5D, #337179)` }}>
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <div className="flex space-x-4">
              {editMode ? (
                <>
                  <button
                    onClick={handleSaveChanges}
                    className="flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: "#49C581" }}
                  >
                    <Save size={18} className="mr-2" />
                    Guardar
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                  >
                    <X size={18} className="mr-2" />
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: "#37a6ca" }}
                >
                  <Edit size={18} className="mr-2" />
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {/* Banner and Basic Info */}
          <div className="relative h-64 bg-gray-300">
          {establecimiento.portada ? (
  <div
    className="w-full h-full bg-cover bg-center relative"
    style={{
      backgroundImage: `url(http://localhost:3000/uploads/${establecimiento.portada})`
    }}
  >
    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
  </div>
) : (
  <div className="flex items-center justify-center h-full bg-gray-200">
    <span className="text-gray-500 text-lg">Sin imagen de portada</span>
  </div>
)}
            
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-6">
              <div className="flex items-end">
                <div className="h-24 w-24 rounded-lg overflow-hidden border-4 border-white bg-white shadow-lg">
                  {establecimiento.imagen ? (
                    <img src={`http://localhost:3000/uploads/${establecimiento.imagen}`} alt={establecimiento.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-sm text-gray-500">Sin logo</span>
                    </div>
                  )}
                </div>
                <div className="ml-4 text-white">
                  <h2 className="text-2xl font-bold">{establecimiento.nombre}</h2>
                  <div className="flex items-center mt-1">
                    <Star size={16} fill="#F8485E" stroke="none" className="mr-1" />
                    <span className="font-medium">{establecimiento.promedioCalificaciones || "0.0"}</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm">{establecimiento.comentarios?.length || 0} reseñas</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm">{establecimiento.seguidores?.length || 0} seguidores</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 py-4 border-b" style={{ borderColor: "#337179" }}>
            <div className="flex space-x-6">
              <button 
                className={`pb-2 px-1 font-medium ${activeTab === 'general' ? 'border-b-2 text-teal-600' : 'text-gray-600'}`}
                style={{ borderColor: activeTab === 'general' ? "#49C581" : "transparent", color: activeTab === 'general' ? "#337179" : "" }}
                onClick={() => setActiveTab('general')}
              >
                Información General
              </button>
              <button 
                className={`pb-2 px-1 font-medium ${activeTab === 'media' ? 'border-b-2 text-teal-600' : 'text-gray-600'}`}
                style={{ borderColor: activeTab === 'media' ? "#49C581" : "transparent", color: activeTab === 'media' ? "#337179" : "" }}
                onClick={() => setActiveTab('media')}
              >
                Multimedia
              </button>
              <button 
                className={`pb-2 px-1 font-medium ${activeTab === 'comments' ? 'border-b-2 text-teal-600' : 'text-gray-600'}`}
                style={{ borderColor: activeTab === 'comments' ? "#49C581" : "transparent", color: activeTab === 'comments' ? "#337179" : "" }}
                onClick={() => setActiveTab('comments')}
              >
                Comentarios
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* General Info Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                {/* Información General */}
                <div className="bg-white border rounded-lg shadow-sm">
                  <div 
                    className="flex justify-between items-center p-4 cursor-pointer" 
                    onClick={() => toggleSection('general')}
                    style={{ backgroundColor: "#254A5D", color: "white" }}
                  >
                    <h3 className="text-lg font-medium">Información General</h3>
                    {expandedSections.general ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  
                  {expandedSections.general && (
                    <div className="p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                          {editMode ? (
                            <input
                              type="text"
                              name="nombre"
                              value={formData.nombre || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            />
                          ) : (
                            <p className="text-gray-900">{establecimiento.nombre}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                          {editMode ? (
                            <input
                              type="text"
                              name="telefono"
                              value={formData.telefono || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            />
                          ) : (
                            <p className="text-gray-900">{establecimiento.telefono}</p>
                          )}
                        </div>
                        
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                          {editMode ? (
                            <textarea
                              name="descripcion"
                              value={formData.descripcion || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                              rows="3"
                            />
                          ) : (
                            <p className="text-gray-900">{establecimiento.descripcion}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                          {editMode ? (
                            <select
                              name="estado"
                              value={formData.estado || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            >
                              <option value="pendiente">Pendiente</option>
                              <option value="aprobado">Aprobado</option>
                              <option value="rechazado">Rechazado</option>
                            </select>
                          ) : (
                            <p className="text-gray-900 capitalize">{establecimiento.estado}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Verificado</label>
                          {editMode ? (
                            <select
                              name="verificado"
                              value={formData.verificado.toString()}
                              onChange={(e) => setFormData({...formData, verificado: e.target.value === 'true'})}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            >
                              <option value="true">Sí</option>
                              <option value="false">No</option>
                            </select>
                          ) : (
                            <p className="text-gray-900">{establecimiento.verificado ? 'Sí' : 'No'}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Ubicación */}
                <div className="bg-white border rounded-lg shadow-sm">
                  <div 
                    className="flex justify-between items-center p-4 cursor-pointer" 
                    onClick={() => toggleSection('ubicacion')}
                    style={{ backgroundColor: "#337179", color: "white" }}
                  >
                    <h3 className="text-lg font-medium">Ubicación</h3>
                    {expandedSections.ubicacion ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  
                  {expandedSections.ubicacion && establecimiento.ubicacion && establecimiento.ubicacion.map((ubicacion, index) => (
                    <div className="p-4" key={ubicacion._id || index}>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                          {editMode ? (
                            <input
                              type="text"
                              name="direccion"
                              value={formData.ubicacion[index]?.direccion || ''}
                              onChange={(e) => handleInputChange(e, 'ubicacion', index)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            />
                          ) : (
                            <p className="text-gray-900">{ubicacion.direccion}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                          {editMode ? (
                            <input
                              type="text"
                              name="ciudad"
                              value={formData.ubicacion[index]?.ciudad || ''}
                              onChange={(e) => handleInputChange(e, 'ubicacion', index)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            />
                          ) : (
                            <p className="text-gray-900">{ubicacion.ciudad}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Distrito</label>
                          {editMode ? (
                            <input
                              type="text"
                              name="distrito"
                              value={formData.ubicacion[index]?.distrito || ''}
                              onChange={(e) => handleInputChange(e, 'ubicacion', index)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            />
                          ) : (
                            <p className="text-gray-900">{ubicacion.distrito}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                          {editMode ? (
                            <input
                              type="text"
                              name="codigoPostal"
                              value={formData.ubicacion[index]?.codigoPostal || ''}
                              onChange={(e) => handleInputChange(e, 'ubicacion', index)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            />
                          ) : (
                            <p className="text-gray-900">{ubicacion.codigoPostal}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Referencia</label>
                          {editMode ? (
                            <input
                              type="text"
                              name="referencia"
                              value={formData.ubicacion[index]?.referencia || ''}
                              onChange={(e) => handleInputChange(e, 'ubicacion', index)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            />
                          ) : (
                            <p className="text-gray-900">{ubicacion.referencia}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Latitud</label>
                          {editMode ? (
                            <input
                              type="number"
                              name="latitud"
                              step="0.000001"
                              value={formData.ubicacion[index]?.coordenadas?.latitud || 0}
                              onChange={(e) => handleCoordenadasChange(e, index)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            />
                          ) : (
                            <p className="text-gray-900">{ubicacion.coordenadas?.latitud}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Longitud</label>
                          {editMode ? (
                            <input
                              type="number"
                              name="longitud"
                              step="0.000001"
                              value={formData.ubicacion[index]?.coordenadas?.longitud || 0}
                              onChange={(e) => handleCoordenadasChange(e, index)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            />
                          ) : (
                            <p className="text-gray-900">{ubicacion.coordenadas?.longitud}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Horario */}
                <div className="bg-white border rounded-lg shadow-sm">
                  <div 
                    className="flex justify-between items-center p-4 cursor-pointer" 
                    onClick={() => toggleSection('horario')}
                    style={{ backgroundColor: "#49C581", color: "white" }}
                  >
                    <h3 className="text-lg font-medium">Horarios</h3>
                    {expandedSections.horario ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  
                  {expandedSections.horario && (
                    <div className="p-4">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Día</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salida</th>
                              {editMode && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {establecimiento.horario && establecimiento.horario.map((horario, index) => (
                              <tr key={horario._id || index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {editMode ? (
                                    <select
                                      name="dia"
                                      value={formData.horario[index]?.dia || ''}
                                      onChange={(e) => handleInputChange(e, 'horario', index)}
                                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                    >
                                      {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(dia => (
                                        <option key={dia} value={dia}>{dia}</option>
                                      ))}
                                    </select>
                                  ) : (
                                    horario.dia
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {editMode ? (
                                    <input
                                      type="time"
                                      name="entrada"
                                      value={formData.horario[index]?.entrada || ''}
                                      onChange={(e) => handleInputChange(e, 'horario', index)}
                                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                    />
                                  ) : (
                                    horario.entrada
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {editMode ? (
                                    <input
                                      type="time"
                                      name="salida"
                                      value={formData.horario[index]?.salida || ''}
                                      onChange={(e) => handleInputChange(e, 'horario', index)}
                                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                    />
                                  ) : (
                                    horario.salida
                                  )}
                                </td>
                                {editMode && (
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                      className="text-red-600 hover:text-red-900"
                                      onClick={() => {
                                        setFormData(prev => ({
                                          ...prev,
                                          horario: prev.horario.filter((_, i) => i !== index)
                                        }));
                                      }}
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                        {editMode && (
                          <button
                            className="mt-4 flex items-center text-teal-600 hover:text-teal-800"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                horario: [
                                  ...(prev.horario || []),
                                  { dia: 'Lunes', entrada: '09:00', salida: '18:00' }
                                ]
                              }));
                            }}
                            style={{ color: "#337179" }}
                          >
                            <span className="mr-1">+</span> Agregar horario
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Redes Sociales */}
                <div className="bg-white border rounded-lg shadow-sm">
                  <div 
                    className="flex justify-between items-center p-4 cursor-pointer" 
                    onClick={() => toggleSection('redesSociales')}
                    style={{ backgroundColor: "#F8485E", color: "white" }}
                  >
                    <h3 className="text-lg font-medium">Redes Sociales</h3>
                    {expandedSections.redesSociales ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  
                  {expandedSections.redesSociales && (
                    <div className="p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center mb-1">
                            <Facebook size={16} className="mr-2 text-blue-600" />
                            <label className="text-sm font-medium text-gray-700">Facebook</label>
                          </div>
                          {editMode ? (
                            <input
                              type="text"
                              name="facebook"
                              value={formData.redesSociales?.facebook || ''}
                              onChange={(e) => handleInputChange(e, 'redesSociales')}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            />
                          ) : (
                            <p className="text-gray-900">{establecimiento.redesSociales?.facebook}</p>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center mb-1">
                            <Instagram size={16} className="mr-2 text-pink-600" />
                            <label className="text-sm font-medium text-gray-700">Instagram</label>
                          </div>
                          {editMode ? (
                            <input
                              type="text"
                              name="instagram"
                              value={formData.redesSociales?.instagram || ''}
                              onChange={(e) => handleInputChange(e, 'redesSociales')}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            />
                          ) : (
                            <p className="text-gray-900">{establecimiento.redesSociales?.instagram}</p>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center mb-1">
                            <Twitter size={16} className="mr-2 text-blue-400" />
                            <label className="text-sm font-medium text-gray-700">Twitter</label>
                          </div>
                          {editMode ? (
                            <input
                              type="text"
                              name="twitter"
                              value={formData.redesSociales?.twitter || ''}
                              onChange={(e) => handleInputChange(e, 'redesSociales')}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            />
                          ) : (
                            <p className="text-gray-900">{establecimiento.redesSociales?.twitter}</p>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center mb-1">
                            <Youtube size={16} className="mr-2 text-red-600" />
                            <label className="text-sm font-medium text-gray-700">YouTube</label>
                          </div>
                          {editMode ? (
                            <input
                              type="text"
                              name="youtube"
                              value={formData.redesSociales?.youtube || ''}
                              onChange={(e) => handleInputChange(e, 'redesSociales')}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            />
                          ) : (
                            <p className="text-gray-900">{establecimiento.redesSociales?.youtube}</p>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center mb-1">
                            <SiTiktok size={16} className="mr-2 text-blac" />
                            <label className="text-sm font-medium text-gray-700">tiktok</label>
                          </div>
                          {editMode ? (
                            <input
                              type="text"
                              name="tiktok"
                              value={formData.redesSociales?.tiktok || ''}
                              onChange={(e) => handleInputChange(e, 'redesSociales')}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            />
                          ) : (
                            <p className="text-gray-900">{establecimiento.redesSociales?.tiktok}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Categorías */}
                <div className="bg-white border rounded-lg shadow-sm">
                  <div 
                    className="flex justify-between items-center p-4 cursor-pointer" 
                    onClick={() => toggleSection('categorias')}
                    style={{ backgroundColor: "#37a6ca", color: "white" }}
                  >
                    <h3 className="text-lg font-medium">Categorías</h3>
                    {expandedSections.categorias ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  
                  {expandedSections.categorias && (
                    <div className="p-4">
                      {establecimiento.categoria && establecimiento.categoria.length > 0 ? (
                        <div className="space-y-2">
                          {establecimiento.categoria.map((cat, index) => (
                            <div key={cat._id || index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                              <div>
                                <p className="font-medium">{cat.nombre}</p>
                                <p className="text-sm text-gray-500">{cat.descripcion}</p>
                              </div>
                              {editMode && (
                                <button
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      categoria: prev.categoria.filter((_, i) => i !== index)
                                    }));
                                  }}
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          ))}
                          
                          {editMode && (
                            <button
                              className="mt-2 flex items-center text-teal-600 hover:text-teal-800"
                              style={{ color: "#337179" }}
                              // Aquí iría la lógica para agregar categoría
                            >
                              <span className="mr-1">+</span> Agregar categoría
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500">No hay categorías asignadas</p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Tipos */}
                <div className="bg-white border rounded-lg shadow-sm">
                  <div 
                    className="flex justify-between items-center p-4 cursor-pointer" 
                    onClick={() => toggleSection('tipos')}
                    style={{ backgroundColor: "#254A5D", color: "white" }}
                  >
                    <h3 className="text-lg font-medium">Tipos</h3>
                    {expandedSections.tipos ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  
                  {expandedSections.tipos && (
                    <div className="p-4">
                      {establecimiento.tipo && establecimiento.tipo.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {establecimiento.tipo.map((tip, index) => (
                            <div key={tip._id || index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                              <span className="text-sm font-medium">{tip.tipo_nombre}</span>
                              {editMode && (
                                <button
                                  className="ml-2 text-red-600 hover:text-red-900"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      tipo: prev.tipo.filter((_, i) => i !== index)
                                    }));
                                  }}
                                >
                                  <X size={14} />
                                </button>
                              )}
                            </div>
                          ))}
                          
                          {editMode && (
                            <button
                              className="flex items-center bg-teal-50 text-teal-700 rounded-full px-3 py-1 hover:bg-teal-100"
                              style={{ color: "#337179" }}
                              // Aquí iría la lógica para agregar tipo
                            >
                              <span className="mr-1">+</span> Agregar tipo
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500">No hay tipos asignados</p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Estadísticas */}
                <div className="bg-white border rounded-lg shadow-sm">
                  <div 
                    className="flex justify-between items-center p-4 cursor-pointer" 
                    onClick={() => toggleSection('estadisticas')}
                    style={{ backgroundColor: "#49C581", color: "white" }}
                  >
                    <h3 className="text-lg font-medium">Estadísticas</h3>
                    {expandedSections.estadisticas ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  
                  {expandedSections.estadisticas && (
                    <div className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold" style={{ color: "#337179" }}>{establecimiento.likes?.length || 0}</p>
                          <p className="text-sm text-gray-600">Me gusta</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold" style={{ color: "#337179" }}>{establecimiento.seguidores?.length || 0}</p>
                          <p className="text-sm text-gray-600">Seguidores</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold" style={{ color: "#337179" }}>{establecimiento.comentarios?.length || 0}</p>
                          <p className="text-sm text-gray-600">Comentarios</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold" style={{ color: "#337179" }}>{establecimiento.promedioCalificaciones || "0.0"}</p>
                          <p className="text-sm text-gray-600">Calificación</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Multimedia Tab */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                <div className="bg-white border rounded-lg shadow-sm">
                  <div className="p-4" style={{ backgroundColor: "#337179", color: "white" }}>
                    <h3 className="text-lg font-medium">Imagen Principal</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-24 w-24 rounded-lg overflow-hidden bg-gray-200">
                        {establecimiento.imagen ? (
                          <img 
                            src={`http://localhost:3000/uploads/${establecimiento.imagen}`} 
                            alt="Imagen principal" 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-100">
                            <span className="text-sm text-gray-500">Sin imagen</span>
                          </div>
                        )}
                      </div>
                      
                      {editMode && (
                        <div>
                          <input
                            type="file"
                            id="imagen"
                            accept="image/*"
                            className="hidden"
                            // Aquí iría la lógica para subir imagen
                          />
                          <label 
                            htmlFor="imagen"
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-md cursor-pointer inline-block"
                            style={{ backgroundColor: "#e6f7ff", color: "#337179" }}
                          >
                            Cambiar imagen
                          </label>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Imagen principal del establecimiento (logo)</p>
                  </div>
                </div>
                
                <div className="bg-white border rounded-lg shadow-sm">
                  <div className="p-4" style={{ backgroundColor: "#254A5D", color: "white" }}>
                    <h3 className="text-lg font-medium">Imagen de Portada</h3>
                  </div>
                  <div className="p-4">
                    <div className="h-40 rounded-lg overflow-hidden bg-gray-200">
                      {establecimiento.portada ? (
                        <img 
                          src={`http://localhost:3000/uploads/${establecimiento.portada}`} 
                          alt="Imagen de portada" 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100">
                          <span className="text-sm text-gray-500">Sin imagen de portada</span>
                        </div>
                      )}
                    </div>
                    
                    {editMode && (
                      <div className="mt-3">
                        <input
                          type="file"
                          id="portada"
                          accept="image/*"
                          className="hidden"
                          // Aquí iría la lógica para subir portada
                        />
                        <label 
                          htmlFor="portada"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-md cursor-pointer inline-block"
                          style={{ backgroundColor: "#e6f7ff", color: "#337179" }}
                        >
                          Cambiar portada
                        </label>
                      </div>
                    )}
                    <p className="mt-2 text-sm text-gray-500">Imagen de portada del establecimiento</p>
                  </div>
                </div>
                
                <div className="bg-white border rounded-lg shadow-sm">
                  <div className="p-4" style={{ backgroundColor: "#F8485E", color: "white" }}>
                    <h3 className="text-lg font-medium">Galería de Imágenes</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {establecimiento.imagenes && establecimiento.imagenes.length > 0 ? (
                        establecimiento.imagenes.map((img, index) => (
                          <div key={index} className="relative group">
                            <div className="h-32 rounded-lg overflow-hidden bg-gray-200">
                              <img 
                                src={`http://localhost:3000/uploads/${img}`} 
                                alt={`Imagen ${index + 1}`} 
                                className="h-full w-full object-cover" 
                              />
                            </div>
                            {editMode && (
                              <button
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    imagenes: prev.imagenes.filter((_, i) => i !== index)
                                  }));
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="col-span-4 text-center py-8">
                          <p className="text-gray-500">No hay imágenes en la galería</p>
                        </div>
                      )}
                      
                      {editMode && (
                        <div className="h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <input
                            type="file"
                            id="galeria"
                            accept="image/*"
                            className="hidden"
                            // Aquí iría la lógica para subir imagen a la galería
                          />
                          <label 
                            htmlFor="galeria"
                            className="text-gray-500 hover:text-gray-700 cursor-pointer text-center p-4"
                          >
                            <span className="block text-xl mb-1">+</span>
                            <span className="text-sm">Agregar imagen</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Comentarios ({establecimiento.comentarios?.length || 0})</h3>
                  {editMode && establecimiento.comentarios?.length > 0 && (
                    <button
                      className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                      onClick={() => {
                        if (window.confirm("¿Estás seguro de que deseas eliminar todos los comentarios? Esta acción no se puede deshacer.")) {
                          setFormData(prev => ({
                            ...prev,
                            comentarios: []
                          }));
                        }
                      }}
                    >
                      <Trash2 size={14} className="mr-1" /> Eliminar todos
                    </button>
                  )}
                </div>
                
                {establecimiento.comentarios && establecimiento.comentarios.length > 0 ? (
                  <div className="space-y-4">
                    {establecimiento.comentarios.map((comentario) => (
                      <div key={comentario._id} className="bg-white border rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 font-medium">{comentario.usuario?.nombreUsuario?.[0] || '?'}</span>
                            </div>
                            <div>
                              <p className="font-medium">{comentario.usuario?.nombreUsuario || 'Usuario eliminado'}</p>
                              <div className="flex items-center mt-1">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      size={16} 
                                      fill={star <= comentario.calificacion ? "#F8485E" : "transparent"}
                                      stroke={star <= comentario.calificacion ? "none" : "#D1D5DB"}
                                      className="mr-1" 
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-2">
                                  {new Date(comentario.fecha).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {editMode && (
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDeleteComment(comentario._id)}
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                        <p className="mt-3 text-gray-700">{comentario.comentario}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-500">No hay comentarios para este establecimiento</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEstablecimientoDetalle;