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
exports.deletePrivilegs = exports.updatePrivilegs = exports.createPrivilegs = exports.getPrivilegs = exports.getAllPrivilegs = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const drizzle_orm_1 = require("drizzle-orm");
const Errors_1 = require("../../Errors");
const getAllPrivilegs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const privilegs = yield db_1.db.select().from(schema_1.privileges);
    const grouped = privilegs.reduce((acc, curr) => {
        if (!acc[curr.name]) {
            acc[curr.name] = [];
        }
        acc[curr.name].push({
            id: curr.id,
            action: curr.action,
        });
        return acc;
    }, {});
    (0, response_1.SuccessResponse)(res, { privilegs: grouped }, 200);
});
exports.getAllPrivilegs = getAllPrivilegs;
const getPrivilegs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [privileg] = yield db_1.db
        .select()
        .from(schema_1.privileges)
        .where((0, drizzle_orm_1.eq)(schema_1.privileges.id, id));
    if (!privileg)
        throw new Errors_1.NotFound("privileges not found");
    (0, response_1.SuccessResponse)(res, { privileg }, 200);
});
exports.getPrivilegs = getPrivilegs;
const createPrivilegs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, action } = req.body;
    yield db_1.db.insert(schema_1.privileges).values({ name, action });
    (0, response_1.SuccessResponse)(res, { message: "privilege created successfully" });
});
exports.createPrivilegs = createPrivilegs;
const updatePrivilegs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const data = req.body;
    const [privileg] = yield db_1.db
        .select()
        .from(schema_1.privileges)
        .where((0, drizzle_orm_1.eq)(schema_1.privileges.id, id));
    if (!privileg)
        throw new Errors_1.NotFound("privileges not found");
    yield db_1.db.update(schema_1.privileges).set(data).where((0, drizzle_orm_1.eq)(schema_1.privileges.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Privileges Updated Successfully" }, 200);
});
exports.updatePrivilegs = updatePrivilegs;
const deletePrivilegs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [privileg] = yield db_1.db
        .select()
        .from(schema_1.privileges)
        .where((0, drizzle_orm_1.eq)(schema_1.privileges.id, id));
    if (!privileg)
        throw new Errors_1.NotFound("privileges not found");
    yield db_1.db.delete(schema_1.privileges).where((0, drizzle_orm_1.eq)(schema_1.privileges.id, id));
    (0, response_1.SuccessResponse)(res, { privileg }, 200);
});
exports.deletePrivilegs = deletePrivilegs;
