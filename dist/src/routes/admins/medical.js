"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medical_1 = require("../../controllers/admins/medical");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../middlewares/validation");
const users_1 = require("../../validators/admins/users");
const router = (0, express_1.Router)();
router
    .route("/")
    .get((0, catchAsync_1.catchAsync)(medical_1.getMedicalCategories))
    .post((0, catchAsync_1.catchAsync)(medical_1.createMedicalCategory));
router
    .route("/:id")
    .get((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(medical_1.getMedicalCategoryById))
    .put((0, catchAsync_1.catchAsync)(medical_1.updateCategoryMedical))
    .delete((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(medical_1.deleteMedicalCategory));
exports.default = router;
