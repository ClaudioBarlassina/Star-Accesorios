import Pedido from "../models/pedido.model.js";
import Product from "../models/product.model.js";
import { enviarPedidoEmails } from "../ServicioEmail/email/pedidoEmail.services.js";

export const crearPedidoService = async (data) => {
  const { productos } = data;
  console.log("📦 Productos recibidos en service:", productos);

  // calcular total en backend (bien ✔)
  const total = productos.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const esPresencial = data.origen === "presencial";

  // limpiar productos (recomendado)
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

  // validar stock antes de descontar (solo productos con stock definido)
  for (const item of productosLimpios) {
    const producto = await Product.findById(item._id);
    const tieneStock = producto?.stock != null;

    if (tieneStock && Number(producto.stock) < item.cantidad) {
      const error = new Error(
        `Stock insuficiente para "${item.nombre}" (disponible: ${producto.stock}, pedido: ${item.cantidad})`
      );
      error.code = "STOCK_INSUFICIENTE";
      throw error;
    }
  }

  // descontar stock (sin bajar de 0, solo en productos que ya tienen stock)
  for (const item of productosLimpios) {
    await Product.updateOne(
      { _id: item._id, stock: { $exists: true, $ne: null } },
      { $inc: { stock: -item.cantidad } }
    );
  }

  const nuevoPedido = new Pedido({
    userId: data.userId || null,
    ...data,                 // 👈 trae cliente, entrega, pago, etc.
    productos: productosLimpios, // 👈 evitás guardar basura
    total,                  // 👈 recalculado
    estado: esPresencial ? "entregado" : "pendiente",
    origen: esPresencial ? "presencial" : (data.origen || "online"),
    fecha: new Date(),
  });

 // ✅ guardar
  const pedidoGuardado =
  await nuevoPedido.save();

  console.log("✅ Pedido guardado");

  // ✅ enviar emails (solo pedidos online) — sin romper la venta si falla
  if (!esPresencial) {
    try {
      await enviarPedidoEmails(pedidoGuardado);
      console.log("📩 Emails enviados");
    } catch (emailError) {
      console.error("⚠️ Error enviando emails (la venta ya se guardó):", emailError.message);
    }
  } else {
    console.log("🛒 Venta presencial — emails omitidos");
  }

  return pedidoGuardado;
};



export const getPedidosService = async () => {
  return await Pedido.find().sort({ fecha: -1 });
};

export const getPedidoByIdService = async (id) => {
  return await Pedido.findById(id);
};

export const updatePedidoEstadoService = async (id, estado) => {
  const pedido = await Pedido.findByIdAndUpdate(
    id,
    { estado },
    { new: true, runValidators: true }
  );

  if (!pedido) {
    throw new Error("Pedido no encontrado");
  }

  return pedido;
};

export const getMisPedidosService = async (userId) => {
  return await Pedido.find({ userId }).sort({ fecha: -1 });
};