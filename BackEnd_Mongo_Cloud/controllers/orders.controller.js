import {
  crearPedidoService,
  getPedidosService,
  getPedidoByIdService,
  updatePedidoEstadoService,
} from "../services/orders.service.js";

export const crearPedido = async (req, res) => {
  try {
    console.log("📥 Pedido recibido en controller:", req.body);
    const pedido = await crearPedidoService(req.body);
    res.status(201).json(pedido);
  } catch (error) {
    console.error("❌ Error al crear pedido:", error.message);
    if (error.code === "STOCK_INSUFICIENTE") {
      return res.status(400).json({ error: error.message });
    }
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

export const updatePedidoEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const estadosValidos = ["pendiente", "procesando", "enviado", "entregado", "cancelado"];

    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({ error: `Estado inválido. Válidos: ${estadosValidos.join(", ")}` });
    }

    const pedido = await updatePedidoEstadoService(req.params.id, estado);
    res.json(pedido);
  } catch (error) {
    console.error("❌ Error actualizando estado:", error.message);
    res.status(404).json({ error: error.message });
  }
};