"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPrivilegesAdminSchema = exports.updateAdminSchema = exports.createAdminSchema = void 0;
const zod_1 = require("zod");
exports.createAdminSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8),
        imagePath: zod_1.z.string().optional(),
        isSuperAdmin: zod_1.z.enum(["admin", "superAdmin"]),
        phoneNumber: zod_1.z.string(),
    }),
});
exports.updateAdminSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number(),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string(),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8).optional(),
        imagePath: zod_1.z.string().optional(),
        isSuperAdmin: zod_1.z.enum(["admin", "superAdmin"]).optional(),
        phoneNumber: zod_1.z.string(),
    }),
});
exports.addPrivilegesAdminSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number(),
    }),
    body: zod_1.z.object({
        privilegesIds: zod_1.z.array(zod_1.z.number()).min(1),
    }),
});
