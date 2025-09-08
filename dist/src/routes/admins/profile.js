"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../middlewares/validation");
const profile_1 = require("../../controllers/admins/profile");
const profile_2 = require("../../validators/admins/profile");
const authenticated_1 = require("../../middlewares/authenticated");
const hasPrivilege_1 = require("../../middlewares/hasPrivilege");
const router = (0, express_1.Router)();
router.use(authenticated_1.authenticated);
router
    .route("/")
    .get((0, hasPrivilege_1.hasPrivilege)("Profile", "View"), (0, catchAsync_1.catchAsync)(profile_1.getProfile))
    .put((0, hasPrivilege_1.hasPrivilege)("Profile", "Edit"), (0, validation_1.validate)(profile_2.updateProfileSchema), (0, catchAsync_1.catchAsync)(profile_1.updateProfile));
exports.default = router;
