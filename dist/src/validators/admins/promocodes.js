"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCodeSchema = exports.createCodeSchema = void 0;
const zod_1 = require("zod");
exports.createCodeSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        code: zod_1.z.string(),
        discountType: zod_1.z.enum(["percentage", "amount"]),
        discountValue: zod_1.z.number().positive(),
        usageLimit: zod_1.z.number(),
        status: zod_1.z.boolean(),
        startDate: zod_1.z.string(),
        endDate: zod_1.z.string(),
    })
        .refine((data) => data.discountType !== "percentage" || data.discountValue <= 100, {
        message: "Percentage discount cannot exceed 100",
        path: ["discountValue"],
    }),
});
exports.updateCodeSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        code: zod_1.z.string().optional(),
        discountType: zod_1.z.enum(["percentage", "amount"]).optional(),
        discountValue: zod_1.z.number().positive().optional(),
        usageLimit: zod_1.z.number().optional(),
        status: zod_1.z.boolean().optional(),
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
    })
        .refine((data) => data.discountType !== "percentage" || data.discountValue <= 100, {
        message: "Percentage discount cannot exceed 100",
        path: ["discountValue"],
    }),
});
