import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import InicioPage from './pages/InicioPage';
import NavbarPage from './components/NavbarPage';
import EstablecimientoPage from './pages/EstablecimientoPage';
import TopEstablecimientos from './pages/TopPage';
import EstablecimientoDetallePage from './pages/EstablecimientoDetallePage';
import PerfilPage from './pages/PerfilPage';
import RecuperarPage from './pages/RecuperarPage';
import CambiarPage from './pages/CambiarPage';
import PromocionPage from './pages/PromocionPage';
import AdminEstablecimientos from './pages/admin/AdminEstablecimientos';
import UsuariosAdminPage from './pages/admin/UsuariosAdminPage';
import AdminEstablecimientoDetalle from './pages/admin/AdminEstablecimientoDetalle';
import AdminTipos from './pages/admin/AdminTipos';
import AdminCategorias from './pages/admin/AdminCategorias';
import FooterPage from './components/FooterPage';
import { useEffect } from "react";
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute'; // Ajusta la ruta si es necesario
import { Toaster } from 'react-hot-toast';

function AppWrapper() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <NavbarPage />
      <Routes>
        <Route path="/" element={<InicioPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/recuperar" element={<RecuperarPage />} />
        <Route path="/cambiar" element={<CambiarPage />} />

        {/* Rutas protegidas */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <PerfilPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/establecimientos"
          element={
            
              <EstablecimientoPage />
            
          }
        />
        <Route
          path="/admin/establecimientos"
          element={
            <PrivateRoute>
              <AdminEstablecimientos />
            </PrivateRoute>
          }
        />
          <Route
          path="/admin/usuarios"
          element={
            <PrivateRoute>
              <UsuariosAdminPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/promociones"
          element={
            <PrivateRoute>
              <PromocionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/establecimientodetalle/:id"
          element={
              <EstablecimientoDetallePage />
          }
        />
        <Route
          path="/admin/establecimientodetalle/:id"
          element={
            <PrivateRoute>
              <AdminEstablecimientoDetalle />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/tipos/"
          element={
            <PrivateRoute>
              <AdminTipos />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/categorias/"
          element={
            <PrivateRoute>
              <AdminCategorias />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/top"
          element={
              <TopEstablecimientos />
          }
        />
      </Routes>
      
      <FooterPage />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppWrapper />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
