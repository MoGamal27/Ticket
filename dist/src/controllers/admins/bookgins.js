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
exports.createBooking = exports.getBookingsStats = exports.getBookings = exports.formatDateMyPhp = exports.formatDate = void 0;
const db_1 = require("../../models/db");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};
exports.formatDate = formatDate;
const formatDateMyPhp = (dateString) => {
    if (!dateString)
        return ''; // Handle empty/null cases
    // Parse the PHPMyAdmin datetime string (format: "YYYY-MM-DD HH:MM:SS")
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    // Create a Date object (time part is optional if you only want date)
    const dateObj = new Date(year, month - 1, day);
    // Format as desired (here are some options)
    // Option 1: ISO format (YYYY-MM-DD)
    // return dateObj.toISOString().split('T')[0];
    // Option 2: Locale-specific format
    // return dateObj.toLocaleDateString(); // System locale
    // return dateObj.toLocaleDateString('en-US'); // US format (MM/DD/YYYY)
    // return dateObj.toLocaleDateString('en-GB'); // UK format (DD/MM/YYYY)
    // Option 3: Custom formatted string (DD-MM-YYYY)
    return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
    // Option 4: Keep just the date part as is (YYYY-MM-DD)
    // return datePart;
};
exports.formatDateMyPhp = formatDateMyPhp;
const getBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield db_1.db
        .select({
        booking: schema_1.bookings,
        // Tour data
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
        // User data
        userId: schema_1.users.id,
        // BookingDetails
        bookingDetailsId: schema_1.bookingDetails.id,
        bookingDetailsNotes: schema_1.bookingDetails.notes,
        bookingDetailsAdults: schema_1.bookingDetails.adultsCount,
        bookingDetailsChildren: schema_1.bookingDetails.childrenCount,
        UserFullName: schema_1.bookingDetails.fullName,
        UserEmail: schema_1.bookingDetails.email,
        UserPhone: schema_1.bookingDetails.phone,
        // BookingExtras
        bookingExtrasId: schema_1.bookingExtras.id,
        bookingExtrasAdultCount: schema_1.bookingExtras.adultCount,
        bookingExtrasChildCount: schema_1.bookingExtras.childCount,
        bookingExtrasInfantCount: schema_1.bookingExtras.infantCount,
        extraName: schema_1.extras.name,
    })
        .from(schema_1.bookings)
        .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.bookings.userId, schema_1.users.id))
        .innerJoin(schema_1.tours, (0, drizzle_orm_1.eq)(schema_1.bookings.tourId, schema_1.tours.id))
        .leftJoin(schema_1.bookingDetails, (0, drizzle_orm_1.eq)(schema_1.bookingDetails.bookingId, schema_1.bookings.id))
        .leftJoin(schema_1.bookingExtras, (0, drizzle_orm_1.eq)(schema_1.bookingExtras.bookingId, schema_1.bookings.id))
        .leftJoin(schema_1.extras, (0, drizzle_orm_1.eq)(schema_1.extras.id, schema_1.bookingExtras.extraId));
    // Group bookings
    const grouped = rows.reduce((acc, row) => {
        let booking = acc.find((b) => b.id === row.bookingId);
        if (!booking) {
            booking = Object.assign(Object.assign({}, row.booking), { user: {
                    id: row.userId,
                    name: row.userName,
                }, tour: {
                    id: row.tourId,
                    name: row.tourName,
                    mainImage: row.tourMainImage,
                    status: row.tourStatus,
                    featured: row.tourFeatured,
                    description: row.tourDescription,
                    meetingPoint: row.tourMeetingPoint,
                    meetingPointAddress: row.tourMeetingPointAddress,
                    meetingPointLocation: row.tourMeetingPointLocation,
                    points: row.tourPoints,
                    startDate: (0, exports.formatDate)(row.tourStartDate),
                    endDate: (0, exports.formatDate)(row.tourEndDate),
                    durationDays: row.tourDurationDays,
                    hours: row.tourHours,
                    country: row.tourCountry,
                    city: row.tourCity,
                    maxUsers: row.tourMaxUser,
                }, bookingDetails: {
                    id: row.bookingDetailsId,
                    notes: row.bookingDetailsNotes,
                    adultsCount: row.bookingDetailsAdults,
                    childrenCount: row.bookingDetailsChildren,
                    UserFullName: row.UserFullName,
                    UserEmail: row.UserEmail,
                    UserPhone: row.UserPhone,
                }, bookingExtras: [] });
            acc.push(booking);
        }
        /*if (row.bookingDetailsId) {
          booking.bookingDetails.push({
            id: row.bookingDetailsId,
            notes: row.bookingDetailsNotes,
            adultsCount: row.bookingDetailsAdults,
            childrenCount: row.bookingDetailsChildren,
            UserFullName: row.UserFullName,
            UserEmail: row.UserEmail,
            UserPhone: row.UserPhone,
          });
        }*/
        if (row.bookingExtrasId) {
            booking.bookingExtras.push({
                id: row.bookingExtrasId,
                adultCount: row.bookingExtrasAdultCount,
                childCount: row.bookingExtrasChildCount,
                infantCount: row.bookingExtrasInfantCount,
                extraName: row.extraName,
            });
        }
        return acc;
    }, []);
    // Split into upcoming / current / history
    // Fix the date comparison logic
    const now = new Date();
    //console.log(formatDate(now)); 
    grouped.forEach((b) => {
        // Convert to Date objects
        const startDateObj = new Date(b.tour.startDate);
        const endDateObj = new Date(b.tour.endDate);
        // Format for display (keep original format)
        b.tour.startDate = (0, exports.formatDate)(startDateObj);
        b.tour.endDate = (0, exports.formatDate)(endDateObj);
        // Store Date objects for comparison
        b.tour.startDateObj = startDateObj;
        b.tour.endDateObj = endDateObj;
    });
    // Filter using Date objects
    const upcoming = grouped.filter((b) => b.tour.startDateObj > now);
    const current = grouped.filter((b) => b.tour.startDateObj <= now && b.tour.endDateObj >= now);
    const history = grouped.filter((b) => b.tour.endDateObj < now);
    /*const now = new Date()
      grouped.forEach((b) => {
        b.tour.startDate = formatDate(new Date(b.tour.startDate));
        b.tour.endDate = formatDate(new Date(b.tour.endDate));
      });*/
    (0, response_1.SuccessResponse)(res, { upcoming, current, history }, 200);
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
