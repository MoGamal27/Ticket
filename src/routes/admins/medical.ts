import { Router } from "express";
import {
  getMedicalCategories,
  getMedicalCategoryById,
  createMedicalCategory,
  updateCategoryMedical,
  deleteMedicalCategory,
  getAllMedicals,
  getMedicalById,
  acceptMedicalRequest,
  rejectMedicalRequest,
} from "../../controllers/admins/medical";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import { upload } from "../../utils/saveFile";

import { createMedicalCategorySchema, updateMedicalCategorySchema, idParams } from "../../validators/admins/medical";

const router = Router();
router
  .route("/medicalTour-all").get(catchAsync(getAllMedicals));

  router
  .route("/accept-medical").post(upload.single('fileData'),catchAsync(acceptMedicalRequest));

  router.route("/reject-medical").post(catchAsync(rejectMedicalRequest));

router
  .route("/")
  .get(catchAsync(getMedicalCategories))
  .post(validate(createMedicalCategorySchema),catchAsync(createMedicalCategory));

router
  .route("/:id")
  .get(catchAsync(getMedicalCategoryById))
  .put(validate(updateMedicalCategorySchema),catchAsync(updateCategoryMedical))
  .delete(validate(idParams), catchAsync(deleteMedicalCategory));

router
  .route("/medicals/:id").get(catchAsync(getMedicalById));

export default router;