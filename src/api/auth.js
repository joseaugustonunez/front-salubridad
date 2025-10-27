import axios from 'axios';

const API_URL = 'https://back-salubridad.sistemasudh.com/auth'; 
//const API_URL = 'http://localhost:3000/auth';
// LOGIN
export const login = async (credenciales) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credenciales);
    const { accessToken, user } = response.data;

    // Guarda el token con el nombre que tú quieras (puedes seguir usando 'token')
    localStorage.setItem('token', accessToken);

    return { token: accessToken, user }; // <- este objeto es usado por el AuthContext
  } catch (error) {
    console.error('Error al iniciar sesión:', error.response?.data || error.message);
    throw new Error("Credenciales inválidas o token no válido");
  }
};

// REGISTRO
export const registrar = async (datosUsuario) => {
  try {
    const response = await axios.post(`${API_URL}/register`, datosUsuario);
    return response.data;
  } catch (error) {
    console.error('Error al registrar:', error);
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
    console.error('Error al obtener el usuario autenticado:', error);
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
    console.error('Error al solicitar recuperación de contraseña:', error);
    throw error;
  }
};

// Función para verificar si un token de recuperación es válido
export async function verifyResetCode(token) {
  try {
    const response = await axios.get(`${API_URL}/verify-recovery-token/${token}`);
    return response.data;
  } catch (error) {
    console.error('Error verificando el token:', error);
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
    console.error('Error al restablecer contraseña:', error);
    throw error;
  }
};