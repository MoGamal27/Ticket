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
import { hasPrivilege } from "../../middlewares/hasPrivilege";
const router = Router();
router.use(authenticated)
router
  .route("/")
  .get(hasPrivilege("Country", "View"),catchAsync(getAllCountries))
  .post(hasPrivilege("Country", "Add"),validate(createCountrySchema), catchAsync(createCountry));

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getCountryById))
  .put(hasPrivilege("Country", "Edit"),validate(updateCountrySchema), catchAsync(updateCountry))
  .delete(hasPrivilege("Country", "Delete"),validate(idParams), catchAsync(deleteCountry));
export default router;
