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
exports.deleteUser = exports.updateUser = exports.getUser = exports.createUser = exports.getAllUsers = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const bcrypt_1 = __importDefault(require("bcrypt"));
const drizzle_orm_1 = require("drizzle-orm");
const Errors_1 = require("../../Errors");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usersDate = yield db_1.db.select().from(schema_1.users);
    (0, response_1.SuccessResponse)(res, { users: usersDate }, 200);
});
exports.getAllUsers = getAllUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    if (data.password) {
        data.password = yield bcrypt_1.default.hash(data.password, 10);
    }
    yield db_1.db.insert(schema_1.users).values(data);
    (0, response_1.SuccessResponse)(res, { message: "User Created Successfully" }, 201);
});
exports.createUser = createUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [user] = yield db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
    if (!user)
        throw new Errors_1.NotFound("User Not Found");
    (0, response_1.SuccessResponse)(res, { user }, 200);
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const data = req.body;
    const [user] = yield db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
    if (!user)
        throw new Errors_1.NotFound("User Not Found");
    if (data.password) {
        data.password = yield bcrypt_1.default.hash(data.password, 10);
    }
    yield db_1.db.update(schema_1.users).set(data).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
    (0, response_1.SuccessResponse)(res, { message: "User Updated Successfully" }, 200);
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [user] = yield db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
    if (!user)
        throw new Errors_1.NotFound("User Not Found");
    yield db_1.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
    (0, response_1.SuccessResponse)(res, { message: "User Deleted Successfully" }, 200);
});
exports.deleteUser = deleteUser;
