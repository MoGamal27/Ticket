"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFound = void 0;
const appError_1 = require("./appError");
const http_status_codes_1 = require("http-status-codes");
class NotFound extends appError_1.AppError {
    constructor(message = "Not Found Resource", details) {
        super(message, http_status_codes_1.StatusCodes.NOT_FOUND, details);
    }
}
exports.NotFound = NotFound;
