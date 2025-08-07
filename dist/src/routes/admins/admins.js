"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = require("../../utils/catchAsync");
const admins_1 = require("../../controllers/admins/admins");
const users_1 = require("../../validators/admins/users");
const admins_2 = require("../../validators/admins/admins");
const validation_1 = require("../../middlewares/validation");
const router = (0, express_1.Router)();
router
    .route("/")
    .get((0, catchAsync_1.catchAsync)(admins_1.getAllAdmins))
    .post((0, validation_1.validate)(admins_2.createAdminSchema), (0, catchAsync_1.catchAsync)(admins_1.createAdmin));
router.post("/:id/privileges", (0, validation_1.validate)(admins_2.addPrivilegesAdminSchema), (0, catchAsync_1.catchAsync)(admins_1.addPrivilegesAdmin));
router
    .route("/:id")
    .get((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(admins_1.getAdmin))
    .put((0, validation_1.validate)(admins_2.updateAdminSchema), (0, catchAsync_1.catchAsync)(admins_1.updateAdmin))
    .delete((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(admins_1.deleteAdmin));
exports.default = router;
