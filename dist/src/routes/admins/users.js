"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = require("../../utils/catchAsync");
const users_1 = require("../../controllers/admins/users");
const validation_1 = require("../../middlewares/validation");
const users_2 = require("../../validators/admins/users");
const authenticated_1 = require("../../middlewares/authenticated");
const hasPrivilege_1 = require("../../middlewares/hasPrivilege");
const router = (0, express_1.Router)();
router.use(authenticated_1.authenticated);
// router.use(authenticated);
router
    .route("/")
    .post(
// authorizePermissions("user-add"),
(0, hasPrivilege_1.hasPrivilege)("User", "Add"), (0, validation_1.validate)(users_2.createUserSchema), (0, catchAsync_1.catchAsync)(users_1.createUser))
    .get((0, hasPrivilege_1.hasPrivilege)("User", "View"), (0, catchAsync_1.catchAsync)(users_1.getAllUsers));
router
    .route("/:id")
    .get((0, validation_1.validate)(users_2.idParams), (0, catchAsync_1.catchAsync)(users_1.getUser))
    .put((0, hasPrivilege_1.hasPrivilege)("User", "Edit"), (0, validation_1.validate)(users_2.updateUserSchema), (0, catchAsync_1.catchAsync)(users_1.updateUser))
    .delete((0, hasPrivilege_1.hasPrivilege)("User", "Delete"), (0, validation_1.validate)(users_2.idParams), (0, catchAsync_1.catchAsync)(users_1.deleteUser));
exports.default = router;
