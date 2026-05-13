import {
  crearPedidoService,
  getPedidosService,
  getPedidoByIdService,
} from "../services/orders.service.js";

export const crearPedido = async (req, res) => {
  try {
    const pedido = await crearPedidoService(req.body);
    res.status(201).json(pedido);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getPedidos = async (req, res) => {
  const pedidos = await getPedidosService();
  res.json(pedidos);
};

export const getPedidoById = async (req, res) => {
  const pedido = await getPedidoByIdService(req.params.id);
  res.json(pedido);
};