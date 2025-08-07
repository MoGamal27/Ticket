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
const router = Router();
router
  .route("/")
  .get(catchAsync(getAllExtras))
  .post(validate(createExtraSchema), catchAsync(createExtra));

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getExtra))
  .put(validate(updateExtraSchema), catchAsync(updateExtra))
  .delete(validate(idParams), catchAsync(deleteExtra));
export default router;
