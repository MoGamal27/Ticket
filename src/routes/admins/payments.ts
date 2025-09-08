import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
  getPendingPayments,
  changeStatus,
  getPaymentById,
  getAutoPayments,
  getAllPayments,
  //initializePayment,
} from "../../controllers/admins/payments";
import { validate } from "../../middlewares/validation";
import { idParams } from "../../validators/admins/users";
import { changeStatusSchema } from "../../validators/admins/payments";
import { authenticated } from "../../middlewares/authenticated";
import { hasPrivilege } from "../../middlewares/hasPrivilege";
const router = Router();
router.use(authenticated)

//router.post("/initialize-payment", catchAsync(intializePayemnt))

router.get("/auto-payments", hasPrivilege("Auto Payment", "View"),catchAsync(getAutoPayments));

router.get("/allPayment", hasPrivilege("All Payments", "View"),catchAsync(getAllPayments));

router.get("/pending-payments", hasPrivilege("Pending Payment", "View"),catchAsync(getPendingPayments));
router
  .route("/pending-payments/:id")
  .get(validate(idParams), catchAsync(getPaymentById))
  .patch(hasPrivilege("All Payments", "Status"), validate(changeStatusSchema), catchAsync(changeStatus));
export default router;
