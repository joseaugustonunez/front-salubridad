import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Ajusta la ruta si es necesario

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();



  // Mientras estamos cargando el estado de autenticación, mostramos un loading
  if (loading) {
    return  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#49C581] mx-auto"></div>; // Puedes personalizar esto con un spinner u otro mensaje de carga
  }

  return user ? children : <Navigate to="/login" />;
}
