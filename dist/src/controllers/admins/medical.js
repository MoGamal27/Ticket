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
exports.getMedicalById = exports.getAllMedicals = exports.deleteMedicalCategory = exports.getMedicalCategoryById = exports.updateCategoryMedical = exports.createMedicalCategory = exports.getMedicalCategories = void 0;
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
// get all medical 
const getAllMedicals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get all medical records
        const medicals = yield db_1.db.select().from(schema_1.Medicals);
        // Get all medical images grouped by medical_id
        const images = yield db_1.db.select().from(schema_1.MedicalImages);
        const imagesByMedicalId = images.reduce((acc, image) => {
            if (!acc[image.medicalId]) {
                acc[image.medicalId] = [];
            }
            acc[image.medicalId].push(image);
            return acc;
        }, {});
        // Combine medical records with their images
        const medicalsWithImages = medicals.map(medical => (Object.assign(Object.assign({}, medical), { images: imagesByMedicalId[medical.id] || [] })));
        (0, response_1.SuccessResponse)(res, { medicals: medicalsWithImages }, 200);
    }
    catch (error) {
        console.error("Error fetching medical records:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllMedicals = getAllMedicals;
const getMedicalById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        // Get the medical record
        const [medical] = yield db_1.db
            .select()
            .from(schema_1.Medicals)
            .where((0, drizzle_orm_1.eq)(schema_1.Medicals.id, id));
        if (!medical) {
            throw new Errors_1.NotFound("Medical Not Found");
        }
        // Get all images for this medical record
        const images = yield db_1.db
            .select()
            .from(schema_1.MedicalImages)
            .where((0, drizzle_orm_1.eq)(schema_1.MedicalImages.medicalId, id));
        // Combine the data
        const medicalWithImages = Object.assign(Object.assign({}, medical), { images });
        (0, response_1.SuccessResponse)(res, { medical: medicalWithImages }, 200);
    }
    catch (error) {
        if (error instanceof Errors_1.NotFound) {
            return res.status(404).json({ message: error.message });
        }
        console.error("Error fetching medical record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getMedicalById = getMedicalById;
