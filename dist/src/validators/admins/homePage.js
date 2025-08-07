"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHomePageCoverSchema = exports.createHomePageCoverSchema = void 0;
const zod_1 = require("zod");
exports.createHomePageCoverSchema = zod_1.z.object({
    body: zod_1.z.object({
        imagePath: zod_1.z.string(),
        status: zod_1.z.boolean(),
    }),
});
exports.updateHomePageCoverSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number(),
    }),
    body: zod_1.z.object({
        imagePath: zod_1.z.string().optional(),
        status: zod_1.z.boolean().optional(),
    }),
});
