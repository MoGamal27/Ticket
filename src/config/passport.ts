import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "../models/db";
import { users } from "../models/schema";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL_local!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        

        let user = await db
          .select()
          .from(users)
          .where(eq(users.googleId, profile.id))
          .limit(1)
          .then((res) => res[0]);

        if (!user) {
          await db.insert(users).values({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0].value!,
            isVerified: true,
          });

          user = await db
            .select()
            .from(users)
            .where(eq(users.googleId, profile.id))
            .limit(1)
            .then((res) => res[0]);
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
          expiresIn: "7d",
        });

        return done(null, { user, token });
      } catch (err) {
        console.error("❌ Error in GoogleStrategy:", err);
        return done(err as any, undefined);
      }
    }
  )
);