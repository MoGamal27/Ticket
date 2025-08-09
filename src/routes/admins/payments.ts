import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
  getPendingPayments,
  changeStatus,
  getPaymentById,
  getAutoPayments,
  getAllPayments,
} from "../../controllers/admins/payments";
import { validate } from "../../middlewares/validation";
import { idParams } from "../../validators/admins/users";
import { changeStatusSchema } from "../../validators/admins/payments";
const router = Router();

router.get("/auto-payments", catchAsync(getAutoPayments));

router.get("/all-payment", catchAsync(getAllPayments));

router.get("/pending-payments", catchAsync(getPendingPayments));
router
  .route("/pending-payments/:id")
  .get(validate(idParams), catchAsync(getPaymentById))
  .patch(validate(changeStatusSchema), catchAsync(changeStatus));
export default router;
