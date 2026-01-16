import z from "zod";

export const updateSettingsSchema = z.object({
  images: z
    .any()
    .refine((images) => images instanceof FileList && images.length > 0, {
      message: "Must upload atleast one image",
    }),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
