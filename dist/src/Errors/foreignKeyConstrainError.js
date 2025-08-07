"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForeignKeyConstrainError = void 0;
const appError_1 = require("./appError");
const http_status_codes_1 = require("http-status-codes");
class ForeignKeyConstrainError extends appError_1.AppError {
    constructor(field, details) {
        super(`Invalid reference for field ${field}`, http_status_codes_1.StatusCodes.BAD_REQUEST, details);
    }
}
exports.ForeignKeyConstrainError = ForeignKeyConstrainError;
