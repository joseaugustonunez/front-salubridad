import { useEffect, useState } from "react";
import { obtenerEstablecimientosSeguidos } from "../api/usuario";
import { FaHeart, FaSpinner, FaMapMarkerAlt, FaTag } from "react-icons/fa";
import { MdError, MdRestaurant } from "react-icons/md";
import { BiCategory } from "react-icons/bi";

const MisFavoritos = () => {
  const [establecimientos, setEstablecimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeguidos = async () => {
      setLoading(true);
      try {
        // Intentar obtener userId desde varias fuentes
        let userId = null;
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            userId = parsed?._id || parsed?.id || parsed?.userId;
          } catch (e) {
            console.warn("No se pudo parsear localStorage.user", e);
          }
        }
        userId =
          userId ||
          localStorage.getItem("userId") ||
          localStorage.getItem("id");

        // Llamamos a la API; si userId es null, dejamos que la función use el token del backend
        const data = await obtenerEstablecimientosSeguidos(userId || undefined);
        setEstablecimientos(data || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Error al cargar los establecimientos seguidos."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSeguidos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#254A5D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <MdError className="text-6xl text-red-500 mb-4" />
        <p className="text-center text-red-500 text-lg max-w-md">{error}</p>
      </div>
    );
  }

  if (establecimientos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-2xl shadow-md p-8 sm:p-12">
        <FaHeart className="text-7xl sm:text-8xl text-gray-300 mb-6" />
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-3">
          No tienes favoritos aún
        </h2>
        <p className="text-center text-gray-500 text-base sm:text-lg max-w-md">
          Explora y agrega establecimientos a tus favoritos para verlos aquí
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <FaHeart className="text-3xl sm:text-4xl text-red-500" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#254A5D]">
            Mis Favoritos
          </h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-base ml-0 sm:ml-12">
          {establecimientos.length}{" "}
          {establecimientos.length === 1
            ? "establecimiento guardado"
            : "establecimientos guardados"}
        </p>
      </div>

      {/* Grid de Establecimientos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {establecimientos.map((est) => (
          <div
            key={est._id}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
          >
            {/* Imagen con overlay */}
            <div className="relative h-48 sm:h-52 overflow-hidden">
              <img
                src={`https://back-salubridad.sistemasudh.com/uploads/${
                  est.imagen || "establecimiento-default.jpg"
                }`}
                alt={est.nombre}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />

              {/* Badge de favorito */}
              <div className="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm p-2.5 rounded-full shadow-lg">
                <FaHeart className="text-red-500 text-lg" />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Contenido */}
            <div className="p-4 sm:p-5">
              {/* Nombre */}
              <h3 className="text-lg sm:text-xl font-bold text-[#254A5D] mb-3 line-clamp-2 min-h-[3.5rem]">
                {est.nombre}
              </h3>

              {/* Información adicional */}
              <div className="space-y-2">
                {/* Categoría */}
                {est.categoria && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BiCategory className="text-[#49C581] flex-shrink-0" />
                    <span className="truncate">{est.categoria.nombre}</span>
                  </div>
                )}

                {/* Tipo */}
                {est.tipo && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MdRestaurant className="text-[#49C581] flex-shrink-0" />
                    <span className="truncate">{est.tipo.nombre}</span>
                  </div>
                )}

                {/* Ubicación (si está disponible) */}
                {est.direccion && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-[#49C581] flex-shrink-0" />
                    <span className="truncate">{est.direccion}</span>
                  </div>
                )}
              </div>

              {/* Badge de categoría alternativo */}
              {!est.tipo && !est.direccion && est.categoria && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="inline-flex items-center gap-1.5 bg-[#49C581]/10 text-[#49C581] px-3 py-1.5 rounded-full text-xs font-medium">
                    <FaTag className="text-xs" />
                    {est.categoria.nombre}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MisFavoritos;
