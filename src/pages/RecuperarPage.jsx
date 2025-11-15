import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordRecovery } from "../api/auth"; // Asumimos que tienes esta función en tu API

function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!email || !email.includes("@")) {
      setError("Por favor, ingresa un correo electrónico válido");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Llamada a la API para solicitar recuperación de contraseña
      const response = await requestPasswordRecovery({ email });

      // Mostrar pantalla de confirmación
      setIsSubmitted(true);
      setLoading(false);

      // Puedes mostrar el mensaje específico del servidor si lo deseas
      // setMessage(response.message);
    } catch (err) {
      // Manejo de errores
      setLoading(false);
      setError(
        err.response?.data?.message ||
          "Ha ocurrido un error al enviar el correo. Por favor, inténtalo de nuevo más tarde."
      );
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-10">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md mt-16">
        {/* Logo o Título */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#254A5D]">
            Recuperar Contraseña
          </h2>
          {!isSubmitted ? (
            <p className="mt-2 text-sm text-gray-600">
              Ingresa tu correo electrónico y te enviaremos instrucciones para
              restablecer tu contraseña
            </p>
          ) : (
            <p className="mt-2 text-sm text-green-600">
              ¡Correo enviado! Revisa tu bandeja de entrada
            </p>
          )}
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!isSubmitted ? (
          /* Formulario para solicitar recuperación */
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#267241] focus:border-[#267241]"
                placeholder="correo@ejemplo.com"
              />
            </div>

            {/* Botón de Submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-3xl text-white bg-[#267241] hover:bg-[#3DA16A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-200 disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Enviar correo"}
              </button>
            </div>

            {/* Enlace para volver al login */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-sm font-medium text-[#267241] hover:text-[#1e5e30]"
              >
                Volver al inicio de sesión
              </button>
            </div>
          </form>
        ) : (
          /* Pantalla de confirmación después de enviar el correo */
          <div className="mt-6 space-y-6">
            <div className="bg-teal-50 border-l-4 border-teal-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-teal-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-teal-700">
                    Hemos enviado un correo electrónico a {email} con
                    instrucciones para restablecer tu contraseña. Revisa tu
                    bandeja de entrada y sigue las instrucciones.
                  </p>
                </div>
              </div>
            </div>

            {/* Opciones adicionales */}
            <div className="text-center mt-4 space-y-2">
              <p className="text-sm text-gray-600">
                ¿No recibiste el correo?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                  className="font-medium text-teal-600 hover:text-teal-500"
                >
                  Intentar nuevamente
                </button>
              </p>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-sm font-medium text-teal-600 hover:text-teal-500"
              >
                Volver al inicio de sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecuperarPage;
