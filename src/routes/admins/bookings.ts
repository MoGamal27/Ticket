import { Router } from "express";
import {
  getBookings,
  getBookingsStats,
} from "../../controllers/admins/bookgins";
import { catchAsync } from "../../utils/catchAsync";
const router = Router();
router.get("/", catchAsync(getBookings));
router.get("/header", catchAsync(getBookingsStats));
export default router;
