"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medical_1 = require("../../controllers/admins/medical");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../middlewares/validation");
const saveFile_1 = require("../../utils/saveFile");
const medical_2 = require("../../validators/admins/medical");
const router = (0, express_1.Router)();
router
    .route("/medicalTour-all").get((0, catchAsync_1.catchAsync)(medical_1.getAllMedicals));
router
    .route("/accept-medical").post(saveFile_1.upload.single('fileData'), (0, catchAsync_1.catchAsync)(medical_1.acceptMedicalRequest));
router.route("/reject-medical").post((0, catchAsync_1.catchAsync)(medical_1.rejectMedicalRequest));
router
    .route("/")
    .get((0, catchAsync_1.catchAsync)(medical_1.getMedicalCategories))
    .post((0, validation_1.validate)(medical_2.createMedicalCategorySchema), (0, catchAsync_1.catchAsync)(medical_1.createMedicalCategory));
router
    .route("/:id")
    .get((0, catchAsync_1.catchAsync)(medical_1.getMedicalCategoryById))
    .put((0, validation_1.validate)(medical_2.updateMedicalCategorySchema), (0, catchAsync_1.catchAsync)(medical_1.updateCategoryMedical))
    .delete((0, validation_1.validate)(medical_2.idParams), (0, catchAsync_1.catchAsync)(medical_1.deleteMedicalCategory));
router
    .route("/medicals/:id").get((0, catchAsync_1.catchAsync)(medical_1.getMedicalById));
exports.default = router;
