import z from "zod";

export const createProductSchema = z.object({
  name: z.string().min(5).max(30),
  brand: z.string().min(5).max(20),
  description: z.string().min(10).max(50),
  category: z.string().min(3).max(15),
  gender: z.string().min(4).max(6),
  sizes: z.string().min(1),
  colors: z.string().min(1),
  price: z.coerce.number(),
  stock: z.coerce.number(),
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
