// config/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "../models/db";
import { users } from "../models/schema";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // البحث عن المستخدم
        let user = await db
          .select()
          .from(users)
          .where(eq(users.googleId, profile.id))
          .limit(1)
          .then((res: any[]) => res[0]);

        if (!user) {
          // إنشاء مستخدم جديد
          await db.insert(users).values({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0].value!,
            isVerified: true,
          });

          // جلب المستخدم الجديد مباشرة باستخدام googleId
          user = await db
            .select()
            .from(users)
            .where(eq(users.googleId, profile.id))
            .limit(1)
            .then((res: any[]) => res[0]);
        }

        // إنشاء JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
          expiresIn: "7d",
        });

        return done(null, { user, token });
      } catch (err) {
        return done(err as any, undefined);
      }
    }
  )
);

export default passport;