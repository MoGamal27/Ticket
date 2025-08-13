import{z} from"zod";

export const bookingSchema = z.object({
  body: z.object({
    tourId: z.coerce.number(),
    tourScheduleId: z.coerce.number(),
    adultCount: z.coerce.number().min(1),
    childCount: z.coerce.number().min(0),
    infantCount: z.coerce.number().min(0),
  }),
});
