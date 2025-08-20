import { useState, useEffect } from 'react';
import { obtenerEstablecimientoPorId } from "../../api/establecimientos";
import { eliminarComentario } from "../../api/comentario";
import { SiTiktok } from 'react-icons/si';
import { useParams } from 'react-router-dom';
import { 
  Trash2, Edit, Save, X, ChevronDown, ChevronUp, 
  Facebook, Instagram, Twitter, Youtube, Linkedin, 
  MapPin, Phone, Clock, Star, Calendar, Users,
  Heart, MessageCircle, Eye, Building2, Award,
  Camera, Image as ImageIcon, Upload
} from 'lucide-react';
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
 const tabConfig = [
    { key: 'general', label: 'Información General', icon: Building2 },
    { key: 'media', label: 'Multimedia', icon: ImageIcon },
    { key: 'comments', label: 'Comentarios', icon: MessageCircle }
  ];
const socialIcons = {
    facebook: { icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
    instagram: { icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
    twitter: { icon: Twitter, color: 'text-sky-500', bg: 'bg-sky-50' },
    youtube: { icon: Youtube, color: 'text-red-600', bg: 'bg-red-50' },
    tiktok: { icon: SiTiktok, color: 'text-gray-800', bg: 'bg-gray-50' }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header */}
  <div className="bg-gradient-to-br from-[#254A5D] via-[#337179] to-[#49C581] text-white shadow-2xl">
  <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-24 sm:py-20 md:py-24 lg:py-40">
    <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6 text-center sm:text-left">
        <div className="p-3 sm:p-4 bg-white/10 rounded-xl backdrop-blur-sm">
          <Building2 size={32} className="text-white sm:w-8 sm:h-8 md:w-10 md:h-10" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold mb-1 sm:mb-2">
            Panel de Administración
          </h1>
          <p className="text-slate-200 text-sm sm:text-base md:text-lg">
            Gestión de establecimiento
          </p>
        </div>
      </div>
                      
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 md:space-x-4 w-full sm:w-auto">
        {editMode ? (
          <>
            <button
              onClick={handleSaveChanges}
              className="flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl font-medium text-sm sm:text-base transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Save size={16} className="mr-2 sm:mr-3 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Guardar Cambios</span>
              <span className="sm:hidden">Guardar</span>
            </button>
            <button
              onClick={handleEditToggle}
              className="flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-slate-500 hover:bg-slate-600 rounded-xl font-medium text-sm sm:text-base transition-all duration-200 shadow-lg"
            >
              <X size={16} className="mr-2 sm:mr-3 sm:w-5 sm:h-5" />
              Cancelar
            </button>
          </>
        ) : (
          <button
            onClick={handleEditToggle}
            className="flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl font-medium text-sm sm:text-base transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Edit size={16} className="mr-2 sm:mr-3 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Editar Establecimiento</span>
            <span className="sm:hidden">Editar</span>
          </button>
        )}
      </div>
    </div>
  </div>
</div>
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-80 bg-gradient-to-r from-slate-900 to-blue-900">
            {establecimiento.portada ? (
              <div
                className="w-full h-full bg-cover bg-center relative"
                style={{
                  backgroundImage: `url(https://back-salubridad.sistemasudh.com/uploads/${establecimiento.portada})`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-r from-slate-800 to-blue-800">
                <Camera size={64} className="text-white/50" />
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 w-full p-8">
              <div className="flex items-end space-x-6">
                <div className="relative">
                  <div className="h-28 w-28 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white">
                    {establecimiento.imagen ? (
                      <img 
                      src={`https://back-salubridad.sistemasudh.com/uploads/${establecimiento.imagen}`}
                        alt={establecimiento.nombre} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <Building2 size={32} className="text-slate-400" />
                      </div>
                    )}
                  </div>
                  {establecimiento.verificado && (
                    <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-2 shadow-lg">
                      <Award size={16} className="text-white" />
                    </div>
                  )}
                </div>
                
               <div className="text-white flex-1">
  <h2 className="text-2xl sm:text-3xl font-bold mb-2">{establecimiento.nombre}</h2>
  <div className="flex flex-wrap gap-2 sm:gap-6 text-xs sm:text-sm">
    <div className="flex items-center bg-white/20 rounded-full px-2 sm:px-3 py-1 backdrop-blur-sm">
      <Star size={14} fill="#fbbf24" stroke="none" className="mr-1" />
      <span className="font-medium">{establecimiento.promedioCalificaciones}</span>
    </div>
    <div className="flex items-center bg-white/20 rounded-full px-2 sm:px-3 py-1 backdrop-blur-sm">
      <MessageCircle size={14} className="mr-1" />
      <span>{establecimiento.comentarios?.length || 0} reseñas</span>
    </div>
    <div className="flex items-center bg-white/20 rounded-full px-2 sm:px-3 py-1 backdrop-blur-sm">
      <Users size={14} className="mr-1" />
      <span>{establecimiento.seguidores?.length || 0} seguidores</span>
    </div>
    <div className="flex items-center bg-white/20 rounded-full px-2 sm:px-3 py-1 backdrop-blur-sm">
      <Heart size={14} className="mr-1" />
      <span>{establecimiento.likes?.length || 0} likes</span>
    </div>
  </div>
</div>
              </div>
            </div>
          </div>

          {/* Modern Tabs */}
       <div className="border-b border-slate-200 bg-slate-50/50">
  <div className="flex justify-center sm:justify-start space-x-4 sm:space-x-8 px-4 sm:px-8 overflow-x-auto scrollbar-hide">
    {tabConfig.map(({ key, label, icon: Icon }) => (
      <button
        key={key}
        className={`flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 py-3 px-4 border-b-2 font-medium transition-all duration-200
          ${activeTab === key
            ? 'border-blue-500 text-blue-600 bg-blue-50/50 rounded-t-lg'
            : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300'
          }`}
        onClick={() => setActiveTab(key)}
      >
        <Icon size={18} />
        <span className="hidden sm:inline">{label}</span> {/* Texto solo visible en pantallas sm+ */}
        {key === 'comments' && establecimiento.comentarios?.length > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-1">
            {establecimiento.comentarios.length}
          </span>
        )}
      </button>
    ))}
  </div>
</div>


          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'general' && (
              <div className="space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Me gusta', value: establecimiento.likes?.length || 0, color: 'bg-red-500', icon: Heart },
                    { label: 'Seguidores', value: establecimiento.seguidores?.length || 0, color: 'bg-blue-500', icon: Users },
                    { label: 'Comentarios', value: establecimiento.comentarios?.length || 0, color: 'bg-emerald-500', icon: MessageCircle },
                    { label: 'Calificación', value: establecimiento.promedioCalificaciones || "0.0", color: 'bg-amber-500', icon: Star }
                  ].map((stat, index) => (
                    <div key={index} className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                          <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
                        </div>
                        <div className={`${stat.color} p-3 rounded-xl`}>
                          <stat.icon size={24} className="text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Información General */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-slate-600 to-blue-600 text-white"
                    onClick={() => toggleSection('general')}
                  >
                    <div className="flex items-center space-x-3">
                      <Building2 size={20} />
                      <h3 className="text-lg font-semibold">Información General</h3>
                    </div>
                    {expandedSections.general ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  
                  {expandedSections.general && (
                    <div className="p-6 bg-white">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Nombre del Establecimiento</label>
                          {editMode ? (
                            <input
                              type="text"
                              name="nombre"
                              value={formData.nombre || ''}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">{establecimiento.nombre}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Teléfono de Contacto</label>
                          {editMode ? (
                            <input
                              type="text"
                              name="telefono"
                              value={formData.telefono || ''}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-3 rounded-lg flex items-center">
                              <Phone size={16} className="mr-2 text-slate-500" />
                              {establecimiento.telefono}
                            </p>
                          )}
                        </div>
                        
                        <div className="col-span-2 space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Descripción</label>
                          {editMode ? (
                            <textarea
                              name="descripcion"
                              value={formData.descripcion || ''}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              rows="4"
                            />
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-3 rounded-lg leading-relaxed">{establecimiento.descripcion}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Estado</label>
                          {editMode ? (
                            <select
                              name="estado"
                              value={formData.estado || ''}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            >
                              <option value="pendiente">Pendiente</option>
                              <option value="aprobado">Aprobado</option>
                              <option value="rechazado">Rechazado</option>
                            </select>
                          ) : (
                            <div className="bg-slate-50 p-3 rounded-lg">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                establecimiento.estado === 'aprobado' ? 'bg-emerald-100 text-emerald-800' :
                                establecimiento.estado === 'rechazado' ? 'bg-red-100 text-red-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {establecimiento.estado === 'aprobado' ? '✓ Aprobado' :
                                 establecimiento.estado === 'rechazado' ? '✗ Rechazado' :
                                 '⏳ Pendiente'}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Verificado</label>
                          {editMode ? (
                            <select
                              name="verificado"
                              value={formData.verificado?.toString() || 'false'}
                              onChange={(e) => setFormData({...formData, verificado: e.target.value === 'true'})}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            >
                              <option value="true">Verificado</option>
                              <option value="false">No verificado</option>
                            </select>
                          ) : (
                            <div className="bg-slate-50 p-3 rounded-lg">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                establecimiento.verificado ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                              }`}>
                                {establecimiento.verificado ? (
                                  <>
                                    <Award size={12} className="mr-1" />
                                    Verificado
                                  </>
                                ) : (
                                  'No verificado'
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ubicación */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl shadow-lg overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                    onClick={() => toggleSection('ubicacion')}
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin size={20} />
                      <h3 className="text-lg font-semibold">Ubicación</h3>
                    </div>
                    {expandedSections.ubicacion ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  
                  {expandedSections.ubicacion && establecimiento.ubicacion && establecimiento.ubicacion.map((ubicacion, index) => (
                    <div className="p-6 bg-white" key={ubicacion._id || index}>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Dirección Completa</label>
                          {editMode ? (
                            <input
                              type="text"
                              name="direccion"
                              value={formData.ubicacion?.[index]?.direccion || ''}
                              onChange={(e) => handleInputChange(e, 'ubicacion', index)}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                            />
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-3 rounded-lg flex items-center">
                              <MapPin size={16} className="mr-2 text-slate-500" />
                              {ubicacion.direccion}
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Ciudad</label>
                          {editMode ? (
                            <input
                              type="text"
                              name="ciudad"
                              value={formData.ubicacion?.[index]?.ciudad || ''}
                              onChange={(e) => handleInputChange(e, 'ubicacion', index)}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                            />
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">{ubicacion.ciudad}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Distrito</label>
                          {editMode ? (
                            <input
                              type="text"
                              name="distrito"
                              value={formData.ubicacion?.[index]?.distrito || ''}
                              onChange={(e) => handleInputChange(e, 'ubicacion', index)}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                            />
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">{ubicacion.distrito}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Código Postal</label>
                          {editMode ? (
                            <input
                              type="text"
                              name="codigoPostal"
                              value={formData.ubicacion?.[index]?.codigoPostal || ''}
                              onChange={(e) => handleInputChange(e, 'ubicacion', index)}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                            />
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">{ubicacion.codigoPostal}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Referencia</label>
                          {editMode ? (
                            <input
                              type="text"
                              name="referencia"
                              value={formData.ubicacion?.[index]?.referencia || ''}
                              onChange={(e) => handleInputChange(e, 'ubicacion', index)}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                            />
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">{ubicacion.referencia}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Latitud</label>
                          {editMode ? (
                            <input
                              type="number"
                              name="latitud"
                              step="0.000001"
                              value={formData.ubicacion?.[index]?.coordenadas?.latitud || 0}
                              onChange={(e) => handleCoordenadasChange(e, index)}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                            />
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-3 rounded-lg font-mono">{ubicacion.coordenadas?.latitud}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-700">Longitud</label>
                          {editMode ? (
                            <input
                              type="number"
                              name="longitud"
                              step="0.000001"
                              value={formData.ubicacion?.[index]?.coordenadas?.longitud || 0}
                              onChange={(e) => handleCoordenadasChange(e, index)}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                            />
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-3 rounded-lg font-mono">{ubicacion.coordenadas?.longitud}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Horarios */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-lg overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    onClick={() => toggleSection('horario')}
                  >
                    <div className="flex items-center space-x-3">
                      <Clock size={20} />
                      <h3 className="text-lg font-semibold">Horarios de Atención</h3>
                    </div>
                    {expandedSections.horario ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  
                  {expandedSections.horario && (
                    <div className="p-6 bg-white">
                      <div className="space-y-4">
                        {establecimiento.horario && establecimiento.horario.map((horario, index) => (
                          <div key={horario._id || index} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
                            <div className="flex items-center space-x-4 flex-1">
                              <div className="min-w-0 flex-1">
                                <label className="block text-xs font-medium text-slate-500 mb-1">Día</label>
                                {editMode ? (
                                  <select
                                    name="dia"
                                    value={formData.horario?.[index]?.dia || ''}
                                    onChange={(e) => handleInputChange(e, 'horario', index)}
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  >
                                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(dia => (
                                      <option key={dia} value={dia}>{dia}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <p className="font-semibold text-slate-800">{horario.dia}</p>
                                )}
                              </div>
                              
                              <div className="min-w-0 flex-1">
                                <label className="block text-xs font-medium text-slate-500 mb-1">Apertura</label>
                                {editMode ? (
                                  <input
                                    type="time"
                                    name="entrada"
                                    value={formData.horario?.[index]?.entrada || ''}
                                    onChange={(e) => handleInputChange(e, 'horario', index)}
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  />
                                ) : (
                                  <p className="font-medium text-emerald-600">{horario.entrada}</p>
                                )}
                              </div>
                              
                              <div className="min-w-0 flex-1">
                                <label className="block text-xs font-medium text-slate-500 mb-1">Cierre</label>
                                {editMode ? (
                                  <input
                                    type="time"
                                    name="salida"
                                    value={formData.horario?.[index]?.salida || ''}
                                    onChange={(e) => handleInputChange(e, 'horario', index)}
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  />
                                ) : (
                                  <p className="font-medium text-red-600">{horario.salida}</p>
                                )}
                              </div>
                            </div>
                            
                            {editMode && (
                              <button
                                className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    horario: prev.horario?.filter((_, i) => i !== index) || []
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
                            className="w-full p-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:text-blue-800 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center space-x-2"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                horario: [
                                  ...(prev.horario || []),
                                  { dia: 'Lunes', entrada: '09:00', salida: '18:00' }
                                ]
                              }));
                            }}
                          >
                            <Calendar size={18} />
                            <span className="font-medium">Agregar nuevo horario</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Redes Sociales */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl shadow-lg overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    onClick={() => toggleSection('redesSociales')}
                  >
                    <div className="flex items-center space-x-3">
                      <Instagram size={20} />
                      <h3 className="text-lg font-semibold">Redes Sociales</h3>
                    </div>
                    {expandedSections.redesSociales ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  
                  {expandedSections.redesSociales && (
                    <div className="p-6 bg-white">
                      <div className="grid md:grid-cols-2 gap-6">
                        {Object.entries(socialIcons).map(([platform, config]) => {
                          const IconComponent = config.icon;
                          return (
                            <div key={platform} className="space-y-2">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className={`${config.bg} p-2 rounded-lg`}>
                                  <IconComponent size={16} className={config.color} />
                                </div>
                                <label className="text-sm font-semibold text-slate-700 capitalize">{platform}</label>
                              </div>
                              {editMode ? (
                                <input
                                  type="text"
                                  name={platform}
                                  value={formData.redesSociales?.[platform] || ''}
                                  onChange={(e) => handleInputChange(e, 'redesSociales')}
                                  placeholder={`URL de ${platform}`}
                                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                />
                              ) : (
                                <div className="bg-slate-50 p-3 rounded-lg">
                                  {establecimiento.redesSociales?.[platform] ? (
                                    <a 
                                      href={establecimiento.redesSociales[platform]} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 break-all"
                                    >
                                      {establecimiento.redesSociales[platform]}
                                    </a>
                                  ) : (
                                    <span className="text-slate-500 italic">No configurado</span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Categorías */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl shadow-lg overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                    onClick={() => toggleSection('categorias')}
                  >
                    <div className="flex items-center space-x-3">
                      <Building2 size={20} />
                      <h3 className="text-lg font-semibold">Categorías</h3>
                    </div>
                    {expandedSections.categorias ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  
                  {expandedSections.categorias && (
                    <div className="p-6 bg-white">
                      {establecimiento.categoria && establecimiento.categoria.length > 0 ? (
                        <div className="space-y-4">
                          {establecimiento.categoria.map((cat, index) => (
                            <div key={cat._id || index} className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                              <div className="flex-1">
                                <h4 className="font-semibold text-slate-800">{cat.nombre}</h4>
                                <p className="text-sm text-slate-600 mt-1">{cat.descripcion}</p>
                              </div>
                              {editMode && (
                                <button
                                  className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      categoria: prev.categoria?.filter((_, i) => i !== index) || []
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
                              className="w-full p-4 border-2 border-dashed border-amber-300 rounded-lg text-amber-600 hover:text-amber-800 hover:border-amber-400 hover:bg-amber-50 transition-all duration-200 flex items-center justify-center space-x-2"
                            >
                              <Building2 size={18} />
                              <span className="font-medium">Agregar nueva categoría</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
                          <p className="text-slate-500">No hay categorías asignadas</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Tipos */}
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl shadow-lg overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
                    onClick={() => toggleSection('tipos')}
                  >
                    <div className="flex items-center space-x-3">
                      <Award size={20} />
                      <h3 className="text-lg font-semibold">Tipos de Establecimiento</h3>
                    </div>
                    {expandedSections.tipos ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  
                  {expandedSections.tipos && (
                    <div className="p-6 bg-white">
                      {establecimiento.tipo && establecimiento.tipo.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {establecimiento.tipo.map((tip, index) => (
                            <div key={tip._id || index} className="flex items-center bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full px-4 py-2 border border-teal-200">
                              <span className="text-sm font-medium text-teal-800">{tip.tipo_nombre}</span>
                              {editMode && (
                                <button
                                  className="ml-2 text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-all duration-200"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      tipo: prev.tipo?.filter((_, i) => i !== index) || []
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
                              className="flex items-center bg-teal-50 text-teal-700 rounded-full px-4 py-2 hover:bg-teal-100 border-2 border-dashed border-teal-300 hover:border-teal-400 transition-all duration-200"
                            >
                              <span className="mr-1">+</span> 
                              <span className="text-sm font-medium">Agregar tipo</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Award size={48} className="mx-auto text-slate-300 mb-4" />
                          <p className="text-slate-500">No hay tipos asignados</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Multimedia Tab */}
            {activeTab === 'media' && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Imagen Principal */}
                  <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <div className="flex items-center space-x-3">
                        <Camera size={20} />
                        <h3 className="text-lg font-semibold">Imagen Principal</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="h-32 w-32 rounded-xl overflow-hidden bg-slate-200 shadow-lg">
                          {establecimiento.imagen ? (
                            <img 
                               src={`https://back-salubridad.sistemasudh.com/uploads/${establecimiento.imagen}`} 
                              alt="Imagen principal" 
                              className="h-full w-full object-cover" 
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-slate-100">
                              <Building2 size={32} className="text-slate-400" />
                            </div>
                          )}
                        </div>
                        
                        {editMode && (
                          <div className="w-full">
                            <input
                              type="file"
                              id="imagen"
                              accept="image/*"
                              className="hidden"
                            />
                            <label 
                              htmlFor="imagen"
                              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg cursor-pointer inline-block text-center font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                            >
                              <Upload size={18} />
                              <span>Cambiar imagen</span>
                            </label>
                          </div>
                        )}
                        <p className="text-sm text-slate-500 text-center">Logo o imagen representativa del establecimiento</p>
                      </div>
                    </div>
                  </div>

                  {/* Imagen de Portada */}
                  <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <div className="flex items-center space-x-3">
                        <ImageIcon size={20} />
                        <h3 className="text-lg font-semibold">Imagen de Portada</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-col space-y-4">
                        <div className="h-40 rounded-xl overflow-hidden bg-slate-200 shadow-lg">
                          {establecimiento.portada ? (
                            <img 
                              src={`https://back-salubridad.sistemasudh.com/uploads/${establecimiento.portada}`}
                              alt="Imagen de portada" 
                              className="h-full w-full object-cover" 
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-slate-100">
                              <ImageIcon size={48} className="text-slate-400" />
                            </div>
                          )}
                        </div>
                        
                        {editMode && (
                          <div>
                            <input
                              type="file"
                              id="portada"
                              accept="image/*"
                              className="hidden"
                            />
                            <label 
                              htmlFor="portada"
                              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-4 py-3 rounded-lg cursor-pointer inline-block text-center font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                            >
                              <Upload size={18} />
                              <span>Cambiar portada</span>
                            </label>
                          </div>
                        )}
                        <p className="text-sm text-slate-500">Imagen de fondo para el perfil del establecimiento</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Galería de Imágenes */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <ImageIcon size={20} />
                        <h3 className="text-lg font-semibold">Galería de Imágenes</h3>
                      </div>
                      <span className="text-emerald-200 text-sm">{establecimiento.imagenes?.length || 0} imágenes</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {establecimiento.imagenes && establecimiento.imagenes.length > 0 ? (
                        establecimiento.imagenes.map((img, index) => (
                          <div key={index} className="relative group">
                            <div className="h-32 rounded-xl overflow-hidden bg-slate-200 shadow-lg">
                              <img 
                                  src={`https://back-salubridad.sistemasudh.com/uploads/${img}`} 
                                alt={`Imagen ${index + 1}`} 
                                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110" 
                              />
                            </div>
                            {editMode && (
                              <button
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    imagenes: prev.imagenes?.filter((_, i) => i !== index) || []
                                  }));
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        ))
                      ) : null}
                      
                      {editMode && (
                        <div className="h-32 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50 flex items-center justify-center transition-all duration-200 cursor-pointer">
                          <input
                            type="file"
                            id="galeria"
                            accept="image/*"
                            className="hidden"
                          />
                          <label 
                            htmlFor="galeria"
                            className="text-slate-500 hover:text-emerald-600 cursor-pointer text-center p-4 w-full h-full flex flex-col items-center justify-center"
                          >
                            <Upload size={24} className="mb-2" />
                            <span className="text-sm font-medium">Agregar imagen</span>
                          </label>
                        </div>
                      )}
                    </div>
                    
                    {(!establecimiento.imagenes || establecimiento.imagenes.length === 0) && !editMode && (
                      <div className="text-center py-16">
                        <ImageIcon size={64} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500 text-lg">No hay imágenes en la galería</p>
                        <p className="text-slate-400 text-sm mt-2">Las imágenes aparecerán aquí una vez que sean agregadas</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Comentarios y Reseñas</h3>
                    <p className="text-slate-600">Gestiona las reseñas de los usuarios</p>
                  </div>
                  {editMode && establecimiento.comentarios?.length > 0 && (
                    <button
                      className="flex items-center space-x-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                      onClick={() => {
                        if (window.confirm("¿Estás seguro de que deseas eliminar todos los comentarios? Esta acción no se puede deshacer.")) {
                          setFormData(prev => ({
                            ...prev,
                            comentarios: []
                          }));
                        }
                      }}
                    >
                      <Trash2 size={16} />
                      <span>Eliminar todos</span>
                    </button>
                  )}
                </div>
                
                {establecimiento.comentarios && establecimiento.comentarios.length > 0 ? (
                  <div className="space-y-6">
                    {establecimiento.comentarios.map((comentario) => (
                      <div key={comentario._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-4">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-lg">{comentario.usuario?.nombreUsuario?.[0] || '?'}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-semibold text-slate-800">{comentario.usuario?.nombreUsuario || 'Usuario eliminado'}</h4>
                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                  {new Date(comentario.fecha).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    size={16} 
                                    fill={star <= comentario.calificacion ? "#F59E0B" : "transparent"}
                                    stroke={star <= comentario.calificacion ? "#F59E0B" : "#D1D5DB"}
                                    className="mr-1" 
                                  />
                                ))}
                                <span className="ml-2 text-sm font-medium text-slate-600">
                                  {comentario.calificacion}.0
                                </span>
                              </div>
                              <p className="text-slate-700 leading-relaxed">{comentario.comentario}</p>
                            </div>
                          </div>
                          
                          {editMode && (
                            <button
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                              onClick={() => handleDeleteComment(comentario._id)}
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-16 text-center border border-slate-200">
                    <MessageCircle size={64} className="mx-auto text-slate-300 mb-6" />
                    <h4 className="text-xl font-semibold text-slate-600 mb-2">No hay comentarios todavía</h4>
                    <p className="text-slate-500">Los comentarios y reseñas de los usuarios aparecerán aquí</p>
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