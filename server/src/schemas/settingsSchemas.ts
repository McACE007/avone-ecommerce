import z from "zod";

export const fetchFeatureBannersSchema = z.object({
  productIds: z
    .array(z.string().nonempty("productId can't be empty"))
    .min(1, "Must have atleast one productId")
    .max(8, "Too many requests"),
});

export type fetchFeatureBannersInput = z.infer<
  typeof fetchFeatureBannersSchema
>;
