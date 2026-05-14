import Pedido from "../models/pedido.model.js";
import { enviarPedidoEmails } from "../ServicioEmail/email/pedidoEmail.services.js";

export const crearPedidoService = async (data) => {
  const { productos } = data;

  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    throw new Error("El pedido debe contener al menos un producto");
  }

  const total = productos.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  if (typeof total !== "number" || isNaN(total) || total <= 0) {
    throw new Error("El total del pedido no es válido");
  }

  const productosLimpios = productos.map((p) => ({
    _id: p._id,
    nombre: p.nombre,
    precio: p.precio,
    cantidad: p.cantidad,
    categoria:p.categoria,
    subcategoria:p.subcategoria,
    images: p.images?.[0]?.url || "",
    descripcion: p.descripcion,
  }));

  const nuevoPedido = new Pedido({
    ...data,
    productos: productosLimpios,
    total,
    estado: "pendiente",
    fecha: new Date(),
  });

  const pedidoGuardado = await nuevoPedido.save();

  await enviarPedidoEmails(pedidoGuardado);

  return pedidoGuardado;
};



export const getPedidosService = async () => {
  return await Pedido.find().sort({ fecha: -1 });
};

export const getPedidoByIdService = async (id) => {
  return await Pedido.findById(id);
};