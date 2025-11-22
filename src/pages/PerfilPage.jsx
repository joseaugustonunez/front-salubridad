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
  FaHeart,
  FaStar,
  FaTags,
  FaPercent,
  FaRegCommentDots,
} from "react-icons/fa";
import EstablecimientoForm from "../components/EstablecimientoForm";
import PromocionForm from "../components/PromocionForm";
import EstablecimientoCard from "../components/EstablecimientoCard";
import FotosEstablecimiento from "../components/FotosEstablecimiento";
import ComentariosEstablecimiento from "../components/ComentariosEstablecimiento";
import MisFavoritos from "../components/MisFavoritos";
import Ofertas from "../components/Ofertas";
import Reseñas from "../components/Reseñas";
import {
  subirFotoPerfil,
  subirFotoPortada,
  obtenerUsuarioPorId,
  obtenerTotalesUsuario,
  obtenerSeguidoresVendedor,
  obtenerComentariosRecibidosUsuario,
  // obtenerComentariosUsuario, // ...existing code...
} from "../api/usuario";
import { obtenerComentariosPorUsuario } from "../api/comentario"; // <-- agregado

// Definir colores como constantes para reutilización
const COLORS = {
  primary: "#49C581",
  primaryDark: "#337179",
  secondary: "#254A5D",
  accent: "#F8485E",
  info: "#37a6ca",
  background: "#f8f9fa",
  white: "#ffffff",
  gray: {
    100: "#f7fafc",
    200: "#edf2f7",
    300: "#e2e8f0",
    400: "#cbd5e0",
    500: "#a0aec0",
    600: "#718096",
    700: "#4a5568",
    800: "#2d3748",
    900: "#1a202c",
  },
};

const PerfilPage = () => {
  const [activeTab, setActiveTab] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [tieneEstablecimiento, setTieneEstablecimiento] = useState(false);
  const [establecimientosData, setEstablecimientosData] = useState([]);
  const [selectedEstablishmentId, setSelectedEstablishmentId] = useState(null);
  const [totalComentarios, setTotalComentarios] = useState(0);
  const [totalEstablecimientosSeguidos, setTotalEstablecimientosSeguidos] =
    useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalSeguidores, setTotalSeguidores] = useState(0);
  const [seguidoresList, setSeguidoresList] = useState([]);
  const [seguidoresCount, setSeguidoresCount] = useState(0);
  const [comentariosRecibidos, setComentariosRecibidos] = useState([]);
  const [comentariosRecibidosCount, setComentariosRecibidosCount] = useState(0);
  const [aportesCount, setAportesCount] = useState(0); // <-- agregado
  // Modal cambio de contraseña
  const [showModal, setShowModal] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const recargarUsuario = async (userId) => {
    const usuarioActualizado = await obtenerUsuarioPorId(userId);
    setUser(usuarioActualizado);
    localStorage.setItem("user", JSON.stringify(usuarioActualizado));
  };

  // Fondo de portada con gradiente usando los colores de la paleta
  const coverGradient = `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.primaryDark} 50%, ${COLORS.primary} 100%)`;

  useEffect(() => {
    if (
      user &&
      user.establecimientosCreados &&
      user.establecimientosCreados.length > 0
    ) {
      setTieneEstablecimiento(true);
      const establecimientosBasicos = user.establecimientosCreados.map(
        (id) => ({
          id: id,
          nombre: "Cargando...",
          direccion: "Cargando...",
          categorias: [],
        })
      );
      setEstablecimientosData(establecimientosBasicos);
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

  useEffect(() => {
    const obtenerUsuario = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
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

  const generateTabs = () => {
    const baseTabs = [
      { name: "Establecimiento", icon: <FaStore size={18} /> },
      { name: "Promociones", icon: <FaPercentage size={18} /> },
      { name: "Fotos", icon: <FaImages size={18} /> },
      { name: "Opiniones", icon: <FaCommentDots size={18} /> },
    ];
    if (!tieneEstablecimiento) {
      return [
        { name: "Crear Establecimiento", icon: <FaPlusCircle size={18} /> },
        ...baseTabs,
      ];
    }
    return baseTabs;
  };

  const generateTabsUser = () => {
    return [
      { name: "Favoritos", icon: <FaHeart size={18} /> },
      { name: "Reseñas", icon: <FaRegCommentDots size={18} /> },
      { name: "Ofertas", icon: <FaPercent size={18} /> },
    ];
  };

  const tabsUser = generateTabsUser();
  const tabs = generateTabs();
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const tempURL = URL.createObjectURL(file);
      setProfilePicture(tempURL);
      let userId = null;
      if (user && user.id) userId = user.id;
      else if (user && user._id) userId = user._id;
      else {
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
        console.error("No se pudo obtener el ID del usuario");
        throw new Error(
          "ID de usuario no disponible. Inicia sesión nuevamente."
        );
      }
      const imageUrl = await subirFotoPerfil(userId.toString(), file);
      if (imageUrl) {
        const updatedUser = { ...user, fotoPerfil: imageUrl };
        setUser(updatedUser);
        try {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (e) {
          console.error("Error al actualizar el usuario en localStorage:", e);
        }
        setRefreshKey(Date.now());
        alert("¡Foto de perfil actualizada con éxito!");
      }
      URL.revokeObjectURL(tempURL);
    } catch (error) {
      console.error("Error completo:", error);
      if (error.message.includes("ID de usuario")) {
        alert(error.message);
      } else {
        alert("No se pudo subir la foto de perfil. Inténtalo de nuevo.");
      }
      if (user && user.fotoPerfil) setProfilePicture(user.fotoPerfil);
    }
  };

  const handleCoverPhotoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const tempURL = URL.createObjectURL(file);
      setCoverPhoto(tempURL);
      let userId = null;
      if (user && user.id) userId = user.id;
      else if (user && user._id) userId = user._id;
      else {
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
        const updatedUser = { ...user, fotoPortada: imageUrl };
        setUser(updatedUser);
        try {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (e) {
          console.error("Error al actualizar el usuario en localStorage:", e);
        }
        setRefreshKey(Date.now());
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
      if (user && user.fotoPortada) setCoverPhoto(user.fotoPortada);
    }
  };

  const handleEstablecimientoCreado = (nuevoEstablecimiento) => {};

  useEffect(() => {
    if (!user) return;
    if (activeTab) return;
    if (user.rol === "vendedor") setActiveTab("Establecimiento");
    else setActiveTab("Favoritos");
  }, [user]);

  const getUserIdFromUser = () => {
    let userId = null;
    if (user && (user.id || user._id)) userId = user.id || user._id;
    else {
      userId =
        localStorage.getItem("userId") ||
        localStorage.getItem("user_id") ||
        localStorage.getItem("id");
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          userId = userId || parsed.id || parsed._id;
        } catch (e) {
          console.error("Error parseando user desde localStorage:", e);
        }
      }
    }
    return userId;
  };

  useEffect(() => {
    if (!user) return;
    const userId = getUserIdFromUser();
    if (!userId) return;
    (async () => {
      try {
        const totals = await obtenerTotalesUsuario(userId.toString());
        // Mapear respuesta del backend
        setTotalEstablecimientosSeguidos(
          Number(
            totals?.totalEstablecimientosSeguidos || totals?.siguiendo || 0
          )
        );
        setTotalComentarios(
          Number(
            totals?.totalComentariosRecibidos ||
              totals?.totalComentarios ||
              totals?.interacciones ||
              0
          )
        );
        setTotalLikes(Number(totals?.totalLikes || 0));
        setTotalSeguidores(
          Number(totals?.seguidoresCount || totals?.seguidores || 0)
        );
      } catch (error) {
        console.error("Error al obtener totales de usuario:", error);
      }

      // Obtener cantidad de comentarios (aportes) hechos por el usuario
      try {
        const resp = await obtenerComentariosPorUsuario(userId.toString()); // <-- cambiado
        // Puede devolver { total, comentarios } o un arreglo
        if (resp == null) setAportesCount(0);
        else if (typeof resp.total === "number")
          setAportesCount(Number(resp.total));
        else if (Array.isArray(resp)) setAportesCount(resp.length);
        else if (Array.isArray(resp.comentarios))
          setAportesCount(resp.comentarios.length);
        else setAportesCount(0);
      } catch (err) {
        console.error(
          "Error al obtener aportes (comentarios del usuario):",
          err
        );
        setAportesCount(0);
      }
    })();
  }, [user]);

  if (loading || !user) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: COLORS.background }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: COLORS.primary }}
          ></div>
          <p style={{ color: COLORS.secondary }}>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const fotoUrl = user?.fotoPerfil
    ? user.fotoPerfil.startsWith("http")
      ? user.fotoPerfil
      : `https://back-salubridad.sistemasudh.com${user.fotoPerfil}${
          user.fotoPerfil.includes("?") ? "&" : "?"
        }t=${Date.now()}`
    : null;

  return (
    <div
      className="w-full min-h-screen pb-20"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Cover Photo Section - Con gradiente de colores */}
      <div
        className="relative w-full h-64 md:h-80 flex items-center justify-center overflow-hidden"
        style={{ background: coverGradient }}
      >
        {/* Overlay para mejorar contraste */}
        <div className="absolute inset-0 bg-black opacity-10"></div>

        {/* Mostrar imagen de portada si existe, superpuesta sobre el gradiente */}
        {user?.fotoPortada && (
          <div className="absolute inset-0">
            <img
              src={`https://back-salubridad.sistemasudh.com${user.fotoPortada}${
                user.fotoPortada.includes("?") ? "&" : "?"
              }t=${Date.now()}`}
              alt="Portada"
              className="w-full h-full object-cover opacity-70"
            />
          </div>
        )}

        {/* Botón para cambiar foto de portada - Mejorado */}
        <label
          htmlFor="coverPhotoInput"
          className="absolute top-24 right-6 bg-white bg-opacity-95 px-5 py-3 rounded-full flex items-center space-x-2 transition-all hover:bg-white hover:shadow-2xl z-10 cursor-pointer hover:scale-105 group"
          style={{ color: COLORS.secondary }}
        >
          <FaCamera
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="ml-2 font-semibold">Cambiar portada</span>
        </label>
        <input
          id="coverPhotoInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverPhotoChange}
        />

        {/* Efecto decorativo adicional */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black opacity-10"></div>
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-4 relative -mt-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Profile Photo - Con botón de cámara mejorado */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-20 md:left-8 md:transform-none z-30">
            <div className="relative group">
              <div
                className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center relative"
                style={{ backgroundColor: COLORS.primary }}
              >
                {fotoUrl ? (
                  <img
                    src={fotoUrl}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-4xl font-bold">
                    {user.nombreUsuario?.charAt(0).toUpperCase()}
                  </span>
                )}

                {/* Overlay en hover */}
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <FaCamera size={24} className="text-white" />
                </div>
              </div>

              {/* Botón de cámara flotante - Siempre visible */}
              <label
                htmlFor="profilePictureInput"
                className="absolute bottom-2 right-2 p-3 rounded-full shadow-2xl transition-all cursor-pointer hover:scale-110 active:scale-95 z-20"
                style={{
                  backgroundColor: COLORS.primary,
                  color: COLORS.white,
                  border: `3px solid ${COLORS.white}`,
                }}
                title="Cambiar foto de perfil"
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
          </div>

          {/* User Info Section */}
          <div className="pt-24 md:pt-8 md:pl-44 px-6 pb-6 md:flex md:items-center md:justify-between">
            <div className="flex-1">
              <h2
                className="text-3xl font-bold mb-2"
                style={{ color: COLORS.secondary }}
              >
                {user.nombreUsuario}
              </h2>
              <p className="text-gray-600 flex items-center flex-wrap mb-3">
                <span className="flex items-center">
                  <span className="mr-2">{user.email}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span
                    className="text-sm px-3 py-1 rounded-full capitalize font-medium"
                    style={{
                      backgroundColor: `${COLORS.primary}15`,
                      color: COLORS.primary,
                    }}
                  >
                    {user.rol}
                  </span>
                </span>
              </p>
              <p className="text-gray-500 text-sm">
                Se unió en{" "}
                {new Date(user.fechaCreacion).toLocaleDateString("es-ES", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 rounded-full font-medium shadow-lg transition-all hover:shadow-xl hover:scale-105 flex items-center"
                style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
              >
                <FaEdit size={16} className="mr-2" />
                Editar perfil
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="px-6 -mt-2 mb-6">
            <div className="max-w-4xl mx-auto">
              {user?.rol === "vendedor" ? (
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div
                    className="bg-white rounded-xl shadow-md p-3 sm:p-5 flex flex-col items-center text-center border border-gray-100 hover:shadow-lg transition-all"
                    aria-label="Reseñas"
                  >
                    <p
                      className="text-2xl sm:text-3xl font-bold mb-1"
                      style={{ color: COLORS.secondary }}
                    >
                      {totalComentarios || 0}
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Reseñas
                    </p>
                  </div>

                  <div
                    className="bg-white rounded-xl shadow-md p-3 sm:p-5 flex flex-col items-center text-center border border-gray-100 hover:shadow-lg transition-all"
                    aria-label="Seguidores"
                  >
                    <p
                      className="text-2xl sm:text-3xl font-bold mb-1"
                      style={{ color: COLORS.secondary }}
                    >
                      {totalSeguidores || 0}
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Seguidores
                    </p>
                  </div>

                  <div
                    className="bg-white rounded-xl shadow-md p-3 sm:p-5 flex flex-col items-center text-center border border-gray-100 hover:shadow-lg transition-all"
                    aria-label="Me gusta"
                  >
                    <p
                      className="text-2xl sm:text-3xl font-bold mb-1"
                      style={{ color: COLORS.secondary }}
                    >
                      {totalLikes || 0}
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Me gusta
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  <div
                    className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center text-center border border-gray-100 hover:shadow-lg transition-all"
                    aria-label="Siguiendo"
                  >
                    <p
                      className="text-3xl font-bold mb-1"
                      style={{ color: COLORS.secondary }}
                    >
                      {totalEstablecimientosSeguidos || user.siguiendo || 0}
                    </p>
                    <p className="text-sm font-medium text-gray-600">
                      Siguiendo
                    </p>
                  </div>

                  <div
                    className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center text-center border border-gray-100 hover:shadow-lg transition-all"
                    aria-label="Aportes"
                  >
                    <p
                      className="text-3xl font-bold mb-1"
                      style={{ color: COLORS.secondary }}
                    >
                      {aportesCount || user.aportes || 0}
                    </p>
                    <p className="text-sm font-medium text-gray-600">Aportes</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {user?.rol === "vendedor" ? (
            <>
              {/* Tabs Navigation */}
              <div className="overflow-x-auto scrollbar-hide border-b border-gray-200 bg-gray-50">
                <div className="flex w-full">
                  {tabs.map((tab) => (
                    <button
                      key={tab.name}
                      className={`flex-1 flex flex-col items-center justify-center px-4 py-4 text-sm font-medium transition-all duration-300 border-b-2 min-w-0 ${
                        activeTab === tab.name
                          ? "border-b-2 font-semibold"
                          : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                      }`}
                      style={
                        activeTab === tab.name
                          ? {
                              borderColor: COLORS.primary,
                              color: COLORS.primary,
                              backgroundColor: `${COLORS.primary}08`,
                            }
                          : {}
                      }
                      onClick={() => setActiveTab(tab.name)}
                    >
                      <span className="text-xl mb-1">{tab.icon}</span>
                      <span className="hidden md:block whitespace-nowrap">
                        {tab.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className=" bg-gray-50">
                {activeTab === "Crear Establecimiento" && (
                  <div className="text-center ">
                    <EstablecimientoForm
                      onEstablecimientoCreado={handleEstablecimientoCreado}
                    />
                  </div>
                )}

                {activeTab === "Establecimiento" && (
                  <div className="text-center">
                    {tieneEstablecimiento ? (
                      <div>
                        <h3
                          className="text-xl font-semibold mb-6"
                          style={{ color: COLORS.secondary }}
                        >
                          {user.establecimientosCreados &&
                          user.establecimientosCreados.length > 0
                            ? `Tienes ${user.establecimientosCreados.length} establecimiento(s)`
                            : "No tienes establecimientos registrados"}
                        </h3>
                        <div className="mt-6 space-y-6">
                          {loading ? (
                            <div className="text-center py-8">
                              <div
                                className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4"
                                style={{ borderColor: COLORS.primary }}
                              ></div>
                              <p className="text-gray-600">
                                Cargando establecimientos...
                              </p>
                            </div>
                          ) : (
                            establecimientosData.map((est, index) => (
                              <div
                                key={index}
                                className="transition-all hover:scale-[1.02]"
                              >
                                <EstablecimientoCard
                                  establecimientoId={est.id}
                                  tieneEstablecimiento={tieneEstablecimiento}
                                  onEstablecimientoActualizado={() =>
                                    recargarUsuario(user._id)
                                  }
                                />
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md mx-auto">
                        <div className="bg-gray-100 inline-flex p-6 rounded-full mb-4">
                          <FaStore
                            size={42}
                            style={{ color: COLORS.primary }}
                          />
                        </div>
                        <h3
                          className="text-xl font-semibold mb-2"
                          style={{ color: COLORS.secondary }}
                        >
                          No tienes establecimientos registrados
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Crea tu primer establecimiento para empezar a recibir
                          reseñas
                        </p>
                        <button
                          onClick={() => setActiveTab("Crear Establecimiento")}
                          className="px-6 py-3 rounded-full text-white font-medium shadow-lg transition-all hover:shadow-xl hover:scale-105"
                          style={{ backgroundColor: COLORS.primary }}
                        >
                          Crear Establecimiento
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "Promociones" && (
                  <div className="bg-white rounded-2xl shadow-md p-6">
                    {tieneEstablecimiento ? (
                      <PromocionForm
                        tieneEstablecimiento={tieneEstablecimiento}
                        establecimientosData={establecimientosData}
                      />
                    ) : (
                      <div className="text-center py-8 bg-white rounded-2xl shadow-md p-8 max-w-md mx-auto">
                        <div className="bg-gray-100 inline-flex p-6 rounded-full mb-4">
                          <FaPercentage
                            size={42}
                            style={{ color: COLORS.accent }}
                          />
                        </div>
                        <h3
                          className="text-xl font-semibold mb-2"
                          style={{ color: COLORS.secondary }}
                        >
                          Necesitas un establecimiento para crear promociones
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Crea primero tu establecimiento para poder añadir
                          promociones
                        </p>
                        <button
                          onClick={() => setActiveTab("Crear Establecimiento")}
                          className="px-6 py-3 rounded-full text-white font-medium shadow-lg transition-all hover:shadow-xl hover:scale-105"
                          style={{ backgroundColor: COLORS.primary }}
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
                      <div className="text-center py-8 bg-white rounded-2xl shadow-md p-8 max-w-md mx-auto">
                        <div className="bg-gray-100 inline-flex p-6 rounded-full mb-4">
                          <FaImages size={42} style={{ color: COLORS.info }} />
                        </div>
                        <h3
                          className="text-xl font-semibold mb-2"
                          style={{ color: COLORS.secondary }}
                        >
                          Necesitas un establecimiento para gestionar fotos
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Crea primero tu establecimiento para poder añadir
                          fotos
                        </p>
                        <button
                          onClick={() => setActiveTab("Crear Establecimiento")}
                          className="px-6 py-3 rounded-full text-white font-medium shadow-lg transition-all hover:shadow-xl hover:scale-105"
                          style={{ backgroundColor: COLORS.primary }}
                        >
                          Crear Establecimiento
                        </button>
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                        <FotosEstablecimiento
                          establecimientoId={user?.establecimientosCreados?.[0]}
                          tieneEstablecimiento={tieneEstablecimiento}
                        />
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "Opiniones" && (
                  <div className="text-center py-8">
                    {!tieneEstablecimiento ? (
                      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md mx-auto">
                        <div className="bg-gray-100 inline-flex p-6 rounded-full mb-4">
                          <FaCommentDots
                            size={42}
                            style={{ color: COLORS.accent }}
                          />
                        </div>
                        <h3
                          className="text-xl font-semibold mb-2"
                          style={{ color: COLORS.secondary }}
                        >
                          Necesitas un establecimiento para recibir opiniones
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Crea primero tu establecimiento para poder recibir
                          opiniones de tus clientes
                        </p>
                        <button
                          onClick={() => setActiveTab("Crear Establecimiento")}
                          className="px-6 py-3 rounded-full text-white font-medium shadow-lg transition-all hover:shadow-xl hover:scale-105"
                          style={{ backgroundColor: COLORS.primary }}
                        >
                          Crear Establecimiento
                        </button>
                      </div>
                    ) : (
                      <div>
                        {loading ? (
                          <div className="text-center py-8">
                            <div
                              className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4"
                              style={{ borderColor: COLORS.primary }}
                            ></div>
                            <p className="text-gray-600">
                              Cargando opiniones...
                            </p>
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
            </>
          ) : (
            <div className="p-6 bg-gray-50">
              {/* User Tabs Navigation */}
              <div className="overflow-x-auto scrollbar-hide border-b border-gray-200 bg-gray-50">
                <div className="flex w-full">
                  {tabsUser.map((tab) => (
                    <button
                      key={tab.name}
                      className={`flex-1 flex flex-col items-center justify-center px-4 py-4 text-sm font-medium transition-all duration-300 border-b-2 min-w-0 ${
                        activeTab === tab.name
                          ? "border-b-2 font-semibold"
                          : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                      }`}
                      style={
                        activeTab === tab.name
                          ? {
                              borderColor: COLORS.primary,
                              color: COLORS.primary,
                              backgroundColor: `${COLORS.primary}08`,
                            }
                          : {}
                      }
                      onClick={() => setActiveTab(tab.name)}
                    >
                      <span className="text-xl mb-1">{tab.icon}</span>
                      <span className="hidden md:block whitespace-nowrap">
                        {tab.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === "Favoritos" && (
                  <div className="space-y-6">
                    <MisFavoritos />
                  </div>
                )}

                {activeTab === "Reseñas" && (
                  <div className="space-y-6">
                    <Reseñas />
                  </div>
                )}

                {activeTab === "Ofertas" && (
                  <div className="text-center py-8">
                    <Ofertas />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal cambio de contraseña */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Cambiar contraseña
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!currentPass || !newPass || !confirmPass) {
                    alert("Complete todos los campos");
                    return;
                  }
                  if (newPass !== confirmPass) {
                    alert("La nueva contraseña y confirmación no coinciden");
                    return;
                  }
                  // TODO: llamar API para cambiar contraseña
                  alert("Contraseña actualizada");
                  setCurrentPass("");
                  setNewPass("");
                  setConfirmPass("");
                  setShowModal(false);
                }}
                className="px-4 py-4 space-y-3"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña actual
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Contraseña actual"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                    >
                      {showCurrent ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Nueva contraseña"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                    >
                      {showNew ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar nueva contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Confirmar contraseña"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                    >
                      {showConfirm ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="w-full px-3 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition text-sm"
                  >
                    Guardar contraseña
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PerfilPage;
