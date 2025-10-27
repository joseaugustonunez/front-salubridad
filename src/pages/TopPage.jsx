"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import {
  Star,
  Map,
  Navigation,
  ExternalLink,
  Heart,
  Users,
  Calendar,
  Clock,
  Phone,
  Filter,
  X,
} from "lucide-react";
import { obtenerEstablecimientosAprobados } from "../api/establecimientos";
import { obtenerCategorias } from "../api/categorias";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Asegurar que los iconos por defecto de Leaflet se usen correctamente
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Componente para centrar el mapa en un marcador seleccionado
const CenterMapOnMarker = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { animate: true, duration: 1.5 });
    }
  }, [map, position]);
  return null;
};

const colors = {
  primary: "#49C581", // Verde principal
  secondary: "#337179", // Azul verdoso
  dark: "#254A5D", // Azul oscuro
  accent: "#F8485E", // Rosa/rojo acento
  blue: "#37a6ca",
};

// Componente para mostrar las estrellas de calificación
const RatingStars = ({ rating, size = 16 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star key={i} size={size} className="text-yellow-400 fill-yellow-400" />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <Star
          key={i}
          size={size}
          className="text-yellow-400 fill-yellow-400 opacity-50"
        />
      );
    } else {
      stars.push(<Star key={i} size={size} className="text-gray-300" />);
    }
  }

  return <div className="flex">{stars}</div>;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Mapa de colores por categoría
const COLOR_MAP = {
  cafeteria: "#49C581", // Verde
  restaurante: "#337179", // Turquesa oscuro
  bar: "#254A5D", // Azul oscuro
  tienda: "#F8485E", // Rojo
  default: "#49C581", // Verde por defecto
};

const TopPage = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [establecimientos, setEstablecimientos] = useState([]);
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState(null);
  const [mapCenter, setMapCenter] = useState([-12.05, -75.2]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [categorias, setCategorias] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchEstablecimientos = async () => {
      try {
        setLoading(true);
        const data = await obtenerEstablecimientosAprobados();

        const establecimientosConColor = data.map((establecimiento) => {
          const categoria =
            establecimiento.categoria?.[0]?.nombre?.toLowerCase() || "default";
          return {
            ...establecimiento,
            color: COLOR_MAP[categoria] || COLOR_MAP["default"],
          };
        });

        // Ordenar por calificación o likes
        const sortedEstablecimientos = establecimientosConColor.sort((a, b) => {
          const ratingA = parseFloat(a.promedioCalificaciones || "0");
          const ratingB = parseFloat(b.promedioCalificaciones || "0");

          if (ratingA === ratingB) {
            return (b.likes?.length || 0) - (a.likes?.length || 0);
          }
          return ratingB - ratingA;
        });

        setEstablecimientos(sortedEstablecimientos);
      } catch (error) {
        console.error("Error al cargar los establecimientos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstablecimientos();
  }, []);

  // Invalidar tamaño del mapa cuando cambie el centro o la selección
  useEffect(() => {
    const mapa = mapRef.current;
    if (!mapa) return;

    // Force an initial invalidate after a small delay (layout/animations)
    const t = setTimeout(() => {
      try {
        mapa.invalidateSize();
      } catch (e) {
        // noop
      }
    }, 200);

    // Use ResizeObserver on the container to detect layout changes reliably
    let ro;
    const el = containerRef.current;
    if (typeof ResizeObserver !== "undefined" && el) {
      ro = new ResizeObserver(() => {
        try {
          mapa.invalidateSize();
        } catch (e) {
          // noop
        }
      });
      ro.observe(el);
    }

    const handleResize = () => {
      try {
        mapa.invalidateSize();
      } catch (e) {
        // noop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", handleResize);
      if (ro && el) ro.unobserve(el);
    };
  }, [mapCenter, selectedEstablecimiento]);

  const handleEstablecimientoClick = useCallback((establecimiento) => {
    setSelectedEstablecimiento(establecimiento);

    const lat = establecimiento.ubicacion?.[0]?.coordenadas?.latitud;
    const lon = establecimiento.ubicacion?.[0]?.coordenadas?.longitud;

    if (lat && lon) {
      setMapCenter([lat, lon]);
    }
  }, []);

  const goToEstablecimientoDetail = useCallback(
    (id, e) => {
      if (e) {
        e.stopPropagation();
      }
      navigate(`/establecimientodetalle/${id}`);
    },
    [navigate]
  );

  const availableCategories = useMemo(() => {
    if (categorias.length > 0) {
      return categorias.map((cat) => cat.nombre.toLowerCase());
    }

    // If no categories from API, extract from establishments
    const categories = new Set();
    establecimientos.forEach((est) => {
      est.categoria?.forEach((cat) => {
        if (cat.nombre) {
          categories.add(cat.nombre.toLowerCase());
        }
      });
    });
    return Array.from(categories);
  }, [establecimientos, categorias]);

  const filteredEstablecimientos = useMemo(() => {
    return filter === "all"
      ? establecimientos
      : establecimientos.filter((est) =>
          est.categoria?.some(
            (cat) => cat.nombre.toLowerCase() === filter.toLowerCase()
          )
        );
  }, [establecimientos, filter]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header responsivo y moderno */}
      <div
        className="pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12 md:pb-14 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.secondary} 50%, ${colors.primary} 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-4 sm:mb-5 leading-tight">
              Top{" "}
              <span
                className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
                style={{
                  background: `linear-gradient(45deg, ${colors.primary}, #ffffff)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Establecimientos
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 sm:mb-10 px-4"
            >
              Descubre los lugares mejor valorados por la comunidad
            </motion.p>

            {/* Stats cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mt-8"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 sm:py-3">
                <div className="text-lg sm:text-xl font-bold text-white">
                  {establecimientos.length}
                </div>
                <div className="text-xs sm:text-sm text-white/80">Lugares</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 sm:py-3">
                <div className="text-lg sm:text-xl font-bold text-white">
                  {availableCategories.length}
                </div>
                <div className="text-xs sm:text-sm text-white/80">
                  Categorías
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 sm:py-3">
                <div className="text-lg sm:text-xl font-bold text-white">
                  {establecimientos.reduce(
                    (acc, est) => acc + (est.likes?.length || 0),
                    0
                  )}
                </div>
                <div className="text-xs sm:text-sm text-white/80">Me gusta</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-40 h-40 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full opacity-10 bg-white/20 -mr-10 -mt-10 sm:-mr-20 sm:-mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 rounded-full opacity-10 bg-white/20 -ml-8 -mb-8 sm:-ml-20 sm:-mb-20"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 sm:w-3 sm:h-3 bg-white/30 rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 sm:w-2 sm:h-2 bg-white/40 rounded-full"></div>
      </div>

      {/* Filtros responsivos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Botón de filtros para móvil */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-lg font-semibold text-gray-800">
            {filteredEstablecimientos.length} lugares encontrados
          </h2>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Filter size={18} />
            <span className="text-sm font-medium">Filtros</span>
          </button>
        </div>

        {/* Filtros desktop */}
        <div className="hidden md:flex gap-3 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === "all"
                ? "bg-[#49C581] text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md"
            }`}
          >
            Todos ({establecimientos.length})
          </button>
          {availableCategories.map((cat) => {
            const count = establecimientos.filter((est) =>
              est.categoria?.some(
                (category) => category.nombre.toLowerCase() === cat
              )
            ).length;

            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  backgroundColor:
                    filter === cat
                      ? COLOR_MAP[cat] || COLOR_MAP.default
                      : "white",
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === cat
                    ? "text-white shadow-lg scale-105"
                    : "text-gray-700 hover:bg-gray-50 hover:shadow-md"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)} ({count})
              </button>
            );
          })}
        </div>

        {/* Filtros móvil desplegable */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white rounded-lg shadow-lg p-4 mt-2"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-800">
                  Filtrar por categoría
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setFilter("all");
                    setShowMobileFilters(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === "all"
                      ? "bg-[#49C581] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Todos ({establecimientos.length})
                </button>
                {availableCategories.map((cat) => {
                  const count = establecimientos.filter((est) =>
                    est.categoria?.some(
                      (category) => category.nombre.toLowerCase() === cat
                    )
                  ).length;

                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setFilter(cat);
                        setShowMobileFilters(false);
                      }}
                      style={{
                        backgroundColor:
                          filter === cat
                            ? COLOR_MAP[cat] || COLOR_MAP.default
                            : "#f3f4f6",
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filter === cat
                          ? "text-white"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)} ({count})
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contenido principal responsivo */}
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 gap-6">
        {/* Lista de establecimientos */}
        <div className="w-full lg:w-2/3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#49C581]"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
            >
              {filteredEstablecimientos.map((establecimiento, index) => (
                <motion.div
                  key={establecimiento._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <EstablecimientoCard
                    establecimiento={establecimiento}
                    index={index}
                    isSelected={
                      selectedEstablecimiento?._id === establecimiento._id
                    }
                    onClick={() => handleEstablecimientoClick(establecimiento)}
                    onViewDetail={(e) =>
                      goToEstablecimientoDetail(establecimiento._id, e)
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Mapa responsivo */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-4">
            <div
              ref={containerRef}
              className="h-64 sm:h-80 lg:h-96 xl:h-[32rem] rounded-2xl overflow-hidden shadow-xl border border-gray-200 relative bg-white"
            >
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ width: "100%", height: "100%" }}
                className="w-full h-full z-0"
                zoomControl={false}
                whenCreated={(m) => {
                  // guardar referencia al mapa Leaflet y forzar redraw
                  mapRef.current = m;
                  setTimeout(() => {
                    try {
                      m.invalidateSize();
                    } catch (e) {
                      // noop
                    }
                  }, 150);
                }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {establecimientos.map((establecimiento) => {
                  const lat =
                    establecimiento.ubicacion?.[0]?.coordenadas?.latitud;
                  const lon =
                    establecimiento.ubicacion?.[0]?.coordenadas?.longitud;
                  if (lat == null || lon == null) return null;

                  return (
                    <Marker
                      key={establecimiento._id}
                      position={[lat, lon]}
                      riseOnHover={true}
                      autoPan={true}
                      eventHandlers={{
                        click: (e) => {
                          // centrar y seleccionar
                          handleEstablecimientoClick(establecimiento);
                          // abrir el popup asociado
                          try {
                            e.target.openPopup();
                          } catch (err) {
                            // noop
                          }
                        },
                      }}
                    >
                      <Popup>
                        <MapPopupContent
                          establecimiento={establecimiento}
                          onViewDetail={(e) =>
                            goToEstablecimientoDetail(establecimiento._id, e)
                          }
                        />
                      </Popup>
                    </Marker>
                  );
                })}

                <CenterMapOnMarker position={mapCenter} />
              </MapContainer>

              {/* Overlay del mapa */}
              <AnimatePresence>
                {selectedEstablecimiento && (
                  <MapOverlay
                    establecimiento={selectedEstablecimiento}
                    onClose={(e) => {
                      e.stopPropagation();
                      setSelectedEstablecimiento(null);
                    }}
                    onViewDetail={(e) =>
                      goToEstablecimientoDetail(selectedEstablecimiento._id, e)
                    }
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para la tarjeta de establecimiento - Completamente responsivo
const EstablecimientoCard = ({
  establecimiento,
  index,
  isSelected,
  onClick,
  onViewDetail,
}) => {
  return (
    <div
      className={`w-full max-w-none rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl cursor-pointer group ${
        isSelected
          ? "ring-2 ring-[#337179] ring-offset-2 shadow-2xl"
          : "shadow-lg"
      }`}
      style={{
        borderTop: `4px solid ${establecimiento.color}`,
        backgroundColor: "white",
      }}
      onClick={onClick}
    >
      <div className="relative overflow-hidden h-36 sm:h-40 md:h-44">
        {establecimiento.portada ? (
          <img
            src={`https://back-salubridad.sistemasudh.com/uploads/${establecimiento.portada}`}
            alt={establecimiento.nombre}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Sin imagen</span>
          </div>
        )}

        {/* Badge de posición */}
        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 text-xs font-bold shadow-lg">
          <span style={{ color: establecimiento.color }}>#{index + 1}</span>
        </div>

        {/* Badge de categoría */}
        <div className="absolute top-2 right-2">
          <div className="flex flex-wrap gap-1">
            {establecimiento.categoria?.slice(0, 1).map((cat, idx) => (
              <span
                key={idx}
                className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-white/95 backdrop-blur-sm shadow-sm"
                style={{ color: establecimiento.color }}
              >
                {cat.nombre}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-5">
        <div className="space-y-2 sm:space-y-3">
          {/* Título */}
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-gray-900">
            {establecimiento.nombre}
          </h2>

          {/* Métricas */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <RatingStars
                rating={parseFloat(
                  establecimiento.promedioCalificaciones || "0"
                )}
                size={14}
              />
              <span className="text-xs sm:text-sm text-gray-600 ml-1">
                ({establecimiento.promedioCalificaciones || "0"})
              </span>
            </div>

            <div className="flex items-center space-x-3 text-xs sm:text-sm">
              <div className="flex items-center text-[#F8485E]">
                <Heart size={12} className="fill-[#F8485E] mr-1" />
                <span>{establecimiento.likes?.length || 0}</span>
              </div>

              <div className="flex items-center text-[#49C581]">
                <Users size={12} className="mr-1" />
                <span>{establecimiento.seguidores?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {establecimiento.descripcion}
          </p>

          {/* Dirección */}
          <div className="flex items-start text-gray-500 text-xs sm:text-sm">
            <Map size={14} className="mr-2 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">
              {establecimiento.ubicacion?.[0]?.direccion ||
                "Dirección no disponible"}
            </span>
          </div>

          {/* Footer */}
          <div className="pt-2 sm:pt-3 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="text-xs text-gray-500 flex items-center">
              <Calendar size={12} className="mr-1" />
              <span>{formatDate(establecimiento.fechaCreacion)}</span>
            </div>

            <button
              className="text-[#337179] text-sm font-medium flex items-center hover:text-[#254A5D] transition-colors duration-200 bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded-full"
              onClick={onViewDetail}
            >
              Ver detalles
              <ExternalLink size={12} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para el contenido del popup del mapa - Responsivo
const MapPopupContent = ({ establecimiento, onViewDetail }) => (
  <div className="w-48 sm:w-56">
    {establecimiento.portada && (
      <img
        src={`https://back-salubridad.sistemasudh.com/uploads/${establecimiento.portada}`}
        alt={establecimiento.nombre}
        className="w-full h-24 sm:h-28 object-cover rounded mb-2"
      />
    )}
    <h3 className="font-bold text-gray-800 text-sm mb-1">
      {establecimiento.nombre}
    </h3>
    <div className="flex items-center my-1">
      <RatingStars
        rating={parseFloat(establecimiento.promedioCalificaciones || "0")}
        size={12}
      />
      <span className="ml-1 text-xs">
        ({establecimiento.promedioCalificaciones || "0"})
      </span>
    </div>
    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
      {establecimiento.descripcion}
    </p>
    <div className="flex items-center text-xs text-gray-500 mt-2">
      <Map size={10} className="mr-1" />
      <span className="truncate">
        {establecimiento.ubicacion?.[0]?.direccion || "Dirección no disponible"}
      </span>
    </div>
    <button
      className="mt-2 w-full py-1 text-xs font-medium text-white rounded transition-colors duration-200"
      style={{ backgroundColor: colors.secondary }}
      onClick={onViewDetail}
    >
      Ver detalles
    </button>
  </div>
);

// Componente para el overlay del mapa - Responsivo
const MapOverlay = ({ establecimiento, onClose, onViewDetail }) => (
  <motion.div
    initial={{ opacity: 0, y: "100%" }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: "100%" }}
    transition={{ type: "spring", damping: 25, stiffness: 200 }}
    className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-t-lg shadow-2xl border-t border-gray-200 pointer-events-none"
  >
    {/* Wrapper con pointer-events-auto para que sólo el contenido capture clicks;
        el resto del overlay permitirá pasar clicks al mapa (markers) */}
    <div className="pointer-events-auto">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-gray-800 text-sm sm:text-base pr-2">
          {establecimiento.nombre}
        </h3>
        <button
          className="text-gray-400 hover:text-gray-600 text-lg sm:text-xl transition-colors p-1"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex items-center space-x-4 mt-2">
        <div className="flex items-center">
          <RatingStars
            rating={parseFloat(establecimiento.promedioCalificaciones || "0")}
            size={14}
          />
          <span className="ml-1 text-sm">
            ({establecimiento.promedioCalificaciones || "0"})
          </span>
        </div>

        <div className="flex items-center text-rose-500">
          <Heart size={14} className="fill-rose-500" />
          <span className="ml-1 text-sm">
            {establecimiento.likes?.length || 0}
          </span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2">
        {establecimiento.descripcion}
      </p>

      <div className="mt-2 sm:mt-3 space-y-1 text-xs sm:text-sm">
        <div className="flex items-start text-gray-600">
          <Map
            size={14}
            className="mr-2 text-indigo-600 flex-shrink-0 mt-0.5"
          />
          <span className="line-clamp-2">
            {establecimiento.ubicacion?.[0]?.direccion ||
              "Dirección no disponible"}
          </span>
        </div>

        {establecimiento.telefono && (
          <div className="flex items-center text-gray-600">
            <Phone size={14} className="mr-2 text-indigo-600" />
            <span>{establecimiento.telefono}</span>
          </div>
        )}

        {establecimiento.horario && establecimiento.horario.length > 0 && (
          <div className="flex items-center text-gray-600">
            <Clock size={14} className="mr-2 text-indigo-600" />
            <span className="text-xs">
              {establecimiento.horario[0].dia}:{" "}
              {establecimiento.horario[0].entrada} -{" "}
              {establecimiento.horario[0].salida}
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <span className="text-xs text-gray-500">
          {establecimiento.comentarios?.length || 0} comentarios
        </span>

        <button
          className="text-indigo-600 text-sm font-medium flex items-center hover:text-indigo-800 transition-colors duration-200 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full"
          onClick={onViewDetail}
        >
          Ver perfil completo
          <ExternalLink size={12} className="ml-1" />
        </button>
      </div>
    </div>
  </motion.div>
);

export default TopPage;
