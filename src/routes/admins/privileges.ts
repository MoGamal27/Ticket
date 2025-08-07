import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
  getAllPrivilegs,
  getPrivilegs,
  createPrivilegs,
  updatePrivilegs,
  deletePrivilegs,
} from "../../controllers/admins/privileges";
import { validate } from "../../middlewares/validation";
import {
  createPrivileg,
  updatePrivileg,
} from "../../validators/admins/privileges";
import { idParams } from "../../validators/admins/users";

const router = Router();
router
  .route("/")
  .get(catchAsync(getAllPrivilegs))
  .post(validate(createPrivileg), catchAsync(createPrivilegs));

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getPrivilegs))
  .put(validate(updatePrivileg), catchAsync(updatePrivilegs))
  .delete(validate(idParams), catchAsync(deletePrivilegs));
export default router;
