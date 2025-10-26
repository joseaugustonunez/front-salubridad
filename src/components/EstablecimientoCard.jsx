import { useState, useEffect, useRef } from "react";
import {
  Edit,
  MapPin,
  Clock,
  Phone,
  Heart,
  Star,
  Users,
  Check,
  X,
  Plus,
} from "lucide-react";
import {
  obtenerEstablecimientoPorId,
  editarEstablecimiento,
} from "../api/establecimientos";
import { obtenerCategorias } from "../api/categorias";

// Componente adaptado para ser usado en el perfil con vista unificada
export default function EstablecimientoCard({
  establecimientoId,
  tieneEstablecimiento,
}) {
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
    descripcion: "",
    telefono: "",
    horarios: [],
    ubicacion: {
      direccion: "",
      ciudad: "",
      distrito: "",
      codigoPostal: "",
      referencia: "",
    },
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
          nombre: data.nombre || "",
          descripcion: data.descripcion || "",
          telefono: data.telefono || "",
          horarios: data.horario || [],
          ubicacion: {
            direccion:
              data.ubicacion && data.ubicacion[0]
                ? data.ubicacion[0].direccion
                : "",
            ciudad:
              data.ubicacion && data.ubicacion[0]
                ? data.ubicacion[0].ciudad
                : "",
            distrito:
              data.ubicacion && data.ubicacion[0]
                ? data.ubicacion[0].distrito
                : "",
            codigoPostal:
              data.ubicacion && data.ubicacion[0]
                ? data.ubicacion[0].codigoPostal
                : "",
            referencia:
              data.ubicacion && data.ubicacion[0]
                ? data.ubicacion[0].referencia
                : "",
          },
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
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUbicacionChange = (e, field) => {
    const { value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      ubicacion: {
        ...prev.ubicacion,
        [field]: value,
      },
    }));
  };

  const handleHorarioChange = (index, field, value) => {
    const updatedHorarios = [...horarios];
    updatedHorarios[index] = {
      ...updatedHorarios[index],
      [field]: value,
    };
    setHorarios(updatedHorarios);
  };

  const addHorario = () => {
    setHorarios([
      ...horarios,
      { dia: "Lunes", entrada: "09:00", salida: "18:00" },
    ]);
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
      const ubicacionId =
        establecimiento.ubicacion && establecimiento.ubicacion[0]?._id;

      const updatedData = {
        nombre: formValues.nombre,
        descripcion: formValues.descripcion,
        telefono: formValues.telefono,
        horario: horarios,
        ubicacion: ubicacionId ? [ubicacionId] : [], // Solo IDs
        categoria: formValues.categoria,
        tipo: formValues.tipo,
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
      nombre: establecimiento.nombre || "",
      descripcion: establecimiento.descripcion || "",
      telefono: establecimiento.telefono || "",
      horarios: establecimiento.horario || [],
      ubicacion: {
        direccion:
          establecimiento.ubicacion && establecimiento.ubicacion[0]
            ? establecimiento.ubicacion[0].direccion
            : "",
        ciudad:
          establecimiento.ubicacion && establecimiento.ubicacion[0]
            ? establecimiento.ubicacion[0].ciudad
            : "",
        distrito:
          establecimiento.ubicacion && establecimiento.ubicacion[0]
            ? establecimiento.ubicacion[0].distrito
            : "",
        codigoPostal:
          establecimiento.ubicacion && establecimiento.ubicacion[0]
            ? establecimiento.ubicacion[0].codigoPostal
            : "",
        referencia:
          establecimiento.ubicacion && establecimiento.ubicacion[0]
            ? establecimiento.ubicacion[0].referencia
            : "",
      },
    });
    setHorarios(establecimiento.horario || []);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full mt-6 animate-pulse">
        <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300"></div>
        <div className="p-6">
          <div className="h-4 bg-slate-200 rounded-full w-3/4 mb-4"></div>
          <div className="h-3 bg-slate-200 rounded-full w-1/2 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded-full w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!establecimiento) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden w-full mt-6 transition-all duration-300 hover:shadow-2xl">
      {/* Portada con imagen de fondo - Hero Section */}
      <div className="relative h-48 md:h-60 w-full bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <img
          src={`https://back-salubridad.sistemasudh.com/uploads/${establecimiento.portada}`}
          alt="Portada del establecimiento"
          className="w-full h-full object-cover mix-blend-overlay"
        />

        {/* Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={`https://back-salubridad.sistemasudh.com/uploads/${establecimiento.imagen}`}
                  alt="Logo"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-4 border-white/20 backdrop-blur-sm shadow-lg object-cover ring-2 ring-white/10"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="text-white">
                <h1 className="text-xl md:text-2xl font-bold mb-1 text-shadow-lg">
                  {establecimiento.nombre}
                </h1>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={
                          star <=
                          Math.round(
                            parseFloat(
                              establecimiento.promedioCalificaciones || 0
                            )
                          )
                            ? "fill-amber-400 text-amber-400"
                            : "fill-white/20 text-white/20"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-white/90 font-medium">
                    {establecimiento.promedioCalificaciones || 0}/5
                  </span>
                  <span className="text-xs text-white/70 px-2 py-1 bg-white/10 rounded-full backdrop-blur-sm">
                    {establecimiento.comentarios?.length || 0} reseñas
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl text-white text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            >
              {editing ? (
                <>
                  <Check size={16} />
                  <span className="hidden sm:inline">Guardar</span>
                </>
              ) : (
                <>
                  <Edit size={16} />
                  <span className="hidden sm:inline">Editar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                establecimiento.estado === "activo"
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : establecimiento.estado === "pendiente"
                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {establecimiento.estado === "activo" ? (
                <Check size={12} />
              ) : establecimiento.estado === "pendiente" ? (
                <Clock size={12} />
              ) : (
                <X size={12} />
              )}
              {establecimiento.estado.charAt(0).toUpperCase() +
                establecimiento.estado.slice(1)}
            </span>

            {establecimiento.verificado && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                <Check size={12} />
                Verificado
              </span>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1.5 text-slate-600">
              <div className="p-1.5 bg-red-100 rounded-lg">
                <Heart size={14} className="text-red-500" />
              </div>
              <span className="font-medium">
                {formatNumber(likes[establecimiento._id] || 0)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Users size={14} className="text-blue-500" />
              </div>
              <span className="font-medium">
                {formatNumber(seguidores[establecimiento._id] || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Nombre (en modo edición) */}
            {editing && (
              <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nombre del establecimiento
                </label>
                <input
                  className="w-full p-4 border border-slate-200 rounded-xl text-lg font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  value={formValues.nombre}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      nombre: e.target.value,
                    }))
                  }
                  placeholder="Nombre del establecimiento"
                />
              </div>
            )}

            {/* Descripción */}
            <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">
                  Descripción
                </h3>
                {!editing &&
                  establecimiento.descripcion &&
                  establecimiento.descripcion.length > 100 && (
                    <button
                      onClick={() =>
                        setShowFullDescription(!showFullDescription)
                      }
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors px-3 py-1 rounded-lg hover:bg-blue-50"
                    >
                      {showFullDescription ? "Ver menos" : "Ver más"}
                    </button>
                  )}
              </div>
              {editing ? (
                <textarea
                  ref={descripcionRef}
                  className="w-full p-4 border border-slate-200 rounded-xl h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  value={formValues.descripcion}
                  onChange={(e) => handleInputChange(e, "descripcion")}
                  placeholder="Describe tu establecimiento..."
                />
              ) : (
                <p className="text-slate-600 leading-relaxed">
                  {!establecimiento.descripcion ? (
                    <span className="text-slate-400 italic">
                      Sin descripción disponible
                    </span>
                  ) : showFullDescription ? (
                    establecimiento.descripcion
                  ) : (
                    `${establecimiento.descripcion.substring(0, 150)}${
                      establecimiento.descripcion.length > 150 ? "..." : ""
                    }`
                  )}
                </p>
              )}
            </div>

            {/* Categorías y tipos */}
            <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Categorías y tipos
              </h3>
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Categorías
                    </label>
                    <select className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                      {establecimiento.categoria &&
                        establecimiento.categoria.map((cat, i) => (
                          <option key={i} value={cat.nombre}>
                            {cat.nombre}
                          </option>
                        ))}
                      {categorias.map(
                        (cat) =>
                          !establecimiento.categoria?.some(
                            (c) => c._id === cat._id
                          ) && (
                            <option key={cat._id} value={cat._id}>
                              {cat.nombre}
                            </option>
                          )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Tipos
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {establecimiento.tipo &&
                        establecimiento.tipo.map((tip, i) => (
                          <div
                            key={i}
                            className="flex items-center bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors border border-slate-200"
                          >
                            <span className="text-sm font-medium text-slate-700">
                              {tip.tipo_nombre}
                            </span>
                            <button className="ml-2 text-slate-400 hover:text-red-500 transition-colors">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      <button className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                        <Plus size={14} />
                        Añadir
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {establecimiento.categoria &&
                    establecimiento.categoria.map((cat, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 text-sm font-medium rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200"
                      >
                        {cat.nombre}
                      </span>
                    ))}
                  {establecimiento.tipo &&
                    establecimiento.tipo.map((tip, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-xl border border-blue-200"
                      >
                        {tip.tipo_nombre}
                      </span>
                    ))}
                  {(!establecimiento.categoria ||
                    establecimiento.categoria.length === 0) &&
                    (!establecimiento.tipo ||
                      establecimiento.tipo.length === 0) && (
                      <span className="text-slate-400 italic">
                        No hay categorías definidas
                      </span>
                    )}
                </div>
              )}
            </div>

            {/* Horarios */}
            <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Horarios de atención
              </h3>
              {editing ? (
                <div className="space-y-3">
                  {horarios.map((hor, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row gap-3 p-4 bg-white rounded-xl border border-slate-200"
                    >
                      <select
                        className="sm:w-32 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        value={hor.dia}
                        onChange={(e) =>
                          handleHorarioChange(i, "dia", e.target.value)
                        }
                      >
                        <option value="Lunes">Lunes</option>
                        <option value="Martes">Martes</option>
                        <option value="Miércoles">Miércoles</option>
                        <option value="Jueves">Jueves</option>
                        <option value="Viernes">Viernes</option>
                        <option value="Sábado">Sábado</option>
                        <option value="Domingo">Domingo</option>
                      </select>
                      <input
                        className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        type="time"
                        value={hor.entrada}
                        onChange={(e) =>
                          handleHorarioChange(i, "entrada", e.target.value)
                        }
                      />
                      <span className="flex items-center justify-center text-slate-400 font-medium">
                        a
                      </span>
                      <input
                        className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        type="time"
                        value={hor.salida}
                        onChange={(e) =>
                          handleHorarioChange(i, "salida", e.target.value)
                        }
                      />
                      <button
                        onClick={() => removeHorario(i)}
                        className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addHorario}
                    className="flex items-center gap-2 w-full p-4 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-colors justify-center"
                  >
                    <Plus size={16} />
                    Añadir horario
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {establecimiento.horario &&
                  establecimiento.horario.length > 0 ? (
                    establecimiento.horario.map((hor, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100"
                      >
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Clock size={16} className="text-blue-600" />
                        </div>
                        <span className="font-semibold text-slate-700 min-w-20">
                          {hor.dia}:
                        </span>
                        <span className="text-slate-600">
                          {hor.entrada} - {hor.salida}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                      <Clock
                        size={24}
                        className="mx-auto text-slate-400 mb-2"
                      />
                      <p className="text-slate-400">
                        No hay horarios definidos
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Teléfono */}
            <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Contacto
              </h3>
              {editing ? (
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone size={16} className="text-green-600" />
                  </div>
                  <input
                    ref={telefonoRef}
                    className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={formValues.telefono}
                    onChange={(e) => handleInputChange(e, "telefono")}
                    placeholder="Número de teléfono"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone size={16} className="text-green-600" />
                  </div>
                  <span className="text-slate-600 font-medium">
                    {establecimiento.telefono || "No disponible"}
                  </span>
                  {establecimiento.telefono && (
                    <a
                      href={`tel:${establecimiento.telefono}`}
                      className="ml-auto px-3 py-1 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      Llamar
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Ubicación */}
            <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Ubicación
              </h3>
              {editing ? (
                <div className="space-y-4">
                  <input
                    ref={direccionRef}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={formValues.ubicacion.direccion}
                    onChange={(e) => handleUbicacionChange(e, "direccion")}
                    placeholder="Dirección completa"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <input
                      ref={ciudadRef}
                      className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={formValues.ubicacion.ciudad}
                      onChange={(e) => handleUbicacionChange(e, "ciudad")}
                      placeholder="Ciudad"
                    />
                    <input
                      ref={distritoRef}
                      className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={formValues.ubicacion.distrito}
                      onChange={(e) => handleUbicacionChange(e, "distrito")}
                      placeholder="Distrito"
                    />
                    <input
                      ref={codigoPostalRef}
                      className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={formValues.ubicacion.codigoPostal}
                      onChange={(e) => handleUbicacionChange(e, "codigoPostal")}
                      placeholder="Código postal"
                    />
                  </div>
                  <input
                    ref={referenciaRef}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={formValues.ubicacion.referencia}
                    onChange={(e) => handleUbicacionChange(e, "referencia")}
                    placeholder="Referencias adicionales"
                  />
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    {establecimiento.ubicacion &&
                    establecimiento.ubicacion.length > 0 ? (
                      <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100">
                        <div className="p-2 bg-red-100 rounded-lg mt-1">
                          <MapPin size={16} className="text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 mb-1">
                            {establecimiento.ubicacion[0].direccion}
                          </p>
                          <p className="text-slate-600">
                            {establecimiento.ubicacion[0].distrito},{" "}
                            {establecimiento.ubicacion[0].ciudad}
                          </p>
                          {establecimiento.ubicacion[0].codigoPostal && (
                            <p className="text-slate-500 text-sm">
                              CP: {establecimiento.ubicacion[0].codigoPostal}
                            </p>
                          )}
                          {establecimiento.ubicacion[0].referencia && (
                            <p className="text-slate-500 text-sm mt-2 italic">
                              {establecimiento.ubicacion[0].referencia}
                            </p>
                          )}
                        </div>
                        <button className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                          Ver ruta
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                        <MapPin
                          size={24}
                          className="mx-auto text-slate-400 mb-2"
                        />
                        <p className="text-slate-400">
                          No hay información de ubicación disponible
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Mapa placeholder mejorado */}
                  <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl h-48 flex items-center justify-center relative overflow-hidden border border-slate-200">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10"></div>
                    <div className="text-slate-500 text-center z-10">
                      <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
                        <MapPin
                          size={32}
                          className="mx-auto mb-3 text-slate-400"
                        />
                        <p className="font-medium">Vista previa del mapa</p>
                        <p className="text-sm text-slate-400 mt-1">
                          Integración pendiente
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Comentarios y Reseñas */}
            <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Comentarios y reseñas
              </h3>
              <div className="max-h-96 overflow-y-auto">
                {establecimiento.comentarios &&
                establecimiento.comentarios.length > 0 ? (
                  <div className="space-y-4">
                    {establecimiento.comentarios.map((comment, i) => (
                      <div
                        key={i}
                        className="p-4 bg-white rounded-xl border border-slate-100 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            {comment.usuario?.nombreUsuario
                              ?.charAt(0)
                              ?.toUpperCase() || "?"}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <p className="font-semibold text-slate-800">
                                {comment.usuario?.nombreUsuario ||
                                  "Usuario anónimo"}
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      size={14}
                                      className={
                                        star <= comment.calificacion
                                          ? "fill-amber-400 text-amber-400"
                                          : "fill-slate-200 text-slate-200"
                                      }
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                  {new Date(comment.fecha).toLocaleDateString(
                                    "es-ES",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-600 leading-relaxed ml-13">
                          {comment.comentario}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                    <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm inline-block">
                      <Star size={32} className="mx-auto text-slate-400 mb-3" />
                      <p className="text-slate-500 font-medium">
                        No hay comentarios todavía
                      </p>
                      <p className="text-slate-400 text-sm mt-1">
                        Sé el primero en dejar una reseña
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick stats */}
              {establecimiento.comentarios &&
                establecimiento.comentarios.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="text-lg font-bold text-amber-700">
                          {establecimiento.promedioCalificaciones || 0}
                        </div>
                        <div className="text-xs text-amber-600 font-medium">
                          Promedio
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="text-lg font-bold text-blue-700">
                          {establecimiento.comentarios.length}
                        </div>
                        <div className="text-xs text-blue-600 font-medium">
                          Reseñas
                        </div>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                        <div className="text-lg font-bold text-emerald-700">
                          {Math.round(
                            (establecimiento.comentarios.filter(
                              (c) => c.calificacion >= 4
                            ).length /
                              establecimiento.comentarios.length) *
                              100
                          )}
                          %
                        </div>
                        <div className="text-xs text-emerald-600 font-medium">
                          Positivas
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Solo visible en modo edición */}
      {editing && (
        <div className="px-6 md:px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-t border-slate-200">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={handleCancelEdit}
              className="px-6 py-3 border-2 border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 active:scale-95"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveChanges}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
