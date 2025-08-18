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
import { saveFile } from "../../utils/saveFile";

import { sendEmail } from "../../utils/sendEmails";

import { Request } from "express";
import multer from "multer";




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
        userName: Medicals.fullName,
        userEmail: users.email,
        phoneNumber: Medicals.phoneNumber,
        describtion: Medicals.describtion,
        status: Medicals.status,
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
      phoneNumber: medical.phoneNumber,
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
      history: medicalsWithDetails.filter(m => m.status === 'rejected'),
    };

    SuccessResponse(res, { medicals: groupedMedicals }, 200);
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const acceptMedicalRequest = async (req: Request, res: Response) => {
   const fileData = req.file as Express.Multer.File;
  const { medicalId, price } = req.body; 
  //const fileData = req.file as Express.Multer.File;
  try {
    // Validation
    if (!medicalId || price === undefined) {
      return res.status(400).json({ error: "Medical ID and price are required" });
    }

    let documentUrl = null;
    let documentType = null;

    // Handle file if provided
    if (fileData) {
      const { url, type } = await saveFile(fileData, medicalId, req);
      documentUrl = url;
       documentType = type === 'image' || type === 'file' ? type : null;
    } else {
      return res.status(400).json({ error: "File is required" });
    }

    // Update medical record
    const result = await db.update(Medicals)
    .set({ 
    status: 'accepted',
    price,
    documentUrl,
    documentType,
    acceptedAt: new Date()
  })
  .where(eq(Medicals.id, medicalId));

// Retrieve the updated medical record
const [medical] = await db.select().from(Medicals).where(eq(Medicals.id, medicalId));

// Get user email by joining with users table
    const [user] = await db.select({ email: users.email })
      .from(users)
      .where(eq(users.id, medical.userId));

    // Send email notification if user exists and has email
    if (user?.email) {
      try {
        const emailSubject = `Your Medical Request Has Been Accepted`;
        const emailText = `
          Dear ${medical.fullName || 'User'},
          
          Your medical request has been accepted.
          
          Details:
          - Status: Accepted
          - Price: ${price}
          ${documentUrl ? `- Document: ${documentUrl}` : ''}
          
          Thank you for using our service.
        `;
        
        await sendEmail(user.email, emailSubject, emailText);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }
    }

res.json({
  success: true,
  medical
});
  } catch (error: any) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
};
  

export const rejectMedicalRequest = async (req: Request, res: Response) => {
  const { medicalId, reason } = req.body;

  try {
    // Validation
    if (!medicalId) {
      return res.status(400).json({ error: "Medical ID is required" });
    }

    // Update medical record to rejected status
    const result = await db.update(Medicals)
      .set({ status: 'rejected',  rejectionReason: reason || null })
      .where(eq(Medicals.id, medicalId));

    // Retrieve the updated medical record
    const [medical] = await db.select().from(Medicals).where(eq(Medicals.id, medicalId));

    // Get user email by joining with users table
    const [user] = await db.select({ email: users.email })
      .from(users)
      .where(eq(users.id, medical.userId));

    // Send email notification if user exists and has email
    if (user?.email) {
      try {
        const emailSubject = `Your Medical Request Has Been Rejected`;
        const emailText = `
          Dear ${medical.fullName || 'User'},
          
          Reason for rejection: ${reason || 'No reason provided'}
          
          Your medical request has been rejected.
          
          Thank you for using our service.
        `;
        
        await sendEmail(user.email, emailSubject, emailText);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }
    }

    SuccessResponse(res, { message: "Medical request rejected successfully", medical }, 200);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
