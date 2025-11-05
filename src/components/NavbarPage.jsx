import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import NotificacionesComponent from "./NotificacionesComponent";
import { buscarEstablecimientosPorNombre } from "../api/establecimientos";
import { obtenerCategorias } from "../api/categorias";
import { obtenerTipos } from "../api/tipos";
export default function NavbarPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("inicio");
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  // Refs para los elementos que necesitan detección de clicks fuera
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const searchRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const searchButtonRef = useRef(null);
  const userMenuRef = useRef(null);
  const userMenuButtonRef = useRef(null);
  const notificationsRef = useRef(null);
  const notificationsButtonRef = useRef(null);

  // Effect to handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Close menu if click is outside both the menu and its toggle button
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }

      // Close search if click is outside both the search and its toggle button
      if (
        isSearchOpen &&
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }

      // Close user menu if click is outside both the menu and its toggle button
      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        userMenuButtonRef.current &&
        !userMenuButtonRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }

      // Close notifications if click is outside both the notifications and its toggle button
      if (
        isNotificationsOpen &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target) &&
        notificationsButtonRef.current &&
        !notificationsButtonRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }

      // Close desktop search dropdown if click outside
      if (
        searchResults.length > 0 &&
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(event.target)
      ) {
        setSearchResults([]);
        setSearchQuery("");
        setIsSearching(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    isMenuOpen,
    isSearchOpen,
    isUserMenuOpen,
    isNotificationsOpen,
    searchResults,
  ]);

  // Effect to set active link based on current pathname when component mounts
  useEffect(() => {
    const path = window.location.pathname;

    // Map pathname to menu item
    if (path === "/") {
      setActiveLink("inicio");
    } else if (path.includes("/establecimientos")) {
      setActiveLink("establecimientos");
    } else if (path.includes("/top")) {
      setActiveLink("top");
    } else if (path.includes("/promociones")) {
      setActiveLink("promociones");
    } else if (path.includes("/negocio/dashboard")) {
      setActiveLink("negocio-dashboard");
    } else if (path.includes("/negocio/reservas")) {
      setActiveLink("negocio-reservas");
    } else if (path.includes("/negocio/promociones")) {
      setActiveLink("negocio-promociones");
    } else if (path.includes("/negocio/estadisticas")) {
      setActiveLink("negocio-estadisticas");
    } else if (path.includes("/admin/tipos")) {
      setActiveLink("tipos");
    } else if (path.includes("/admin/categorias")) {
      setActiveLink("categorias");
    } else if (path.includes("/admin/usuarios")) {
      setActiveLink("usuarios");
    } else if (path.includes("/admin/establecimientos")) {
      setActiveLink("establecimientos-admin");
    } else if (path.includes("/admin/promociones")) {
      setActiveLink("promociones-admin");
    } else if (path.includes("/perfil")) {
      setActiveLink("perfil");
    } else if (path.includes("/asociate")) {
      setActiveLink("asociate");
    }
  }, []); // Empty dependency array means this runs once on mount

  // Close other menus when one is opened (exclusive toggling)
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
    setIsNotificationsOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsNotificationsOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  };

  // Count unread notifications
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  // Function to mark a notification as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  // Normalizar rol y comprobar tipos admitidos (evita diferencias como "admin" vs "administrador")
  const rol = user?.rol?.toString?.().toLowerCase?.() || "";
  const isAdmin = Boolean(user && (rol === "administrador" || rol === "admin"));
  // Check if user is business owner
  const isBusinessOwner = Boolean(
    user && (rol === "propietario" || rol === "propietary" || rol === "owner")
  );

  // Handle link click - update state and allow default navigation
  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
    // Close mobile menu after link click
    setIsMenuOpen(false);
  };

  // Búsqueda de establecimientos (debounced simple)
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(async () => {
      try {
        const res = await buscarEstablecimientosPorNombre(q);
        // Obtener categorías y tipos si solo vienen IDs
        const categorias = await obtenerCategorias();
        const tipos = await obtenerTipos();

        const normalizados = (res || []).map((item) => ({
          ...item,
          categorias: (item.categorias || item.categoria || []).map(
            (catId) =>
              categorias.find((cat) => cat._id === catId) || {
                nombre: "Desconocido",
              }
          ),
          tipos: (item.tipos || item.tipo || []).map(
            (tipoId) =>
              tipos.find((tipo) => tipo._id === tipoId) || {
                tipo_nombre: "Desconocido",
              }
          ),
        }));
        setSearchResults(normalizados.slice(0, 6));
      } catch (error) {
        console.error("Error en búsqueda:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);
  const goToEstablecimiento = (id) => {
    if (!id) return;
    console.log("Navegando a:", id);
    // Navegación inmediata (no limpiar antes)
    window.location.href = `/establecimientodetalle/${id}`;
  };
  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 pt-4">
      <nav className="bg-white shadow-md rounded-xl mx-auto max-w-7xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              ref={menuButtonRef}
              className="md:hidden text-gray-700 hover:text-teal-700 focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Left: Menu (desktop) */}
            <div className="hidden md:flex items-center space-x-3 text-sm font-helveticaBold">
              {/* Mostrar enlaces públicos sólo si NO es admin */}
              {!isAdmin && (
                <>
                  <a
                    href="/"
                    className={`block md:px-2 md:py-1 px-3 py-1 rounded-3xl transition duration-200 text-sm ${
                      activeLink === "inicio"
                        ? "bg-[#254A5D] text-white"
                        : "text-gray-700 hover:bg-[#254A5D] hover:text-white"
                    }`}
                    onClick={() => handleLinkClick("inicio")}
                  >
                    Inicio
                  </a>
                  <a
                    href="/establecimientos"
                    className={`block md:px-2 md:py-1 px-3 py-1 rounded-3xl transition duration-200 text-sm ${
                      activeLink === "establecimientos"
                        ? "bg-[#254A5D] text-white"
                        : "text-gray-700 hover:bg-[#254A5D] hover:text-white"
                    }`}
                    onClick={() => handleLinkClick("establecimientos")}
                  >
                    Establecimientos
                  </a>
                  <a
                    href="/top"
                    className={`block md:px-2 md:py-1 px-3 py-1 rounded-3xl transition duration-200 text-sm ${
                      activeLink === "top"
                        ? "bg-[#254A5D] text-white"
                        : "text-gray-700 hover:bg-[#254A5D] hover:text-white"
                    }`}
                    onClick={() => handleLinkClick("top")}
                  >
                    Top
                  </a>
                  <a
                    href="/promociones"
                    className={`block md:px-2 md:py-1 px-3 py-1 rounded-3xl transition duration-200 text-sm ${
                      activeLink === "promociones"
                        ? "bg-[#254A5D] text-white"
                        : "text-gray-700 hover:bg-[#254A5D] hover:text-white"
                    }`}
                    onClick={() => handleLinkClick("promociones")}
                  >
                    Promociones
                  </a>
                  <a
                    href="/asociate"
                    className={`block md:px-2 md:py-1 px-3 py-1 text-white rounded-3xl transition duration-200 text-sm ${
                      activeLink === "asociate"
                        ? "bg-gradient-to-r from-[#49C581] via-[#37c6a6] to-[#00f0b5] shadow-lg transform scale-105"
                        : "bg-gradient-to-r from-[#37c6a6] via-[#00f0b5] to-[#49C581] hover:shadow-xl hover:scale-105"
                    }`}
                    onClick={() => handleLinkClick("asociate")}
                  >
                    ¡Asóciate ya!
                  </a>
                </>
              )}

              {/* Admin-specific navigation items */}
              {isAdmin && (
                <>
                  <a
                    href="/admin/tipos"
                    className={`block md:px-2 md:py-1 px-3 py-1 rounded-3xl transition duration-200 text-sm ${
                      activeLink === "tipos"
                        ? "bg-[#254A5D] text-white"
                        : "text-gray-700 hover:bg-[#254A5D] hover:text-white"
                    }`}
                    onClick={() => handleLinkClick("tipos")}
                  >
                    Tipos
                  </a>
                  <a
                    href="/admin/categorias"
                    className={`block md:px-2 md:py-1 px-3 py-1 rounded-3xl transition duration-200 text-sm ${
                      activeLink === "categorias"
                        ? "bg-[#254A5D] text-white"
                        : "text-gray-700 hover:bg-[#254A5D] hover:text-white"
                    }`}
                    onClick={() => handleLinkClick("categorias")}
                  >
                    Categorias
                  </a>
                  <a
                    href="/admin/usuarios"
                    className={`block md:px-2 md:py-1 px-3 py-1 rounded-3xl transition duration-200 text-sm ${
                      activeLink === "usuarios"
                        ? "bg-[#254A5D] text-white"
                        : "text-gray-700 hover:bg-[#254A5D] hover:text-white"
                    }`}
                    onClick={() => handleLinkClick("usuarios")}
                  >
                    Gestionar Usuarios
                  </a>
                  <a
                    href="/admin/establecimientos"
                    className={`block md:px-2 md:py-1 px-3 py-1 rounded-3xl transition duration-200 text-sm ${
                      activeLink === "establecimientos-admin"
                        ? "bg-[#254A5D] text-white"
                        : "text-gray-700 hover:bg-[#254A5D] hover:text-white"
                    }`}
                    onClick={() => handleLinkClick("establecimientos-admin")}
                  >
                    Establecimientos
                  </a>
                </>
              )}

              {/* Business Owner specific navigation items (compact visuals only) */}
              {isBusinessOwner && (
                <div className="relative group">
                  <button className="md:px-2 md:py-1 px-3 py-1 rounded-3xl transition duration-200 text-gray-700 hover:bg-[#254A5D] hover:text-white flex items-center text-sm">
                    Mi Negocio
                    <svg
                      className="w-3 h-3 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 z-10 hidden group-hover:block">
                    <a
                      href="/negocio/dashboard"
                      className="block px-3 py-2 text-gray-700 hover:bg-[#254A5D] hover:text-white"
                      onClick={() => handleLinkClick("negocio-dashboard")}
                    >
                      Dashboard
                    </a>
                    <a
                      href="/negocio/reservas"
                      className="block px-3 py-2 text-gray-700 hover:bg-[#254A5D] hover:text-white"
                      onClick={() => handleLinkClick("negocio-reservas")}
                    >
                      Gestionar Reservas
                    </a>
                    <a
                      href="/negocio/promociones"
                      className="block px-3 py-2 text-gray-700 hover:bg-[#254A5D] hover:text-white"
                      onClick={() => handleLinkClick("negocio-promociones")}
                    >
                      Mis Promociones
                    </a>
                    <a
                      href="/negocio/estadisticas"
                      className="block px-3 py-2 text-gray-700 hover:bg-[#254A5D] hover:text-white"
                      onClick={() => handleLinkClick("negocio-estadisticas")}
                    >
                      Estadísticas
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Center: Logo */}
            <div className="flex flex-col items-center md:flex-grow md:items-center">
              <img
                src="/log.png"
                alt="Logo Noka"
                className="max-w-[150px] h-auto mb-1 transform scale-125"
              />
            </div>

            {/* Right: Search and actions */}
            <div className="flex items-center space-x-3">
              {/* Search button (mobile) */}
              <button
                ref={searchButtonRef}
                className="md:hidden text-gray-700 hover:text-teal-700 focus:outline-none"
                onClick={toggleSearch}
                aria-label="Toggle search"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* Search bar (desktop) */}
              <div className="hidden md:block relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar establecimientos..."
                  className="border rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                <svg
                  className="absolute left-3 top-2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                {/* Search results dropdown (desktop) */}
                {(searchResults.length > 0 || isSearching) && (
                  <div
                    ref={searchDropdownRef}
                    className="absolute left-0 mt-2 w-[320px] bg-white shadow-lg rounded-md py-1 z-20"
                  >
                    {isSearching && (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Buscando...
                      </div>
                    )}
                    {searchResults.map((item) => (
                      <button
                        key={item._id}
                        onClick={() => goToEstablecimiento(item._id)}
                        className="w-full flex items-center px-3 py-2 hover:bg-gray-100 text-left"
                      >
                        <img
                          src={
                            item.portada
                              ? `https://back-salubridad.sistemasudh.com/uploads/${item.portada}`
                              : "https://via.placeholder.com/600x400?text=Imagen+no+disponible"
                          }
                          alt={item.nombre}
                          className="w-10 h-10 rounded-md object-cover mr-3"
                        />
                        <div className="truncate">
                          <div className="text-sm font-medium text-gray-800">
                            {item.nombre}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.categorias?.map((cat) => (
                              <span
                                key={cat._id}
                                className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full"
                              >
                                {cat.nombre}
                              </span>
                            ))}
                            {item.tipos?.map((tipo) => (
                              <span
                                key={tipo._id}
                                className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full"
                              >
                                {tipo.tipo_nombre}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Welcome message with role indicator */}
              {user && user.nombreUsuario ? (
                <div className="hidden md:flex items-center">
                  <span className="text-gray-700 font-medium">
                    Hola, {user.nombreUsuario}
                  </span>
                  {isAdmin && (
                    <span className="ml-2 bg-[#254A5D] text-white text-xs px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                  {isBusinessOwner && (
                    <span className="ml-2 bg-[#2A9D8F] text-white text-xs px-2 py-1 rounded-full">
                      Propietario
                    </span>
                  )}
                </div>
              ) : (
                <button className="hidden md:block text-gray-700 font-medium hover:text-teal-700 focus:outline-none">
                  Hola, Bienvenido
                </button>
              )}

              {/* User account with dropdown */}
              <div className="relative">
                <button
                  ref={userMenuButtonRef}
                  className="text-gray-700 hover:text-teal-700 focus:outline-none"
                  onClick={toggleUserMenu}
                  aria-label="Toggle user menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>

                {/* User menu dropdown */}
                {isUserMenuOpen && (
                  <div
                    ref={userMenuRef}
                    className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md py-2 z-10"
                  >
                    {/* Si el usuario no está autenticado, muestra las opciones de inicio de sesión y registro */}
                    {!user ? (
                      <>
                        <a
                          href="/login"
                          className="block px-4 py-2 text-gray-700 hover:bg-[#254A5D] hover:text-white rounded-3xl transition duration-200 mx-2"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Iniciar Sesión
                        </a>
                        <a
                          href="/registro"
                          className="block px-4 py-2 text-gray-700 hover:bg-[#254A5D] hover:text-white rounded-3xl transition duration-200 mx-2"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Registrarse
                        </a>
                      </>
                    ) : (
                      <>
                        {/* User info section */}
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm font-semibold text-gray-800">
                            {user.nombreUsuario}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <div className="mt-1">
                            {isAdmin && (
                              <span className="bg-[#254A5D] text-white text-xs px-2 py-0.5 rounded-full">
                                Administrador
                              </span>
                            )}
                            {isBusinessOwner && (
                              <span className="bg-[#2A9D8F] text-white text-xs px-2 py-0.5 rounded-full">
                                Propietario
                              </span>
                            )}
                            {!isAdmin && !isBusinessOwner && (
                              <span className="bg-[#E9C46A] text-gray-800 text-xs px-2 py-0.5 rounded-full">
                                Usuario
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Common user options */}
                        {/* Mostrar opciones de usuario sólo si NO es admin */}
                        {!isAdmin && (
                          <>
                            <a
                              href="/perfil"
                              className="block px-4 py-2 text-gray-700 hover:bg-[#254A5D] hover:text-white rounded-3xl transition duration-200 mx-2"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              Mi Perfil
                            </a>

                            {/* Business Owner specific options */}
                            {isBusinessOwner && (
                              <>
                                <hr className="my-2 border-gray-200" />
                                <div className="px-4 py-1 text-sm text-gray-500">
                                  Mi Negocio
                                </div>
                                <a
                                  href="/negocio/dashboard"
                                  className="block px-4 py-2 text-gray-700 hover:bg-[#254A5D] hover:text-white rounded-3xl transition duration-200 mx-2"
                                  onClick={() => setIsUserMenuOpen(false)}
                                >
                                  Dashboard
                                </a>
                                <a
                                  href="/negocio/reservas"
                                  className="block px-4 py-2 text-gray-700 hover:bg-[#254A5D] hover:text-white rounded-3xl transition duration-200 mx-2"
                                  onClick={() => setIsUserMenuOpen(false)}
                                >
                                  Gestionar Reservas
                                </a>
                                <a
                                  href="/negocio/promociones"
                                  className="block px-4 py-2 text-gray-700 hover:bg-[#254A5D] hover:text-white rounded-3xl transition duration-200 mx-2"
                                  onClick={() => setIsUserMenuOpen(false)}
                                >
                                  Mis Promociones
                                </a>
                                <a
                                  href="/negocio/estadisticas"
                                  className="block px-4 py-2 text-gray-700 hover:bg-[#254A5D] hover:text-white rounded-3xl transition duration-200 mx-2"
                                  onClick={() => setIsUserMenuOpen(false)}
                                >
                                  Estadísticas
                                </a>
                              </>
                            )}
                          </>
                        )}
                        {/* Admin-specific options */}
                        {isAdmin && (
                          <>
                            <hr className="my-2 border-gray-200" />
                            <div className="px-4 py-1 text-sm text-gray-500">
                              Administración
                            </div>
                            <a
                              href="/admin/tipos"
                              className="block px-4 py-2 text-gray-700 hover:bg-[#254A5D] hover:text-white rounded-3xl transition duration-200 mx-2"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              Tipos
                            </a>
                            <a
                              href="/admin/categorias"
                              className="block px-4 py-2 text-gray-700 hover:bg-[#254A5D] hover:text-white rounded-3xl transition duration-200 mx-2"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              Categorias
                            </a>
                            <a
                              href="/admin/usuarios"
                              className="block px-4 py-2 text-gray-700 hover:bg-[#254A5D] hover:text-white rounded-3xl transition duration-200 mx-2"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              Gestionar Usuarios
                            </a>
                            <a
                              href="/admin/establecimientos"
                              className="block px-4 py-2 text-gray-700 hover:bg-[#254A5D] hover:text-white rounded-3xl transition duration-200 mx-2"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              Gestionar Establecimientos
                            </a>
                          </>
                        )}

                        <hr className="my-2 border-gray-200" />
                        <a
                          href="#logout"
                          onClick={(e) => {
                            e.preventDefault();
                            logout(); // Llama a la función de logout del contexto
                            setIsUserMenuOpen(false);
                          }}
                          className="block py-1.5 px-3 text-white bg-[#F8485E] hover:bg-[#d93a4e] rounded-3xl transition duration-200 mx-2 my-1"
                        >
                          Cerrar Sesión
                        </a>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="user-actions">
                {user && <NotificacionesComponent usuarioId={user._id} />}
              </div>
            </div>
          </div>

          {/* Mobile search (expanded) */}
          {isSearchOpen && (
            <div ref={searchRef} className="mt-4 md:hidden">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar establecimientos..."
                  className="w-full border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                <svg
                  className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                {/* Mobile results (cuando está abierto el search) */}
                {(searchResults.length > 0 || isSearching) && (
                  <div className="mt-2 bg-white rounded-md shadow py-1 max-h-60 overflow-y-auto z-50">
                    {isSearching && (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Buscando...
                      </div>
                    )}
                    {searchResults.map((item) => (
                      <a
                        key={item._id}
                        href={`/establecimientodetalle/${item._id}`}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onClick={() => {
                          // dejar que la navegación nativa suceda antes de limpiar el estado
                          setTimeout(() => {
                            setSearchResults([]);
                            setSearchQuery("");
                            setIsSearching(false);
                            setIsSearchOpen(false);
                          }, 250);
                        }}
                        className="w-full flex items-center px-3 py-2 hover:bg-gray-100 text-left border-b border-gray-100 last:border-b-0"
                      >
                        <img
                          src={
                            item.portada
                              ? `https://back-salubridad.sistemasudh.com/uploads/${item.portada}`
                              : "https://via.placeholder.com/600x400?text=Imagen+no+disponible"
                          }
                          alt={item.nombre}
                          className="w-10 h-10 rounded-md object-cover mr-3"
                        />
                        <div className="truncate">
                          <div className="text-sm font-medium text-gray-800">
                            {item.nombre}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.categorias?.map((cat) => (
                              <span
                                key={cat._id}
                                className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full"
                              >
                                {cat.nombre}
                              </span>
                            ))}
                            {item.tipos?.map((tipo) => (
                              <span
                                key={tipo._id}
                                className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full"
                              >
                                {tipo.tipo_nombre}
                              </span>
                            ))}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu (expanded) */}
          {isMenuOpen && (
            <div ref={menuRef} className="mt-4 pb-4 md:hidden">
              <a
                href="/"
                className={`block py-1.5 px-3 rounded-3xl transition duration-200 mx-2 my-1 ${
                  activeLink === "inicio"
                    ? "bg-[#254A5D] text-white"
                    : "text-gray-700 hover:bg-[#254A5D] hover:text-white"
                }`}
                onClick={() => handleLinkClick("inicio")}
              >
                Inicio
              </a>
              <a
                href="/establecimientos"
                className={`block py-1.5 px-3 rounded-3xl transition duration-200 mx-2 my-1 ${
                  activeLink === "establecimientos"
                    ? "bg-[#254A5D] text-white"
                    : "text-gray-700 hover:bg-[#254A5D] hover:text-white"
                }`}
                onClick={() => handleLinkClick("establecimientos")}
              >
                Establecimientos
              </a>
              <a
                href="/top"
                className={`block py-1.5 px-3 rounded-3xl transition duration-200 mx-2 my-1 ${
                  activeLink === "top"
                    ? "bg-[#254A5D] text-white"
                    : "text-gray-700 hover:bg-[#254A5D] hover:text-white"
                }`}
                onClick={() => handleLinkClick("top")}
              >
                Top
              </a>
              <a
                href="/promociones"
                className={`block py-1.5 px-3 rounded-3xl transition duration-200 mx-2 my-1 ${
                  activeLink === "promociones"
                    ? "bg-[#254A5D] text-white"
                    : "text-gray-700 hover:bg-[#254A5D] hover:text-white"
                }`}
                onClick={() => handleLinkClick("promociones")}
              >
                Promociones
              </a>
              <a
                href="/asociate"
                className={`block py-3 px-6 rounded-full font-semibold text-white text-lg transition-all duration-300 mx-2 my-1
    ${
      activeLink === "asociate"
        ? "bg-gradient-to-r from-[#49C581] via-[#37c6a6] to-[#00f0b5] shadow-lg transform scale-105"
        : "bg-gradient-to-r from-[#37c6a6] via-[#00f0b5] to-[#49C581] hover:shadow-xl hover:scale-105"
    }`}
                onClick={() => handleLinkClick("asociate")}
              >
                ¡Asóciate ya!
              </a>

              {/* Business Owner specific options in mobile menu */}
              {isBusinessOwner && (
                <>
                  <div className="my-2 border-t border-gray-200 pt-2">
                    <div className="mx-2 text-sm text-gray-500 mb-1">
                      Mi Negocio
                    </div>
                  </div>
                  <a
                    href="/negocio/dashboard"
                    className={`block py-1.5 px-3 rounded-3xl transition duration-200 mx-2 my-1 ${
                      activeLink === "negocio-dashboard"
                        ? "bg-[#2A9D8F] text-white"
                        : "text-gray-700 hover:bg-[#2A9D8F] hover:text-white"
                    }`}
                    onClick={() => setActiveLink("negocio-dashboard")}
                  >
                    Dashboard
                  </a>
                  <a
                    href="/negocio/reservas"
                    className={`block py-1.5 px-3 rounded-3xl transition duration-200 mx-2 my-1 ${
                      activeLink === "negocio-reservas"
                        ? "bg-[#2A9D8F] text-white"
                        : "text-gray-700 hover:bg-[#2A9D8F] hover:text-white"
                    }`}
                    onClick={() => setActiveLink("negocio-reservas")}
                  >
                    Gestionar Reservas
                  </a>
                  <a
                    href="/negocio/promociones"
                    className={`block py-1.5 px-3 rounded-3xl transition duration-200 mx-2 my-1 ${
                      activeLink === "negocio-promociones"
                        ? "bg-[#2A9D8F] text-white"
                        : "text-gray-700 hover:bg-[#2A9D8F] hover:text-white"
                    }`}
                    onClick={() => setActiveLink("negocio-promociones")}
                  >
                    Mis Promociones
                  </a>
                  <a
                    href="/negocio/estadisticas"
                    className={`block py-1.5 px-3 rounded-3xl transition duration-200 mx-2 my-1 ${
                      activeLink === "negocio-estadisticas"
                        ? "bg-[#2A9D8F] text-white"
                        : "text-gray-700 hover:bg-[#2A9D8F] hover:text-white"
                    }`}
                    onClick={() => setActiveLink("negocio-estadisticas")}
                  >
                    Estadísticas
                  </a>
                </>
              )}

              {/* Admin options in mobile menu */}
              {isAdmin && (
                <>
                  <div className="my-2 border-t border-gray-200 pt-2">
                    <div className="mx-2 text-sm text-gray-500 mb-1">
                      Administración
                    </div>
                  </div>
                  <a
                    href="/admin/tipos"
                    className={`block py-1.5 px-3 rounded-3xl transition duration-200 mx-2 my-1 ${
                      activeLink === "tipos"
                        ? "bg-[#254A5D] text-white"
                        : "text-gray-700 hover:bg-[#254A5D] hover:text-white"
                    }`}
                    onClick={() => setActiveLink("tipos")}
                  >
                    Tipos
                  </a>
                  <a
                    href="/admin/categorias"
                    className={`block py-1.5 px-3 rounded-3xl transition duration-200 mx-2 my-1 ${
                      activeLink === "categorias"
                        ? "bg-[#254A5D] text-white"
                        : "text-gray-700 hover:bg-[#254A5D] hover:text-white"
                    }`}
                    onClick={() => setActiveLink("categorias")}
                  >
                    Categorias
                  </a>
                  <a
                    href="/admin/usuarios"
                    className={`block py-1.5 px-3 rounded-3xl transition duration-200 mx-2 my-1 ${
                      activeLink === "usuarios"
                        ? "bg-[#254A5D] text-white"
                        : "text-gray-700 hover:bg-[#254A5D] hover:text-white"
                    }`}
                    onClick={() => setActiveLink("usuarios")}
                  >
                    Gestionar Usuarios
                  </a>
                  <a
                    href="/admin/establecimientos"
                    className={`block py-1.5 px-3 rounded-3xl transition duration-200 mx-2 my-1 ${
                      activeLink === "establecimientos-admin"
                        ? "bg-[#254A5D] text-white"
                        : "text-gray-700 hover:bg-[#254A5D] hover:text-white"
                    }`}
                    onClick={() => setActiveLink("establecimientos-admin")}
                  >
                    Gestionar Establecimientos
                  </a>
                  <a
                    href="/admin/promociones"
                    className={`block py-1.5 px-3 rounded-3xl transition duration-200 mx-2 my-1 ${
                      activeLink === "promociones"
                        ? "bg-[#254A5D] text-white"
                        : "text-gray-700 hover:bg-[#254A5D] hover:text-white"
                    }`}
                    onClick={() => setActiveLink("promociones")}
                  >
                    Promociones
                  </a>
                </>
              )}

              <div className="my-2 border-t border-gray-200 pt-2">
                {user && (
                  <>
                    {/* Mostrar "Mi Perfil" sólo si NO es admin */}
                    {!isAdmin && (
                      <a
                        href="/perfil"
                        className={`block py-1.5 px-3 rounded-3xl transition duration-200 mx-2 my-1 ${
                          activeLink === "perfil"
                            ? "bg-[#254A5D] text-white"
                            : "text-gray-700 hover:bg-[#254A5D] hover:text-white"
                        }`}
                        onClick={() => setActiveLink("perfil")}
                      >
                        Mi Perfil
                      </a>
                    )}

                    <a
                      href="#logout"
                      onClick={(e) => {
                        e.preventDefault();
                        logout();
                      }}
                      className="block py-1.5 px-3 text-white bg-[#F8485E] hover:bg-[#d93a4e] rounded-3xl transition duration-200 mx-2 my-1"
                    >
                      Cerrar Sesión
                    </a>
                  </>
                )}
                {!user && (
                  <>
                    <a
                      href="/login"
                      className="block py-1.5 px-3 text-gray-700 hover:bg-[#254A5D] hover:text-white rounded-3xl transition duration-200 mx-2 my-1"
                    >
                      Iniciar Sesión
                    </a>
                    <a
                      href="/registro"
                      className="block py-1.5 px-3 text-gray-700 hover:bg-[#254A5D] hover:text-white rounded-3xl transition duration-200 mx-2 my-1"
                    >
                      Registrarse
                    </a>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
