import { Request, Response } from "express";
import { db } from "../../models/db";
import { extras } from "../../models/schema";
import { SuccessResponse } from "../../utils/response";
import { eq } from "drizzle-orm";
import { NotFound } from "../../Errors";

export const getAllExtras = async (req: Request, res: Response) => {
  const extra = await db.select().from(extras);
  SuccessResponse(res, { extras: extra }, 200);
};

export const getExtra = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [extra] = await db.select().from(extras).where(eq(extras.id, id));
  if (!extra) throw new NotFound("Extra Not Found");
  SuccessResponse(res, { extra }, 200);
};

export const createExtra = async (req: Request, res: Response) => {
  const data = req.body;
  await db.insert(extras).values(data);
  SuccessResponse(res, { message: "Extra Created Successfully" }, 201);
};

export const updateExtra = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [extra] = await db.select().from(extras).where(eq(extras.id, id));
  if (!extra) throw new NotFound("Extra Not Found");
  const data = req.body;
  await db.update(extras).set(data).where(eq(extras.id, id));
  SuccessResponse(res, { message: "Extra Updated Successfully" }, 200);
};

export const deleteExtra = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [extra] = await db.select().from(extras).where(eq(extras.id, id));
  if (!extra) throw new NotFound("Extra Not Found");
  await db.delete(extras).where(eq(extras.id, id));
  SuccessResponse(res, { message: "Extra Deleted Successfully" }, 200);
};
