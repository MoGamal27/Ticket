// routes/auth/google.ts
import express from "express";
import passport from "passport";
import "../../../config/passport"; 

const router = express.Router();

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/callback",
  passport.authenticate("google", { 
    session: false, 
    failureRedirect: `${process.env.FRONTEND_URL}/login-error` 
  }),
 (req, res) => {
  const { user, token } = req.user as { user: any; token: string };

  if (!user || !token) {
    return res.redirect(`${process.env.FRONTEND_URL}/login-error`);
  }

  const email = encodeURIComponent(user.email);
  const name = encodeURIComponent(user.name);

  return res.redirect(
    `${process.env.FRONTEND_URL}/dashboard?token=${token}&email=${email}&name=${name}`
  );
});

export default router;