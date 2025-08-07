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
exports.deleteCurrency = exports.updateCurrency = exports.createCurrency = exports.getCurrency = exports.getAllCurrencies = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const drizzle_orm_1 = require("drizzle-orm");
const Errors_1 = require("../../Errors");
const getAllCurrencies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currency = yield db_1.db.select().from(schema_1.currencies);
    (0, response_1.SuccessResponse)(res, { currencies: currency }, 200);
});
exports.getAllCurrencies = getAllCurrencies;
const getCurrency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [currency] = yield db_1.db
        .select()
        .from(schema_1.currencies)
        .where((0, drizzle_orm_1.eq)(schema_1.currencies.id, id));
    (0, response_1.SuccessResponse)(res, { currency }, 200);
});
exports.getCurrency = getCurrency;
const createCurrency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    yield db_1.db.insert(schema_1.currencies).values(data);
    (0, response_1.SuccessResponse)(res, { message: "Currency Added Successfully" }, 201);
});
exports.createCurrency = createCurrency;
const updateCurrency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [currency] = yield db_1.db
        .select()
        .from(schema_1.currencies)
        .where((0, drizzle_orm_1.eq)(schema_1.currencies.id, id));
    if (!currency)
        throw new Errors_1.NotFound("Currency Not Found");
    const data = req.body;
    yield db_1.db.update(schema_1.currencies).set(data).where((0, drizzle_orm_1.eq)(schema_1.currencies.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Currency Updated Successfully" }, 200);
});
exports.updateCurrency = updateCurrency;
const deleteCurrency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [currency] = yield db_1.db
        .select()
        .from(schema_1.currencies)
        .where((0, drizzle_orm_1.eq)(schema_1.currencies.id, id));
    if (!currency)
        throw new Errors_1.NotFound("Currency Not Found");
    const data = req.body;
    yield db_1.db.delete(schema_1.currencies).where((0, drizzle_orm_1.eq)(schema_1.currencies.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Currency Deleted Successfully" }, 200);
});
exports.deleteCurrency = deleteCurrency;
