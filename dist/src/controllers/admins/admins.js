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
exports.addPrivilegesAdmin = exports.deleteAdmin = exports.updateAdmin = exports.createAdmin = exports.getAdmin = exports.getAllAdmins = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const bcrypt_1 = __importDefault(require("bcrypt"));
const drizzle_orm_1 = require("drizzle-orm");
const Errors_1 = require("../../Errors");
const handleImages_1 = require("../../utils/handleImages");
const uuid_1 = require("uuid");
const deleteImage_1 = require("../../utils/deleteImage");
const getAllAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminsD = yield db_1.db.select().from(schema_1.admins);
    (0, response_1.SuccessResponse)(res, { admins: adminsD }, 200);
});
exports.getAllAdmins = getAllAdmins;
const getAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [admin] = yield db_1.db.select().from(schema_1.admins).where((0, drizzle_orm_1.eq)(schema_1.admins.id, id));
    if (!admin)
        throw new Errors_1.NotFound("Admin Not Found");
    const privilegsRaw = yield db_1.db
        .select({
        id: schema_1.privileges.id,
        name: schema_1.privileges.name,
        action: schema_1.privileges.action,
    })
        .from(schema_1.adminPrivileges)
        .where((0, drizzle_orm_1.eq)(schema_1.adminPrivileges.adminId, id))
        .leftJoin(schema_1.privileges, (0, drizzle_orm_1.eq)(schema_1.privileges.id, schema_1.adminPrivileges.privilegeId));
    const groupedPrivilegs = privilegsRaw.reduce((acc, curr) => {
        if (!curr.name)
            return acc; // skip if no privilege
        if (!acc[curr.name]) {
            acc[curr.name] = [];
        }
        acc[curr.name].push({
            id: curr.id,
            action: curr.action,
        });
        return acc;
    }, {});
    (0, response_1.SuccessResponse)(res, Object.assign(Object.assign({}, admin), { privilegs: groupedPrivilegs }), 200);
});
exports.getAdmin = getAdmin;
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    if (data.password) {
        data.password = yield bcrypt_1.default.hash(data.password, 10);
    }
    if (data.imagePath) {
        data.imagePath = yield (0, handleImages_1.saveBase64Image)(data.imagePath, (0, uuid_1.v4)(), req, "admins");
    }
    data.isSuperAdmin = data.isSuperAdmin === "superAdmin";
    yield db_1.db.insert(schema_1.admins).values(data);
    (0, response_1.SuccessResponse)(res, { message: "Admin Created Successfully" });
});
exports.createAdmin = createAdmin;
const updateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const data = req.body;
    const [admin] = yield db_1.db.select().from(schema_1.admins).where((0, drizzle_orm_1.eq)(schema_1.admins.id, id));
    if (!admin)
        throw new Errors_1.NotFound("Admin Not Found");
    if (data.password) {
        data.password = yield bcrypt_1.default.hash(data.password, 10);
    }
    if (data.imagePath) {
        yield (0, deleteImage_1.deletePhotoFromServer)(new URL(admin.imagePath).pathname);
        data.imagePath = yield (0, handleImages_1.saveBase64Image)(data.imagePath, (0, uuid_1.v4)(), req, "admins");
    }
    data.isSuperAdmin = data.isSuperAdmin === "superAdmin";
    yield db_1.db.update(schema_1.admins).set(data).where((0, drizzle_orm_1.eq)(schema_1.admins.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Admin Updated Successfully" }, 200);
});
exports.updateAdmin = updateAdmin;
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [admin] = yield db_1.db.select().from(schema_1.admins).where((0, drizzle_orm_1.eq)(schema_1.admins.id, id));
    if (!admin)
        throw new Errors_1.NotFound("Admin Not Found");
    if (admin.imagePath)
        yield (0, deleteImage_1.deletePhotoFromServer)(new URL(admin.imagePath).pathname);
    yield db_1.db.delete(schema_1.admins).where((0, drizzle_orm_1.eq)(schema_1.admins.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Admin Deleted Successfully" }, 200);
});
exports.deleteAdmin = deleteAdmin;
// Privilegs
const addPrivilegesAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const privilegesList = req.body.privilegesIds;
    const [admin] = yield db_1.db.select().from(schema_1.admins).where((0, drizzle_orm_1.eq)(schema_1.admins.id, id));
    if (!admin)
        throw new Errors_1.NotFound("Admin Not Found");
    yield db_1.db.delete(schema_1.adminPrivileges).where((0, drizzle_orm_1.eq)(schema_1.adminPrivileges.adminId, id));
    for (const privilege of privilegesList) {
        yield db_1.db.insert(schema_1.adminPrivileges).values({
            adminId: id,
            privilegeId: privilege,
        });
    }
    (0, response_1.SuccessResponse)(res, { message: "Admin has privileges successfully" });
});
exports.addPrivilegesAdmin = addPrivilegesAdmin;
