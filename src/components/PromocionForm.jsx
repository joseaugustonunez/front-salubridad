import { useState, useEffect } from "react";
import { 
  Calendar, Tag, Clock, FileImage, Percent, CheckCircle, XCircle, Edit, Trash2, Plus, Search
} from 'lucide-react';
import { crearPromocion, obtenerPromocionesPorEstablecimiento, actualizarPromocion, eliminarPromocion } from "../api/promociones";

const colors = {
  primary: "#49C581",
  secondary: "#337179",
  dark: "#254A5D",
  accent: "#F8485E",
  light: "#37a6ca",
};

const PromocionesPage = ({ tieneEstablecimiento, establecimientosData }) => {
  // Usar un estado diferente para evitar conflicto con la prop
  const [establecimientoId, setEstablecimientoId] = useState("");
  const [promociones, setPromociones] = useState([]);
  const [filteredPromociones, setFilteredPromociones] = useState([]);
  const [promocionSeleccionada, setPromocionSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtro, setFiltro] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  // Obtener el establecimientoId del usuario autenticado
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.establecimientosCreados && storedUser.establecimientosCreados.length > 0) {
      const id = storedUser.establecimientosCreados[0];
      setEstablecimientoId(id);
    }
  }, []);

  // Cargar promociones del establecimiento
  useEffect(() => {
    const cargarPromos = async () => {
      if (!establecimientoId) return;
      setCargando(true);
      try {
        const promos = await obtenerPromocionesPorEstablecimiento(establecimientoId);
        setPromociones(promos);
      } catch (error) {
        setMensaje("Error al cargar promociones");
        setTipoMensaje("error");
      } finally {
        setCargando(false);
      }
    };
    cargarPromos();
  }, [establecimientoId]);

  // Filtrar promociones
  useEffect(() => {
    let resultado = promociones;
    if (filtro !== 'todas') {
      resultado = resultado.filter(promo => promo.estado === filtro);
    }
    if (busqueda.trim() !== '') {
      const terminoBusqueda = busqueda.toLowerCase();
      resultado = resultado.filter(promo => 
        promo.nombre.toLowerCase().includes(terminoBusqueda) || 
        promo.descripcion.toLowerCase().includes(terminoBusqueda)
      );
    }
    setFilteredPromociones(resultado);
  }, [promociones, filtro, busqueda]);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  // Event handlers
 const handleactualizarPromocion = (promocion) => {
  setPromocionSeleccionada(promocion);
  setMostrarFormulario(true);
};

  const handleEliminarPromocion = async (id) => {
    if (!id) {
      setMensaje("ID de promoción no válido para eliminar");
      setTipoMensaje("error");
      return;
    }
    if (confirm("¿Estás seguro de que deseas eliminar esta promoción?")) {
      try {
        setCargando(true);
        await eliminarPromocion(id);
       setPromociones(promociones.filter(p => p._id !== id));
        setMensaje("Promoción eliminada correctamente");
        setTipoMensaje("exito");
      } catch (error) {
        setMensaje("Error al eliminar la promoción");
        setTipoMensaje("error");
      } finally {
        setCargando(false);
      }
    }
  };

  const handleCrearNueva = () => {
    setPromocionSeleccionada(null);
    setMostrarFormulario(true);
  };

 const handleFormularioCompletado = async (nuevaPromocion) => {
  try {
    setCargando(true);
    let promocionFinal;
    if (promocionSeleccionada) {
      // Usa _id para identificar la promoción
      if (!promocionSeleccionada._id) throw new Error("ID de promoción no válido");
      promocionFinal = await actualizarPromocion(promocionSeleccionada._id, { ...nuevaPromocion, establecimientoId });
      setPromociones(promociones.map(p => p._id === promocionSeleccionada._id ? promocionFinal : p));
      setMensaje("Promoción actualizada correctamente");
    } else {
      promocionFinal = await crearPromocion({ ...nuevaPromocion, establecimientoId });
      setPromociones([...promociones, promocionFinal]);
      setMensaje("Promoción creada correctamente");
    }
    setTipoMensaje("exito");
    setMostrarFormulario(false);
    setPromocionSeleccionada(null);
  } catch (error) {
    setMensaje(promocionSeleccionada ? "Error al actualizar la promoción" : "Error al crear la promoción");
    setTipoMensaje("error");
  } finally {
    setCargando(false);
  }
};

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obtenerEstadoReal = (promocion) => {
    const ahora = new Date();
    const fechaInicio = new Date(promocion.fechaInicio);
    const fechaFin = new Date(promocion.fechaFin);
    if (promocion.estado === 'inactiva') return 'inactiva';
    if (ahora < fechaInicio) return 'programada';
    if (ahora > fechaFin) return 'expirada';
    return 'activa';
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'activa': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactiva': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'expirada': return 'bg-red-100 text-red-800 border-red-200';
      case 'programada': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Gestión de Promociones</h1>
        <button
          onClick={handleCrearNueva}
          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus size={18} className="mr-2" />
          <span>Nueva Promoción</span>
        </button>
      </div>
      {mensaje && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center animate-fadeIn ${
            tipoMensaje === "exito"
              ? "bg-green-50 text-green-700 border-l-4 border-green-500"
              : "bg-red-50 text-red-700 border-l-4 border-red-500"
          }`}
        >
          {tipoMensaje === "exito" ? (
            <CheckCircle className="mr-2 text-green-500" size={20} />
          ) : (
            <XCircle className="mr-2 text-red-500" size={20} />
          )}
          {mensaje}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {mostrarFormulario && (
          <div className="w-full lg:w-1/2 transition-all duration-300">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">
                    {promocionSeleccionada ? "Editar Promoción" : "Crear Promoción"}
                  </h2>
                  <button 
                    onClick={() => setMostrarFormulario(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <PromocionForm 
                  promocion={promocionSeleccionada} 
                  onSuccess={handleFormularioCompletado}
                  establecimientoId={establecimientoId}
                  tieneEstablecimiento={tieneEstablecimiento}
                  establecimientosData={establecimientosData}
                />
              </div>
            </div>
          </div>
        )}

        <div className={`w-full ${mostrarFormulario ? 'lg:w-1/2' : 'lg:w-full'} transition-all duration-300`}>
          {/* Filtros y búsqueda */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setFiltro('todas')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filtro === 'todas' 
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  Todas
                </button>
                <button 
                  onClick={() => setFiltro('activa')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filtro === 'activa' 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  Activas
                </button>
                <button 
                  onClick={() => setFiltro('inactiva')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filtro === 'inactiva' 
                      ? 'bg-gray-200 text-gray-800 border border-gray-300' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  Inactivas
                </button>
                <button 
                  onClick={() => setFiltro('expirada')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filtro === 'expirada' 
                      ? 'bg-red-100 text-red-800 border border-red-200' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  Expiradas
                </button>
              </div>
              
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar promociones..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
            </div>
          </div>

          {cargando ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredPromociones.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No hay promociones disponibles</h3>
              <p className="text-gray-500 mb-6">
                {busqueda ? 'No se encontraron resultados para tu búsqueda.' : 'Aún no has creado ninguna promoción.'}
              </p>
              <button
                onClick={handleCrearNueva}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg inline-flex items-center"
              >
                <Plus size={18} className="mr-1" />
                <span>Crear Primera Promoción</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPromociones.map((promocion) => {
                const estadoReal = obtenerEstadoReal(promocion);
                return (
                  <div 
                    key={promocion._id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Imagen de la promoción */}
                    <div className="relative h-48 overflow-hidden">
                      {promocion.imagen ? (
                        <img 
                          src={`http://localhost:3000/uploads/${promocion.imagen}`}
                          alt={promocion.nombre} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/api/placeholder/400/200';
                          }}
                        />
                      ) : (
                        <img 
                          src="/api/placeholder/400/200" 
                          alt={promocion.nombre} 
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-0 left-0 m-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${obtenerColorEstado(estadoReal)} border`}>
                          {estadoReal.charAt(0).toUpperCase() + estadoReal.slice(1)}
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 m-3">
                        <div className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold">
                          {promocion.descuento}% OFF
                        </div>
                      </div>
                    </div>
                    
                    {/* Contenido de la promoción */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{promocion.nombre}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {promocion.descripcion}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={14} className="mr-1 text-indigo-500" />
                          <span>Inicio: {formatearFecha(promocion.fechaInicio).split(',')[0]}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar size={14} className="mr-1 text-indigo-500" />
                          <span>Fin: {formatearFecha(promocion.fechaFin).split(',')[0]}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleactualizarPromocion(promocion)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                            title="Editar promoción"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleEliminarPromocion(promocion._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Eliminar promoción"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div>
                          <button
                            className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                          >
                            Ver detalles
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente de formulario
const PromocionForm = ({ promocion, onSuccess, establecimientoId }) => {
  const initialFormState = {
    nombre: promocion?.nombre ?? "",
    descripcion: promocion?.descripcion ?? "",
    fechaInicio: promocion?.fechaInicio
      ? new Date(promocion.fechaInicio).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    fechaFin: promocion?.fechaFin
      ? new Date(promocion.fechaFin).toISOString().slice(0, 16)
      : new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().slice(0, 16),
    condiciones: promocion?.condiciones ?? "",
    estado: promocion?.estado ?? "activa",
    descuento: promocion?.descuento ?? 10,
    imagen: promocion?.imagen || null
  };
  const [formData, setFormData] = useState(initialFormState);
  const [imagenFile, setImagenFile] = useState(null);
  const [preview, setPreview] = useState(
    promocion?.imagen 
      ? `http://localhost:3000/uploads/${promocion.imagen}`
      : '/api/placeholder/400/200'
  );
  const [touchedFields, setTouchedFields] = useState({});

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    setTouchedFields(prev => ({ ...prev, [name]: true }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImagenFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const nuevaPromocion = {
      ...formData,
      imagen: imagenFile || formData.imagen,
      establecimientoId
    };
    onSuccess(nuevaPromocion);
  };

  return (
    <div className="space-y-4">
      {/* Vista previa de la imagen destacada */}
      <div className="mb-6">
        <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden mb-2">
          {preview ? (
            <img 
              src={preview} 
              alt="Vista previa" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/api/placeholder/400/200';
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <FileImage className="text-gray-400" size={48} />
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center justify-between">
              <p className="text-white font-medium truncate">{formData.nombre || "Nombre de la promoción"}</p>
              <span className="px-2 py-1 rounded-full bg-purple-500 text-white text-xs font-bold">
                {formData.descuento}% OFF
              </span>
            </div>
          </div>
        </div>
        
        <div className="relative flex items-center justify-center">
          <label className="px-4 py-2 bg-indigo-500 text-white rounded-lg cursor-pointer hover:bg-indigo-600 transition-colors inline-flex items-center">
            <FileImage size={16} className="mr-2" />
            <span>Seleccionar imagen</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
      
      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la promoción</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Ej: Descuento de Verano 2025"
        />
      </div>
      
      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Describe brevemente la promoción"
        />
      </div>
      
      {/* Dos columnas para campos pequeños */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Descuento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descuento (%)</label>
          <div className="relative">
            <input
              type="number"
              name="descuento"
              value={formData.descuento}
              onChange={handleChange}
              min={1}
              max={100}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-8"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Percent size={16} className="text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
          >
            <option value="activa">Activa</option>
            <option value="inactiva">Inactiva</option>
            <option value="expirada">Expirada</option>
          </select>
        </div>
        
        {/* Fecha de Inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
          <input
            type="datetime-local"
            name="fechaInicio"
            value={formData.fechaInicio}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        {/* Fecha de Fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
          <input
            type="datetime-local"
            name="fechaFin"
            value={formData.fechaFin}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Condiciones */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Condiciones</label>
        <textarea
          name="condiciones"
          value={formData.condiciones}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Condiciones aplicables a la promoción"
        />
      </div>
      
      {/* Botones de acción */}
      <div className="flex gap-2 pt-4">
        <button
          onClick={handleSubmit}
          className="flex-grow py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow hover:shadow-lg transition-all duration-200"
        >
          {promocion ? "Actualizar Promoción" : "Crear Promoción"}
        </button>
      </div>
    </div>
  );
};

export default PromocionesPage;