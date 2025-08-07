"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqueConstrainError = void 0;
const appError_1 = require("./appError");
const http_status_codes_1 = require("http-status-codes");
class UniqueConstrainError extends appError_1.AppError {
    constructor(field, details) {
        super(`Field ${field} must be unique`, http_status_codes_1.StatusCodes.CONFLICT, details);
    }
}
exports.UniqueConstrainError = UniqueConstrainError;
