import { z } from "zod";

export const createCountrySchema = z.object({
  body: z.object({
    name: z.string(),
    imagePath: z.string(),
  }),
});

export const updateCountrySchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    name: z.string().optional(),
    imagePath: z.string().optional(),
  }),
});
