import { useState, useEffect } from "react";
import { obtenerComentariosPorEstablecimiento } from "../api/comentario";

const ComentariosEstablecimiento = ({ establecimientoId, tieneEstablecimiento, establecimientosData }) => {
  const [comentarios, setComentarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [todosLosComentarios, setTodosLosComentarios] = useState([]);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    const cargarComentarios = async () => {
      if (establecimientoId) {
        try {
          setCargando(true);
          const data = await obtenerComentariosPorEstablecimiento(establecimientoId);
          setComentarios(data);
          setCargando(false);
        } catch (error) {
          console.error("Error al cargar comentarios:", error);
          setError("No se pudieron cargar los comentarios");
          setCargando(false);
        }
      } else if (establecimientosData && establecimientosData.length > 0) {
        try {
          setCargando(true);
          const promesas = establecimientosData.map(est => 
            obtenerComentariosPorEstablecimiento(est.id)
          );
          const resultados = await Promise.all(promesas);
          const todosComentarios = resultados.flat();
          setTodosLosComentarios(todosComentarios);
          setCargando(false);
        } catch (error) {
          console.error("Error al cargar todos los comentarios:", error);
          setError("No se pudieron cargar los comentarios");
          setCargando(false);
        }
      } else {
        setCargando(false);
      }
    };

    if (tieneEstablecimiento) {
      cargarComentarios();
    }
  }, [establecimientoId, establecimientosData, tieneEstablecimiento]);

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const obtenerIniciales = (nombreUsuario) => {
    if (!nombreUsuario) return "";
    
    const palabras = nombreUsuario.split(" ");
    if (palabras.length === 1) {
      return palabras[0].charAt(0).toUpperCase();
    } else {
      return (palabras[0].charAt(0) + palabras[palabras.length - 1].charAt(0)).toUpperCase();
    }
  };

  const obtenerColorFondo = (nombreUsuario) => {
    if (!nombreUsuario) return "bg-gray-300";
    
    const colores = [
      "bg-blue-500", "bg-green-500", "bg-yellow-500", 
      "bg-pink-500", "bg-purple-500", "bg-indigo-500", 
      "bg-red-500", "bg-orange-500", "bg-teal-500"
    ];
    
    const sumaCodigos = nombreUsuario
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    
    return colores[sumaCodigos % colores.length];
  };

  const comentariosAMostrar = establecimientoId ? comentarios : todosLosComentarios;
  
  const comentariosFiltrados = (() => {
    if (filtro === "todos") return comentariosAMostrar;
    const valorFiltro = parseInt(filtro);
    return comentariosAMostrar.filter(c => c.calificacion === valorFiltro);
  })();

  if (!tieneEstablecimiento) {
    return null;
  }

  if (cargando) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-md text-red-700 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </div>
    );
  }

  // Calcular estadísticas de estrellas
  const calcularEstadisticas = () => {
    if (comentariosAMostrar.length === 0) return null;
    
    // Cuenta por calificación
    const conteo = [0, 0, 0, 0, 0];
    comentariosAMostrar.forEach(c => {
      conteo[c.calificación - 1] = (conteo[c.calificación - 1] || 0) + 1;
    });
    
    // Promedio
    const promedio = comentariosAMostrar.reduce((acc, c) => acc + c.calificacion, 0) / comentariosAMostrar.length;
    
    return {
      promedio: promedio.toFixed(1),
      conteo
    };
  };
  
  const estadisticas = calcularEstadisticas();
  
  return (
    <div className="mt-8 bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {establecimientoId 
              ? `Opiniones de clientes (${comentarios.length})`
              : `Todas las opiniones (${todosLosComentarios.length})`
            }
          </h2>
          {estadisticas && (
            <div className="flex items-center mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(estadisticas.promedio) ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-800">{estadisticas.promedio}</span>
              <span className="ml-1 text-sm text-gray-500">({comentariosAMostrar.length} opiniones)</span>
            </div>
          )}
        </div>

        <div className="mt-4 md:mt-0">
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="todos">Todas las estrellas</option>
            <option value="5">5 estrellas</option>
            <option value="4">4 estrellas</option>
            <option value="3">3 estrellas</option>
            <option value="2">2 estrellas</option>
            <option value="1">1 estrella</option>
          </select>
        </div>
      </div>
      
      {comentariosFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No hay opiniones</h3>
          <p className="mt-1 text-gray-500">
            {establecimientoId 
              ? "Este establecimiento aún no tiene comentarios. ¡Sé el primero en comentar!"
              : "Aún no tienes opiniones en tus establecimientos."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comentariosFiltrados.map((comentario) => (
            <div key={comentario._id} className="bg-gray-50 p-5 rounded-lg hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start">
                {comentario.usuario.fotoPerfil ? (
                  <img 
                    src={comentario.usuario.fotoPerfil} 
                    alt={comentario.usuario.nombreUsuario}
                    className="w-12 h-12 rounded-full object-cover mr-4 shadow"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full ${obtenerColorFondo(comentario.usuario.nombreUsuario)} flex items-center justify-center mr-4 shadow-sm text-white`}>
                    <span className="font-bold text-lg">
                      {obtenerIniciales(comentario.usuario.nombreUsuario)}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">{comentario.usuario.nombreUsuario}</h3>
                    <span className="text-sm text-gray-500">{formatearFecha(comentario.fecha)}</span>
                  </div>
                  
                  <div className="flex mt-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-5 h-5 ${i < comentario.calificacion ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 mt-2 whitespace-pre-line">{comentario.comentario}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {comentariosFiltrados.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Ver más comentarios
          </button>
        </div>
      )}
    </div>
  );
};

export default ComentariosEstablecimiento;