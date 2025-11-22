import axios from "axios";

const API_URL = 'https://back-salubridad.sistemasudh.com/auth'; 
//const API_URL = 'http://localhost:3000/auth';
// LOGIN
export const login = async (credenciales) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credenciales);
    const { accessToken, user } = response.data;

    // Guarda el token y configura header por defecto
    if (accessToken) {
      localStorage.setItem("token", accessToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
    if (user) localStorage.setItem("user", JSON.stringify(user));

    return { accessToken, user };
  } catch (error) {
    console.error("Error al iniciar sesión:", error.response?.data || error.message);
    throw error;
  }
};

// REGISTRO
export const registrar = async (datosUsuario) => {
  try {
    const response = await axios.post(`${API_URL}/register`, datosUsuario);
    return response.data;
  } catch (error) {
    console.error("Error al registrar:", error);
    throw error;
  }
};

// OBTENER USUARIO AUTENTICADO
export const obtenerUsuarioAutenticado = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el usuario autenticado:", error);
    throw error;
  }
};

// Función para enviar código de recuperación de contraseña
export const requestPasswordRecovery = async ({ email }) => {
  try {
    console.log(`Solicitando recuperación de contraseña para ${email}`);
    const response = await axios.post(`${API_URL}/recover-password`, { email });
    return response.data;
  } catch (error) {
    console.error("Error al solicitar recuperación de contraseña:", error);
    throw error;
  }
};

// Función para verificar si un token de recuperación es válido
export async function verifyResetCode(token) {
  try {
    const response = await axios.get(`${API_URL}/verify-recovery-token/${token}`);
    return response.data;
  } catch (error) {
    console.error("Error verificando el token:", error);
    return { isValid: false };
  }
}

// Función para restablecer la contraseña con un token
export const resetPassword = async ({ token, newPassword }) => {
  try {
    console.log(`Restableciendo contraseña con token`);
    const response = await axios.post(`${API_URL}/reset-password`, { 
      token, 
      newPassword 
    });
    return response.data;
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    throw error;
  }
};

// Google Sign-In: espera que el backend devuelva { accessToken, user }
export const googleSignIn = async (idToken) => {
  try {
    const response = await axios.post(`${API_URL}/google`, { idToken });
    const { accessToken, user } = response.data;
    if (accessToken) {
      localStorage.setItem("token", accessToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
    if (user) localStorage.setItem("user", JSON.stringify(user));
    return { accessToken, user };
  } catch (error) {
    throw error;
  }
};