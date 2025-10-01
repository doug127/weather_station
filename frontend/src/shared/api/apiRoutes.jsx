import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL_NODE = import.meta.env.VITE_API_BASE_URL_NODE;
const API_BASE_URL_DJANGO = import.meta.env.VITE_API_BASE_URL_DJANGO;

// Node.js + Express
export const api = axios.create({
  baseURL: API_BASE_URL_NODE,
  withCredentials: true,
});

// Django
export const djangoApi = axios.create({
  baseURL: API_BASE_URL_DJANGO,
  withCredentials: true,
});

const handleError = (error) => {
  const message =
    error.response?.data?.message ||
    error.message ||
    "Error de conexión con el servidor";

  Swal.fire({
    icon: "error",
    title: "Error de conexión",
    text: message,
    confirmButtonColor: "#3085d6",
  });

  return Promise.reject(error);
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Primero verificar si es 401
    if (error.response?.status === 401) {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("optionBanner");
      
      // IMPORTANTE: Solo redirigir si NO estás ya en rutas públicas
      const publicRoutes = ['/auth', '/verify-email', '/reset-password'];
      const currentPath = window.location.pathname;
      
      if (!publicRoutes.includes(currentPath)) {
        window.location.href = "/auth";
      }
      
      return Promise.reject(error);
    }
    
    // Si no es 401, mostrar error genérico
    return handleError(error);
  }
);

djangoApi.interceptors.response.use(
  (response) => response,
  handleError
);
