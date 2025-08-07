"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = catchAsync;
function catchAsync(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
