"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicalRecordSchema = exports.getActivePaymentMethodsSchema = exports.createBookingWithPaymentSchema = exports.getBookingWithDetailsSchema = exports.getTourByIdSchema = exports.getToursByCategorySchema = exports.getFeaturedToursSchema = exports.getImagesSchema = void 0;
const zod_1 = require("zod");
exports.getImagesSchema = zod_1.z.object({
    params: zod_1.z.object({}).optional(), // مفيش Params
    query: zod_1.z.object({}).optional(), // مفيش Query
});
exports.getFeaturedToursSchema = zod_1.z.object({
    params: zod_1.z.object({}).optional(),
    query: zod_1.z.object({}).optional(),
});
exports.getToursByCategorySchema = zod_1.z.object({
    params: zod_1.z.object({
        category: zod_1.z.string().min(1, "Category is required"),
    }),
});
exports.getTourByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, "ID must be a number"),
    }),
});
exports.getBookingWithDetailsSchema = zod_1.z.object({
    params: zod_1.z.object({
        bookingId: zod_1.z.string().regex(/^\d+$/, "Booking ID must be a number"),
    }),
});
exports.createBookingWithPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        tourId: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]),
        fullName: zod_1.z.string().min(1, "Full name is required"),
        email: zod_1.z.string().email("Invalid email address"),
        phone: zod_1.z.string().min(5, "Phone number is too short"),
        notes: zod_1.z.string().optional(),
        adultsCount: zod_1.z.number().int().nonnegative().optional(),
        childrenCount: zod_1.z.number().int().nonnegative().optional(),
        infantsCount: zod_1.z.number().int().nonnegative().optional(),
        totalAmount: zod_1.z.number().positive("Total amount must be positive"),
        paymentMethodId: zod_1.z.number().int().optional(),
        proofImage: zod_1.z.string().optional(),
        extras: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.number().int(),
            count: zod_1.z.object({
                adult: zod_1.z.string().optional(),
                child: zod_1.z.string().optional(),
                infant: zod_1.z.string().optional(),
            }),
        })).optional(),
    }),
});
exports.getActivePaymentMethodsSchema = zod_1.z.object({
    params: zod_1.z.object({}).optional(),
    query: zod_1.z.object({}).optional(),
});
exports.medicalRecordSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1),
    phoneNumber: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    categoryIds: zod_1.z.array(zod_1.z.number()).min(1),
    describtion: zod_1.z.string().min(1),
    images: zod_1.z.array(zod_1.z.string()).optional(),
});
