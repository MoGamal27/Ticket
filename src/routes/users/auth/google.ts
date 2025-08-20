// routes/auth/google.ts
import express from "express";
import passport from "passport";
import "../../../config/passport"; // load google strategy

const router = express.Router();

// بدء تسجيل الدخول مع جوجل
router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// callback بعد تسجيل الدخول
router.get(
  "/callback",
  passport.authenticate("google", { 
    session: false, 
    failureRedirect: `${process.env.FRONTEND_URL}/login-error `
  }),
  (req, res) => {
    const { user, token } = req.user as { user: any; token: string };

    if (!user || !token) {
      // مجرد احتياط، لو فشل توليد التوكن
      return res.redirect(`${process.env.FRONTEND_URL}/login-error)`);
    }

    // تحويل المستخدم للـ Frontend مع التوكن
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
  }
);

export default router;