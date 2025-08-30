import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import {
  createCodeSchema,
  updateCodeSchema,
} from "../../validators/admins/promocodes";
import {
  createCode,
  updateCode,
  getAllPromoCodes,
  getCode,
  deleteCode,
} from "../../controllers/admins/promoCode";
import { idParams } from "../../validators/admins/users";
import { authenticated } from "../../middlewares/authenticated";
import { hasPrivilege } from "../../middlewares/hasPrivilege";
const router = Router();
router.use(authenticated)
router
  .route("/")
  .get(hasPrivilege("Promo Code", "View"),catchAsync(getAllPromoCodes))
  .post(hasPrivilege("Promo Code", "Add"),validate(createCodeSchema), catchAsync(createCode));

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getCode))
  .delete(hasPrivilege("Promo Code", "Delete"),validate(idParams), catchAsync(deleteCode))
  .put(hasPrivilege("Promo Code", "Edit"),validate(updateCodeSchema), catchAsync(updateCode));
export default router;
