"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSchema = void 0;
const zod_1 = require("zod");
exports.paymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingId: zod_1.z.coerce.number(),
        amount: zod_1.z.coerce.number().min(1),
        method: zod_1.z.string().min(1),
        transaction_id: zod_1.z.string().optional(),
    }),
});
