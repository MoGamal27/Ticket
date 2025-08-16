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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBooking = exports.updateBooking = exports.getBookingDetails = exports.getUserBookings = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_1 = require("../../utils/response");
const Errors_1 = require("../../Errors");
const getUserBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new Errors_1.UnauthorizedError("User not authenticated");
    }
    const userId = Number(req.user.id);
    const now = new Date();
    // استدعاء كل الحجزات المرتبطة بالمستخدم
    const userBookingsRaw = yield db_1.db
        .select({
        bookings: schema_1.bookings,
        bookingDetails: schema_1.bookingDetails,
        bookingExtras: {
            id: schema_1.bookingExtras.id,
            bookingId: schema_1.bookingExtras.bookingId,
            extraId: schema_1.bookingExtras.extraId,
            extraName: schema_1.extras.name,
            adultCount: schema_1.bookingExtras.adultCount,
            childCount: schema_1.bookingExtras.childCount,
            infantCount: schema_1.bookingExtras.infantCount,
            createdAt: schema_1.bookingExtras.createdAt,
        }
    })
        .from(schema_1.bookings)
        .innerJoin(schema_1.tourSchedules, (0, drizzle_orm_1.eq)(schema_1.bookings.tourId, schema_1.tourSchedules.id))
        .innerJoin(schema_1.tours, (0, drizzle_orm_1.eq)(schema_1.tourSchedules.tourId, schema_1.tours.id))
        .leftJoin(schema_1.bookingExtras, (0, drizzle_orm_1.eq)(schema_1.bookings.id, schema_1.bookingExtras.bookingId))
        .leftJoin(schema_1.extras, (0, drizzle_orm_1.eq)(schema_1.bookingExtras.extraId, schema_1.extras.id))
        .innerJoin(schema_1.bookingDetails, (0, drizzle_orm_1.eq)(schema_1.bookings.id, schema_1.bookingDetails.bookingId))
        .where((0, drizzle_orm_1.eq)(schema_1.bookings.userId, userId))
        .execute();
    // تجميع البيانات بحيث bookingExtras تبقى array لكل booking
    const groupedBookings = Object.values(userBookingsRaw.reduce((acc, row) => {
        const bookingId = row.bookings.id;
        if (!acc[bookingId]) {
            acc[bookingId] = {
                bookings: row.bookings,
                bookingDetails: row.bookingDetails,
                bookingExtras: [],
            };
        }
        if (row.bookingExtras && row.bookingExtras.id) {
            acc[bookingId].bookingExtras.push(row.bookingExtras);
        }
        return acc;
    }, {}));
    // تقسيم حسب الحالة
    const currentBookings = {
        pending: groupedBookings.filter(item => item.bookings.status === "pending"),
        confirmed: groupedBookings.filter(item => item.bookings.status === "confirmed"),
        cancelled: groupedBookings.filter(item => item.bookings.status === "cancelled"),
    };
    // حجزات ماضية (انتهت)
    const pastBookings = groupedBookings.filter(item => new Date(item.bookings.createdAt) < now);
    const upcomingBookings = groupedBookings.filter(item => new Date(item.bookings.createdAt) > now);
    (0, response_1.SuccessResponse)(res, { history: pastBookings, current: currentBookings, upcoming: upcomingBookings }, 200);
});
exports.getUserBookings = getUserBookings;
//  export const createBooking = async (req: AuthenticatedRequest, res: Response) => {
//   if (!req.user || !req.user.id) {
//     throw new UnauthorizedError("User not authenticated");
//   }
//   const userId = Number(req.user.id);
//   const { tourScheduleId, tourId } = req.body;
//   if (!tourScheduleId || !tourId) {
//     throw new BadRequest("tourScheduleId and tourId are required");
//   }
//   // تحقق من وجود علاقة صحيحة بين tourScheduleId و tourId
//   const tourSchedule = await db
//     .select()
//     .from(tourSchedules)
//     .where(
//       and(
//         eq(tourSchedules.id, tourScheduleId),
//         eq(tourSchedules.tourId, tourId)
//       )
//     )
//     .limit(1)
//     .execute();
//   if (tourSchedule.length === 0) {
//     throw new NotFound("Tour schedule not found or doesn't belong to this tour");
//   }
//   // يمكنك التحقق من توفر مقاعد مثلاً لو تحب (اختياري)
//   if (tourSchedule[0].availableSeats <= 0) {
//     throw new BadRequest("No available seats for this tour schedule");
//   }
//   // إنشاء الحجز
//   const [newBooking] = await db
//     .insert(bookings)
//     .values({
//       userId,
//       tourId,
//       tourScheduleId,
//       status: "pending",
//       createdAt: new Date() // أو استخدم getCurrentEgyptTime() لو معتمدها
//     })
//     .$returningId();
//   // لو حابب تقلل عدد المقاعد المتاحة بعد الحجز
//   await db
//     .update(tourSchedules)
//     .set({
//       availableSeats: tourSchedule[0].availableSeats - 1,
//     })
//     .where(eq(tourSchedules.id, tourScheduleId))
//     .execute();
//   return SuccessResponse(res, { booking: newBooking }, 201);
// };
const getBookingDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new Errors_1.UnauthorizedError("User not authenticated");
    }
    const userId = Number(req.user.id);
    const bookingId = Number(req.params.id);
    // نجيب بيانات الحجز مع التفاصيل والإضافات
    const bookingRaw = yield db_1.db
        .select({
        bookings: schema_1.bookings,
        bookingDetails: schema_1.bookingDetails,
        bookingExtras: {
            id: schema_1.bookingExtras.id,
            bookingId: schema_1.bookingExtras.bookingId,
            extraId: schema_1.bookingExtras.extraId,
            extraName: schema_1.extras.name,
            adultCount: schema_1.bookingExtras.adultCount,
            childCount: schema_1.bookingExtras.childCount,
            infantCount: schema_1.bookingExtras.infantCount,
            createdAt: schema_1.bookingExtras.createdAt,
        }
    })
        .from(schema_1.bookings)
        .innerJoin(schema_1.tourSchedules, (0, drizzle_orm_1.eq)(schema_1.bookings.tourId, schema_1.tourSchedules.id))
        .innerJoin(schema_1.tours, (0, drizzle_orm_1.eq)(schema_1.tourSchedules.tourId, schema_1.tours.id))
        .leftJoin(schema_1.bookingExtras, (0, drizzle_orm_1.eq)(schema_1.bookings.id, schema_1.bookingExtras.bookingId))
        .leftJoin(schema_1.extras, (0, drizzle_orm_1.eq)(schema_1.bookingExtras.extraId, schema_1.extras.id))
        .innerJoin(schema_1.bookingDetails, (0, drizzle_orm_1.eq)(schema_1.bookings.id, schema_1.bookingDetails.bookingId))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.bookings.userId, userId), (0, drizzle_orm_1.eq)(schema_1.bookings.id, bookingId)))
        .execute();
    if (!bookingRaw || bookingRaw.length === 0) {
        throw new Errors_1.NotFound("Booking not found or you don't have permission to access it");
    }
    // تجميع بيانات bookingExtras في مصفوفة
    const bookingData = bookingRaw.reduce((acc, row) => {
        if (!acc.bookings)
            acc.bookings = row.bookings;
        if (!acc.bookingDetails)
            acc.bookingDetails = row.bookingDetails;
        if (row.bookingExtras && row.bookingExtras.id) {
            acc.bookingExtras.push(row.bookingExtras);
        }
        return acc;
    }, { bookings: null, bookingDetails: null, bookingExtras: [] });
    (0, response_1.SuccessResponse)(res, bookingData, 200);
});
exports.getBookingDetails = getBookingDetails;
const updateBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new Errors_1.UnauthorizedError("User not authenticated");
    }
    const userId = Number(req.user.id);
    const bookingId = Number(req.params.id);
    const _a = req.body, { status } = _a, otherFields = __rest(_a, ["status"]);
    if (status) {
        return res.status(403).json({ message: "You are not allowed to update booking status here." });
    }
    const booking = yield db_1.db
        .select()
        .from(schema_1.bookings)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.bookings.id, bookingId), (0, drizzle_orm_1.eq)(schema_1.bookings.userId, userId)))
        .execute();
    if (!booking || booking.length === 0) {
        throw new Errors_1.NotFound("Booking not found or you don't have permission to update it");
    }
    if (Object.keys(otherFields).length === 0) {
        return (0, response_1.SuccessResponse)(res, { message: "No fields to update" }, 200);
    }
    yield db_1.db
        .update(schema_1.bookings)
        .set(otherFields)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.bookings.id, bookingId), (0, drizzle_orm_1.eq)(schema_1.bookings.userId, userId)))
        .execute();
    (0, response_1.SuccessResponse)(res, { message: "Booking updated successfully" }, 200);
});
exports.updateBooking = updateBooking;
const cancelBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new Errors_1.UnauthorizedError("User not authenticated");
    }
    const userId = Number(req.user.id);
    const bookingId = Number(req.params.id);
    const booking = yield db_1.db
        .select()
        .from(schema_1.bookings)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.bookings.id, bookingId), (0, drizzle_orm_1.eq)(schema_1.bookings.userId, userId)))
        .execute();
    if (!booking || booking.length === 0) {
        throw new Errors_1.NotFound("Booking not found or you don't have permission to cancel it");
    }
    const currentBooking = booking[0];
    if (currentBooking.status !== "pending") {
        return res.status(400).json({ message: "Cannot cancel a booking that is already confirmed or cancelled" });
    }
    yield db_1.db
        .update(schema_1.bookings)
        .set({ status: "cancelled" })
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.bookings.id, bookingId), (0, drizzle_orm_1.eq)(schema_1.bookings.userId, userId)))
        .execute();
    (0, response_1.SuccessResponse)(res, { message: "Booking cancelled successfully" }, 200);
});
exports.cancelBooking = cancelBooking;
