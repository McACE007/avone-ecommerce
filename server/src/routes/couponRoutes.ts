import { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  fetchAllCoupons,
} from "../controllers/couponController";
import { authenticateJwt, isSuperAdmin } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authenticateJwt, isSuperAdmin, fetchAllCoupons);
router.post("/", authenticateJwt, isSuperAdmin, createCoupon);
router.delete("/:couponId", authenticateJwt, isSuperAdmin, deleteCoupon);

export default router;
