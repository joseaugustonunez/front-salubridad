import { useState, useEffect, useRef } from "react";
import { registrar, googleSignIn } from "../api/auth";
import { toast } from "react-hot-toast";
function RegisterPage() {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    nombreUsuario: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const googleButtonRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      return;
    }

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
              await googleSignIn(idToken);
              toast.success("Registro/Inicio con Google exitoso");
            } catch (err) {
              const msg =
                err.response?.data?.message || "Error al autenticar con Google";
              toast.error(msg);
            }
          },
        });

        if (googleButtonRef.current) {
          googleButtonRef.current.style.width = "100%";
        }

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
        });

        try {
          window.google.accounts.id.prompt();
        } catch (e) {
          /* ignore */
        }
      } catch (err) {
        // silencioso: no mostrar logs en consola
        return false;
      }

      return true;
    };

    (async () => {
      const ok = await loadScript();
      if (!ok) {
        return;
      }

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
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (!termsAccepted) {
      toast.error("Debes aceptar los términos y condiciones");
      return;
    }

    // Validación mínima de nombres/apellidos
    if (!formData.nombres.trim() || !formData.apellidos.trim()) {
      toast.error("Por favor ingresa nombres y apellidos");
      return;
    }

    try {
      const response = await registrar({
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        nombreUsuario: formData.nombreUsuario,
        email: formData.email,
        password: formData.password,
      });

      toast.success("¡Registro exitoso!");

      setFormData({
        nombres: "",
        apellidos: "",
        nombreUsuario: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setTermsAccepted(false);
    } catch (error) {
      const mensajeError =
        error.response?.data?.message || // si el backend responde con { message: "..." }
        error.response?.data?.error || // o con { error: "..." }
        "Hubo un error al registrarse"; // mensaje por defecto

      toast.error(mensajeError);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-10">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md mt-16">
        {/* Logo o Título */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#254A5D]">Registrarse</h2>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Nombres y Apellidos (en una fila) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="nombres"
                  className="text-sm font-medium text-gray-700"
                >
                  Nombres
                </label>
                <input
                  id="nombres"
                  name="nombres"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.nombres}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#267241] focus:border-[#267241]"
                  placeholder="Juan"
                />
              </div>

              <div>
                <label
                  htmlFor="apellidos"
                  className="text-sm font-medium text-gray-700"
                >
                  Apellidos
                </label>
                <input
                  id="apellidos"
                  name="apellidos"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.apellidos}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#267241] focus:border-[#267241]"
                  placeholder="Pérez"
                />
              </div>
            </div>

            {/* Nombre de usuario */}
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
                value={formData.nombreUsuario}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#267241] focus:border-[#267241]"
                placeholder="juan.perez"
              />
            </div>

            {/* Campo Email */}
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#267241] focus:border-[#267241]"
                placeholder="correo@ejemplo.com"
              />
            </div>

            {/* Campo Password */}
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
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
              <p className="mt-1 text-xs text-gray-500">
                La contraseña debe tener al menos 8 caracteres
              </p>
            </div>

            {/* Campo Confirmar Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#267241] focus:border-[#267241]"
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
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

            {/* Términos y condiciones */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  Acepto los{" "}
                  <a
                    href="#terms"
                    className="text-[#267241] hover:text-[#3DA16A]"
                  >
                    términos y condiciones
                  </a>{" "}
                  y la{" "}
                  <a
                    href="#privacy"
                    className="text-[#267241] hover:text-[#3DA16A]"
                  >
                    política de privacidad
                  </a>
                </label>
              </div>
            </div>
          </div>

          {/* Botón de Submit */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-3xl text-white bg-[#267241] hover:bg-[#3DA16A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#267241] transition duration-200"
            >
              Crear Cuenta
            </button>
          </div>

          {/* Divider y botón Google */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                O regístrate con
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <div ref={googleButtonRef} />
          </div>

          {/* Enlace para login */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <a
                href="/login"
                className="font-medium text-[#267241] hover:text-[#1e5e30]"
              >
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
