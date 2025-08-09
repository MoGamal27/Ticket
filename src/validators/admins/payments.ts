import { z } from "zod";

export const changeStatusSchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z
    .object({
      status: z.enum(["pending", "confirmed", "cancelled"]),
      rejectionReason: z.string().optional(),
    })
    .refine(
      (data) => !(data.status === "cancelled" && !data.rejectionReason),
      {
        message: "Should Provide Rejection Reason"
      }
    ),
});
