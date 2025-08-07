"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../middlewares/validation");
const tours_1 = require("../../validators/admins/tours");
const tours_2 = require("../../controllers/admins/tours");
const users_1 = require("../../validators/admins/users");
const router = (0, express_1.Router)();
router
    .route("/")
    .get((0, catchAsync_1.catchAsync)(tours_2.getAllTours))
    .post((0, validation_1.validate)(tours_1.createTourSchema), (0, catchAsync_1.catchAsync)(tours_2.createTour));
router.get("/add-data", (0, catchAsync_1.catchAsync)(tours_2.addData));
router
    .route("/:id")
    .get((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(tours_2.getTourById))
    .delete((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(tours_2.deleteTour));
exports.default = router;
