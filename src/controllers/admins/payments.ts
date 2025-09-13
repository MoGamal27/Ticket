import { Request, Response } from "express";
import { db } from "../../models/db";
import {
  manualPaymentMethod,
  manualPaymentTypes,
  payments,
  bookingDetails,
  bookingExtras,
  extras,
  bookings,
  users,
  tours,
  tourSchedules
} from "../../models/schema";
import { eq } from "drizzle-orm";
import { SuccessResponse } from "../../utils/response";
import { NotFound } from "../../Errors";
import { sendEmail } from "../../utils/sendEmails";

//import { AxiosResponse } from 'axios';

//const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY!;
//const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID!;

export const getPendingPayments = async (req: Request, res: Response) => {
  const paymentsData = await db
    .select()
    .from(payments)
    .where(eq(payments.status, "pending"));
  SuccessResponse(res, { payments: paymentsData }, 200);
};

export const getPaymentById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const rows = await db
    .select({
      payment: payments,
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
      }
    })
    .from(payments)
    .where(eq(payments.id, id))
    .leftJoin(bookingDetails, eq(bookingDetails.bookingId, payments.id))
    .leftJoin(bookingExtras, eq(bookingExtras.bookingId, payments.id))
    .leftJoin(extras, eq(extras.id, bookingExtras.extraId))
    .leftJoin(manualPaymentMethod, eq(manualPaymentMethod.paymentId, payments.id));

  if (!rows || rows.length === 0) throw new NotFound("Payment Not Found");

  // تجميع bookingExtras لو فيه أكتر من واحدة
  const grouped = rows.reduce((acc: any, row) => {
    if (!acc.payment) {
      acc.payment = row.payment;
      acc.bookingDetails = row.bookingDetails;
      acc.bookingExtras = [];
      acc.manualPayment = row.manualPayment || null;
    }

    if (row.bookingExtras && row.bookingExtras.id) {
      acc.bookingExtras.push(row.bookingExtras);
    }

    return acc;
  }, {} as any);

  SuccessResponse(res, { payment: grouped }, 200);
};

export const changeStatus = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [payment] = await db.select().from(payments).where(eq(payments.id, id));
  if (!payment) throw new NotFound("Payment Not Found");
  const { status, rejectionReason } = req.body;

  if (status === "cancelled") {
    await db
      .update(payments)
      .set({ status, rejectionReason })
      .where(eq(payments.id, id));

    // Update booking status to cancelled
    await db
      .update(bookings)
      .set({ status: "cancelled" })
      .where(eq(bookings.id, payment.bookingId));

    const userEmail = await db
      .select({ email: users.email })
      .from(users)
      .innerJoin(bookings, eq(users.id, bookings.userId))
      .innerJoin(payments, eq(bookings.id, payments.bookingId))
      .where(eq(payments.id, id));

    await sendEmail(
      userEmail[0].email,
      "Payment Cancelled",
      `${rejectionReason}`
    );
  } else {
    await db
      .update(payments)
      .set({ status })
      .where(eq(payments.id, id));

    // Update booking status to match payment status
    await db
      .update(bookings)
      .set({ status: status === "confirmed" ? "confirmed" : "pending" })
      .where(eq(bookings.id, payment.bookingId));

    // Send email when status is confirmed
    if (status === "confirmed") {
      // Get comprehensive details for the confirmation email
      const bookingDetails = await db
        .select({
          email: users.email,
          fullName: users.fullName,
          bookingId: bookings.id,
          tourName: tours.name,
          tourDescription: tours.description,
          tourDuration: tours.duration,
          tourDestination: tours.destination,
          tourStartDate: tourSchedules.startDate,
          tourEndDate: tourSchedules.endDate,
          meetingPoint: tours.meetingPoint,
          bookingDate: bookings.createdAt,
          totalAmount: payments.amount,
          adultsCount: bookingDetails.adultsCount,
          childrenCount: bookingDetails.childrenCount,
          specialRequests: bookingDetails.notes
        })
        .from(users)
        .innerJoin(bookings, eq(users.id, bookings.userId))
        .innerJoin(bookingDetails, eq(bookings.id, bookingDetails.bookingId))
        .innerJoin(payments, eq(bookings.id, payments.bookingId))
        .innerJoin(tours, eq(bookings.tourId, tours.id))
        .innerJoin(tourSchedules, eq(bookings.tourScheduleId, tourSchedules.id))
        .where(eq(payments.id, id));

      if (bookingDetails.length > 0) {
        const details = bookingDetails[0];
        const emailSubject = `Booking Confirmed - ${details.tourName}`;
        
        // Format dates for better readability
        const formatDate = (date: Date) => new Date(date).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        const emailMessage = `
Dear ${details.fullName},

We are delighted to inform you that your payment has been successfully confirmed and your booking is now complete!

TOUR DETAILS:
- Tour Name: ${details.tourName}
- Destination: ${details.tourDestination}
- Description: ${details.tourDescription}
- Duration: ${details.tourDuration} days
- Start Date: ${formatDate(details.tourStartDate)}
- End Date: ${formatDate(details.tourEndDate)}
- Meeting Point: ${details.meetingPoint}

BOOKING INFORMATION:
- Booking Date: ${formatDate(details.bookingDate)}
- Number of Adults: ${details.adultsCount}
- Number of Children: ${details.childrenCount}
- Total Amount: $${details.totalAmount}

Thank you for your booking! We're excited to have you join us on this adventure.

If you have any questions, please don't hesitate to contact our customer support team.

Best regards,
The Ticket Tours Team
        `.trim();

        await sendEmail(details.email, emailSubject, emailMessage);
      }
    }
  }

  SuccessResponse(res, { message: "Status Changed Successfully" }, 200);
};


export const getAutoPayments = async (req: Request, res: Response) => {
  const paymentsData = await db
    .select()
    .from(payments)
    .where(eq(payments.method, "auto"));
  SuccessResponse(res, { payments: paymentsData }, 200);
};



export const getAllPayments = async(req: Request, res: Response) => {
  try {
    const rows = await db
      .select({
        payment: payments,
        bookings: {
          id: bookings.id,
          tourId: tours.id,
          tourScheduleId: bookings.tourId,

          tourScheduleDate: tourSchedules.date, 
          tourScheduleStartDate: tourSchedules.startDate,
          tourScheduleEndDate: tourSchedules.endDate, 
          
          userId: bookings.userId,
          status: bookings.status,
          discountNumber: bookings.discountNumber,
          location: bookings.location,
          address: bookings.address,
          createdAt: bookings.createdAt,
        },
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
          paymentId: manualPaymentMethod.paymentId, // Add this for debugging
          proofImage: manualPaymentMethod.proofImage,
          manualPaymentTypeId: manualPaymentMethod.manualPaymentTypeId,
          uploadedAt: manualPaymentMethod.uploadedAt,
        },
        manualPaymentType: {
          id: manualPaymentTypes.id,
          name: manualPaymentTypes.name,
        },
        tour: {
          id: tours.id
        }
      })
      .from(payments)
      .leftJoin(bookings, eq(bookings.id, payments.bookingId))
      .leftJoin(tourSchedules, eq(tourSchedules.id, bookings.tourId))
      .leftJoin(tours, eq(tours.id, tourSchedules.tourId))
      .leftJoin(bookingDetails, eq(bookingDetails.bookingId, payments.bookingId))
      .leftJoin(bookingExtras, eq(bookingExtras.bookingId, payments.bookingId))
      .leftJoin(extras, eq(extras.id, bookingExtras.extraId))
      .leftJoin(manualPaymentMethod, eq(manualPaymentMethod.paymentId, payments.id)) // THIS IS THE KEY FIX
      .leftJoin(manualPaymentTypes, eq(manualPaymentTypes.id, manualPaymentMethod.manualPaymentTypeId))
      .orderBy(payments.id); // Add ordering for consistency

    console.log("DEBUG - Raw query results count:", rows.length);
    
    // Group by payment.id
    const grouped = Object.values(
      rows.reduce((acc: any, row) => {
        const paymentId = row.payment.id;
        
        if (!acc[paymentId]) {
          console.log(`DEBUG - Processing payment ${paymentId}:`, {
            paymentId: row.payment.id,
            manualPaymentId: row.manualPayment?.id,
            manualPaymentPaymentId: row.manualPayment?.paymentId,
            proofImage: row.manualPayment?.proofImage
          });
          
          acc[paymentId] = {
            payment: row.payment,
            bookings: {
              ...row.bookings,
              tourId: row.tour?.id || null,
              tour: row.tour || null
            },
            bookingDetails: row.bookingDetails,
            bookingExtras: [],
            manualPayment: row.manualPayment ? {
              ...row.manualPayment,
              type: row.manualPaymentType 
            } : null, 
          };
        }
        
        // Add booking extras if they exist and aren't already added
        if (row.bookingExtras && row.bookingExtras.id) {
          const existingExtra = acc[paymentId].bookingExtras.find(
            (extra: any) => extra.id === row.bookingExtras.id
          );
          if (!existingExtra) {
            acc[paymentId].bookingExtras.push(row.bookingExtras);
          }
        }
        
        return acc;
      }, {})
    );

    console.log("DEBUG - Grouped payments count:", grouped.length);
    
    SuccessResponse(res, { payments: grouped }, 200);
  } catch (error) {
    console.error("Error in getAllPayments:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve payments"
    });
  }
};

// Initialize Payment
/*
export const initializePayment = async (req: Request, res: Response) => {
 
  const { bookingId , amount } = req.body;

  if (!bookingId || !amount) {
    return res.status(400).json({ message: "Booking ID and amount are required." });
  }

  const [payment] = await db
  .insert(payments)
  .values({
    bookingId,
    amount,
    status: "pending",
    method: "auto",
  }).$returningId()


    // auth token from paymob
    const authToken = await axios.post('https://accept.paymob.com/api/auth/tokens', {
        api_key: process.env.PAYMOB_API_KEY,
      });

      const token = (authToken.data as { token: string }).token;

      // create orderId in paymob
     const orderResponse: AxiosResponse<{ id: string }> = await axios.post(
  'https://accept.paymob.com/api/ecommerce/orders',
  {
    auth_token: token,
    delivery_needed: false,
    amount_cents: Math.round(amount * 100),
    currency: 'EGP',
    items: [],
  }
);

    const orderId = (orderResponse.data as { id: string }).id;

    const paymentKeyResponse = await axios.post(
      'https://accept.paymob.com/api/acceptance/payment_keys',
      {
        auth_token: token,
        amount_cents: Math.round(amount * 100),
        currency: 'EGP',
        order_id: orderResponse.data.id,
      }
    );


    await db.update(payments)
      .set({ transactionId: orderResponse.data.id })
      .where(eq(payments.id, payment.id));

       if (!payment) {
       return res.status(500).json({ message: "Failed to initialize payment." });
      }

   SuccessResponse(res, {
    message: "Payment initialized successfully.",
    paymentId: payment.id,
    paymentUrl: `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKeyResponse.data.token}`,
  }, 200);
};
*/