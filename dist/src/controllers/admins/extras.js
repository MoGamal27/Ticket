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
exports.deleteExtra = exports.updateExtra = exports.createExtra = exports.getExtra = exports.getAllExtras = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const drizzle_orm_1 = require("drizzle-orm");
const Errors_1 = require("../../Errors");
const getAllExtras = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const extra = yield db_1.db.select().from(schema_1.extras);
    (0, response_1.SuccessResponse)(res, { extras: extra }, 200);
});
exports.getAllExtras = getAllExtras;
const getExtra = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [extra] = yield db_1.db.select().from(schema_1.extras).where((0, drizzle_orm_1.eq)(schema_1.extras.id, id));
    if (!extra)
        throw new Errors_1.NotFound("Extra Not Found");
    (0, response_1.SuccessResponse)(res, { extra }, 200);
});
exports.getExtra = getExtra;
const createExtra = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    yield db_1.db.insert(schema_1.extras).values(data);
    (0, response_1.SuccessResponse)(res, { message: "Extra Created Successfully" }, 201);
});
exports.createExtra = createExtra;
const updateExtra = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [extra] = yield db_1.db.select().from(schema_1.extras).where((0, drizzle_orm_1.eq)(schema_1.extras.id, id));
    if (!extra)
        throw new Errors_1.NotFound("Extra Not Found");
    const data = req.body;
    yield db_1.db.update(schema_1.extras).set(data).where((0, drizzle_orm_1.eq)(schema_1.extras.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Extra Updated Successfully" }, 200);
});
exports.updateExtra = updateExtra;
const deleteExtra = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [extra] = yield db_1.db.select().from(schema_1.extras).where((0, drizzle_orm_1.eq)(schema_1.extras.id, id));
    if (!extra)
        throw new Errors_1.NotFound("Extra Not Found");
    yield db_1.db.delete(schema_1.extras).where((0, drizzle_orm_1.eq)(schema_1.extras.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Extra Deleted Successfully" }, 200);
});
exports.deleteExtra = deleteExtra;
