import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import { createTourSchema, updateTourSchema } from "../../validators/admins/tours";
import {
  addData,
  createTour,
  deleteTour,
  getAllTours,
  getTourById,
  updateTour,
  updateTourStatus
} from "../../controllers/admins/tours";
import { idParams } from "../../validators/admins/users";
import { authenticated } from "../../middlewares/authenticated";


const router = Router();
router.use(authenticated)

// Main tours routes
router.route("/")
  .get(catchAsync(getAllTours))
  .post(validate(createTourSchema), catchAsync(createTour))
  
 
  router.route("/status").post(catchAsync(updateTourStatus)) 
  
// Special admin operations
router.get("/add-data", catchAsync(addData));
 

// Individual tour operations
router.route("/:id")
  .put(validate(updateTourSchema), catchAsync(updateTour))
  .get(validate(idParams), catchAsync(getTourById))
  .delete(validate(idParams), catchAsync(deleteTour));

export default router;
