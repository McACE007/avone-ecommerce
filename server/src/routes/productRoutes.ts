import { Router } from "express";
import { authenticateJwt } from "../middlewares/authMiddleware";
import { getProductById } from "../controllers/productController";

const router = Router();

router.get("/:productId", authenticateJwt, getProductById);

export default router;
