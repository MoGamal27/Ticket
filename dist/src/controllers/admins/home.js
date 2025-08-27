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
exports.getStatistics = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_1 = require("../../utils/response");
const getStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Get bookings by month data
        const existingBookings = yield db_1.db
            .select({
            month: (0, drizzle_orm_1.sql) `MONTH(${schema_1.bookings.createdAt})`,
            year: (0, drizzle_orm_1.sql) `YEAR(${schema_1.bookings.createdAt})`,
            count: (0, drizzle_orm_1.sql) `COUNT(*)`
        })
            .from(schema_1.bookings)
            .where((0, drizzle_orm_1.eq)(schema_1.bookings.status, "confirmed"))
            .groupBy((0, drizzle_orm_1.sql) `MONTH(${schema_1.bookings.createdAt})`, (0, drizzle_orm_1.sql) `YEAR(${schema_1.bookings.createdAt})`);
        // Create map for existing bookings
        const bookingsMap = new Map();
        existingBookings.forEach(item => {
            bookingsMap.set(`${item.year}-${item.month}`, item.count);
        });
        // Generate all months for current year
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const bookingsByMonth = [];
        for (let month = 1; month <= 12; month++) {
            const count = bookingsMap.get(`${currentYear}-${month}`) || 0;
            bookingsByMonth.push({
                year: currentYear,
                month: month,
                count: count
            });
        }
        // Sort by month
        bookingsByMonth.sort((a, b) => a.month - b.month);
        // 2. Get last three bookings with details
        const lastThreeBookings = yield db_1.db
            .select({
            id: schema_1.bookingDetails.id,
            fullName: schema_1.bookingDetails.fullName,
            tourTitle: schema_1.tours.title,
            createdAt: schema_1.bookings.createdAt,
        })
            .from(schema_1.bookingDetails)
            .leftJoin(schema_1.bookings, (0, drizzle_orm_1.eq)(schema_1.bookingDetails.bookingId, schema_1.bookings.id))
            .leftJoin(schema_1.tourSchedules, (0, drizzle_orm_1.eq)(schema_1.bookings.tourId, schema_1.tourSchedules.id))
            .leftJoin(schema_1.tours, (0, drizzle_orm_1.eq)(schema_1.tourSchedules.tourId, schema_1.tours.id))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.bookings.createdAt))
            .limit(3);
        // 3. Get general statistics
        const [{ userCount }] = yield db_1.db
            .select({ userCount: (0, drizzle_orm_1.sql) `COUNT(*)` })
            .from(schema_1.users);
        const [{ tourCount }] = yield db_1.db
            .select({ tourCount: (0, drizzle_orm_1.sql) `COUNT(*)` })
            .from(schema_1.tours);
        const [{ bookingCount }] = yield db_1.db
            .select({ bookingCount: (0, drizzle_orm_1.sql) `COUNT(*)` })
            .from(schema_1.bookings);
        const [{ paymentCount }] = yield db_1.db
            .select({ paymentCount: (0, drizzle_orm_1.sql) `COUNT(*)` })
            .from(schema_1.payments)
            .where((0, drizzle_orm_1.eq)(schema_1.payments.status, "pending"));
        const [{ promocodeCount }] = yield db_1.db
            .select({ promocodeCount: (0, drizzle_orm_1.sql) `COUNT(*)` })
            .from(schema_1.promoCode)
            .where((0, drizzle_orm_1.eq)(schema_1.promoCode.status, true));
        // Combine all data into a single response
        const dashboardData = {
            bookingsByMonth,
            recentBookings: lastThreeBookings,
            statistics: {
                userCount,
                tourCount,
                bookingCount,
                paymentCount,
                promocodeCount
            }
        };
        (0, response_1.SuccessResponse)(res, dashboardData, 200);
    }
    catch (error) {
        console.error("Error fetching dashboard statistics:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getStatistics = getStatistics;
