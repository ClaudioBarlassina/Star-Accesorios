import { createClient } from "./client";

const api = createClient("/api/pedidos");

// crear pedido
export const crearPedido = (pedido) => {
  return api.post("/", pedido);
};

// traer pedidos (opcional)
export const getPedidos = () => {
  return api.get("/");
};

export const getPedidoById = (id) => {
  return api.get(`/${id}`);
};

export const updatePedidoEstado = (id, estado) => {
  return api.patch(`/${id}`, { estado });
};
