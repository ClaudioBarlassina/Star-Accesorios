import { createClient } from "./client";

const api = createClient("/api/products");

// Traer todos los productos, pasando filtros como query params
export const getProducts = (filters = {}) => {
  return api.get("/", { params: filters });
};

// Traer un producto por ID
export const getProductById = (id) => {
  return api.get(`/${id}`);
};

export const createProduct = (formData) => {
  return api.post("/", formData);
};

export const updateProduct = (id, formData) => {
  return api.put(`/${id}`, formData);
};

export const deleteProduct = (id) => {
  return api.delete(`/${id}`);
};

export const bulkCreateProducts = (formData) => {
  return api.post("/bulk", formData, { timeout: 120000 });
};
