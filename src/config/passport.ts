import express, { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../models/db"; // ملف اتصال drizzle
import { users } from "../models/schema"; // جدول users
import { eq } from "drizzle-orm";

dotenv.config();

const app = express();
app.use(express.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // لازم يطابق الـ Client ID بتاعك
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ success: false, message: "Invalid Google payload" });
    }

    const email = payload.email!;
    const name = payload.name || "Unknown User";
    const googleId = payload.sub; // الـ Google unique ID

    // 🔍 check if user exists
    let user = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleId))
      .limit(1)
      .then((rows: any[]) => rows[0]);

    // ➕ create if not exists
    if (!user) {
      await db.insert(users).values({
        googleId,
        email,
        name,
        isVerified: true,
      });

      user = await db
        .select()
        .from(users)
        .where(eq(users.googleId, googleId))
        .limit(1)
        .then((rows: any[]) => rows[0]);
    }

    // 🔑 Generate JWT
    const authToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.json({
      success: true,
      token: authToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};