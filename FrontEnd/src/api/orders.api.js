import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api/pedidos";



// crear pedido
export const crearPedido = (pedido) => {
  return axios.post(API_URL, pedido);
};

// traer pedidos (opcional)
export const getPedidos = () => {
  return axios.get(API_URL);
};

export const getPedidoById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};