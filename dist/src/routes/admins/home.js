"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const home_1 = require("../../controllers/admins/home");
const catchAsync_1 = require("../../utils/catchAsync");
const router = (0, express_1.Router)();
router.get("/header", (0, catchAsync_1.catchAsync)(home_1.getStatistics));
exports.default = router;
