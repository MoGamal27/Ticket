import { Router } from "express";
import {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
} from "../../controllers/admins/cities";
import {
  createCitySchema,
  updateCitySchema,
} from "../../validators/admins/cities";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import { idParams } from "../../validators/admins/users";
import { authenticated } from "../../middlewares/authenticated";
import { hasPrivilege } from "../../middlewares/hasPrivilege";
const router = Router();
router.use(authenticated)
router
  .route("/")
  .get(hasPrivilege("City", "View"),catchAsync(getAllCities))
  .post(hasPrivilege("City", "Add"),validate(createCitySchema), catchAsync(createCity));

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getCityById))
  .put(hasPrivilege("City", "Edit"),validate(updateCitySchema), catchAsync(updateCity))
  .delete(hasPrivilege("City", "Delete"),validate(idParams), catchAsync(deleteCity));
export default router;
