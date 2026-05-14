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
    res.status(500).json({ error: error.message });
  }
};

export const getPedidos = async (req, res) => {
  try {
    const pedidos = await getPedidosService();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
};

export const getPedidoById = async (req, res) => {
  try {
    const pedido = await getPedidoByIdService(req.params.id);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el pedido" });
  }
};