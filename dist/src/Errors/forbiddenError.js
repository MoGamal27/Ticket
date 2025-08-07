"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const appError_1 = require("./appError");
const http_status_codes_1 = require("http-status-codes");
class ForbiddenError extends appError_1.AppError {
    constructor(message = "Forbidden Resource", details) {
        super(message, http_status_codes_1.StatusCodes.FORBIDDEN, details);
    }
}
exports.ForbiddenError = ForbiddenError;
