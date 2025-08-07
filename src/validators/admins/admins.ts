import { z } from "zod";

export const createAdminSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    imagePath: z.string().optional(),
    isSuperAdmin: z.enum(["admin", "superAdmin"]),
    phoneNumber: z.string(),
  }),
});

export const updateAdminSchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8).optional(),
    imagePath: z.string().optional(),
    isSuperAdmin: z.enum(["admin", "superAdmin"]).optional(),
    phoneNumber: z.string(),
  }),
});

export const addPrivilegesAdminSchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    privilegesIds: z.array(z.number()).min(1),
  }),
});
