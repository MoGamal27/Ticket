import { Router } from "express";
import AdminRoute from "./admins";
import UserRoute from "./users";
import Booking from "./users/Booking"
import payments from "./users/payments";
const router = Router();
router.use("/admin", AdminRoute);
router.use("/user", UserRoute);
router.use("/bookings", Booking);
router.use("/payments", payments);
export default router;
