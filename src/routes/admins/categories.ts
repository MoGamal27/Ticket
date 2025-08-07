import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import { updateCategorySchema } from "../../validators/admins/categories";
import {
  getAllCategory,
  getCategory,
  updateCategory,
} from "../../controllers/admins/categories";
const router = Router();
router.get("/", catchAsync(getAllCategory));
router.get("/:id", catchAsync(getCategory));
router.put("/:id", validate(updateCategorySchema), catchAsync(updateCategory));
export default router;
