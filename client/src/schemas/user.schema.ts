import z from "zod";

export const userRegistrationSchema = z.object({
  name: z.string().min(5).max(30),
  email: z.string().email(),
  password: z.string().min(1),
});

export const userLoginSchema = z.object({
  email: z.string().email().min(3).max(20),
  password: z.string().min(1),
});
