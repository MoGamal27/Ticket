import { z } from "zod";

export const createCodeSchema = z.object({
  body: z
    .object({
      code: z.string(),
      discountType: z.enum(["percentage", "amount"]),
      discountValue: z.number().positive(),
      usageLimit: z.number(),
      status: z.boolean(),
      startDate: z.string(),
      endDate: z.string(),
    })
    .refine(
      (data) => data.discountType !== "percentage" || data.discountValue <= 100,
      {
        message: "Percentage discount cannot exceed 100",
        path: ["discountValue"],
      }
    ),
});

export const updateCodeSchema = z.object({
  body: z
    .object({
      code: z.string().optional(),
      discountType: z.enum(["percentage", "amount"]).optional(),
      discountValue: z.number().positive().optional(),
      usageLimit: z.number().optional(),
      status: z.boolean().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
    .refine(
      (data) =>
        data.discountType !== "percentage" || data.discountValue! <= 100,
      {
        message: "Percentage discount cannot exceed 100",
        path: ["discountValue"],
      }
    ),
});
