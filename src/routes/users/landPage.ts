import { Router } from "express";
import {
  getImages,
  getFeaturedTours,
  getTourById,
  getToursByCategory,
} from "../../controllers/users/landPage";
import { catchAsync } from "../../utils/catchAsync";
const router = Router();
router.get("/images", catchAsync(getImages));
router.get("/featured-tours", catchAsync(getFeaturedTours));
router.get("/category-tours/:category", catchAsync(getToursByCategory));
router.get("/category-tours/category/:id", catchAsync(getTourById));

export default router;
