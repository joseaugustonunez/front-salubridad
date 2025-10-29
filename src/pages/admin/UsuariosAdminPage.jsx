import { useState, useEffect } from "react";
import { obtenerUsuarios } from "../../api/usuario";
import { obtenerEstablecimientos } from "../../api/establecimientos";
import {
  Search,
  Edit,
  Check,
  X,
  Building,
  UserPlus,
  RefreshCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import { actualizarRolUsuario, actualizarUsuario } from "../../api/usuario";
// Colores del tema
const colors = {
  primary: "#49C581",
  secondary: "#337179",
  dark: "#254A5D",
  accent: "#F8485E",
  info: "#37a6ca",
};

// Llamadas al backend para cambiar rol y asignar establecimiento
const cambiarRol = async (userId, nuevoRol) => {
  try {
    await actualizarRolUsuario(userId, nuevoRol);
    return { success: true };
  } catch (err) {
    console.error("Error actualizar rol:", err);
    return { success: false, error: err };
  }
};

const asignarEstablecimiento = async (userId, establecimientoId) => {
  try {
    // Reutilizamos la ruta de actualización de usuario para setear establecimientosCreados
    await actualizarUsuario(userId, {
      establecimientosCreados: [establecimientoId],
    });
    return { success: true };
  } catch (err) {
    console.error("Error asignar establecimiento:", err);
    return { success: false, error: err };
  }
};

export default function AdminUsuariosView() {
  const [usuarios, setUsuarios] = useState([]);
  const [establecimientos, setEstablecimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState("");
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [procesandoSolicitud, setProcesandoSolicitud] = useState(false);

  // Cargar usuarios y establecimientos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const datosUsuarios = await obtenerUsuarios();
        const datosEstablecimientos = await obtenerEstablecimientos();

        // Mapear los datos para adaptarlos al formato esperado
        const usuariosAdaptados = datosUsuarios.map((usuario) => ({
          id: usuario._id,
          email: usuario.email,
          nombreUsuario: usuario.nombreUsuario,
          rol: usuario.rol,
          establecimientosCreados: usuario.establecimientosCreados || [],
          solicitudVendedor: usuario.solicitudVendedor || null, // <-- agregado
        }));

        // Asegurarse de que todos los establecimientos tengan id o _id
        const establecimientosNormalizados = datosEstablecimientos.map(
          (est) => {
            if (!est.id && est._id) {
              return { ...est, id: est._id };
            }
            return est;
          }
        );

        setUsuarios(usuariosAdaptados);
        setEstablecimientos(establecimientosNormalizados);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        mostrarMensaje("Error al cargar los datos. Intente de nuevo.", "error");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // NUEVO: usuarios que solicitaron ser vendedor y están pendientes
  const solicitudesPendientes = usuarios.filter(
    (u) => u.solicitudVendedor === "pendiente"
  );

  // Aprobar solicitud: convierte a vendedor y marca solicitud como aprobada
  const aprobarSolicitud = async (userId) => {
    try {
      setProcesandoSolicitud(true);
      await actualizarUsuario(userId, {
        rol: "vendedor",
        solicitudVendedor: "aprobado",
      });
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, rol: "vendedor", solicitudVendedor: "aprobado" }
            : u
        )
      );
      mostrarMensaje("Solicitud aprobada", "success");
    } catch (err) {
      console.error("Error aprobar solicitud:", err);
      mostrarMensaje("Error al aprobar la solicitud", "error");
    } finally {
      setProcesandoSolicitud(false);
    }
  };

  // Rechazar solicitud: marca solicitud como rechazada
  const rechazarSolicitud = async (userId) => {
    try {
      setProcesandoSolicitud(true);
      await actualizarUsuario(userId, { solicitudVendedor: "rechazado" });
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, solicitudVendedor: "rechazado" } : u
        )
      );
      mostrarMensaje("Solicitud rechazada", "success");
    } catch (err) {
      console.error("Error rechazar solicitud:", err);
      mostrarMensaje("Error al rechazar la solicitud", "error");
    } finally {
      setProcesandoSolicitud(false);
    }
  };

  // Filtrar usuarios según término de búsqueda
  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.nombreUsuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.rol?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
  };

  const handleEditClick = (usuario) => {
    setEditingUser(usuario);
    setSelectedRole(usuario.rol || "");
    setSelectedEstablecimiento(usuario.establecimientosCreados?.[0] || "");
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setSelectedRole("");
    setSelectedEstablecimiento("");
  };

  const handleSaveChanges = async () => {
    try {
      if (selectedRole && selectedRole !== editingUser.rol) {
        const resultRol = await cambiarRol(editingUser.id, selectedRole);
        if (resultRol.success) {
          // Actualizar el rol en el estado local
          setUsuarios((prevUsuarios) =>
            prevUsuarios.map((u) =>
              u.id === editingUser.id ? { ...u, rol: selectedRole } : u
            )
          );
        }
      }

      const currentEstabId = editingUser.establecimientosCreados?.[0] || "";

      if (
        selectedEstablecimiento &&
        selectedEstablecimiento !== currentEstabId
      ) {
        const resultEstab = await asignarEstablecimiento(
          editingUser.id,
          selectedEstablecimiento
        );
        if (resultEstab.success) {
          // Actualizar el establecimiento en el estado local
          setUsuarios((prevUsuarios) =>
            prevUsuarios.map((u) =>
              u.id === editingUser.id
                ? {
                    ...u,
                    establecimientosCreados: [selectedEstablecimiento],
                  }
                : u
            )
          );
        }
      }

      mostrarMensaje("Cambios guardados correctamente", "success");
      setEditingUser(null);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      mostrarMensaje("Error al guardar los cambios", "error");
    }
  };

  const recargarUsuarios = async () => {
    try {
      setLoading(true);
      const datosUsuarios = await obtenerUsuarios();

      // Adaptar datos al recargar
      const usuariosAdaptados = datosUsuarios.map((usuario) => ({
        id: usuario._id,
        email: usuario.email,
        nombreUsuario: usuario.nombreUsuario,
        rol: usuario.rol,
        establecimientosCreados: usuario.establecimientosCreados || [],
      }));

      setUsuarios(usuariosAdaptados);
      mostrarMensaje("Usuarios actualizados correctamente", "success");
    } catch (error) {
      console.error("Error al recargar usuarios:", error);
      mostrarMensaje("Error al recargar usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  // Obtener el nombre del establecimiento según su ID
  const obtenerNombreEstablecimiento = (establecimientoId) => {
    if (!establecimientoId) return "No asignado";

    // Primero intentamos buscar por ID directo
    const establecimiento = establecimientos.find((e) => {
      // Manejar posibles formatos diferentes de ID
      const eId = e.id || e._id;
      const estId = establecimientoId.toString();

      return eId && eId.toString() === estId;
    });

    return establecimiento
      ? establecimiento.nombre
      : "Establecimiento desconocido";
  };

  // Opciones de rol permitidas (solo 3)
  const opcionesRol = ["usuario", "administrador", "vendedor"];
  const rolLabels = {
    admin: "Administrador",
    vendedor: "Vendedor",
    usuario: "Usuario",
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 ">
      {/* Header */}
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
            Administración de{" "}
            <span style={{ color: colors.primary }}>Usuarios</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-white/90 max-w-xl mx-auto mb-8 text-center"
          >
            Aquí puedes gestionar los usuarios de la aplicación
          </motion.p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 bg-white/20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 bg-white/20 -ml-20 -mb-20"></div>
      </div>

      {/* Contenido principal */}
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          {/* Mensaje de notificación */}
          {mensaje.texto && (
            <div
              className={`mb-4 p-3 rounded-md ${
                mensaje.tipo === "success"
                  ? "bg-green-100 text-green-800"
                  : mensaje.tipo === "error"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {mensaje.texto}
            </div>
          )}

          {/* Barra de herramientas */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            {/* Búsqueda */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar usuarios..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2"
                style={{ focusRingColor: colors.primary }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Botón de recargar */}
            <button
              onClick={recargarUsuarios}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-white transition-colors"
              style={{ backgroundColor: colors.secondary }}
              disabled={loading}
            >
              <RefreshCcw className="h-5 w-5" />
              <span>{loading ? "Cargando..." : "Actualizar lista"}</span>
            </button>
          </div>

          {/* Tabla de usuarios */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead style={{ backgroundColor: colors.dark }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Usuario (solicitud)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Establecimiento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        Cargando usuarios...
                      </td>
                    </tr>
                  ) : usuariosFiltrados.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No se encontraron usuarios
                      </td>
                    </tr>
                  ) : (
                    usuariosFiltrados.map((usuario) => (
                      <tr key={usuario.id} className="hover:bg-gray-50">
                        {/* COLUMNA UNIFICADA: Usuario + Estado de solicitud */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-lg font-medium text-gray-600">
                                  {usuario.nombreUsuario
                                    ?.charAt(0)
                                    .toUpperCase() || "?"}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {usuario.nombreUsuario || "Sin nombre"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: {usuario.id}
                                </div>
                              </div>
                            </div>
                            <div>
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  usuario.solicitudVendedor === "pendiente"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : usuario.solicitudVendedor === "aprobado"
                                    ? "bg-green-100 text-green-800"
                                    : usuario.solicitudVendedor === "rechazado"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {usuario.solicitudVendedor || "—"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {usuario.email || "No disponible"}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUser && editingUser.id === usuario.id ? (
                            <select
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                              style={{ focusRingColor: colors.primary }}
                            >
                              <option value="">Seleccionar rol</option>
                              {opcionesRol.map((rol) => (
                                <option key={rol} value={rol}>
                                  {rolLabels[rol] || rol}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                usuario.rol === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : usuario.rol === "vendedor"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {rolLabels[usuario.rol] ||
                                usuario.rol ||
                                "No asignado"}
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {editingUser && editingUser.id === usuario.id ? (
                            <select
                              value={selectedEstablecimiento}
                              onChange={(e) =>
                                setSelectedEstablecimiento(e.target.value)
                              }
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                              style={{ focusRingColor: colors.primary }}
                            >
                              <option value="">Sin establecimiento</option>
                              {establecimientos.map((est) => (
                                <option
                                  key={est.id || est._id}
                                  value={est.id || est._id}
                                >
                                  {est.nombre}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div className="flex items-center">
                              {usuario.establecimientosCreados &&
                              usuario.establecimientosCreados.length > 0 ? (
                                <>
                                  <Building
                                    className="h-4 w-4 mr-1"
                                    style={{ color: colors.info }}
                                  />
                                  <span>
                                    {obtenerNombreEstablecimiento(
                                      usuario.establecimientosCreados[0]
                                    )}
                                  </span>
                                </>
                              ) : (
                                "No asignado"
                              )}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingUser && editingUser.id === usuario.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={handleSaveChanges}
                                className="text-white p-1 rounded"
                                style={{ backgroundColor: colors.primary }}
                              >
                                <Check className="h-5 w-5" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-white p-1 rounded"
                                style={{ backgroundColor: colors.accent }}
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditClick(usuario)}
                              className="text-white p-1 rounded"
                              style={{ backgroundColor: colors.info }}
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
