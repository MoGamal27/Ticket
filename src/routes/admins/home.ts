import { Router } from "express";
import { getStatistics} from "../../controllers/admins/home";
import { catchAsync } from "../../utils/catchAsync";
import { authenticated } from "../../middlewares/authenticated";

const router = Router();
router.use(authenticated)
router.get("/header", catchAsync(getStatistics));
export default router;
