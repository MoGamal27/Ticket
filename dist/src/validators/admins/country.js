"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCountrySchema = exports.createCountrySchema = void 0;
const zod_1 = require("zod");
exports.createCountrySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        imagePath: zod_1.z.string(),
    }),
});
exports.updateCountrySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number(),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        imagePath: zod_1.z.string().optional(),
    }),
});
