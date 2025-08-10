import { Request, Response } from "express";
import { db } from "../../models/db";
import { sql, eq, and, lt } from "drizzle-orm";
import { bookings, tours, tourSchedules, users } from "../../models/schema";
import { SuccessResponse } from "../../utils/response";

export const getBookings = async (req: Request, res: Response) => {
  const books = await db
    .select({
      id: bookings.id,
      status: bookings.status,
      createdAt: bookings.createdAt,
      userName: users.name,
      tourName: tours.title,
      tourMainImage: tours.mainImage,
      tourStatus: tours.status,
      tourFeatured: tours.featured,
      tourDescription: tours.describtion,
      tourMeetingPoint: tours.meetingPoint,
      tourMeetinPointAddress: tours.meetingPointAddress,
      tourMeetingPointLocation: tours.meetingPointLocation,
      tourPoints: tours.points,
      tourEndDate: tours.endDate,
      tourStartDate: tours.startDate,
      tourDurationDays: tours.durationDays,
      tourHours: tours.durationHours,
      tourCountry: tours.country,
      tourCity: tours.city,
      tourMaxUser: tours.maxUsers,
    })
    .from(bookings)
    .leftJoin(users, eq(bookings.userId, users.id))
    .leftJoin(tours, eq(bookings.tourId, tours.id));

  SuccessResponse(res, { bookings: books }, 200);
};

export const getBookingsStats = async (req: Request, res: Response) => {
  const [{ bookingCount }] = await db
    .select({ bookingCount: sql<number>`COUNT(*)` })
    .from(bookings);
  const [{ bookingPendingCount }] = await db
    .select({ bookingPendingCount: sql<number>`COUNT(*)` })
    .from(bookings)
    .where(eq(bookings.status, "pending"));
  const [{ bookingConfirmedCount }] = await db
    .select({ bookingConfirmedCount: sql<number>`COUNT(*)` })
    .from(bookings)
    .where(eq(bookings.status, "confirmed"));
  const [{ bookingCancelledCount }] = await db
    .select({ bookingCancelledCount: sql<number>`COUNT(*)` })
    .from(bookings)
    .where(eq(bookings.status, "cancelled"));
  const today = new Date();

  const [{ bookingcompletedCount }] = await db
    .select({
      bookingcompletedCount: sql<number>`COUNT(*)`,
    })
    .from(bookings)
    .leftJoin(tourSchedules, eq(bookings.tourId, tourSchedules.id))
    .where(
      and(eq(bookings.status, "confirmed"), lt(tourSchedules.startDate, today))
    );
  SuccessResponse(res, {
    bookingCount,
    bookingPendingCount,
    bookingConfirmedCount,
    bookingCancelledCount,
    bookingcompletedCount,
  });
};

export const createBooking = async (req: Request, res: Response) => {
  const { tourId, userId, status } = req.body;

  const newBooking = await db.insert(bookings).values({
    tourId,
    userId,
    status,
  });

  SuccessResponse(res, { booking: newBooking }, 201);
}
