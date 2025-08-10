"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = require("../../utils/catchAsync");
const payments_1 = require("../../controllers/admins/payments");
const validation_1 = require("../../middlewares/validation");
const users_1 = require("../../validators/admins/users");
const payments_2 = require("../../validators/admins/payments");
const router = (0, express_1.Router)();
//router.post("/initialize-payment", catchAsync(intializePayemnt))
router.get("/auto-payments", (0, catchAsync_1.catchAsync)(payments_1.getAutoPayments));
router.get("/allPayment", (0, catchAsync_1.catchAsync)(payments_1.getAllPayments));
router.get("/pending-payments", (0, catchAsync_1.catchAsync)(payments_1.getPendingPayments));
router
    .route("/pending-payments/:id")
    .get((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(payments_1.getPaymentById))
    .patch((0, validation_1.validate)(payments_2.changeStatusSchema), (0, catchAsync_1.catchAsync)(payments_1.changeStatus));
exports.default = router;
