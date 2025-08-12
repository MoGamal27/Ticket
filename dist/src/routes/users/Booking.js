"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authenticated_1 = require("../../middlewares/authenticated");
const express_1 = require("express");
const Booking_1 = require("../../controllers/users/Booking");
const catchAsync_1 = require("../../utils/catchAsync");
const router = (0, express_1.Router)();
router.get("/", authenticated_1.authenticated, (0, catchAsync_1.catchAsync)((req, res) => {
    return (0, Booking_1.getUserBookings)(req, res);
}));
router.get("/:id", authenticated_1.authenticated, (0, catchAsync_1.catchAsync)((req, res) => {
    return (0, Booking_1.getBookingDetails)(req, res);
}));
router.put("/:id", authenticated_1.authenticated, (0, catchAsync_1.catchAsync)((req, res) => {
    return (0, Booking_1.updateBooking)(req, res);
}));
router.delete("/:id", authenticated_1.authenticated, (0, catchAsync_1.catchAsync)((req, res) => {
    return (0, Booking_1.cancelBooking)(req, res);
}));
// router.post("/", authenticated, (req, res) => {
//   createBooking(req as AuthenticatedRequest, res);
// });
exports.default = router;
