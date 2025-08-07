"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotNullConstrainError = void 0;
const appError_1 = require("./appError");
const http_status_codes_1 = require("http-status-codes");
class NotNullConstrainError extends appError_1.AppError {
    constructor(field, details) {
        super(`Field ${field} is required`, http_status_codes_1.StatusCodes.BAD_REQUEST, details);
    }
}
exports.NotNullConstrainError = NotNullConstrainError;
