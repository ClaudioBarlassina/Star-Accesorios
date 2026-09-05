import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/mongo.js";
import Product from "../models/product.model.js";
import Carousel from "../models/carousel.model.js";
import { buildWebUrl } from "../services/cloudinary.service.js";

const esHeic = (url) => /\.(heic|heif)(\?|$)/i.test(url) && url.includes("/image/upload/");

const fixUrl = (url) => {
  if (typeof url !== "string" || !url) return url;
  if (!url.includes("/image/upload/")) return url;
  if (!esHeic(url)) return url;
  return buildWebUrl(url);
};

const run = async () => {
  await connectDB();

  let fixedImages = 0;
  let fixedVariantes = 0;

  const productos = await Product.find({});
  for (const producto of productos) {
    let cambio = false;

    for (const img of producto.images || []) {
      const nuevo = fixUrl(img.url);
      if (nuevo !== img.url) {
        img.url = nuevo;
        fixedImages += 1;
        cambio = true;
      }
    }

    for (const variante of producto.variantes || []) {
      const nuevo = fixUrl(variante.imageUrl);
      if (nuevo !== variante.imageUrl) {
        variante.imageUrl = nuevo;
        fixedVariantes += 1;
        cambio = true;
      }
    }

    if (cambio) {
      await producto.save();
      console.log(`✅ Producto actualizado: ${producto.nombre || producto._id}`);
    }
  }

  const carrousel = await Carousel.findOne({ clave: "principal" });
  if (carrousel) {
    let cambio = false;
    for (const img of carrousel.imagenes || []) {
      const nuevo = fixUrl(img.url);
      if (nuevo !== img.url) {
        img.url = nuevo;
        fixedImages += 1;
        cambio = true;
      }
    }
    if (cambio) {
      await carrousel.save();
      console.log("✅ Carrusel actualizado");
    }
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   Productos procesados: ${productos.length}`);
  console.log(`   Imágenes corregidas: ${fixedImages}`);
  console.log(`   Variantes corregidas: ${fixedVariantes}`);

  await mongoose.disconnect();
  console.log("👋 Desconectado de MongoDB");
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Error en backfill:", err.message);
  process.exit(1);
});