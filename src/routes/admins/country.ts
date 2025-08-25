import { Router } from "express";
import {
  getAllCountries,
  getCountryById,
  updateCountry,
  deleteCountry,
  createCountry,
} from "../../controllers/admins/country";
import {
  createCountrySchema,
  updateCountrySchema,
} from "../../validators/admins/country";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import { idParams } from "../../validators/admins/users";
import { authenticated } from "../../middlewares/authenticated";
const router = Router();
router.use(authenticated)
router
  .route("/")
  .get(catchAsync(getAllCountries))
  .post(validate(createCountrySchema), catchAsync(createCountry));

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getCountryById))
  .put(validate(updateCountrySchema), catchAsync(updateCountry))
  .delete(validate(idParams), catchAsync(deleteCountry));
export default router;
