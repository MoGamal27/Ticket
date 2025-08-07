import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import {
  createCodeSchema,
  updateCodeSchema,
} from "../../validators/admins/promocodes";
import {
  createCode,
  updateCode,
  getAllPromoCodes,
  getCode,
  deleteCode,
} from "../../controllers/admins/promoCode";
import { idParams } from "../../validators/admins/users";
const router = Router();
router
  .route("/")
  .get(catchAsync(getAllPromoCodes))
  .post(validate(createCodeSchema), catchAsync(createCode));

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getCode))
  .delete(validate(idParams), catchAsync(deleteCode))
  .put(validate(updateCodeSchema), catchAsync(updateCode));
export default router;
