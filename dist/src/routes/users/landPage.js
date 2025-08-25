"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const landPage_1 = require("../../controllers/users/landPage");
const catchAsync_1 = require("../../utils/catchAsync");
const authenticated_1 = require("../../middlewares/authenticated");
const validation_1 = require("../../middlewares/validation");
const landPage_2 = require("..//..//validators/users/landPage");
const router = (0, express_1.Router)();
router.post("/book-tour", (0, validation_1.validate)(landPage_2.createBookingWithPaymentSchema), (0, catchAsync_1.catchAsync)(landPage_1.createBookingWithPayment));
router.post("/create-medical", /*validate(createMedicalSchema),*/ (0, catchAsync_1.catchAsync)(landPage_1.createMedical));
router.get("/medicals-categories", (0, catchAsync_1.catchAsync)(landPage_1.getMedicalCategories));
router.get("/active", (0, catchAsync_1.catchAsync)(landPage_1.getActivePaymentMethods));
router.get("/accept-medical-requests", authenticated_1.authenticated, (0, catchAsync_1.catchAsync)((req, res) => {
    return (0, landPage_1.getAcceptMedicalRequests)(req, res);
}));
router.get("/rejected-medical-requests", authenticated_1.authenticated, (0, catchAsync_1.catchAsync)((req, res) => {
    return (0, landPage_1.getRejectedMedicalRequests)(req, res);
}));
router.post("/apply-promo-code", authenticated_1.authenticated, (0, catchAsync_1.catchAsync)((req, res) => {
    return (0, landPage_1.applyPromoCode)(req, res);
}));
router.get("/images", (0, catchAsync_1.catchAsync)(landPage_1.getImages));
router.get("/featured-tours", (0, catchAsync_1.catchAsync)(landPage_1.getFeaturedTours));
router.get("/category-tours/:category", (0, catchAsync_1.catchAsync)(landPage_1.getToursByCategory));
router.get("/category-tours/category/:id", (0, catchAsync_1.catchAsync)(landPage_1.getTourById));
exports.default = router;
