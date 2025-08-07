import { z } from "zod";

export const createCurrencySchema = z.object({
  body: z.object({
    code: z.string().length(3),
    name: z.string(),
    symbol: z.string(),
  }),
});

export const updateCurrencySchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    code: z.string().length(3).optional(),
    name: z.string().optional(),
    symbol: z.string().optional(),
  }),
});
