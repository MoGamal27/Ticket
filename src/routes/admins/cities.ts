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
const router = Router();
router
  .route("/")
  .get(catchAsync(getAllCities))
  .post(validate(createCitySchema), catchAsync(createCity));

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getCityById))
  .put(validate(updateCitySchema), catchAsync(updateCity))
  .delete(validate(idParams), catchAsync(deleteCity));
export default router;
