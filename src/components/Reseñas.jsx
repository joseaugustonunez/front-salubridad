import React, { useEffect, useState } from "react";
import { obtenerComentariosUsuario } from "../api/usuario";

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

  if (cargando)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
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
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#254A5D] flex items-center gap-3">
          <span className="text-4xl"></span>
          Comentarios Recientes
        </h2>
        <p className="text-gray-600 mt-2">Establecimientos que sigues</p>
      </div>

      {comentarios.length > 0 ? (
        <div className="space-y-4">
          {comentarios.map((comentario) => {
            const nombreUsuario =
              comentario.usuario?.nombreUsuario || "Usuario";
            const iniciales = obtenerIniciales(nombreUsuario);
            const colorAvatar = generarColorAvatar(nombreUsuario);

            return (
              <div
                key={comentario._id || comentario.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header con usuario */}
                  <div className="flex items-start justify-between mb-4">
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
                        <p className="font-semibold text-[#254A5D] text-lg">
                          {nombreUsuario}
                        </p>
                        <p className="text-sm text-gray-500">
                          {comentario.fecha
                            ? new Date(comentario.fecha).toLocaleDateString(
                                "es-ES",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : ""}
                        </p>
                      </div>
                    </div>

                    {/* Calificación */}
                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                      <span className="text-amber-500 text-xl">⭐</span>
                      <span className="font-bold text-amber-600">
                        {comentario.calificacion || 0}
                      </span>
                    </div>
                  </div>

                  {/* Comentario */}
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {comentario.comentario}
                  </p>

                  {/* Establecimiento */}
                  {comentario.establecimiento && (
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <span className="text-gray-400">📍</span>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">
                          {comentario.establecimiento.nombre}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4"></div>
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
