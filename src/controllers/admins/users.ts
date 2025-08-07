import { Request, Response } from "express";
import { db } from "../../models/db";
import { users } from "../../models/schema";
import { SuccessResponse } from "../../utils/response";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NotFound } from "../../Errors";

export const getAllUsers = async (req: Request, res: Response) => {
  const usersDate = await db.select().from(users);
  SuccessResponse(res, { users: usersDate }, 200);
};

export const createUser = async (req: Request, res: Response) => {
  const data = req.body;
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  await db.insert(users).values(data);
  SuccessResponse(res, { message: "User Created Successfully" }, 201);
};

export const getUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [user] = await db.select().from(users).where(eq(users.id, id));
  if (!user) throw new NotFound("User Not Found");
  SuccessResponse(res, { user }, 200);
};

export const updateUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;
  const [user] = await db.select().from(users).where(eq(users.id, id));
  if (!user) throw new NotFound("User Not Found");
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  await db.update(users).set(data).where(eq(users.id, id));
  SuccessResponse(res, { message: "User Updated Successfully" }, 200);
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [user] = await db.select().from(users).where(eq(users.id, id));
  if (!user) throw new NotFound("User Not Found");
  await db.delete(users).where(eq(users.id, id));
  SuccessResponse(res, { message: "User Deleted Successfully" }, 200);
};
