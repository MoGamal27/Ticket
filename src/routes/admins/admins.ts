import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
  getAllAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  addPrivilegesAdmin,
} from "../../controllers/admins/admins";
import { idParams } from "../../validators/admins/users";
import {
  createAdminSchema,
  updateAdminSchema,
  addPrivilegesAdminSchema,
} from "../../validators/admins/admins";
import { validate } from "../../middlewares/validation";
const router = Router();
router
  .route("/")
  .get(catchAsync(getAllAdmins))
  .post(validate(createAdminSchema), catchAsync(createAdmin));

router.post(
  "/:id/privileges",
  validate(addPrivilegesAdminSchema),
  catchAsync(addPrivilegesAdmin)
);

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getAdmin))
  .put(validate(updateAdminSchema), catchAsync(updateAdmin))
  .delete(validate(idParams), catchAsync(deleteAdmin));
export default router;
