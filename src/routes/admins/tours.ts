import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import { createTourSchema } from "../../validators/admins/tours";
import {
  addData,
  createTour,
  deleteTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteAllTours,
} from "../../controllers/admins/tours";
import { idParams } from "../../validators/admins/users";

const router = Router();
router
  .route("/")
  .get(catchAsync(getAllTours))
  .post(validate(createTourSchema), catchAsync(createTour));

  router.delete("/delete-all", catchAsync(deleteAllTours));

router.get("/add-data", catchAsync(addData));
router
  .route("/:id")
  .put(catchAsync(updateTour))
  .get(validate(idParams), catchAsync(getTourById))
  .delete(validate(idParams), catchAsync(deleteTour));

router.delete("/delete-all", catchAsync(deleteAllTours));

export default router;
