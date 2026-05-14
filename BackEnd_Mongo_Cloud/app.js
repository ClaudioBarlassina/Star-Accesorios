import express from "express";
import cors from "cors"
import dotenv from "dotenv";
import { connectDB } from "./config/mongo.js";
import productsRoutes from "./routes/products.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import cloudinary from "./config/cloudinary.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/pedidos", ordersRoutes);
app.use("/api/products", productsRoutes);

// 🔥 conectar Mongo
connectDB();

app.listen(3002, () => {
  console.log("Servidor en puerto 3002");
});
