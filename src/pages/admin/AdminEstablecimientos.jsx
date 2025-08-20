import { useState, useEffect } from "react";
import {
  obtenerEstablecimientos,
  actualizarVerificado,
  actualizarEstado,
} from "../../api/establecimientos";
import { obtenerCategorias } from "../../api/categorias";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate para la navegación
// Agregar estas funciones en tu componente
const colors = {
  primary: "#49C581",
  secondary: "#337179",
  dark: "#254A5D",
  accent: "#F8485E",
  info: "#37a6ca"
};

export default function AdminEstablecimientos() {
  const [establecimientos, setEstablecimientos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [establecimientoExpandido, setEstablecimientoExpandido] =
    useState(null);
  const navigate = useNavigate(); // Inicializamos el hook de navegación
  // Importar las funciones de la API

  // Función para cambiar el estado de un establecimient

  const colores = {
    primario: "#49C581",
    secundario: "#337179",
    oscuro: "#254A5D",
    acento: "#F8485E",
    claro: "#37a6ca",
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setIsLoading(true);
        const [estabData, catData] = await Promise.all([
          obtenerEstablecimientos(),
          obtenerCategorias(),
        ]);
        setEstablecimientos(estabData);
        setCategorias(catData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        mostrarMensaje(
          "Error al cargar los datos. Intente nuevamente.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      // Llama a la función de la API importada
      await actualizarEstado(id, nuevoEstado);

      // Actualización optimista en el estado local
      setEstablecimientos(
        establecimientos.map((est) =>
          est._id === id ? { ...est, estado: nuevoEstado } : est
        )
      );

      mostrarMensaje(`Estado actualizado a: ${nuevoEstado}`, "exito");
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      mostrarMensaje("Error al actualizar el estado", "error");
    }
  };

  const cambiarVerificacion = async (id, verificado) => {
    try {
      // Llama a la función de la API importada
      await actualizarVerificado(id, verificado);

      // Actualización optimista en el estado local
      setEstablecimientos(
        establecimientos.map((est) =>
          est._id === id ? { ...est, verificado: verificado } : est
        )
      );

      mostrarMensaje(
        `Verificación ${verificado ? "otorgada" : "retirada"} exitosamente`,
        "exito"
      );
    } catch (error) {
      console.error("Error al actualizar verificación:", error);
      mostrarMensaje("Error al actualizar la verificación", "error");
    }
  };

  const filtrarEstablecimientos = () => {
    if (filtro === "todos") return establecimientos;
    return establecimientos.filter((est) => est.estado === filtro);
  };

  const mostrarEtiquetaEstado = (estado) => {
    const estilos = {
      pendiente: "bg-yellow-500",
      aprobado: "bg-green-500",
      rechazado: "bg-red-500",
    };

    return (
      <span
        className={`text-xs font-medium text-white px-2 py-1 rounded-full ${
          estilos[estado] || "bg-gray-500"
        }`}
      >
        {estado}
      </span>
    );
  };

  const toggleExpandirEstablecimiento = (id) => {
    if (establecimientoExpandido === id) {
      setEstablecimientoExpandido(null);
    } else {
      setEstablecimientoExpandido(id);
    }
  };

  // Nueva función para ir al detalle del establecimiento
  const irADetalleEstablecimiento = (id, event) => {
    // Evitamos que el evento se propague para no interferir con otras funcionalidades
    event.stopPropagation();
    // Navegamos a la ruta de detalle con el ID del establecimiento
    navigate(`/admin/establecimientodetalle/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4"
          style={{ borderColor: colores.primario }}
        ></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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
                 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center"
               >
                 Administración de <span style={{ color: colors.primary }}>Establecimientos</span>
               </motion.h1>
     
               <motion.p
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: 0.2 }}
                 className="text-lg text-white/90 max-w-xl mx-auto mb-8 text-center"
               >
                 Aquí puedes gestionar los Establecimientos de la aplicación
               </motion.p>
             </div>
     
             {/* Decorative elements */}
             <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 bg-white/20 -mr-20 -mt-20"></div>
             <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 bg-white/20 -ml-20 -mb-20"></div>
           </div>
           <div className="min-h-screen mx-4 ">
      {mensaje.texto && (
        <div
          className={`p-4 mb-6 rounded-lg ${
            mensaje.tipo === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setFiltro("todos")}
          className={`px-4 py-2 rounded-md transition-all ${
            filtro === "todos"
              ? "text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          style={{
            backgroundColor:
              filtro === "todos" ? colores.secundario : "transparent",
          }}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltro("pendiente")}
          className={`px-4 py-2 rounded-md transition-all ${
            filtro === "pendiente"
              ? "text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          style={{
            backgroundColor:
              filtro === "pendiente" ? colores.secundario : "transparent",
          }}
        >
          Pendientes
        </button>
        <button
          onClick={() => setFiltro("aprobado")}
          className={`px-4 py-2 rounded-md transition-all ${
            filtro === "aprobado"
              ? "text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          style={{
            backgroundColor:
              filtro === "aprobado" ? colores.secundario : "transparent",
          }}
        >
          Aprobados
        </button>
        <button
          onClick={() => setFiltro("rechazado")}
          className={`px-4 py-2 rounded-md transition-all ${
            filtro === "rechazado"
              ? "text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          style={{
            backgroundColor:
              filtro === "rechazado" ? colores.secundario : "transparent",
          }}
        >
          Rechazados
        </button>
      </div>

      {filtrarEstablecimientos().length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay establecimientos que coincidan con el filtro seleccionado.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filtrarEstablecimientos().map((establecimiento) => (
            <div
              key={establecimiento._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={(e) => irADetalleEstablecimiento(establecimiento._id, e)}
            >
              {/* Cabecera con imagen de portada */}
              <div className="relative h-40 w-full">
                <img
                  src={`https://back-salubridad.sistemasudh.com/uploads/${establecimiento.portada}`}
                  alt={`Portada de ${establecimiento.nombre}`}
                  className="h-full w-full object-cover"
                  onError={(e) => (e.target.src = "/placeholder-banner.png")}
                />
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-white">
                      {establecimiento.nombre}
                    </h2>
                    <div className="flex gap-2">
                      {mostrarEtiquetaEstado(establecimiento.estado)}
                      {establecimiento.verificado && (
                        <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                          Verificado ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 p-2">
                  <span className="inline-flex items-center bg-white/80 px-2 py-1 rounded-lg text-sm">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-medium">
                      {establecimiento.promedioCalificaciones}
                    </span>
                    <span className="text-gray-500 text-xs ml-1">
                      ({establecimiento.totalResenas})
                    </span>
                  </span>
                </div>
              </div>

              {/* Información básica */}
              <div className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img
                      src={`https://back-salubridad.sistemasudh.com/uploads/${establecimiento.imagen}`}
                      alt={establecimiento.nombre}
                      className="h-full w-full object-cover"
                      onError={(e) => (e.target.src = "/placeholder.png")}
                    />
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {establecimiento.categoria.map((cat, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                          style={{ color: colores.oscuro }}
                        >
                          {cat.nombre}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {establecimiento.tipo.map((tipo, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                          style={{ color: colores.secundario }}
                        >
                          {tipo.tipo_nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {establecimiento.descripcion}
                </p>

                <div className="flex justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Teléfono:</div>
                    <div className="font-medium">
                      {establecimiento.telefono}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Likes:</div>
                    <div className="font-medium">
                      {establecimiento.likes.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Seguidores:</div>
                    <div className="font-medium">
                      {establecimiento.seguidores.length}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold mb-2">Ubicación:</h3>
                  {establecimiento.ubicacion.map((ubi, idx) => (
                    <div key={idx} className="text-sm">
                      <p>
                        {ubi.direccion}, {ubi.ciudad}, {ubi.distrito}
                      </p>
                      <p className="text-gray-500">
                        CP: {ubi.codigoPostal} | {ubi.referencia}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Lat: {ubi.coordenadas.latitud}, Long:{" "}
                        {ubi.coordenadas.longitud}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Botón para expandir/colapsar - evitamos que active la navegación */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpandirEstablecimiento(establecimiento._id);
                  }}
                  className="w-full text-center py-2 mt-4 text-sm font-medium"
                  style={{ color: colores.secundario }}
                >
                  {establecimientoExpandido === establecimiento._id
                    ? "Ver menos detalles ▲"
                    : "Ver más detalles ▼"}
                </button>

                {/* Información expandida */}
                {establecimientoExpandido === establecimiento._id && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    {/* Horarios */}
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Horarios:</h3>
                      {establecimiento.horario.map((horario, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm mb-1"
                        >
                          <span>{horario.dia}:</span>
                          <span>
                            {horario.entrada} - {horario.salida}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Redes sociales */}
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Redes Sociales:</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(establecimiento.redesSociales).map(
                          ([red, valor], idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              <span className="capitalize">{red}:</span>
                              <span className="text-gray-500">{valor}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Imágenes adicionales */}
                    {establecimiento.imagenes &&
                      establecimiento.imagenes.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-semibold mb-2">
                            Imágenes adicionales:
                          </h3>
                          <div className="grid grid-cols-3 gap-2">
                            {establecimiento.imagenes.map((img, idx) => (
                              <div
                                key={idx}
                                className="h-20 rounded overflow-hidden"
                              >
                                <img
                                  src={`https://back-salubridad.sistemasudh.com/uploads/${img}`}
                                  alt={`Imagen ${idx + 1}`}
                                  className="h-full w-full object-cover"
                                  onError={(e) =>
                                    (e.target.src = "/placeholder.png")
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Información técnica */}
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">
                        Información técnica:
                      </h3>
                      <div className="text-xs text-gray-500">
                        <div className="mb-1">ID: {establecimiento._id}</div>
                        <div className="mb-1">
                          Creador: {establecimiento.creador}
                        </div>
                        <div className="mb-1">
                          Fecha de creación:{" "}
                          {new Date(
                            establecimiento.fechaCreacion
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botones de acción - Evitamos que activen la navegación */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                  <div className="flex-1">
                    <select
                      onChange={(e) => {
                        e.stopPropagation();
                        cambiarEstado(establecimiento._id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      value={establecimiento.estado}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
                      style={{ borderColor: colores.secundario }}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="aprobado">Aprobado</option>
                      <option value="rechazado">Rechazado</option>
                    </select>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      cambiarVerificacion(
                        establecimiento._id,
                        !establecimiento.verificado
                      );
                    }}
                    className="px-4 py-2 rounded text-white text-sm flex-1"
                    style={{
                      backgroundColor: establecimiento.verificado
                        ? colores.acento
                        : colores.primario,
                    }}
                  >
                    {establecimiento.verificado
                      ? "Quitar verificación"
                      : "Verificar establecimiento"}
                  </button>
                </div>

                {/* Botón explícito para ver detalles */}
                <div className="mt-4">
                  <button
                    onClick={(e) =>
                      irADetalleEstablecimiento(establecimiento._id, e)
                    }
                    className="w-full py-2 rounded text-white text-sm"
                    style={{ backgroundColor: colores.oscuro }}
                  >
                    Ver página de detalle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
