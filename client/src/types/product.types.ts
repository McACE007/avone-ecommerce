import {
  createProductSchema,
  updateProductSchema,
} from "@/schemas/product.schema";
import z from "zod";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  gender: string;
  sizes: string[];
  colors: string[];
  price: number;
  stock: number;
  soldCount: number;
  rating?: number;
  images: string[];
}

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
