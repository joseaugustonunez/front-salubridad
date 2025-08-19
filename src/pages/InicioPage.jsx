import { useState, useEffect, useRef } from 'react';
import { FaUtensils, FaSearch, FaStar, FaHeart, FaCommentAlt, FaLocationArrow, FaClock, FaRegClock, FaChevronLeft, FaChevronRight,FaThumbsUp  } from 'react-icons/fa';
import { MdRestaurant, MdLocalOffer, MdFastfood, MdDeliveryDining, MdTrendingUp, MdBookmark } from 'react-icons/md';
import { obtenerEstablecimientosAprobados, buscarEstablecimientosPorNombre } from '../api/establecimientos';
import { obtenerCategorias } from '../api/categorias';
import { obtenerTipos } from '../api/tipos';
import { obtenerPromociones } from '../api/promociones';
import { useNavigate } from "react-router-dom";
import { MdSearch } from 'react-icons/md';
export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [establecimientos, setEstablecimientos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Cargar datos de la API
        const [establecimientosData, categoriasData, tiposData, promocionesData] = await Promise.all([
          obtenerEstablecimientosAprobados(),
          obtenerCategorias(),
          obtenerTipos(),
          obtenerPromociones()
        ]);
        
        setEstablecimientos(establecimientosData);
        setCategorias(categoriasData);
        setTipos(tiposData);
        setPromociones(promocionesData);
        
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError("Hubo un problema al cargar los datos. Por favor, intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

  // Función para manejar la búsqueda
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      // Si el campo está vacío, cargar todos los establecimientos
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

  // Funciones para el carrusel
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Función para calcular la distancia (podría implementarse con geolocalización real)
  const calcularDistancia = (coordenadas) => {
    if (!coordenadas || !coordenadas.latitud || !coordenadas.longitud) return "N/A";
    // Aquí iría la implementación real con la ubicación del usuario
    // Por ahora retornamos una distancia estimada basada en las coordenadas
    return `${(Math.abs(coordenadas.latitud) + Math.abs(coordenadas.longitud) / 2).toFixed(1)} km`;
  };

  // Función para formatear horario
  const formatearHorario = (horarios) => {
    if (!horarios || horarios.length === 0) return "Horario no disponible";
    
    // Simplemente tomamos el primer horario disponible para mostrar
    const horario = horarios[0];
    return `${horario.entrada} - ${horario.salida}`;
  };

  // Función para obtener imagen con path completo o placeholder
  const obtenerImagen = (imagen) => {
    if (!imagen) return "/api/placeholder/400/300";
    // Ajusta esto según cómo sirvas las imágenes desde tu backend
    return `http://localhost:3000/uploads/${imagen}`; 
  };

  // Obtener establecimiento destacado (el primero con más seguidores o likes)
  const establecimientoDestacado = establecimientos.length > 0 
    ? establecimientos.sort((a, b) => (b.seguidores?.length || 0) - (a.seguidores?.length || 0))[0]
    : null;

  // Verificar si un establecimiento tiene promociones
  const tienePromociones = (establecimientoId) => {
    return promociones.some(promo => promo.establecimiento === establecimientoId);
  };

  // Obtener promociones de un establecimiento
  const obtenerPromocionesDeEstablecimiento = (establecimientoId) => {
    return promociones.filter(promo => promo.establecimiento === establecimientoId);
  };

  // Función para verificar si un usuario ha dado like
  const haLiked = (establecimiento) => {
    // Aquí implementarías la lógica para verificar si el usuario actual ha dado like
    // Suponiendo que tienes un ID de usuario en localStorage o context
    const userId = localStorage.getItem('userId');
    return establecimiento.likes && establecimiento.likes.includes(userId);
  };
  
  const handleCardClick = (id) => {
    navigate(`/establecimientodetalle/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section con diseño dinámico */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-[#254A5D] to-[#337179] overflow-hidden">
        {/* Círculos decorativos visibles */}
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-white/30 rounded-full blur-[100px] z-0"></div>
        <div className="absolute bottom-[-120px] right-[-80px] w-[250px] h-[250px] bg-[#49C581]/40 rounded-full blur-[80px] z-0"></div>
        <div className="absolute top-[40%] right-[20%] w-[150px] h-[150px] bg-white/20 rounded-full blur-[60px] z-0"></div>
        <div className="absolute bottom-[10%] left-[30%] w-[200px] h-[200px] bg-[#37a6ca]/30 rounded-full blur-[70px] z-0"></div>

        {/* Contenido principal con z-10 para estar encima */}
        <div className="relative z-10 text-center max-w-3xl px-4">
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Descubre sabores inolvidables cerca de ti
          </h2>
          <p className="text-xl text-white/90 mb-8">Los mejores restaurantes y ofertas gastronómicas en un solo lugar</p>

          {/* Buscador */}
          <form onSubmit={handleSearch} className="bg-white p-2 rounded-xl shadow-xl flex items-center max-w-2xl mx-auto backdrop-blur-sm">
            <div className="bg-gray-100 p-3 rounded-lg">
              <FaSearch className="text-[#337179]" />
            </div>
            <input 
              type="text" 
              placeholder="Busca restaurantes, comidas, ofertas..." 
              className="flex-1 px-4 py-3 outline-none text-[#254A5D] bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-gradient-to-r from-[#49C581] to-[#37a6ca] hover:from-[#37a6ca] hover:to-[#49C581] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              Buscar
            </button>
          </form>

          {/* Categorías */}
          <div className="flex justify-center mt-6 gap-3">
            {loading ? (
              <div className="text-white">Cargando categorías...</div>
            ) : (
              <>
                <div className="bg-white/30 backdrop-blur-md px-4 py-2 rounded-full text-white flex items-center shadow-md">
                  <MdFastfood className="mr-2" /> Comida Rápida
                </div>
                <div className="bg-white/30 backdrop-blur-md px-4 py-2 rounded-full text-white flex items-center shadow-md">
                  <MdRestaurant className="mr-2" /> Restaurantes
                </div>
                <div className="bg-white/30 backdrop-blur-md px-4 py-2 rounded-full text-white flex items-center shadow-md">
                  <MdLocalOffer className="mr-2" /> Ofertas
                </div>
              </>
            )}
          </div>

          {/* Scroll icon */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
            <div className="animate-bounce bg-white/30 backdrop-blur-sm p-2 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos con diseño de carrusel */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-bold text-[#254A5D]">Explorar por Tipos</h3>
            <a href="#" className="text-[#49C581] font-medium flex items-center hover:underline">
              Ver todos los tipos
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
          
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#49C581] mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando tipos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              {error}
            </div>
          ) : (
            <div className="relative">
              {/* Botones de navegación del carrusel */}
              <button 
                onClick={() => scrollCarousel('left')} 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Anterior"
              >
                <FaChevronLeft className="text-[#254A5D]" />
              </button>
              <button 
                onClick={() => scrollCarousel('right')} 
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Siguiente"
              >
                <FaChevronRight className="text-[#254A5D]" />
              </button>
              
              {/* Carrusel de tipos */}
              <div 
                ref={carouselRef}
                className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4 px-4 -mx-4 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {tipos.map((tipo, index) => {
                  // Colores preestablecidos para tipos
                  const colors = ["#49C581", "#337179", "#37a6ca", "#F8485E"];
                  const color = colors[index % colors.length];
                  
                  // Contar establecimientos por tipo
                  const count = establecimientos.filter(est => 
                    est.tipo && est.tipo.some(t => t._id === tipo._id)
                  ).length;
                  
                  return (
                    <div key={tipo._id} className="group cursor-pointer flex-shrink-0 w-64 snap-start mr-4">
                      <div className="bg-white rounded-xl shadow-md overflow-hidden group-hover:shadow-lg transition-all duration-300 border border-gray-100 h-full">
                        <div className="flex items-center p-6">
                          <div className="flex-shrink-0 rounded-full p-3" style={{ backgroundColor: `${color}20` }}>
                            <div style={{ color: color }}>
                              <MdRestaurant className="text-3xl" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-semibold text-[#254A5D]">{tipo.tipo_nombre}</h4>
                            <p className="text-gray-500 text-sm">{count} lugares</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contenido Principal - Restaurantes y Ofertas Unificados */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-[#254A5D]">Descubre lugares & ofertas</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-full text-sm ${activeFilter === 'all' ? 'bg-[#49C581] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveFilter('featured')}
                className={`px-4 py-2 rounded-full text-sm ${activeFilter === 'featured' ? 'bg-[#49C581] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
              >
                Destacados
              </button>
              <button
                onClick={() => setActiveFilter('offers')}
                className={`px-4 py-2 rounded-full text-sm ${activeFilter === 'offers' ? 'bg-[#49C581] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
              >
                Con ofertas
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#49C581] mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando establecimientos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              {error}
            </div>
          ) : establecimientos.length === 0 ? (
            <div className="text-center py-10">
              <div className="bg-white p-8 rounded-xl shadow-md max-w-lg mx-auto">
                <MdSearch className="text-5xl text-gray-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-[#254A5D] mb-2">No se encontraron resultados</h4>
                <p className="text-gray-600 mb-4">
                  No encontramos establecimientos que coincidan con tu búsqueda. Intenta con otros términos.
                </p>
                <button 
                  onClick={async () => {
                    try {
                      setLoading(true);
                      const establecimientos = await obtenerEstablecimientosAprobados();
                      setEstablecimientos(establecimientos);
                      setSearchTerm('');
                      setLoading(false);
                    } catch (err) {
                      console.error("Error:", err);
                      setLoading(false);
                    }
                  }}
                  className="bg-[#49C581] text-white px-6 py-2 rounded-lg hover:bg-[#37a6ca] transition-colors"
                >
                  Ver todos los establecimientos
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Restaurante Destacado */}
              {establecimientoDestacado && (
  <div className="mb-12">
    <div className="bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 relative">
          <img 
            src={obtenerImagen(establecimientoDestacado.portada || establecimientoDestacado.imagen)}
            alt={establecimientoDestacado.nombre}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-4 left-4 bg-[#F8485E] text-white px-3 py-1 rounded-lg flex items-center text-sm font-medium">
            <MdTrendingUp className="mr-1" /> Destacado
          </div>
        </div>
        <div className="md:w-1/2 p-8">
          <div className="flex flex-wrap items-start mb-4">
            {/* Información del establecimiento */}
            <div className="flex-grow pr-2">
              <h3 className="text-2xl font-bold text-[#254A5D] mb-1">{establecimientoDestacado.nombre}</h3>
              <div className="flex items-center text-yellow-500 mb-2">
                {Array(5).fill(0).map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < Math.round(parseFloat(establecimientoDestacado.promedioCalificaciones || 0)) ? 'text-yellow-500' : 'text-gray-300'} 
                  />
                ))}
                <span className="ml-2 text-gray-700">
                  {establecimientoDestacado.promedioCalificaciones || '0'} ({establecimientoDestacado.totalResenas || 0} reseñas)
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {establecimientoDestacado.categoria && establecimientoDestacado.categoria.map(cat => (
                  <span key={cat._id} className="bg-gray-100 text-[#337179] px-3 py-1 rounded-full text-sm">
                    {cat.nombre}
                  </span>
                ))}
                {establecimientoDestacado.tipo && establecimientoDestacado.tipo.map(tipo => (
                  <span key={tipo._id} className="bg-gray-100 text-[#337179] px-3 py-1 rounded-full text-sm">
                    {tipo.tipo_nombre}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Botones de interacción */}
            <div className="flex items-center space-x-2 mt-1">
              <button className={`text-${haLiked(establecimientoDestacado) ? '[#F8485E]' : 'gray-400'} p-2 rounded-full hover:bg-red-50 transition-colors`}>
                <FaHeart size={20} />
              </button>
              <button className="text-gray-400 p-2 rounded-full hover:bg-blue-50 transition-colors">
                <FaThumbsUp size={20} />
              </button>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6">
            {establecimientoDestacado.descripcion || "Sin descripción disponible."}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {establecimientoDestacado.ubicacion && establecimientoDestacado.ubicacion[0] && (
              <div className="flex items-center text-gray-600">
                <FaLocationArrow className="mr-2 text-[#37a6ca]" />
                <span>
                  {calcularDistancia(establecimientoDestacado.ubicacion[0].coordenadas)}
                </span>
              </div>
            )}
            <div className="flex items-center text-gray-600">
              <FaRegClock className="mr-2 text-[#37a6ca]" />
              <span>
                {formatearHorario(establecimientoDestacado.horario)}
              </span>
            </div>
          </div>
          
          {/* Oferta Destacada si existe */}
          {tienePromociones(establecimientoDestacado._id) && (
            <div className="bg-gradient-to-r from-[#49C581]/10 to-[#37a6ca]/10 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-[#254A5D] flex items-center">
                    <MdLocalOffer className="mr-2 text-[#F8485E]" />
                    Oferta especial
                  </h4>
                  <p className="text-gray-700">
                    {obtenerPromocionesDeEstablecimiento(establecimientoDestacado._id)[0]?.titulo || "Oferta disponible"}
                  </p>
                </div>
                <span className="bg-[#F8485E] text-white px-2 py-1 rounded text-sm font-bold">
                  {obtenerPromocionesDeEstablecimiento(establecimientoDestacado._id)[0]?.descuento || "Oferta"}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex space-x-4">
            <button 
              onClick={() => handleCardClick(establecimientoDestacado._id)}
              className="flex-1 bg-gradient-to-r from-[#49C581] to-[#37a6ca] hover:from-[#37a6ca] hover:to-[#49C581] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              Ver Detalle
            </button>
            <button className="flex-1 border border-[#337179] text-[#337179] hover:bg-[#337179] hover:text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Ofertas
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

              {/* Contenido principal con efecto de cuadrícula fluida */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Restaurantes */}
                <div className="md:col-span-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {establecimientos
                      .filter(est => 
                        activeFilter === 'all' || 
                        (activeFilter === 'featured' && est.verificado) ||
                        (activeFilter === 'offers' && tienePromociones(est._id))
                      )
                      .map(establecimiento => (
                        <div key={establecimiento._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group">
                          <div className="relative">
                            <img 
                              src={obtenerImagen(establecimiento.imagen)}
                              alt={establecimiento.nombre}
                              className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            {establecimiento.verificado && (
                              <div className="absolute top-4 left-4 bg-[#F8485E] text-white px-3 py-1 rounded-lg text-sm font-medium">
                                Destacado
                              </div>
                            )}
                            <button className={`absolute top-4 right-4 bg-white/80 p-2 rounded-full ${haLiked(establecimiento) ? 'text-[#F8485E]' : 'text-gray-500 hover:text-[#F8485E]'} backdrop-blur-sm`}>
                              <FaHeart />
                            </button>
                          </div>
                          
                          <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-semibold text-[#254A5D]">{establecimiento.nombre}</h4>
                              <div className="flex items-center text-yellow-500">
                                <FaStar size={14} />
                                <span className="ml-1 text-gray-700 text-sm">{establecimiento.promedioCalificaciones || '0'}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              {establecimiento.tipo && establecimiento.tipo.slice(0, 2).map(tipo => (
                                <span key={tipo._id} className="bg-gray-100 text-[#337179] px-2 py-1 rounded-full text-xs">
                                  {tipo.tipo_nombre}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex justify-between text-sm text-gray-500 mb-4">
                              {establecimiento.ubicacion && establecimiento.ubicacion[0] && (
                                <div className="flex items-center">
                                  <FaLocationArrow className="mr-1 text-xs" />
                                  <span>{calcularDistancia(establecimiento.ubicacion[0].coordenadas)}</span>
                                </div>
                              )}
                              <div className="flex items-center">
                                <FaClock className="mr-1 text-xs" />
                                <span>{formatearHorario(establecimiento.horario)}</span>
                              </div>
                            </div>
                            
                            {/* Mini oferta si existe */}
                            {tienePromociones(establecimiento._id) && (
                              <div className="bg-[#49C581]/10 p-2 rounded mb-4 flex justify-between items-center">
                                <span className="text-sm text-[#254A5D] font-medium flex items-center">
                                  <MdLocalOffer className="mr-1 text-[#F8485E]" />
                                  {obtenerPromocionesDeEstablecimiento(establecimiento._id)[0]?.titulo || "Oferta disponible"}
                                </span>
                                <span className="bg-[#F8485E] text-white text-xs px-2 py-1 rounded">
                                  {obtenerPromocionesDeEstablecimiento(establecimiento._id)[0]?.descuento || "Oferta"}
                                </span>
                              </div>
                            )}
                            
                            <button 
                              onClick={() => handleCardClick(establecimiento._id)}
                              className="w-full bg-white border border-[#49C581] text-[#49C581] hover:bg-[#49C581] hover:text-white py-2 rounded-lg transition-colors font-medium text-sm"
                            >
                              Ver detalles
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Ofertas destacadas - Sección lateral */}
                <div className="md:col-span-4">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-6">
                    <h4 className="text-lg font-semibold text-[#254A5D] mb-4 flex items-center">
                      <MdLocalOffer className="mr-2 text-[#F8485E]" />
                      Ofertas Destacadas
                    </h4>
                    
                    {promociones.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No hay ofertas disponibles en este momento.</p>
                    ) : (
                      <div className="space-y-4">
                        {promociones.slice(0, 3).map(promocion => {
                          const establecimiento = establecimientos.find(est => est._id === promocion.establecimiento);
                          
                          return (
                            <div key={promocion._id} className="group cursor-pointer">
                              <div className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                  <img 
                                    src={obtenerImagen(promocion.imagen || (establecimiento && establecimiento.imagen))}
                                    alt={promocion.titulo}
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h5 className="font-medium text-[#254A5D] group-hover:text-[#49C581] transition-colors">{promocion.titulo}</h5>
                                    <span className="bg-[#F8485E] text-white text-xs px-2 py-1 rounded">
                                      {promocion.descuento || "Oferta"}
                                    </span>
                                  </div>
                                  <p className="text-sm text-[#337179] mb-1">{establecimiento ? establecimiento.nombre : "Restaurante"}</p>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <FaClock className="mr-1" />
                                    <span>Válido hasta: {promocion.fechaFin ? new Date(promocion.fechaFin).toLocaleDateString() : "Tiempo limitado"}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    <button className="w-full mt-4 py-2 border border-dashed border-[#49C581] text-[#49C581] rounded-lg hover:bg-[#49C581]/5 transition-colors text-sm font-medium flex items-center justify-center">
                      <span>Ver todas las ofertas</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                  
                  {/* Tarjeta adicional - Para guardar */}
                  <div className="bg-gradient-to-r from-[#254A5D] to-[#337179] rounded-xl shadow-md overflow-hidden text-white p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-white/20 p-3 rounded-full">
                        <MdBookmark className="text-xl" />
                      </div>
                      <h4 className="text-lg font-semibold">Guarda tus favoritos</h4>
                    </div>
                    
                    <p className="text-white/80 mb-4">
                      Crea colecciones personalizadas con tus restaurantes y ofertas favoritas para acceder rápidamente.
                    </p>
                    
                    <button className="w-full bg-white text-[#254A5D] py-2 rounded-lg hover:bg-white/90 transition-colors font-medium">
                      Iniciar Sesión
                    </button>
                  </div>
                </div>
              </div>

              {establecimientos.length > 0 && (
                <div className="mt-12 text-center">
                  <button className="bg-white border border-[#337179] text-[#337179] hover:bg-[#337179] hover:text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center">
                    Cargar más
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}