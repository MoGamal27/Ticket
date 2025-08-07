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
const router = Router();
router
  .route("/")
  .get(catchAsync(getAllFaq))
  .post(validate(createFAQSchema), catchAsync(createFaq));

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getFaqById))
  .put(validate(updateFAQSchema), catchAsync(updateFaq))
  .delete(validate(idParams), catchAsync(deleteFaq));
export default router;
