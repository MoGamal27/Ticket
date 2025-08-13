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
import { idParams } from "../../validators/admins/users";

const router = Router();

router
  .route("/")
  .get(catchAsync(getMedicalCategories))
  .post(catchAsync(createMedicalCategory));

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getMedicalCategoryById))
  .put(catchAsync(updateCategoryMedical))
  .delete(validate(idParams), catchAsync(deleteMedicalCategory));

export default router;