import { Router } from "express";
import AuthRoute from "./auth";
import LandPageRoute from "./landPage";
const router = Router();
router.use("/auth", AuthRoute);
router.use("/landPage", LandPageRoute);
export default router;
