"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = void 0;
const appError_1 = require("./appError");
const http_status_codes_1 = require("http-status-codes");
class DatabaseError extends appError_1.AppError {
    constructor(message = "Database Operation Failed", details) {
        super(message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, details);
    }
}
exports.DatabaseError = DatabaseError;
