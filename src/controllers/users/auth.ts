import { Request, Response } from "express";
import { db } from "../../models/db";
import { emailVerifications, users } from "../../models/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/auth";
import { ConflictError, NotFound, UnauthorizedError } from "../../Errors";
import { SuccessResponse } from "../../utils/response";
import { sendEmail } from "../../utils/sendEmails";
import { BadRequest } from "../../Errors/BadRequest";
import { randomInt } from "crypto";

export async function login(req: Request, res: Response) {
  const data = req.body;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email));

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }
  if (!user.password) {
    throw new UnauthorizedError("Invalid email or password");
  }
  if (!user.isVerified) {
    throw new UnauthorizedError("Please Verify Email First");
  }
  const match = await bcrypt.compare(data.password, user.password!);
  if (!match) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = generateToken({
    id: user.id,
    roles: ["user"],
  });

  SuccessResponse(res, { message: "login Successful", token: token ,user:{
    name: user.name,
    email: user.email,
    id: user.id,
  }}, 200);
}

export const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) throw new NotFound("User Not Found");
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await db
    .delete(emailVerifications)
    .where(eq(emailVerifications.userId, user.id));

  await db.insert(emailVerifications).values({ code, userId: user.id });

  await sendEmail(
    email,
    "Password Reset Code",
    `Your reset code is: ${code}\nIt will expire in 2 hours.`
  );

  SuccessResponse(res, { message: "code sent succefully" }, 200);
};

export const verifyCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) throw new NotFound("User not found");
  const [rowCode] = await db
    .select()
    .from(emailVerifications)
    .where(eq(emailVerifications.userId, user.id));
  if (!rowCode || rowCode.code !== code)
    throw new BadRequest("Invalid email or reset code");
  await db
    .delete(emailVerifications)
    .where(eq(emailVerifications.userId, user.id));
  SuccessResponse(res, { message: "Code verified successfully" }, 200);
};

export const resetPassword = async (req: Request, res: Response) => {
  let { email, password } = req.body;
  password = await bcrypt.hash(password, 10);
  await db.update(users).set({ password }).where(eq(users.email, email));
  SuccessResponse(res, { message: "Password Updated Successfully" });
};

export const signup = async (req: Request, res: Response) => {
  const data = req.body;
  const [exsitUser] = await db
    .select()
    .from(users)
    .where(
      or(eq(users.email, data.email), eq(users.phoneNumber, data.phoneNumber))
    );
  if (exsitUser) {
    if (exsitUser.email === data.email)
      throw new ConflictError("Email is Aleardy Used");
    if (exsitUser.phoneNumber === data.phoneNumber)
      throw new ConflictError("Phone Number is Aleardy Used");
  }
  data.password = await bcrypt.hash(data.password, 10);
  const [result] = await db.insert(users).values(data).$returningId();
  const code = randomInt(100000, 999999).toString();
  await db.insert(emailVerifications).values({
    userId: result.id,
    code,
  });
  await sendEmail(
    data.email,
    "Email Verification",
    `Your verification code is ${code}`
  );
  SuccessResponse(
    res,
    { message: "User Signup Successfully Go Verify Email", userId: result.id },
    201
  );
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { userId, code } = req.body;

  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  });

  if (!user) throw new NotFound("User not found");

  const record = await db.query.emailVerifications.findFirst({
    where: (ev, { eq }) => eq(ev.userId, user.id),
  });

  if (!record || record.code !== code)
    throw new BadRequest("Invalid verification code");

  await db.update(users).set({ isVerified: true }).where(eq(users.id, user.id));
  await db
    .delete(emailVerifications)
    .where(eq(emailVerifications.userId, user.id));

  res.json({ message: "Email verified successfully" });
};

export const requireEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user || user.isVerified) throw new NotFound("User Not Found");
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await db
    .delete(emailVerifications)
    .where(eq(emailVerifications.userId, user.id));

  await db.insert(emailVerifications).values({ code, userId: user.id });

  await sendEmail(
    email,
    "Password Reset Code",
    `Your reset code is: ${code}\nIt will expire in 2 hours.`
  );

  SuccessResponse(res, { message: "code sent succefully" }, 200);
};
