import Pedido from "../models/pedido.model.js";
import { enviarPedidoEmails } from "../ServicioEmail/email/pedidoEmail.services.js";

export const crearPedidoService = async (data) => {
  const { productos } = data;
  console.log("📦 Productos recibidos en service:", productos);

  // calcular total en backend (bien ✔)
  const total = productos.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  // limpiar productos (recomendado)
  const productosLimpios = productos.map((p) => ({
    _id: p._id,
    nombre: p.nombre,
    precio: p.precio,
    cantidad: p.cantidad,
    categoria:p.categoria,
    subcategoria:p.subcategoria,
    images: p.images[0]?.url || "",
    descripcion: p.descripcion,
  }));

  const nuevoPedido = new Pedido({
    ...data,                 // 👈 trae cliente, entrega, pago, etc.
    productos: productosLimpios, // 👈 evitás guardar basura
    total,                  // 👈 recalculado
    estado: "pendiente",
    fecha: new Date(),
  });

 // ✅ guardar
  const pedidoGuardado =
  await nuevoPedido.save();

  console.log("✅ Pedido guardado");

  // ✅ enviar emails
  await enviarPedidoEmails(
    pedidoGuardado
    
  );
 console.log(pedidoGuardado)
  console.log("📩 Emails enviados");

  return pedidoGuardado;
};



export const getPedidosService = async () => {
  return await Pedido.find().sort({ fecha: -1 });
};

export const getPedidoByIdService = async (id) => {
  return await Pedido.findById(id);
};