"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const homePage_1 = require("../../controllers/admins/homePage");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../middlewares/validation");
const homePage_2 = require("../../validators/admins/homePage");
const users_1 = require("../../validators/admins/users");
const authenticated_1 = require("../../middlewares/authenticated");
const hasPrivilege_1 = require("../../middlewares/hasPrivilege");
const router = (0, express_1.Router)();
router.use(authenticated_1.authenticated);
router
    .route("/")
    .get((0, hasPrivilege_1.hasPrivilege)("Home Page Cover", "View"), (0, catchAsync_1.catchAsync)(homePage_1.getAllHomePageCover))
    .post((0, hasPrivilege_1.hasPrivilege)("Home Page Cover", "Add"), (0, validation_1.validate)(homePage_2.createHomePageCoverSchema), homePage_1.createHomePageCover);
router
    .route("/:id")
    .get((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(homePage_1.getHomePageCover))
    .put((0, hasPrivilege_1.hasPrivilege)("Home Page Cover", "Edit"), (0, validation_1.validate)(homePage_2.updateHomePageCoverSchema), (0, catchAsync_1.catchAsync)(homePage_1.updateHomePageCover))
    .delete((0, hasPrivilege_1.hasPrivilege)("Home Page Cover", "Delete"), (0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(homePage_1.deleteHomePageCover));
exports.default = router;
