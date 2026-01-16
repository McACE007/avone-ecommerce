import { Router } from "express";
import { authenticateJwt, isSuperAdmin } from "../middlewares/authMiddleware";
import {
  addFeatureBanners,
  fetchFeatureBanners,
  fetchFeaturedProducts,
  updateFeaturedProducts,
} from "../controllers/settingsController";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

router.post(
  "/add-feature-banners",
  authenticateJwt,
  isSuperAdmin,
  upload.array("images"),
  addFeatureBanners
);

router.get("/fetch-feature-banners", authenticateJwt, fetchFeatureBanners);

router.put(
  "/update-featured-products",
  authenticateJwt,
  isSuperAdmin,
  updateFeaturedProducts
);

router.get("/fetch-featured-products", authenticateJwt, fetchFeaturedProducts);

export default router;
