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
    failureRedirect: "/login" 
  }),
  (req, res) => {
    const {user,token} = req.user as unknown as  { user: any; token: string };

    if (!user || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.redirect(
      `${process.env.FRONTEND_URL}/?token=${token}&email=${user.email}&name=${user.name}`
    );
  }
);

export default router;