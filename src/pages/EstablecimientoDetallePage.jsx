import { useState, useEffect } from "react";
import {
  FaStar,
  FaRegStar,
  FaMapMarkerAlt,
  FaClock,
  FaHeart,
  FaRegHeart,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaShare,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";
import { SiTiktok } from 'react-icons/si';
import { MdOutlineVerified } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { MdComment, MdOutlineLocalOffer } from "react-icons/md";
import { BiSolidTimeFive } from "react-icons/bi";
import { IoShareSocialOutline } from "react-icons/io5";
import {
  obtenerEstablecimientoPorId,
  seguirEstablecimiento,
  dejarDeSeguirEstablecimiento,
  likeEstablecimiento,
  quitarLikeEstablecimiento,
} from "../api/establecimientos";
import { obtenerPromocionesPorEstablecimiento } from "../api/promociones";
import { crearComentario } from "../api/comentario";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Star, Heart, Users } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaSmile, FaImage, FaPaperPlane } from "react-icons/fa";
delete L.Icon.Default.prototype._getIconUrl;
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import toast from "react-hot-toast";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
const iconos = {
  facebook: <FaFacebook size={20} />,
  instagram: <FaInstagram size={20} />,
  twitter: <FaTwitter size={20} />,
  youtube: <FaYoutube size={20} />,
  tiktok: <SiTiktok size={20} />,
};

const estilos = {
  facebook: "bg-blue-50 text-blue-700",
  instagram: "bg-pink-50 text-pink-700",
  twitter: "bg-blue-50 text-blue-500",
  youtube: "bg-red-50 text-red-700",
  tiktok: "bg-black text-white",
};
const toggleShareOptions = () => {
  setShowShareOptions(!showShareOptions);
};
// Componentes UI
const Button = ({ children, primary, secondary, onClick, className = "" }) => {
  const baseClasses =
    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all";
  const colorClasses = primary
    ? "bg-[#49C581] hover:bg-opacity-90 text-white"
    : secondary
      ? "bg-[#337179] hover:bg-opacity-90 text-white"
      : "bg-gray-100 hover:bg-gray-200 text-[#254A5D]";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${colorClasses} ${className}`}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, className = "" }) => (
  <span
    className={`text-xs px-2 py-1 rounded-full bg-[#37a6ca] bg-opacity-20 text-[#254A5D] font-medium ${className}`}
  >
    {children}
  </span>
);

// Componente para las reseñas
const Review = ({ author, date, rating, comment, avatar }) => (
  <div className="border-b border-gray-100 py-4">
    <div className="flex gap-3">
      {avatar ? (
        <img
          src={avatar}
          alt={author}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-[#515fff] text-white flex items-center justify-center font-semibold">
          {(author && author.charAt(0).toUpperCase()) || "?"}
        </div>
      )}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-medium text-[#254A5D]">{author}</h4>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
        <div className="flex gap-1 mb-2">
          {[...Array(5)].map((_, i) =>
            i < rating ? (
              <FaStar key={i} className="text-amber-400 text-sm" />
            ) : (
              <FaRegStar key={i} className="text-gray-300 text-sm" />
            )
          )}
        </div>
        <p className="text-sm text-[#254A5D]">{comment}</p>
      </div>
    </div>
  </div>
);

// Componente para el horario
const Schedule = ({ days }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm">
    <h3 className="font-medium text-lg mb-4 text-[#254A5D] flex items-center gap-2">
      <BiSolidTimeFive /> Horario
    </h3>
    <div className="space-y-2">
      {days.map((day) => (
        <div key={day.name} className="flex justify-between text-sm">
          <span
            className={`font-medium ${day.isToday ? "text-[#49C581]" : "text-[#254A5D]"
              }`}
          >
            {day.name}
          </span>
          <span className={day.closed ? "text-amber-400" : "text-gray-600"}>
            {day.closed ? "Cerrado" : `${day.open} - ${day.close}`}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// Componente principal
export default function EstablecimientoDetallePage() {
  const { id } = useParams();
  const [establecimiento, setEstablecimiento] = useState(null);
  const [likes, setLikes] = useState({});
  const [likesDados, setLikesDados] = useState([]);
  const [seguidos, setSeguidos] = useState([]);
  const [seguidores, setSeguidores] = useState({});
  const [userId, setUserId] = useState(null);
  const [liked, setLiked] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("info");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [promociones, setPromociones] = useState([]);
  useEffect(() => {
    const cargarPromociones = async () => {
      try {
        setLoading(true);
        const data = await obtenerPromocionesPorEstablecimiento(id);
        setPromociones(data);
      } catch (err) {
        setError('Error al cargar las promociones');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarPromociones();
    }
  }, [id]);
  // Función para verificar si una promoción está activa hoy
  const esPromocionHoy = (fechaInicio, fechaFin) => {
    const hoy = new Date();
    return new Date(fechaInicio) <= hoy && hoy <= new Date(fechaFin);
  };

  // Función para generar un color de gradiente aleatorio pero consistente para cada promoción
  const getGradientColors = (index) => {
    const gradients = [
      'from-[#F8485E] to-[#337179]',
      'from-[#49C581] to-[#337179]',
      'from-[#8A63FF] to-[#337179]',
      'from-[#FFBA63] to-[#337179]',
      'from-[#63B9FF] to-[#337179]',
    ];
    return gradients[index % gradients.length];
  };
  // Comprobar autenticación y cargar datos del usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsAuthenticated(true);
      try {
        const userData = JSON.parse(user);
        setUserId(userData._id || userData.id);

        // Cargar likes y seguimientos del usuario
        cargarEstadosUsuario(userData._id || userData.id);
      } catch (error) {
        console.error("Error al parsear datos de usuario:", error);
      }
    }
  }, []);

  // Cargar estados de likes y seguimientos del usuario
  const cargarEstadosUsuario = async (userId) => {
    if (!userId || !establecimiento) return;

    // Comprobar si el usuario ha dado like a este establecimiento
    const hasLiked = establecimiento.likes?.includes(userId);
    setLiked(hasLiked);

    // Comprobar si el usuario sigue a este establecimiento
    const isFollowing = establecimiento.seguidores?.includes(userId);
    setFollowed(isFollowing);
  };

  // Cargar datos del establecimiento
  useEffect(() => {
    const fetchEstablecimiento = async () => {
      try {
        setLoading(true);
        const data = await obtenerEstablecimientoPorId(id);
        setEstablecimiento(data);

        // Manejar likes y seguidores individuales
        setLikes({ [data._id]: data.likes?.length || 0 });
        setSeguidores({ [data._id]: data.seguidores?.length || 0 });

        // Verificar si el usuario ha dado like o sigue al establecimiento
        if (userId) {
          const hasLiked = data.likes?.includes(userId);
          const isFollowing = data.seguidores?.includes(userId);

          setLiked(hasLiked);
          setFollowed(isFollowing);
        }
      } catch (error) {
        setError("Error al cargar el establecimiento");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEstablecimiento();
    }
  }, [id, userId]);

  // Función para manejar likes
const handleLike = async () => {
  if (!isAuthenticated) {
    toast.error("Debes iniciar sesión para dar like");
    return;
  }

  try {
    const establecimientoId = establecimiento._id;

    if (liked) {
      // Quitar like
      await quitarLikeEstablecimiento(establecimientoId);

      setLikes((prev) => ({
        ...prev,
        [establecimientoId]: Math.max(0, (prev[establecimientoId] || 0) - 1),
      }));
      setEstablecimiento((prev) => ({
        ...prev,
        likes: prev.likes.filter((id) => id !== userId),
      }));

      toast("Quitaste tu like 👍"); // neutral
    } else {
      // Dar like
      await likeEstablecimiento(establecimientoId);

      setLikes((prev) => ({
        ...prev,
        [establecimientoId]: (prev[establecimientoId] || 0) + 1,
      }));
      setEstablecimiento((prev) => ({
        ...prev,
        likes: [...(prev.likes || []), userId],
      }));

      toast.success("¡Te gustó este establecimiento! ❤️");
    }

    setLiked(!liked);
  } catch (error) {
    console.error("Error al gestionar like:", error);
    toast.error("Hubo un problema al procesar tu solicitud");
  }
};
  // Función para manejar seguimiento
const handleFollow = async () => {
  if (!isAuthenticated) {
    toast.error("Debes iniciar sesión para seguir este establecimiento");
    return;
  }

  try {
    const establecimientoId = establecimiento._id;

    if (followed) {
      await dejarDeSeguirEstablecimiento(establecimientoId);

      setSeguidores((prev) => ({
        ...prev,
        [establecimientoId]: Math.max(0, (prev[establecimientoId] || 0) - 1),
      }));
      setEstablecimiento((prev) => ({
        ...prev,
        seguidores: prev.seguidores.filter((id) => id !== userId),
      }));

      toast("Has dejado de seguir este establecimiento 👋");
    } else {
      await seguirEstablecimiento(establecimientoId);

      setSeguidores((prev) => ({
        ...prev,
        [establecimientoId]: (prev[establecimientoId] || 0) + 1,
      }));
      setEstablecimiento((prev) => ({
        ...prev,
        seguidores: [...(prev.seguidores || []), userId],
      }));

      toast.success("Ahora sigues este establecimiento 🎉");
    }

    setFollowed(!followed);
  } catch (error) {
    console.error("Error al gestionar seguimiento:", error);
    toast.error("Hubo un problema al procesar tu solicitud");
  }
};
  // Función para abrir el modal con la imagen seleccionada
  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setSelectedImage(null);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (newRating === 0) {
    toast.error("Por favor, selecciona una calificación");
    return;
  }

  if (!mensaje.trim()) {
    toast.error("Por favor, escribe un comentario");
    return;
  }

  try {
    setIsSubmitting(true);
    setError(null);

    const usuarioString = localStorage.getItem("user");
    if (!usuarioString) {
      toast.error("Debes iniciar sesión para comentar");
      return;
    }

    const usuarioData = JSON.parse(usuarioString);
    const usuarioId = usuarioData._id;

    console.log("ID que intento usar:", id); // Debug opcional

    const nuevoComentario = {
      usuario: usuarioId,
      establecimiento: id,
      comentario: mensaje,
      calificacion: newRating,
    };

    const resultado = await crearComentario(nuevoComentario);
    console.log("Respuesta del servidor:", resultado); // Debug opcional

    // Crear objeto de comentario para la UI
    const comentarioId =
      resultado && resultado.data && resultado.data._id
        ? resultado.data._id
        : `temp-${Date.now()}`;

    const comentarioParaUI = {
      _id: comentarioId,
      usuario: {
        nombreUsuario: usuarioData.nombreUsuario || "Usuario",
        _id: usuarioId,
      },
      fecha: new Date(),
      calificacion: newRating,
      comentario: mensaje,
      perfil: usuarioData.fotoPerfil || null,
    };

    // Actualizar estado
    setEstablecimiento((prevEstado) => {
      if (!prevEstado) return prevEstado;

      const nuevosComentarios = [
        comentarioParaUI,
        ...(prevEstado.comentarios || []),
      ];

      const totalComentarios = nuevosComentarios.length;
      const sumaCalificaciones = nuevosComentarios.reduce(
        (sum, com) => sum + (com.calificacion || 0),
        0
      );
      const nuevoPromedio =
        totalComentarios > 0 ? sumaCalificaciones / totalComentarios : 0;

      return {
        ...prevEstado,
        comentarios: nuevosComentarios,
        promedioCalificaciones: parseFloat(nuevoPromedio.toFixed(1)),
      };
    });

    setMensaje("");
    setNewRating(0);
    setShowReviewForm(false);

    toast.success("¡Comentario agregado con éxito!");
  } catch (err) {
    console.error("Error al crear comentario:", err);
    toast.error(err.message || "Error al crear el comentario");
  } finally {
    setIsSubmitting(false);
  }
};
  const formatearFecha = (fechaString) => {
    if (!fechaString) return "Fecha desconocida";

    const fecha = new Date(fechaString);
    const ahora = new Date();
    const diferenciaMilisegundos = ahora - fecha;
    const diferenciaDias = Math.floor(
      diferenciaMilisegundos / (1000 * 60 * 60 * 24)
    );

    if (diferenciaDias < 1) return "hoy";
    if (diferenciaDias === 1) return "hace 1 día";
    if (diferenciaDias < 7) return `hace ${diferenciaDias} días`;
    if (diferenciaDias < 30)
      return `hace ${Math.floor(diferenciaDias / 7)} semanas`;
    if (diferenciaDias < 365)
      return `hace ${Math.floor(diferenciaDias / 30)} meses`;
    return `hace ${Math.floor(diferenciaDias / 365)} años`;
  };

  const allImages = establecimiento
    ? [
      // Include both the main image and portada if they exist
      establecimiento.imagen &&
      `https://back-salubridad.sistemasudh.com/uploads/${establecimiento.imagen}`,
      establecimiento.portada &&
      `https://back-salubridad.sistemasudh.com/uploads/${establecimiento.portada}`,
      // Include any additional images from the imagenes array
      ...(establecimiento.imagenes?.map(
        (img) => `https://back-salubridad.sistemasudh.com/uploads/${img}`
      ) || []),
    ].filter(Boolean)
    : []; // Remove any undefined/null values

  const diasTransformados =
    establecimiento?.horario?.map((h) => ({
      name: h.dia,
      open: h.entrada,
      close: h.salida,
      closed: false,
      isToday:
        new Date()
          .toLocaleDateString("es-PE", { weekday: "long" })
          .toLowerCase() === h.dia.toLowerCase(),
    })) || [];

  useEffect(() => {
    // Check if establecimiento exists, has imagenes array, and has more than 1 image
    if (
      !establecimiento ||
      !establecimiento.imagenes ||
      establecimiento.imagenes.length <= 1
    )
      return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === establecimiento.imagenes.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [establecimiento?.imagenes?.length]);

  // Navigation functions - only work if there are multiple images
  const nextImage = () => {
    if (
      !establecimiento ||
      !establecimiento.imagenes ||
      establecimiento.imagenes.length <= 1
    )
      return;
    setCurrentImageIndex((prev) =>
      prev === establecimiento.imagenes.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (
      !establecimiento ||
      !establecimiento.imagenes ||
      establecimiento.imagenes.length <= 1
    )
      return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? establecimiento.imagenes.length - 1 : prev - 1
    );
  };

  const formatNumber = (num) => {
    if (!num) return 0;
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num;
  };

  // Renderizar estrellas basado en rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FaStar key={i} className="text-amber-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStar key={i} className="text-amber-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  if (!establecimiento)
    return (
      <div className="flex justify-center items-center h-screen">
        No se encontró el establecimiento
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen">
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-full">
            {/* Botón para cerrar el modal */}
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-2 text-black z-10"
              onClick={(e) => {
                e.stopPropagation(); // Evita que el clic se propague al fondo
                closeModal();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Imagen a tamaño completo */}
            <img
              src={selectedImage}
              alt="Imagen ampliada"
              className="max-h-screen max-w-full object-contain"
              onClick={(e) => e.stopPropagation()} // Evita que el clic en la imagen cierre el modal
            />
          </div>
        </div>
      )}
      {/* Header con la imagen principal y controles de navegación */}
      <div className="relative h-72 md:h-96 bg-[#254A5D] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#254A5D] opacity-70 z-10"></div>

        {/* Image display */}
        {establecimiento.imagenes && establecimiento.imagenes.length > 0 && (
          <img
            src={`https://back-salubridad.sistemasudh.com/uploads/${establecimiento.imagenes[currentImageIndex]}`}
            alt={establecimiento.nombre}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Navigation controls - only shown if multiple images */}
        {establecimiento.imagenes && establecimiento.imagenes.length > 1 && (
          <>
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
              <button
                onClick={prevImage}
                className="bg-white bg-opacity-30 backdrop-blur-sm p-2 rounded-full"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
              <button
                onClick={nextImage}
                className="bg-white bg-opacity-30 backdrop-blur-sm p-2 rounded-full"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Position indicators - only shown if multiple images */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
              {establecimiento.imagenes.map((_, i) => (
                <button
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === currentImageIndex
                    ? "bg-white"
                    : "bg-white bg-opacity-50"
                    }`}
                  onClick={() => setCurrentImageIndex(i)}
                ></button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Tarjeta con información básica */}
        <div className="bg-white rounded-xl shadow-lg p-6 -mt-16 relative z-20 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge>
                  {(establecimiento.categoria &&
                    establecimiento.categoria[0]?.nombre) ||
                    "Sin categoría"}
                </Badge>

                <Badge className="bg-gray-100 text-gray-600">$$</Badge>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-[#254A5D] flex items-center gap-2">
                {establecimiento.nombre}
                {establecimiento.verificado && (
                  <MdOutlineVerified className="text-green-500" />
                )}
              </h1>
              <p className="text-[#337179] mb-2">
                {establecimiento.descripcion}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                {/* Calificaciones */}
                <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                  <div className="flex">
                    {renderStars(establecimiento.promedioCalificaciones || 0)}
                  </div>
                  <span className="ml-1 text-sm font-semibold text-[#254A5D]">
                    ({establecimiento.promedioCalificaciones || "0"})
                  </span>
                  <span className="text-sm text-gray-500">
                    ({establecimiento.comentarios?.length || 0} reseñas)
                  </span>
                </div>

                {/* Likes */}
                <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                  <Heart
                    size={16}
                    className={
                      liked ? "text-red-500 fill-red-500" : "text-gray-400"
                    }
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {formatNumber(likes[establecimiento._id] || 0)}
                  </span>
                </div>

                {/* Seguidores */}
                <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                  <Users size={16} className="text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {formatNumber(seguidores[establecimiento._id] || 0)}
                  </span>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 mt-2">
                <FaMapMarkerAlt className="mr-1" />
                {establecimiento.ubicacion?.[0]
                  ? `${establecimiento.ubicacion[0].direccion}, ${establecimiento.ubicacion[0].ciudad}, ${establecimiento.ubicacion[0].distrito}`
                  : "Ubicación no disponible"}
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-2">
              <div className="flex gap-2">
                <Button
                  onClick={handleLike}
                  className={`group ${liked ? "bg-red-50 hover:bg-red-100" : ""
                    }`}
                >
                  {liked ? (
                    <FaHeart className="text-[#F8485E]" />
                  ) : (
                    <FaRegHeart className="group-hover:text-[#F8485E]" />
                  )}
                  {liked ? "Quitar like" : "Me gusta"}
                </Button>
                <Button
                  primary={!followed}
                  secondary={followed}
                  onClick={handleFollow}
                >
                  {followed ? "Dejar de seguir" : "Seguir"}
                </Button>
              </div>
              <div className="flex gap-2 mb-6">
                <button
                  onClick={toggleShareOptions}
                  className="p-2 w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  <FaShare className="text-2xl text-gray-700" />
                </button>
                <button className="p-2 w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200">
                  <IoShareSocialOutline className="text-2xl text-gray-700" />
                </button>
                <button className="p-2 w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100 hover:bg-blue-200">
                  <FaFacebook className="text-2xl text-blue-600" />
                </button>
                <button className="p-2 w-12 h-12 flex items-center justify-center rounded-lg bg-pink-100 hover:bg-pink-200">
                  <FaInstagram className="text-2xl text-pink-600" />
                </button>
                <a
                  href={`https://wa.me/${establecimiento.telefono}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 w-12 h-12 flex items-center justify-center rounded-lg bg-green-100 hover:bg-green-200"
                >
                  <FaWhatsapp className="text-2xl text-green-600" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación por pestañas */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === "info"
                ? "text-[#49C581] border-b-2 border-[#49C581]"
                : "text-gray-500 hover:text-[#337179]"
                }`}
              onClick={() => setActiveTab("info")}
            >
              Información
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === "photos"
                ? "text-[#49C581] border-b-2 border-[#49C581]"
                : "text-gray-500 hover:text-[#337179]"
                }`}
              onClick={() => setActiveTab("photos")}
            >
              Fotos
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === "reviews"
                ? "text-[#49C581] border-b-2 border-[#49C581]"
                : "text-gray-500 hover:text-[#337179]"
                }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reseñas ({establecimiento.comentarios?.length || 0} )
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === "offers"
                ? "text-[#49C581] border-b-2 border-[#49C581]"
                : "text-gray-500 hover:text-[#337179]"
                }`}
              onClick={() => setActiveTab("offers")}
            >
              Ofertas
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Columna principal */}
          <div className="md:col-span-2 space-y-6">
            {activeTab === "info" && (
              <>
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-medium text-lg mb-4 text-[#254A5D]">
                    Sobre el lugar
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {establecimiento.descripcion}
                  </p>

                  <h4 className="font-medium text-[#254A5D] mb-2">Servicios</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge>
                      {" "}
                      {(establecimiento.tipo &&
                        establecimiento.tipo[0]?.tipo_nombre) ||
                        "Sin Tipo"}
                    </Badge>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-medium text-lg mb-4 text-[#254A5D] flex items-center gap-2">
                    <FaMapMarkerAlt /> Ubicación
                  </h3>
                  <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
                    {/* Aquí iría un mapa real */}
                    <div
                      className="w-full h-full bg-[#37a6ca] bg-opacity-20 flex items-center justify-center rounded-lg overflow-hidden"
                      style={{ height: "300px" }}
                    >
                      {establecimiento.ubicacion &&
                        establecimiento.ubicacion.length > 0 ? (
                        <MapContainer
                          center={[
                            establecimiento.ubicacion[0].coordenadas.latitud,
                            establecimiento.ubicacion[0].coordenadas.longitud,
                          ]}
                          zoom={15}
                          scrollWheelZoom={false}
                          className="w-full h-[300px] rounded-lg z-0"
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          />
                          <Marker
                            position={[
                              establecimiento.ubicacion[0].coordenadas.latitud,
                              establecimiento.ubicacion[0].coordenadas.longitud,
                            ]}
                          >
                            <Popup>
                              {establecimiento.ubicacion[0].direccion ||
                                "Ubicación sin nombre"}
                            </Popup>
                          </Marker>
                        </MapContainer>
                      ) : (
                        <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 rounded-lg">
                          <p>No hay ubicación disponible</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-700">
                    {establecimiento.ubicacion?.[0]?.direccion ||
                      "Ubicación no disponible"}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-lg text-[#254A5D] flex items-center gap-2">
                      <MdComment /> Reseñas destacadas
                    </h3>
                    <button
                      className="text-sm font-medium text-[#49C581]"
                      onClick={() => setActiveTab("reviews")}
                    >
                      Ver todas
                    </button>
                  </div>

                  {/* Verificar que comentarios tenga elementos antes de intentar renderizar */}
                  <div>
                    {establecimiento.comentarios &&
                      establecimiento.comentarios.length > 0 ? (
                      <div>
                        {establecimiento.comentarios
                          .slice(0, 3)
                          .map((comentario) => (
                            <Review
                              key={comentario._id}
                              author={
                                comentario.usuario?.nombreUsuario || "Anónimo"
                              }
                              date={formatearFecha(comentario.fecha)}
                              rating={comentario.calificacion}
                              comment={comentario.comentario}
                              avatar={comentario.perfil}
                            />
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 py-4">
                        No hay reseñas disponibles
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === "photos" && (
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-medium text-lg mb-4 text-[#254A5D]">
                  Galería de fotos
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allImages.length > 0 ? (
                    allImages.map((imageUrl, i) => (
                      <div
                        key={i}
                        className="relative aspect-square overflow-hidden rounded-lg cursor-pointer transform transition-transform hover:scale-105"
                        onClick={() => openModal(imageUrl)}
                      >
                        <img
                          src={imageUrl}
                          alt={`Establecimiento imagen ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full">No hay imágenes disponibles</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg text-[#254A5D]">
                    Todas las reseñas
                  </h3>
                  <div className="flex items-center gap-1">
                    {renderStars(establecimiento.promedioCalificaciones || 0)}
                    <span className="ml-1 font-medium">
                      ({establecimiento.promedioCalificaciones || 0} )
                    </span>
                    <span className="text-sm text-gray-500">
                      ({establecimiento.comentarios?.length || 0} )
                    </span>
                  </div>
                </div>

                <div className="bg-[#f2f8f7] p-4 rounded-lg mb-6 border border-gray-100">
                  <h4 className="font-medium text-[#254A5D] mb-3">Escribe tu reseña</h4>

                  <form onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}

                    {/* Contenedor principal: móvil en columna, desktop en fila */}
                    <div className="bg-gradient-to-r from-[#337179] to-[#254A5D] p-4 rounded-xl flex flex-col md:flex-row md:items-center gap-3 shadow-lg">

                      {/* Estrellas de valoración */}
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                            aria-label={`Calificación ${star}`}
                          >
                            {star <= newRating ? (
                              <FaStar className="text-yellow-300 text-xl" />
                            ) : (
                              <FaRegStar className="text-white/70 hover:text-yellow-300 text-xl" />
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Input del mensaje (toma todo el ancho disponible) */}
                      <input
                        type="text"
                        placeholder="Escribe tu mensaje..."
                        className="w-full md:flex-1 bg-white/10 text-white placeholder-white/70 px-4 py-2 rounded-lg border border-white/20 focus:ring-2 focus:ring-white/30 focus:border-transparent outline-none transition-all"
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        disabled={isSubmitting}
                      />

                      {/* Botón de enviar */}
                      <button
                        type="submit"
                        className={`bg-white/90 text-[#2E5F58] font-medium px-4 py-2 rounded-full hover:bg-white transition-all md:self-auto self-end ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        title="Enviar reseña"
                        disabled={isSubmitting}
                      >
                        <div className="flex items-center gap-2">
                          <IoMdSend className="text-lg" />
                          <span>Enviar</span>
                        </div>
                      </button>
                    </div>
                  </form>
                </div>



                <div>
                  {establecimiento.comentarios &&
                    establecimiento.comentarios.length > 0 ? (
                    <div>
                      {establecimiento.comentarios.map((comentario) => (
                        <Review
                          key={comentario._id}
                          author={
                            comentario.usuario?.nombreUsuario || "Anónimo"
                          }
                          date={formatearFecha(comentario.fecha)}
                          rating={comentario.calificacion}
                          comment={comentario.comentario}
                          avatar={comentario.perfil}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 py-4">
                      No hay reseñas disponibles
                    </p>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <Button>Cargar más reseñas</Button>
                </div>
              </div>
            )}

            {activeTab === "offers" && (
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-medium text-lg mb-4 text-[#254A5D] flex items-center gap-2">
                  <MdOutlineLocalOffer /> Ofertas y promociones
                </h3>

                {promociones.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No hay promociones disponibles en este momento
                  </div>
                ) : (
                  promociones.map((promocion, index) => {
                    const esHoy = esPromocionHoy(promocion.fechaInicio, promocion.fechaFin);
                    const esNuevo = (new Date() - new Date(promocion.createdAt)) < 7 * 24 * 60 * 60 * 1000; // 7 días

                    return (
                      <div
                        key={promocion._id}
                        className={`bg-gradient-to-r ${getGradientColors(index)} p-5 rounded-lg text-white mb-4 last:mb-0`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-xl mb-1">
                              {promocion.nombre}
                            </h4>
                            <p className="text-white text-opacity-90">
                              {promocion.descripcion}
                            </p>
                            <p className="text-white text-opacity-90 text-sm mt-2">
                              Válido: {new Date(promocion.fechaInicio).toLocaleDateString()} al {new Date(promocion.fechaFin).toLocaleDateString()}
                            </p>
                            {promocion.condiciones && (
                              <p className="text-white text-opacity-80 text-xs mt-1 italic">
                                Condiciones: {promocion.condiciones}
                              </p>
                            )}
                          </div>
                          {esHoy ? (
                            <span className="bg-white text-[#F8485E] px-3 py-1 rounded-full font-bold text-sm">
                              HOY
                            </span>
                          ) : esNuevo ? (
                            <span className="bg-white text-[#49C581] px-3 py-1 rounded-full font-bold text-sm">
                              NUEVO
                            </span>
                          ) : promocion.descuento > 0 ? (
                            <span className="bg-white text-[#8A63FF] px-3 py-1 rounded-full font-bold text-sm">
                              {promocion.descuento}% OFF
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Columna lateral */}
          <div className="space-y-6">
            <Schedule days={diasTransformados} />

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="font-medium text-lg mb-4 text-[#254A5D]">
                Redes sociales
              </h3>
              <div className="flex flex-col gap-2">
                {Object.entries(establecimiento.redesSociales).map(
                  ([key, value]) => {
                    if (!value) return null; // Ignorar si está vacío
                    return (
                      <a
                        key={key}
                        href={`https://www.${key}.com/${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 p-3 rounded-lg ${estilos[key]}`}
                      >
                        {iconos[key]}
                        <span className="font-medium">@{value}</span>
                      </a>
                    );
                  }
                )}
              </div>
            </div>

            <div className="bg-gradient-to-b from-[#337179] to-[#254A5D] text-white rounded-xl p-5 shadow-sm">
              <h3 className="font-medium text-lg mb-4">
                ¿Te gusta este lugar?
              </h3>
              <p className="mb-4 text-white text-opacity-90">
                Comparte tu experiencia y ayuda a otros a descubrir este
                establecimiento.
              </p>
              <div className="flex gap-2">
                <Button className="flex-1 bg-white text-[#254A5D] hover:bg-gray-100">
                  Compartir
                </Button>
                <Button
                  onClick={handleLike}
                  className={`group ${liked ? "bg-red-50 hover:bg-red-100" : ""
                    }`}
                >
                  {liked ? (
                    <FaHeart className="text-[#F8485E]" />
                  ) : (
                    <FaRegHeart className="group-hover:text-[#F8485E]" />
                  )}
                  {liked ? "Quitar like" : "Me gusta"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
