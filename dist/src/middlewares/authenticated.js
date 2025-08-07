"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticated = authenticated;
const auth_1 = require("../utils/auth");
const Errors_1 = require("../Errors");
function authenticated(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Errors_1.UnauthorizedError("Invalid Token");
    }
    const token = authHeader.split(" ")[1];
    const decoded = (0, auth_1.verifyToken)(token);
    req.user = decoded;
    next();
}
