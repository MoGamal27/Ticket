"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFAQSchema = exports.createFAQSchema = void 0;
const zod_1 = require("zod");
exports.createFAQSchema = zod_1.z.object({
    body: zod_1.z.object({
        question: zod_1.z.string(),
        answer: zod_1.z.string(),
    }),
});
exports.updateFAQSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number(),
    }),
    body: zod_1.z.object({
        question: zod_1.z.string().optional(),
        answer: zod_1.z.string().optional(),
    }),
});
