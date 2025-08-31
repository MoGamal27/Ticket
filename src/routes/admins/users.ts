import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  createUser,
} from "../../controllers/admins/users";
import { validate } from "../../middlewares/validation";
import {
  createUserSchema,
  idParams,
  updateUserSchema,
} from "../../validators/admins/users";
import { authorizePermissions } from "../../middlewares/authorized";
import { authenticated } from "../../middlewares/authenticated";
import { hasPrivilege } from "../../middlewares/hasPrivilege";

const router = Router();
router.use(authenticated)

// router.use(authenticated);
router
  .route("/")
  .post(
    // authorizePermissions("user-add"),
    hasPrivilege("User", "Add"),
    validate(createUserSchema),
    catchAsync(createUser)
  )
  .get(hasPrivilege("User", "View"),catchAsync(getAllUsers));

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getUser))
  .put(hasPrivilege("User", "Edit"),validate(updateUserSchema), catchAsync(updateUser))
  .delete(hasPrivilege("User", "Delete"),validate(idParams), catchAsync(deleteUser));
export default router;
