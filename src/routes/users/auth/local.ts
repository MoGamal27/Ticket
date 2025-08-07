import { Router } from "express";
import {
  forgetPassword,
  verifyCode,
  resetPassword,
  login,
  signup,
  verifyEmail,
  requireEmail,
} from "../../../controllers/users/auth";
import { catchAsync } from "../../../utils/catchAsync";
import { validate } from "../../../middlewares/validation";
import {
  forgetPasswordSchema,
  verifyCodeSchema,
  resetPasswordSchema,
  loginSchema,
  signupSchema,
  verifyEmailSchema,
} from "../../../validators/users/auth";
const router = Router();
router.post(
  "/forget-password",
  validate(forgetPasswordSchema),
  catchAsync(forgetPassword)
);

router.post("/verify-code", validate(verifyCodeSchema), catchAsync(verifyCode));

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  catchAsync(resetPassword)
);

router.post("/login", validate(loginSchema), catchAsync(login));
router.post("/signup", validate(signupSchema), catchAsync(signup));
router.post(
  "/verify-email",
  validate(verifyEmailSchema),
  catchAsync(verifyEmail)
);

router.post(
  "/require-code",
  validate(forgetPasswordSchema),
  catchAsync(requireEmail)
);

export default router;
