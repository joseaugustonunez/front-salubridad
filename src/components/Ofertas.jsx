import React, { useEffect, useState } from "react";
import { obtenerPromocionesUsuario } from "../api/usuario";
import {
  FaGift,
  FaCalendarAlt,
  FaStore,
  FaPercentage,
  FaSpinner,
} from "react-icons/fa";
import { MdError } from "react-icons/md";

const Ofertas = ({ userId: propUserId }) => {
  const [promociones, setPromociones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromos = async () => {
      setCargando(true);
      setError(null);
      try {
        const data = await obtenerPromocionesUsuario(propUserId);
        setPromociones(Array.isArray(data) ? data : data.promociones || []);
      } catch (err) {
        console.error("Error al cargar promociones:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Error al cargar promociones."
        );
      } finally {
        setCargando(false);
      }
    };
    fetchPromos();
  }, [propUserId]);

  if (cargando) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#254A5D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
        <MdError className="text-5xl text-red-500 mb-4" />
        <p className="text-center text-red-500 text-lg max-w-md">{error}</p>
      </div>
    );
  }

  if (!promociones || promociones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-2xl shadow-md p-8 sm:p-12">
        <svg
          className="text-gray-300 mb-6 w-20 h-20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M20.59 13.41L11 3.83a2 2 0 0 0-2.83 0L3.41 9.59a2 2 0 0 0 0 2.83l9.59 9.59a2 2 0 0 0 2.83 0l4.76-4.76a2 2 0 0 0 0-2.83z" />
        </svg>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-3">
          No hay elementos para mostrar
        </h2>
        <p className="text-center text-gray-500 text-base sm:text-lg max-w-md">
          Aún no hay contenido disponible. Explora la app y vuelve más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-[#254A5D]">
            Promociones Exclusivas
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Descubre las mejores ofertas de los establecimientos que sigues
          </p>
        </div>

        {/* Grid de Promociones */}
        {promociones.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {promociones.map((promo) => (
              <div
                key={promo._id || promo.id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                {/* Imagen */}
                <div className="relative h-44 sm:h-48 overflow-hidden">
                  <img
                    src={`https://back-salubridad.sistemasudh.com/uploads/${
                      promo.imagen ||
                      promo.establecimiento?.imagen ||
                      "promo-default.jpg"
                    }`}
                    alt={promo.nombre || promo.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Badge de descuento */}
                  {promo.descuento != null && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-[#49C581] to-[#3ba569] text-white px-3 py-2 rounded-xl shadow-lg flex items-center gap-1.5">
                      <FaPercentage className="text-sm" />
                      <span className="font-bold text-lg">
                        {promo.descuento}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-4 sm:p-5">
                  {/* Título */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#254A5D] mb-2 line-clamp-2 min-h-[3.5rem]">
                    {promo.nombre || promo.titulo}
                  </h3>

                  {/* Descripción */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                    {promo.descripcion}
                  </p>

                  {/* Fechas */}
                  <div className="flex items-start gap-2 mb-3 text-xs sm:text-sm text-gray-500">
                    <FaCalendarAlt className="text-[#49C581] mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span>
                        {promo.fechaInicio
                          ? new Date(promo.fechaInicio).toLocaleDateString(
                              "es-ES",
                              {
                                day: "2-digit",
                                month: "short",
                              }
                            )
                          : ""}
                      </span>
                      <span className="hidden sm:inline">-</span>
                      <span>
                        {promo.fechaFin
                          ? new Date(promo.fechaFin).toLocaleDateString(
                              "es-ES",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : ""}
                      </span>
                    </div>
                  </div>

                  {/* Establecimiento */}
                  {promo.establecimiento && (
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <FaStore className="text-[#254A5D] flex-shrink-0" />
                      <p className="text-xs text-gray-600 truncate">
                        {promo.establecimiento.nombre}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-md p-8 sm:p-12">
            <FaGift className="text-6xl sm:text-7xl text-gray-300 mb-6" />
            <p className="text-center text-gray-500 text-base sm:text-lg max-w-md">
              No hay promociones disponibles de los establecimientos que sigues
            </p>
            <p className="text-center text-gray-400 text-sm mt-2">
              ¡Sigue más establecimientos para ver sus ofertas!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ofertas;
