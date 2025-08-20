"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
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
} from "lucide-react";
import { obtenerEstablecimientosAprobados } from "../api/establecimientos"; // Asegúrate de que la ruta sea correcta
import { obtenerCategorias } from "../api/categorias";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
const RatingStars = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <Star
          key={i}
          size={16}
          className="text-yellow-400 fill-yellow-400 opacity-50"
        />
      );
    } else {
      stars.push(<Star key={i} size={16} className="text-gray-300" />);
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
  const [establecimientos, setEstablecimientos] = useState([]);
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState(null);
  const [mapCenter, setMapCenter] = useState([-12.05, -75.2]); 
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [categorias, setCategorias] = useState([]);

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

  // Utilizamos useMemo para evitar recalcular la lista filtrada en cada render
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br ">
      {/* Encabezado normal (no sticky) */}

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
            Top <span style={{ color: colors.primary }}>Establecimientos</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-white/90 max-w-xl mx-auto mb-8 text-center"
          >
            Descubre los lugares mejor valorados por la comunidad
          </motion.p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 bg-white/20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 bg-white/20 -ml-20 -mb-20"></div>
      </div>
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Category filters */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === "all"
                ? "bg-[#49C581] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Todos
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                backgroundColor:
                  filter === cat
                    ? COLOR_MAP[cat] || COLOR_MAP.default
                    : "white",
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat
                  ? "text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido principal - Estructura modificada para colocar mapa debajo en móvil */}
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 pb-6">
        {/* Lista de establecimientos - Ancho completo en móvil */}
        <div className="w-full md:w-2/3 md:pr-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEstablecimientos.map((establecimiento, index) => (
                <EstablecimientoCard
                  key={establecimiento._id}
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
              ))}
            </div>
          )}
        </div>

        {/* Mapa mejorado - Se muestra debajo en móvil y al lado en desktop */}
       <div className="w-full md:w-1/3 mt-6 md:mt-0">
  <div className="h-96 md:h-[32rem] rounded-2xl overflow-hidden shadow-lg border-4 border-white relative">
    <MapContainer
      center={mapCenter}
      zoom={13}
      className="w-full h-full z-0"
      zoomControl={false}
      whenReady={(map) => {
        // Arregla renders dentro de tabs/accordion/condicionales
        setTimeout(() => map.target.invalidateSize(), 0);
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {establecimientos.map((establecimiento) => {
        const lat = establecimiento.ubicacion?.[0]?.coordenadas?.latitud;
        const lon = establecimiento.ubicacion?.[0]?.coordenadas?.longitud;
        if (lat == null || lon == null) return null;

        return (
          <Marker
            key={establecimiento._id}
            position={[lat, lon]}
            eventHandlers={{
              click: () => handleEstablecimientoClick(establecimiento),
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

    {/* Overlay con detalles */}
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
  </div>
</div>

      </div>
    </div>
  );
};

// Componente para la tarjeta de establecimiento
const EstablecimientoCard = ({
  establecimiento,
  index,
  isSelected,
  onClick,
  onViewDetail,
}) => {
  return (
    <div
      className={`w-[400px] rounded-xl overflow-hidden transition transform hover:-translate-y-1 hover:shadow-xl cursor-pointer group ${
  isSelected ? "ring-2 ring-[#337179] ring-offset-2" : ""
}`}
      style={{
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        borderTop: `6px solid ${establecimiento.color}`,
        backgroundColor: "white",
        borderRadius: "12px",
        transition: "all 0.3s ease",
      }}
      onClick={onClick}
    >
      <div className="relative overflow-hidden h-40">
        {establecimiento.portada ? (
          <img
            src={`https://back-salubridad.sistemasudh.com/uploads/${establecimiento.portada}`}
            alt={establecimiento.nombre}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-400">Sin imagen</span>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-white/90 rounded-full px-3 py-1 text-xs font-bold shadow-sm">
          #{index + 1}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex gap-1 flex-wrap mb-2">
              {establecimiento.categoria?.map((cat, idx) => (
                <span
                  key={idx}
                  className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: `${establecimiento.color}20`,
                    color: establecimiento.color,
                  }}
                >
                  {cat.nombre}
                </span>
              ))}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {establecimiento.nombre}
            </h2>

            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center">
                <RatingStars
                  rating={parseFloat(
                    establecimiento.promedioCalificaciones || "0"
                  )}
                />
                <span className="ml-1 text-sm text-gray-600">
                  ({establecimiento.promedioCalificaciones || "0"})
                </span>
              </div>

              <div className="flex items-center text-[#F8485E]">
                <Heart size={14} className="fill-[#F8485E]" />
                <span className="ml-1 text-sm">
                  {establecimiento.likes?.length || 0}
                </span>
              </div>

              <div className="flex items-center text-[#49C581]">
                <Users size={14} />
                <span className="ml-1 text-sm">
                  {establecimiento.seguidores?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mt-2 text-sm line-clamp-2">
          {establecimiento.descripcion}
        </p>

        <div className="flex items-center text-gray-500 mt-3 text-sm">
          <Map size={14} className="mr-1 flex-shrink-0" />
          <span className="truncate">
            {establecimiento.ubicacion?.[0]?.direccion ||
              "Dirección no disponible"}
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div className="text-xs text-gray-500 flex items-center">
            <Calendar size={12} className="mr-1" />
            <span>{formatDate(establecimiento.fechaCreacion)}</span>
          </div>

          <button
            className="text-[#337179] text-sm font-medium flex items-center hover:text-[#254A5D]"
            onClick={onViewDetail}
          >
            Ver detalles
            <ExternalLink size={14} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para el contenido del popup del mapa
const MapPopupContent = ({ establecimiento, onViewDetail }) => (
  <div className="w-48">
  <img
  src={`https://back-salubridad.sistemasudh.com/uploads/${establecimiento.portada}`}
  alt={establecimiento.nombre}
  className="w-64 h-40 object-cover transform group-hover:scale-105 transition-transform duration-300 rounded"
/>
    <h3 className="font-bold text-gray-800">{establecimiento.nombre}</h3>
    <div className="flex items-center my-1">
      <RatingStars
        rating={parseFloat(establecimiento.promedioCalificaciones || "0")}
      />
      <span className="ml-1 text-xs">
        ({establecimiento.promedioCalificaciones || "0"})
      </span>
    </div>
    <p className="text-sm text-gray-600 mb-2">{establecimiento.descripcion}</p>
    <div className="flex items-center text-xs text-gray-500 mt-2">
      <Map size={12} className="mr-1" />
      <span className="truncate">
        {establecimiento.ubicacion?.[0]?.direccion || "Dirección no disponible"}
      </span>
    </div>
    <button
      className="mt-2 w-full py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 transition"
      onClick={onViewDetail}
    >
      Ver detalles
    </button>
  </div>
);

// Componente para el overlay del mapa
const MapOverlay = ({ establecimiento, onClose, onViewDetail }) => (
  <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 rounded-t-lg shadow-lg transform transition-transform duration-300 ease-in-out">
    <div className="flex justify-between items-start">
      <h3 className="font-bold text-gray-800">{establecimiento.nombre}</h3>
      <button className="text-gray-400 hover:text-gray-600" onClick={onClose}>
        &times;
      </button>
    </div>

    <div className="flex items-center space-x-4 mt-2">
      <div className="flex items-center">
        <RatingStars
          rating={parseFloat(establecimiento.promedioCalificaciones || "0")}
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

    <p className="text-sm text-gray-600 mt-2">{establecimiento.descripcion}</p>

    <div className="mt-3 space-y-1 text-sm">
      <div className="flex items-center text-gray-600">
        <Map size={14} className="mr-2 text-indigo-600" />
        <span>
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
          <span>
            {establecimiento.horario[0].dia}:{" "}
            {establecimiento.horario[0].entrada} -{" "}
            {establecimiento.horario[0].salida}
          </span>
        </div>
      )}
    </div>

    <div className="mt-3 flex justify-between">
      <span className="text-xs text-gray-500">
        {establecimiento.comentarios?.length || 0} comentarios
      </span>

      <button
        className="text-indigo-600 text-sm font-medium flex items-center hover:text-indigo-800"
        onClick={onViewDetail}
      >
        Ver perfil completo
        <ExternalLink size={14} className="ml-1" />
      </button>
    </div>
  </div>
);

export default TopPage;