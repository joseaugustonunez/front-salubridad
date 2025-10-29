import { useState, useEffect } from "react";
import {
  Star,
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
  Clock,
  Tag,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { obtenerPromociones } from "../api/promociones";
// Colores principales
const colors = {
  primary: "#49C581",
  secondary: "#337179",
  dark: "#254A5D",
  accent: "#F8485E",
  light: "#37a6ca",
};

// Datos de ejemplo para las ofertas
const offerData = [
  {
    id: 1,
    title: "Oferta Especial",
    description: "50% de descuento en productos seleccionados",
    image: "/api/placeholder/600/400",
    discount: "50%",
    originalPrice: 1299,
    currentPrice: 649,
    rating: 4.8,
    category: "Tecnología",
    badge: "DESTACADA",
    timeLeft: "23:45:12",
    trending: true,
  },
  {
    id: 2,
    title: "Super Descuento",
    description: "Compra uno y lleva el segundo gratis",
    image: "/api/placeholder/600/400",
    discount: "2x1",
    originalPrice: 899,
    currentPrice: 899,
    rating: 4.6,
    category: "Ropa",
    badge: "LIMITADO",
    timeLeft: "05:12:33",
    hot: true,
  },
  {
    id: 3,
    title: "Oferta Relámpago",
    description: "Solo por hoy: 70% de descuento",
    image: "/api/placeholder/600/400",
    discount: "70%",
    originalPrice: 3499,
    currentPrice: 1049,
    rating: 4.9,
    category: "Hogar",
    badge: "FLASH",
    timeLeft: "01:30:45",
    hot: true,
    trending: true,
  },
  {
    id: 4,
    title: "Precio Especial",
    description: "Descuentos exclusivos para miembros",
    image: "/api/placeholder/600/400",
    discount: "40%",
    originalPrice: 1999,
    currentPrice: 1199,
    rating: 4.7,
    category: "Deportes",
    badge: "EXCLUSIVO",
    timeLeft: "48:00:00",
  },
];

// Componente de animación para etiquetas
const AnimatedBadge = ({ children, color }) => {
  return (
    <div className="relative overflow-hidden">
      <div
        className="px-3 py-1 rounded-full text-white text-xs font-extrabold tracking-wider uppercase animate-pulse flex items-center gap-1"
        style={{ backgroundColor: color }}
      >
        {children}
      </div>
      <div
        className="absolute inset-0 bg-white opacity-30 animate-ping rounded-full"
        style={{ animationDuration: "3s" }}
      ></div>
    </div>
  );
};

// Componente para contador regresivo
const CountdownTimer = ({ time }) => (
  <div className="flex items-center gap-1 text-xs font-medium bg-gray-800 bg-opacity-75 text-white px-2 py-1 rounded-full">
    <Clock size={12} />
    <span>{time}</span>
  </div>
);

// Componente de badge para ofertas con efectos
const OfferBadge = ({ discount }) => (
  <div className="absolute top-4 left-4 flex flex-col gap-2">
    <div className="relative">
      <div
        className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-black px-4 py-2 rounded-lg transform rotate-2 shadow-lg animate-bounce"
        style={{ animationDuration: "2s", backgroundColor: colors.accent }}
      >
        {discount}
      </div>
      <div className="absolute -inset-1 bg-white opacity-30 blur-sm rounded-lg"></div>
    </div>
  </div>
);

// Componente de tarjeta de oferta mejorada
const OfferCard = ({ offer }) => {
  const [promociones, setPromociones] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

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
            src={`https://back-salubridad.sistemasudh.com/uploads/${offer.image}`}
            alt={offer.title}
            className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay al hacer hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
        </div>

        <OfferBadge discount={offer.discount} />

        {/* Badge especial en la esquina superior derecha */}
        {offer.badge && (
          <div className="absolute top-4 right-4">
            <AnimatedBadge
              color={
                offer.trending
                  ? colors.light
                  : offer.hot
                  ? colors.accent
                  : colors.primary
              }
            >
              {offer.badge}
              {offer.trending && <TrendingUp size={12} />}
              {offer.hot && <Zap size={12} />}
            </AnimatedBadge>
          </div>
        )}

        {/* Contador regresivo */}
        {offer.timeLeft && (
          <div className="absolute bottom-4 right-4">
            <CountdownTimer time={offer.timeLeft} />
          </div>
        )}

        {/* Botón de corazón */}
        <button className="absolute top-16 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-transform duration-300 hover:scale-110">
          <Heart
            size={20}
            className="text-gray-400 hover:text-red-500 transition-colors duration-300"
          />
        </button>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="relative p-5 z-10">
        {/* Título y categoría */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-extrabold" style={{ color: colors.dark }}>
            {offer.title}
          </h3>
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{
              backgroundColor: `${colors.light}20`,
              color: colors.light,
            }}
          >
            {offer.category}
          </span>
        </div>

        {/* Descripción con gradiente */}
        <div className="relative">
          <p className="text-gray-600 mb-3">{offer.description}</p>
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

        {/* Rating mejorado */}
        <div className="flex items-center mt-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < Math.floor(offer.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-gray-700 ml-2 text-sm font-medium">
            {offer.rating}
          </span>
        </div>

        {/* Precios y botón de compra */}
        <div className="flex justify-between items-end mt-4">
          <div>
            <span className="text-gray-400 line-through text-sm">
              €{offer.originalPrice}
            </span>
            <div className="flex items-baseline gap-2">
              <p
                className="text-2xl font-black"
                style={{ color: colors.primary }}
              >
                €{offer.currentPrice}
              </p>
              <Tag size={16} className="text-gray-400" />
            </div>
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

        {/* Barra de progreso para artículos limitados */}
        {offer.hot && (
          <div className="mt-4">
            <div className="text-xs text-gray-500 mb-1 flex justify-between">
              <span>Vendidos: 78%</span>
              <span>Disponibles: 22%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: "78%",
                  background: `linear-gradient(to right, ${colors.accent}, ${colors.light})`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Ribbon para ofertas destacadas */}
      {offer.trending && (
        <div className="absolute -top-1 -left-1 overflow-hidden w-24 h-24 pointer-events-none">
          <div
            className="absolute top-0 left-0 transform -rotate-45 -translate-y-4 -translate-x-8 w-28 text-center py-1 text-xs font-bold"
            style={{ backgroundColor: colors.accent, color: "white" }}
          >
            TOP
          </div>
        </div>
      )}
    </div>
  );
};

// Componente principal para filtros con animación
const OfferFilters = ({ activeFilter, setActiveFilter }) => {
  const filters = ["Todos", "Tecnología", "Ropa", "Hogar", "Deportes"];

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

// Componente de barra de búsqueda mejorada
const SearchBar = () => (
  <div className="relative mb-8 group">
    <input
      type="text"
      placeholder="Buscar ofertas increíbles..."
      className="w-full p-4 pl-12 pr-10 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-transparent transition-all duration-300 group-hover:shadow-md"
      style={{
        boxShadow: "0 4px 6px rgba(73, 197, 129, 0.1)",
        focusWithin: { boxShadow: `0 0 0 3px ${colors.primary}30` },
      }}
    />
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
    <button className="absolute inset-y-0 right-0 flex items-center pr-3">
      <div className="p-1 rounded-md hover:bg-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
      </div>
    </button>
  </div>
);

// Componente de banner principal mejorado
const HeroBanner = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Formato de tiempo para el contador
  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const seconds = currentTime.getSeconds().toString().padStart(2, "0");

  return (
    <div className="relative mb-10 rounded-xl overflow-hidden shadow-2xl group mt-6">
      {/* Imagen principal */}
      <img
        src="/api/placeholder/1200/400"
        alt="Ofertas especiales"
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
          PROMOCIÓN ESPECIAL
        </div>
        <h2 className="text-4xl font-black mb-2 leading-tight">
          Ofertas Exclusivas
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-500">
            Hasta 70% Off
          </span>
        </h2>
        <p className="mb-6 text-gray-200">
          Descubre increíbles descuentos en nuestros productos más vendidos.
          ¡Tiempo limitado!
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

      {/* Contador en vivo */}
      <div className="absolute top-6 right-6 bg-black bg-opacity-70 p-4 rounded-lg backdrop-blur-sm">
        <div className="text-xs text-white mb-1 font-medium">TERMINA EN:</div>
        <div className="flex gap-2">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-white text-gray-800 flex items-center justify-center text-2xl font-black">
              {hours}
            </div>
            <span className="text-white text-xs mt-1">HORAS</span>
          </div>
          <div className="text-white text-2xl font-bold">:</div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-white text-gray-800 flex items-center justify-center text-2xl font-black">
              {minutes}
            </div>
            <span className="text-white text-xs mt-1">MIN</span>
          </div>
          <div className="text-white text-2xl font-bold">:</div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-white text-gray-800 flex items-center justify-center text-2xl font-black">
              {seconds}
            </div>
            <span className="text-white text-xs mt-1">SEG</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de paginación mejorado
const Pagination = () => (
  <div className="flex justify-center items-center mt-10 gap-2">
    <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-all duration-300 hover:shadow-md">
      <ChevronLeft size={20} className="text-gray-600" />
    </button>
    <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 bg-white text-gray-800 transition-all duration-300 hover:shadow-md">
      1
    </button>
    <button
      className="w-10 h-10 flex items-center justify-center rounded-full text-white shadow-md transition-all duration-300 transform scale-110"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.light})`,
      }}
    >
      2
    </button>
    <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 bg-white text-gray-800 transition-all duration-300 hover:shadow-md">
      3
    </button>
    <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-all duration-300 hover:shadow-md">
      <ChevronRight size={20} className="text-gray-600" />
    </button>
  </div>
);

// Componente para banner flotante
const FloatingBanner = () => (
  <div
    className="fixed bottom-6 right-6 z-50 animate-bounce"
    style={{ animationDuration: "3s" }}
  >
    <div className="relative bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3">
      <Zap size={24} />
      <div>
        <div className="font-bold">¡OFERTA FLASH!</div>
        <div className="text-xs">Usa el código: SUPER25</div>
      </div>
      <button className="ml-4 bg-white text-pink-500 px-3 py-1 rounded font-bold text-sm hover:bg-gray-100 transition-colors">
        Usar
      </button>
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-red-500">
        X
      </div>
    </div>
  </div>
);

// Componente para sección de categorías destacadas
const FeaturedCategories = () => (
  <div className="mb-12">
    <h3 className="text-xl font-bold mb-6" style={{ color: colors.dark }}>
      Categorías Destacadas
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {["Tecnología", "Ropa", "Hogar", "Deportes"].map((category, index) => (
        <div
          key={index}
          className="relative group overflow-hidden rounded-lg cursor-pointer"
        >
          <img
            src={`/api/placeholder/300/200?text=${category}`}
            alt={category}
            className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <h4 className="text-white font-bold">{category}</h4>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span
              className="bg-white px-3 py-1 rounded-full text-sm font-bold"
              style={{ color: colors.primary }}
            >
              Ver Ofertas
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Componente principal de vista de ofertas
export default function OffersView() {
  const [activeFilter, setActiveFilter] = useState("Todos");

  // Filtrar ofertas según el filtro activo
  const filteredOffers =
    activeFilter === "Todos"
      ? offerData
      : offerData.filter((offer) => offer.category === activeFilter);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Fondo con gradiente ligero */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-300 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-green-300 to-transparent rounded-full blur-3xl"></div>
      </div>
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
            className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r text-white mb-4 text-center"
          >
            Ofertas <span style={{ color: colors.primary }}>Increíbles</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-white/90 max-w-xl mx-auto mb-8 text-center"
          >
            Descubre nuestras mejores ofertas y promociones exclusivas.
            Actualizado diariamente para brindarte los mejores precios en todos
            nuestros productos.
          </motion.p>
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
      <FloatingBanner />

      <div className="max-w-7xl mx-auto relative z-10">
        <HeroBanner />

        <FeaturedCategories />

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                Filtros Avanzados
              </h3>

              <div className="space-y-6">
                <SearchBar />

                <div>
                  <h4 className="font-bold mb-4 text-gray-700 flex items-center gap-2">
                    <Tag size={16} />
                    Categorías
                  </h4>
                  <OfferFilters
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-bold mb-4 text-gray-700 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Rango de precio
                  </h4>
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>€0</span>
                      <span>€5000</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Min"
                        className="w-full pl-8 pr-2 py-2 rounded-lg border border-gray-200 text-sm"
                      />
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                        €
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Max"
                        className="w-full pl-8 pr-2 py-2 rounded-lg border border-gray-200 text-sm"
                      />
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                        €
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-bold mb-4 text-gray-700 flex items-center gap-2">
                    <Star size={16} />
                    Valoración
                  </h4>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`rating-${rating}`}
                          className="mr-2 h-4 w-4 accent-green-500"
                        />
                        <label
                          htmlFor={`rating-${rating}`}
                          className="flex items-center"
                        >
                          {[...Array(rating)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className="text-yellow-400 fill-current"
                            />
                          ))}
                          {[...Array(5 - rating)].map((_, i) => (
                            <Star key={i} size={16} className="text-gray-300" />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            y más
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-bold mb-4 text-gray-700 flex items-center gap-2">
                    <Clock size={16} />
                    Tipo de Oferta
                  </h4>
                  <div className="space-y-2">
                    {["Flash", "Destacadas", "Temporada", "Limitadas"].map(
                      (type) => (
                        <div key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`type-${type}`}
                            className="mr-2 h-4 w-4 accent-green-500"
                          />
                          <label
                            htmlFor={`type-${type}`}
                            className="text-sm text-gray-600"
                          >
                            {type}
                          </label>
                        </div>
                      )
                    )}
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
                ¡Oferta Especial!
              </h4>
              <p className="mb-4 text-sm opacity-90 relative z-10">
                Suscríbete a nuestro boletín y recibe un 15% de descuento en tu
                primera compra.
              </p>

              <div className="relative z-10">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="w-full px-4 py-2 rounded-lg mb-2 text-gray-800 text-sm"
                />
                <button className="w-full bg-white text-blue-700 font-bold py-2 rounded-lg hover:bg-blue-50 transition-colors">
                  ¡Quiero mi descuento!
                </button>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="w-full md:w-3/4">
            {/* Header de sección */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-gray-700 font-bold">
                  {filteredOffers.length} Resultados
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Ordenar por:</span>
                <select className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>Popularidad</option>
                  <option>Precio: Bajo a Alto</option>
                  <option>Precio: Alto a Bajo</option>
                  <option>Más recientes</option>
                </select>
              </div>
            </div>

            {/* Grid de ofertas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>

            {/* Paginación */}
            <Pagination />
          </div>
        </div>

        {/* Banner inferior */}
        <div className="mt-16 mb-10 relative overflow-hidden rounded-xl shadow-2xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 relative overflow-hidden h-64">
              <img
                src="/api/placeholder/600/400?text=SUPER OFERTAS"
                alt="Ofertas especiales"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-900 opacity-70"></div>
            </div>
            <div
              className="w-full md:w-1/2 p-8 text-white"
              style={{
                background: `linear-gradient(135deg, ${colors.secondary}, ${colors.dark})`,
              }}
            >
              <h3 className="text-2xl font-bold mb-4">
                ¿Quieres Descuentos Exclusivos?
              </h3>
              <p className="mb-6">
                Únete a nuestro programa de fidelidad y recibe ofertas
                personalizadas directamente en tu email.
              </p>
              <button
                className="px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105"
                style={{ backgroundColor: colors.accent, color: "white" }}
              >
                Unirse ahora
              </button>
            </div>
          </div>

          {/* Decoración */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-12 translate-y-12"></div>
        </div>

        {/* Sección de testimonios */}
        <div className="mb-16">
          <h3
            className="text-2xl font-bold text-center mb-8"
            style={{ color: colors.dark }}
          >
            Lo que dicen nuestros clientes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-md relative"
              >
                {/* Comilla decorativa */}
                <div
                  className="absolute top-4 right-4 text-6xl opacity-10"
                  style={{ color: colors.primary }}
                >
                  ❝
                </div>

                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold" style={{ color: colors.dark }}>
                      Cliente Satisfecho {i}
                    </h4>
                    <div className="flex">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          size={14}
                          className="text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  "Las ofertas son increíbles, he conseguido productos de
                  calidad a precios muy competitivos. La experiencia de compra
                  es excelente y el servicio al cliente es de primera clase."
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
