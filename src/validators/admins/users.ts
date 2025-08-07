import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, { message: "name must be at least 2 characters" }),
    password: z.string().min(8, { message: "name must be at least 8 digit" }),
    phoneNumber: z.string(),
    email: z.string().email(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    name: z
      .string()
      .min(2, { message: "name must be at least 2 characters" })
      .optional(),
    password: z
      .string()
      .min(8, { message: "name must be at least 8 digit" })
      .optional(),
    phoneNumber: z.string().optional(),
    email: z.string().email().optional(),
  }),
});

export const idParams = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
});
