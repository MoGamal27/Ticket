"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = require("../../utils/catchAsync");
const privileges_1 = require("../../controllers/admins/privileges");
const validation_1 = require("../../middlewares/validation");
const privileges_2 = require("../../validators/admins/privileges");
const users_1 = require("../../validators/admins/users");
const router = (0, express_1.Router)();
router
    .route("/")
    .get((0, catchAsync_1.catchAsync)(privileges_1.getAllPrivilegs))
    .post((0, validation_1.validate)(privileges_2.createPrivileg), (0, catchAsync_1.catchAsync)(privileges_1.createPrivilegs));
router
    .route("/:id")
    .get((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(privileges_1.getPrivilegs))
    .put((0, validation_1.validate)(privileges_2.updatePrivileg), (0, catchAsync_1.catchAsync)(privileges_1.updatePrivilegs))
    .delete((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(privileges_1.deletePrivilegs));
exports.default = router;
