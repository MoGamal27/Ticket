import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import { updateCategorySchema } from "../../validators/admins/categories";
import {
  getAllCategory,
  getCategory,
  updateCategory,
} from "../../controllers/admins/categories";
import { authenticated } from "../../middlewares/authenticated";
import { hasPrivilege } from "../../middlewares/hasPrivilege";
const router = Router();
router.use(authenticated)
router.get("/", hasPrivilege("Category", "View"), catchAsync(getAllCategory));
router.get("/:id", catchAsync(getCategory));
router.put("/:id", hasPrivilege("Category", "Edit"), validate(updateCategorySchema), catchAsync(updateCategory));
export default router;
