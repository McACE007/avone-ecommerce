import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { primsa } from "../server";

export const getProductById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    const product = await primsa.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch product" });
  }
};
