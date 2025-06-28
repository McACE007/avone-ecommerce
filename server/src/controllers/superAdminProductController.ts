import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/productSchemas";
import cloudinary from "../config/cloudinary";
import { primsa } from "../server";
import { unlinkSync } from "fs";

export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { success, error, data } = createProductSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({ success, error });
      return;
    }

    const files = req.files as Express.Multer.File[];

    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "avone-ecommerce",
      })
    );

    const uploadResults = await Promise.all(uploadPromises);

    const imageUrls = uploadResults.map((result) => result.secure_url);

    const product = await primsa.product.create({
      data: {
        ...data,
        sizes: data.sizes.split(","),
        colors: data.colors.split(","),
        images: imageUrls,
        soldCount: 0,
        rating: 0,
      },
    });

    files.forEach((file) => unlinkSync(file.path));

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

export const getAllProducts = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const products = await primsa.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch products" });
  }
};

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

export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { success, error, data } = updateProductSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({ success, error });
      return;
    }

    const product = await primsa.product.update({
      where: {
        id: productId,
      },
      data: {
        ...data,
        sizes: data.sizes.split(","),
        colors: data.colors.split(","),
      },
    });

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to update product" });
  }
};

export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    await primsa.product.delete({ where: { id: productId } });
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfull!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to delete product" });
  }
};
