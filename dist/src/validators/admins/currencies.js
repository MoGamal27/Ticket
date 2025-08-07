"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCurrencySchema = exports.createCurrencySchema = void 0;
const zod_1 = require("zod");
exports.createCurrencySchema = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z.string().length(3),
        name: zod_1.z.string(),
        symbol: zod_1.z.string(),
    }),
});
exports.updateCurrencySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number(),
    }),
    body: zod_1.z.object({
        code: zod_1.z.string().length(3).optional(),
        name: zod_1.z.string().optional(),
        symbol: zod_1.z.string().optional(),
    }),
});
