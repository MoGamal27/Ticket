"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admins_1 = __importDefault(require("./admins"));
const users_1 = __importDefault(require("./users"));
const Booking_1 = __importDefault(require("./users/Booking"));
const payments_1 = __importDefault(require("./users/payments"));
const router = (0, express_1.Router)();
router.use("/admin", admins_1.default);
router.use("/user", users_1.default);
router.use("/bookings", Booking_1.default);
router.use("/payments", payments_1.default);
exports.default = router;
