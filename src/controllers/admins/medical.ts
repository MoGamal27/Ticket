import {
    categoryMedical,
    Medicals,
    MedicalImages,
    users,
    medicalCategories
} from "../../models/schema";

import { Request, Response } from "express";
import { db } from "../../models/db";

import { SuccessResponse } from "../../utils/response";
import { eq, inArray } from "drizzle-orm";
import { NotFound } from "../../Errors";


export const getMedicalCategories = async (req: Request, res: Response) => {
    const data = await db.select().from(categoryMedical);
    SuccessResponse(res, { categoriesMedical: data }, 200);
    }

export const createMedical = async (req: Request, res: Response) => {
  const data = req.body;
  const [insertResult] = await db.insert(Medicals).values({
    userId: data.userId,
    describtion: data.describtion,
  });

  const medicalId = insertResult.insertId;
  if (!medicalId) {
    throw new Error('Failed to create medical record');
  }

  await db.insert(medicalCategories).values(
    data.categoryIds.map(categoryId => ({
      medicalId: medicalId,
      categoryId: categoryId,
    }))
  );

  if (data.images && data.images.length > 0) {
    const imageRecords = await Promise.all(
      data.images.map(async (imagePath: string) => {
        const path = await saveBase64Image(imagePath, uuid(), req, "medicalImages");
        return {
          medicalId: medicalId,
          imagePath: path
        };
      })
    );
    
    await db.insert(MedicalImages).values(imageRecords);
  }

  const [medical] = await db
    .select()
    .from(Medicals)
    .where(eq(Medicals.id, medicalId));

  const categories = await db
    .select()
    .from(medicalCategories)
    .where(eq(medicalCategories.medicalId, medicalId));

  SuccessResponse(res, { medical: { ...medical, categories } }, 201);
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
/*export const getAllMedicals = async (req: Request, res: Response) => {
  try {
    // Get all medical records
    const medicals = await db.select({
       // Medical record fields
        medicalId: Medicals.id,
        userId: Medicals.userId,
        categoryId: Medicals.categoryId,
        describtion: Medicals.describtion,
        
        // User fields
        userEmail: users.email,
        
        // Category fields
        categoryTitle: categoryMedical.title,

    }).from(Medicals)
      .leftJoin(users, eq(Medicals.userId, users.id))
      .leftJoin(categoryMedical, eq(Medicals.categoryId, categoryMedical.id));;

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
};*/


/*export const getAllMedicals = async (req: Request, res: Response) => {
  try {
    // Get all medical records with user info
    const medicals = await db
      .select({
        id: Medicals.id,
        userId: Medicals.userId,
        describtion: Medicals.describtion,
        userEmail: users.email,
      })
      .from(Medicals)
      .leftJoin(users, eq(Medicals.userId, users.id));

     
    // Get all category associations
    const medicalCategories = await db
      .select({
        categoryId: categoryMedical.id,
        categoryTitle: categoryMedical.title,
      })
      .from(categoryMedical)
      .leftJoin(categoryMedical, eq(categoryMedical.id, categoryMedical.id));

    // Get all medical images
    const images = await db.select().from(MedicalImages);
    const imagesByMedicalId = images.reduce((acc, image:any) => {
      if (!acc[image.medicalId]) acc[image.medicalId] = [];
      acc[image.medicalId].push(image);
      return acc;
    }, {} as Record<number, typeof images>);

    // Group categories by medicalId
    const categoriesByMedicalId = medicalCategories.reduce((acc, mc: any) => {
      if (!acc[mc.medicalId]) acc[mc.medicalId] = [];
      acc[mc.medicalId].push({
        categoryId: mc.categoryId,
        categoryTitle: mc.categoryTitle,
      });
      return acc;
    }, {} as Record<number, Array<{ categoryId: number; categoryTitle: string }>>);

    // Combine everything
    const medicalsWithDetails = medicals.map(medical => ({
      id: medical.id,
      userId: medical.userId,
      userEmail: medical.userEmail,
      describtion: medical.describtion,
      categories: categoriesByMedicalId[medical.id] || [],
      images: imagesByMedicalId[medical.id] || [],
    }));

    SuccessResponse(res, { medicals: medicalsWithDetails }, 200);
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};*/



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



export const getAllMedicals = async (req: Request, res: Response) => {
  try {
    const medicals = await db
      .select({
        id: Medicals.id,
        userId: Medicals.userId,
        describtion: Medicals.describtion,
        status: Medicals.status,
        userName: users.name,
        userEmail: users.email,
      })
      .from(Medicals)
      .leftJoin(users, eq(Medicals.userId, users.id));

    // Get all medical categories associations
    const medicalCategoriesData = await db
      .select()
      .from(medicalCategories)
      .where(inArray(medicalCategories.medicalId, medicals.map(m => m.id)));

    // Get all unique category IDs from medical categories
    const uniqueCategoryIds = [...new Set(medicalCategoriesData.map(mc => mc.categoryId))];

    // Get all categories
    const categories = await db
      .select()
      .from(categoryMedical)
      .where(inArray(categoryMedical.id, uniqueCategoryIds));

    // Get all images for these medicals
    const images = await db
      .select()
      .from(MedicalImages)
      .where(inArray(MedicalImages.medicalId, medicals.map(m => m.id)));

    // Group images by medical ID
    const imagesByMedicalId = images.reduce((acc, img: any) => {
      if (!acc[img.medicalId]) acc[img.medicalId] = [];
      acc[img.medicalId].push(img);
      return acc;
    }, {});

    // Combine and process medical records
    const medicalsWithDetails = medicals.map(medical => ({
      id: medical.id,
      userId: medical.userId,
      describtion: medical.describtion,
      status: medical.status,
      userName: medical.userName,
      userEmail: medical.userEmail,
      categories: categories.filter(cat => 
        medicalCategoriesData.some(mc => 
          mc.medicalId === medical.id && mc.categoryId === cat.id
        )
      ),
      images: imagesByMedicalId[medical.id] || [],
    }));

    // Group medicals by status
    const groupedMedicals = {
      pending: medicalsWithDetails.filter(m => m.status === 'pending'),
      accepted: medicalsWithDetails.filter(m => m.status === 'accepted'),
      history: medicalsWithDetails.filter(m => m.status === 'history')
    };

    SuccessResponse(res, { medicals: groupedMedicals }, 200);
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};