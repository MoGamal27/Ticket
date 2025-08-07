"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentMethods = exports.createPaymentMethods = void 0;
const zod_1 = require("zod");
exports.createPaymentMethods = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        describtion: zod_1.z.string(),
        logoPath: zod_1.z.string(),
        status: zod_1.z.boolean(),
    }),
});
exports.updatePaymentMethods = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        describtion: zod_1.z.string().optional(),
        logoPath: zod_1.z.string().optional(),
        status: zod_1.z.boolean().optional(),
    }),
});
