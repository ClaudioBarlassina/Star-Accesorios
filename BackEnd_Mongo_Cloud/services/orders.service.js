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
    variante: p.variante || "",
    precio: p.precio,
    cantidad: p.cantidad,
    categoria:p.categoria,
    subcategoria:p.subcategoria,
    images: p.images?.[0]?.url || "",
    descripcion: p.descripcion,
  }));

  // agrupar cantidades por producto + variante (una variante tiene su propio stock)
  const cantidadesPorLinea = new Map();
  for (const item of productosLimpios) {
    const key = `${String(item._id)}__${item.variante || ""}`;
    const previa = cantidadesPorLinea.get(key) || 0;
    cantidadesPorLinea.set(key, previa + Number(item.cantidad || 0));
  }

  // validar stock antes de descontar (por variante o por producto según corresponda)
  for (const [key, cantidadTotal] of cantidadesPorLinea) {
    const [productoId, variante] = key.split("__");
    const producto = await Product.findById(productoId);

    const tieneVariantes = Array.isArray(producto?.variantes) && producto?.variantes.length > 0;
    const varianteObj = tieneVariantes
      ? (producto.variantes || []).find((v) => v.nombre === variante)
      : null;

    // stock disponible: la de la variante; si la línea no tiene variante pero el
    // producto sí, se usa el total (salvaguarda del flujo de la tarjeta)
    let disponible;
    if (variante && varianteObj) {
      disponible = Number(varianteObj.stock) || 0;
    } else if (tieneVariantes) {
      disponible = producto.stock != null ? Number(producto.stock) : null;
    } else {
      disponible = producto?.stock != null ? Number(producto.stock) : null;
    }

    const nombre = varianteObj
      ? `${producto.nombre} (${variante})`
      : producto?.nombre;

    if (disponible != null && disponible < cantidadTotal) {
      const error = new Error(
        `Stock insuficiente para "${nombre}" (disponible: ${disponible}, pedido: ${cantidadTotal})`
      );
      error.code = "STOCK_INSUFICIENTE";
      throw error;
    }
  }

  // descontar stock por variante (o general si la línea no la tiene)
  for (const [key, cantidadTotal] of cantidadesPorLinea) {
    const [productoId, variante] = key.split("__");
    const producto = await Product.findById(productoId);
    const tieneVariantes = Array.isArray(producto?.variantes) && producto?.variantes.length > 0;
    const varianteObj = tieneVariantes
      ? (producto.variantes || []).find((v) => v.nombre === variante)
      : null;

    if (variante && varianteObj) {
      await Product.updateOne(
        { _id: productoId, "variantes.nombre": variante },
        { $inc: { "variantes.$.stock": -cantidadTotal } }
      );
      // mantener el stock general del producto sincronizado (suma de variantes)
      await Product.updateOne(
        { _id: productoId, variantes: { $exists: true } },
        { $inc: { stock: -cantidadTotal } }
      );
    } else {
      await Product.updateOne(
        { _id: productoId, stock: { $exists: true, $ne: null } },
        { $inc: { stock: -cantidadTotal } }
      );
    }
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