import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Store,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  Heart,
  Users,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Settings,
  Eye,
  Shield,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Loader2,
  Filter,
  TrendingUp,
  Building2,
  Award
} from "lucide-react";

// Importar las funciones reales de la API
import {
  obtenerEstablecimientos,
  actualizarVerificado,
  actualizarEstado,
} from "../../api/establecimientos";
import { obtenerCategorias } from "../../api/categorias";
import { useNavigate } from "react-router-dom";

const colors = {
  primary: "#49C581",
  secondary: "#337179",
  dark: "#254A5D",
  accent: "#F8485E",
  info: "#37a6ca",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  purple: "#8B5CF6",
  indigo: "#6366F1"
};

export default function AdminEstablecimientos() {
  const [establecimientos, setEstablecimientos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [establecimientoExpandido, setEstablecimientoExpandido] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setIsLoading(true);
        const [estabData, catData] = await Promise.all([
          obtenerEstablecimientos(),
          obtenerCategorias(),
        ]);
        setEstablecimientos(estabData);
        setCategorias(catData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        mostrarMensaje("Error al cargar los datos. Intente nuevamente.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: "", tipo: "" }), 4000);
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await actualizarEstado(id, nuevoEstado);
      setEstablecimientos(
        establecimientos.map((est) =>
          est._id === id ? { ...est, estado: nuevoEstado } : est
        )
      );
      mostrarMensaje(`Estado actualizado a: ${nuevoEstado}`, "success");
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      mostrarMensaje("Error al actualizar el estado", "error");
    }
  };

  const cambiarVerificacion = async (id, verificado) => {
    try {
      await actualizarVerificado(id, verificado);
      setEstablecimientos(
        establecimientos.map((est) =>
          est._id === id ? { ...est, verificado: verificado } : est
        )
      );
      mostrarMensaje(
        `Verificación ${verificado ? "otorgada" : "retirada"} exitosamente`,
        "success"
      );
    } catch (error) {
      console.error("Error al actualizar verificación:", error);
      mostrarMensaje("Error al actualizar la verificación", "error");
    }
  };

  const filtrarEstablecimientos = () => {
    let filtered = establecimientos;

    if (filtro !== "todos") {
      filtered = filtered.filter((est) => est.estado === filtro);
    }

    if (searchTerm) {
      filtered = filtered.filter((est) =>
        est.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getStatusConfig = (estado) => {
    const configs = {
      pendiente: { color: colors.warning, icon: Clock, bg: "bg-amber-100", text: "text-amber-800" },
      aprobado: { color: colors.success, icon: CheckCircle, bg: "bg-green-100", text: "text-green-800" },
      rechazado: { color: colors.error, icon: XCircle, bg: "bg-red-100", text: "text-red-800" },
    };
    return configs[estado] || { color: colors.info, icon: Store, bg: "bg-blue-100", text: "text-blue-800" };
  };

  const toggleExpandirEstablecimiento = (id) => {
    setEstablecimientoExpandido(
      establecimientoExpandido === id ? null : id
    );
  };

  const irADetalleEstablecimiento = (id, event) => {
    event.stopPropagation();
    navigate(`/admin/establecimientodetalle/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <Loader2 size={48} className="text-blue-600" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 text-lg font-medium"
        >
          Cargando establecimientos...
        </motion.div>
      </div>
    );
  }

  const estadisticas = {
    total: establecimientos.length,
    aprobados: establecimientos.filter(e => e.estado === "aprobado").length,
    pendientes: establecimientos.filter(e => e.estado === "pendiente").length,
    verificados: establecimientos.filter(e => e.verificado).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Ultra Moderno */}
      <div className="relative z-10 pt-12 pb-20 px-6 overflow-hidden bg-gradient-to-br from-[#254A5D] via-[#337179] to-[#49C581] ">
        <div className="absolute inset-0 ">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            {/* Círculos decorativos en tonos verdes */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-[#49C581] rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-96 h-96 bg-[#337179] rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
            <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-[#254A5D] rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          </div>
        </div>

        <div className="relative z-10 pt-20 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
                Gestión de{" "}
                <span className="text-[#49C581]">
                  Establecimientos
                </span>
              </h1>

              {/* Stats Preview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {[
                  { label: "Total", value: estadisticas.total, icon: Store },
                  { label: "Aprobados", value: estadisticas.aprobados, icon: CheckCircle },
                  { label: "Pendientes", value: estadisticas.pendientes, icon: Clock },
                  { label: "Verificados", value: estadisticas.verificados, icon: Award }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
                  >
                    <stat.icon className="text-[#49C581] mx-auto mb-2" size={24} />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-slate-300">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Mensaje de estado */}
        <AnimatePresence>
          {mensaje.texto && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`mb-8 p-6 rounded-2xl shadow-xl border-l-4 backdrop-blur-lg ${mensaje.tipo === "error"
                  ? "bg-red-50/90 text-red-800 border-red-400"
                  : "bg-green-50/90 text-green-800 border-green-400"
                }`}
            >
              <div className="flex items-center gap-3">
                {mensaje.tipo === "error" ? (
                  <XCircle size={24} />
                ) : (
                  <CheckCircle size={24} />
                )}
                <span className="font-semibold text-lg">{mensaje.texto}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panel de Control Moderno */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 mb-12"
        >
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Búsqueda Avanzada */}
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white/50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none focus:bg-white transition-all duration-300 text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Filtros Modernos */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <Filter size={18} />
                <span>Filtrar:</span>
              </div>
              {[
                { key: "todos", label: "Todos", icon: Store },
                { key: "pendiente", label: "Pendientes", icon: Clock },
                { key: "aprobado", label: "Aprobados", icon: CheckCircle },
                { key: "rechazado", label: "Rechazados", icon: XCircle }
              ].map((filtroItem) => {
                const IconComponent = filtroItem.icon;
                const isActive = filtro === filtroItem.key;

                return (
                  <motion.button
                    key={filtroItem.key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFiltro(filtroItem.key)}
                    className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 ${isActive
                        ? "bg-gradient-to-r from-[#49C581] to-[#337179] text-white shadow-lg"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                  >
                    <IconComponent size={16} />
                    {filtroItem.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Estadísticas Detalladas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-slate-200">
            {[
              { label: "Total Establecimientos", value: estadisticas.total, color: colors.info, icon: Building2, trend: "+12%" },
              { label: "Aprobados", value: estadisticas.aprobados, color: colors.success, icon: CheckCircle, trend: "+8%" },
              { label: "Pendientes", value: estadisticas.pendientes, color: colors.warning, icon: Clock, trend: "-3%" },
              { label: "Verificados", value: estadisticas.verificados, color: colors.primary, icon: ShieldCheck, trend: "+15%" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon size={24} style={{ color: stat.color }} />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                    <TrendingUp size={14} />
                    {stat.trend}
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Lista de Establecimientos */}
        {filtrarEstablecimientos().length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50"
          >
            <div className="mb-6">
              <Search className="mx-auto text-slate-400" size={64} />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-3">
              No se encontraron establecimientos
            </h3>
            <p className="text-slate-500 text-lg">
              Intenta cambiar los filtros o el término de búsqueda
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {filtrarEstablecimientos().map((establecimiento, index) => {
              const statusConfig = getStatusConfig(establecimiento.estado);
              const StatusIcon = statusConfig.icon;
              const isExpanded = establecimientoExpandido === establecimiento._id;

              return (
                <motion.div
                  key={establecimiento._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden hover:shadow-3xl transition-all duration-500 group"
                >
                  {/* Header Moderno */}
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#254A5D]/90 via-[#49C581]/80 to-[#337179]/90"></div>

                    <img
                      src={`https://back-salubridad.sistemasudh.com/uploads/${establecimiento.portada}`}
                      alt={`Portada de ${establecimiento.nombre}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => (e.target.style.display = "none")}
                    />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-3 group-hover:scale-105 transition-transform">
                            {establecimiento.nombre}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {establecimiento.categoria?.map((cat, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white border border-white/30"
                              >
                                {cat.nombre}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-white backdrop-blur-sm border border-white/30`}
                            style={{ backgroundColor: `${statusConfig.color}CC` }}
                          >
                            <StatusIcon size={16} />
                            <span className="capitalize text-sm">{establecimiento.estado}</span>
                          </div>

                          {establecimiento.verificado && (
                            <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500/90 backdrop-blur-sm rounded-xl font-bold text-white border border-white/30">
                              <ShieldCheck size={16} />
                              <span className="text-sm">Verificado</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Rating Badge */}
                      <div className="self-end">
                        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl">
                          <Star className="text-yellow-500 fill-current" size={18} />
                          <span className="font-bold text-slate-800">{establecimiento.promedioCalificaciones}</span>
                          <span className="text-slate-600 text-sm">({establecimiento.totalResenas})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contenido Principal */}
                  <div className="p-8">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center shadow-lg">
                        <img
                          src={`https://back-salubridad.sistemasudh.com/uploads/${establecimiento.imagen}`}
                          alt={establecimiento.nombre}
                          className="w-full h-full object-cover rounded-2xl"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "flex";
                          }}
                        />
                        <Store className="text-slate-400" size={32} style={{ display: "none" }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-600 leading-relaxed mb-4">
                          {establecimiento.descripcion}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {establecimiento.tipo?.map((tipo, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold"
                            >
                              {tipo.tipo_nombre}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Métricas */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {[
                        { icon: Phone, label: "Teléfono", value: establecimiento.telefono || "N/A", color: colors.info },
                        { icon: Heart, label: "Likes", value: establecimiento.likes?.length || 0, color: colors.accent },
                        { icon: Users, label: "Seguidores", value: establecimiento.seguidores?.length || 0, color: colors.primary }
                      ].map((metric, idx) => (
                        <div key={idx} className="text-center p-4 bg-slate-50 rounded-2xl">
                          <div className="flex justify-center mb-2">
                            <metric.icon size={20} style={{ color: metric.color }} />
                          </div>
                          <div className="text-lg font-bold text-slate-800">{metric.value}</div>
                          <div className="text-sm text-slate-600">{metric.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Ubicación */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <MapPin className="text-blue-600" size={20} />
                        <h4 className="font-bold text-slate-800">Ubicación</h4>
                      </div>
                      {establecimiento.ubicacion?.map((ubi, idx) => (
                        <div key={idx} className="text-slate-700">
                          <p className="font-medium">{ubi.direccion}</p>
                          <p className="text-sm text-slate-600">{ubi.ciudad}, {ubi.distrito} - {ubi.codigoPostal}</p>
                          <p className="text-xs text-slate-500 mt-1">{ubi.referencia}</p>
                        </div>
                      ))}
                    </div>

                    {/* Botón Expandir */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpandirEstablecimiento(establecimiento._id);
                      }}
                      className="w-full py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-semibold text-slate-700 transition-all duration-300 flex items-center justify-center gap-3 mb-6"
                    >
                      <span>{isExpanded ? "Ocultar detalles" : "Ver más detalles"}</span>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </motion.button>

                    {/* Información Expandida */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-6 pt-6 border-t border-slate-200">
                            {/* Horarios */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <Calendar className="text-green-600" size={20} />
                                <h4 className="font-bold text-slate-800">Horarios de Atención</h4>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {establecimiento.horario?.map((horario, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-white/50 rounded-xl p-3">
                                    <span className="font-semibold text-slate-700">{horario.dia}</span>
                                    <span className="text-slate-600">{horario.entrada} - {horario.salida}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Redes Sociales */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <Globe className="text-purple-600" size={20} />
                                <h4 className="font-bold text-slate-800">Redes Sociales</h4>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(establecimiento.redesSociales || {}).map(([red, valor], idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-white/50 rounded-xl p-3">
                                    <span className="font-semibold text-slate-700 capitalize">{red}</span>
                                    <span className="text-slate-600 truncate ml-2">{valor}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Info Técnica */}
                            <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <Settings className="text-slate-600" size={20} />
                                <h4 className="font-bold text-slate-800">Información Técnica</h4>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-500">ID:</span>
                                  <span className="text-slate-700 font-mono">{establecimiento._id}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Creador:</span>
                                  <span className="text-slate-700">{establecimiento.creador}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Fecha de creación:</span>
                                  <span className="text-slate-700">
                                    {new Date(establecimiento.fechaCreacion).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Acciones */}
                    <div className="flex gap-4 mt-8">
                      <div className="flex-1">
                        <select
                          onChange={(e) => {
                            e.stopPropagation();
                            cambiarEstado(establecimiento._id, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          value={establecimiento.estado}
                          className="w-full px-4 py-4 border-2 border-slate-200 rounded-2xl bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:outline-none transition-all duration-300 font-semibold text-slate-700"
                        >
                          <option value="pendiente">⏳ Pendiente</option>
                          <option value="aprobado">✅ Aprobado</option>
                          <option value="rechazado">❌ Rechazado</option>
                        </select>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          cambiarVerificacion(establecimiento._id, !establecimiento.verificado);
                        }}
                        className={`px-6 py-4 rounded-2xl font-bold text-white transition-all duration-300 flex items-center gap-2 shadow-lg ${establecimiento.verificado
                            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                            : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                          }`}
                      >
                        {establecimiento.verificado ? (
                          <>
                            <Shield size={18} />
                            <span className="hidden sm:inline">Quitar</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck size={18} />
                            <span className="hidden sm:inline">Verificar</span>
                          </>
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => irADetalleEstablecimiento(establecimiento._id, e)}
                        className="px-6 py-4 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg"
                      >
                        <Eye size={18} />
                        <span className="hidden sm:inline">Ver</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
