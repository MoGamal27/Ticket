import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import {
  getAllExtras,
  getExtra,
  updateExtra,
  createExtra,
  deleteExtra,
} from "../../controllers/admins/extras";
import {
  createExtraSchema,
  updateExtraSchema,
} from "../../validators/admins/extras";
import { idParams } from "../../validators/admins/users";
import { authenticated } from "../../middlewares/authenticated";
import { hasPrivilege } from "../../middlewares/hasPrivilege";
const router = Router();
router.use(authenticated)
router
  .route("/")
  .get(hasPrivilege("Extras", "View"),catchAsync(getAllExtras))
  .post(hasPrivilege("Extras", "Add"),validate(createExtraSchema), catchAsync(createExtra));

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getExtra))
  .put(hasPrivilege("Extras", "Edit"),validate(updateExtraSchema), catchAsync(updateExtra))
  .delete(hasPrivilege("Extras", "Delete"),validate(idParams), catchAsync(deleteExtra));
export default router;
