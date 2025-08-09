"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeStatusSchema = void 0;
const zod_1 = require("zod");
exports.changeStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number(),
    }),
    body: zod_1.z
        .object({
        status: zod_1.z.enum(["pending", "confirmed", "cancelled"]),
        rejectionReason: zod_1.z.string().optional(),
    })
        .refine((data) => !(data.status === "cancelled" && !data.rejectionReason), {
        message: "Should Provide Rejection Reason"
    }),
});
