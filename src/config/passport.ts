import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { users } from "../models/schema";
import { db } from "../models/db";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "https://tickethub-tours.com/api/user/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      let [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, profile.emails?.[0]?.value || " "));

      if (user) return done(null, user);

      const newUserd = {
        email: profile.emails?.[0]?.value ?? "",
        name: profile.name?.givenName ?? "",
        password: null,
        phoneNumber: null,
      };

      const [nUser] = await db.insert(users).values(newUserd).$returningId();

      const [newUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, nUser.id));

      return done(null, newUser);
    }
  )
);


// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID!,
//       clientSecret: process.env.FACEBOOK_APP_SECRET!,
//       callbackURL: "/auth/facebook/callback",
//       profileFields: ["id", "emails", "name"],
//     },
//     async (_accessToken, _refreshToken, profile, done) => {
//       // TODO: find or create user in your DB here
//       return done(null, profile);
//     }
//   )
// );

export default passport;
