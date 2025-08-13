import express from "express";
import passport from "passport";
import "../../../config/passport";
import { generateToken } from "../../../utils/auth";
import { users } from "../../../models/schema";
import { db } from "../../../models/db";
import { eq } from "drizzle-orm";
const router = express.Router();

router.get("/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user, info) => {
    if (err) {
      console.error("Google auth error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    try {
      let finalUser = user;

      if (!user) {
        const email = info?.emails?.[0]?.value ?? "";
        const name = info?.name?.givenName ?? "";

        // اتأكد ان مفيش duplicate
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        if (existingUser) {
          finalUser = existingUser;
        } else {
          const [newUserId] = await db.insert(users).values({
            email,
            name,
            password: null,
            phoneNumber: null,
          }).$returningId();

          const [newUser] = await db
            .select()
            .from(users)
            .where(eq(users.id, newUserId.id));
          finalUser = newUser;
        }
      }

      const token = generateToken({ id: finalUser.id, roles: ["user"] });

      return res.json({ token, user: { id: finalUser.id, email: finalUser.email, name: finalUser.name } });

    } catch (e) {
      console.error("Error processing user:", e);
      return res.status(500).json({ message: "Processing failed" });
    }
  })(req, res, next);
});

export default router;