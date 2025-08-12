import { authenticated } from "../../middlewares/authenticated";
import { Router } from "express";
import { getUserPayments,getPaymentById,updatePayment,deletePayment } from "../../controllers/users/payments";
import { catchAsync } from "../../utils/catchAsync";
import { AuthenticatedRequest } from "../../types/custom";

const router = Router();
router.get("/", authenticated, catchAsync((req, res) => {
  return getUserPayments(req as AuthenticatedRequest, res);
}));

router.get("/:id", authenticated, catchAsync((req, res) => {
  return getPaymentById(req as AuthenticatedRequest, res);
}));

router.put("/:id", authenticated, catchAsync((req, res) => {
  return updatePayment(req as AuthenticatedRequest, res);
}));

router.delete("/:id", authenticated, catchAsync((req, res) => {
  return deletePayment(req as AuthenticatedRequest, res);
}));


export default router;