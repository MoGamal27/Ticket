import { Request, Response } from "express";
import { db } from "../../models/db";
import { sql, eq, and, lt, inArray } from "drizzle-orm";
import { bookings, tours, tourSchedules, users,extras,bookingDetails,bookingExtras } from "../../models/schema";
import { SuccessResponse } from "../../utils/response";


export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]; 
};

export const getBookings = async (req: Request, res: Response) => {
  // First, get the main bookings with user, tour schedule, and tour info
  const mainBookings = await db
    .select({
      id: bookings.id,
      status: bookings.status,
      createdAt: bookings.createdAt,
      discountNumber: bookings.discountNumber,
      location: bookings.location,
      address: bookings.address,

      
      
      // Tour info (via tourSchedule -> tour relationship)
      tourId: tours.id,
      tourName: tours.title,
      tourMainImage: tours.mainImage,
      tourStatus: tours.status,
      tourFeatured: tours.featured,
      tourDescription: tours.describtion,
      tourMeetingPoint: tours.meetingPoint,
      tourMeetingPointAddress: tours.meetingPointAddress,
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
    .leftJoin(tourSchedules, eq(bookings.tourId, tourSchedules.id)) 
    .leftJoin(tours, eq(tourSchedules.tourId, tours.id)); 

  // Get booking IDs for batch querying
  const bookingIds = mainBookings.map(booking => booking.id);

  // Get all booking details in one query
  const allBookingDetails = await db
    .select()
    .from(bookingDetails)
    .where(inArray(bookingDetails.bookingId, bookingIds));

  // Get all booking extras in one query
  const allBookingExtras = await db
    .select({
      bookingId: bookingExtras.bookingId,
      extraId: bookingExtras.extraId,
      extraName: extras.name,
      adultCount: bookingExtras.adultCount,
      childCount: bookingExtras.childCount,
      infantCount: bookingExtras.infantCount,
    })
    .from(bookingExtras)
    .leftJoin(extras, eq(bookingExtras.extraId, extras.id))
    .where(inArray(bookingExtras.bookingId, bookingIds));

  // Combine the data
  const bookingsWithDetails = mainBookings.map(booking => {
    const details = allBookingDetails.find(detail => detail.bookingId === booking.id);
    const extras = allBookingExtras.filter(extra => extra.bookingId === booking.id);

    return {
      ...booking,
      bookingDetails: details || null,
      bookingExtras: extras
    };
  });

  SuccessResponse(res, { bookings: bookingsWithDetails }, 200);
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