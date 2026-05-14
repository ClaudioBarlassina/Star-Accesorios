import express from "express";
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import dotenv from "dotenv";
import { connectDB } from "./config/mongo.js";
import productsRoutes from "./routes/products.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import cloudinary from "./config/cloudinary.js";

dotenv.config();



const app = express();
app.set("trust proxy", 1);
app.use(cors())
app.use(express.json())



app.use("/api/pedidos", ordersRoutes);
app.use("/api/products", productsRoutes);

connectDB();

const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
