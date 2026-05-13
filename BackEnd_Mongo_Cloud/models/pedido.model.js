import mongoose from "mongoose";

const PedidoSchema = new mongoose.Schema({
  cliente: {
    nombre: String,
    apellido: String,
    email: String,
    telefono: String,
    direccion: String,
  },
  productos: [
    {
      _id: String,
      nombre: String,
      precio: Number,
      cantidad: Number,
      categoria: String,
      subcategoria: String,
      images: String,
      descripcion: String,
    },
  ],
  entrega: String,
  pago: String,
  total: Number,
  estado: String,
  fecha: Date,
});
export default mongoose.model("Pedido", PedidoSchema);