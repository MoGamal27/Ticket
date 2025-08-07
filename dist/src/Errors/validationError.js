"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const appError_1 = require("./appError");
const http_status_codes_1 = require("http-status-codes");
class ValidationError extends appError_1.AppError {
    constructor(message, details) {
        super(message, http_status_codes_1.StatusCodes.BAD_REQUEST, details);
    }
}
exports.ValidationError = ValidationError;
