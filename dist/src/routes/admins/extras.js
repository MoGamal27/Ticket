"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../middlewares/validation");
const extras_1 = require("../../controllers/admins/extras");
const extras_2 = require("../../validators/admins/extras");
const users_1 = require("../../validators/admins/users");
const router = (0, express_1.Router)();
router
    .route("/")
    .get((0, catchAsync_1.catchAsync)(extras_1.getAllExtras))
    .post((0, validation_1.validate)(extras_2.createExtraSchema), (0, catchAsync_1.catchAsync)(extras_1.createExtra));
router
    .route("/:id")
    .get((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(extras_1.getExtra))
    .put((0, validation_1.validate)(extras_2.updateExtraSchema), (0, catchAsync_1.catchAsync)(extras_1.updateExtra))
    .delete((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(extras_1.deleteExtra));
exports.default = router;
