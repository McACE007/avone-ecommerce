import {
  brands,
  categories,
  colorNames,
  colors,
  genders,
  sizes,
} from "@/constants/product.constants";
import z, { any } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Product name must be at least 5 characters long" })
    .max(30, { message: "Product name must not exceed 30 characters" }),

  brand: z.string().min(1, "Please select a brand"),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(50, { message: "Description must not exceed 50 characters" }),

  category: z.string().min(1, "Please select a category"),
  gender: z.string().min(1, "Please select a gender"),
  sizes: z
    .array(z.enum(sizes, { errorMap: () => ({ message: "Invalid size" }) }))
    .min(1, { message: "Select at least one size" }),

  colors: z
    .array(
      z.enum(colorNames, { errorMap: () => ({ message: "Invalid color" }) })
    )
    .min(1, { message: "Select at least one color" }),

  price: z.coerce
    .number({
      invalid_type_error: "Price must be a number",
    })
    .min(0, { message: "Price must be a positive number" }),

  stock: z.coerce
    .number({
      invalid_type_error: "Stock must be a number",
    })
    .min(0, { message: "Stock must be a positive number" }),

  images: z
    .any()
    .refine((files) => files instanceof FileList && files.length > 0, {
      message: "At least one image is required",
    }),
});

export const updateProductSchema = z.object({
  name: z.string().min(5).max(30),
  brand: z.string().min(5).max(20),
  description: z.string().min(10).max(50),
  category: z.string().min(3).max(15),
  gender: z.string().min(4).max(6),
  sizes: z.string().min(1),
  colors: z.string().min(3),
  price: z.number(),
  stock: z.number(),
  soldCount: z.number(),
  rating: z.number(),
});
