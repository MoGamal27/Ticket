import { Router } from "express";
import { login } from "../../controllers/admins/auth";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import { loginSchema } from "../../validators/admins/auth";
const router = Router();
router.post("/login", validate(loginSchema), catchAsync(login));
export default router;
