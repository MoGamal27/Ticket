import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import { getProfile, updateProfile } from "../../controllers/admins/profile";
import { updateProfileSchema } from "../../validators/admins/profile";
import { authenticated } from "../../middlewares/authenticated";
import { authorizePermissions } from "../../middlewares/authorized";
const router = Router();
router.use(authenticated, authorizePermissions("super_admin"));
router
  .route("/")
  .get(catchAsync(getProfile))
  .put(validate(updateProfileSchema), catchAsync(updateProfile));
export default router;
