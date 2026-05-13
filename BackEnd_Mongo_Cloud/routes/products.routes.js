import { Router } from "express";
import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct
} from "../controllers/products.controller.js";
import { upload } from "../middlewares/upload.js";
const router = Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", upload.array("images"), addProduct);
router.put("/:id", upload.single("image"), updateProduct);

router.delete("/:id", deleteProduct);

export default router;
