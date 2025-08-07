import { Request, Response } from "express";
import { db } from "../../models/db";
import { admins } from "../../models/schema";
import { eq } from "drizzle-orm";
import { SuccessResponse } from "../../utils/response";
import bcrypt from "bcrypt";
import { deletePhotoFromServer } from "../../utils/deleteImage";
import { saveBase64Image } from "../../utils/handleImages";
import { v4 as uuid } from "uuid";

export const getProfile = async (req: Request, res: Response) => {
  const user = req.user as { id: number; roles: string[] };
  const [data] = await db.select().from(admins).where(eq(admins.id, user.id));
  SuccessResponse(res, { admin: data }, 200);
};

export const updateProfile = async (req: Request, res: Response) => {
  const user = req.user as { id: number; roles: string[] };
  const [userData] = await db
    .select()
    .from(admins)
    .where(eq(admins.id, user.id));
  const data = req.body;
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  if (data.imagePath) {
    await deletePhotoFromServer(new URL(userData.imagePath!).pathname);
    data.imagePath = await saveBase64Image(
      data.imagePath,
      uuid(),
      req,
      "admins"
    );
  }
  await db.update(admins).set(data).where(eq(admins.id, user.id));
  SuccessResponse(res, { message: "Data Updated Successfully" }, 200);
};
