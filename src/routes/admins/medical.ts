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
import { authenticated } from "../../middlewares/authenticated";

import { hasPrivilege } from "../../middlewares/hasPrivilege";

const router = Router();
router.use(authenticated)
router
  .route("/medicalTour-all").get(hasPrivilege("Request", "View"),catchAsync(getAllMedicals));

  router
  .route("/accept-medical").post(hasPrivilege("Request", "Status"),upload.single('fileData'),catchAsync(acceptMedicalRequest));

  router.route("/reject-medical").post(hasPrivilege("Request", "Status"),upload.single('fileData'),catchAsync(rejectMedicalRequest));

router
  .route("/")
  .get(hasPrivilege("Medical", "View"),catchAsync(getMedicalCategories))
  .post(hasPrivilege("Medical", "Add"),validate(createMedicalCategorySchema),catchAsync(createMedicalCategory));

router
  .route("/:id")
  .get(catchAsync(getMedicalCategoryById))
  .put(hasPrivilege("Medical", "Edit"),validate(updateMedicalCategorySchema),catchAsync(updateCategoryMedical))
  .delete(hasPrivilege("Medical", "Delete"),validate(idParams),catchAsync(deleteMedicalCategory))

router
  .route("/medicals/:id").get(catchAsync(getMedicalById));

export default router;