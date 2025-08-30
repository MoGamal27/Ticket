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
import { authenticated } from "../../middlewares/authenticated";
import { hasPrivilege } from "../../middlewares/hasPrivilege";
const router = Router();
router.use(authenticated)
router
  .route("/")
  .get(hasPrivilege("Home Page Cover", "View"),catchAsync(getAllHomePageCover))
  .post(hasPrivilege("Home Page Cover", "Add"),validate(createHomePageCoverSchema), createHomePageCover);

router
  .route("/:id")
  .get(validate(idParams), catchAsync(getHomePageCover))
  .put(hasPrivilege("Home Page Cover", "Edit"),validate(updateHomePageCoverSchema), catchAsync(updateHomePageCover))
  .delete(hasPrivilege("Home Page Cover", "Delete"),validate(idParams), catchAsync(deleteHomePageCover));
export default router;
