import { Request, Response } from "express";
import { db } from "../../models/db";
import { homePageCover } from "../../models/schema";
import { SuccessResponse } from "../../utils/response";
import { eq } from "drizzle-orm";
import { NotFound } from "../../Errors";
import { saveBase64Image } from "../../utils/handleImages";
import { v4 as uuid } from "uuid";
import { deletePhotoFromServer } from "../../utils/deleteImage";

export const getAllHomePageCover = async (req: Request, res: Response) => {
  const pages = await db.select().from(homePageCover);
  SuccessResponse(res, { pages }, 200);
};

export const getHomePageCover = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [page] = await db
    .select()
    .from(homePageCover)
    .where(eq(homePageCover.id, id));
  if (!page) throw new NotFound("Home Page Cover Not Found");
  SuccessResponse(res, { page }, 200);
};

export const createHomePageCover = async (req: Request, res: Response) => {
  const data = req.body;
  data.imagePath = await saveBase64Image(data.imagePath, uuid(), req, "homes");
  await db.insert(homePageCover).values(data);
  SuccessResponse(res, { message: "Home Page Created Successfully" }, 200);
};

export const updateHomePageCover = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [page] = await db
    .select()
    .from(homePageCover)
    .where(eq(homePageCover.id, id));
  if (!page) throw new NotFound("Page Not Found");
  const data = req.body;
  if (data.imagePath) {
    await deletePhotoFromServer(new URL(page.imagePath).pathname);
    data.imagePath = await saveBase64Image(
      data.imagePath,
      uuid(),
      req,
      "homes"
    );
  }
  await db.update(homePageCover).set(data).where(eq(homePageCover.id, id));
  SuccessResponse(res, { message: "Home Page Updated Successfully" }, 200);
};

export const deleteHomePageCover = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [page] = await db
    .select()
    .from(homePageCover)
    .where(eq(homePageCover.id, id));
  if (!page) throw new NotFound("Page Not Found");
  await deletePhotoFromServer(new URL(page.imagePath).pathname);
  await db.delete(homePageCover).where(eq(homePageCover.id, id));
  SuccessResponse(res, { message: "Home Page Deleted Successfully" }, 200);
};
