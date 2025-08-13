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
        manualPayment: {
            id: schema_1.manualPaymentMethod.id,
            proofImage: schema_1.manualPaymentMethod.proofImage,
            manualPaymentTypeId: schema_1.manualPaymentMethod.manualPaymentTypeId,
            uploadedAt: schema_1.manualPaymentMethod.uploadedAt
        }
    })
        .from(schema_1.payments)
        .innerJoin(schema_1.bookings, (0, drizzle_orm_1.eq)(schema_1.payments.bookingId, schema_1.bookings.id))
        .innerJoin(schema_1.bookingDetails, (0, drizzle_orm_1.eq)(schema_1.bookings.id, schema_1.bookingDetails.bookingId))
        .leftJoin(schema_1.bookingExtras, (0, drizzle_orm_1.eq)(schema_1.bookings.id, schema_1.bookingExtras.bookingId))
        .leftJoin(schema_1.extras, (0, drizzle_orm_1.eq)(schema_1.bookingExtras.extraId, schema_1.extras.id))
        .leftJoin(schema_1.manualPaymentMethod, (0, drizzle_orm_1.eq)(schema_1.payments.id, schema_1.manualPaymentMethod.paymentId))
        .where((0, drizzle_orm_1.eq)(schema_1.bookings.userId, userId))
        .execute();
    // إعادة تجميع البيانات بحيث لا يتكرر paymentId
    const groupedByPayment = Object.values(userPaymentsRaw.reduce((acc, row) => {
        var _a;
        const paymentId = row.payments.id;
        if (!acc[paymentId]) {
            acc[paymentId] = {
                payments: row.payments,
                bookingDetails: row.bookingDetails,
                bookingExtras: [],
                manualPayment: ((_a = row.manualPayment) === null || _a === void 0 ? void 0 : _a.proofImage)
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
    }, {}));
    // تقسيم حسب الحالة
    const groupedPayments = {
        pending: groupedByPayment.filter(item => item.payments.status === "pending"),
        confirmed: groupedByPayment.filter(item => item.payments.status === "confirmed"),
        cancelled: groupedByPayment.filter(item => item.payments.status === "cancelled"),
    };
    (0, response_1.SuccessResponse)(res, groupedPayments, 200);
});
exports.getUserPayments = getUserPayments;
const getPaymentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.user || !req.user.id) {
        throw new Errors_1.UnauthorizedError("User not authenticated");
    }
    const userId = Number(req.user.id);
    const paymentId = Number(req.params.id);
    const paymentRows = yield db_1.db
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
        manualPayment: {
            id: schema_1.manualPaymentMethod.id,
            proofImage: schema_1.manualPaymentMethod.proofImage,
            manualPaymentTypeId: schema_1.manualPaymentMethod.manualPaymentTypeId,
            uploadedAt: schema_1.manualPaymentMethod.uploadedAt,
        },
    })
        .from(schema_1.payments)
        .innerJoin(schema_1.bookings, (0, drizzle_orm_1.eq)(schema_1.payments.bookingId, schema_1.bookings.id))
        .innerJoin(schema_1.bookingDetails, (0, drizzle_orm_1.eq)(schema_1.bookings.id, schema_1.bookingDetails.bookingId))
        .leftJoin(schema_1.bookingExtras, (0, drizzle_orm_1.eq)(schema_1.bookings.id, schema_1.bookingExtras.bookingId))
        .leftJoin(schema_1.extras, (0, drizzle_orm_1.eq)(schema_1.bookingExtras.extraId, schema_1.extras.id))
        .leftJoin(schema_1.manualPaymentMethod, (0, drizzle_orm_1.eq)(schema_1.manualPaymentMethod.paymentId, schema_1.payments.id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.payments.id, paymentId), (0, drizzle_orm_1.eq)(schema_1.bookings.userId, userId)))
        .execute();
    if (paymentRows.length === 0) {
        throw new Errors_1.NotFound("Payment not found or you don't have access to it");
    }
    const paymentData = {
        payments: paymentRows[0].payments,
        bookingDetails: paymentRows[0].bookingDetails,
        bookingExtras: [],
        manualPayment: ((_a = paymentRows[0].manualPayment) === null || _a === void 0 ? void 0 : _a.proofImage)
            ? Object.assign({}, paymentRows[0].manualPayment) : null,
    };
    // إضافة كل الـ bookingExtras بدون تكرار وبشكل آمن
    paymentRows.forEach(row => {
        var _a;
        if (((_a = row.bookingExtras) === null || _a === void 0 ? void 0 : _a.id) != null) {
            paymentData.bookingExtras.push(row.bookingExtras);
        }
    });
    (0, response_1.SuccessResponse)(res, paymentData, 200);
});
exports.getPaymentById = getPaymentById;
const updatePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new Errors_1.UnauthorizedError("User not authenticated");
    }
    const userId = Number(req.user.id);
    const paymentId = Number(req.params.id);
    const { method } = req.body;
    const paymentCheck = yield db_1.db
        .select()
        .from(schema_1.payments)
        .innerJoin(schema_1.bookings, (0, drizzle_orm_1.eq)(schema_1.payments.bookingId, schema_1.bookings.id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.payments.id, paymentId), (0, drizzle_orm_1.eq)(schema_1.bookings.userId, userId)))
        .execute();
    if (paymentCheck.length === 0) {
        throw new Errors_1.NotFound("Payment not found or you don't have access to it");
    }
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
