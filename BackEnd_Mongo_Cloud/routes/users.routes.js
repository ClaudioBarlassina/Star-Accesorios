import { Router } from "express";
import { getUsers } from "../controllers/users.controller.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = Router();

router.get("/", adminAuth, getUsers);

export default router;
