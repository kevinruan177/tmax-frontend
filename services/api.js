// API Configuration for TMAX Frontend

import axios from "axios";

// Use production URL from environment or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

console.log("API Base URL:", API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token JWT nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para handle de respostas com erro
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem("access_token");
      localStorage.removeItem("currentUser");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ===== SERVIÇO DE AUTENTICAÇÃO =====
export const authService = {
  register: (data) => {
    return api.post("/auth/register", {
      name: data.name,
      email: data.email,
      cpf: data.cpf,
      phone: data.phone,
      password: data.password,
      confirm_password: data.confirmPassword,
    });
  },

  login: (email, password) => {
    return api.post("/auth/login", { email, password });
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("currentUser");
  },
};

// ===== SERVIÇO DE DRIVER =====
export const driverService = {
  // Obter dados do driver logado
  getMe: () => api.get("/driver/me"),

  // Obter driver por ID
  getDriver: (driverId) => api.get(`/driver/${driverId}`),

  // Atualizar dados do driver
  updateDriver: (driverId, data) => {
    return api.put(`/driver/${driverId}`, {
      nome: data.name || data.nome,
      phone: data.phone || data.celular,
      email: data.email,
    });
  },

  // Upload de foto de perfil
  uploadProfilePhoto: (driverId, file) => {
    const formData = new FormData();
    formData.append("driver_id", driverId);
    formData.append("file", file);
    return api.post("/driver/upload/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Upload de RG (aceita múltiplos arquivos)
  uploadRG: (driverId, files) => {
    const formData = new FormData();
    formData.append("driver_id", driverId);
    files.forEach((file) => formData.append("files", file));
    return api.post("/driver/upload/rg", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// ===== SERVIÇO DE MOTORCYCLE =====
export const motorcycleService = {
  // Upload/Criar moto
  createMotorcycle: (file, motorcycleData) => {
    const formData = new FormData();
    formData.append("file", file);
    if (motorcycleData.driver_id) {
      formData.append("driver_id", motorcycleData.driver_id);
    }
    return api.post("/driver/vehicle", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Obter dados da moto de um driver
  getMoto: (driverId) => api.get(`/driver/vehicle/${driverId}`),

  // Atualizar dados da moto
  updateMoto: (motorcycleId, data) => {
    return api.put(`/driver/vehicle/${motorcycleId}`, {
      model: data.model || data.modelo,
      year: data.year || data.ano,
      color: data.color || data.cor,
      plate: data.plate || data.placa,
    });
  },

  // Deletar moto
  deleteMoto: (motorcycleId) => api.delete(`/driver/vehicle/${motorcycleId}`),
};

export default api;
