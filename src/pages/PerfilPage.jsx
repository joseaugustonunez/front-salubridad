"use client";
import { useEffect, useState } from "react";
import {
  FaCamera,
  FaEdit,
  FaPercentage,
  FaImages,
  FaCommentDots,
  FaStore,
  FaPlusCircle,
} from "react-icons/fa";
import EstablecimientoForm from "../components/EstablecimientoForm";
import PromocionForm from "../components/PromocionForm";
import EstablecimientoCard from "../components/EstablecimientoCard";
import FotosEstablecimiento from "../components/FotosEstablecimiento";
import ComentariosEstablecimiento from "../components/ComentariosEstablecimiento";
import { subirFotoPerfil } from "../api/usuario";
import { obtenerUsuarioPorId } from "../api/usuario";
import { subirFotoPortada } from "../api/usuario";
const PerfilPage = () => {
  const [activeTab, setActiveTab] = useState("Establecimiento");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [tieneEstablecimiento, setTieneEstablecimiento] = useState(false);
  const [establecimientosData, setEstablecimientosData] = useState([]);
  const [selectedEstablishmentId, setSelectedEstablishmentId] = useState(null);

const recargarUsuario = async (userId) => {
  const usuarioActualizado = await obtenerUsuarioPorId(userId);
  setUser(usuarioActualizado);
  localStorage.setItem("user", JSON.stringify(usuarioActualizado));
};
  // Imagen de portada por defecto
  const defaultCoverPhoto =
    "https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80";

  useEffect(() => {
    if (
      user &&
      user.establecimientosCreados &&
      user.establecimientosCreados.length > 0
    ) {
      setTieneEstablecimiento(true);

      // Obtener datos básicos de los establecimientos para la lista
      const establecimientosBasicos = user.establecimientosCreados.map(
        (id) => ({
          id: id,
          nombre: "Cargando...",
          direccion: "Cargando...",
          categorias: [],
        })
      );

      setEstablecimientosData(establecimientosBasicos);

      // En una aplicación real, aquí cargarías los datos básicos de cada establecimiento
      // Simulamos los datos para este ejemplo
      setTimeout(() => {
        const datosSimulados = user.establecimientosCreados.map(
          (id, index) => ({
            id: id,
            nombre: `Establecimiento ${index + 1}`,
            direccion: "Av. Principal 123, Miraflores",
            categorias: ["Restaurante", "Bar"],
          })
        );

        setEstablecimientosData(datosSimulados);
        setLoading(false);
      }, 1000);
    } else {
      setTieneEstablecimiento(false);
      setLoading(false);
    }
  }, [user]);
  // Cargar datos de la sesión
  useEffect(() => {
    // Obtener datos del usuario del localStorage
    const obtenerUsuario = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Comprobar si el usuario tiene algún establecimiento creado
          setTieneEstablecimiento(
            parsedUser.establecimientosCreados &&
              parsedUser.establecimientosCreados.length > 0
          );
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerUsuario();
  }, []);

  // Función para generar las pestañas adecuadas según si tiene establecimiento o no
  const generateTabs = () => {
    const baseTabs = [
      { name: "Establecimiento", icon: <FaStore size={18} /> },
      { name: "Promociones", icon: <FaPercentage size={18} /> },
      { name: "Fotos", icon: <FaImages size={18} /> },
      { name: "Opiniones", icon: <FaCommentDots size={18} /> },
    ];

    // Si no tiene establecimiento, agregar la opción de "Crear Establecimiento" al inicio
    if (!tieneEstablecimiento) {
      return [
        { name: "Crear Establecimiento", icon: <FaPlusCircle size={18} /> },
        ...baseTabs,
      ];
    }

    return baseTabs;
  };

  const tabs = generateTabs();

  const [refreshKey, setRefreshKey] = useState(Date.now());

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Mostrar temporalmente la imagen seleccionada
      const tempURL = URL.createObjectURL(file);
      setProfilePicture(tempURL);

      // Obtener el ID del usuario de múltiples fuentes posibles
      let userId = null;

      // Intentar obtener del objeto user (verificar la estructura exacta)
      if (user && user.id) {
        userId = user.id;
      } else if (user && user._id) {
        // Algunas APIs usan _id en lugar de id
        userId = user._id;
      } else {
        // Intentar diferentes keys en localStorage según tu implementación
        userId =
          localStorage.getItem("userId") ||
          localStorage.getItem("user_id") ||
          localStorage.getItem("id");

        // Si hay un objeto user en localStorage, intentar extraer el ID
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            userId = parsedUser.id || parsedUser._id;
          } catch (e) {
            console.error("Error al parsear el usuario almacenado:", e);
          }
        }
      }

    

      // Verificar que tenemos un ID válido antes de continuar
      if (!userId) {
        console.error("No se pudo obtener el ID del usuario");
        throw new Error(
          "ID de usuario no disponible. Inicia sesión nuevamente."
        );
      }

      // Llamar a la API para subir la imagen pasando el ID y el archivo
      const imageUrl = await subirFotoPerfil(userId.toString(), file); // Asegurar que es string

      // Actualizar la URL de la imagen con la devuelta por el servidor
      if (imageUrl) {
        // Actualizar el estado del objeto usuario
        const updatedUser = {
          ...user,
          fotoPerfil: imageUrl,
        };

        // Actualizar el estado local
        setUser(updatedUser);

        // Actualizar en localStorage si lo usas para persistencia
        try {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (e) {
          console.error("Error al actualizar el usuario en localStorage:", e);
        }

        // Generar un nuevo timestamp para forzar la recarga de la imagen
        setRefreshKey(Date.now());

        // Mensaje de éxito para el usuario
        alert("¡Foto de perfil actualizada con éxito!");
      }

      // Limpiar la URL temporal
      URL.revokeObjectURL(tempURL);
    } catch (error) {
      console.error("Error completo:", error);

      // Mensaje de error más específico según el tipo de error
      if (error.message.includes("ID de usuario")) {
        alert(error.message);
      } else {
        alert("No se pudo subir la foto de perfil. Inténtalo de nuevo.");
      }

      // Revertir la imagen al estado anterior si hay error
      if (user && user.fotoPerfil) {
        setProfilePicture(user.fotoPerfil);
      }
    }
  };

  // Manejador para cambio de foto de portada
  const handleCoverPhotoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Mostrar temporalmente la imagen seleccionada
      const tempURL = URL.createObjectURL(file);
      setCoverPhoto(tempURL);

      // Obtener el ID del usuario de múltiples fuentes posibles
      let userId = null;

      if (user && user.id) {
        userId = user.id;
      } else if (user && user._id) {
        userId = user._id;
      } else {
        userId =
          localStorage.getItem("userId") ||
          localStorage.getItem("user_id") ||
          localStorage.getItem("id");

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            userId = parsedUser.id || parsedUser._id;
          } catch (e) {
            console.error("Error al parsear el usuario almacenado:", e);
          }
        }
      }


      if (!userId) {
        console.error("No se pudo obtener el ID del usuario para la portada");
        throw new Error(
          "ID de usuario no disponible. Inicia sesión nuevamente."
        );
      }

      const imageUrl = await subirFotoPortada(userId.toString(), file);

      if (imageUrl) {
        // Actualizar el estado del objeto usuario
        const updatedUser = {
          ...user,
          fotoPortada: imageUrl,
        };

        // Actualizar el estado local
        setUser(updatedUser);

        // Actualizar en localStorage si lo usas para persistencia
        try {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (e) {
          console.error("Error al actualizar el usuario en localStorage:", e);
        }

        // Generar un nuevo timestamp para forzar la recarga de la imagen
        setRefreshKey(Date.now());

        // Mensaje de éxito para el usuario
        alert("¡Foto de portada actualizada con éxito!");
      }

      URL.revokeObjectURL(tempURL);
    } catch (error) {
      console.error("Error completo al subir la foto de portada:", error);

      if (error.message.includes("ID de usuario")) {
        alert(error.message);
      } else {
        alert("No se pudo subir la foto de portada. Inténtalo de nuevo.");
      }

      if (user && user.fotoPortada) {
        setCoverPhoto(user.fotoPortada);
      }
    }
  };

  const handleEstablecimientoCreado = (nuevoEstablecimiento) => {
    // Aquí puedes actualizar el estado o hacer algo con el nuevo establecimiento
  };
  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen pb-20"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      {/* Cover Photo Section */}
      <div
        className="relative w-full h-64 flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #337179 0%, #37a6ca 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        {/* Mostrar foto de portada o la imagen por defecto */}
        <div className="absolute inset-0">
          <img
            src={`https://back-salubridad.sistemasudh.com${user.fotoPortada}${
              user.fotoPortada?.includes("?") ? "&" : "?"
            }t=${Date.now()}`}
            alt="Portada"
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        <label
          htmlFor="coverPhotoInput"
          className="absolute top-24 right-4 bg-white bg-opacity-90 px-4 py-2 text-sm font-medium rounded-full flex items-center space-x-2 transition hover:bg-opacity-100 shadow z-10 cursor-pointer"
          style={{ color: "#254A5D" }}
        >
          <FaCamera size={16} />
          <span className="ml-2">Cambiar portada</span>
        </label>
        <input
          id="coverPhotoInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverPhotoChange}
        />
      </div>

      {/* Profile Content */}
      <div className="max-w-5xl mx-auto px-4 relative">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Profile Photo - Positioned to overlap the cover photo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-16 md:left-16 md:transform-none z-30">
            <div
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center"
              style={{ backgroundColor: "#49C581" }}
            >
              {user.fotoPerfil ? (
                <img
                  src={`https://back-salubridad.sistemasudh.com${user.fotoPerfil}${
                    user.fotoPerfil?.includes("?") ? "&" : "?"
                  }t=${Date.now()}`}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-4xl font-bold">
                  {user.nombreUsuario?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <label
              htmlFor="profilePictureInput"
              className="absolute bottom-0 right-0 p-2 rounded-full shadow-md transition cursor-pointer"
              style={{ backgroundColor: "#49C581", color: "white" }}
            >
              <FaCamera size={16} />
            </label>
            <input
              id="profilePictureInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureChange}
            />
          </div>

          {/* User Info Section */}
          <div className="pt-20 md:pt-6 md:pl-52 px-6 pb-6 md:flex md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "#254A5D" }}>
                {user.nombreUsuario}
              </h2>
              <p className="text-gray-500 flex items-center flex-wrap mt-1">
                <span>{user.email}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span
                  className="text-sm px-2 py-1 rounded-full capitalize"
                  style={{ backgroundColor: "#f0f8f6", color: "#49C581" }}
                >
                  {user.rol}
                </span>
              </p>
              <p className="text-gray-600 mt-2 text-sm">
                Se unió en{" "}
                {new Date(user.fechaCreacion).toLocaleDateString("es-ES", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <button
                className="px-5 py-2 rounded-full text-sm font-medium shadow-sm transition flex items-center"
                style={{ backgroundColor: "#49C581", color: "white" }}
              >
                <FaEdit size={16} className="mr-2" />
                Editar perfil
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 divide-x divide-gray-100 bg-gray-50 border-t border-gray-100">
            <div className="text-center py-4">
              <p className="font-bold text-xl" style={{ color: "#254A5D" }}>
                {user.aportes || 0}
              </p>
              <p className="text-sm text-gray-500">Aportes</p>
            </div>
            <div className="text-center py-4">
              <p className="font-bold text-xl" style={{ color: "#254A5D" }}>
                {user.seguidores || 0}
              </p>
              <p className="text-sm text-gray-500">Seguidores</p>
            </div>
            <div className="text-center py-4">
              <p className="font-bold text-xl" style={{ color: "#254A5D" }}>
                {user.siguiendo || 0}
              </p>
              <p className="text-sm text-gray-500">Siguiendo</p>
            </div>
          </div>

          {/* Debug Information */}
          {/*      <div className="px-6 py-2 bg-gray-100 text-xs text-gray-600">
            <p>Debug: tieneEstablecimiento = {tieneEstablecimiento ? 'true' : 'false'}</p>
            <p>Debug: establecimientosCreados = {JSON.stringify(user.establecimientosCreados)}</p>
          </div> */}

          {/* Tabs */}
          <div className="overflow-x-auto scrollbar-hide border-b border-gray-100">
            <div className="flex min-w-max px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  className={`flex items-center px-4 py-4 text-sm font-medium transition border-b-2 ${
                    activeTab === tab.name
                      ? "border-b-2 text-white"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  style={
                    activeTab === tab.name
                      ? {
                          borderColor: "#49C581",
                          color: "#337179",
                        }
                      : {}
                  }
                  onClick={() => setActiveTab(tab.name)}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "Crear Establecimiento" && (
              <div className="text-center py-10">
                <EstablecimientoForm
                  onEstablecimientoCreado={handleEstablecimientoCreado}
                />
              </div>
            )}

            {activeTab === "Establecimiento" && (
              <div className="text-center py-10">
                <div className="bg-gray-50 inline-flex p-6 rounded-full mb-4">
                  <FaStore size={36} style={{ color: "#37a6ca" }} />
                </div>
                {tieneEstablecimiento ? (
                  <div>
                    <h3
                      className="text-lg font-medium"
                      style={{ color: "#254A5D" }}
                    >
                      {user.establecimientosCreados &&
                      user.establecimientosCreados.length > 0
                        ? `Tienes ${user.establecimientosCreados.length} establecimiento(s)`
                        : "No tienes establecimientos registrados"}
                    </h3>
                    <div className="mt-6">
                      {loading ? (
                        <div className="text-center py-4">
                          <p>Cargando establecimientos...</p>
                        </div>
                      ) : (
                        establecimientosData.map((est, index) => (
                          <div
                            key={index}
                            className="bg-white shadow-sm rounded-lg p-4 mb-4 text-left border border-gray-100"
                          >
                            {/* Aquí integramos el componente EstablecimientoCard */}
                            <div className="mt-4">
                              <EstablecimientoCard
                                establecimientoId={est.id}
                                tieneEstablecimiento={tieneEstablecimiento}
                                 onEstablecimientoActualizado={() => recargarUsuario(user._id)}
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3
                      className="text-lg font-medium"
                      style={{ color: "#254A5D" }}
                    >
                      No tienes establecimientos registrados
                    </h3>
                    <p className="text-gray-500 mt-1">
                      Crea tu primer establecimiento para empezar a recibir
                      reseñas
                    </p>
                    <button
                      onClick={() => setActiveTab("Crear Establecimiento")}
                      className="mt-4 px-4 py-2 rounded-md text-white font-medium"
                      style={{ backgroundColor: "#49C581" }}
                    >
                      Crear Establecimiento
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Promociones" && (
              <div className="bg-white rounded-lg shadow p-6">
                {tieneEstablecimiento ? (
                  <PromocionForm tieneEstablecimiento={tieneEstablecimiento}
            establecimientosData={establecimientosData}/>
                ) : (
                  <div className="text-center py-6">
                    <div className="bg-gray-50 inline-flex p-6 rounded-full mb-4">
                      <FaPercentage size={36} style={{ color: "#F8485E" }} />
                    </div>
                    <h3
                      className="text-lg font-medium"
                      style={{ color: "#254A5D" }}
                    >
                      Necesitas un establecimiento para crear promociones
                    </h3>
                    <p className="text-gray-500 mt-1">
                      Crea primero tu establecimiento para poder añadir
                      promociones
                    </p>
                    <button
                      onClick={() => setActiveTab("Crear Establecimiento")}
                      className="mt-4 px-4 py-2 rounded-md text-white font-medium"
                      style={{ backgroundColor: "#49C581" }}
                    >
                      Crear Establecimiento
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Fotos" && (
              <div className="space-y-6">
                {!tieneEstablecimiento ? (
                  <div className="text-center py-6 bg-white rounded-lg shadow">
                    <div className="bg-gray-50 inline-flex p-6 rounded-full mb-4">
                      <FaImages size={36} style={{ color: "#37a6ca" }} />
                    </div>
                    <h3
                      className="text-lg font-medium"
                      style={{ color: "#254A5D" }}
                    >
                      Necesitas un establecimiento para gestionar fotos
                    </h3>
                    <p className="text-gray-500 mt-1">
                      Crea primero tu establecimiento para poder añadir fotos
                    </p>
                    <button
                      onClick={() => setActiveTab("Crear Establecimiento")}
                      className="mt-4 px-4 py-2 rounded-md text-white font-medium"
                      style={{ backgroundColor: "#49C581" }}
                    >
                      Crear Establecimiento
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow">
                    <FotosEstablecimiento
                      establecimientoId={user?.establecimientosCreados?.[0]}
                      tieneEstablecimiento={tieneEstablecimiento}
                    />
                  </div>
                )}
              </div>
            )}

{activeTab === "Opiniones" && (
  <div className="text-center py-10">
    {!tieneEstablecimiento ? (
      <div>
        <div className="bg-gray-50 inline-flex p-6 rounded-full mb-4">
          <FaCommentDots size={36} style={{ color: "#F8485E" }} />
        </div>
        <h3
          className="text-lg font-medium"
          style={{ color: "#254A5D" }}
        >
          Necesitas un establecimiento para recibir opiniones
        </h3>
        <p className="text-gray-500 mt-1">
          Crea primero tu establecimiento para poder recibir
          opiniones de tus clientes
        </p>
        <button
          onClick={() => setActiveTab("Crear Establecimiento")}
          className="mt-4 px-4 py-2 rounded-md text-white font-medium"
          style={{ backgroundColor: "#49C581" }}
        >
          Crear Establecimiento
        </button>
      </div>
    ) : (
      <div>
        <div className="bg-gray-50 inline-flex p-6 rounded-full mb-4">
          <FaCommentDots size={36} style={{ color: "#F8485E" }} />
        </div>
        <h3
          className="text-lg font-medium mb-4"
          style={{ color: "#254A5D" }}
        >
          Opiniones de tus establecimientos
        </h3>
        
        {loading ? (
          <div className="text-center py-4">
            <p>Cargando opiniones...</p>
          </div>
        ) : (
          <ComentariosEstablecimiento
            tieneEstablecimiento={tieneEstablecimiento}
            establecimientosData={establecimientosData}
          />
        )}
      </div>
    )}
  </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
