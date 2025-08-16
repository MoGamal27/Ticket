import { Request, Response } from "express";
import { db } from "../../models/db";
import {
  bookings,users, tours, tourSchedules,
  bookingDetails,
  bookingExtras,
  extras
} from "../../models/schema";
import { eq , and , lt , gte} from "drizzle-orm";
import { SuccessResponse } from "../../utils/response";
import { NotFound,UnauthorizedError } from "../../Errors";
import { AuthenticatedRequest } from "../../types/custom";
import { BadRequest } from "../../Errors/BadRequest";

export const getUserBookings = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError("User not authenticated");
  }

  const userId = Number(req.user.id);
  const now = new Date();

  // استدعاء كل الحجزات المرتبطة بالمستخدم
  const userBookingsRaw = await db
    .select({
      bookings: bookings,
      bookingDetails: bookingDetails,
      bookingExtras: {
        id: bookingExtras.id,
        bookingId: bookingExtras.bookingId,
        extraId: bookingExtras.extraId,
        extraName: extras.name,
        adultCount: bookingExtras.adultCount,
        childCount: bookingExtras.childCount,
        infantCount: bookingExtras.infantCount,
        createdAt: bookingExtras.createdAt,
      }
    })
    .from(bookings)
    .innerJoin(tourSchedules, eq(bookings.tourId, tourSchedules.id))
    .innerJoin(tours, eq(tourSchedules.tourId, tours.id))
    .leftJoin(bookingExtras, eq(bookings.id, bookingExtras.bookingId))
    .leftJoin(extras, eq(bookingExtras.extraId, extras.id))
    .innerJoin(bookingDetails, eq(bookings.id, bookingDetails.bookingId))
    .where(eq(bookings.userId, userId))
    .execute();

  // تجميع البيانات بحيث bookingExtras تبقى array لكل booking
  const groupedBookings = Object.values(
    userBookingsRaw.reduce((acc, row) => {
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
    }, {} as Record<number, { bookings: any; bookingDetails: any; bookingExtras: any[] }>)
  );

  // تقسيم حسب الحالة
  const currentBookings = {
    pending: groupedBookings.filter(item => item.bookings.status === "pending"),
    confirmed: groupedBookings.filter(item => item.bookings.status === "confirmed"),
    cancelled: groupedBookings.filter(item => item.bookings.status === "cancelled"),
  };

  // حجزات ماضية (انتهت)
  const pastBookings = groupedBookings.filter(item => new Date(item.bookings.createdAt) < now);
  const upcomingBookings = groupedBookings.filter(item => new Date(item.bookings.createdAt) > now);

  SuccessResponse(res, { history: pastBookings, current: currentBookings, upcoming: upcomingBookings}, 200);
};



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

export const getBookingDetails = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError("User not authenticated");
  }

  const userId = Number(req.user.id);
  const bookingId = Number(req.params.id);

  // نجيب بيانات الحجز مع التفاصيل والإضافات
  const bookingRaw = await db
    .select({
      bookings: bookings,
      bookingDetails: bookingDetails,
      bookingExtras: {
        id: bookingExtras.id,
        bookingId: bookingExtras.bookingId,
        extraId: bookingExtras.extraId,
        extraName: extras.name,
        adultCount: bookingExtras.adultCount,
        childCount: bookingExtras.childCount,
        infantCount: bookingExtras.infantCount,
        createdAt: bookingExtras.createdAt,
      }
    })
    .from(bookings)
    .innerJoin(tourSchedules, eq(bookings.tourId, tourSchedules.id))
    .innerJoin(tours, eq(tourSchedules.tourId, tours.id))
    .leftJoin(bookingExtras, eq(bookings.id, bookingExtras.bookingId))
    .leftJoin(extras, eq(bookingExtras.extraId, extras.id))
    .innerJoin(bookingDetails, eq(bookings.id, bookingDetails.bookingId))
    .where(
      and(
        eq(bookings.userId, userId),
        eq(bookings.id, bookingId)
      )
    )
    .execute();

  if (!bookingRaw || bookingRaw.length === 0) {
    throw new NotFound("Booking not found or you don't have permission to access it");
  }

  // تجميع بيانات bookingExtras في مصفوفة
  const bookingData = bookingRaw.reduce((acc, row) => {
    if (!acc.bookings) acc.bookings = row.bookings;
    if (!acc.bookingDetails) acc.bookingDetails = row.bookingDetails;

    if (row.bookingExtras && row.bookingExtras.id) {
      acc.bookingExtras.push(row.bookingExtras);
    }

    return acc;
  }, { bookings: null as any, bookingDetails: null as any, bookingExtras: [] as any[] });

  SuccessResponse(res, bookingData, 200);
};




export const updateBooking = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError("User not authenticated");
  }

  const userId = Number(req.user.id);
  const bookingId = Number(req.params.id);
  const { status, ...otherFields } = req.body;

  if (status) {
    return res.status(403).json({ message: "You are not allowed to update booking status here." });
  }

  const booking = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.id, bookingId),
        eq(bookings.userId, userId)
      )
    )
    .execute();

  if (!booking || booking.length === 0) {
    throw new NotFound("Booking not found or you don't have permission to update it");
  }

  if (Object.keys(otherFields).length === 0) {
    return SuccessResponse(res, { message: "No fields to update" }, 200);
  }

  await db
    .update(bookings)
    .set(otherFields)
    .where(
      and(
        eq(bookings.id, bookingId),
        eq(bookings.userId, userId)
      )
    )
    .execute();

  SuccessResponse(res, { message: "Booking updated successfully" }, 200);
};


export const cancelBooking = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError("User not authenticated");
  }

  const userId = Number(req.user.id);
  const bookingId = Number(req.params.id);

  const booking = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.id, bookingId),
        eq(bookings.userId, userId)
      )
    )
    .execute();

  if (!booking || booking.length === 0) {
    throw new NotFound("Booking not found or you don't have permission to cancel it");
  }

  const currentBooking = booking[0];

  if (currentBooking.status !== "pending") {
    return res.status(400).json({ message: "Cannot cancel a booking that is already confirmed or cancelled" });
  }

  await db
    .update(bookings)
    .set({ status: "cancelled" })
    .where(
      and(
        eq(bookings.id, bookingId),
        eq(bookings.userId, userId)
      )
    )
    .execute();

  SuccessResponse(res, { message: "Booking cancelled successfully" }, 200);
};