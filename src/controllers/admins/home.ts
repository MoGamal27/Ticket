import { Request, Response } from "express";
import { db } from "../../models/db";
import {
  bookings,
  payments,
  promoCode,
  tours,
  users,
  bookingDetails,
  tourSchedules
} from "../../models/schema";
import { eq, sql } from "drizzle-orm";
import { SuccessResponse } from "../../utils/response";





export const getStatistics = async (req: Request, res: Response) => {
  try {
    // 1. Get bookings by month data
    const existingBookings = await db
      .select({
        month: sql<number>`MONTH(${bookings.createdAt})`,
        year: sql<number>`YEAR(${bookings.createdAt})`,
        count: sql<number>`COUNT(*)`
      })
      .from(bookings)
      .where(eq(bookings.status, "confirmed"))
      .groupBy(
        sql`MONTH(${bookings.createdAt})`,
        sql`YEAR(${bookings.createdAt})`
      );

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
    const lastThreeBookings = await db
      .select({
        id: bookingDetails.id,
        fullName: bookingDetails.fullName,
        tourTitle: tours.title,
        createdAt: bookings.createdAt,
      })
      .from(bookingDetails)
      .leftJoin(bookings, eq(bookingDetails.bookingId, bookings.id))
      .leftJoin(tourSchedules, eq(bookings.tourId, tourSchedules.id)) 
      .leftJoin(tours, eq(tourSchedules.tourId, tours.id)) 
      .orderBy(bookings.createdAt) 
      .limit(3);

    // 3. Get general statistics
    const [{ userCount }] = await db
      .select({ userCount: sql<number>`COUNT(*)` })
      .from(users);
    
    const [{ tourCount }] = await db
      .select({ tourCount: sql<number>`COUNT(*)` })
      .from(tours);
    
    const [{ bookingCount }] = await db
      .select({ bookingCount: sql<number>`COUNT(*)` })
      .from(bookings);
    
    const [{ paymentCount }] = await db
      .select({ paymentCount: sql<number>`COUNT(*)` })
      .from(payments)
      .where(eq(payments.status, "pending"));
    
    const [{ promocodeCount }] = await db
      .select({ promocodeCount: sql<number>`COUNT(*)` })
      .from(promoCode)
      .where(eq(promoCode.status, true));

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

    SuccessResponse(res, dashboardData, 200);
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};