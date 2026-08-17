import axios from "axios";
import { auth } from "../components/layoudShopLogM/firebase/firebase";

const DEFAULT_API_URL = "https://star-accesorios.onrender.com";

const normalizeBase = (url) =>
  url.replace(/\/+$/, "").replace(/\/api$/, "");

// Cliente axios con base configurable y token de Firebase en cada request
export const createClient = (path) => {
  const raw = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
  const instance = axios.create({
    baseURL: `${normalizeBase(raw)}${path}`,
  });

  instance.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const url = error.config?.url || "";
      const method = error.config?.method?.toUpperCase() || "";
      const data = error.response?.data;

      if (status === 401) {
        console.warn(`🔒 [API 401] ${method} ${url} — Token inválido o expirado. Probá recargar la página e iniciar sesión de nuevo.`);
      } else if (status === 403) {
        console.warn(`🚫 [API 403] ${method} ${url} — No autorizado. Tu email no está en la lista de admins.`);
      } else if (status === 500) {
        console.error(`💥 [API 500] ${method} ${url} — Error del servidor:`, data?.error || data || "Sin detalle");
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
