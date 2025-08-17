import { z } from "zod";

export const createTourSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    mainImage: z.string(),
    description: z.string(),
    featured: z.boolean().optional().default(false),
    status: z.boolean().optional().default(false),
    startDate: z.string(),
    endDate: z.string(),
    images: z.array(z.string()).optional(),
    durationDays: z.number().int().nonnegative(),
    durationHours: z.number().int().nonnegative(),
    country: z.number(),
    city: z.number(),
    maxUsers: z.number().int().positive(),
    categoryId: z.number().int().positive(),

    prices: z
      .array(
        z.object({
          adult: z.number().nonnegative(),
          child: z.number().nonnegative(),
          infant: z.number().nonnegative(),
          currencyId: z.number().int().positive(),
        })
      )
      .min(1),

    highlights: z.array(z.string().min(1)).optional(),
    includes: z.array(z.string().min(1)).optional(),
    excludes: z.array(z.string().min(1)).optional(),

    itinerary: z
      .array(
        z.object({
          title: z.string(),
          imagePath: z.string().optional(),
          description: z.string().optional(),
        })
      )
      .optional(),

    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .optional(),

    discounts: z
      .array(
        z.object({
          targetGroup: z.enum(["adult", "child", "infant"]),
          type: z.enum(["percent", "fixed"]),
          value: z.number().nonnegative(),
          minPeople: z.number().int().nonnegative().optional().default(0),
          maxPeople: z.number().int().positive().optional(),
        })
      )
      .optional(),

    daysOfWeek: z
      .array(
        z.enum([
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ])
      )
      .nonempty(),

    extras: z
      .array(
        z.object({
          extraId: z.number().int().positive(),
          price: z.object({
            adult: z.number().nonnegative(),
            child: z.number().nonnegative(),
            infant: z.number().nonnegative(),
            currencyId: z.number().int().positive(),
          }),
        })
      )
      .optional(),
  }),
});



export const updateTourSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    mainImage: z.string().optional(),
    description: z.string().optional(),
    status: z.boolean().optional(),
    featured: z.boolean().optional(),
    meetingPoint: z.boolean().optional(),
    meetingPointLocation: z.string().optional(),
    meetingPointAddress: z.string().optional(),
    points: z.number().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    durationDays: z.number().int().nonnegative().optional(),
    durationHours: z.number().int().nonnegative().optional(),
    country: z.number().optional(),
    city: z.number().optional(),
    maxUsers: z.number().int().positive().optional(),
    categoryId: z.number().int().positive().optional(),

    prices: z
      .array(
        z.object({
          adult: z.number().nonnegative(),
          child: z.number().nonnegative(),
          infant: z.number().nonnegative(),
          currencyId: z.number().int().positive(),
        })
      )
      .optional(),

    highlights: z.array(z.string().min(1)).optional(),
    includes: z.array(z.string().min(1)).optional(),
    excludes: z.array(z.string().min(1)).optional(),

    /*itinerary: z
      .array(
        z.object({
          title: z.string(),
          imagePath: z.string().optional(),
          description: z.string().optional(),
        })
      )
      .optional(),
      */ 
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .optional(),

    discounts: z
      .array(
        z.object({
          targetGroup: z.enum(["adult", "child", "infant"]),
          type: z.enum(["percent", "fixed"]),
          value: z.number().nonnegative(),
          minPeople: z.number().int().nonnegative().optional().default(0),
          maxPeople: z.number().int().positive().optional(),
        })
      )
      .optional(),

    daysOfWeek: z
      .array(
        z.enum([
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ])
      )
      .optional(),

    extras: z
      .array(
        z.object({
          extraId: z.number().int().positive(),
          price: z.object({
            adult: z.number().nonnegative(),
            child: z.number().nonnegative(),
            infant: z.number().nonnegative(),
            currencyId: z.number().int().positive(),
          }),
        })
      )
      .optional(),
  }),
});

