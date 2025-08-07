import { Router } from "express";
import {
  getAllPaymentMethods,
  getMethod,
  createMethod,
  updateMethod,
  deleteMethod,
} from "../../controllers/admins/paymentMethods";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import {
  createPaymentMethods,
  updatePaymentMethods,
} from "../../validators/admins/paymentMethods";
import { idParams } from "../../validators/admins/users";
const router = Router();
router
  .route("/")
  .get(catchAsync(getAllPaymentMethods))
  .post(validate(createPaymentMethods), catchAsync(createMethod));

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getMethod))
  .put(validate(updatePaymentMethods), catchAsync(updateMethod))
  .delete(validate(idParams), catchAsync(deleteMethod));
export default router;
