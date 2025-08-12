"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authenticated_1 = require("../../middlewares/authenticated");
const express_1 = require("express");
const payments_1 = require("../../controllers/users/payments");
const catchAsync_1 = require("../../utils/catchAsync");
const router = (0, express_1.Router)();
router.get("/", authenticated_1.authenticated, (0, catchAsync_1.catchAsync)((req, res) => {
    return (0, payments_1.getUserPayments)(req, res);
}));
router.get("/:id", authenticated_1.authenticated, (0, catchAsync_1.catchAsync)((req, res) => {
    return (0, payments_1.getPaymentById)(req, res);
}));
router.put("/:id", authenticated_1.authenticated, (0, catchAsync_1.catchAsync)((req, res) => {
    return (0, payments_1.updatePayment)(req, res);
}));
router.delete("/:id", authenticated_1.authenticated, (0, catchAsync_1.catchAsync)((req, res) => {
    return (0, payments_1.deletePayment)(req, res);
}));
exports.default = router;
