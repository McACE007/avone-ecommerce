import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { createCouponSchema } from "../schemas/couponSchemas";
import { primsa } from "../server";

export const createCoupon = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { success, error, data } = createCouponSchema.safeParse(req.body);

    if (!success) {
      console.error(error);
      res
        .status(400)
        .json({
          success,
          error: error.issues.map((issue) => issue.message).join(", "),
        });
      return;
    }

    const newCoupon = await primsa.coupon.create({
      data: {
        ...data,
        usageCount: 0,
      },
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully!",
      coupon: newCoupon,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to create coupon" });
  }
};

export const fetchAllCoupons = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const coupons = await primsa.coupon.findMany();
    res.status(200).json({
      success: true,
      message: "Fetched coupon list successfully",
      coupons,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch coupon list" });
  }
};

export const deleteCoupon = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { couponId } = req.params;

    await primsa.coupon.delete({
      where: {
        id: couponId,
      },
    });

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to delete coupon" });
  }
};
