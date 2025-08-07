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

const router = Router();
router
  .route("/")
  .get(catchAsync(getAllCurrencies))
  .post(validate(createCurrencySchema), catchAsync(createCurrency));

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getCurrency))
  .delete(validate(idParams), catchAsync(deleteCurrency))
  .put(validate(idParams), catchAsync(updateCurrency));
export default router;
