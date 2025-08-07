import express from "express";
import passport from "passport";
import "../../../config/passport";
import { generateToken } from "../../../utils/auth";

const router = express.Router();

router.get("/", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {
    const user = req.user as { id: number };
    const token = generateToken({ id: user?.id, roles: ["user"] });
    res.json({ token });
  }
);

export default router;
