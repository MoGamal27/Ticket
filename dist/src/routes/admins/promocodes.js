"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../middlewares/validation");
const promocodes_1 = require("../../validators/admins/promocodes");
const promoCode_1 = require("../../controllers/admins/promoCode");
const users_1 = require("../../validators/admins/users");
const authenticated_1 = require("../../middlewares/authenticated");
const hasPrivilege_1 = require("../../middlewares/hasPrivilege");
const router = (0, express_1.Router)();
router.use(authenticated_1.authenticated);
router
    .route("/")
    .get((0, hasPrivilege_1.hasPrivilege)("Promo Code", "View"), (0, catchAsync_1.catchAsync)(promoCode_1.getAllPromoCodes))
    .post((0, hasPrivilege_1.hasPrivilege)("Promo Code", "Add"), (0, validation_1.validate)(promocodes_1.createCodeSchema), (0, catchAsync_1.catchAsync)(promoCode_1.createCode));
router
    .route("/:id")
    .get((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(promoCode_1.getCode))
    .delete((0, hasPrivilege_1.hasPrivilege)("Promo Code", "Delete"), (0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(promoCode_1.deleteCode))
    .put((0, hasPrivilege_1.hasPrivilege)("Promo Code", "Edit"), (0, validation_1.validate)(promocodes_1.updateCodeSchema), (0, catchAsync_1.catchAsync)(promoCode_1.updateCode));
exports.default = router;
