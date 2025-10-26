import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiFillStar,
  AiOutlineStar,
  AiFillHeart,
  AiOutlineHeart,
} from "react-icons/ai";
import {
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaSearch,
  FaThumbsUp,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { MdOutlineVerified } from "react-icons/md";
import {
  obtenerEstablecimientosAprobados,
  seguirEstablecimiento,
  dejarDeSeguirEstablecimiento,
  likeEstablecimiento,
  quitarLikeEstablecimiento,
  buscarEstablecimientosPorNombre,
} from "../api/establecimientos";
import { obtenerCategorias } from "../api/categorias";
import toast from "react-hot-toast";
export default function EstablecimientoPage() {
  const navigate = useNavigate();
  const [establecimientos, setEstablecimientos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [isLoading, setIsLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [likesDados, setLikesDados] = useState([]);
  const [seguidos, setSeguidos] = useState([]);
  const [seguidores, setSeguidores] = useState({});
  const [userId, setUserId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Colores de la aplicación
  const colors = {
    primary: "#49C581", // Verde principal
    secondary: "#337179", // Azul verdoso
    dark: "#254A5D", // Azul oscuro
    accent: "#F8485E", // Rosa/rojo acento
    blue: "#37a6ca", // Azul
  };

  // Verificar autenticación del usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsAuthenticated(true);
      try {
        const userData = JSON.parse(user);
        setUserId(userData._id || userData.id);

        // Cargar likes y seguimientos del usuario
        cargarEstadosUsuario(userData._id || userData.id);
      } catch (error) {
        console.error("Error al parsear datos de usuario:", error);
      }
    }
  }, []);

  // Cargar categorías
  useEffect(() => {
    const cargandoCategorias = async () => {
      try {
        const data = await obtenerCategorias();
        setCategorias(data);
      } catch (error) {
        console.error("Error al obtener categorias:", error);
      }
    };

    cargandoCategorias();
  }, []);

  // Cargar establecimientos
  useEffect(() => {
    const cargarEstablecimientos = async () => {
      setIsLoading(true);
      try {
        const data = await obtenerEstablecimientosAprobados();
        setEstablecimientos(data);

        // Inicializar likes y seguidores
        const likesObj = {};
        const seguidoresObj = {};
        data.forEach((est) => {
          likesObj[est._id] = est.likes?.length || 0;
          seguidoresObj[est._id] = est.seguidores?.length || 0;
        });
        setLikes(likesObj);
        setSeguidores(seguidoresObj);
      } catch (error) {
        console.error("Error al obtener establecimientos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarEstablecimientos();
  }, []);

  // Cargar estados de likes y seguimientos del usuario
  const cargarEstadosUsuario = async (userId) => {
    try {
      // En un caso real, probablemente tendrías un endpoint para obtener los likes y seguimientos del usuario
      // Por ahora, extraemos esta información de los establecimientos

      const establecimientosData = await obtenerEstablecimientosAprobados();

      // Identificar establecimientos que el usuario ha dado like
      const likesUsuario = establecimientosData
        .filter((est) => est.likes && est.likes.includes(userId))
        .map((est) => est._id);

      // Identificar establecimientos que el usuario sigue
      const seguidosUsuario = establecimientosData
        .filter((est) => est.seguidores && est.seguidores.includes(userId))
        .map((est) => est._id);

      setLikesDados(likesUsuario);
      setSeguidos(seguidosUsuario);
    } catch (error) {
      console.error("Error al cargar estados del usuario:", error);
    }
  };

  // Función de búsqueda
  const handleBuscar = async () => {
    if (!busqueda.trim()) {
      setResultadosBusqueda([]);
      return;
    }

    try {
      // Usar la función real de búsqueda
      const resultados = await buscarEstablecimientosPorNombre(busqueda);
      setResultadosBusqueda(resultados);
    } catch (error) {
      console.error("Error al buscar establecimientos:", error);

      // Fallback: búsqueda local si la API falla
      const resultadosLocales = establecimientos.filter((est) =>
        est.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
      setResultadosBusqueda(resultadosLocales);
    }
  };

  // Alternar seguimiento
  const toggleFavorito = async (id, e) => {
    e.stopPropagation();

    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para seguir establecimientos");
      navigate("/login");
      return;
    }

    try {
      if (seguidos.includes(id)) {
        // Actualizar la UI inmediatamente para una mejor experiencia de usuario
        setSeguidos((prev) => prev.filter((item) => item !== id));
        setSeguidores((prev) => ({
          ...prev,
          [id]: Math.max((prev[id] || 0) - 1, 0),
        }));

        // Luego realizar la petición a la API
        await dejarDeSeguirEstablecimiento(id);
      } else {
        // Actualizar la UI inmediatamente
        setSeguidos((prev) => [...prev, id]);
        setSeguidores((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

        // Luego realizar la petición a la API
        await seguirEstablecimiento(id);
      }
    } catch (error) {
      console.error("Error al actualizar seguimiento:", error);

      // Revertir cambios en caso de error
      if (seguidos.includes(id)) {
        setSeguidos((prev) => [...prev, id]);
        setSeguidores((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      } else {
        setSeguidos((prev) => prev.filter((item) => item !== id));
        setSeguidores((prev) => ({
          ...prev,
          [id]: Math.max((prev[id] || 0) - 1, 0),
        }));
      }

      toast.error(
        "Hubo un error al actualizar el seguimiento. Inténtalo de nuevo."
      );
    }
  };

  // Alternar like
  const toggleLike = async (id, e) => {
    e.stopPropagation();

    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para dar like a establecimientos");
      navigate("/login"); // Redirigir al login
      return;
    }

    try {
      if (likesDados.includes(id)) {
        // Actualizar la UI inmediatamente
        setLikesDados((prev) => prev.filter((item) => item !== id));
        setLikes((prev) => ({
          ...prev,
          [id]: Math.max((prev[id] || 0) - 1, 0),
        }));

        // Luego realizar la petición a la API
        await quitarLikeEstablecimiento(id);
      } else {
        // Actualizar la UI inmediatamente
        setLikesDados((prev) => [...prev, id]);
        setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

        // Luego realizar la petición a la API
        await likeEstablecimiento(id);
      }
    } catch (error) {
      console.error("Error al actualizar like:", error);

      // Revertir cambios en caso de error
      if (likesDados.includes(id)) {
        setLikesDados((prev) => [...prev, id]);
        setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      } else {
        setLikesDados((prev) => prev.filter((item) => item !== id));
        setLikes((prev) => ({
          ...prev,
          [id]: Math.max((prev[id] || 0) - 1, 0),
        }));
      }

      toast.error("Hubo un error al actualizar el like. Inténtalo de nuevo.");
    }
  };

  // Navegar a la página de detalle del establecimiento
  const handleCardClick = (id) => {
    navigate(`/establecimientodetalle/${id}`);
  };

  // Renderizar estrellas para calificación
  const renderEstrellas = (calificacion) => {
    const estrellas = [];
    const valorRedondeado = Math.round(calificacion || 0);

    for (let i = 1; i <= 5; i++) {
      if (i <= valorRedondeado) {
        estrellas.push(
          <AiFillStar
            key={i}
            size={16}
            className="text-amber-400 transition-colors duration-300"
          />
        );
      } else {
        estrellas.push(
          <AiOutlineStar
            key={i}
            size={16}
            className="text-gray-300 transition-colors duration-300"
          />
        );
      }
    }

    return estrellas;
  };

  // Formatear números grandes (1000 -> 1k)
  const formatNumber = (num) => {
    if (!num) return 0;
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num;
  };

  // Filtrar establecimientos según la categoría seleccionada
  const establecimientosFiltrados =
    filtro === "todos"
      ? establecimientos
      : establecimientos.filter((item) =>
          item.categoria?.some((cat) => cat.nombre === filtro)
        );

  // Determinar qué mostrar: resultados de búsqueda o establecimientos filtrados
  const establecimientosAMostrar =
    busqueda.trim() && resultadosBusqueda.length > 0
      ? resultadosBusqueda
      : establecimientosFiltrados;

  // Componente de skeleton para carga
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg overflow-hidden shadow-md p-4 animate-pulse">
      <div className="w-full h-44 bg-gray-200 rounded-lg mb-6"></div>
      <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
      <div className="h-px bg-gray-200 my-4"></div>
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
        <div className="w-1/4 h-8 bg-gray-200 rounded"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded-lg"></div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Header con gradiente */}
      <div
        className="pt-32 pb-12 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.secondary} 100%)`,
        }}
      >
        <div className="max-w-6xl mx-auto relative z-10 px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 text-center"
          >
            Descubre <span style={{ color: colors.primary }}>Amarilis</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-white/90 max-w-xl mx-auto mb-8 text-center"
          >
            Los mejores establecimientos con experiencias inolvidables
          </motion.p>

          {/* Barra de búsqueda */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
              placeholder="Buscar establecimientos o lugares..."
              className="w-full bg-white/90 backdrop-blur-md py-3 pl-6 pr-12 rounded-full border-none shadow-lg focus:outline-none focus:ring-2"
              style={{
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                focusRing: colors.primary,
              }}
            />
            <button
              onClick={handleBuscar}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-white"
              style={{ backgroundColor: colors.blue }}
            >
              <FaSearch size={16} />
            </button>
          </div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 bg-white/20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 bg-white/20 -ml-20 -mb-20"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filtros de categorías */}
        <div className="flex items-center justify-center flex-wrap gap-3 mb-10">
          <button
            onClick={() => {
              setFiltro("todos");
              setBusqueda(""); // Limpiar búsqueda al cambiar filtro
              setResultadosBusqueda([]);
            }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              filtro === "todos"
                ? "text-white shadow-md"
                : "bg-white text-gray-700 hover:shadow-sm"
            }`}
            style={{
              backgroundColor: filtro === "todos" ? colors.primary : "white",
            }}
          >
            Todos
          </button>

          {categorias.map((cat) => (
            <button
              key={cat._id || cat.id}
              onClick={() => {
                setFiltro(cat.nombre);
                setBusqueda(""); // Limpiar búsqueda al cambiar filtro
                setResultadosBusqueda([]);
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filtro === cat.nombre
                  ? "text-white shadow-md"
                  : "bg-white text-gray-700 hover:shadow-sm"
              }`}
              style={{
                backgroundColor:
                  filtro === cat.nombre ? colors.primary : "white",
              }}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* Grid de establecimientos */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {establecimientosAMostrar.map((establecimiento) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
                key={establecimiento._id || establecimiento.id}
                onClick={() =>
                  handleCardClick(establecimiento._id || establecimiento.id)
                }
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer relative group"
                style={{ borderBottom: `3px solid ${colors.primary}` }}
              >
                {/* Banner superior */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      establecimiento.portada
                        ? `https://back-salubridad.sistemasudh.com/uploads/${establecimiento.portada}`
                        : "https://via.placeholder.com/600x400?text=Imagen+no+disponible"
                    }
                    alt={establecimiento.nombre}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/600x400?text=Imagen+no+disponible";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70" />

                  {/* Categoría */}
                  <div className="absolute top-4 left-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm"
                      style={{ backgroundColor: colors.dark }}
                    >
                      {(establecimiento.categoria &&
                        establecimiento.categoria[0]?.nombre) ||
                        "Sin categoría"}
                    </span>
                  </div>

                  {/* Botones de interacción */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    {/* Botón de Like */}
                    <button
                      onClick={(e) =>
                        toggleLike(establecimiento._id || establecimiento.id, e)
                      }
                      className="p-2 rounded-full shadow-md z-10 transition-all duration-300"
                      style={{
                        backgroundColor: likesDados.includes(
                          establecimiento._id || establecimiento.id
                        )
                          ? colors.blue
                          : "white",
                      }}
                      aria-label="Me gusta"
                    >
                      <FaThumbsUp
                        size={14}
                        className={
                          likesDados.includes(
                            establecimiento._id || establecimiento.id
                          )
                            ? "text-white"
                            : "text-gray-700"
                        }
                      />
                    </button>

                    {/* Botón de Seguir */}
                    <button
                      onClick={(e) =>
                        toggleFavorito(
                          establecimiento._id || establecimiento.id,
                          e
                        )
                      }
                      className="p-2 rounded-full shadow-md z-10 transition-all duration-300"
                      style={{
                        backgroundColor: seguidos.includes(
                          establecimiento._id || establecimiento.id
                        )
                          ? colors.accent
                          : "white",
                      }}
                      aria-label={
                        seguidos.includes(
                          establecimiento._id || establecimiento.id
                        )
                          ? "Dejar de seguir"
                          : "Seguir"
                      }
                    >
                      {seguidos.includes(
                        establecimiento._id || establecimiento.id
                      ) ? (
                        <AiFillHeart size={16} className="text-white" />
                      ) : (
                        <AiOutlineHeart size={16} className="text-gray-700" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Logo del establecimiento */}
                <div className="relative z-20">
                  <div className="absolute -top-8 left-4">
                    <div
                      className="rounded-full border-2 overflow-hidden bg-white p-1 shadow-md"
                      style={{ borderColor: colors.primary }}
                    >
                      <img
                        src={
                          establecimiento.imagen
                            ? `https://back-salubridad.sistemasudh.com/uploads/${establecimiento.imagen}`
                            : "https://via.placeholder.com/80x80?text=Logo"
                        }
                        alt="Logo"
                        className="w-14 h-14 object-cover rounded-full"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80x80?text=Logo";
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Contenido */}
                <div className="pt-10 px-4 pb-4 relative z-10">
                  <div className="mb-2">
                    <div className="flex items-center gap-1">
                      <h2 className="text-lg font-bold text-gray-800 transition-colors duration-300">
                        {establecimiento.nombre}
                      </h2>
                      {establecimiento.verificado && (
                        <MdOutlineVerified className="text-green-500 text-xl" />
                      )}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <FaMapMarkerAlt
                        size={12}
                        className="mr-1"
                        style={{ color: colors.secondary }}
                      />
                      <span>
                        {establecimiento.ubicacion?.[0]?.direccion ||
                          "Ubicación no disponible"}
                      </span>
                    </div>
                  </div>

                  {/* Horario */}
                  <div className="mb-3 flex items-center text-sm">
                    <FaClock
                      size={12}
                      className="mr-1"
                      style={{ color: colors.secondary }}
                    />
                    <span className="text-gray-500">
                      {establecimiento.horario &&
                      establecimiento.horario.length > 0
                        ? `${establecimiento.horario[0].dia}: ${establecimiento.horario[0].entrada} - ${establecimiento.horario[0].salida}`
                        : "Horario no disponible"}
                    </span>
                  </div>

                  {/* Separador */}
                  <div className="h-px bg-gray-200 my-3" />

                  {/* Estadísticas */}
                  <div className="flex items-center justify-between mb-4">
                    {/* Calificación */}
                    <div className="flex flex-col">
                      <div className="flex space-x-1 mb-1">
                        {renderEstrellas(
                          establecimiento.promedioCalificaciones || 0
                        )}
                      </div>
                      <div className="flex items-center text-sm">
                        <span
                          className="font-bold mr-1"
                          style={{ color: colors.secondary }}
                        >
                          ({establecimiento.promedioCalificaciones || "0"})
                        </span>
                        <span className="text-gray-400 text-xs">
                          ({establecimiento.comentarios?.length || 0} reseñas)
                        </span>
                      </div>
                    </div>

                    {/* Likes */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-sm mb-1">
                        <FaThumbsUp
                          size={12}
                          className="mr-1"
                          style={{ color: colors.blue }}
                        />
                        <span className="font-medium">
                          {formatNumber(
                            likes[establecimiento._id || establecimiento.id] ||
                              0
                          )}
                        </span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        recomendaciones
                      </span>
                    </div>
                  </div>

                  {/* Botón de acción */}
                  <button
                    className="w-full py-2 px-4 rounded-md font-medium flex items-center justify-center transition-all duration-300 text-white"
                    style={{
                      background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                      boxShadow: "0 4px 10px rgba(73, 197, 129, 0.2)",
                    }}
                  >
                    <span>Ver detalles</span>
                    <FaArrowRight
                      size={12}
                      className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Mensaje si no hay resultados */}
        {!isLoading && establecimientosAMostrar.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-4" style={{ color: colors.secondary }}>
              <FaSearch size={50} className="mx-auto opacity-50" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No se encontraron establecimientos
            </h3>
            <p className="text-gray-500">
              {busqueda.trim()
                ? "No hay resultados para tu búsqueda. Intenta con otros términos."
                : "Prueba ajustando los filtros de búsqueda"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
