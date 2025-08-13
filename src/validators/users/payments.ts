import {z} from "zod";

export const paymentSchema = z.object({
  body: z.object({
    bookingId: z.coerce.number(),
    amount: z.coerce.number().min(1),
    method: z.string().min(1),
    transaction_id: z.string().optional(),
  }),
});
