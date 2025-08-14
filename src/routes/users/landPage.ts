import { Router } from "express";
import {
  getImages,
  getFeaturedTours,
  getTourById,
  getToursByCategory,
  getActivePaymentMethods,
  createBookingWithPayment,
  createMedical,
  getAllMedicals
} from "../../controllers/users/landPage";
import { catchAsync } from "../../utils/catchAsync";

import { validate } from "../../middlewares/validation";
import { createBookingWithPaymentSchema, medicalRecordSchema } from "..//..//validators/users/landPage";
const router = Router();

router.post("/book-tour",validate(createBookingWithPaymentSchema) ,catchAsync(createBookingWithPayment));

router.post("/create-medical", /*validate(createMedicalSchema),*/ catchAsync(createMedical));


router.get("/medicals", catchAsync(getAllMedicals));

router.get("/active", catchAsync(getActivePaymentMethods));

router.get("/images", catchAsync(getImages));
router.get("/featured-tours", catchAsync(getFeaturedTours));
router.get("/category-tours/:category", catchAsync(getToursByCategory));
router.get("/category-tours/category/:id", catchAsync(getTourById));

export default router;
