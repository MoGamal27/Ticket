"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = require("../../utils/catchAsync");
const contactus_1 = require("../../controllers/admins/contactus");
const router = (0, express_1.Router)();
router.get('/contact', (0, catchAsync_1.catchAsync)(contactus_1.getAllContactMessages));
router.get('/contact/:id', (0, catchAsync_1.catchAsync)(contactus_1.getContactMessageById));
exports.default = router;
