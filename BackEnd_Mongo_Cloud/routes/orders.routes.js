import { Router } from "express";
import {
  crearPedido,
  getPedidos,
  getPedidoById,
} from "../controllers/orders.controller.js";

const router = Router();

router.post("/", crearPedido);
router.get("/", getPedidos);
router.get("/:id", getPedidoById);

export default router;