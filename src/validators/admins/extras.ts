import { z } from "zod";

export const createExtraSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
});

export const updateExtraSchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    name: z.string().optional(),
  }),
});
