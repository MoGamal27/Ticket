import {
    categoryMedical,
    Medicals,
    MedicalImages
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


// get all medical 
export const getAllMedicals = async (req: Request, res: Response) => {
  try {
    // Get all medical records
    const medicals = await db.select().from(Medicals);

    // Get all medical images grouped by medical_id
    const images = await db.select().from(MedicalImages);
    const imagesByMedicalId = images.reduce((acc, image: any) => {
      if (!acc[image.medicalId]) {
        acc[image.medicalId] = [];
      }
      acc[image.medicalId].push(image);
      return acc;
    }, {} as Record<number, typeof images>);

    // Combine medical records with their images
    const medicalsWithImages = medicals.map(medical => ({
      ...medical,
      images: imagesByMedicalId[medical.id] || []
    }));

    SuccessResponse(res, { medicals: medicalsWithImages }, 200);
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getMedicalById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  
  try {
    // Get the medical record
    const [medical] = await db
      .select()
      .from(Medicals)
      .where(eq(Medicals.id, id));
    
    if (!medical) {
      throw new NotFound("Medical Not Found");
    }

    // Get all images for this medical record
    const images = await db
      .select()
      .from(MedicalImages)
      .where(eq(MedicalImages.medicalId, id));

    // Combine the data
    const medicalWithImages = {
      ...medical,
      images
    };

    SuccessResponse(res, { medical: medicalWithImages }, 200);
  } catch (error) {
    if (error instanceof NotFound) {
      return res.status(404).json({ message: error.message });
    }
    console.error("Error fetching medical record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

