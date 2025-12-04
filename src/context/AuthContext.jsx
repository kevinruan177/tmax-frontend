import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "./services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar usuário ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("currentUser");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Erro ao carregar dados do usuário:", err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.login(email, password);
      const { access_token } = response.data;

      localStorage.setItem("access_token", access_token);
      setToken(access_token);

      // Armazenar informações do usuário
      const userData = {
        email,
        loggedIn: true,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem("currentUser", JSON.stringify(userData));
      setUser(userData);

      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || "Erro ao fazer login";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.register(userData);

      // Auto-login após registro
      const loginResponse = await authService.login(
        userData.email,
        userData.password
      );
      const { access_token } = loginResponse.data;

      localStorage.setItem("access_token", access_token);
      setToken(access_token);

      const currentUser = {
        email: userData.email,
        name: userData.name,
        cpf: userData.cpf,
        phone: userData.phone,
        loggedIn: true,
        registrationTime: new Date().toISOString(),
      };

      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      setUser(currentUser);

      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || "Erro ao registrar";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setError(null);
  };

  const updateUser = (userData) => {
    const updated = { ...user, ...userData };
    setUser(updated);
    localStorage.setItem("currentUser", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
