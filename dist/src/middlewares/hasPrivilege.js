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
exports.hasPrivilege = void 0;
const db_1 = require("../models/db");
const schema_1 = require("../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const hasPrivilege = (requiredName, requiredAction) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            // Assuming you store admin ID in req.user after authentication
            const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!adminId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            // Check if admin has the required privilege
            const hasAccess = yield db_1.db
                .select()
                .from(schema_1.adminPrivileges)
                .innerJoin(schema_1.privileges, (0, drizzle_orm_1.eq)(schema_1.adminPrivileges.privilegeId, schema_1.privileges.id))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.adminPrivileges.adminId, adminId), (0, drizzle_orm_1.eq)(schema_1.privileges.name, requiredName), (0, drizzle_orm_1.eq)(schema_1.privileges.action, requiredAction)))
                .limit(1);
            if (hasAccess.length === 0) {
                return res.status(403).json({
                    error: "Access denied. you don't have the required privilege."
                });
            }
            next();
        }
        catch (error) {
            console.error("Privilege check error:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });
};
exports.hasPrivilege = hasPrivilege;
