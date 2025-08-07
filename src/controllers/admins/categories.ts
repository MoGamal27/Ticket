import { Request, Response } from "express";
import { saveBase64Image } from "../../utils/handleImages";
import { v4 as uuid } from "uuid";
import { db } from "../../models/db";
import { categories } from "../../models/schema";
import { eq } from "drizzle-orm";
import { SuccessResponse } from "../../utils/response";
import { NotFound } from "../../Errors";
import { deletePhotoFromServer } from "../../utils/deleteImage";

export const getAllCategory = async (req: Request, res: Response) => {
  const Categorys = await db.select().from(categories);
  SuccessResponse(res, { Categories: Categorys }, 200);
};

export const getCategory = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id));
  if (!category) throw new NotFound("Category Not Found");
  SuccessResponse(res, { category }, 200);
};

export const updateCategory = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id));
  if (!category) throw new NotFound("Category Not Found");
  let { status, imagePath } = req.body;
  if (imagePath) {
    await deletePhotoFromServer(new URL(category.imagePath).pathname);
    imagePath = await saveBase64Image(imagePath, uuid(), req, "categories");
  }
  await db
    .update(categories)
    .set({ status, imagePath })
    .where(eq(categories.id, id));
  SuccessResponse(res, { message: "Category updated Succesfully" }, 200);
};
