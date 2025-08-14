import { use } from "passport";
import { z } from "zod";

export const getImagesSchema = z.object({
  params: z.object({}).optional(), // مفيش Params
  query: z.object({}).optional(),  // مفيش Query
});

export const getFeaturedToursSchema = z.object({
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});


export const getToursByCategorySchema = z.object({
  params: z.object({
    category: z.string().min(1, "Category is required"),
  }),
});


export const getTourByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a number"),
  }),
});


export const getBookingWithDetailsSchema = z.object({
  params: z.object({
    bookingId: z.string().regex(/^\d+$/, "Booking ID must be a number"),
  }),
});


export const createBookingWithPaymentSchema = z.object({
  body: z.object({
    tourId: z.union([z.string(), z.number()]),
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(5, "Phone number is too short"),
    notes: z.string().optional(),
    adultsCount: z.number().int().nonnegative().optional(),
    childrenCount: z.number().int().nonnegative().optional(),
    infantsCount: z.number().int().nonnegative().optional(),
    totalAmount: z.number().positive("Total amount must be positive"),
    paymentMethodId: z.number().int().optional(),
    proofImage: z.string().optional(),
    extras: z.array(
      z.object({
        id: z.number().int(),
        count: z.object({
          adult: z.string().optional(),
          child: z.string().optional(),
          infant: z.string().optional(),
        }),
      })
    ).optional(),
  }),
});




export const getActivePaymentMethodsSchema = z.object({
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const medicalRecordSchema = z.object({
  fullName: z.string().min(1),
  phoneNumber: z.string().min(1),
  email: z.string().email(),
  categoryIds: z.array(z.number()).min(1),
  describtion: z.string().min(1),
  images: z.array(z.string()).optional(),
});