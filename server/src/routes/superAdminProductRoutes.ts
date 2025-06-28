import { Router } from "express";
import { authenticateJwt, isSuperAdmin } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/superAdminProductController";

const router = Router();

router.post(
  "/",
  authenticateJwt,
  isSuperAdmin,
  upload.array("images", 5),
  createProduct
);
router.get("/", authenticateJwt, isSuperAdmin, getAllProducts);
router.put("/:productId", authenticateJwt, isSuperAdmin, updateProduct);
router.delete("/:productId", authenticateJwt, isSuperAdmin, deleteProduct);

export default router;
