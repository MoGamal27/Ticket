import { Request, Response } from "express";
import { db } from "../../models/db";
import { sql, eq, and, lt } from "drizzle-orm";
import { bookings, tours, tourSchedules, users,extras,bookingDetails,bookingExtras } from "../../models/schema";
import { SuccessResponse } from "../../utils/response";


export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]; 
};

export const getBookings = async (req: Request, res: Response) => {
  const rows = await db
    .select({
      booking: bookings,

      // Tour data
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

      // User data
      userId: users.id,

      // BookingDetails
      bookingDetailsId: bookingDetails.id,
      bookingDetailsNotes: bookingDetails.notes,
      bookingDetailsAdults: bookingDetails.adultsCount,
      bookingDetailsChildren: bookingDetails.childrenCount,
      UserFullName: bookingDetails.fullName,
      UserEmail: bookingDetails.email,
      UserPhone: bookingDetails.phone,
     

      // BookingExtras
      bookingExtrasId: bookingExtras.id,
      bookingExtrasAdultCount: bookingExtras.adultCount,
      bookingExtrasChildCount: bookingExtras.childCount,
      bookingExtrasInfantCount: bookingExtras.infantCount,
      extraName: extras.name,
    })
    .from(bookings)
    .innerJoin(users, eq(bookings.userId, users.id))
    .innerJoin(tours, eq(bookings.tourId, tours.id))
    .leftJoin(bookingDetails, eq(bookingDetails.bookingId, bookings.id))
    .leftJoin(bookingExtras, eq(bookingExtras.bookingId, bookings.id))
    .leftJoin(extras, eq(extras.id, bookingExtras.extraId));

  // Group bookings
  const grouped = rows.reduce((acc, row: any) => {
    let booking = acc.find((b) => b.id === row.bookingId);

    if (!booking) {
      booking = {
        ...row.booking,
        user: {
          id: row.userId,
          name: row.userName,
        },

        tour: {
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
          startDate: formatDate(row.tourStartDate),
          endDate: formatDate(row.tourEndDate),
          durationDays: row.tourDurationDays,
          hours: row.tourHours,
          country: row.tourCountry,
          city: row.tourCity,
          maxUsers: row.tourMaxUser,
        },

        bookingDetails: {
        id: row.bookingDetailsId,
        notes: row.bookingDetailsNotes,
        adultsCount: row.bookingDetailsAdults,
        childrenCount: row.bookingDetailsChildren,
        UserFullName: row.UserFullName,
        UserEmail: row.UserEmail,
        UserPhone: row.UserPhone,
      },
        bookingExtras: [],
      };
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
  }, [] as any[]);

  // Split into upcoming / current / history
  const now = new Date();
  const upcoming = grouped.filter((b) => new Date(b.tour.startDate) > now);
  const current = grouped.filter(
    (b) => new Date(b.tour.startDate) <= now && new Date(b.tour.endDate) >= now
  );
  const history = grouped.filter((b) => new Date(b.tour.endDate) < now);

  SuccessResponse(
    res,
    { upcoming, current, history },
    200
  );
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