import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import {
  getAllFaq,
  getFaqById,
  createFaq,
  deleteFaq,
  updateFaq,
} from "../../controllers/admins/homeFAQ";
import {
  createFAQSchema,
  updateFAQSchema,
} from "../../validators/admins/homeFAQ";
import { idParams } from "../../validators/admins/users";
import { authenticated } from "../../middlewares/authenticated";
import { hasPrivilege } from "../../middlewares/hasPrivilege";

const router = Router();
router.use(authenticated)
router
  .route("/")
  .get(hasPrivilege("Home Page Faq", "View"),catchAsync(getAllFaq))
  .post(hasPrivilege("Home Page Faq", "Add"),validate(createFAQSchema), catchAsync(createFaq));

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getFaqById))
  .put(hasPrivilege("Home Page Faq", "Edit"),validate(updateFAQSchema), catchAsync(updateFaq))
  .delete(hasPrivilege("Home Page Faq", "Delete"),validate(idParams), catchAsync(deleteFaq));
export default router;
