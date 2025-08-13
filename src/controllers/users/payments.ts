import { Request, Response } from "express";
import { db } from "../../models/db";
import {
payments,users, tours, bookings,
bookingDetails,
bookingExtras,
extras,
manualPaymentMethod, 
} from "../../models/schema";
import { eq , and , lt , gte} from "drizzle-orm";
import { SuccessResponse } from "../../utils/response";
import { NotFound,UnauthorizedError } from "../../Errors";
import { AuthenticatedRequest } from "../../types/custom";
import { BadRequest } from "../../Errors/BadRequest";

// export const createPayment = async (req: Request, res: Response) => {
//   const {  bookingId, method,transaction_id, } = req.body;
//     const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId));
//     if (!booking) throw new NotFound("Booking not found");
//     const newPayment = await db.insert(payments).values({
//     bookingId,
//     method,
//     status: "pending",
//     transactionId: transaction_id,
//   });
//     SuccessResponse(res, { payment: newPayment }, 201);
// }

export const getUserPayments = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError("User not authenticated");
  }

  const userId = Number(req.user.id);

  const userPaymentsRaw = await db
    .select({
      payments: payments,
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
      },
      manualPayment: {
        id: manualPaymentMethod.id,
        proofImage: manualPaymentMethod.proofImage,
        manualPaymentTypeId: manualPaymentMethod.manualPaymentTypeId,
        uploadedAt: manualPaymentMethod.uploadedAt
      }
    })
    .from(payments)
    .innerJoin(bookings, eq(payments.bookingId, bookings.id))
    .innerJoin(bookingDetails, eq(bookings.id, bookingDetails.bookingId))
    .leftJoin(bookingExtras, eq(bookings.id, bookingExtras.bookingId))
    .leftJoin(extras, eq(bookingExtras.extraId, extras.id))
    .leftJoin(manualPaymentMethod, eq(payments.id, manualPaymentMethod.paymentId))
    .where(eq(bookings.userId, userId))
    .execute();

  // إعادة تجميع البيانات بحيث لا يتكرر paymentId
  const groupedByPayment = Object.values(
    userPaymentsRaw.reduce((acc, row) => {
      const paymentId = row.payments.id;

      if (!acc[paymentId]) {
        acc[paymentId] = {
          payments: row.payments,
          bookingDetails: row.bookingDetails,
          bookingExtras: [],
          manualPayment: row.manualPayment?.proofImage
            ? {
                proofImage: row.manualPayment.proofImage,
                manualPaymentTypeId: row.manualPayment.manualPaymentTypeId,
                uploadedAt: row.manualPayment.uploadedAt
              }
            : null
        };
      }

      if (row.bookingExtras && row.bookingExtras.id) {
        acc[paymentId].bookingExtras.push(row.bookingExtras);
      }

      return acc;
    }, {} as Record<number, { payments: any; bookingDetails: any; bookingExtras: any[]; manualPayment: any }>)
  );

  // تقسيم حسب الحالة
  const groupedPayments = {
    pending: groupedByPayment.filter(item => item.payments.status === "pending"),
    confirmed: groupedByPayment.filter(item => item.payments.status === "confirmed"),
    cancelled: groupedByPayment.filter(item => item.payments.status === "cancelled"),
  };

  SuccessResponse(res, groupedPayments, 200);
};


export const getPaymentById = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError("User not authenticated");
  }

  const userId = Number(req.user.id);
  const paymentId = Number(req.params.id);

  const paymentRows = await db
    .select({
      payments: payments,
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
      },
      manualPayment: {
        id: manualPaymentMethod.id,
        proofImage: manualPaymentMethod.proofImage,
        manualPaymentTypeId: manualPaymentMethod.manualPaymentTypeId,
        uploadedAt: manualPaymentMethod.uploadedAt,
      },
    })
    .from(payments)
    .innerJoin(bookings, eq(payments.bookingId, bookings.id))
    .innerJoin(bookingDetails, eq(bookings.id, bookingDetails.bookingId))
    .leftJoin(bookingExtras, eq(bookings.id, bookingExtras.bookingId))
    .leftJoin(extras, eq(bookingExtras.extraId, extras.id))
    .leftJoin(manualPaymentMethod, eq(manualPaymentMethod.paymentId, payments.id))
    .where(
      and(
        eq(payments.id, paymentId),
        eq(bookings.userId, userId)
      )
    )
    .execute();

  if (paymentRows.length === 0) {
    throw new NotFound("Payment not found or you don't have access to it");
  }

  const paymentData = {
    payments: paymentRows[0].payments,
    bookingDetails: paymentRows[0].bookingDetails,
    bookingExtras: [] as any[],
    manualPayment: paymentRows[0].manualPayment?.proofImage
      ? { ...paymentRows[0].manualPayment }
      : null,
  };

  // إضافة كل الـ bookingExtras بدون تكرار وبشكل آمن
  paymentRows.forEach(row => {
    if (row.bookingExtras?.id != null) {
      paymentData.bookingExtras.push(row.bookingExtras);
    }
  });

  SuccessResponse(res, paymentData, 200);
};



export const updatePayment = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError("User not authenticated");
  }

  const userId = Number(req.user.id);
  const paymentId = Number(req.params.id);
  const { method } = req.body; 
  const paymentCheck = await db
    .select()
    .from(payments)
    .innerJoin(bookings, eq(payments.bookingId, bookings.id))
    .where(and(eq(payments.id, paymentId), eq(bookings.userId, userId)))
    .execute();

  if (paymentCheck.length === 0) {
    throw new NotFound("Payment not found or you don't have access to it");
  }

  await db
    .update(payments)
    .set({
      ...(method && { method }),
    })
    .where(eq(payments.id, paymentId))
    .execute();

  SuccessResponse(res, { message: "Payment updated successfully" }, 200);
};

export const deletePayment = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError("User not authenticated");
  }

  const userId = Number(req.user.id);
  const paymentId = Number(req.params.id);

  // تحقق إن الـ payment بتخص اليوزر
  const paymentCheck = await db
    .select()
    .from(payments)
    .innerJoin(bookings, eq(payments.bookingId, bookings.id))
    .where(and(eq(payments.id, paymentId), eq(bookings.userId, userId)))
    .execute();

  if (paymentCheck.length === 0) {
    throw new NotFound("Payment not found or you don't have access to it");
  }

  // حذف الدفعية بالكامل
  await db
    .delete(payments)
    .where(eq(payments.id, paymentId))
    .execute();

  SuccessResponse(res, { message: "Payment deleted successfully" }, 200);
};