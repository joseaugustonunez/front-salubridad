import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import * as apiAuth from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    // Si hay token en localStorage, configuro axios header al iniciar la app
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const login = async (credenciales) => {
    // esperar respuesta que incluya token y user
    const res = await apiAuth.login(credenciales);
    // ejemplo: res = { user, token }
    const usuario = res.user || res.usuario || null;
    const token = res.token || res.accessToken || null;

    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    setUser(usuario);
    if (usuario) localStorage.setItem("user", JSON.stringify(usuario));
    return usuario;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // opcional: función para refrescar usuario desde backend
  const refreshUser = async () => {
    try {
      const usuario = await apiAuth.obtenerUsuarioAutenticado();
      setUser(usuario || null);
      if (usuario) localStorage.setItem("user", JSON.stringify(usuario));
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    // al montar: si hay token pero no hay user, intento refrescarlo automáticamente
    const token = localStorage.getItem("token");
    if (token && !user) {
      (async () => {
        try {
          await refreshUser();
        } catch (err) {
          // opcional: manejar/loguear error
        }
      })();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
