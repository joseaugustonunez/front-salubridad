import { useState, useEffect } from "react";
import { obtenerPromociones } from "../api/promociones";
// Reemplacé lucide-react por react-icons (solo los que se usan aquí)
import {
  FiStar,
  FiClock,
  FiChevronRight,
  FiSearch,
  FiFilter,
  FiMapPin,
  FiCalendar,
} from "react-icons/fi";
import { motion } from "framer-motion";
// Definición de colores principales
const colors = {
  primary: "#49C581",
  secondary: "#337179",
  dark: "#254A5D",
  accent: "#F8485E",
  light: "#37a6ca",
};

// Componente para mostrar la insignia del descuento
const OfferBadge = ({ descuento }) => (
  <div className="absolute top-4 left-4 flex flex-col gap-2">
    <div className="relative">
      <div
        className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-black px-4 py-2 rounded-lg transform rotate-2 shadow-lg"
        style={{ backgroundColor: colors.accent }}
      >
        {descuento}%
      </div>
      <div className="absolute -inset-1 bg-white opacity-30 blur-sm rounded-lg"></div>
    </div>
  </div>
);

// Componente para mostrar el contador regresivo
const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(endDate);
      const difference = end - now;

      if (difference <= 0) {
        return "Finalizado";
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        return `${days}d ${hours}h`;
      } else {
        return `${hours}h ${minutes}m`;
      }
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-center gap-1 text-xs font-medium bg-gray-800 bg-opacity-75 text-white px-2 py-1 rounded-full">
      <FiClock size={12} />
      <span>{timeLeft}</span>
    </div>
  );
};

// Componente para mostrar las estrellas de calificación
const RatingStars = ({ rating = 4.5 }) => {
  return (
    <div className="flex items-center mt-1 mb-3">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            size={16}
            className={`${
              i < Math.floor(rating)
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-gray-700 ml-2 text-sm font-medium">{rating}</span>
    </div>
  );
};

// Componente para la tarjeta de promoción
const PromocionCard = ({ promocion }) => {
  // Formatear fechas
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date)
        ? "—"
        : date.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
    } catch {
      return "—";
    }
  };

  const imageUrl = promocion.imagen
    ? `https://back-salubridad.sistemasudh.com/uploads/${promocion.imagen}`
    : "/api/placeholder/600/400";

  return (
    <article
      className="relative rounded-lg overflow-hidden shadow-sm transition-transform transform hover:scale-[1.01] w-full h-44 sm:h-48 md:h-52 lg:h-56"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.light}05 40%, #ffffff 100%)`,
        border: "1px solid rgba(37,74,93,0.06)",
      }}
    >
      {/* Contador siempre en la esquina superior derecha para evitar solapes */}
      <div className="absolute top-2 right-3 z-40">
        <CountdownTimer endDate={promocion.fechaFin} />
      </div>

      <div className="flex h-full">
        {/* Imagen izquierda: badge de descuento dentro de la imagen (no tapa el contador) */}
        <div className="md:w-2/5 sm:w-1/2 w-2/5 h-full relative flex-shrink-0 bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={promocion.nombre}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

          {/* Badge de descuento dentro de la imagen, top-left */}
          {promocion.descuento != null && (
            <div className="absolute top-2 left-2 z-30">
              <div
                aria-label={`${promocion.descuento}% off`}
                className="px-2 py-0.5 rounded-full text-[11px] bg-[#254a5d] font-bold text-white shadow"
              >
                <span className="leading-none">{promocion.descuento}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Contenido derecho: compacto y con lugar/fecha en bloque debajo */}
        <div className="flex-1 p-3 md:p-4 flex flex-col justify-between">
          <div>
            {/* Título: ocupar todo el ancho (contador está en la esquina superior derecha) */}
            <div className="flex items-center">
              <h3
                className="text-sm md:text-base font-extrabold truncate"
                style={{ color: colors.dark }}
                title={promocion.nombre}
              >
                {promocion.nombre}
              </h3>
            </div>

            <p className="mt-1 text-xs text-gray-600 line-clamp-2 break-words">
              {promocion.descripcion || "Sin descripción."}
            </p>

            {/* Lugar y fecha: ahora en bloque (uno debajo del otro) */}
            <div className="mt-2 text-xs text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">
                  <FiMapPin />
                </span>
                <span
                  className="font-medium text-gray-700 truncate"
                  title={promocion.establecimiento?.nombre || "—"}
                >
                  {promocion.establecimiento?.nombre || "—"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400">
                  <FiCalendar />
                </span>
                <span className="text-gray-600">
                  {formatDate(promocion.fechaInicio)} —{" "}
                  {formatDate(promocion.fechaFin)}
                </span>
              </div>
            </div>

            {/* Estrellas en móvil: se muestran debajo de la fecha (solo en celulares) */}
            <div className="mt-2 md:hidden">
              <RatingStars rating={promocion.rating ?? 4.5} />
            </div>
          </div>

          {/* Footer del card compacto */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: `${colors.primary}20`,
                  color: colors.primary,
                }}
              >
                {(promocion.estado || "activa").toString().toUpperCase()}
              </span>
              {promocion.establecimiento?.verificado && (
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                  Verificado
                </span>
              )}
            </div>

            {/* Estrellas en desktop/tablet: se muestran en el footer */}
            <div className="hidden md:flex text-xs text-gray-500 items-center gap-2">
              <RatingStars rating={promocion.rating ?? 4.5} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

// Componente para filtros
const PromocionesFiltros = ({ activeFilter, setActiveFilter }) => {
  const filters = ["Todos", "Activas", "Finalizadas", "Próximas"];

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-4 py-2 rounded-full transition-all duration-300 font-bold ${
            activeFilter === filter
              ? "text-white transform scale-110 shadow-lg"
              : "text-gray-700 bg-gray-100 hover:bg-gray-200"
          }`}
          style={{
            background:
              activeFilter === filter
                ? `linear-gradient(135deg, ${colors.primary}, ${colors.light})`
                : "",
          }}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

// Banner principal
const PromocionesBanner = () => {
  return (
    <div className="relative mb-10 rounded-xl overflow-hidden shadow-2xl group mt-6">
      {/* Imagen principal */}
      <img
        src="../public/pro.jpg"
        alt="Promociones especiales"
        className="w-full h-72 object-cover transition-transform duration-1000 group-hover:scale-105"
      />

      {/* Gradiente overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-transparent opacity-90"></div>

      {/* Decoración del fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-gradient-to-br from-blue-400 to-transparent opacity-30 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 transform translate-y-1/3 -translate-x-1/3 w-80 h-80 bg-gradient-to-tr from-green-400 to-transparent opacity-20 rounded-full blur-xl"></div>
      </div>

      {/* Contenido principal */}
      <div className="absolute top-1/2 left-10 transform -translate-y-1/2 text-white max-w-md z-10">
        <div className="inline-block px-3 py-1 mb-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full text-xs font-bold tracking-wider">
          PROMOCIONES DESTACADAS
        </div>
        <h2 className="text-4xl font-black mb-2 leading-tight">
          Descubre Grandes
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-500">
            Descuentos
          </span>
        </h2>
        <p className="mb-6 text-gray-200">
          Las mejores promociones de establecimientos verificados. ¡No te
          pierdas estas increíbles ofertas por tiempo limitado!
        </p>

        {/* Botones con efectos */}
        <div className="flex gap-4">
          <button
            className="px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 flex items-center gap-2"
            style={{ backgroundColor: colors.accent, color: "white" }}
          >
            Ver todas
            <FiChevronRight size={18} />
          </button>
          <button className="px-6 py-3 rounded-lg font-bold border-2 border-white text-white transition-all duration-300 hover:bg-white hover:text-gray-800 hover:shadow-lg">
            Destacadas
          </button>
        </div>
      </div>
    </div>
  );
};

// Barra de búsqueda
const PromocionesSearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="relative mb-8 group">
    <input
      type="text"
      placeholder="Buscar promociones..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full p-4 pl-12 pr-10 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-transparent transition-all duration-300 group-hover:shadow-md"
      style={{
        boxShadow: "0 4px 6px rgba(73, 197, 129, 0.1)",
      }}
    />
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <FiSearch className="h-5 w-5 text-gray-400" />
    </div>
    <button className="absolute inset-y-0 right-0 flex items-center pr-3">
      <div className="p-1 rounded-md hover:bg-gray-100">
        <FiFilter className="h-5 w-5 text-gray-400" />
      </div>
    </button>
  </div>
);

// Componente principal para la vista de promociones
export default function PromocionesView() {
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Ejemplo de promoción para mostrar mientras se cargan los datos

  useEffect(() => {
    async function cargarPromociones() {
      try {
        setLoading(true);
        const data = await obtenerPromociones();
        setPromociones(data || [promocionEjemplo]);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar promociones:", err);
        setError("Error al cargar las promociones");
        setLoading(false);
        // Usar el ejemplo para mostrar algo en caso de error
        setPromociones([promocionEjemplo]);
      }
    }

    cargarPromociones();
  }, []);

  // Filtrar promociones según estado y término de búsqueda
  const filtrarPromociones = () => {
    let result = Array.isArray(promociones) ? promociones.slice() : [];

    // Filtrar por estado
    if (activeFilter !== "Todos") {
      const now = new Date();

      result = result.filter((promo) => {
        const inicio = promo?.fechaInicio ? new Date(promo.fechaInicio) : null;
        const fin = promo?.fechaFin ? new Date(promo.fechaFin) : null;
        const estado = (promo?.estado || "").toLowerCase();

        if (activeFilter === "Activas") {
          return (
            inicio && fin && now >= inicio && now <= fin && estado === "activa"
          );
        } else if (activeFilter === "Finalizadas") {
          return (fin && now > fin) || estado !== "activa";
        } else if (activeFilter === "Próximas") {
          return inicio && now < inicio && estado === "activa";
        }
        return true;
      });
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter((promo) => {
        return (
          (promo?.nombre || "").toString().toLowerCase().includes(term) ||
          (promo?.descripcion || "").toString().toLowerCase().includes(term) ||
          (promo?.establecimiento?.nombre || "")
            .toString()
            .toLowerCase()
            .includes(term)
        );
      });
    }

    return result;
  };

  // Usar la función de filtrado para el render
  const promocionesFiltradas = filtrarPromociones();

  // Mostrar mensaje de carga o error
  if (loading) {
    return (
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#49C581] mx-auto"></div>
    );
  }

  if (error && promociones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen ">
      {/* Fondo decorativo ligero */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-300 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-green-300 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Cabecera con título */}
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
              Promociones{" "}
              <span
                className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
                style={{
                  background: `linear-gradient(45deg, ${colors.primary}, #ffffff)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Especiales
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 sm:mb-10 px-4"
            >
              Descubre las mejores promociones de tus establecimientos
              favoritos. Actualizado diariamente con ofertas exclusivas.
            </motion.p>

            {/* Línea decorativa animada */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mx-auto w-24 h-1 rounded-full origin-center"
              style={{ backgroundColor: colors.primary }}
            ></motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 py-8">
        {/* Banner principal */}
        <PromocionesBanner />

        {/* Contenido principal: lista simple de promociones */}
        {promocionesFiltradas.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: colors.dark }}
            >
              No hay promociones disponibles
            </h3>
            <p className="text-gray-600">Vuelve más tarde.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 auto-rows-fr">
            {promocionesFiltradas.map((promocion) => (
              <PromocionCard key={promocion._id} promocion={promocion} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
