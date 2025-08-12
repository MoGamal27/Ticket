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
exports.deletePayment = exports.updatePayment = exports.getPaymentById = exports.getUserPayments = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_1 = require("../../utils/response");
const Errors_1 = require("../../Errors");
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
const getUserPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new Errors_1.UnauthorizedError("User not authenticated");
    }
    const userId = Number(req.user.id);
    const userPaymentsRaw = yield db_1.db
        .select({
        payments: schema_1.payments,
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
    })
        .from(schema_1.payments)
        .innerJoin(schema_1.bookings, (0, drizzle_orm_1.eq)(schema_1.payments.bookingId, schema_1.bookings.id))
        .innerJoin(schema_1.bookingDetails, (0, drizzle_orm_1.eq)(schema_1.bookings.id, schema_1.bookingDetails.bookingId))
        .innerJoin(schema_1.bookingExtras, (0, drizzle_orm_1.eq)(schema_1.bookings.id, schema_1.bookingExtras.bookingId))
        .innerJoin(schema_1.extras, (0, drizzle_orm_1.eq)(schema_1.bookingExtras.extraId, schema_1.extras.id))
        .where((0, drizzle_orm_1.eq)(schema_1.bookings.userId, userId))
        .execute();
    const groupedPayments = {
        pending: userPaymentsRaw.filter(item => item.payments.status === "pending"),
        confirmed: userPaymentsRaw.filter(item => item.payments.status === "confirmed"),
        cancelled: userPaymentsRaw.filter(item => item.payments.status === "cancelled"),
    };
    (0, response_1.SuccessResponse)(res, groupedPayments, 200);
});
exports.getUserPayments = getUserPayments;
const getPaymentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new Errors_1.UnauthorizedError("User not authenticated");
    }
    const userId = Number(req.user.id);
    const paymentId = Number(req.params.id);
    // 1️⃣ هات الـ payment مع الحجز المرتبط بيها
    const paymentData = yield db_1.db
        .select({
        payments: schema_1.payments,
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
    })
        .from(schema_1.payments)
        .innerJoin(schema_1.bookings, (0, drizzle_orm_1.eq)(schema_1.payments.bookingId, schema_1.bookings.id))
        .innerJoin(schema_1.bookingDetails, (0, drizzle_orm_1.eq)(schema_1.bookings.id, schema_1.bookingDetails.bookingId))
        .innerJoin(schema_1.bookingExtras, (0, drizzle_orm_1.eq)(schema_1.bookings.id, schema_1.bookingExtras.bookingId))
        .innerJoin(schema_1.extras, (0, drizzle_orm_1.eq)(schema_1.bookingExtras.extraId, schema_1.extras.id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.payments.id, paymentId), (0, drizzle_orm_1.eq)(schema_1.bookings.userId, userId) // للتأكد أن اليوزر صاحب الـ payment
    ))
        .execute();
    // 2️⃣ لو مش لاقي
    if (paymentData.length === 0) {
        throw new Errors_1.NotFound("Payment not found or you don't have access to it");
    }
    // 3️⃣ رجع النتيجة
    (0, response_1.SuccessResponse)(res, paymentData[0], 200);
});
exports.getPaymentById = getPaymentById;
const updatePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new Errors_1.UnauthorizedError("User not authenticated");
    }
    const userId = Number(req.user.id);
    const paymentId = Number(req.params.id);
    const { method } = req.body; // المستخدم بس يقدر يعدل الميثود
    // تحقق إن الـ payment بتخص اليوزر
    const paymentCheck = yield db_1.db
        .select()
        .from(schema_1.payments)
        .innerJoin(schema_1.bookings, (0, drizzle_orm_1.eq)(schema_1.payments.bookingId, schema_1.bookings.id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.payments.id, paymentId), (0, drizzle_orm_1.eq)(schema_1.bookings.userId, userId)))
        .execute();
    if (paymentCheck.length === 0) {
        throw new Errors_1.NotFound("Payment not found or you don't have access to it");
    }
    // تحديث الحقول المسموح بيها فقط
    yield db_1.db
        .update(schema_1.payments)
        .set(Object.assign({}, (method && { method })))
        .where((0, drizzle_orm_1.eq)(schema_1.payments.id, paymentId))
        .execute();
    (0, response_1.SuccessResponse)(res, { message: "Payment updated successfully" }, 200);
});
exports.updatePayment = updatePayment;
const deletePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new Errors_1.UnauthorizedError("User not authenticated");
    }
    const userId = Number(req.user.id);
    const paymentId = Number(req.params.id);
    // تحقق إن الـ payment بتخص اليوزر
    const paymentCheck = yield db_1.db
        .select()
        .from(schema_1.payments)
        .innerJoin(schema_1.bookings, (0, drizzle_orm_1.eq)(schema_1.payments.bookingId, schema_1.bookings.id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.payments.id, paymentId), (0, drizzle_orm_1.eq)(schema_1.bookings.userId, userId)))
        .execute();
    if (paymentCheck.length === 0) {
        throw new Errors_1.NotFound("Payment not found or you don't have access to it");
    }
    // حذف الدفعية بالكامل
    yield db_1.db
        .delete(schema_1.payments)
        .where((0, drizzle_orm_1.eq)(schema_1.payments.id, paymentId))
        .execute();
    (0, response_1.SuccessResponse)(res, { message: "Payment deleted successfully" }, 200);
});
exports.deletePayment = deletePayment;
