"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentMethods_1 = require("../../controllers/admins/paymentMethods");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../middlewares/validation");
const paymentMethods_2 = require("../../validators/admins/paymentMethods");
const users_1 = require("../../validators/admins/users");
const authenticated_1 = require("../../middlewares/authenticated");
const hasPrivilege_1 = require("../../middlewares/hasPrivilege");
const router = (0, express_1.Router)();
router.use(authenticated_1.authenticated);
router
    .route("/")
    .get((0, hasPrivilege_1.hasPrivilege)("Payment Methods", "View"), (0, catchAsync_1.catchAsync)(paymentMethods_1.getAllPaymentMethods))
    .post((0, hasPrivilege_1.hasPrivilege)("Payment Methods", "Add"), (0, validation_1.validate)(paymentMethods_2.createPaymentMethods), (0, catchAsync_1.catchAsync)(paymentMethods_1.createMethod));
router
    .route("/:id")
    .get((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(paymentMethods_1.getMethod))
    .put((0, hasPrivilege_1.hasPrivilege)("Payment Methods", "Edit"), (0, validation_1.validate)(paymentMethods_2.updatePaymentMethods), (0, catchAsync_1.catchAsync)(paymentMethods_1.updateMethod))
    .delete((0, hasPrivilege_1.hasPrivilege)("Payment Methods", "Delete"), (0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(paymentMethods_1.deleteMethod));
exports.default = router;
