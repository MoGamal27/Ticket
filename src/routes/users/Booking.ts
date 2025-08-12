import { authenticated } from "../../middlewares/authenticated";
import { Router } from "express";
import { getUserBookings,getBookingDetails,updateBooking,cancelBooking } from "../../controllers/users/Booking";
import { catchAsync } from "../../utils/catchAsync";
import { AuthenticatedRequest } from "../../types/custom";

const router = Router();
router.get("/", authenticated, catchAsync((req, res) => {
  return getUserBookings(req as AuthenticatedRequest, res);
}));

router.get("/:id", authenticated, catchAsync((req, res) => {
  return getBookingDetails(req as AuthenticatedRequest, res);
}));

router.put("/:id", authenticated, catchAsync((req, res) => {
  return updateBooking(req as AuthenticatedRequest, res);
}));

router.delete("/:id", authenticated, catchAsync((req, res) => {
  return cancelBooking(req as AuthenticatedRequest, res);
}));


// router.post("/", authenticated, (req, res) => {
//   createBooking(req as AuthenticatedRequest, res);
// });

export default router;