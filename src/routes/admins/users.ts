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

const router = Router();

// router.use(authenticated);
router
  .route("/")
  .post(
    // authorizePermissions("user-add"),
    validate(createUserSchema),
    catchAsync(createUser)
  )
  .get(catchAsync(getAllUsers));

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getUser))
  .put(validate(updateUserSchema), catchAsync(updateUser))
  .delete(validate(idParams), catchAsync(deleteUser));
export default router;
