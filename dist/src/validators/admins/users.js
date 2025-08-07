"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParams = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, { message: "name must be at least 2 characters" }),
        password: zod_1.z.string().min(8, { message: "name must be at least 8 digit" }),
        phoneNumber: zod_1.z.string(),
        email: zod_1.z.string().email(),
    }),
});
exports.updateUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number(),
    }),
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, { message: "name must be at least 2 characters" })
            .optional(),
        password: zod_1.z
            .string()
            .min(8, { message: "name must be at least 8 digit" })
            .optional(),
        phoneNumber: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
    }),
});
exports.idParams = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number(),
    }),
});
