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
exports.getStatistics = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_1 = require("../../utils/response");
const getStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [{ userCount }] = yield db_1.db
        .select({ userCount: (0, drizzle_orm_1.sql) `COUNT(*)` })
        .from(schema_1.users);
    const [{ tourCount }] = yield db_1.db
        .select({ tourCount: (0, drizzle_orm_1.sql) `COUNT(*)` })
        .from(schema_1.tours);
    const [{ bookingCount }] = yield db_1.db
        .select({ bookingCount: (0, drizzle_orm_1.sql) `COUNT(*)` })
        .from(schema_1.bookings);
    const [{ paymnetCount }] = yield db_1.db
        .select({ paymnetCount: (0, drizzle_orm_1.sql) `COUNT(*)` })
        .from(schema_1.payments)
        .where((0, drizzle_orm_1.eq)(schema_1.payments.status, "pending"));
    const [{ promocodeCount }] = yield db_1.db
        .select({ promocodeCount: (0, drizzle_orm_1.sql) `COUNT(*)` })
        .from(schema_1.promoCode)
        .where((0, drizzle_orm_1.eq)(schema_1.promoCode.status, true));
    (0, response_1.SuccessResponse)(res, { userCount, tourCount, bookingCount, paymnetCount, promocodeCount }, 200);
});
exports.getStatistics = getStatistics;
