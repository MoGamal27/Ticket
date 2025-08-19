// src/config/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { db } from "../models/db";
import { users } from "../models/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

// Helper لتوليد JWT
const generateToken = (userId: number) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken: string, _refreshToken: string, profile: Profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email found in Google profile"));

        // جلب المستخدم لو موجود
        let [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        // إنشاء مستخدم جديد لو مش موجود
        if (!user) {
          const [insertedId] = await db.insert(users).values({
            email,
            name: profile.name?.givenName || "",
            password: null,
            phoneNumber: null,
          }).$returningId();

          [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, insertedId.id));
        }

        // توليد JWT
        const token = generateToken(user.id);

        // إعادة المستخدم و الـ token
        return done(null, { user, token });
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

export default passport;