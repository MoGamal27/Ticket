"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../middlewares/validation");
const profile_1 = require("../../controllers/admins/profile");
const profile_2 = require("../../validators/admins/profile");
const authenticated_1 = require("../../middlewares/authenticated");
const authorized_1 = require("../../middlewares/authorized");
const router = (0, express_1.Router)();
router.use(authenticated_1.authenticated, (0, authorized_1.authorizePermissions)("super_admin"));
router
    .route("/")
    .get((0, catchAsync_1.catchAsync)(profile_1.getProfile))
    .put((0, validation_1.validate)(profile_2.updateProfileSchema), (0, catchAsync_1.catchAsync)(profile_1.updateProfile));
exports.default = router;
