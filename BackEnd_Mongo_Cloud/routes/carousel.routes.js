import { Router } from "express";
import {
  getCarousel,
  addCarouselImages,
  removeCarouselImage,
} from "../controllers/carousel.controller.js";
import { upload } from "../middlewares/upload.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = Router();

router.get("/", getCarousel);
router.post("/", adminAuth, upload.array("images", 15), addCarouselImages);
router.delete("/", adminAuth, removeCarouselImage);

export default router;
