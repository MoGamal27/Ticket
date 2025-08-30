"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../middlewares/validation");
const tours_1 = require("../../validators/admins/tours");
const tours_2 = require("../../controllers/admins/tours");
const users_1 = require("../../validators/admins/users");
const authenticated_1 = require("../../middlewares/authenticated");
const hasPrivilege_1 = require("../../middlewares/hasPrivilege");
const router = (0, express_1.Router)();
router.use(authenticated_1.authenticated);
// Main tours routes
router.route("/")
    .get((0, hasPrivilege_1.hasPrivilege)("Tour", "View"), (0, catchAsync_1.catchAsync)(tours_2.getAllTours))
    .post((0, hasPrivilege_1.hasPrivilege)("Tour", "Add"), (0, validation_1.validate)(tours_1.createTourSchema), (0, catchAsync_1.catchAsync)(tours_2.createTour));
router.route("/status").post((0, hasPrivilege_1.hasPrivilege)("Tour", "Status"), (0, catchAsync_1.catchAsync)(tours_2.updateTourStatus));
router.route("/featured").post((0, hasPrivilege_1.hasPrivilege)("Tour", "Featured"), (0, catchAsync_1.catchAsync)(tours_2.updateTourFeatured));
// Special admin operations
router.get("/add-data", (0, catchAsync_1.catchAsync)(tours_2.addData));
// Individual tour operations
router.route("/:id")
    .put((0, validation_1.validate)(tours_1.updateTourSchema), (0, hasPrivilege_1.hasPrivilege)("Tour", "Edit"), (0, catchAsync_1.catchAsync)(tours_2.updateTour))
    .get((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(tours_2.getTourById))
    .delete((0, validation_1.validate)(users_1.idParams), (0, hasPrivilege_1.hasPrivilege)("Tour", "Delete"), (0, catchAsync_1.catchAsync)(tours_2.deleteTour));
exports.default = router;
