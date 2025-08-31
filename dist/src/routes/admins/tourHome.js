"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = require("../../utils/catchAsync");
const tourHome_1 = require("../../controllers/admins/tourHome");
const authenticated_1 = require("../../middlewares/authenticated");
const router = (0, express_1.Router)();
router.use(authenticated_1.authenticated);
router.route("/")
    .get((0, catchAsync_1.catchAsync)(tourHome_1.getAllTourHome));
exports.default = router;
