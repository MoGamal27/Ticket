import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import { getProfile, updateProfile } from "../../controllers/admins/profile";
import { updateProfileSchema } from "../../validators/admins/profile";
import { authenticated } from "../../middlewares/authenticated";
import { authorizePermissions } from "../../middlewares/authorized";
import { hasPrivilege } from "../../middlewares/hasPrivilege";
const router = Router();

router
  .route("/")
  .get(hasPrivilege("Profile", "View"),catchAsync(getProfile))
  .put(hasPrivilege("Profile", "Edit"),validate(updateProfileSchema), catchAsync(updateProfile));
export default router;
