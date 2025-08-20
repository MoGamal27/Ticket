// src/config/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { db } from "../models/db";
import { users } from "../models/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
import { generateToken } from "../utils/auth";

dotenv.config();

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

        // check if user exists
        let [user] = await db.select().from(users).where(eq(users.email, email));

        // if not, create new
        if (!user) {
          const [insertedId] = await db
            .insert(users)
            .values({
              email,
              name: profile.displayName || profile.name?.givenName ||  "",
              password: null,
              phoneNumber: null,
            })
            .$returningId();

          [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, insertedId.id));
        }

        // generate JWT
        const token = generateToken(user.id);

        return done(null, { user, token });
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

export default passport;