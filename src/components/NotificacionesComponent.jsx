import { useState, useEffect, useRef } from 'react';
import { obtenerNotificaciones, marcarNotificacionLeida, eliminarNotificacion } from '../api/notificaciones';

const NotificacionesComponent = ({ usuarioId }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const notificationRef = useRef(null);
  
  // Calcular notificaciones no leídas
  const unreadCount = notifications.filter(notif => !notif.read).length;
  
  // Función para obtener el título según el tipo de notificación
  const getTitleByType = (tipo) => {
    const tipos = {
      'comentario': 'Nuevo comentario',
      'respuesta': 'Respuesta recibida',
      'mencion': 'Te han mencionado',
      'sistema': 'Notificación del sistema',
      'promocion': 'Promoción disponible',
      // Añade más tipos según necesites
    };
    
    return tipos[tipo] || 'Notificación';
  };

  // Obtener el ícono según el tipo de notificación
  const getIconByType = (tipo) => {
    const iconos = {
      'comentario': (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      'respuesta': (
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      ),
      'mencion': (
        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      'sistema': (
        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'promocion': (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
    
    return iconos[tipo] || (
      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  // Obtener el color de fondo según el tipo de notificación
  const getBackgroundByType = (tipo) => {
    const backgrounds = {
      'comentario': 'bg-blue-50 hover:bg-blue-100',
      'respuesta': 'bg-green-50 hover:bg-green-100',
      'mencion': 'bg-purple-50 hover:bg-purple-100',
      'sistema': 'bg-yellow-50 hover:bg-yellow-100',
      'promocion': 'bg-red-50 hover:bg-red-100',
    };
    
    return backgrounds[tipo] || 'bg-gray-50 hover:bg-gray-100';
  };
  
  // Cargar notificaciones
  const cargarNotificaciones = async () => {
    if (!usuarioId) {
      console.warn("No hay ID de usuario proporcionado");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const data = await obtenerNotificaciones(usuarioId);
      
      // Si no hay datos o no es un array, mostrar un mensaje de error amigable
      if (!data || !Array.isArray(data)) {
        console.warn("La API no devolvió un array de notificaciones", data);
        setNotifications([]);
        return;
      }
  
      const notificacionesFormateadas = data.map(notif => ({
        id: notif._id || notif.id || `temp-${Date.now()}-${Math.random()}`,
        title: getTitleByType(notif.tipo),
        message: notif.mensaje || notif.message || "Sin mensaje",
        read: notif.leida || notif.read || false,
        time: formatearFecha(notif.fecha || notif.createdAt || new Date()),
        tipo: notif.tipo || "sistema"
      }));

      setNotifications(notificacionesFormateadas);
    } catch (err) {
      setError("No se pudieron cargar las notificaciones");
    } finally {
      setLoading(false);
    }
  };

  // Formatear la fecha de la notificación
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const ahora = new Date();
    const diferenciaMinutos = Math.floor((ahora - fecha) / (1000 * 60));
    
    if (diferenciaMinutos < 60) {
      return `hace ${diferenciaMinutos} min`;
    } else if (diferenciaMinutos < 24 * 60) {
      return `hace ${Math.floor(diferenciaMinutos / 60)} h`;
    } else {
      return fecha.toLocaleDateString();
    }
  };
  
  // Marcar una notificación como leída
  const markAsRead = async (notificationId) => {
    try {
      await marcarNotificacionLeida(notificationId);
      
      // Actualizar estado local
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true } 
            : notif
        )
      );
    } catch (err) {
      console.error("Error al marcar notificación como leída:", err);
    }
  };
  
  // Eliminar una notificación
  const handleDeleteNotification = async (notificationId, event) => {
    event.stopPropagation(); // Evitar que se propague al hacer clic en eliminar
    
    try {
      await eliminarNotificacion(notificationId);
      
      // Eliminar de estado local
      setNotifications(prevNotifications => 
        prevNotifications.filter(notif => notif.id !== notificationId)
      );
    } catch (err) {
      console.error("Error al eliminar notificación:", err);
    }
  };
  
  // Marcar todas como leídas
  const markAllAsRead = async () => {
    try {
      // Asumimos que hay que llamar a marcarNotificacionLeida para cada una
      for (const notif of notifications.filter(n => !n.read)) {
        await marcarNotificacionLeida(notif.id);
      }
      
      // Actualizar estado local
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => ({ ...notif, read: true }))
      );
    } catch (err) {
      console.error("Error al marcar todas las notificaciones como leídas:", err);
    }
  };
  
  // Abrir/cerrar panel de notificaciones
  const toggleNotifications = () => {
    setIsNotificationsOpen(prev => !prev);
    
    // Si se está abriendo el panel, cargar notificaciones actualizadas
    if (!isNotificationsOpen) {
      cargarNotificaciones();
    }
  };
  
  // Función para cerrar las notificaciones cuando se hace clic fuera
  const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setIsNotificationsOpen(false);
    }
  };
  
  // Configurar detector de clic fuera y cargar notificaciones al montar
  useEffect(() => {
    // Añadir detector de clics cuando el componente se monta
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cargar notificaciones iniciales
    cargarNotificaciones();
    
    // Opcional: configurar un intervalo para actualizar periódicamente
    const intervalo = setInterval(cargarNotificaciones, 60000); // cada minuto
    
    // Limpieza al desmontar
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearInterval(intervalo);
    };
  }, [usuarioId]);

  // Animación de campana cuando hay notificaciones no leídas
  const bellAnimation = unreadCount > 0 ? 'animate-pulse' : '';
  
  return (
    <div className="relative" ref={notificationRef}>
      <button 
        className={`text-gray-700 hover:text-teal-700 focus:outline-none transition-all ${bellAnimation}`}
        onClick={toggleNotifications}
        aria-label="Notificaciones"
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
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
          {unreadCount}
        </span>
      )}
      
      {/* Notifications dropdown - Now with smooth animation */}
      {isNotificationsOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg py-2 z-10 border border-gray-200 transition-all duration-300 ease-in-out transform origin-top-right"
          style={{
            opacity: 1,
            animation: 'fadeInScale 0.2s ease-out'
          }}
        >
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
            <h3 className="font-bold text-gray-800 text-lg">Notificaciones</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Cargando notificaciones...</p>
              </div>
            ) : error ? (
              <div className="px-4 py-6 text-center text-red-500 bg-red-50 mx-2 my-2 rounded-md">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            ) : notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`px-4 py-3 border-b border-gray-100 transition-all duration-200 ${!notification.read ? 'shadow-sm' : ''} ${getBackgroundByType(notification.tipo)}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      {getIconByType(notification.tipo)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <p className={`font-semibold text-sm ${!notification.read ? 'text-gray-900' : 'text-gray-800'}`}>
                          {notification.title}
                          {!notification.read && (
                            <span className="inline-block w-2 h-2 bg-teal-600 rounded-full ml-2 animate-pulse"></span>
                          )}
                        </p>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-2">{notification.time}</span>
                          <button 
                            onClick={(e) => handleDeleteNotification(notification.id, e)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Eliminar notificación"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className={`text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-600'} mt-1`}>
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500 font-medium">No tienes notificaciones</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <style>{`
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`}</style>
    </div>
  );
};

export default NotificacionesComponent;