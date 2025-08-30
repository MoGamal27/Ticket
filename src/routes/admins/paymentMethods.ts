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
import { authenticated } from "../../middlewares/authenticated";
import { hasPrivilege } from "../../middlewares/hasPrivilege";
const router = Router();
router.use(authenticated)
router
  .route("/")
  .get(hasPrivilege("Payment Methods", "View"),catchAsync(getAllPaymentMethods))
  .post(hasPrivilege("Payment Methods", "Add"),validate(createPaymentMethods), catchAsync(createMethod));

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getMethod))
  .put(hasPrivilege("Payment Methods", "Edit"),validate(updatePaymentMethods), catchAsync(updateMethod))
  .delete(hasPrivilege("Payment Methods", "Delete"),validate(idParams), catchAsync(deleteMethod));
export default router;
