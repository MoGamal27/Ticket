import express from "express";
import passport from "passport";
import "../../../config/passport";
import { generateToken } from "../../../utils/auth";
import { UnauthorizedError } from "../../../Errors";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err || !user) {
      throw new UnauthorizedError("Authentication failed");
    }

    const token = generateToken({ id: user.id, roles: ["user"] });
    return res.json({ token });
  })(req, res, next);
});

export default router;
