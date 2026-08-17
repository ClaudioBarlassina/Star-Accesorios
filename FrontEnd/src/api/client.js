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

  return instance;
};
