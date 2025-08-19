import express from "express";
import passport from "passport";
import "../../../config/passport"; // load google strategy
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { user, token } = req.user as { user: any; token: string };

    if (!user || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const redirectUrl = `${process.env.FRONTEND_URL}/?token=${token}`;

    return res.redirect(redirectUrl);
  }
);

export default router;