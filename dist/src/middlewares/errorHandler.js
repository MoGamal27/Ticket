"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const Errors_1 = require("../Errors");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler = (err, req, res, next) => {
    let statusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    let message = err.message || "Internal Server Error";
    let details = err.message;
    if (err instanceof Errors_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
        details = err.details;
    }
    else if (err.name === "ZodError") {
        statusCode = 400;
        message = "Validation failed";
        details = err.errors.map((error) => ({
            field: error.path.join("."),
            message: error.message,
        }));
    }
    else if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
        statusCode = 401;
        message = "Invalid token";
    }
    else if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
        statusCode = 401;
        message = "Token expired";
    }
    else if (err.type === "entity.too.large") {
        statusCode = 413;
        message = "The uploaded image is too large. Please upload a smaller image.";
        details = "Max request size exceeded. Limit is 10MB.";
    }
    const response = {
        success: false,
        error: {
            code: statusCode,
            message: message,
            details: details,
        },
    };
    if (statusCode >= 500) {
        console.error(`[${new Date().toISOString()}] ${err.stack || err}`);
        console.log(response);
    }
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
