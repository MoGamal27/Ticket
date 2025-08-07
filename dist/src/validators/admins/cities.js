"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCitySchema = exports.createCitySchema = void 0;
const zod_1 = require("zod");
exports.createCitySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        countryId: zod_1.z.coerce.number(),
    }),
});
exports.updateCitySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number(),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        countryId: zod_1.z.coerce.number().optional(),
    }),
});
