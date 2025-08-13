import express from "express";
import passport from "passport";
import "../../../config/passport";
import { generateToken } from "../../../utils/auth";
<<<<<<< HEAD
=======
import { UnauthorizedError } from "../../../Errors";
>>>>>>> parent of 2709c18 (update hassan)
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

<<<<<<< HEAD
=======
      // لو المستخدم مش موجود بالفعل، يبقى نعمله signup
>>>>>>> parent of 2709c18 (update hassan)
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

<<<<<<< HEAD
=======
      // توليد token سواء المستخدم جديد أو موجود
>>>>>>> parent of 2709c18 (update hassan)
      const token = generateToken({ id: finalUser.id, roles: ["user"] });

      return res.json({ token, user: { id: finalUser.id, email: finalUser.email, name: finalUser.name } });

    } catch (e) {
      console.error("Error processing user:", e);
      return res.status(500).json({ message: "Processing failed" });
    }
  })(req, res, next);
});

export default router;