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
exports.deleteHomePageCover = exports.updateHomePageCover = exports.createHomePageCover = exports.getHomePageCover = exports.getAllHomePageCover = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const drizzle_orm_1 = require("drizzle-orm");
const Errors_1 = require("../../Errors");
const handleImages_1 = require("../../utils/handleImages");
const uuid_1 = require("uuid");
const deleteImage_1 = require("../../utils/deleteImage");
const getAllHomePageCover = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pages = yield db_1.db.select().from(schema_1.homePageCover);
    (0, response_1.SuccessResponse)(res, { pages }, 200);
});
exports.getAllHomePageCover = getAllHomePageCover;
const getHomePageCover = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [page] = yield db_1.db
        .select()
        .from(schema_1.homePageCover)
        .where((0, drizzle_orm_1.eq)(schema_1.homePageCover.id, id));
    if (!page)
        throw new Errors_1.NotFound("Home Page Cover Not Found");
    (0, response_1.SuccessResponse)(res, { page }, 200);
});
exports.getHomePageCover = getHomePageCover;
const createHomePageCover = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    data.imagePath = yield (0, handleImages_1.saveBase64Image)(data.imagePath, (0, uuid_1.v4)(), req, "homes");
    yield db_1.db.insert(schema_1.homePageCover).values(data);
    (0, response_1.SuccessResponse)(res, { message: "Home Page Created Successfully" }, 200);
});
exports.createHomePageCover = createHomePageCover;
const updateHomePageCover = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [page] = yield db_1.db
        .select()
        .from(schema_1.homePageCover)
        .where((0, drizzle_orm_1.eq)(schema_1.homePageCover.id, id));
    if (!page)
        throw new Errors_1.NotFound("Page Not Found");
    const data = req.body;
    if (data.imagePath) {
        yield (0, deleteImage_1.deletePhotoFromServer)(new URL(page.imagePath).pathname);
        data.imagePath = yield (0, handleImages_1.saveBase64Image)(data.imagePath, (0, uuid_1.v4)(), req, "homes");
    }
    yield db_1.db.update(schema_1.homePageCover).set(data).where((0, drizzle_orm_1.eq)(schema_1.homePageCover.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Home Page Updated Successfully" }, 200);
});
exports.updateHomePageCover = updateHomePageCover;
const deleteHomePageCover = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [page] = yield db_1.db
        .select()
        .from(schema_1.homePageCover)
        .where((0, drizzle_orm_1.eq)(schema_1.homePageCover.id, id));
    if (!page)
        throw new Errors_1.NotFound("Page Not Found");
    yield (0, deleteImage_1.deletePhotoFromServer)(new URL(page.imagePath).pathname);
    yield db_1.db.delete(schema_1.homePageCover).where((0, drizzle_orm_1.eq)(schema_1.homePageCover.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Home Page Deleted Successfully" }, 200);
});
exports.deleteHomePageCover = deleteHomePageCover;
