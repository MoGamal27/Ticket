import { Router } from "express";
import { getStatistics } from "../../controllers/admins/home";
import { catchAsync } from "../../utils/catchAsync";

const router = Router();
router.get("/header", catchAsync(getStatistics));
export default router;
