import { Router } from "express";
import {
  getAllHomePageCover,
  getHomePageCover,
  createHomePageCover,
  deleteHomePageCover,
  updateHomePageCover,
} from "../../controllers/admins/homePage";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import {
  createHomePageCoverSchema,
  updateHomePageCoverSchema,
} from "../../validators/admins/homePage";
import { idParams } from "../../validators/admins/users";
const router = Router();
router
  .route("/")
  .get(catchAsync(getAllHomePageCover))
  .post(validate(createHomePageCoverSchema), createHomePageCover);

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getHomePageCover))
  .put(validate(updateHomePageCoverSchema), catchAsync(updateHomePageCover))
  .delete(validate(idParams), catchAsync(deleteHomePageCover));
export default router;
