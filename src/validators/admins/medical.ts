import { z } from "zod";

export const createMedicalCategorySchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255),
  }),
});

export const updateMedicalCategorySchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255).optional(),
  }),
});

export const idParams = z.object({
  params: z.object({
    id: z.number().int().positive(),
  }),
});