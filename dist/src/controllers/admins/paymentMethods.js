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
exports.createMethod = exports.deleteMethod = exports.updateMethod = exports.getMethod = exports.getAllPaymentMethods = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const drizzle_orm_1 = require("drizzle-orm");
const Errors_1 = require("../../Errors");
const deleteImage_1 = require("../../utils/deleteImage");
const handleImages_1 = require("../../utils/handleImages");
const uuid_1 = require("uuid");
const getAllPaymentMethods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const methods = yield db_1.db.select().from(schema_1.manualPaymentTypes);
    (0, response_1.SuccessResponse)(res, { methods }, 200);
});
exports.getAllPaymentMethods = getAllPaymentMethods;
const getMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [method] = yield db_1.db
        .select()
        .from(schema_1.manualPaymentTypes)
        .where((0, drizzle_orm_1.eq)(schema_1.manualPaymentTypes.id, id));
    if (!method)
        throw new Errors_1.NotFound("Method not found");
    (0, response_1.SuccessResponse)(res, { method }, 200);
});
exports.getMethod = getMethod;
const updateMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [method] = yield db_1.db
        .select()
        .from(schema_1.manualPaymentTypes)
        .where((0, drizzle_orm_1.eq)(schema_1.manualPaymentTypes.id, id));
    if (!method)
        throw new Errors_1.NotFound("Method not found");
    const data = req.body;
    if (data.logoPath) {
        yield (0, deleteImage_1.deletePhotoFromServer)(new URL(method.logoPath).pathname);
        data.logoPath = yield (0, handleImages_1.saveBase64Image)(data.logoPath, (0, uuid_1.v4)(), req, "paymentMethods");
    }
    yield db_1.db
        .update(schema_1.manualPaymentTypes)
        .set(data)
        .where((0, drizzle_orm_1.eq)(schema_1.manualPaymentTypes.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Method Updated Successfully" }, 200);
});
exports.updateMethod = updateMethod;
const deleteMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [method] = yield db_1.db
        .select()
        .from(schema_1.manualPaymentTypes)
        .where((0, drizzle_orm_1.eq)(schema_1.manualPaymentTypes.id, id));
    if (!method)
        throw new Errors_1.NotFound("Method not found");
    yield (0, deleteImage_1.deletePhotoFromServer)(new URL(method.logoPath).pathname);
    yield db_1.db.delete(schema_1.manualPaymentTypes).where((0, drizzle_orm_1.eq)(schema_1.manualPaymentTypes.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Method Deleted Successfully" }, 200);
});
exports.deleteMethod = deleteMethod;
const createMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    data.logoPath = yield (0, handleImages_1.saveBase64Image)(data.logoPath, (0, uuid_1.v4)(), req, "paymentMethods");
    yield db_1.db.insert(schema_1.manualPaymentTypes).values(data);
    (0, response_1.SuccessResponse)(res, { message: "Method Created Successfully" }, 201);
});
exports.createMethod = createMethod;
