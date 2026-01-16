import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import cloudinary from "../config/cloudinary";
import { primsa } from "../server";
import fs from "fs";
import { fetchFeatureBannersSchema } from "../schemas/settingsSchemas";

export const addFeatureBanners = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(404).json({ success: false, error: "Files not provided" });
      return;
    }

    const uploadPromies = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "ecommerce-feature-bannners",
      })
    );

    const uploadResults = await Promise.all(uploadPromies);

    const banners = await Promise.all(
      uploadResults.map((res) =>
        primsa.featureBanner.create({
          data: {
            imageUrl: res.secure_url,
          },
        })
      )
    );

    files.forEach((file) => fs.unlinkSync(file.path));

    res.status(201).json({ success: true, banners });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Falied to add feature bannners" });
  }
};

export const fetchFeatureBanners = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const banners = await primsa.featureBanner.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ success: true, banners });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Falied to fetch feature bannners" });
  }
};

export const updateFeaturedProducts = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { success, error, data } = fetchFeatureBannersSchema.safeParse(
      req.body
    );

    if (!success) {
      res.status(400).json({
        success,
        error: error.issues.map((issue) => issue.message).join(", "),
      });
      return;
    }

    await primsa.product.updateMany({
      data: {
        isFeatured: false,
      },
    });

    await primsa.product.updateMany({
      where: {
        id: {
          in: data.productIds,
        },
      },
      data: {
        isFeatured: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Featured products updated successfully!",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Falied to update featured products" });
  }
};

export const fetchFeaturedProducts = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const featuredProducts = await primsa.product.findMany({
      where: {
        isFeatured: true,
      },
    });

    res.status(200).json({ success: true, featuredProducts });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Falied to fetch featured products" });
  }
};
