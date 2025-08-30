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
  updateTourStatus,
  updateTourFeatured
} from "../../controllers/admins/tours";
import { idParams } from "../../validators/admins/users";
import { authenticated } from "../../middlewares/authenticated";
import { hasPrivilege } from "../../middlewares/hasPrivilege";

const router = Router();
router.use(authenticated)

// Main tours routes
router.route("/")
  .get(hasPrivilege("Tour", "View"), catchAsync(getAllTours))
  .post(hasPrivilege("Tour", "Add"), validate(createTourSchema), catchAsync(createTour))
  
 
  router.route("/status").post(hasPrivilege("Tour", "Status"),catchAsync(updateTourStatus)) 

  router.route("/featured").post(hasPrivilege("Tour", "Featured"),catchAsync(updateTourFeatured)) 
  

  

// Special admin operations
router.get("/add-data", catchAsync(addData));
 

// Individual tour operations
router.route("/:id")
  .put(validate(updateTourSchema), hasPrivilege("Tour", "Edit"),catchAsync(updateTour))
  .get(validate(idParams), catchAsync(getTourById))
  .delete(validate(idParams), hasPrivilege("Tour", "Delete"),catchAsync(deleteTour));

export default router;
