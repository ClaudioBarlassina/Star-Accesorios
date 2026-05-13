import axios from "axios";

const API_URL = "http://localhost:3002/api/products"; // tu backend Mongo o JSON

// Traer todos los productos, pasando filtros como query params
export const getProducts = (filters = {}) => {
  return axios.get(API_URL, { params: filters });
};

// Traer un producto por ID
export const getProductById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createProduct = (formData) => {
  return axios.post(API_URL, formData);
};

export const updateProduct = (id, formData) => {
  return axios.put(`${API_URL}/${id}`, formData);
};

export const deleteProduct = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
