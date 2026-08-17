import { Router } from "express";
import {
  crearPedido,
  getPedidos,
  getPedidoById,
  updatePedidoEstado,
  getMisPedidos,
} from "../controllers/orders.controller.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { auth, requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/", auth, crearPedido);
router.get("/mis-pedidos", requireAuth, getMisPedidos);
router.get("/", adminAuth, getPedidos);
router.get("/:id", adminAuth, getPedidoById);
router.patch("/:id", adminAuth, updatePedidoEstado);

export default router;