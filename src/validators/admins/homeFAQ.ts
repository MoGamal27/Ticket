import { z } from "zod";

export const createFAQSchema = z.object({
  body: z.object({
    question: z.string(),
    answer: z.string(),
  }),
});

export const updateFAQSchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    question: z.string().optional(),
    answer: z.string().optional(),
  }),
});
