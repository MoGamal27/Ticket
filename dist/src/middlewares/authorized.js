"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizePermissions = void 0;
const Errors_1 = require("../Errors");
const authorizePermissions = (...requiredPermissions) => {
    return (req, res, next) => {
        const user = req.user;
        console.log(user);
        if (!user)
            throw new Errors_1.UnauthorizedError("No permissions loaded");
        if (!user.roles) {
            throw new Errors_1.UnauthorizedError(`No permissions loade ${user}`);
        }
        if (user.roles.includes("super_admin")) {
            return next();
        }
        const hasPermission = requiredPermissions.every((p) => user.roles.includes(p));
        if (!hasPermission) {
            throw new Errors_1.UnauthorizedError("Permission denied");
        }
        next();
    };
};
exports.authorizePermissions = authorizePermissions;
