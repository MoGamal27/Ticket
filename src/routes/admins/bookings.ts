import { Router } from "express";
import {
  createBooking,
  getBookings,
  getBookingsStats,
} from "../../controllers/admins/bookgins";
import { catchAsync } from "../../utils/catchAsync";
const router = Router();
router.post("/", catchAsync(createBooking));
router.get("/", catchAsync(getBookings));
router.get("/header", catchAsync(getBookingsStats));

export default router;
