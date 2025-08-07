"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailSchema = exports.loginSchema = exports.signupSchema = exports.resetPasswordSchema = exports.verifyCodeSchema = exports.forgetPasswordSchema = void 0;
const zod_1 = require("zod");
exports.forgetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
    }),
});
exports.verifyCodeSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        code: zod_1.z.string().length(6),
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8),
    }),
});
exports.signupSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8),
        phoneNumber: zod_1.z.string().min(9),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8),
    }),
});
exports.verifyEmailSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.coerce.number(),
        code: zod_1.z.string().length(6),
    }),
});
