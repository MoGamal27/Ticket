import { z } from "zod";

export const createPaymentMethods = z.object({
  body: z.object({
    name: z.string(),
    describtion: z.string(),
    logoPath: z.string(),
    status: z.boolean(),
  }),
});

export const updatePaymentMethods = z.object({
  body: z.object({
    name: z.string().optional(),
    describtion: z.string().optional(),
    logoPath: z.string().optional(),
    status: z.boolean().optional(),
  }),
});
