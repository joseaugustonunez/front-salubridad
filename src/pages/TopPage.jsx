import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, Navigation, ExternalLink, Star } from "lucide-react";
import { obtenerEstablecimientosAprobados } from "../api/establecimientos";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Configurar iconos de Leaflet usando CDN
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Icono personalizado para la ubicación del usuario
const userLocationIcon = new L.DivIcon({
  className: "custom-user-marker",
  html: `
    <div style="position: relative;">
      <div style="
        width: 30px;
        height: 30px;
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.6);
      "></div>
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        background: rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        animation: pulse 2s infinite;
      "></div>
      <style>
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.5;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      </style>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Componente para centrar el mapa
const CenterMapOnPosition = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { animate: true, duration: 1.5 });
    }
  }, [map, position]);
  return null;
};

const colors = {
  primary: "#49C581",
  secondary: "#337179",
  dark: "#254A5D",
};

// Componente para mostrar estrellas
const RatingStars = ({ rating, size = 14 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star key={i} size={size} className="text-yellow-400 fill-yellow-400" />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <Star
          key={i}
          size={size}
          className="text-yellow-400 fill-yellow-400 opacity-50"
        />
      );
    } else {
      stars.push(<Star key={i} size={size} className="text-gray-300" />);
    }
  }

  return <div className="flex">{stars}</div>;
};

const TopPage = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [establecimientos, setEstablecimientos] = useState([]);
  const [filteredEstablecimientos, setFilteredEstablecimientos] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([-9.930833, -76.242222]); // Huánuco, Perú
  const [searching, setSearching] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [showFiltered, setShowFiltered] = useState(false);
  const [mapKey, setMapKey] = useState(0); // Para forzar re-render del mapa
  const [routes, setRoutes] = useState({}); // Almacenar rutas calculadas
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const searchRadiusMeters = 3000; // Reducido a 3km para una búsqueda más precisa

  useEffect(() => {
    // Cargar todos los establecimientos al inicio
    const fetchEstablecimientos = async () => {
      try {
        const data = await obtenerEstablecimientosAprobados();
        setEstablecimientos(data);
        setFilteredEstablecimientos(data);
      } catch (error) {
        console.error("Error al cargar los establecimientos:", error);
      }
    };

    fetchEstablecimientos();
  }, []);

  // Invalidar tamaño del mapa cuando se monta
  useEffect(() => {
    if (mapRef.current) {
      const timer = setTimeout(() => {
        try {
          mapRef.current.invalidateSize();
        } catch (e) {
          console.log("Error al invalidar el tamaño del mapa:", e);
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [mapKey]);

  // Manejar cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        try {
          mapRef.current.invalidateSize();
        } catch (e) {
          console.log("Error resize:", e);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Haversine para distancia en metros
  const getDistanceMeters = (lat1, lon1, lat2, lon2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Función para obtener ruta real usando OSRM (OpenStreetMap Routing Machine)
  const getRouteFromOSRM = async (start, end) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === "Ok" && data.routes && data.routes.length > 0) {
        // Convertir coordenadas de [lon, lat] a [lat, lon] para Leaflet
        const coordinates = data.routes[0].geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);
        return coordinates;
      }
      return null;
    } catch (error) {
      console.error("Error al obtener ruta:", error);
      return null;
    }
  };

  // Calcular rutas para todos los establecimientos cercanos
  const calculateRoutes = async (userPos, establecimientos) => {
    setLoadingRoutes(true);
    const newRoutes = {};

    for (const establecimiento of establecimientos) {
      const lat = establecimiento.ubicacion?.[0]?.coordenadas?.latitud;
      const lon = establecimiento.ubicacion?.[0]?.coordenadas?.longitud;
      if (lat == null || lon == null) continue;

      const route = await getRouteFromOSRM(userPos, [lat, lon]);
      if (route) {
        newRoutes[establecimiento._id] = route;
      }
    }

    setRoutes(newRoutes);
    setLoadingRoutes(false);
  };

  const buscarLugaresCercanos = () => {
    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalización");
      return;
    }

    setSearching(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userPos = [latitude, longitude];
        setUserLocation(userPos);
        setMapCenter(userPos);
        setMapKey((prev) => prev + 1); // Forzar re-render del mapa

        // Filtrar establecimientos dentro del radio
        const cercanos = establecimientos.filter((establecimiento) => {
          const lat = establecimiento.ubicacion?.[0]?.coordenadas?.latitud;
          const lon = establecimiento.ubicacion?.[0]?.coordenadas?.longitud;
          if (lat == null || lon == null) return false;
          const dist = getDistanceMeters(latitude, longitude, lat, lon);
          return dist <= searchRadiusMeters;
        });

        setFilteredEstablecimientos(cercanos);
        setSearching(false);
        setShowFiltered(true);

        // Calcular rutas reales por carretera
        if (cercanos.length > 0) {
          calculateRoutes(userPos, cercanos);
        }
      },
      (error) => {
        setSearching(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Permiso de ubicación denegado");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Ubicación no disponible");
            break;
          case error.TIMEOUT:
            setLocationError("Tiempo de espera agotado");
            break;
          default:
            setLocationError("Error al obtener ubicación");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const mostrarTodos = () => {
    setShowFiltered(false);
    setFilteredEstablecimientos(establecimientos);
    setUserLocation(null);
    setRoutes({}); // Limpiar rutas
    setMapCenter([-9.930833, -76.242222]); // Huánuco, Perú
    setMapKey((prev) => prev + 1); // Forzar re-render del mapa
  };

  const goToEstablecimientoDetail = (id) => {
    navigate(`/establecimientodetalle/${id}`);
  };

  // Decidir qué establecimientos mostrar en el mapa
  const establecimientosToShow = showFiltered
    ? filteredEstablecimientos
    : establecimientos;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header - Siempre visible con padding-top para el navbar flotante */}
      <div
        className="pt-32 sm:pt-36 pb-10 sm:pb-12 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.secondary} 50%, ${colors.primary} 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Encuentra{" "}
              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Lugares Cercanos
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 px-4"
            >
              Descubre establecimientos cerca de tu ubicación
            </motion.p>

            {/* Botones de búsqueda */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center gap-4 flex-wrap"
            >
              <button
                onClick={buscarLugaresCercanos}
                disabled={searching || loadingRoutes}
                className="flex items-center gap-3 px-8 py-4 bg-white text-gray-800 rounded-full font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {searching || loadingRoutes ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#49C581]"></div>
                    <span>
                      {searching ? "Buscando..." : "Calculando rutas..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Navigation size={24} className="text-[#49C581]" />
                    <span>Buscar Lugares Cerca</span>
                  </>
                )}
              </button>

              {showFiltered && (
                <button
                  onClick={mostrarTodos}
                  className="flex items-center gap-3 px-8 py-4 bg-white/90 text-gray-800 rounded-full font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                >
                  <MapPin size={24} className="text-[#337179]" />
                  <span>Mostrar Todos</span>
                </button>
              )}
            </motion.div>

            {/* Mensaje de error */}
            {locationError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg inline-block"
              >
                {locationError}
              </motion.div>
            )}

            {/* Estadísticas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <div className="text-xl font-bold text-white">
                  {showFiltered
                    ? filteredEstablecimientos.length
                    : establecimientos.length}
                </div>
                <div className="text-sm text-white/80">
                  {showFiltered ? "Lugares Cercanos" : "Lugares Disponibles"}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-60 h-60 rounded-full opacity-10 bg-white/20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 bg-white/20 -ml-20 -mb-20"></div>
      </div>

      {/* Contenedor del Mapa y Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full relative z-0">
        <div className="flex gap-4 h-[500px] sm:h-[600px] lg:h-[700px]">
          {/* Panel lateral de establecimientos */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block w-80 overflow-y-auto rounded-2xl bg-white shadow-xl border border-gray-200 p-4 space-y-3"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 sticky top-0 bg-white pb-2 border-b">
              {showFiltered
                ? `Cerca de ti (${filteredEstablecimientos.length})`
                : `Todos los lugares (${establecimientos.length})`}
            </h2>

            {establecimientosToShow.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MapPin size={48} className="mx-auto mb-2 opacity-30" />
                <p>No hay establecimientos</p>
              </div>
            ) : (
              establecimientosToShow.map((establecimiento) => {
                const lat =
                  establecimiento.ubicacion?.[0]?.coordenadas?.latitud;
                const lon =
                  establecimiento.ubicacion?.[0]?.coordenadas?.longitud;

                // Calcular distancia si hay ubicación del usuario
                let distancia = null;
                if (userLocation && lat != null && lon != null) {
                  const distMeters = getDistanceMeters(
                    userLocation[0],
                    userLocation[1],
                    lat,
                    lon
                  );
                  distancia =
                    distMeters < 1000
                      ? `${Math.round(distMeters)} m`
                      : `${(distMeters / 1000).toFixed(1)} km`;
                }

                return (
                  <motion.div
                    key={establecimiento._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100"
                    onClick={() => {
                      // centrar mapa en el establecimiento y abrir popup
                      const latC =
                        establecimiento.ubicacion?.[0]?.coordenadas?.latitud;
                      const lonC =
                        establecimiento.ubicacion?.[0]?.coordenadas?.longitud;
                      if (latC != null && lonC != null) {
                        setMapCenter([latC, lonC]);
                        setTimeout(() => {
                          try {
                            if (mapRef.current) mapRef.current.invalidateSize();
                          } catch (e) {}
                        }, 120);
                      }
                      goToEstablecimientoDetail(establecimiento._id);
                    }}
                  >
                    {establecimiento.portada && (
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={`https://back-salubridad.sistemasudh.com/uploads/${establecimiento.portada}`}
                          alt={establecimiento.nombre}
                          className="w-full h-full object-cover"
                        />
                        {distancia && (
                          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-md flex items-center gap-1">
                            <Navigation size={12} />
                            {distancia}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-3">
                      <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">
                        {establecimiento.nombre}
                      </h3>
                      <div className="flex items-center mb-2">
                        <RatingStars
                          rating={parseFloat(
                            establecimiento.promedioCalificaciones || "0"
                          )}
                          size={12}
                        />
                        <span className="ml-2 text-xs text-gray-600">
                          ({establecimiento.promedioCalificaciones || "0"})
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {establecimiento.descripcion}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>

          {/* Mapa */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-1 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 relative z-0"
          >
            <MapContainer
              key={mapKey}
              center={mapCenter}
              zoom={13}
              ref={mapRef}
              style={{ width: "100%", height: "100%" }}
              zoomControl={true}
              scrollWheelZoom={true}
              whenReady={() => {
                setTimeout(() => {
                  if (mapRef.current) {
                    try {
                      mapRef.current.invalidateSize();
                    } catch (e) {}
                  }
                }, 100);
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Círculo, rutas y marcador usuario (si existe) */}
              {userLocation && (
                <>
                  <Circle
                    center={userLocation}
                    radius={searchRadiusMeters}
                    pathOptions={{
                      color: "#3b82f6",
                      fillColor: "#3b82f6",
                      fillOpacity: 0.08,
                      weight: 2,
                      dashArray: "10, 10",
                      opacity: 0.6,
                    }}
                  />

                  {showFiltered &&
                    Object.entries(routes).map(([id, routeCoordinates]) => {
                      if (!routeCoordinates || routeCoordinates.length === 0)
                        return null;
                      return (
                        <Polyline
                          key={`route-${id}`}
                          positions={routeCoordinates}
                          pathOptions={{
                            color: "#49C581",
                            weight: 4,
                            opacity: 0.8,
                            lineJoin: "round",
                            lineCap: "round",
                          }}
                        />
                      );
                    })}

                  <Marker position={userLocation} icon={userLocationIcon}>
                    <Popup>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                          <strong className="text-blue-600">
                            Tu ubicación
                          </strong>
                        </div>
                        <p className="text-sm text-gray-600">Estás aquí</p>
                        <p className="text-xs text-gray-500 mt-1 font-semibold">
                          Radio de búsqueda: {searchRadiusMeters / 1000} km
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                </>
              )}

              {/* Marcadores de establecimientos */}
              {establecimientosToShow.map((establecimiento) => {
                const lat =
                  establecimiento.ubicacion?.[0]?.coordenadas?.latitud;
                const lon =
                  establecimiento.ubicacion?.[0]?.coordenadas?.longitud;
                if (lat == null || lon == null) return null;

                return (
                  <Marker key={establecimiento._id} position={[lat, lon]}>
                    <Popup maxWidth={300}>
                      <div className="p-2">
                        {establecimiento.portada && (
                          <img
                            src={`https://back-salubridad.sistemasudh.com/uploads/${establecimiento.portada}`}
                            alt={establecimiento.nombre}
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                        )}
                        <h3 className="font-bold text-gray-800 mb-2">
                          {establecimiento.nombre}
                        </h3>
                        <div className="flex items-center mb-2">
                          <RatingStars
                            rating={parseFloat(
                              establecimiento.promedioCalificaciones || "0"
                            )}
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            ({establecimiento.promedioCalificaciones || "0"})
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {establecimiento.descripcion}
                        </p>
                        <button
                          onClick={() =>
                            goToEstablecimientoDetail(establecimiento._id)
                          }
                          className="w-full bg-[#49C581] text-white py-2 px-4 rounded-lg hover:bg-[#3db570] transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          Ver detalles
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              <CenterMapOnPosition position={mapCenter} />
            </MapContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TopPage;
