import React, { useEffect, useState } from "react";
import { obtenerComentariosUsuario } from "../api/usuario";
import { FaStar, FaRegStar, FaStarHalf } from "react-icons/fa";

const Resenas = ({ userId: propUserId }) => {
  const [comentarios, setComentarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComentarios = async () => {
      setCargando(true);
      setError(null);
      try {
        const data = await obtenerComentariosUsuario(propUserId);
        setComentarios(Array.isArray(data) ? data : data.comentarios || []);
      } catch (err) {
        console.error("Error al cargar comentarios:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Error al cargar comentarios."
        );
      } finally {
        setCargando(false);
      }
    };
    fetchComentarios();
  }, [propUserId]);

  const obtenerIniciales = (nombreUsuario) => {
    if (!nombreUsuario) return "U";
    const palabras = nombreUsuario.trim().split(" ");
    if (palabras.length === 1) {
      return palabras[0].substring(0, 2).toUpperCase();
    }
    return (palabras[0][0] + palabras[palabras.length - 1][0]).toUpperCase();
  };

  const generarColorAvatar = (nombreUsuario) => {
    const colores = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-cyan-500",
      "bg-emerald-500",
      "bg-amber-500",
    ];
    const index = nombreUsuario
      ? nombreUsuario.charCodeAt(0) % colores.length
      : 0;
    return colores[index];
  };

  const renderStars = (value = 0) => {
    const stars = [];
    const full = Math.floor(value);
    const half = value - full >= 0.5;
    for (let i = 0; i < full; i++) {
      stars.push(<FaStar key={"s" + i} className="text-amber-400 w-4 h-4" />);
    }
    if (half) {
      stars.push(<FaStarHalf key="half" className="text-amber-400 w-4 h-4" />);
    }
    const emptyCount = 5 - stars.length;
    for (let i = 0; i < emptyCount; i++) {
      stars.push(
        <FaRegStar key={"e" + i} className="text-amber-300 w-4 h-4" />
      );
    }
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  if (cargando)
    return (
      <div className="flex justify-center items-center min-h-[320px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#254A5D]"></div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#254A5D]">
          Comentarios Recientes
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Publicaciones de establecimientos que sigues
        </p>
      </div>

      {comentarios.length > 0 ? (
        <div className="space-y-4">
          {comentarios.map((comentario) => {
            const nombreUsuario =
              comentario.usuario?.nombreUsuario || "Usuario";
            const iniciales = obtenerIniciales(nombreUsuario);
            const colorAvatar = generarColorAvatar(nombreUsuario);
            const calificacion = Number(comentario.calificacion) || 0;

            return (
              <article
                key={comentario._id || comentario.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <header className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {comentario.usuario?.fotoPerfil ? (
                        <img
                          src={comentario.usuario.fotoPerfil}
                          alt={nombreUsuario}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                        />
                      ) : (
                        <div
                          className={`w-12 h-12 rounded-full ${colorAvatar} flex items-center justify-center text-white font-bold text-lg`}
                        >
                          {iniciales}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-[#254A5D] text-sm md:text-base">
                          {nombreUsuario}
                        </p>
                        <p className="text-xs text-gray-500">
                          {comentario.fecha
                            ? new Date(comentario.fecha).toLocaleDateString(
                                "es-ES",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full">
                        {renderStars(calificacion)}
                        <span className="ml-2 text-amber-700 font-semibold text-sm">
                          {calificacion.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </header>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    {comentario.comentario}
                  </p>

                  {comentario.establecimiento && (
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        {comentario.establecimiento.portada ? (
                          <img
                            src={
                              comentario.establecimiento.portada.includes(
                                "http"
                              )
                                ? comentario.establecimiento.portada
                                : `https://back-salubridad.sistemasudh.com/uploads/${comentario.establecimiento.portada}`
                            }
                            alt={comentario.establecimiento.nombre}
                            className="w-14 h-10 rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-14 h-10 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                            No imagen
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-[#254A5D] font-medium">
                            {comentario.establecimiento.nombre}
                          </p>
                          <p className="text-xs text-gray-500">
                            {comentario.establecimiento.direccion || ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <p className="text-gray-600 text-lg">
            No hay comentarios de los establecimientos que sigues.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Sigue más establecimientos para ver sus comentarios aquí.
          </p>
        </div>
      )}
    </div>
  );
};

export default Resenas;
