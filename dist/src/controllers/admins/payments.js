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
exports.getAutoPayments = exports.changeStatus = exports.getPaymentById = exports.getPendingPayments = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_1 = require("../../utils/response");
const Errors_1 = require("../../Errors");
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
    const [payment] = yield db_1.db
        .select({
        payment: schema_1.payments,
        manualMethod: schema_1.manualPaymentMethod,
        manualType: schema_1.manualPaymentTypes,
    })
        .from(schema_1.payments)
        .where((0, drizzle_orm_1.eq)(schema_1.payments.id, id))
        .leftJoin(schema_1.manualPaymentMethod, (0, drizzle_orm_1.eq)(schema_1.manualPaymentMethod.paymentId, schema_1.payments.id))
        .leftJoin(schema_1.manualPaymentTypes, (0, drizzle_orm_1.eq)(schema_1.manualPaymentTypes.id, schema_1.manualPaymentMethod.manualPaymentTypeId));
    if (!payment)
        throw new Errors_1.NotFound("Payment Not Found");
    (0, response_1.SuccessResponse)(res, { payment }, 200);
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
    }
    yield db_1.db
        .update(schema_1.payments)
        .set({ status, rejectionReason: null })
        .where((0, drizzle_orm_1.eq)(schema_1.payments.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Status Changed Succussfully" }, 200);
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
