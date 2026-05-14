import express from "express";
import cors from "cors"
// import helmet from "helmet"
// import rateLimit from "express-rate-limit"
import dotenv from "dotenv";
import { connectDB } from "./config/mongo.js";
import productsRoutes from "./routes/products.routes.js";
import ordersRoutes from "./routes/orders.routes.js";

dotenv.config();

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { error: "Demasiadas solicitudes, intente de nuevo más tarde" },
// });

const app = express();
app.set("trust proxy", 1);
app.use(helmet())
app.use(cors())
app.use(express.json())
// app.use(limiter)

app.use("/api/pedidos", ordersRoutes);
app.use("/api/products", productsRoutes);

const PORT = process.env.PORT || 3002

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
  });
};

start();
