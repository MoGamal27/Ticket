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
exports.createBooking = exports.getBookingsStats = exports.getBookings = exports.formatDate = void 0;
const db_1 = require("../../models/db");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};
exports.formatDate = formatDate;
const getBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // First, get the main bookings with user, tour schedule, and tour info
    const mainBookings = yield db_1.db
        .select({
        id: schema_1.bookings.id,
        status: schema_1.bookings.status,
        createdAt: schema_1.bookings.createdAt,
        discountNumber: schema_1.bookings.discountNumber,
        location: schema_1.bookings.location,
        address: schema_1.bookings.address,
        // Tour info (via tourSchedule -> tour relationship)
        tourId: schema_1.tours.id,
        tourName: schema_1.tours.title,
        tourMainImage: schema_1.tours.mainImage,
        tourStatus: schema_1.tours.status,
        tourFeatured: schema_1.tours.featured,
        tourDescription: schema_1.tours.describtion,
        tourMeetingPoint: schema_1.tours.meetingPoint,
        tourMeetingPointAddress: schema_1.tours.meetingPointAddress,
        tourMeetingPointLocation: schema_1.tours.meetingPointLocation,
        tourPoints: schema_1.tours.points,
        tourEndDate: schema_1.tours.endDate,
        tourStartDate: schema_1.tours.startDate,
        tourDurationDays: schema_1.tours.durationDays,
        tourHours: schema_1.tours.durationHours,
        tourCountry: schema_1.tours.country,
        tourCity: schema_1.tours.city,
        tourMaxUser: schema_1.tours.maxUsers,
    })
        .from(schema_1.bookings)
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.bookings.userId, schema_1.users.id))
        .leftJoin(schema_1.tourSchedules, (0, drizzle_orm_1.eq)(schema_1.bookings.tourId, schema_1.tourSchedules.id))
        .leftJoin(schema_1.tours, (0, drizzle_orm_1.eq)(schema_1.tourSchedules.tourId, schema_1.tours.id));
    // Get booking IDs for batch querying
    const bookingIds = mainBookings.map(booking => booking.id);
    // Get all booking details in one query
    const allBookingDetails = yield db_1.db
        .select()
        .from(schema_1.bookingDetails)
        .where((0, drizzle_orm_1.inArray)(schema_1.bookingDetails.bookingId, bookingIds));
    // Get all booking extras in one query
    const allBookingExtras = yield db_1.db
        .select({
        bookingId: schema_1.bookingExtras.bookingId,
        extraId: schema_1.bookingExtras.extraId,
        extraName: schema_1.extras.name,
        adultCount: schema_1.bookingExtras.adultCount,
        childCount: schema_1.bookingExtras.childCount,
        infantCount: schema_1.bookingExtras.infantCount,
    })
        .from(schema_1.bookingExtras)
        .leftJoin(schema_1.extras, (0, drizzle_orm_1.eq)(schema_1.bookingExtras.extraId, schema_1.extras.id))
        .where((0, drizzle_orm_1.inArray)(schema_1.bookingExtras.bookingId, bookingIds));
    // Combine the data
    const bookingsWithDetails = mainBookings.map(booking => {
        const details = allBookingDetails.find(detail => detail.bookingId === booking.id);
        const extras = allBookingExtras.filter(extra => extra.bookingId === booking.id);
        return Object.assign(Object.assign({}, booking), { bookingDetails: details || null, bookingExtras: extras });
    });
    (0, response_1.SuccessResponse)(res, { bookings: bookingsWithDetails }, 200);
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
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tourId, userId, status } = req.body;
    const newBooking = yield db_1.db.insert(schema_1.bookings).values({
        tourId,
        userId,
        status,
    });
    (0, response_1.SuccessResponse)(res, { booking: newBooking }, 201);
});
exports.createBooking = createBooking;
