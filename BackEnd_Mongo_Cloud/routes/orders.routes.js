import { Router } from "express";
import {
  crearPedido,
  getPedidos,
  getPedidoById,
  updatePedidoEstado,
} from "../controllers/orders.controller.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = Router();

router.post("/", crearPedido);
router.get("/", adminAuth, getPedidos);
router.get("/:id", adminAuth, getPedidoById);
router.patch("/:id", adminAuth, updatePedidoEstado);

export default router;