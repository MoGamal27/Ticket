"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePrivileg = exports.createPrivileg = void 0;
const zod_1 = require("zod");
exports.createPrivileg = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
    }),
});
exports.updatePrivileg = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number(),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
    }),
});
