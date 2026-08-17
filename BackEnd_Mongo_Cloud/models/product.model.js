import "dotenv/config";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    nombre: String,
    precio: Number,
    descripcion: String,
    categoria: String,
    subcategoria: String,
    stock: Number,

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        cloudinary_id: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model(
  process.env.COLLECTION,
  productSchema,
   process.env.COLLECTION,
  
);