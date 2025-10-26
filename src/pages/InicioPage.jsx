import { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaStar,
  FaHeart,
  FaLocationArrow,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdRestaurant, MdLocalOffer } from "react-icons/md";
import {
  obtenerEstablecimientosAprobados,
  buscarEstablecimientosPorNombre,
} from "../api/establecimientos";
import { obtenerCategorias } from "../api/categorias";
import { obtenerTipos } from "../api/tipos";
import { obtenerPromociones } from "../api/promociones";
import { useNavigate } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Chatbot from "../components/Chatbot";
// Import estilos de Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [establecimientos, setEstablecimientos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // refs para navegación de categorías
  const categoriasPrevRef = useRef(null);
  const categoriasNextRef = useRef(null);

  // refs para navegación de establecimientos (flechas en modo laptop)
  const establecimientosPrevRef = useRef(null);
  const establecimientosNextRef = useRef(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [
          establecimientosData,
          categoriasData,
          tiposData,
          promocionesData,
        ] = await Promise.all([
          obtenerEstablecimientosAprobados(),
          obtenerCategorias(),
          obtenerTipos(),
          obtenerPromociones(),
        ]);

        setEstablecimientos(establecimientosData);
        setCategorias(categoriasData);
        setTipos(tiposData);
        setPromociones(promocionesData);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError(
          "Hubo un problema al cargar los datos. Por favor, intenta nuevamente."
        );
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      try {
        const establecimientos = await obtenerEstablecimientosAprobados();
        setEstablecimientos(establecimientos);
      } catch (err) {
        console.error("Error al cargar los establecimientos:", err);
        setError("Hubo un problema al cargar los establecimientos.");
      }
      return;
    }

    try {
      setLoading(true);
      const resultados = await buscarEstablecimientosPorNombre(searchTerm);
      setEstablecimientos(resultados);
      setLoading(false);
    } catch (err) {
      console.error("Error en la búsqueda:", err);
      setError("Hubo un problema al realizar la búsqueda.");
      setLoading(false);
    }
  };

  const calcularDistancia = (coordenadas) => {
    if (!coordenadas || !coordenadas.latitud || !coordenadas.longitud)
      return "N/A";
    return `${(
      Math.abs(coordenadas.latitud) +
      Math.abs(coordenadas.longitud) / 2
    ).toFixed(1)} km`;
  };

  const formatearHorario = (horarios) => {
    if (!horarios || horarios.length === 0) return "Horario no disponible";
    const horario = horarios[0];
    return `${horario.entrada} - ${horario.salida}`;
  };

  const obtenerImagen = (imagen) => {
    if (!imagen) return "/api/placeholder/400/300";
    return `https://back-salubridad.sistemasudh.com/uploads/${imagen}`;
  };

  const tienePromociones = (establecimientoId) => {
    return promociones.some(
      (promo) => promo.establecimiento === establecimientoId
    );
  };

  const obtenerPromocionesDeEstablecimiento = (establecimientoId) => {
    return promociones.filter(
      (promo) => promo.establecimiento === establecimientoId
    );
  };

  const handleCardClick = (id) => {
    navigate(`/establecimientodetalle/${id}`);
  };

  // Establecimientos filtrados según el filtro activo
  const establecimientosFiltrados = establecimientos.filter(
    (est) =>
      activeFilter === "all" ||
      (activeFilter === "featured" && est.verificado) ||
      (activeFilter === "offers" && tienePromociones(est._id))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Responsive */}
      <section className="relative min-h-[60vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#254A5D] via-[#337179] to-[#49C581] px-4 pb-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src="../public/video.mp4" type="video/mp4" />
          Tu navegador no soporta videos en HTML5.
        </video>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-72 md:h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-[#49C581]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl w-full px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#00f0b5] to-[#00a6fb] drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
            Sabores que Inspiran
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 md:mb-8 font-light px-4">
            Descubre experiencias gastronómicas únicas cerca de ti
          </p>

          <form
            onSubmit={handleSearch}
            className="bg-white/80 p-1.5 rounded-xl shadow-lg flex items-center max-w-md mx-auto backdrop-blur-sm"
          >
            <div className="bg-gray-100 p-2 rounded-lg">
              <FaSearch className="text-[#337179] text-base" />
            </div>
            <input
              type="text"
              placeholder="Busca restaurantes, comidas, ofertas..."
              className="flex-1 px-3 py-2 outline-none text-[#254A5D] bg-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#49C581] to-[#37a6ca] hover:from-[#37a6ca] hover:to-[#49C581] text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300"
            >
              Buscar
            </button>
          </form>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-12 md:h-16 rotate-180"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="fill-white"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="fill-white"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="fill-white"
            ></path>
          </svg>
        </div>
      </section>

      {/* Carrusel de Categorías con Swiper */}
      <section className="py-12 md:py-6 bg-white px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-left mb-8 md:mb-16 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#254A5D] mb-3 md:mb-4">
              Explorar por Categorías
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#49C581] mx-auto"></div>
              <p className="mt-3 text-gray-600">Cargando categorías...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="relative categorias-swiper">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={16}
                loop={true}
                centeredSlides={false}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                navigation={true}
                // aseguramos que Swiper use los elementos de navegación referenciados
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = categoriasPrevRef.current;
                  swiper.params.navigation.nextEl = categoriasNextRef.current;
                }}
                pagination={{
                  el: ".categorias-swiper-pagination",
                  clickable: true,
                  bulletClass: "swiper-pagination-bullet-custom",
                  bulletActiveClass: "swiper-pagination-bullet-active-custom",
                }}
                breakpoints={{
                  320: {
                    // en móvil mostrar 1 tarjeta y parte de la siguiente
                    slidesPerView: 1.15,
                    spaceBetween: 16,
                  },
                  640: {
                    slidesPerView: 1.5,
                    spaceBetween: 16,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 2.5,
                    spaceBetween: 24,
                  },
                  1280: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                }}
                className="pb-12"
              >
                {categorias.map((categoria, index) => {
                  const colors = [
                    "#49C581",
                    "#F8485E",
                    "#37a6ca",
                    "#FFD166",
                    "#254A5D",
                    "#337179",
                  ];
                  const color = colors[index % colors.length];

                  const count = establecimientos.filter(
                    (est) =>
                      est.categoria &&
                      est.categoria.some((c) => c._id === categoria._id)
                  ).length;

                  return (
                    <SwiperSlide key={categoria._id}>
                      <div
                        className="cursor-pointer transform hover:scale-105 transition-transform duration-300 h-full"
                        onClick={() => {
                          console.log(
                            "Categoría seleccionada:",
                            categoria.nombre
                          );
                        }}
                      >
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                          <div className="flex items-center p-4 md:p-6">
                            <div
                              className="flex-shrink-0 rounded-2xl p-3 md:p-4"
                              style={{ backgroundColor: `${color}15` }}
                            >
                              <div style={{ color: color }}>
                                <MdRestaurant className="text-2xl md:text-3xl" />
                              </div>
                            </div>
                            <div className="ml-4 md:ml-6 flex-1">
                              <h3 className="font-black text-lg md:text-xl text-[#254A5D] mb-1">
                                {categoria.nombre}
                              </h3>
                              <p className="text-gray-500 text-sm md:text-base">
                                {count} {count === 1 ? "lugar" : "lugares"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              {/* Flechas funcionales solo para categorías */}
              <button
                ref={categoriasPrevRef}
                className="categorias-swiper-button-prev absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hidden sm:flex items-center justify-center"
                aria-label="Anterior categoría"
              >
                <FaChevronLeft className="text-lg md:text-xl text-[#254A5D]" />
              </button>
              <button
                ref={categoriasNextRef}
                className="categorias-swiper-button-next absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hidden sm:flex items-center justify-center"
                aria-label="Siguiente categoría"
              >
                <FaChevronRight className="text-lg md:text-xl text-[#254A5D]" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Filtros Responsive */}
      <section className="py-4 md:py-2 bg-gray-50 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#254A5D] mb-2">
                Lugares Destacados
              </h2>
              <p className="text-gray-600 text-base md:text-lg">
                Los mejores restaurantes y ofertas cerca de ti
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFilter === "all"
                    ? "bg-[#49C581] text-white shadow-lg"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#49C581]"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveFilter("featured")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFilter === "featured"
                    ? "bg-[#49C581] text-white shadow-lg"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#49C581]"
                }`}
              >
                Destacados
              </button>
              <button
                onClick={() => setActiveFilter("offers")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFilter === "offers"
                    ? "bg-[#49C581] text-white shadow-lg"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#49C581]"
                }`}
              >
                Con Ofertas
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#49C581] mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando establecimientos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : establecimientosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
                <MdSearch className="text-5xl text-gray-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-[#254A5D] mb-2">
                  No se encontraron resultados
                </h4>
                <p className="text-gray-600 mb-4">
                  No hay establecimientos que coincidan con tu selección.
                </p>
                <button
                  onClick={() => setActiveFilter("all")}
                  className="bg-[#49C581] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#37a6ca] transition-colors"
                >
                  Ver Todos
                </button>
              </div>
            </div>
          ) : (
            <div className="establecimientos-swiper">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={24}
                loop={true}
                centeredSlides={false}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                // habilitamos navegación y asignamos refs en onBeforeInit
                navigation={true}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl =
                    establecimientosPrevRef.current;
                  swiper.params.navigation.nextEl =
                    establecimientosNextRef.current;
                }}
                pagination={{
                  el: ".establecimientos-swiper-pagination",
                  clickable: true,
                  bulletClass: "swiper-pagination-bullet-custom",
                  bulletActiveClass: "swiper-pagination-bullet-active-custom",
                }}
                breakpoints={{
                  320: {
                    // en móvil mostrar 1 tarjeta y parte de la siguiente
                    slidesPerView: 1.15,
                    spaceBetween: 16,
                  },
                  640: {
                    slidesPerView: 1.2,
                    spaceBetween: 16,
                  },
                  768: {
                    slidesPerView: 1.5,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                  },
                  1280: {
                    slidesPerView: 2.5,
                    spaceBetween: 24,
                  },
                  1536: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                }}
                className="pb-12"
              >
                {establecimientosFiltrados.map((establecimiento) => (
                  <SwiperSlide key={establecimiento._id}>
                    <EstablecimientoCard
                      establecimiento={establecimiento}
                      onClick={handleCardClick}
                      obtenerImagen={obtenerImagen}
                      calcularDistancia={calcularDistancia}
                      formatearHorario={formatearHorario}
                      tienePromociones={tienePromociones}
                      obtenerPromocionesDeEstablecimiento={
                        obtenerPromocionesDeEstablecimiento
                      }
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </section>

      {/* Componente global del asistente (usa createPortal en su interior) */}
      <Chatbot />
    </div>
  );
}

// Componente de tarjeta de establecimiento reutilizable
function EstablecimientoCard({
  establecimiento,
  onClick,
  obtenerImagen,
  calcularDistancia,
  formatearHorario,
  tienePromociones,
  obtenerPromocionesDeEstablecimiento,
}) {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group cursor-pointer h-full"
      onClick={() => onClick(establecimiento._id)}
    >
      <div className="relative overflow-hidden rounded-t-2xl">
        <img
          src={obtenerImagen(establecimiento.imagen)}
          alt={establecimiento.nombre}
          className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        {establecimiento.verificado && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-[#F8485E] to-[#FF6B6B] text-white px-3 py-1 rounded-xl font-bold text-sm">
            Destacado
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl">
          <div className="flex items-center text-yellow-500">
            <FaStar className="mr-1" />
            <span className="font-bold text-gray-800 text-sm">
              {establecimiento.promedioCalificaciones || "0"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg md:text-xl font-black text-[#254A5D] group-hover:text-[#49C581] transition-colors line-clamp-1">
            {establecimiento.nombre}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {establecimiento.tipo?.slice(0, 2).map((tipo) => (
            <span
              key={tipo._id}
              className="bg-gray-100 text-[#337179] px-2 py-1 rounded-full text-xs font-medium"
            >
              {tipo.tipo_nombre}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between text-gray-600 mb-4 gap-2">
          {establecimiento.ubicacion?.[0] && (
            <div className="flex items-center text-sm">
              <FaLocationArrow className="mr-2 text-[#49C581]" />
              <span className="font-medium">
                {calcularDistancia(establecimiento.ubicacion[0].coordenadas)}
              </span>
            </div>
          )}
          <div className="flex items-center text-sm">
            <FaClock className="mr-2 text-[#49C581]" />
            <span className="font-medium">
              {formatearHorario(establecimiento.horario)}
            </span>
          </div>
        </div>

        {/* Mini oferta si existe */}
        {tienePromociones(establecimiento._id) && (
          <div className="bg-[#49C581]/10 p-3 rounded-xl mb-4 flex justify-between items-center">
            <span className="text-sm text-[#254A5D] font-semibold flex items-center">
              <MdLocalOffer className="mr-2 text-[#F8485E]" />
              {obtenerPromocionesDeEstablecimiento(establecimiento._id)[0]
                ?.titulo || "Oferta disponible"}
            </span>
            <span className="bg-[#F8485E] text-white text-xs px-2 py-1 rounded-lg font-bold">
              {obtenerPromocionesDeEstablecimiento(establecimiento._id)[0]
                ?.descuento || "Oferta"}
            </span>
          </div>
        )}

        <button className="w-full bg-gradient-to-r from-[#49C581] to-[#37a6ca] text-white py-3 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm md:text-base">
          Ver Detalles
        </button>
      </div>
    </div>
  );
}
