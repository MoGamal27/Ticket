"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = void 0;
const zod_1 = require("zod");
exports.updateCategorySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number(),
    }),
    body: zod_1.z.object({
        status: zod_1.z.boolean().optional(),
        imagePath: zod_1.z.string().optional(),
    }),
});
