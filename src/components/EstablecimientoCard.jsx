import { useState, useEffect, useRef } from "react";
import { Edit, MapPin, Clock, Phone, Heart, Star, Users, Check, X } from "lucide-react";
import { obtenerEstablecimientoPorId, editarEstablecimiento } from "../api/establecimientos";
import { obtenerCategorias } from "../api/categorias";

// Componente adaptado para ser usado en el perfil con vista unificada
export default function EstablecimientoCard({ establecimientoId, tieneEstablecimiento }) {
  const [editing, setEditing] = useState(false);
  const [establecimiento, setEstablecimiento] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState({});
  const [seguidores, setSeguidores] = useState({});
  const [categorias, setCategorias] = useState([]);
  
  // Refs para los campos editables
  const descripcionRef = useRef(null);
  const telefonoRef = useRef(null);
  const direccionRef = useRef(null);
  const ciudadRef = useRef(null);
  const distritoRef = useRef(null);
  const codigoPostalRef = useRef(null);
  const referenciaRef = useRef(null);
  const [formValues, setFormValues] = useState({
    descripcion: '',
    telefono: '',
    horarios: [],
    ubicacion: {
      direccion: '',
      ciudad: '',
      distrito: '',
      codigoPostal: '',
      referencia: ''
    }
  });
  
  // Estado para manejar los horarios durante la edición
  const [horarios, setHorarios] = useState([]);
  
  // Obtener datos del establecimiento
  useEffect(() => {
    const fetchEstablecimiento = async () => {
      try {
        setLoading(true);
        const data = await obtenerEstablecimientoPorId(establecimientoId);
        setEstablecimiento(data);
        
        // Inicializar valores del formulario
        setFormValues({
  nombre: data.nombre || '', // <--- agrega esto
  descripcion: data.descripcion || '',
  telefono: data.telefono || '',
  horarios: data.horario || [],
  ubicacion: {
    direccion: data.ubicacion && data.ubicacion[0] ? data.ubicacion[0].direccion : '',
    ciudad: data.ubicacion && data.ubicacion[0] ? data.ubicacion[0].ciudad : '',
    distrito: data.ubicacion && data.ubicacion[0] ? data.ubicacion[0].distrito : '',
    codigoPostal: data.ubicacion && data.ubicacion[0] ? data.ubicacion[0].codigoPostal : '',
    referencia: data.ubicacion && data.ubicacion[0] ? data.ubicacion[0].referencia : ''
  }
});
        
        // Inicializar horarios
        setHorarios(data.horario || []);
  
        // Manejar likes y seguidores individuales
        setLikes({ [data._id]: data.likes?.length || 0 });
        setSeguidores({ [data._id]: data.seguidores?.length || 0 });
  
      } catch (error) {
        setError("Error al cargar el establecimiento");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchCategorias = async () => {
      try {
        const data = await obtenerCategorias();
        setCategorias(data);
      } catch (error) {
        console.error("Error al cargar las categorías", error);
      }
    };
  
    if (establecimientoId) {
      fetchEstablecimiento();
      fetchCategorias();
    } else {
      setLoading(false);
    }
  }, [establecimientoId]);
  
  const formatNumber = (num) => {
    if (!num) return 0;
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num;
  };
  
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleUbicacionChange = (e, field) => {
    const { value } = e.target;
    setFormValues(prev => ({
      ...prev,
      ubicacion: {
        ...prev.ubicacion,
        [field]: value
      }
    }));
  };
  
  const handleHorarioChange = (index, field, value) => {
    const updatedHorarios = [...horarios];
    updatedHorarios[index] = {
      ...updatedHorarios[index],
      [field]: value
    };
    setHorarios(updatedHorarios);
  };
  
  const addHorario = () => {
    setHorarios([...horarios, { dia: "Lunes", entrada: "09:00", salida: "18:00" }]);
  };
  
  const removeHorario = (index) => {
    const updatedHorarios = horarios.filter((_, i) => i !== index);
    setHorarios(updatedHorarios);
  };
  
  const handleEditClick = () => {
    if (editing) {
      // Si estamos en modo edición y hacemos clic, queremos guardar
      handleSaveChanges();
    } else {
      // Si no estamos en modo edición, entramos a él
      setEditing(true);
    }
  };
  
const handleSaveChanges = async () => {
  try {
    // Si la ubicación ya existe, toma su ID
    const ubicacionId = establecimiento.ubicacion && establecimiento.ubicacion[0]?._id;

    const updatedData = {
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
      telefono: formValues.telefono,
      horario: horarios,
      ubicacion: ubicacionId ? [ubicacionId] : [], // Solo IDs
      categoria: formValues.categoria,
      tipo: formValues.tipo
    };

    await editarEstablecimiento(establecimientoId, updatedData);
    setEditing(false);
    alert("Establecimiento actualizado con éxito");
  } catch (error) {
    console.error("Error al actualizar el establecimiento", error);
    alert("Error al actualizar el establecimiento");
  }
};
  const handleCancelEdit = () => {
    // Restaurar los valores originales
    setFormValues({
      descripcion: establecimiento.descripcion || '',
      telefono: establecimiento.telefono || '',
      horarios: establecimiento.horario || [],
      ubicacion: {
        direccion: establecimiento.ubicacion && establecimiento.ubicacion[0] ? establecimiento.ubicacion[0].direccion : '',
        ciudad: establecimiento.ubicacion && establecimiento.ubicacion[0] ? establecimiento.ubicacion[0].ciudad : '',
        distrito: establecimiento.ubicacion && establecimiento.ubicacion[0] ? establecimiento.ubicacion[0].distrito : '',
        codigoPostal: establecimiento.ubicacion && establecimiento.ubicacion[0] ? establecimiento.ubicacion[0].codigoPostal : '',
        referencia: establecimiento.ubicacion && establecimiento.ubicacion[0] ? establecimiento.ubicacion[0].referencia : ''
      }
    });
    setHorarios(establecimiento.horario || []);
    setEditing(false);
  };

  if (loading) return <p className="text-center py-4">Cargando establecimiento...</p>;
  if (!establecimiento) return null;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full mt-6">
      {/* Portada con imagen de fondo */}
      <div className="relative h-48 w-full bg-gray-200">
        <img 
          src={`http://localhost:3000/uploads/${establecimiento.portada}`}
          alt="Portada del establecimiento" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex justify-between items-end">
          <div className="flex items-center">
            <img 
              src={`http://localhost:3000/uploads/${establecimiento.imagen}`}
              alt="Logo" 
              className="w-16 h-16 rounded-full border-2 border-white object-cover"
            />
            <div className="ml-3 text-white">
              <h2 className="text-xl font-bold">{establecimiento.nombre}</h2>
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= Math.round(parseFloat(establecimiento.promedioCalificaciones || 0))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-white/90">{establecimiento.promedioCalificaciones || 0}/5</span>
              </div>
            </div>
          </div>
          <div>
            <button 
              onClick={handleEditClick} 
              className="flex items-center px-4 py-2 rounded-md text-white text-sm font-medium transition-colors"
              style={{ backgroundColor: "#37a6ca" }}
            >
              {editing ? (
                <>
                  <Check size={16} className="mr-1" />
                  Guardar
                </>
              ) : (
                <>
                  <Edit size={16} className="mr-1" />
                  Editar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Estado de verificación */}
      <div className="px-6 py-2 bg-gray-50 flex justify-between items-center border-b">
        <div className="flex items-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            establecimiento.estado === "activo" ? "bg-green-100 text-green-800" : 
            establecimiento.estado === "pendiente" ? "bg-yellow-100 text-yellow-800" : 
            "bg-red-100 text-red-800"
          }`}>
            {establecimiento.estado === "activo" ? <Check size={12} className="mr-1" /> : 
             establecimiento.estado === "pendiente" ? <Clock size={12} className="mr-1" /> : 
             <X size={12} className="mr-1" />}
            {establecimiento.estado.charAt(0).toUpperCase() + establecimiento.estado.slice(1)}
          </span>
          {establecimiento.verificado && (
            <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Check size={12} className="mr-1" />
              Verificado
            </span>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <div className="flex items-center mr-4">
            <Heart size={16} className="text-red-500 mr-1" />
            <span>{formatNumber(likes[establecimiento._id] || 0)}</span>
          </div>
          <div className="flex items-center">
            <Users size={16} className="text-blue-500 mr-1" />
            <span>{formatNumber(seguidores[establecimiento._id] || 0)}</span>
          </div>
        </div>
      </div>
      
      {/* Contenido unificado */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda: Info general y horarios */}
          <div>
            {editing ? (
  <input
    className="w-full p-2 border border-gray-300 rounded-md mb-2 font-bold text-xl"
    value={formValues.nombre}
    onChange={e => setFormValues(prev => ({ ...prev, nombre: e.target.value }))}
    placeholder="Nombre del establecimiento"
  />
) : (
  <h2 className="text-xl font-bold">{establecimiento.nombre}</h2>
)}
            {/* Descripción */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-medium" style={{ color: "#254A5D" }}>Descripción</h3>
                {!editing && establecimiento.descripcion && establecimiento.descripcion.length > 100 && (
                  <button 
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-sm hover:text-blue-800"
                    style={{ color: "#37a6ca" }}
                  >
                    {showFullDescription ? 'Ver menos' : 'Ver más'}
                  </button>
                )}
              </div>
              {editing ? (
                <textarea
                  ref={descripcionRef}
                  className="w-full p-2 border border-gray-300 rounded-md h-24"
                  value={formValues.descripcion}
                  onChange={(e) => handleInputChange(e, 'descripcion')}
                />
              ) : (
                <p className="text-gray-600">
                  {!establecimiento.descripcion ? "Sin descripción" : (
                    showFullDescription 
                      ? establecimiento.descripcion 
                      : `${establecimiento.descripcion.substring(0, 100)}${establecimiento.descripcion.length > 100 ? '...' : ''}`
                  )}
                </p>
              )}
            </div>
            
            {/* Categorías y tipos */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2" style={{ color: "#254A5D" }}>Categorías y tipos</h3>
              {editing ? (
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Categorías</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      {establecimiento.categoria && establecimiento.categoria.map((cat, i) => (
                        <option key={i} value={cat.nombre}>{cat.nombre}</option>
                      ))}
                      {categorias.map((cat) => (
                        !establecimiento.categoria?.some(c => c._id === cat._id) && (
                          <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                        )
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Tipos</label>
                    <div className="flex flex-wrap gap-2">
                      {establecimiento.tipo && establecimiento.tipo.map((tip, i) => (
                        <div key={i} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                          <span className="text-sm">{tip.tipo_nombre}</span>
                          <button className="ml-1 text-gray-500 hover:text-red-500">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <button className="px-3 py-1 rounded-full text-sm" 
                        style={{ backgroundColor: "#f0f8f6", color: "#49C581" }}>
                        + Añadir
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {establecimiento.categoria && establecimiento.categoria.map((cat, i) => (
                    <span key={i} className="px-3 py-1 text-xs rounded-full"
                      style={{ backgroundColor: "#f0f8f6", color: "#49C581" }}>
                      {cat.nombre}
                    </span>
                  ))}
                  {establecimiento.tipo && establecimiento.tipo.map((tip, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {tip.tipo_nombre}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Horarios */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2" style={{ color: "#254A5D" }}>Horarios</h3>
              {editing ? (
                <div className="space-y-2">
                  {horarios.map((hor, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        className="w-1/3 p-2 border border-gray-300 rounded-md"
                        value={hor.dia}
                        onChange={(e) => handleHorarioChange(i, 'dia', e.target.value)}
                      />
                      <input
                        className="w-1/4 p-2 border border-gray-300 rounded-md"
                        type="time"
                        value={hor.entrada}
                        onChange={(e) => handleHorarioChange(i, 'entrada', e.target.value)}
                      />
                      <span>a</span>
                      <input
                        className="w-1/4 p-2 border border-gray-300 rounded-md"
                        type="time"
                        value={hor.salida}
                        onChange={(e) => handleHorarioChange(i, 'salida', e.target.value)}
                      />
                      <button 
                        onClick={() => removeHorario(i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={addHorario}
                    className="px-4 py-2 rounded-md text-sm mt-2"
                    style={{ backgroundColor: "#f0f8f6", color: "#49C581" }}
                  >
                    + Añadir horario
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {establecimiento.horario && establecimiento.horario.length > 0 ? (
                    establecimiento.horario.map((hor, i) => (
                      <div key={i} className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-2 text-gray-500" />
                        <span className="font-medium w-24">{hor.dia}:</span>
                        <span>{hor.entrada} - {hor.salida}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No hay horarios definidos</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Teléfono */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2" style={{ color: "#254A5D" }}>Contacto</h3>
              {editing ? (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-500" />
                  <input
                    ref={telefonoRef}
                    className="flex-grow p-2 border border-gray-300 rounded-md"
                    value={formValues.telefono}
                    onChange={(e) => handleInputChange(e, 'telefono')}
                  />
                </div>
              ) : (
                <div className="flex items-center text-gray-600">
                  <Phone size={16} className="mr-2 text-gray-500" />
                  <span>{establecimiento.telefono || "No disponible"}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Columna derecha: Ubicación y comentarios */}
          <div>
            {/* Ubicación */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2" style={{ color: "#254A5D" }}>Ubicación</h3>
              {editing ? (
                <div className="space-y-3">
                  <input
                    ref={direccionRef}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formValues.ubicacion.direccion}
                    onChange={(e) => handleUbicacionChange(e, 'direccion')}
                    placeholder="Dirección"
                  />
                  <div className="flex gap-3">
                    <input
                      ref={ciudadRef}
                      className="flex-1 p-2 border border-gray-300 rounded-md"
                      value={formValues.ubicacion.ciudad}
                      onChange={(e) => handleUbicacionChange(e, 'ciudad')}
                      placeholder="Ciudad"
                    />
                    <input
                      ref={distritoRef}
                      className="flex-1 p-2 border border-gray-300 rounded-md"
                      value={formValues.ubicacion.distrito}
                      onChange={(e) => handleUbicacionChange(e, 'distrito')}
                      placeholder="Distrito"
                    />
                    <input
                      ref={codigoPostalRef}
                      className="w-32 p-2 border border-gray-300 rounded-md"
                      value={formValues.ubicacion.codigoPostal}
                      onChange={(e) => handleUbicacionChange(e, 'codigoPostal')}
                      placeholder="Código postal"
                    />
                  </div>
                  <input
                    ref={referenciaRef}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formValues.ubicacion.referencia}
                    onChange={(e) => handleUbicacionChange(e, 'referencia')}
                    placeholder="Referencia"
                  />
                </div>
              ) : (
                <div>
                  <div className="space-y-2 text-gray-600 mb-4">
                    {establecimiento.ubicacion && establecimiento.ubicacion.length > 0 ? (
                      <div className="flex items-start">
                        <MapPin size={16} className="mr-2 mt-1 shrink-0 text-gray-500" />
                        <div>
                          <p>{establecimiento.ubicacion[0].direccion}</p>
                          <p>{establecimiento.ubicacion[0].distrito}, {establecimiento.ubicacion[0].ciudad} - {establecimiento.ubicacion[0].codigoPostal}</p>
                          <p className="text-gray-500 text-sm">{establecimiento.ubicacion[0].referencia}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No hay información de ubicación disponible</p>
                    )}
                  </div>
                  
                  {/* Mapa (simulado) */}
                  <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                    <div className="text-gray-500 text-center">
                      <MapPin size={24} className="mx-auto mb-2" />
                      <p>Vista previa del mapa</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Comentarios y Reseñas */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-3" style={{ color: "#254A5D" }}>Comentarios y reseñas</h3>
              <div className="max-h-96 overflow-y-auto pr-2">
                {establecimiento.comentarios && establecimiento.comentarios.length > 0 ? (
                  <div className="space-y-4">
                    {establecimiento.comentarios.map((comment, i) => (
                      <div key={i} className="border-b pb-4">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-700 font-medium">
                              {comment.usuario?.nombreUsuario?.charAt(0) || "?"}
                            </div>
                            <div className="ml-2">
                              <p className="font-medium">{comment.usuario?.nombreUsuario || "Usuario anónimo"}</p>
                              <div className="flex items-center mt-1">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                      key={star}
                                      size={14}
                                      className={star <= comment.calificacion
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                      }
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-xs text-gray-500">
                                  {new Date(comment.fecha).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-600">{comment.comentario}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No hay comentarios todavía</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Botones de acción (visibles solo en modo edición) */}
      {editing && (
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t">
          <button 
            onClick={handleCancelEdit} 
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSaveChanges}
            className="px-4 py-2 rounded-md text-white hover:bg-blue-700 transition-colors"
            style={{ backgroundColor: "#37a6ca" }}
          >
            Guardar cambios
          </button>
        </div>
      )}
    </div>
  );
}