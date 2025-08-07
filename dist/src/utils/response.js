"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessResponse = void 0;
const SuccessResponse = (res, data, statusCode = 200) => {
    const response = { success: true, data: data };
    res.status(statusCode).json(response);
};
exports.SuccessResponse = SuccessResponse;
