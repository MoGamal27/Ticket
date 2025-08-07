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
exports.deleteCode = exports.updateCode = exports.createCode = exports.getCode = exports.getAllPromoCodes = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const drizzle_orm_1 = require("drizzle-orm");
const Errors_1 = require("../../Errors");
const getAllPromoCodes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const codes = yield db_1.db.select().from(schema_1.promoCode);
    (0, response_1.SuccessResponse)(res, { codes }, 200);
});
exports.getAllPromoCodes = getAllPromoCodes;
const getCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [code] = yield db_1.db.select().from(schema_1.promoCode).where((0, drizzle_orm_1.eq)(schema_1.promoCode.id, id));
    if (!code)
        throw new Errors_1.NotFound("Promo Code Not Found");
    const codeUsers = yield db_1.db
        .select()
        .from(schema_1.promoCodeUsers)
        .where((0, drizzle_orm_1.eq)(schema_1.promoCodeUsers.promoCodeId, id));
    (0, response_1.SuccessResponse)(res, Object.assign(Object.assign({}, code), { codeUsers }), 200);
});
exports.getCode = getCode;
const createCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    yield db_1.db.insert(schema_1.promoCode).values(data);
    (0, response_1.SuccessResponse)(res, { message: "Code created Successfully" }, 201);
});
exports.createCode = createCode;
const updateCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [code] = yield db_1.db.select().from(schema_1.promoCode).where((0, drizzle_orm_1.eq)(schema_1.promoCode.id, id));
    if (!code)
        throw new Errors_1.NotFound("Code Not Found");
    const data = req.body;
    yield db_1.db.update(schema_1.promoCode).set(data).where((0, drizzle_orm_1.eq)(schema_1.promoCode.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Code updated Successfully" }, 201);
});
exports.updateCode = updateCode;
const deleteCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [code] = yield db_1.db.select().from(schema_1.promoCode).where((0, drizzle_orm_1.eq)(schema_1.promoCode.id, id));
    if (!code)
        throw new Errors_1.NotFound("Code Not Found");
    yield db_1.db.delete(schema_1.promoCode).where((0, drizzle_orm_1.eq)(schema_1.promoCode.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Code deleted Successfully" }, 201);
});
exports.deleteCode = deleteCode;
