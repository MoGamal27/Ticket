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
exports.deleteMedicalCategory = exports.getMedicalCategoryById = exports.updateCategoryMedical = exports.createMedicalCategory = exports.getMedicalCategories = void 0;
const schema_1 = require("../../models/schema");
const db_1 = require("../../models/db");
const response_1 = require("../../utils/response");
const drizzle_orm_1 = require("drizzle-orm");
const Errors_1 = require("../../Errors");
const getMedicalCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield db_1.db.select().from(schema_1.categoryMedical);
    (0, response_1.SuccessResponse)(res, { categoriesMedical: data }, 200);
});
exports.getMedicalCategories = getMedicalCategories;
const createMedicalCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    yield db_1.db.insert(schema_1.categoryMedical).values(data);
    (0, response_1.SuccessResponse)(res, { message: "Category Medical Created Successfully" }, 201);
});
exports.createMedicalCategory = createMedicalCategory;
const updateCategoryMedical = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [categorymedical] = yield db_1.db
        .select()
        .from(schema_1.categoryMedical)
        .where((0, drizzle_orm_1.eq)(schema_1.categoryMedical.id, id));
    if (!categorymedical)
        throw new Errors_1.NotFound("Category Medical Not Found");
    yield db_1.db.update(schema_1.categoryMedical).set(req.body).where((0, drizzle_orm_1.eq)(schema_1.categoryMedical.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Country Updated Successfully" }, 200);
});
exports.updateCategoryMedical = updateCategoryMedical;
const getMedicalCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [categorymedical] = yield db_1.db
        .select()
        .from(schema_1.categoryMedical)
        .where((0, drizzle_orm_1.eq)(schema_1.categoryMedical.id, id));
    if (!categorymedical)
        throw new Errors_1.NotFound("Category Medical Not Found");
    (0, response_1.SuccessResponse)(res, { categorymedical }, 200);
});
exports.getMedicalCategoryById = getMedicalCategoryById;
const deleteMedicalCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [categorymedical] = yield db_1.db
        .select()
        .from(schema_1.categoryMedical)
        .where((0, drizzle_orm_1.eq)(schema_1.categoryMedical.id, id));
    if (!schema_1.categoryMedical)
        throw new Errors_1.NotFound("Category Medical Not Found");
    yield db_1.db.delete(schema_1.categoryMedical).where((0, drizzle_orm_1.eq)(schema_1.categoryMedical.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Category Medical Deleted Successfully" }, 200);
});
exports.deleteMedicalCategory = deleteMedicalCategory;
