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

// pp.use(helmet())
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://star-accesorios.vercel.app",
// ];
app.use(cors({
  // origin: (origin, cb) => {
  //   if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
  //   cb(null, true);
  // },
  // methods: ["GET", "POST", "PUT", "DELETE"],
}))
app.use(express.json({ limit: "10mb" }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Demasiadas solicitudes, intentá de nuevo más tarde" },
})
app.use("/api/", limiter)

app.use("/api/pedidos", ordersRoutes);
app.use("/api/products", productsRoutes);

connectDB();

const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
