import z from "zod";

export const createCouponSchema = z
  .object({
    code: z
      .string()
      .nonempty("Coupon code is required")
      .length(8, "Coupon code must be exactly 8 characters long")
      .regex(
        /^[A-Z0-9]+$/,
        "Coupon code can only contain uppercase letters and numbers"
      ),

    discountPercentage: z.coerce
      .number({
        invalid_type_error: "Discount percentage must be a number",
        required_error: "Discount percentage is required",
      })
      .min(1, "Discount must be at least 1%")
      .max(100, "Discount can't be more than 100%"),

    startDate: z.coerce.date({
      required_error: "Start date is required",
      invalid_type_error: "Start date must be a valid date",
    }),

    endDate: z.coerce.date({
      required_error: "End date is required",
      invalid_type_error: "End date must be a valid date",
    }),

    usageLimit: z.coerce
      .number({
        invalid_type_error: "Usage limit must be a number",
        required_error: "Usage limit is required",
      })
      .int("Usage limit must be an integer")
      .positive("Usage limit must be greater than 0"),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
