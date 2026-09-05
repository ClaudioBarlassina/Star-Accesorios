import express from "express";
import cors from "cors"
import dotenv from "dotenv";
import multer from "multer";
import { connectDB } from "./config/mongo.js";
import productsRoutes from "./routes/products.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import carouselRoutes from "./routes/carousel.routes.js";
import usersRoutes from "./routes/users.routes.js";
import cloudinary from "./config/cloudinary.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/pedidos", ordersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/carousel", carouselRoutes);
app.use("/api/users", usersRoutes);

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const mensaje =
      err.code === "LIMIT_FILE_SIZE"
        ? "El archivo supera el tamaño máximo permitido (15MB)"
        : err.message || "Error procesando el archivo subido";
    return res.status(400).json({ error: mensaje });
  }
  console.error("❌ Error no controlado:", err.message);
  res.status(500).json({ error: err.message || "Error interno del servidor" });
});

// 🔥 conectar Mongo
connectDB();

app.listen(process.env.PORT || 3002, () => {
  console.log("Servidor en puerto " + (process.env.PORT || 3002));
});
