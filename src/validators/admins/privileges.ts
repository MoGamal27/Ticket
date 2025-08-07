import { z } from "zod";

export const createPrivileg = z.object({
  body: z.object({
    name: z.string(),
  }),
});

export const updatePrivileg = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    name: z.string().optional(),
  }),
});
