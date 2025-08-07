"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = void 0;
const appError_1 = require("./appError");
const http_status_codes_1 = require("http-status-codes");
class ConflictError extends appError_1.AppError {
    constructor(message = "Resource Conflict", details) {
        super(message, http_status_codes_1.StatusCodes.CONFLICT, details);
    }
}
exports.ConflictError = ConflictError;
