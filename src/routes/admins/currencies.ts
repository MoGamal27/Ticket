import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import {
  getAllCurrencies,
  getCurrency,
  createCurrency,
  updateCurrency,
  deleteCurrency,
} from "../../controllers/admins/currencies";
import {
  createCurrencySchema,
  updateCurrencySchema,
} from "../../validators/admins/currencies";
import { idParams } from "../../validators/admins/users";
import { authenticated } from "../../middlewares/authenticated";
import { hasPrivilege } from "../../middlewares/hasPrivilege";
const router = Router();
router.use(authenticated)
router
  .route("/")
  .get(hasPrivilege("Currency", "View"),catchAsync(getAllCurrencies))
  .post(hasPrivilege("Currency", "Add"),validate(createCurrencySchema), catchAsync(createCurrency));

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getCurrency))
  .delete(hasPrivilege("Currency", "Delete"),validate(idParams), catchAsync(deleteCurrency))
  .put(hasPrivilege("Currency", "Edit"),validate(idParams), catchAsync(updateCurrency));
export default router;
