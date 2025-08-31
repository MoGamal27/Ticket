import { Router } from "express";
import {
  createBooking,
  getBookings,
  getBookingsStats,
} from "../../controllers/admins/bookgins";
import { catchAsync } from "../../utils/catchAsync";
import { authenticated } from "../../middlewares/authenticated";
import { hasPrivilege } from "../../middlewares/hasPrivilege";
const router = Router();
router.use(authenticated)
router.post("/", catchAsync(createBooking));
router.get("/", hasPrivilege("Bookings", "View"),catchAsync(getBookings));
router.get("/header", catchAsync(getBookingsStats));

export default router;
