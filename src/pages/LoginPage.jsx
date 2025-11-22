import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { obtenerUsuarioAutenticado, googleSignIn } from "../api/auth";
import axios from "axios";

function LoginPage() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login, setUser, user: currentUser } = useAuth();
  const googleButtonRef = useRef(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usuario = await login({ nombreUsuario, password });
      if (usuario?.rol === "administrador") navigate("/admin/tipos");
      else navigate("/");
      toast.success("Inicio de sesión exitoso");
    } catch (err) {
      toast.error("Usuario o contraseña incorrectos");
      setError("Usuario o contraseña incorrectos");
    }
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    let mounted = true;
    let interval = null;
    let timeout = null;

    const loadScript = () =>
      new Promise((resolve) => {
        if (
          window.google &&
          window.google.accounts &&
          window.google.accounts.id
        ) {
          return resolve(true);
        }
        const existing = Array.from(document.scripts).find((s) =>
          /accounts\.google\.com\/gsi\/client/.test(s.src)
        );
        if (existing) {
          if (existing.getAttribute("data-loaded") === "true")
            return resolve(true);
          existing.addEventListener("load", () => resolve(true));
          existing.addEventListener("error", () => resolve(false));
          return;
        }
        const s = document.createElement("script");
        s.src = "https://accounts.google.com/gsi/client";
        s.async = true;
        s.defer = true;
        s.onload = () => {
          s.setAttribute("data-loaded", "true");
          resolve(true);
        };
        s.onerror = () => resolve(false);
        document.head.appendChild(s);
      });

    const tryInit = () => {
      if (!mounted) return false;
      if (!window.google?.accounts?.id) return false;

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (credentialResponse) => {
            const idToken = credentialResponse?.credential;
            if (!idToken) {
              toast.error("No se obtuvo token de Google");
              return;
            }
            try {
              // Llamar a googleSignIn que guarda el token en el backend
              const response = await googleSignIn(idToken);

              // El backend debería devolver el token
              const token = response?.token || response?.accessToken;

              if (token) {
                localStorage.setItem("token", token);
                axios.defaults.headers.common[
                  "Authorization"
                ] = `Bearer ${token}`;
              }

              // Obtener el usuario autenticado
              const usuario = await obtenerUsuarioAutenticado();

              // Actualizar el contexto con el usuario
              if (usuario) {
                localStorage.setItem("user", JSON.stringify(usuario));
                setUser(usuario);
              }

              // Navegar según el rol
              if (usuario?.rol === "administrador") {
                navigate("/admin/tipos");
              } else {
                navigate("/");
              }
              toast.success("Inicio con Google exitoso");
            } catch (err) {
              console.error("Error completo:", err);
              console.error("Error response:", err.response);
              const msg =
                err.response?.data?.message || "Error al autenticar con Google";
              toast.error(msg);
            }
          },
        });

        // Ajustes de estilo para centrar el botón de Google
        if (googleButtonRef.current) {
          const btn = googleButtonRef.current;
          // tamaño fijo y centrado para evitar desalineación en producción
          btn.style.width = "240px";
          btn.style.margin = "0 auto";
          btn.style.display = "block";
        }

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
        });

        try {
          window.google.accounts.id.prompt();
        } catch (e) {
          /* ignore */
        }
      } catch {
        return false;
      }

      return true;
    };

    (async () => {
      const ok = await loadScript();
      if (!ok) return;

      if (tryInit()) return;

      interval = setInterval(() => {
        if (tryInit()) {
          clearInterval(interval);
          clearTimeout(timeout);
        }
      }, 300);

      timeout = setTimeout(() => {
        clearInterval(interval);
      }, 10000);
    })();

    return () => {
      mounted = false;
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
      if (window.google?.accounts?.id?.cancel)
        window.google.accounts.id.cancel();
    };
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-10">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md mt-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#254A5D]">Iniciar Sesión</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Campo Nombre de usuario */}
            <div>
              <label
                htmlFor="nombreUsuario"
                className="text-sm font-medium text-gray-700"
              >
                Usuario
              </label>
              <input
                id="nombreUsuario"
                name="nombreUsuario"
                type="text"
                autoComplete="username"
                required
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#267241] focus:border-[#267241]"
                placeholder="nombre de usuario"
              />
            </div>

            {/* Campo Password */}
            <div>
              <div className="flex justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <a
                  href="/recuperar"
                  className="text-sm font-medium text-[#267241] hover:text-[#1e5e30]"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#267241] focus:border-[#267241]"
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Botón de Submit */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-3xl text-white bg-[#267241] hover:bg-[#3DA16A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-200"
            >
              Iniciar Sesión
            </button>
          </div>

          {/* Divider y botón Google */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O inicia con</span>
            </div>
          </div>

          <div className="flex justify-center">
            <div ref={googleButtonRef} />
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <a
                href="/registro"
                className="font-medium text-[#267241] hover:text-[#1e5e30]"
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
