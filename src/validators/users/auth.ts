import { z } from "zod";

export const forgetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const verifyCodeSchema = z.object({
  body: z.object({
    email: z.string().email(),
    code: z.string().length(6),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export const signupSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    phoneNumber: z.string().min(9),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    userId: z.coerce.number(),
    code: z.string().length(6),
  }),
});
