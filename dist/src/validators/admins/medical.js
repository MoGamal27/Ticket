"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParams = exports.updateMedicalCategorySchema = exports.createMedicalCategorySchema = void 0;
const zod_1 = require("zod");
exports.createMedicalCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).max(255),
    }),
});
exports.updateMedicalCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).max(255).optional(),
    }),
});
exports.idParams = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.number().int().positive(),
    }),
});
