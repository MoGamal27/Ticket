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
exports.updateCategory = exports.getCategory = exports.getAllCategory = void 0;
const handleImages_1 = require("../../utils/handleImages");
const uuid_1 = require("uuid");
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_1 = require("../../utils/response");
const Errors_1 = require("../../Errors");
const deleteImage_1 = require("../../utils/deleteImage");
const getAllCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Categorys = yield db_1.db.select().from(schema_1.categories);
    (0, response_1.SuccessResponse)(res, { Categories: Categorys }, 200);
});
exports.getAllCategory = getAllCategory;
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [category] = yield db_1.db
        .select()
        .from(schema_1.categories)
        .where((0, drizzle_orm_1.eq)(schema_1.categories.id, id));
    if (!category)
        throw new Errors_1.NotFound("Category Not Found");
    (0, response_1.SuccessResponse)(res, { category }, 200);
});
exports.getCategory = getCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [category] = yield db_1.db
        .select()
        .from(schema_1.categories)
        .where((0, drizzle_orm_1.eq)(schema_1.categories.id, id));
    if (!category)
        throw new Errors_1.NotFound("Category Not Found");
    let { status, imagePath } = req.body;
    if (imagePath) {
        yield (0, deleteImage_1.deletePhotoFromServer)(new URL(category.imagePath).pathname);
        imagePath = yield (0, handleImages_1.saveBase64Image)(imagePath, (0, uuid_1.v4)(), req, "categories");
    }
    yield db_1.db
        .update(schema_1.categories)
        .set({ status, imagePath })
        .where((0, drizzle_orm_1.eq)(schema_1.categories.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Category updated Succesfully" }, 200);
});
exports.updateCategory = updateCategory;
