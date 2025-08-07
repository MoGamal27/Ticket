import { z } from "zod";

export const createCitySchema = z.object({
  body: z.object({
    name: z.string(),
    countryId: z.coerce.number(),
  }),
});

export const updateCitySchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    name: z.string().optional(),
    countryId: z.coerce.number().optional(),
  }),
});
