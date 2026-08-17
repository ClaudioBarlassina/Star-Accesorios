import { Router } from "express";
import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  bulkCreateProducts,
} from "../controllers/products.controller.js";
import { upload } from "../middlewares/upload.js";
import { adminAuth } from "../middlewares/adminAuth.js";
const router = Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", adminAuth, upload.array("images"), addProduct);
router.post("/bulk", adminAuth, upload.array("images", 60), bulkCreateProducts);
router.put("/:id", adminAuth, upload.array("images"), updateProduct);

router.delete("/:id", adminAuth, deleteProduct);

export default router;
