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
exports.login = login;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../../utils/auth");
const Errors_1 = require("../../Errors");
const response_1 = require("../../utils/response");
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        const [admin] = yield db_1.db
            .select()
            .from(schema_1.admins)
            .where((0, drizzle_orm_1.eq)(schema_1.admins.email, data.email));
        if (!admin) {
            throw new Errors_1.UnauthorizedError("Invalid email or password");
        }
        const match = yield bcrypt_1.default.compare(data.password, admin.password);
        if (!match) {
            throw new Errors_1.UnauthorizedError("Invalid email or password");
        }
        let token;
        let groupedPrivileges = {};
        if (!admin.isSuperAdmin) {
            // Only get privileges assigned to this admin through admin_privileges table
            const result = yield db_1.db
                .select({
                privilegeName: schema_1.privileges.name,
                privilegeAction: schema_1.privileges.action,
                privilegeId: schema_1.privileges.id
            })
                .from(schema_1.adminPrivileges)
                .innerJoin(schema_1.privileges, (0, drizzle_orm_1.eq)(schema_1.adminPrivileges.privilegeId, schema_1.privileges.id))
                .where((0, drizzle_orm_1.eq)(schema_1.adminPrivileges.adminId, admin.id));
            const privilegeNames = result.map((r) => r.privilegeName + "_" + r.privilegeAction);
            // Group only the assigned privileges
            groupedPrivileges = result.reduce((acc, curr) => {
                if (!acc[curr.privilegeName]) {
                    acc[curr.privilegeName] = [];
                }
                acc[curr.privilegeName].push({
                    id: curr.privilegeId,
                    action: curr.privilegeAction,
                });
                return acc;
            }, {});
            token = (0, auth_1.generateToken)({
                id: admin.id,
                roles: privilegeNames,
            });
        }
        else {
            // Super admin gets all privileges
            const allPrivileges = yield db_1.db.select().from(schema_1.privileges);
            groupedPrivileges = allPrivileges.reduce((acc, curr) => {
                if (!acc[curr.name]) {
                    acc[curr.name] = [];
                }
                acc[curr.name].push({
                    id: curr.id,
                    action: curr.action,
                });
                return acc;
            }, {});
            token = (0, auth_1.generateToken)({
                id: admin.id,
                roles: ["super_admin"],
            });
        }
        (0, response_1.SuccessResponse)(res, {
            message: "login Successful",
            token: token,
            groupedPrivileges: groupedPrivileges
        }, 200);
    });
}
