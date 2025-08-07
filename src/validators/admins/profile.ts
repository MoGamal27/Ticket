import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string().optional(),
      phoneNumber: z.string().optional(),
      imagePath: z.string().optional(),
    })
    .refine((data) => !data.password || data.password.length >= 8, {
      message: "Password must be at least 8 characters long",
      path: ["password"],
    }),
});
