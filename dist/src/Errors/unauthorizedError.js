"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
const appError_1 = require("./appError");
const http_status_codes_1 = require("http-status-codes");
class UnauthorizedError extends appError_1.AppError {
    constructor(message = "Uanauthorized Access", details) {
        super(message, http_status_codes_1.StatusCodes.UNAUTHORIZED, details);
    }
}
exports.UnauthorizedError = UnauthorizedError;
