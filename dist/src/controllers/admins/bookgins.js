"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingsStats = exports.getBookings = void 0;
const db_1 = require("../../models/db");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const getBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const books = yield db_1.db
        .select({
        id: schema_1.bookings.id,
        status: schema_1.bookings.status,
        createdAt: schema_1.bookings.createdAt,
        userName: schema_1.users.name,
        tourName: schema_1.tours.title,
    })
        .from(schema_1.bookings)
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.bookings.userId, schema_1.users.id))
        .leftJoin(schema_1.tours, (0, drizzle_orm_1.eq)(schema_1.bookings.tourId, schema_1.tours.id));
    (0, response_1.SuccessResponse)(res, { bookings: books }, 200);
});
exports.getBookings = getBookings;
const getBookingsStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [{ bookingCount }] = yield db_1.db
        .select({ bookingCount: (0, drizzle_orm_1.sql) `COUNT(*)` })
        .from(schema_1.bookings);
    const [{ bookingPendingCount }] = yield db_1.db
        .select({ bookingPendingCount: (0, drizzle_orm_1.sql) `COUNT(*)` })
        .from(schema_1.bookings)
        .where((0, drizzle_orm_1.eq)(schema_1.bookings.status, "pending"));
    const [{ bookingConfirmedCount }] = yield db_1.db
        .select({ bookingConfirmedCount: (0, drizzle_orm_1.sql) `COUNT(*)` })
        .from(schema_1.bookings)
        .where((0, drizzle_orm_1.eq)(schema_1.bookings.status, "confirmed"));
    const [{ bookingCancelledCount }] = yield db_1.db
        .select({ bookingCancelledCount: (0, drizzle_orm_1.sql) `COUNT(*)` })
        .from(schema_1.bookings)
        .where((0, drizzle_orm_1.eq)(schema_1.bookings.status, "cancelled"));
    const today = new Date();
    const [{ bookingcompletedCount }] = yield db_1.db
        .select({
        bookingcompletedCount: (0, drizzle_orm_1.sql) `COUNT(*)`,
    })
        .from(schema_1.bookings)
        .leftJoin(schema_1.tourSchedules, (0, drizzle_orm_1.eq)(schema_1.bookings.tourId, schema_1.tourSchedules.id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.bookings.status, "confirmed"), (0, drizzle_orm_1.lt)(schema_1.tourSchedules.startDate, today)));
    (0, response_1.SuccessResponse)(res, {
        bookingCount,
        bookingPendingCount,
        bookingConfirmedCount,
        bookingCancelledCount,
        bookingcompletedCount,
    });
});
exports.getBookingsStats = getBookingsStats;
