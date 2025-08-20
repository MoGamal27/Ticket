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
exports.getAllPayments = exports.getAutoPayments = exports.changeStatus = exports.getPaymentById = exports.getPendingPayments = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_1 = require("../../utils/response");
const Errors_1 = require("../../Errors");
const sendEmails_1 = require("../../utils/sendEmails");
//import { AxiosResponse } from 'axios';
//const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY!;
//const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID!;
const getPendingPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentsData = yield db_1.db
        .select()
        .from(schema_1.payments)
        .where((0, drizzle_orm_1.eq)(schema_1.payments.status, "pending"));
    (0, response_1.SuccessResponse)(res, { payments: paymentsData }, 200);
});
exports.getPendingPayments = getPendingPayments;
const getPaymentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const rows = yield db_1.db
        .select({
        payment: schema_1.payments,
        bookingDetails: schema_1.bookingDetails,
        bookingExtras: {
            id: schema_1.bookingExtras.id,
            bookingId: schema_1.bookingExtras.bookingId,
            extraId: schema_1.bookingExtras.extraId,
            extraName: schema_1.extras.name,
            adultCount: schema_1.bookingExtras.adultCount,
            childCount: schema_1.bookingExtras.childCount,
            infantCount: schema_1.bookingExtras.infantCount,
            createdAt: schema_1.bookingExtras.createdAt,
        },
        manualPayment: {
            id: schema_1.manualPaymentMethod.id,
            proofImage: schema_1.manualPaymentMethod.proofImage,
            manualPaymentTypeId: schema_1.manualPaymentMethod.manualPaymentTypeId,
            uploadedAt: schema_1.manualPaymentMethod.uploadedAt,
        }
    })
        .from(schema_1.payments)
        .where((0, drizzle_orm_1.eq)(schema_1.payments.id, id))
        .leftJoin(schema_1.bookingDetails, (0, drizzle_orm_1.eq)(schema_1.bookingDetails.bookingId, schema_1.payments.id))
        .leftJoin(schema_1.bookingExtras, (0, drizzle_orm_1.eq)(schema_1.bookingExtras.bookingId, schema_1.payments.id))
        .leftJoin(schema_1.extras, (0, drizzle_orm_1.eq)(schema_1.extras.id, schema_1.bookingExtras.extraId))
        .leftJoin(schema_1.manualPaymentMethod, (0, drizzle_orm_1.eq)(schema_1.manualPaymentMethod.paymentId, schema_1.payments.id));
    if (!rows || rows.length === 0)
        throw new Errors_1.NotFound("Payment Not Found");
    // تجميع bookingExtras لو فيه أكتر من واحدة
    const grouped = rows.reduce((acc, row) => {
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
    }, {});
    (0, response_1.SuccessResponse)(res, { payment: grouped }, 200);
});
exports.getPaymentById = getPaymentById;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [payment] = yield db_1.db.select().from(schema_1.payments).where((0, drizzle_orm_1.eq)(schema_1.payments.id, id));
    if (!payment)
        throw new Errors_1.NotFound("Payment Not Found");
    const { status, rejectionReason } = req.body;
    if (status === "cancelled") {
        yield db_1.db
            .update(schema_1.payments)
            .set({ status, rejectionReason })
            .where((0, drizzle_orm_1.eq)(schema_1.payments.id, id));
        // Update booking status to cancelled
        yield db_1.db
            .update(schema_1.bookings)
            .set({ status: "cancelled" })
            .where((0, drizzle_orm_1.eq)(schema_1.bookings.id, payment.bookingId));
        const userEmail = yield db_1.db
            .select({ email: schema_1.users.email })
            .from(schema_1.users)
            .innerJoin(schema_1.bookings, (0, drizzle_orm_1.eq)(schema_1.users.id, schema_1.bookings.userId))
            .innerJoin(schema_1.payments, (0, drizzle_orm_1.eq)(schema_1.bookings.id, schema_1.payments.bookingId))
            .where((0, drizzle_orm_1.eq)(schema_1.payments.id, id));
        yield (0, sendEmails_1.sendEmail)(userEmail[0].email, "Payment Cancelled", `${rejectionReason}`);
    }
    else {
        yield db_1.db
            .update(schema_1.payments)
            .set({ status })
            .where((0, drizzle_orm_1.eq)(schema_1.payments.id, id));
        // Update booking status to match payment status
        yield db_1.db
            .update(schema_1.bookings)
            .set({ status: status === "confirmed" ? "confirmed" : "pending" })
            .where((0, drizzle_orm_1.eq)(schema_1.bookings.id, payment.bookingId));
    }
    (0, response_1.SuccessResponse)(res, { message: "Status Changed Successfully" }, 200);
});
exports.changeStatus = changeStatus;
const getAutoPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentsData = yield db_1.db
        .select()
        .from(schema_1.payments)
        .where((0, drizzle_orm_1.eq)(schema_1.payments.method, "auto"));
    (0, response_1.SuccessResponse)(res, { payments: paymentsData }, 200);
});
exports.getAutoPayments = getAutoPayments;
const getAllPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield db_1.db
        .select({
        payment: schema_1.payments,
        bookings: {
            id: schema_1.bookings.id,
            tourId: schema_1.tours.id,
            tourScheduleId: schema_1.bookings.tourId,
            userId: schema_1.bookings.userId,
            status: schema_1.bookings.status,
            discountNumber: schema_1.bookings.discountNumber,
            location: schema_1.bookings.location,
            address: schema_1.bookings.address,
            createdAt: schema_1.bookings.createdAt,
        },
        bookingDetails: schema_1.bookingDetails,
        bookingExtras: {
            id: schema_1.bookingExtras.id,
            bookingId: schema_1.bookingExtras.bookingId,
            extraId: schema_1.bookingExtras.extraId,
            extraName: schema_1.extras.name,
            adultCount: schema_1.bookingExtras.adultCount,
            childCount: schema_1.bookingExtras.childCount,
            infantCount: schema_1.bookingExtras.infantCount,
            createdAt: schema_1.bookingExtras.createdAt,
        },
        manualPayment: {
            id: schema_1.manualPaymentMethod.id,
            proofImage: schema_1.manualPaymentMethod.proofImage,
            manualPaymentTypeId: schema_1.manualPaymentMethod.manualPaymentTypeId,
            uploadedAt: schema_1.manualPaymentMethod.uploadedAt,
        },
        manualPaymentType: {
            id: schema_1.manualPaymentTypes.id,
            name: schema_1.manualPaymentTypes.name,
        },
        tour: {
            id: schema_1.tours.id
        }
    })
        .from(schema_1.payments)
        .leftJoin(schema_1.bookings, (0, drizzle_orm_1.eq)(schema_1.bookings.id, schema_1.payments.bookingId))
        .leftJoin(schema_1.tourSchedules, (0, drizzle_orm_1.eq)(schema_1.tourSchedules.id, schema_1.bookings.tourId))
        .leftJoin(schema_1.tours, (0, drizzle_orm_1.eq)(schema_1.tours.id, schema_1.tourSchedules.tourId))
        .leftJoin(schema_1.bookingDetails, (0, drizzle_orm_1.eq)(schema_1.bookingDetails.bookingId, schema_1.payments.bookingId))
        .leftJoin(schema_1.bookingExtras, (0, drizzle_orm_1.eq)(schema_1.bookingExtras.bookingId, schema_1.payments.bookingId))
        .leftJoin(schema_1.extras, (0, drizzle_orm_1.eq)(schema_1.extras.id, schema_1.bookingExtras.extraId))
        .leftJoin(schema_1.manualPaymentMethod, (0, drizzle_orm_1.eq)(schema_1.manualPaymentMethod.paymentId, schema_1.payments.id))
        .leftJoin(schema_1.manualPaymentTypes, (0, drizzle_orm_1.eq)(schema_1.manualPaymentTypes.id, schema_1.manualPaymentMethod.manualPaymentTypeId));
    // Group by payment.id
    const grouped = Object.values(rows.reduce((acc, row) => {
        var _a;
        const paymentId = row.payment.id;
        if (!acc[paymentId]) {
            acc[paymentId] = {
                payment: row.payment,
                bookings: Object.assign(Object.assign({}, row.bookings), { tourId: ((_a = row.tour) === null || _a === void 0 ? void 0 : _a.id) || null, tour: row.tour || null }),
                bookingDetails: row.bookingDetails,
                bookingExtras: [],
                manualPayment: row.manualPayment ? Object.assign(Object.assign({}, row.manualPayment), { type: row.manualPaymentType // Include payment type info
                 }) : null,
            };
        }
        // Add booking extras if they exist and haven't been added already
        if (row.bookingExtras && row.bookingExtras.id) {
            const existingExtra = acc[paymentId].bookingExtras.find((extra) => extra.id === row.bookingExtras.id);
            if (!existingExtra) {
                acc[paymentId].bookingExtras.push(row.bookingExtras);
            }
        }
        return acc;
    }, {}));
    (0, response_1.SuccessResponse)(res, { payments: grouped }, 200);
});
exports.getAllPayments = getAllPayments;
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
