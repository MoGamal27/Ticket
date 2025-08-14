import { Router } from "express";
import {
  getMedicalCategories,
  getMedicalCategoryById,
  createMedicalCategory,
  updateCategoryMedical,
  deleteMedicalCategory,
} from "../../controllers/admins/medical";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";

import { createMedicalCategorySchema, updateMedicalCategorySchema, idParams } from "../../validators/admins/medical";

const router = Router();

router
  .route("/")
  .get(catchAsync(getMedicalCategories))
  .post(validate(createMedicalCategorySchema),catchAsync(createMedicalCategory));

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getMedicalCategoryById))
  .put(validate(updateMedicalCategorySchema),catchAsync(updateCategoryMedical))
  .delete(validate(idParams), catchAsync(deleteMedicalCategory));

export default router;