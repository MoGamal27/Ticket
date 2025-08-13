import {
    categoryMedical,
} from "../../models/schema";

import { Request, Response } from "express";
import { db } from "../../models/db";

import { SuccessResponse } from "../../utils/response";
import { eq } from "drizzle-orm";
import { NotFound } from "../../Errors";


export const getMedicalCategories = async (req: Request, res: Response) => {
    const data = await db.select().from(categoryMedical);
    SuccessResponse(res, { categoriesMedical: data }, 200);
    }

export const createMedicalCategory = async (req: Request, res: Response) => {
  const data = req.body;
  await db.insert(categoryMedical).values(data);
  SuccessResponse(res, { message: "Category Medical Created Successfully" }, 201);
};

export const updateCategoryMedical = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [categorymedical] = await db
    .select()
    .from(categoryMedical)
    .where(eq(categoryMedical.id, id));
  if (!categorymedical) throw new NotFound("Category Medical Not Found");
 
  await db.update(categoryMedical).set(req.body).where(eq(categoryMedical.id, id));
  SuccessResponse(res, { message: "Country Updated Successfully" }, 200);
};
export const getMedicalCategoryById = async (req: Request, res: Response) => {
     const id = Number(req.params.id);
      const [categorymedical] = await db
    .select()
    .from(categoryMedical)
    .where(eq(categoryMedical.id, id));
    if (!categorymedical) throw new NotFound("Category Medical Not Found");
    SuccessResponse(res, { categorymedical }, 200);
}





export const deleteMedicalCategory = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [categorymedical] = await db
    .select()
    .from(categoryMedical)
    .where(eq(categoryMedical.id, id));
  if (!categoryMedical) throw new NotFound("Category Medical Not Found");

  await db.delete(categoryMedical).where(eq(categoryMedical.id, id));
  SuccessResponse(res, { message: "Category Medical Deleted Successfully" }, 200);
};

