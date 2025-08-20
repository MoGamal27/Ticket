import { Router } from "express";
import {
  getImages,
  getFeaturedTours,
  getTourById,
  getToursByCategory,
  getActivePaymentMethods,
  createBookingWithPayment,
  createMedical,
  getMedicalCategories,
  getAcceptMedicalRequests,
  getRejectedMedicalRequests,
  applyPromoCode 
} from "../../controllers/users/landPage";
import { catchAsync } from "../../utils/catchAsync";
import { AuthenticatedRequest } from "../../types/custom";

import { authenticated } from "../../middlewares/authenticated";

import { validate } from "../../middlewares/validation";
import { createBookingWithPaymentSchema, medicalRecordSchema } from "..//..//validators/users/landPage";
const router = Router();

router.post("/book-tour",validate(createBookingWithPaymentSchema) ,catchAsync(createBookingWithPayment));

router.post("/create-medical", /*validate(createMedicalSchema),*/ catchAsync(createMedical));


router.get("/medicals-categories", catchAsync(getMedicalCategories));

router.get("/active", catchAsync(getActivePaymentMethods));

router.get("/accept-medical-requests", authenticated, catchAsync((req, res) => {
  return getAcceptMedicalRequests(req as AuthenticatedRequest, res);
}));

router.get("/rejected-medical-requests", authenticated, catchAsync((req, res) => {
  return getRejectedMedicalRequests(req as AuthenticatedRequest, res);
}))


router.post("/apply-promo-code", authenticated, catchAsync((req, res) => {
  return applyPromoCode(req as AuthenticatedRequest, res);
}))

router.get("/images", catchAsync(getImages));
router.get("/featured-tours", catchAsync(getFeaturedTours));
router.get("/category-tours/:category", catchAsync(getToursByCategory));
router.get("/category-tours/category/:id", catchAsync(getTourById));

export default router;
