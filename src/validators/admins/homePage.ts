import { z } from "zod";

export const createHomePageCoverSchema = z.object({
  body: z.object({
    imagePath: z.string(),
    status: z.boolean(),
  }),
});

export const updateHomePageCoverSchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    imagePath: z.string().optional(),
    status: z.boolean().optional(),
  }),
});
