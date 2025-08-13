"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingSchema = void 0;
const zod_1 = require("zod");
exports.bookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        tourId: zod_1.z.coerce.number(),
        tourScheduleId: zod_1.z.coerce.number(),
        adultCount: zod_1.z.coerce.number().min(1),
        childCount: zod_1.z.coerce.number().min(0),
        infantCount: zod_1.z.coerce.number().min(0),
    }),
});
