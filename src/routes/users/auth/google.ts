// routes/auth/google.ts
import express from "express";
import passport from "passport";
import "../../../config/passport"; 

const router = express.Router();

// خطوة 1: توجيه المستخدم لتسجيل الدخول بجوجل
router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// خطوة 2: callback بعد تسجيل الدخول
router.get(
  "/callback",
  passport.authenticate("google", { 
    session: false, 
    failureRedirect: `${process.env.FRONTEND_URL}/login-error` 
  }),
  (req, res) => {
    // تحويل النوع لأن Passport لا يعرف نوع req.user
    const userData = req.user as { user: { email: string; name: string }; token: string } | undefined;

    if (!userData ||  !userData.user ||  !userData.token) {
      return res.redirect(`${process.env.FRONTEND_URL}/login-error`);
    }

    const { user, token } = userData;
    const email = encodeURIComponent(user.email);
    const name = encodeURIComponent(user.name);

    return res.redirect(
      `${process.env.FRONTEND_URL}/dashboard?token=${token}&email=${email}&name=${name}`
    );
  }
);

export default router;