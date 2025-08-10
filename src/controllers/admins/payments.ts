import { Request, Response } from "express";
import axios from "axios";
import { db } from "../../models/db";
import {
  manualPaymentMethod,
  manualPaymentTypes,
  payments,
} from "../../models/schema";
import { eq } from "drizzle-orm";
import { SuccessResponse } from "../../utils/response";
import { NotFound } from "../../Errors";
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

  const [payment] = await db
    .select({
      payment: payments,
      manualMethod: manualPaymentMethod,
      manualType: manualPaymentTypes,
    })
    .from(payments)
    .where(eq(payments.id, id))
    .leftJoin(
      manualPaymentMethod,
      eq(manualPaymentMethod.paymentId, payments.id)
    )
    .leftJoin(
      manualPaymentTypes,
      eq(manualPaymentTypes.id, manualPaymentMethod.manualPaymentTypeId)
    );

  if (!payment) throw new NotFound("Payment Not Found");

  SuccessResponse(res, { payment }, 200);
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
  }
  await db
    .update(payments)
    .set({ status, rejectionReason: null })
    .where(eq(payments.id, id));
  SuccessResponse(res, { message: "Status Changed Succussfully" }, 200);
};

export const getAutoPayments = async (req: Request, res: Response) => {
  const paymentsData = await db
    .select()
    .from(payments)
    .where(eq(payments.method, "auto"));
  SuccessResponse(res, { payments: paymentsData }, 200);
};

export const getAllPayments = async(req: Request, res: Response) => {

  const Payments = await db
  .select()
  .from(payments);

  SuccessResponse(res, {payments: Payments}, 200)
}

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