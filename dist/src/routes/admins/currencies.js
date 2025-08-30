"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../middlewares/validation");
const currencies_1 = require("../../controllers/admins/currencies");
const currencies_2 = require("../../validators/admins/currencies");
const users_1 = require("../../validators/admins/users");
const authenticated_1 = require("../../middlewares/authenticated");
const hasPrivilege_1 = require("../../middlewares/hasPrivilege");
const router = (0, express_1.Router)();
router.use(authenticated_1.authenticated);
router
    .route("/")
    .get((0, hasPrivilege_1.hasPrivilege)("Currency", "View"), (0, catchAsync_1.catchAsync)(currencies_1.getAllCurrencies))
    .post((0, hasPrivilege_1.hasPrivilege)("Currency", "Add"), (0, validation_1.validate)(currencies_2.createCurrencySchema), (0, catchAsync_1.catchAsync)(currencies_1.createCurrency));
router
    .route("/:id")
    .get((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(currencies_1.getCurrency))
    .delete((0, hasPrivilege_1.hasPrivilege)("Currency", "Delete"), (0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(currencies_1.deleteCurrency))
    .put((0, hasPrivilege_1.hasPrivilege)("Currency", "Edit"), (0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(currencies_1.updateCurrency));
exports.default = router;
