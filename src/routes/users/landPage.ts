import { Router } from "express";
import {
  getImages,
  getFeaturedTours,
  getTourById,
  getToursByCategory,
  getActivePaymentMethods,
  createBookingWithPayment,
} from "../../controllers/users/landPage";
import { catchAsync } from "../../utils/catchAsync";

import { validate } from "../../middlewares/validation";
import { createBookingWithPaymentSchema } from "..//..//validators/users/landPage";
const router = Router();

router.post("/book-tour",validate(createBookingWithPaymentSchema) ,catchAsync(createBookingWithPayment));



router.get("/active", catchAsync(getActivePaymentMethods));

router.get("/images", catchAsync(getImages));
router.get("/featured-tours", catchAsync(getFeaturedTours));
router.get("/category-tours/:category", catchAsync(getToursByCategory));
router.get("/category-tours/category/:id", catchAsync(getTourById));

export default router;
