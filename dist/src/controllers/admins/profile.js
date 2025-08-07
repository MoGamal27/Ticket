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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_1 = require("../../utils/response");
const bcrypt_1 = __importDefault(require("bcrypt"));
const deleteImage_1 = require("../../utils/deleteImage");
const handleImages_1 = require("../../utils/handleImages");
const uuid_1 = require("uuid");
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const [data] = yield db_1.db.select().from(schema_1.admins).where((0, drizzle_orm_1.eq)(schema_1.admins.id, user.id));
    (0, response_1.SuccessResponse)(res, { admin: data }, 200);
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const [userData] = yield db_1.db
        .select()
        .from(schema_1.admins)
        .where((0, drizzle_orm_1.eq)(schema_1.admins.id, user.id));
    const data = req.body;
    if (data.password) {
        data.password = yield bcrypt_1.default.hash(data.password, 10);
    }
    if (data.imagePath) {
        yield (0, deleteImage_1.deletePhotoFromServer)(new URL(userData.imagePath).pathname);
        data.imagePath = yield (0, handleImages_1.saveBase64Image)(data.imagePath, (0, uuid_1.v4)(), req, "admins");
    }
    yield db_1.db.update(schema_1.admins).set(data).where((0, drizzle_orm_1.eq)(schema_1.admins.id, user.id));
    (0, response_1.SuccessResponse)(res, { message: "Data Updated Successfully" }, 200);
});
exports.updateProfile = updateProfile;
