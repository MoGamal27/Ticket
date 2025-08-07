import { Router } from "express";
import AdminRoute from "./admins";
import UserRoute from "./users";
const router = Router();
router.use("/admin", AdminRoute);
router.use("/user", UserRoute);
export default router;
