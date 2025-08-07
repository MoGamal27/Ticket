"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTourSchema = void 0;
const zod_1 = require("zod");
exports.createTourSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1),
        mainImage: zod_1.z.string(),
        description: zod_1.z.string(),
        featured: zod_1.z.boolean().optional().default(false),
        status: zod_1.z.boolean().optional().default(false),
        startDate: zod_1.z.string(),
        endDate: zod_1.z.string(),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        durationDays: zod_1.z.number().int().nonnegative(),
        durationHours: zod_1.z.number().int().nonnegative(),
        country: zod_1.z.number(),
        city: zod_1.z.number(),
        maxUsers: zod_1.z.number().int().positive(),
        categoryId: zod_1.z.number().int().positive(),
        prices: zod_1.z
            .array(zod_1.z.object({
            adult: zod_1.z.number().nonnegative(),
            child: zod_1.z.number().nonnegative(),
            infant: zod_1.z.number().nonnegative(),
            currencyId: zod_1.z.number().int().positive(),
        }))
            .min(1),
        highlights: zod_1.z.array(zod_1.z.string().min(1)).optional(),
        includes: zod_1.z.array(zod_1.z.string().min(1)).optional(),
        excludes: zod_1.z.array(zod_1.z.string().min(1)).optional(),
        itinerary: zod_1.z
            .array(zod_1.z.object({
            title: zod_1.z.string(),
            imagePath: zod_1.z.string().optional(),
            description: zod_1.z.string().optional(),
        }))
            .optional(),
        faq: zod_1.z
            .array(zod_1.z.object({
            question: zod_1.z.string(),
            answer: zod_1.z.string(),
        }))
            .optional(),
        discounts: zod_1.z
            .array(zod_1.z.object({
            targetGroup: zod_1.z.enum(["adult", "child", "infant"]),
            type: zod_1.z.enum(["percent", "fixed"]),
            value: zod_1.z.number().nonnegative(),
            minPeople: zod_1.z.number().int().nonnegative().optional().default(0),
            maxPeople: zod_1.z.number().int().positive().optional(),
        }))
            .optional(),
        daysOfWeek: zod_1.z
            .array(zod_1.z.enum([
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ]))
            .nonempty(),
        extras: zod_1.z
            .array(zod_1.z.object({
            extraId: zod_1.z.number().int().positive(),
            price: zod_1.z.object({
                adult: zod_1.z.number().nonnegative(),
                child: zod_1.z.number().nonnegative(),
                infant: zod_1.z.number().nonnegative(),
                currencyId: zod_1.z.number().int().positive(),
            }),
        }))
            .optional(),
    }),
});
