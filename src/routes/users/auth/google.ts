import express from "express";
import passport from "passport";
import "../../../config/passport"; // passport config
import { generateToken } from "../../../utils/auth";

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

    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  }
);

export default router;