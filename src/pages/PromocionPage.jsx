import { useState, useEffect } from "react";
import { obtenerPromociones } from "../api/promociones";
import {
  Star,
  ShoppingCart,
  Heart,
  Clock,
  Tag,
  Sparkles,
  TrendingUp,
  Zap,
  Calendar,
  Map,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";

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
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
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
      <Clock size={12} />
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
          <Star
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
      <span className="text-gray-700 ml-2 text-sm font-medium">
        {rating}
      </span>
    </div>
  );
};

// Componente para la tarjeta de promoción
const PromocionCard = ({ promocion }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Formatear fechas
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // URL de la imagen
  const imageUrl = promocion.imagen 
    ? `https://back-salubridad.sistemasudh.com/uploads/${promocion.imagen}` 
    : "/api/placeholder/600/400";
  
  return (
    <div
      className="relative bg-white rounded-xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl group"
      style={{
        transform: isHovered ? "scale(1.03)" : "scale(1)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-100 opacity-80"></div>

      {/* Decoraciones de esquina */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500 to-transparent opacity-10 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-500 to-transparent opacity-10 rounded-tr-full"></div>

      {/* Imagen y badges */}
      <div className="relative">
        <div className="overflow-hidden">
          <img
            src={imageUrl}
            alt={promocion.nombre}
            className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay al hacer hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
        </div>

        <OfferBadge descuento={promocion.descuento} />

        {/* Badge del establecimiento */}
        <div className="absolute top-4 right-4">
          <div
            className="px-3 py-1 rounded-full text-white text-xs font-extrabold tracking-wider uppercase flex items-center gap-1"
            style={{ backgroundColor: colors.light }}
          >
            {promocion.establecimiento?.nombre?.substring(0, 15) || "Establecimiento"}
            {promocion.establecimiento?.verificado && <Zap size={12} />}
          </div>
        </div>

        {/* Contador regresivo */}
        <div className="absolute bottom-4 right-4">
          <CountdownTimer endDate={promocion.fechaFin} />
        </div>

       
      </div>

      {/* Contenido de la tarjeta */}
      <div className="relative p-5 z-10">
        {/* Título y categoría */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-extrabold" style={{ color: colors.dark }}>
            {promocion.nombre}
          </h3>
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{
              backgroundColor: `${colors.light}20`,
              color: colors.light,
            }}
          >
            {promocion.estado.toUpperCase()}
          </span>
        </div>

        {/* Descripción con gradiente */}
        <div className="relative h-12 mb-3 overflow-hidden">
          <p className="text-gray-600">{promocion.descripcion}</p>
          <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        {/* Línea divisoria estilizada */}
        <div className="relative my-3 py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2">
              <Sparkles size={16} style={{ color: colors.primary }} />
            </span>
          </div>
        </div>

        {/* Fechas de la promoción */}
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2" style={{ color: colors.primary }} />
            <span>Desde: {formatDate(promocion.fechaInicio)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2" style={{ color: colors.accent }} />
            <span>Hasta: {formatDate(promocion.fechaFin)}</span>
          </div>
        </div>

        {/* Rating simulado */}
        <RatingStars />

        {/* Precios y botón de detalles */}
        <div className="flex justify-between items-end mt-4">
          <div>
            <div className="flex items-baseline gap-2">
              <p
                className="text-2xl font-black"
                style={{ color: colors.primary }}
              >
                {promocion.descuento}% OFF
              </p>
              <Tag size={16} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">{promocion.condiciones.substring(0, 20)}...</p>
          </div>
          <button
            className="p-3 rounded-full text-white shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${colors.light}, ${colors.primary})`,
            }}
          >
            <ShoppingCart size={20} className="group-hover:animate-bounce" />
          </button>
        </div>

        {/* Barra de progreso temporal */}
        <div className="mt-4">
          <div className="text-xs text-gray-500 mb-1 flex justify-between">
            <span>En curso</span>
            <span>Tiempo restante</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            {(() => {
              const start = new Date(promocion.fechaInicio);
              const end = new Date(promocion.fechaFin);
              const now = new Date();
              const total = end - start;
              const elapsed = now - start;
              const percent = Math.max(0, Math.min(100, (elapsed / total) * 100));
              
              return (
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${percent}%`,
                    background: `linear-gradient(to right, ${colors.accent}, ${colors.light})`,
                  }}
                ></div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
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
          Las mejores promociones de establecimientos verificados. ¡No te pierdas estas increíbles ofertas por tiempo limitado!
        </p>

        {/* Botones con efectos */}
        <div className="flex gap-4">
          <button
            className="px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 flex items-center gap-2"
            style={{ backgroundColor: colors.accent, color: "white" }}
          >
            Ver todas
            <ChevronRight size={18} />
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
      <Search className="h-5 w-5 text-gray-400" />
    </div>
    <button className="absolute inset-y-0 right-0 flex items-center pr-3">
      <div className="p-1 rounded-md hover:bg-gray-100">
        <Filter className="h-5 w-5 text-gray-400" />
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
    let result = promociones;
    
    // Filtrar por estado
    if (activeFilter !== "Todos") {
      const now = new Date();
      
      result = result.filter(promo => {
        const inicio = new Date(promo.fechaInicio);
        const fin = new Date(promo.fechaFin);
        
        if (activeFilter === "Activas") {
          return now >= inicio && now <= fin && promo.estado === "activa";
        } else if (activeFilter === "Finalizadas") {
          return now > fin || promo.estado !== "activa";
        } else if (activeFilter === "Próximas") {
          return now < inicio && promo.estado === "activa";
        }
        return true;
      });
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        promo => 
          promo.nombre.toLowerCase().includes(term) ||
          promo.descripcion.toLowerCase().includes(term) ||
          promo.establecimiento.nombre.toLowerCase().includes(term)
      );
    }
    
    return result;
  };
  
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
      {/* Fondo con gradiente ligero */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-300 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-green-300 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      {/* Cabecera */}
      <div
        className="pt-32 pb-12 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.secondary} 100%)`,
        }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-5xl font-black mb-4 text-white text-center">
            Promociones <span style={{ color: colors.primary }}>Especiales</span>
          </h1>

          <p className="text-lg text-white/90 max-w-xl mx-auto mb-8 text-center">
            Descubre las mejores promociones de tus establecimientos favoritos.
            Actualizado diariamente con ofertas exclusivas.
          </p>
        </div>
        <div className="flex justify-center mt-6">
          <div
            className="w-20 h-1 rounded-full"
            style={{ backgroundColor: colors.primary }}
          ></div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 bg-white/20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 bg-white/20 -ml-20 -mb-20"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 py-8">
        {/* Banner principal */}
        <PromocionesBanner />
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Panel lateral */}
          <div className="w-full md:w-1/4">
            <div
              className="bg-white p-6 rounded-xl shadow-lg border-t-4"
              style={{ borderColor: colors.primary }}
            >
              <h3
                className="text-xl font-bold mb-6 flex items-center"
                style={{ color: colors.secondary }}
              >
                <Filter className="h-6 w-6 mr-2" />
                Filtros
              </h3>

              <div className="space-y-6">
                <PromocionesSearchBar 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />

                <div>
                  <h4 className="font-bold mb-4 text-gray-700 flex items-center gap-2">
                    <Tag size={16} />
                    Estado
                  </h4>
                  <PromocionesFiltros
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-bold mb-4 text-gray-700 flex items-center gap-2">
                    <Calendar size={16} />
                    Fecha
                  </h4>
                  <div className="space-y-3">
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-bold mb-4 text-gray-700 flex items-center gap-2">
                    <Map size={16} />
                    Ubicación
                  </h4>
                  <div className="space-y-2">
                    {["Todas", "Cercanas", "Online"].map((location) => (
                      <div key={location} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`location-${location}`}
                          className="mr-2 h-4 w-4 accent-green-500"
                        />
                        <label
                          htmlFor={`location-${location}`}
                          className="text-sm text-gray-600"
                        >
                          {location}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    className="px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all duration-300 transform hover:scale-105 w-full text-center"
                    style={{
                      background: `linear-gradient(135deg, ${colors.accent}, ${colors.primary})`,
                    }}
                  >
                    Aplicar Filtros
                  </button>
                </div>
              </div>
            </div>

            {/* Banner lateral */}
            <div className="mt-6 bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-8 -translate-y-8"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-6 translate-y-6"></div>

              <h4 className="text-xl font-bold mb-2 relative z-10">
                ¡Suscríbete!
              </h4>
              <p className="mb-4 text-sm opacity-90 relative z-10">
                Recibe notificaciones de nuevas promociones directamente en tu email.
              </p>

              <div className="relative z-10">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="w-full px-4 py-2 rounded-lg mb-2 text-gray-800 text-sm"
                />
                <button className="w-full bg-white text-blue-700 font-bold py-2 rounded-lg hover:bg-blue-50 transition-colors">
                  Suscribirme
                </button>
              </div>
            </div>
          </div>

          {/* Contenido principal - Lista de promociones */}
          <div className="w-full md:w-3/4">
            {/* Header de sección */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-gray-700 font-bold">
                  {promocionesFiltradas.length} Promociones
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Ordenar por:</span>
                <select className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>Más recientes</option>
                  <option>Mayor descuento</option>
                  <option>Próximas a expirar</option>
                </select>
              </div>
            </div>

            {promocionesFiltradas.length === 0 ? (
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.dark }}>
                  No se encontraron promociones
                </h3>
                <p className="text-gray-600">
                  Intenta cambiar los filtros o términos de búsqueda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promocionesFiltradas.map((promocion) => (
                  <PromocionCard key={promocion._id} promocion={promocion} />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );

}